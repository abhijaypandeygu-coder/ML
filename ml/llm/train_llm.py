import torch
import torch.nn as nn
from torch.nn import functional as F
from custom_llm import CustomFreightLLM
import json
import os

# Hyperparameters for training
batch_size = 16
block_size = 256
max_iters = 1000
eval_interval = 100
learning_rate = 1e-3
device = 'cuda' if torch.cuda.is_available() else 'cpu'
eval_iters = 50

# --- 1. Load Custom Freight Dataset ---
# In a real scenario, this would be a large corpus of maritime reports,
# freight analysis, and structured evidence JSONs.
# For demonstration, we use a simple toy text block about freight.
text = """
Freight rate refers to the price charged by a carrier for transporting goods from one place to another.
The Baltic Dry Index (BDI) is a shipping and trade index created by the London-based Baltic Exchange.
It measures changes in the cost of transporting various raw materials, such as coal and steel.
When port congestion increases, waiting times rise, which can lead to higher freight rates due to restricted vessel supply.
Higher bunker fuel prices generally increase the total voyage cost, leading to higher baseline freight rates.
Chartering a Capesize vessel requires considering draft restrictions at the origin and destination ports.
Risk-adjusted optimization minimizes the expected total cost while accounting for downside scenarios such as extreme weather or geopolitical shocks.
""" * 100 # Repeat to ensure enough data for block_size

# Get all unique characters that occur in this text
chars = sorted(list(set(text)))
vocab_size = len(chars)

# Create a mapping from characters to integers
stoi = { ch:i for i,ch in enumerate(chars) }
itos = { i:ch for i,ch in enumerate(chars) }
encode = lambda s: [stoi[c] for c in s] # encoder: take a string, output a list of integers
decode = lambda l: ''.join([itos[i] for i in l]) # decoder: take a list of integers, output a string

# Encode the entire text dataset and store it into a torch.Tensor
data = torch.tensor(encode(text), dtype=torch.long)
n = int(0.9*len(data)) # first 90% will be train, rest val
train_data = data[:n]
val_data = data[n:]

def get_batch(split):
    # generate a small batch of data of inputs x and targets y
    data_split = train_data if split == 'train' else val_data
    ix = torch.randint(len(data_split) - block_size, (batch_size,))
    x = torch.stack([data_split[i:i+block_size] for i in ix])
    y = torch.stack([data_split[i+1:i+block_size+1] for i in ix])
    x, y = x.to(device), y.to(device)
    return x, y

@torch.no_grad()
def estimate_loss(model):
    out = {}
    model.eval()
    for split in ['train', 'val']:
        losses = torch.zeros(eval_iters)
        for k in range(eval_iters):
            X, Y = get_batch(split)
            logits, loss = model(X, Y)
            losses[k] = loss.item()
        out[split] = losses.mean()
    model.train()
    return out

def train():
    print(f"Training on device: {device}")
    model = CustomFreightLLM(vocab_sz=vocab_size)
    model = model.to(device)
    
    # print the number of parameters in the model
    print(sum(p.numel() for p in model.parameters())/1e6, 'M parameters')

    # create a PyTorch optimizer
    optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate)

    for iter in range(max_iters):

        # every once in a while evaluate the loss on train and val sets
        if iter % eval_interval == 0 or iter == max_iters - 1:
            losses = estimate_loss(model)
            print(f"step {iter}: train loss {losses['train']:.4f}, val loss {losses['val']:.4f}")

        # sample a batch of data
        xb, yb = get_batch('train')

        # evaluate the loss
        logits, loss = model(xb, yb)
        optimizer.zero_grad(set_to_none=True)
        loss.backward()
        optimizer.step()

    # Save the model
    torch.save(model.state_dict(), 'custom_freight_llm.pth')
    
    # Save the character mapping so inference can decode it
    with open('vocab_mapping.json', 'w') as f:
        json.dump({'stoi': stoi, 'itos': itos}, f)
        
    print("Training complete. Model saved to custom_freight_llm.pth")

if __name__ == "__main__":
    train()
