from flask import Flask, request, jsonify
from business_logic import calculate_best_response

app = Flask(__name__)


@app.route('/addProjectData', methods = ['POST'])
def add_project_data():
    data = request.json
    # Logic to add data to the database (using SQLAlchemy or another ORM)
    # For now, simulate adding data
    return jsonify({"message": "Project data added successfully"}), 201


@app.route('/calculateBestOption', methods = ['POST'])
def calculate_best_option():
    data = request.json
    result = calculate_best_response(
        data['currentOffer'], data['threshold'], data['highestTeamOffer'],
        data['offerDistribution'], data['costPerInquiry']
    )
    return jsonify({"recommendation": result}), 200


if __name__ == '__main__':
    app.run(debug = True)
