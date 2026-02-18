import React from 'react';
import { formatDate } from '../utils/dateUtils';
import { Music, Calendar } from 'lucide-react';

export default function Leaderboard({ tracks }) {
    if (!tracks || tracks.length === 0) return null;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="text-green-500" />
                Oldest Gems
            </h2>

            <div className="space-y-4">
                {tracks.map((item, index) => {
                    const track = item.track;
                    const album = track.album;
                    const image = album.images[0]?.url;

                    return (
                        <div key={track.id + index} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex items-center gap-4 hover:bg-neutral-900 transition-colors group">
                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center font-bold text-neutral-600 group-hover:text-green-500 text-xl">
                                #{index + 1}
                            </div>

                            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-neutral-800 flex-shrink-0">
                                {image ? (
                                    <img src={image} alt={album.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Music className="w-full h-full p-4 text-neutral-600" />
                                )}
                            </div>

                            <div className="flex-grow min-w-0">
                                <h3 className="text-white font-semibold truncate hover:text-green-400 transition-colors">
                                    <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                        {track.name}
                                    </a>
                                </h3>
                                <p className="text-neutral-400 text-sm truncate">
                                    {track.artists.map(a => a.name).join(', ')}
                                </p>
                            </div>

                            <div className="flex-shrink-0 text-right">
                                <p className="text-green-400 font-mono font-medium">
                                    {formatDate(album.release_date)}
                                </p>
                                <p className="text-neutral-600 text-xs">
                                    Released
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
