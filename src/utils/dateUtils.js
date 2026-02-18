export function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    // Handle year-only dates (e.g. "2005")
    if (dateString.length === 4) return dateString;
    return new Date(dateString).toLocaleDateString(undefined, options);
}

export function calculateAverageDate(tracks) {
    if (!tracks || tracks.length === 0) return null;

    let totalTimestamp = 0;
    let count = 0;

    tracks.forEach(item => {
        const releaseDate = item.track?.album?.release_date;
        if (!releaseDate) return;

        const date = new Date(releaseDate);
        if (!isNaN(date.getTime())) {
            totalTimestamp += date.getTime();
            count++;
        }
    });

    if (count === 0) return null;

    return new Date(totalTimestamp / count);
}

export function getOldestTracks(tracks, limit = 10) {
    if (!tracks) return [];

    return tracks
        .filter(item => item.track && item.track.album && item.track.album.release_date)
        .sort((a, b) => {
            const dateA = new Date(a.track.album.release_date);
            const dateB = new Date(b.track.album.release_date);
            // Valid dates first
            if (isNaN(dateA)) return 1;
            if (isNaN(dateB)) return -1;
            return dateA - dateB;
        })
        .slice(0, limit);
}
