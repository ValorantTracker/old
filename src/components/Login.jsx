import React, { useState, useEffect } from "react";
import { redirectToAuthCodeFlow } from "../utils/spotify";
import { LogIn } from "lucide-react";

export default function Login() {
    const [clientId, setClientId] = useState(import.meta.env.VITE_SPOTIFY_CLIENT_ID || "");
    const [error, setError] = useState("");

    const handleLogin = () => {
        if (!clientId) {
            setError("Please provide a Client ID.");
            return;
        }
        // If client ID was manually entered, we might need a way to pass it to the utility
        // For now, let's assume env var, or if manual, we need to update the utility to accept it.
        // Actually, let's just stick to Env Var for now for simplicity, or warn the user.
        if (!import.meta.env.VITE_SPOTIFY_CLIENT_ID) {
            alert("Configuration Error: VITE_SPOTIFY_CLIENT_ID is missing in .env file.");
            return;
        }
        redirectToAuthCodeFlow(clientId);
    };

    return (
        <div className="flex flex-col items-center gap-6 p-8 bg-neutral-900 rounded-2xl border border-neutral-800 shadow-2xl max-w-md w-full">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Welcome</h2>
                <p className="text-neutral-400">Login with Spotify to analyze your playlists.</p>
            </div>

            <button
                onClick={handleLogin}
                className="flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full transition-all transform hover:scale-105"
            >
                <LogIn size={20} />
                Login with Spotify
            </button>

            {!import.meta.env.VITE_SPOTIFY_CLIENT_ID && (
                <div className="text-red-400 text-sm text-center mt-4 p-4 bg-red-900/20 rounded-lg">
                    Missing <code>VITE_SPOTIFY_CLIENT_ID</code>. <br />
                    Please add it to your <code>.env</code> file.
                </div>
            )}
        </div>
    );
}
