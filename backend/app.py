from http.client import HTTPException

from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sqlite3

from openai import BaseModel
from werkzeug.security import check_password_hash, generate_password_hash

from backend.agents.decision_engine import run_simulation, run_dutch_auction
from backend.agents.llm_gpt import setup_agents
from backend.business_logic import calculate_best_response

app = Flask(__name__)
app.secret_key = 'supersecretkey'
CORS(app)  # Enable CORS for all routes

users_db = {}
# Agent storage (in-memory for now)
agents = {}


# Database connection
def get_db_connection():
    connection = sqlite3.connect('real_estate.db')
    connection.row_factory = sqlite3.Row
    return connection


# In-memory database for users
users_db = {}


@app.route('/register', methods = ['POST'])
def register_agent():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if username in users_db:
        return jsonify({"message": "Username already exists"}), 409

    # Hash the password before storing it
    hashed_password = generate_password_hash(password)

    # Store the user with hashed password in users_db
    users_db[username] = hashed_password

    return jsonify({"message": "Agent registered successfully"}), 201


@app.route('/login', methods = ['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Check if user exists
    if username in users_db:
        stored_hash = users_db[username]

        # Check if the provided password matches the stored hash
        if check_password_hash(stored_hash, password):
            session['user_id'] = username  # Log the user in by storing their username in the session
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"message": "Invalid username or password"}), 401
    else:
        return jsonify({"message": "Invalid username or password"}), 401


@app.route('/logout', methods = ['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200


# Example protected route (only accessible to logged-in users)
@app.route('/projects', methods = ['POST', 'GET'])
def manage_projects():
    if 'user_id' not in session:
        return jsonify({"message": "Unauthorized"}), 401  # Unauthorized access

    if request.method == 'POST':
        data = request.json
        project_name = data.get('project_name')

        # Store the project for the user (for now, just returning it as a success message)
        return jsonify({"message": f"Project '{project_name}' added successfully for {session['user_id']}."}), 201

    if request.method == 'GET':
        return jsonify({"message": f"Returning projects for {session['user_id']}."}), 200


@app.route('/calculateBestOption', methods = ['POST'])
def calculate_best_option():
    data = request.json

    # Extract data from request
    current_offer = data.get('currentOffer')
    threshold = data.get('threshold')
    highest_team_offer = data.get('highestTeamOffer')
    offer_distribution = data.get('offerDistribution', {})
    cost_per_inquiry = data.get('costPerInquiry')
    at_or_bt = data.get('atOrBt', 'AT')  # Default to AT
    distribution_type = data.get('distributionType', 'uniform')  # Default to uniform

    # Determine whether to use AT or BT logic
    is_at = at_or_bt == 'AT'

    # Calculate the best option based on the provided data
    recommendation, offers = calculate_best_response(
        current_offer = current_offer,
        threshold = threshold,
        highest_team_offer = highest_team_offer,
        offer_distribution = offer_distribution,
        cost_per_inquiry = cost_per_inquiry,
        distribution_type = distribution_type,  # Pass the distribution type
        at_or_bt = is_at  # Pass AT or BT criteria
    )

    # Return recommendation along with the generated offers for charting
    return jsonify({"recommendation": recommendation, "offers": offers}), 200


@app.route('/start_simulation', methods = ['POST'])
def start_simulation():
    data = request.json

    # Extract simulation parameters
    num_agents = int(data.get('num_agents', 3))
    # Generate agent data
    agents = [
        {
            'id': i + 1,
            'strategy': 'random',
            'threshold': int(data.get('threshold')),
            'cost_per_inquiry': int(data.get('cost_per_inquiry')),
            'at_or_bt': data.get("at_or_bt", "AT"),
            'distribution_type': data.get("distribution_type", "uniform"),
        } for i in range(num_agents)
    ]

    simulation_data = {
        'agents': agents,
        'rounds': int(data.get("rounds", 5)),
        'min': int(data.get("minValue")),
        'max': int(data.get("maxValue")),
    }

    # Run the simulation
    result = run_simulation(simulation_data)

    return jsonify(result), 200


class AuctionParameters(BaseModel):
    initial_price: float
    price_drop_percentage: float
    num_weeks: int
    num_buyers: int


@app.route("/run-auction/", methods = ["POST"])
def process_auction():
    data = request.get_json()
    agents = setup_agents(int(data["numOfBuyers"]))
    result = run_dutch_auction(
        initial_price = float(data["initialPrice"]),
        price_drop_percentage = float(data["priceDropPercentage"]),
        num_weeks = int(data["numWeeks"]),
        agents = agents
    )
    return jsonify(result)
