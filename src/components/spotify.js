import React from "react"

const Spotify = () => {
  const spotAuth = () => {
    if (typeof window === "undefined") return
    const url = `${window.location.protocol}//${window.location.hostname}`
    var scopes =
      "streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state"
    var redirect_uri = url
    window &&
      window.open(
        "https://accounts.spotify.com/authorize" +
          "?response_type=code" +
          "&client_id=" +
          process.env.GATSBY_SPOTIFY_CLIENT_ID +
          "&scope=" +
          encodeURIComponent(scopes) +
          "&redirect_uri=" +
          encodeURIComponent(redirect_uri),
        "login-popup",
        "width=500, height=400"
      )
  }

  return <button onClick={spotAuth}>SPOTIFY</button>
}

export default Spotify
