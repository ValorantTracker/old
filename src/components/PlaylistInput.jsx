import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function PlaylistInput({ onAnalyze, isLoading }) {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Basic Validation
        if (!url) {
            setError('Please enter a link.');
            return;
        }

        let id = '';
        let type = '';

        if (url.includes('spotify.com/playlist/')) {
            type = 'spotify';
            id = url.split('playlist/')[1].split('?')[0];
        } else if (url.includes('youtube.com/playlist') || url.includes('youtu.be')) {
            type = 'youtube';
            // Basic extraction for YouTube (list=ID)
            const match = url.match(/[?&]list=([^#\&\?]+)/);
            if (match) {
                id = match[1];
            } else {
                setError('Invalid YouTube playlist link.');
                return;
            }
        } else {
            setError('Please enter a valid Spotify or YouTube playlist link.');
            return;
        }

        onAnalyze(id, type);
    };

    return (
        <div className="w-full max-w-xl mx-auto space-y-4">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste Spotify or YouTube playlist link..."
                    className="w-full pl-6 pr-32 py-4 bg-neutral-900 border border-neutral-800 rounded-full text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-lg"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-2 top-2 bottom-2 bg-green-500 hover:bg-green-400 text-black font-bold px-6 rounded-full transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                </button>
            </form>
            {error && <p className="text-red-400 text-center text-sm">{error}</p>}
        </div>
    );
}
