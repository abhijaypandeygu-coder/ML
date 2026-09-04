import asyncio
import json
import random
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter(prefix="/live", tags=["live"])

# List of target ports to simulate
SIMULATED_PORTS = [
    {"id": "port-paradip", "name": "Paradip", "baseWait": 3.2},
    {"id": "port-vizag", "name": "Visakhapatnam", "baseWait": 2.1},
    {"id": "port-haldia", "name": "Haldia", "baseWait": 6.8},
    {"id": "port-hay-point", "name": "Hay Point", "baseWait": 2.1},
]

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                # Handle disconnected clients
                pass

manager = ConnectionManager()

def generate_simulated_port_state():
    updates = []
    for port in SIMULATED_PORTS:
        # Simulate a random walk for wait days
        fluctuation = random.uniform(-0.5, 0.8)
        new_wait = max(0.5, round(port["baseWait"] + fluctuation, 1))
        
        # Determine congestion level based on new wait time
        if new_wait > 5.0:
            congestion = "HIGH"
        elif new_wait > 2.5:
            congestion = "MEDIUM"
        else:
            congestion = "LOW"
            
        updates.append({
            "id": port["id"],
            "name": port["name"],
            "avgWaitDays": new_wait,
            "congestionLevel": congestion,
            "trend": "up" if fluctuation > 0 else "down"
        })
    return updates

@router.websocket("/ws/ports")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Generate new mock data
            data = generate_simulated_port_state()
            
            # Send to the connected client
            await websocket.send_json({"type": "PORT_UPDATE", "data": data})
            
            # Wait 3 seconds before next update
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
