import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

// Define the shape of a Trade/Position object
export interface Position {
  id: string;
  accountNumber: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
}

// Define the Zustand store structure
interface TradeState {
  positions: Record<string, Position>; // Keyed by position ID for O(1) lookup speed
  isConnected: boolean;
  socket: Socket | null;
  initializeSocket: (authToken: string) => void;
  disconnectSocket: () => void;
}

export const useTradeStore = create<TradeState>((set, get) => ({
  positions: {},
  isConnected: false,
  socket: null,

  initializeSocket: (authToken: string) => {
    // Prevent duplicate sockets if already initialized
    if (get().socket) return;

    // Connect to your Go/Node.js backend streaming endpoint
    const socket = io('https://api.yourtradecopier.com/trades', {
      auth: { token: authToken },
      transports: ['websocket'], // Force WebSocket, disable HTTP polling for speed
    });

    socket.on('connect', () => {
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    // Handle initial position snapshots when loading the dashboard
    socket.on('positions:snapshot', (initialPositions: Position[]) => {
      const positionMap: Record<string, Position> = {};
      initialPositions.forEach((pos) => {
        positionMap[pos.id] = pos;
      });
      set({ positions: positionMap });
    });

    // Real-Time Update Event: Triggered when a price ticks or size changes
    socket.on('position:update', (updatedPosition: Position) => {
      set((state) => ({
        positions: {
          ...state.positions,
          [updatedPosition.id]: updatedPosition, // Instantly merge/overwrite specific position row
        },
      }));
    });

    // Real-Time Remove Event: Triggered when a position is flattened/closed
    socket.on('position:closed', (positionId: string) => {
      set((state) => {
        const newPositions = { ...state.positions };
        delete newPositions[positionId]; // Drop from memory map
        return { positions: newPositions };
      });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false, positions: {} });
    }
  },
}));
