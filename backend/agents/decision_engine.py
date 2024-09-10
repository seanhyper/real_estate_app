import numpy as np

from backend.business_logic import calculate_best_response

MIN = 500000
MAX = 1700000


def run_simulation(data):
    agents = []
    results = []
    offer_distribution = {"min": data.get("min", MIN), "max": data.get("max", MAX)}
    highest_offers = {}  # Dictionary to keep track of the highest offer per agent

    # Initialize agents with given parameters
    for agent_data in data['agents']:
        agent_id = agent_data['id']
        agents.append({
            "id": agent_id,
            "threshold": agent_data['threshold'],
            "cost_per_inquiry": agent_data['cost_per_inquiry'],
            "distribution_type": agent_data['distribution_type'],
            "at_or_bt": agent_data['at_or_bt'],
            "settled": False,
            "settling_round": None
        })
        highest_offers[agent_id] = 0  # Initialize highest offer for each agent

    # Simulation loop
    for round in range(data['rounds']):
        round_result = {"round": round, "actions": []}
        highest_team_offer = max([agent['threshold'] for agent in agents])

        for agent in agents:
            agent_id = agent['id']
            if agent['settled']:
                continue

            current_offer = np.random.randint(offer_distribution.get("min"), offer_distribution.get("max"))
            decision, offers = calculate_best_response(
                current_offer = current_offer,
                threshold = agent['threshold'],
                highest_team_offer = highest_team_offer,
                offer_distribution = offer_distribution,
                cost_per_inquiry = agent['cost_per_inquiry'],
                distribution_type = agent['distribution_type'],
                at_or_bt = agent['at_or_bt'],
            )

            # Update the highest offer for the agent if the current offer is greater
            if current_offer > highest_offers[agent_id]:
                highest_offers[agent_id] = current_offer

            action = {
                "agent_id": agent_id,
                "decision": decision,
                "current_offer": current_offer,
                "offers": offers[:10]
            }
            round_result["actions"].append(action)

            if "Stop" in decision:
                agent['settled'] = True
                agent['settling_round'] = round

        results.append(round_result)

        if all(agent['settled'] for agent in agents):
            break

    return {
        "simulation_results": results,
        "settling_rounds": {agent['id']: agent['settling_round'] for agent in agents},
        "highest_offers": highest_offers  # Include the highest offers in the simulation return data
    }


def run_dutch_auction(initial_price, price_drop_percentage, num_weeks, agents):
    current_price = initial_price
    for week in range(num_weeks):
        for agent in agents:
            if agent.accepts_offer(current_price, initial_price):
                return {"final_price": current_price, "week_sold": week + 1, "agent_id": agent.agent_id}
        current_price *= (1 - price_drop_percentage / 100)

    return {"final_price": current_price, "week_sold": num_weeks, "agent_id": None}

