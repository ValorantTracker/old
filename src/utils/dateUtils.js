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
        // Ensure date is valid and year is reasonable (e.g. > 1000) to avoid "0000" or bad data
        if (!isNaN(date.getTime()) && date.getFullYear() > 1000) {
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
        .filter(item => {
            const releaseDate = item.track?.album?.release_date;
            if (!releaseDate) return false;
            const date = new Date(releaseDate);
            // Filter out invalid dates or years < 1000 (like "0000")
            return !isNaN(date.getTime()) && date.getFullYear() > 1000;
        })
        .sort((a, b) => {
            const dateA = new Date(a.track.album.release_date);
            const dateB = new Date(b.track.album.release_date);
            return dateA - dateB;
        })
        .slice(0, limit);
}
