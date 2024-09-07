from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from backend.business_logic import calculate_best_response

app = Flask(__name__)
app.secret_key = 'supersecretkey'
CORS(app)  # Enable CORS for all routes

users_db = {}


# Database connection
def get_db_connection():
    connection = sqlite3.connect('real_estate.db')
    connection.row_factory = sqlite3.Row
    return connection


@app.route('/addProjectData', methods = ['POST'])
def add_project_data():
    data = request.json
    return jsonify({"message": "Project data added successfully"}), 201


@app.route('/register', methods = ['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Validate input
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    if username in users_db:
        return jsonify({"message": "Username already taken"}), 409

    # Use 'pbkdf2:sha256' as the hashing method
    hashed_password = generate_password_hash(password, method = 'pbkdf2:sha256')

    # Save user to in-memory store
    users_db[username] = hashed_password
    return jsonify({"message": "Registration successful"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Simple user authentication check
    if username in users_db:
        stored_hash = users_db[username]

        # Compare the entered password with the stored hashed password
        if check_password_hash(stored_hash, password):
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"message": "Invalid username or password"}), 401
    else:
        return jsonify({"message": "Invalid username or password"}), 401


# Adding a project for the user
@app.route('/projects', methods = ['POST'])
def add_project():
    if 'user_id' not in session:
        return jsonify({"message": "Unauthorized"}), 401

    data = request.json
    project_name = data.get('project_name')

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute('INSERT INTO projects (user_id, project_name) VALUES (?, ?)', (session['user_id'], project_name))
    connection.commit()
    connection.close()

    return jsonify({"message": "Project added successfully"}), 201


# Fetch all projects for the logged-in user
@app.route('/projects', methods = ['GET'])
def get_projects():
    if 'user_id' not in session:
        return jsonify({"message": "Unauthorized"}), 401

    connection = get_db_connection()
    cursor = connection.cursor()

    projects = cursor.execute('SELECT * FROM projects WHERE user_id = ?', (session['user_id'],)).fetchall()
    connection.close()

    return jsonify([dict(project) for project in projects]), 200


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
