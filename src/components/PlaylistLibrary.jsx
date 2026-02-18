import React, { useState, useEffect } from 'react';
import { Search, Heart, Music } from 'lucide-react';

export default function PlaylistLibrary({ playlists, onSelect, isLoading }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPlaylists, setFilteredPlaylists] = useState(playlists);

    useEffect(() => {
        if (!playlists) return;
        const results = playlists.filter(playlist =>
            playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPlaylists(results);
    }, [searchTerm, playlists]);

    if (!playlists) return null;

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Music className="text-green-500" />
                    Your Library
                </h2>
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search your playlists..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredPlaylists.map((playlist) => {
                    const isLikedSongs = playlist.id === 'liked-songs';
                    const imageUrl = playlist.images?.[0]?.url;

                    return (
                        <button
                            key={playlist.id}
                            onClick={() => onSelect(playlist.id, isLikedSongs ? 'liked-songs' : 'spotify')}
                            disabled={isLoading}
                            className="group flex flex-col items-start text-left p-3 space-y-3 bg-neutral-900/50 border border-neutral-800 hover:bg-neutral-800 rounded-xl transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-800 shadow-lg group-hover:shadow-green-500/10 transition-shadow">
                                {isLikedSongs ? (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-800">
                                        <Heart className="text-white fill-current" size={48} />
                                    </div>
                                ) : imageUrl ? (
                                    <img src={imageUrl} alt={playlist.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                                        <Music className="text-neutral-600" size={32} />
                                    </div>
                                )}

                                {/* Play Overlay */}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-green-500 text-black font-bold py-1 px-4 rounded-full text-sm transform scale-95 group-hover:scale-100 transition-transform">
                                        Analyze
                                    </span>
                                </div>
                            </div>

                            <div className="w-full min-w-0">
                                <h3 className="font-semibold text-white truncate text-sm md:text-base group-hover:text-green-400 transition-colors">
                                    {playlist.name}
                                </h3>
                                {playlist.tracks && (
                                    <p className="text-xs text-neutral-400 truncate">
                                        {playlist.tracks.total} songs
                                    </p>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {filteredPlaylists.length === 0 && (
                <div className="text-center py-12 text-neutral-500">
                    <p>No playlists found matching "{searchTerm}"</p>
                </div>
            )}
        </div>
    );
}
