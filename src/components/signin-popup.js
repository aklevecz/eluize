import React, { useContext, useEffect, useState } from "react"
import { playerContext } from "../../wrap-with-provider"
import Popup from "./popup"
import callSpotifyAuth from "../services/spotify-auth"
import SpotifyIcon from "./icons/spotify-icon"
import SoundcloudIcon from "./icons/soundcloud-icon"
const SignInPopup = ({ showPopup }) => {
  const {
    getDevices,
    initPlayer,
    playerType,
    setAntiAuth,
    setPlayerType,
    spotifyAuth,
  } = useContext(playerContext)
  const [service, setService] = useState("")
  useEffect(() => {
    if (spotifyAuth && !playerType) {
      initPlayer()
      getDevices()
      // showPopup(false)
    }
    if (playerType) {
      showPopup(false)
    }
  }, [])

  useEffect(() => {
    if (service === "spotify" && spotifyAuth) {
      setPlayerType("spotify")
      showPopup(false)
    }
  }, [service])

  const acceptSpotify = () => {
    callSpotifyAuth()
    showPopup(false)
  }

  // MORE DENY LOGIC
  const denySpotify = () => {
    showPopup(false)
    setAntiAuth(true)
  }

  const pickSoundcloud = () => {
    setService("soundcloud")
    setPlayerType("soundcloud")
    showPopup(false)
  }

  const pickSpotify = () => {
    setService("spotify")
    // setPlayerType("spotify")
  }
  let title
  switch (service) {
    case "soundcloud":
      title = "Ok! You picked Soundcloud"
      break
    case "spotify":
      title = "Connect to use the Player"
      break
    default:
      title = "Soundcloud or Spotify?"
  }
  return (
    <>
      <Popup title={title} overlayOnClick={denySpotify}>
        {!service && (
          <div style={{ maxWidth: "50%", margin: "auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                marginTop: 20,
              }}
            >
              <button onClick={pickSpotify}>
                <SpotifyIcon fill={"white"} />
              </button>
              <button onClick={pickSoundcloud}>
                <SoundcloudIcon fill="white" />
              </button>
            </div>
          </div>
        )}
        {!spotifyAuth && service && (
          <div>
            <div
              style={{
                margin: "-18px auto -5px",
                display: "block",
                width: "60px",
              }}
            >
              <SpotifyIcon />
            </div>
            <div style={{ color: "black" }}>
              <div style={{ maxWidth: "50%", margin: "auto" }}>
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
            </div>
          </div>
        )}
      </Popup>
    </>
  )
}

export default SignInPopup
