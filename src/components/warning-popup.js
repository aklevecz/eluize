import React, { useContext } from "react"
import { playerContext } from "../../wrap-with-provider"
import Popup from "./popup"

const WarningPopup = () => {
  const { setWarningMessage, warningMessage } = useContext(playerContext)

  const clearWarning = () => setWarningMessage("")

  return (
    <>
      <Popup title={warningMessage} overlayOnClick={clearWarning}>
        <button
          style={{ margin: "auto", display: "block" }}
          onClick={clearWarning}
        >
          OK
        </button>
      </Popup>
    </>
  )
}

export default WarningPopup
