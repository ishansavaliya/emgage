import { useState, useEffect } from 'react';

const usePlayback = (initialSpeed = 1) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(initialSpeed);
    const [currentTime, setCurrentTime] = useState(0);
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        let interval;

        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime(prevTime => prevTime + playbackSpeed);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isPlaying, playbackSpeed]);

    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);
    const stop = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };
    const fastForward = () => setPlaybackSpeed(prevSpeed => Math.min(prevSpeed * 2, 100));
    const rewind = () => setPlaybackSpeed(prevSpeed => Math.max(prevSpeed / 2, 1));

    return {
        isPlaying,
        currentTime,
        playbackSpeed,
        play,
        pause,
        stop,
        fastForward,
        rewind,
        setHistoryData,
        historyData,
    };
};

export default usePlayback;