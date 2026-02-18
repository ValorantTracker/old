import React from 'react';
import { formatDate } from '../utils/dateUtils';
import { Calculator, Hash, Clock } from 'lucide-react';

export default function Stats({ tracks, averageDate, totalCount }) {
    if (!tracks || tracks.length === 0) return null;

    const totalTracks = totalCount || tracks.length;
    const avgYear = averageDate ? averageDate.getFullYear() : 'N/A';

    // Find oldest year for context
    const oldestTrack = tracks[0].track; // Assumes sorted
    const oldestYear = oldestTrack.album.release_date.substring(0, 4);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mx-auto mb-12">
            <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:border-green-500/50 transition-colors">
                <div className="p-3 bg-green-500/10 rounded-full text-green-500">
                    <Calculator size={24} />
                </div>
                <h3 className="text-neutral-400 text-sm font-medium">Average Release Year</h3>
                <p className="text-3xl font-bold text-white">{avgYear}</p>
            </div>

            <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:border-green-500/50 transition-colors">
                <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
                    <Hash size={24} />
                </div>
                <h3 className="text-neutral-400 text-sm font-medium">Total Songs Analyzed</h3>
                <p className="text-3xl font-bold text-white">{totalTracks}</p>
            </div>

            <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:border-green-500/50 transition-colors">
                <div className="p-3 bg-purple-500/10 rounded-full text-purple-500">
                    <Clock size={24} />
                </div>
                <h3 className="text-neutral-400 text-sm font-medium">Time Span</h3>
                <p className="text-xl font-bold text-white text-center">
                    {oldestYear} - {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
