import React from 'react';
import { useLocationData } from '../hooks/useLocationData';
import { HistoryPopup } from '../components/History/HistoryPopup';
import { TimelinePlayer } from '../components/History/TimelinePlayer';
import { Layout } from '../components/common/Layout';

const HistoryPage: React.FC = () => {
    const { locationHistory, isLoading } = useLocationData();

    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Employee Location History</h1>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div>
                        {locationHistory.map((historyItem) => (
                            <HistoryPopup key={historyItem.id} historyItem={historyItem} />
                        ))}
                        <TimelinePlayer history={locationHistory} />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default HistoryPage;