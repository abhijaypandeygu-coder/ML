import { useState, useEffect } from 'react';

export interface LivePortData {
  id: string;
  name: string;
  avgWaitDays: number;
  congestionLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  trend: 'up' | 'down';
}

export function useLivePorts() {
  const [livePorts, setLivePorts] = useState<LivePortData[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Determine WebSocket URL based on current host (fallback to localhost:8000 for local dev)
    const wsUrl = 'ws://localhost:8000/api/v1/live/ws/ports';
    
    let ws: WebSocket;
    let reconnectTimer: number;

    const connect = () => {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        console.log('Connected to Live Maritime Data Stream');
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'PORT_UPDATE') {
            setLivePorts(payload.data);
          }
        } catch (e) {
          console.error('Error parsing live port data', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('Live Data Stream disconnected. Reconnecting...');
        // Attempt to reconnect after 3 seconds
        reconnectTimer = window.setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error('WebSocket Error:', err);
        ws.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return { livePorts, isConnected };
}
