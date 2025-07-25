import React from 'react';

const RefreshControls: React.FC<{ onRefresh: () => void; isAutoRefreshing: boolean; onToggleAutoRefresh: () => void; }> = ({ onRefresh, isAutoRefreshing, onToggleAutoRefresh }) => {
    return (
        <div className="flex space-x-4">
            <button 
                onClick={onRefresh} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
                Refresh
            </button>
            <button 
                onClick={onToggleAutoRefresh} 
                className={`px-4 py-2 rounded transition ${isAutoRefreshing ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
            >
                {isAutoRefreshing ? 'Stop Auto Refresh' : 'Start Auto Refresh'}
            </button>
        </div>
    );
};

export default RefreshControls;