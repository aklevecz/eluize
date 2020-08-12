import { AUTH_ERROR } from "./constants"

export default async () => {
  return fetch(`https://api.spotify.com/v1/me/player/devices`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("arcsasT")}`,
    },
  }).then(r => {
    if (r.status !== 200) throw new Error(AUTH_ERROR)
    return r.json()
  })
}
