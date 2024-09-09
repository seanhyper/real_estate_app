import numpy as np


def calculate_best_response(current_offer, threshold, highest_team_offer, offer_distribution, cost_per_inquiry, distribution_type, at_or_bt):
    """
    Calculate the best strategy for the seller based on current data.
    """
    min_offer = offer_distribution.get('min')
    max_offer = offer_distribution.get('max')

    # Generate offers based on the selected distribution type
    if distribution_type == 'uniform':
        offers = np.random.uniform(min_offer, max_offer, 1000)
    elif distribution_type == 'normal':
        mean = (min_offer + max_offer) / 2
        stddev = (max_offer - min_offer) / 4  # Approximate stddev
        offers = np.random.normal(mean, stddev, 1000)
        offers = np.clip(offers, min_offer, max_offer)  # Ensure values stay within bounds
    elif distribution_type == 'exponential':
        scale = (max_offer - min_offer) / 2  # Approximate scale
        offers = np.random.exponential(scale, 1000) + min_offer
        offers = np.clip(offers, min_offer, max_offer)  # Ensure values stay within bounds
    else:
        return "Invalid distribution type", []

    # Calculate expected benefit of continuing to search
    expected_benefit = np.mean([max(offer, highest_team_offer) for offer in offers])

    # Calculate the net gain of continuing based on AT or BT criteria
    if at_or_bt:  # AT criteria logic
        net_gain = expected_benefit - current_offer - cost_per_inquiry
        if net_gain > 0:
            if current_offer < threshold:
                decision = "Stop. didnt find any offer the exceeds the threshold"
            else:
                decision = "Stop and accept the current offer."
        else:
            decision = "Continue searching for better offers."

    else:  # BT criteria logic
        net_gain = current_offer - expected_benefit - cost_per_inquiry
        if net_gain > 0:
            if current_offer > threshold:
                decision = "Stop. didnt find any offer the exceeds the threshold"
            else:
                decision = "Stop and accept the current offer."
        else:
            decision = "Continue searching for better offers."
    return decision, offers.tolist()