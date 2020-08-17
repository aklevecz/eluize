export default async artistId => {
  return fetch(`https://api.spotify.com/v1/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("arcsasT")}`,
    },
  })
    .then(r => {
      return r.json()
    })
    .then(data => {
      return data
    })
    .catch(err => {
      return { error: "error" }
    })
}
