import React from 'react';

interface PlaybackControlsProps {
    onPlay: () => void;
    onPause: () => void;
    onFastForward: () => void;
    onRewind: () => void;
    playbackSpeed: number;
    setPlaybackSpeed: (speed: number) => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
    onPlay,
    onPause,
    onFastForward,
    onRewind,
    playbackSpeed,
    setPlaybackSpeed,
}) => {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-100 rounded shadow">
            <button onClick={onPlay} className="bg-green-500 text-white px-4 py-2 rounded">
                Play
            </button>
            <button onClick={onPause} className="bg-red-500 text-white px-4 py-2 rounded">
                Pause
            </button>
            <button onClick={onFastForward} className="bg-blue-500 text-white px-4 py-2 rounded">
                Fast Forward
            </button>
            <button onClick={onRewind} className="bg-yellow-500 text-white px-4 py-2 rounded">
                Rewind
            </button>
            <input
                type="range"
                min="1"
                max="100"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="mx-4"
            />
            <span>Speed: {playbackSpeed}x</span>
        </div>
    );
};

export default PlaybackControls;