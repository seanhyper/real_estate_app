from app import app  # Importing the Flask app from your api.py file

if __name__ == "__main__":
    # Running the Flask development server
    app.run(debug=True, host="0.0.0.0", port=5000)
