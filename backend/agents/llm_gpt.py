import os
import openai

from dotenv import load_dotenv

load_dotenv()
# Retrieve the API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

if openai.api_key is None:
    raise ValueError("OpenAI API key not found. Please check your .env file.")

client = openai.OpenAI()


class Agent:
    def __init__(self, agent_id, strategy):
        self.agent_id = agent_id
        self.strategy = strategy

    def make_decision(self, current_offer, threshold, cost_per_inquiry):
        # Generate reasoning using LLM
        reasoning = self.get_reasoning(current_offer, threshold)

        # Apply logic for search or settle
        if current_offer < threshold - cost_per_inquiry:
            return f"Agent {self.agent_id} is searching: {reasoning}"
        else:
            return f"Agent {self.agent_id} is settling: {reasoning}"

    def get_reasoning(self, current_offer, threshold):
        # Use GPT-4 to generate reasoning for the decision
        prompt = f"Agent {self.agent_id} is evaluating an offer of {current_offer} with a threshold of {threshold}. What should they do?"
        response = openai.chat.completions.create(
            model = "gpt-4",
            messages = [
                {"role": "system", "content": "You are an intelligent agent making decisions based on offers."},
                {"role": "user", "content": prompt}
            ],
            max_tokens = 100
        )
        return response.choices[0].message.content.strip()

