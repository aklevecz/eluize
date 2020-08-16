import React, { useContext } from "react"
import { playerContext } from "../../wrap-with-provider"
import Popup from "./popup"

const LogoutPopup = ({ context, setPlayerOpen, setShowLogoutPopup }) => {
  const logout = () => {
    // localStorage.removeItem("deviceId")
    setPlayerOpen(false)
    context.pausePlayback()
    localStorage.removeItem("refrashT")
    localStorage.removeItem("arcsasT")
    // context.setChosenDevice("")
    // context.setPlayer("")
    context.setSpotifyAuth(false)
    context.setPlayerType("")
    setShowLogoutPopup(false)
  }

  return (
    <>
      <Popup
        title={"Disconnect your Spotify?"}
        overlayOnClick={() => setShowLogoutPopup(false)}
      >
        <div style={{ maxWidth: "50%", margin: "auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              marginTop: 20,
            }}
          >
            <button style={{ fontSize: "1rem" }} onClick={logout}>
              OK
            </button>
            <button
              style={{ fontSize: "1rem" }}
              onClick={() => setShowLogoutPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Popup>
    </>
  )
}

export default LogoutPopup
