import torch
from custom_llm import CustomFreightLLM
import json
import os

device = 'cuda' if torch.cuda.is_available() else 'cpu'

class LocalFreightLLM:
    def __init__(self, model_path='custom_freight_llm.pth', vocab_path='vocab_mapping.json'):
        self.device = device
        
        # Load vocab mapping
        if not os.path.exists(vocab_path):
            raise FileNotFoundError(f"Vocabulary file {vocab_path} not found. Please train the model first.")
            
        with open(vocab_path, 'r') as f:
            mapping = json.load(f)
            self.stoi = mapping['stoi']
            self.itos = {int(k): v for k, v in mapping['itos'].items()}
            
        self.vocab_size = len(self.stoi)
        
        # Initialize model
        self.model = CustomFreightLLM(vocab_sz=self.vocab_size)
        
        # Load weights
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file {model_path} not found. Please train the model first.")
            
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.to(self.device)
        self.model.eval()

    def encode(self, s):
        # Fallback to a default character if not in vocab (for simplicity)
        default_char_idx = self.stoi.get(' ', 0)
        return [self.stoi.get(c, default_char_idx) for c in s]

    def decode(self, l):
        return ''.join([self.itos.get(i, '') for i in l])

    def generate_explanation(self, structured_evidence: dict, max_new_tokens=200):
        """
        Takes the JSON-like evidence object from the deterministic engines
        and generates an explanation.
        """
        # Convert the structured evidence into a prompt string
        prompt = f"Evidence:\n{json.dumps(structured_evidence, indent=2)}\n\nExplanation:\n"
        
        # Encode the prompt
        context = torch.tensor((self.encode(prompt)), dtype=torch.long, device=self.device).unsqueeze(0)
        
        # Generate text
        with torch.no_grad():
            output_indices = self.model.generate(context, max_new_tokens=max_new_tokens)[0].tolist()
            
        # Decode and return just the generated part
        generated_text = self.decode(output_indices)
        
        # Extract the explanation part (everything after "Explanation:\n")
        try:
            explanation = generated_text.split("Explanation:\n")[1]
        except IndexError:
            explanation = generated_text
            
        return explanation

# Example usage
if __name__ == "__main__":
    try:
        llm = LocalFreightLLM()
        mock_evidence = {
            "forecast": {
                "route": "Australia -> Paradip",
                "point_estimate": 32.50
            },
            "drivers": ["high congestion", "bunker price increase"]
        }
        print("Generating explanation...")
        exp = llm.generate_explanation(mock_evidence, max_new_tokens=50)
        print("Generated:")
        print(exp)
    except FileNotFoundError as e:
        print(e)
        print("Run train_llm.py first.")
