export default async artistId => {
  return fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("appToken")}`,
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
