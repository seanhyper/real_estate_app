# Real Estate Project - Best Offer Decision System

This project is a web application that helps real estate teams determine the best strategy for accepting or rejecting offers based on current data. It uses a Flask backend and a React frontend with Material-UI for the UI.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
  - [Running Backend](#running-backend)
  - [Running Frontend](#running-frontend)
- [Example API Request](#example-api-request)
- [Folder Structure](#folder-structure)

---

## Features

- Accepts project data such as offers, thresholds, and team offers.
- Calculates the best decision for real estate sellers: whether to stop or continue searching for better offers.
- Uses Flask for the backend and React for the frontend.
- Visualizes seller data using a bar chart for easy understanding of current offers.

## Technologies

- **Backend**: Flask, NumPy, CORS
- **Frontend**: React, Material-UI, Recharts
- **Communication**: REST API
- **Deployment**: Node.js, Python

---

## Setup Instructions

### Backend Setup

1. **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd real_estate_app/backend
    ```

2. **Set up a virtual environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. **Install backend dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Run the backend server**:
    ```bash
    python run.py
    ```

    The Flask backend will start running on `http://localhost:5000`.

### Frontend Setup

1. **Navigate to the frontend directory**:
    ```bash
    cd ../frontend
    ```

2. **Install frontend dependencies**:
    ```bash
    npm install
    ```

3. **Start the frontend development server**:
    ```bash
    npm start
    ```

    The React frontend will start running on `http://localhost:3000`.

---

## Running the Application

### Running Backend
1. From the `backend/` directory:
    ```bash
    python run.py
    ```
2. The Flask server will start on `http://localhost:5000`.

### Running Frontend
1. From the `frontend/` directory:
    ```bash
    npm start
    ```
2. The React frontend will run on `http://localhost:3000`.

---

## Example API Request

The following is an example of the `POST` request sent to `/calculateBestOption` on the Flask backend.

```json
{
    "currentOffer": 1200000,
    "threshold": 1300000,
    "highestTeamOffer": 1100000,
    "offerDistribution": {
        "min": 900000,
        "max": 1300000
    },
    "costPerInquiry": 10000
}
