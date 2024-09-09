import os
import random

import openai

from dotenv import load_dotenv

load_dotenv()
# Retrieve the API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

if openai.api_key is None:
    raise ValueError("OpenAI API key not found. Please check your .env file.")

client = openai.OpenAI()


class BuyerAgent:
    def __init__(self, agent_id):
        self.agent_id = agent_id
        self.risk_tolerance = random.choice(['low', 'medium', 'high'])

    def get_decision_prompt(self, current_price, initial_price):
        # Adding a random element to simulate changing market conditions or agent mood
        prompt = (
            f"based on dutch auction strategy. Agent {self.agent_id} with a {self.risk_tolerance} risk tolerance is considering a property initially listed at {initial_price} "
            f"The current offer is {current_price}. "
            f"should the agent accept the offer now, or wait for a possible further decrease in price? a clear 'yes' or 'no'."
        )

        return prompt

    def accepts_offer(self, price, initial):
        # Call to OpenAI's API to generate a decision based on the current price
        prompt = self.get_decision_prompt(price, initial)
        response = openai.chat.completions.create(
            model = "gpt-3.5-turbo-16k",
            messages = [
                {"role": "system", "content": "You are an intelligent agent making decisions based on offers."},
                {"role": "user", "content": prompt}
            ],
            max_tokens = 20
        )
        decision = response.choices[0].message.content.strip()
        print(f"Agent {self.agent_id} decision: {decision}")  # Logging for debugging
        # Interpret the response text to decide
        return "yes" in decision.lower()


def setup_agents(num_buyers):
    return [BuyerAgent(agent_id = i) for i in range(num_buyers)]
