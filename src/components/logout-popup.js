import React, { useContext } from "react"
import { playerContext } from "../../wrap-with-provider"
import Popup from "./popup"

const LogoutPopup = ({ context, setShowLogoutPopup }) => {
  const logout = () => {
    // localStorage.removeItem("deviceId")
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
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button
            style={{ margin: "auto", display: "block" }}
            onClick={() => setShowLogoutPopup(false)}
          >
            Oops no
          </button>
          <button style={{ margin: "auto", display: "block" }} onClick={logout}>
            OK
          </button>
        </div>
      </Popup>
    </>
  )
}

export default LogoutPopup
