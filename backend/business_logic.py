import numpy as np
from scipy.stats import uniform


def calculate_best_response(current_offer, threshold, highest_team_offer, offer_distribution, cost_per_inquiry,
                            reservation_value, AT=True):
    """
    Calculate the best strategy for the seller based on reservation value, team contributions, and AT/BT criteria.

    Parameters:
        current_offer: The current best offer received by the seller.
        threshold: The threshold value for deciding participation in the information-sharing process (ISP).
        highest_team_offer: The highest offer found by other team members.
        offer_distribution: A dictionary containing min and max values for potential future offers.
        cost_per_inquiry: The cost incurred by reaching out to new buyers.
        reservation_value: The reservation value used by the seller to decide whether to stop or continue.
        AT: Boolean indicating whether Above Threshold (AT) or Below Threshold (BT) logic is used.
    """
    # Unpack offer distribution data
    min_offer = offer_distribution['min']
    max_offer = offer_distribution['max']

    # Define a uniform probability distribution (could be customized further)
    offer_dist = uniform(loc = min_offer, scale = (max_offer - min_offer))

    # Simulate 1000 future offers
    future_offers = offer_dist.rvs(1000)

    # Calculate expected benefit of continuing to search
    expected_benefit = np.mean([max(offer, highest_team_offer) for offer in future_offers])

    # Calculate the net gain of continuing
    net_gain = expected_benefit - current_offer - cost_per_inquiry

    # Decision Logic
    if AT:
        # Apply Above Threshold (AT) criteria: Continue if net gain > 0 and current offer is less than threshold
        if net_gain > 0 and current_offer < threshold:
            return "Continue searching for better offers."
        else:
            return "Stop and accept the current offer."
    else:
        # Apply Below Threshold (BT) criteria: Stop contributing but benefit from others' findings
        if current_offer >= reservation_value:
            return "Stop and accept the current offer."
        else:
            return "Contribute to team findings (BT criteria)."

