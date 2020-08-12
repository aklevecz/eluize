import React, { useContext, useEffect } from "react"
import { playerContext } from "../../wrap-with-provider"
import Popup from "./popup"
import callSpotifyAuth from "../services/spotify-auth"

const DevicePicker = ({ devices, pickDevice }) => (
  <div>
    {devices.map(device => {
      return (
        <div
          className="device"
          key={device.id}
          onClick={() => pickDevice(device.id)}
        >
          {device.name}
        </div>
      )
    })}
  </div>
)

const SignInAndPickDevice = ({ playlistUri, showPopup, queuedTrack }) => {
  const {
    devices,
    getDevices,
    initPlayer,
    pickDevice,
    playSpotifyTrack,
    setPlayerType,
    setAntiAuth,
    spotifyAuth,
  } = useContext(playerContext)
  useEffect(() => {
    if (spotifyAuth) {
      initPlayer().then(() => {
        getDevices()
      })
    }
  }, [])

  const selectDevice = deviceId => {
    setPlayerType("spotify")
    pickDevice(deviceId)
    playSpotifyTrack(playlistUri, queuedTrack)
    showPopup(false)
  }

  const acceptSpotify = () => {
    callSpotifyAuth().then(() => initPlayer())
  }
  const denySpotify = () => {
    showPopup(false)
    setAntiAuth(true)
  }
  const title = spotifyAuth
    ? "Pick one of your Spotify devices"
    : "Login with Spotify?"
  return (
    <>
      {/* This is awkward because if they are already signed in it is then denying Spotify*/}
      {/* <div onClick={denySpotify} className="popup-overlay"></div> */}
      <Popup title={title} overlayOnClick={denySpotify}>
        {spotifyAuth && (
          <DevicePicker devices={devices} pickDevice={selectDevice} />
        )}
        {!spotifyAuth && (
          <div style={{ color: "black" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
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

export default SignInAndPickDevice
