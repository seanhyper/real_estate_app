from flask import Flask, request, jsonify
from flask_cors import CORS

from backend.business_logic import calculate_best_response

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/addProjectData', methods=['POST'])
def add_project_data():
    data = request.json
    return jsonify({"message": "Project data added successfully"}), 201

@app.route('/calculateBestOption', methods=['POST'])
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
        current_offer=current_offer,
        threshold=threshold,
        highest_team_offer=highest_team_offer,
        offer_distribution=offer_distribution,
        cost_per_inquiry=cost_per_inquiry,
        distribution_type=distribution_type,  # Pass the distribution type
        at_or_bt=is_at  # Pass AT or BT criteria
    )

    # Return recommendation along with the generated offers for charting
    return jsonify({"recommendation": recommendation, "offers": offers}), 200
