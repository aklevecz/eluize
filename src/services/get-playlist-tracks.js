import handleErrors from "./handle-errors"
import { AUTH_ERROR } from "./constants"
import refreshToken from "./refresh-token"

const spotPlaylistUrl = "https://api.spotify.com/v1/playlists"
const playlistTrackFetch = async (playlistId, accessToken) =>
  fetch(spotPlaylistUrl + `/${playlistId}/tracks`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
const getPlaylistTracks = async function (uri) {
  //   const accessToken = localStorage.getItem("arcsasT")
  const accessToken = localStorage.getItem("appToken")
  const playlistId = uri.split(":")[2]
  const tracks = await playlistTrackFetch(playlistId, accessToken)
    .then(async r => {
      if (r.status === 401) {
        const newR = await refreshToken().then(accessToken =>
          playlistTrackFetch(playlistId, accessToken)
        )
        if (newR.status === 401) throw new Error(AUTH_ERROR)
        return newR.json()
      }
      return r.json()
    })
    .then(data => {
      return data.items.map(item => {
        const track = item.track
        const trackName = track.name
        const artists = track.artists.map(artist => artist.name).join(", ")
        const trackUri = track.uri
        return { name: trackName, artists, trackUri }
      })
    })

  return tracks
}

export default getPlaylistTracks
