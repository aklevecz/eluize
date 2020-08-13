import { AUTH_ERROR } from "./constants"
import handleErrors from "./handle-errors"

export default (contextUri, playlistTrackUri, givenDeviceId, singleTrack) => {
  let body = {}
  if (contextUri) {
    body["context_uri"] = contextUri
  }
  if (playlistTrackUri) {
    body["offset"] = { uri: playlistTrackUri }
  }
  if (singleTrack) {
    body["uris"] = [singleTrack]
  }
  const deviceId = givenDeviceId
    ? givenDeviceId
    : localStorage.getItem("deviceId")
  return fetch(
    `https://api.spotify.com/v1/me/player/play${
      deviceId !== null ? `?device_id=${deviceId}` : ""
    }`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("arcsasT")}`,
      },
      body: JSON.stringify(body),
    }
  )
    .then(r => {
      if (r.status === 401) throw new Error(AUTH_ERROR)
      if (r.status === 403) throw new Error("Context needed")
      return r
      return r.json()
    })
    .then(data => data)
    .catch(handleErrors)
}
