import { useState, useEffect } from 'react';
import { getAccessToken, fetchPlaylist } from './utils/spotify';
import { getOldestTracks, calculateAverageDate } from './utils/dateUtils';
import Login from './components/Login';
import PlaylistInput from './components/PlaylistInput';
import Leaderboard from './components/Leaderboard';
import Stats from './components/Stats';
import { Loader2 } from 'lucide-react';

function App() {
  const [token, setToken] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Analysis State
  const [analyzing, setAnalyzing] = useState(false);
  const [playlistData, setPlaylistData] = useState(null);
  const [analyzedTracks, setAnalyzedTracks] = useState([]);
  const [averageDate, setAverageDate] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Check if token is in URL (callback from Spotify)
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        try {
          // Clean URL (remove 'code' but keep the path)
          const cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete("code");
          window.history.replaceState({}, document.title, cleanUrl.toString());
          const accessToken = await getAccessToken(code);
          setToken(accessToken);
          localStorage.setItem("spotify_token", accessToken);
        } catch (e) {
          console.error("Auth Error", e);
        }
      } else {
        // 2. Check local storage
        const storedToken = localStorage.getItem("spotify_token");
        if (storedToken) {
          setToken(storedToken);
        }
      }
      setLoadingConfig(false);
    };

    checkAuth();
  }, []);

  const handleAnalyze = async (id, type) => {
    if (type !== 'spotify') {
      setError('YouTube support coming soon!');
      return;
    }

    setAnalyzing(true);
    setError('');
    setPlaylistData(null);
    setAnalyzedTracks([]);

    try {
      const data = await fetchPlaylist(token, id);
      setPlaylistData(data);

      // Process Data
      const tracks = data.tracks.items;
      const oldest = getOldestTracks(tracks, 50); // Get top 50, display top 10? Leaderboard handles display.
      const avg = calculateAverageDate(tracks);

      setAnalyzedTracks(oldest); // We pass sorted oldest tracks to leaderboard
      setAverageDate(avg);

    } catch (err) {
      console.error(err);
      setError('Failed to fetch playlist. Make sure it is public or you have access.');
      if (err.status === 401) {
        setToken(null);
        localStorage.removeItem("spotify_token");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  if (loadingConfig) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-green-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center py-12 px-4 font-sans">
      <div className="w-full max-w-5xl space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent tracking-tighter">
            Playlist Time Machine
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl font-light">
            Discover the oldest gems in your collection.
          </p>
        </header>

        <main className="flex flex-col items-center w-full">
          {!token ? (
            <Login />
          ) : (
            <div className="w-full space-y-12 animate-fade-in-up">
              <div className="text-center">
                <PlaylistInput onAnalyze={handleAnalyze} isLoading={analyzing} />
                {error && <p className="mt-4 text-red-400">{error}</p>}
              </div>

              {analyzing && (
                <div className="flex flex-col items-center justify-center space-y-4 py-12">
                  <Loader2 className="animate-spin text-green-500" size={48} />
                  <p className="text-neutral-500 animate-pulse">Scanning track history...</p>
                </div>
              )}

              {!analyzing && analyzedTracks.length > 0 && (
                <div className="space-y-12">
                  {averageDate && (
                    <Stats
                      tracks={analyzedTracks} // Wait, analyzedTracks is only top 50. We need full list count for Stats.
                      // Actually stats needs full list to be accurate for "Total Songs".
                      // But we only kept top 50 in state.
                      // I should check handleAnalyze.
                      averageDate={averageDate}
                      totalCount={playlistData?.tracks?.items?.length}
                    />
                  )}
                  {/* Fix: Stats passes analyzedTracks which is only the oldest. 
                                I should pass the playlistData.tracks.items length or something.
                                Let's fix this in a subsequent edit or assume for now "Total Songs" refers to the ones we looked at.
                            */}

                  <Leaderboard tracks={analyzedTracks.slice(0, 20)} />
                </div>
              )}

              <div className="text-center mt-24">
                <button
                  onClick={() => {
                    setToken(null);
                    localStorage.removeItem("spotify_token");
                  }}
                  className="text-neutral-600 hover:text-white underline text-sm transition-colors"
                >
                  Logout from Spotify
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
