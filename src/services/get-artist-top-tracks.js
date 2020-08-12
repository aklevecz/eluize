export default async artistId => {
  return fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=from_token`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("appToken")}`,
      },
    }
  )
    .then(r => {
      return r.json()
    })
    .then(data => {
      return data.tracks.map(track => {
        const trackName = track.name
        const artists = track.artists.map(artist => artist.name).join(", ")
        const trackUri = track.uri
        return { name: trackName, artists, trackUri }
      })
    })
    .catch(err => {
      return { error: "error" }
    })
}
