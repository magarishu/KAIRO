"use client";

import React, { useEffect } from 'react';
import { useTradeStore, Position } from '../../store/useTradeStore';

// 1. MEMOIZED ROW: This component handles the high-frequency updates.
const PositionRow = React.memo(({ position }: { position: Position }) => {
  const pnlColor = position.unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
      <td className="px-4 py-3 font-mono text-sm">{position.accountNumber}</td>
      <td className="px-4 py-3 font-bold">{position.symbol}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
          position.side === 'LONG' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
        }`}>
          {position.side}
        </span>
      </td>
      <td className="px-4 py-3 font-mono">{position.size}</td>
      <td className="px-4 py-3 font-mono">${position.entryPrice.toFixed(5)}</td>
      <td className="px-4 py-3 font-mono">${position.currentPrice.toFixed(5)}</td>
      <td className={`px-4 py-3 font-mono font-bold ${pnlColor}`}>
        ${position.unrealizedPnL.toFixed(2)}
      </td>
    </tr>
  );
});

PositionRow.displayName = 'PositionRow';

// 2. MASTER TABLE COMPONENT
export function LivePositionsTable() {
  const { initializeSocket, disconnectSocket, isConnected } = useTradeStore();
  
  // Select the exact positions object to maintain reference equality. 
  // Then convert it to an array.
  const positions = useTradeStore((state) => state.positions);
  const positionsArray = React.useMemo(() => Object.values(positions), [positions]);

  useEffect(() => {
    // In production, grab your authenticated session token
    initializeSocket('mock-user-session-token'); 
    return () => disconnectSocket();
  }, [initializeSocket, disconnectSocket]);

  return (
    <div className="bg-black text-white p-6 rounded-lg border border-gray-800 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold tracking-tight">Active Cloud Positions</h2>
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-400 font-mono">
            {isConnected ? 'LIVE ENGINE CONNECTED' : 'STREAM DISCONNECTED'}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider bg-gray-950">
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Symbol</th>
              <th className="px-4 py-3">Side</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Entry</th>
              <th className="px-4 py-3">Current</th>
              <th className="px-4 py-3">Unrealized PnL</th>
            </tr>
          </thead>
          <tbody>
            {positionsArray.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500 text-sm">
                  No active trades currently copying.
                </td>
              </tr>
            ) : (
              positionsArray.map((position) => (
                <PositionRow key={position.id} position={position} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LivePositionsTable;
