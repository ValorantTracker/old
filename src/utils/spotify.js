const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
// Automatically detect the current URL (including subdirectory like /old/)
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || window.location.origin + window.location.pathname;
const SCOPES = ["playlist-read-private", "playlist-read-collaborative"];

/**
 * Generates a random string for the state and code verifier
 */
function generateRandomString(length) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

/**
 * Generates the code challenge from the code verifier
 */
async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

/**
 * Redirects user to Spotify Authorization page
 */
export async function redirectToAuthCodeFlow() {
    const verifier = generateRandomString(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("response_type", "code");
    params.append("redirect_uri", REDIRECT_URI);
    params.append("scope", SCOPES.join(" "));
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

/**
 * Exchanges the authorization code for an access token
 */
export async function getAccessToken(code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", REDIRECT_URI);
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

/**
 * Fetches the user profile (can be used to verify token)
 */
export async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

/**
 * Helper to fetch a playlist
 */
export async function fetchPlaylist(token, playlistId) {
    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
    const playlist = await result.json();

    // If there are more tracks, fetch them
    let tracks = playlist.tracks.items;
    let nextUrl = playlist.tracks.next;

    while (nextUrl) {
        const nextResult = await fetch(nextUrl, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });
        const nextData = await nextResult.json();
        tracks = tracks.concat(nextData.items);
        nextUrl = nextData.next;
    }

    playlist.tracks.items = tracks;
    return playlist;
}

export async function fetchPlaylistTracks(token, url) {
    const result = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}
