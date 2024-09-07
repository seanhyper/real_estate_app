import numpy as np


def calculate_best_response(current_offer, threshold, highest_team_offer, offer_distribution, cost_per_inquiry):
    """
    Calculate the best strategy for the seller based on current data.
    """
    # Unpack offer distribution data
    min_offer = offer_distribution['min']
    max_offer = offer_distribution['max']

    # Define probability distribution (for simplicity, uniform distribution)
    offers = np.random.uniform(min_offer, max_offer, 1000)

    # Calculate expected benefit of continuing to search
    expected_benefit = np.mean([max(offer, highest_team_offer) for offer in offers])

    # Calculate the net gain of continuing
    net_gain = expected_benefit - current_offer - cost_per_inquiry

    # Make a decision based on the calculated net gain
    if net_gain > 0 and current_offer < threshold:
        return "Continue searching for better offers."
    else:
        return "Stop and accept the current offer."
