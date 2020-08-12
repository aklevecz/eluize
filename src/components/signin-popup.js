import React, { useContext, useEffect } from "react"
import { playerContext } from "../../wrap-with-provider"
import Popup from "./popup"
import callSpotifyAuth from "../services/spotify-auth"
import SpotifyIcon from "./icons/spotify-icon"
const SignInPopup = ({ showPopup }) => {
  const { getDevices, initPlayer, setAntiAuth, spotifyAuth } = useContext(
    playerContext
  )
  useEffect(() => {
    if (spotifyAuth) {
      initPlayer().then(() => {
        getDevices()
      })
      showPopup(false)
    }
  }, [])

  const acceptSpotify = () => {
    callSpotifyAuth()
    showPopup(false)
  }

  // MORE DENY LOGIC
  const denySpotify = () => {
    showPopup(false)
    setAntiAuth(true)
  }
  const title = "Connect using Spotify"
  return (
    <>
      <Popup title={title} overlayOnClick={denySpotify}>
        <div
          style={{
            margin: "auto",
            display: "block",
            marginTop: "-17px",
            width: "60px",
          }}
        >
          <SpotifyIcon />
        </div>
        {!spotifyAuth && (
          <div style={{ color: "black" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                marginTop: 20,
              }}
            >
              <button onClick={acceptSpotify}>YES</button>
              <button onClick={denySpotify}>NO</button>
            </div>
          </div>
        )}
      </Popup>
    </>
  )
}

export default SignInPopup
