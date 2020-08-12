export default async () => {
  return await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + process.env.GATSBY_BB,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=refresh_token&refresh_token=${localStorage.getItem(
      "refrashT"
    )}`,
  })
    .then(r => r.json())
    .then(data => {
      localStorage.setItem("arcsasT", data.access_token)
      return data.access_token
    })
}
