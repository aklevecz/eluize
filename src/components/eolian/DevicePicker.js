import React, { useEffect, useRef, useLayoutEffect, useState } from "react"
import SVG from "react-inlinesvg"
import { ebid } from "./utils"
import { albumUri } from "../../pages"
import { noDevicesWarning } from "./constants"
const DevicePicker = ({
  chosenDevice,
  devices,
  pickDevice,
  showDevicePicker,
  setShowDevicePicker,
  queuedTrack,
}) => {
  const deviceBoxRef = useRef()
  const pickIcon = ebid("pick-device")
  const {
    x,
    y,
    width: pWidth,
    height: pHeight,
  } = pickIcon.getBoundingClientRect()
  useEffect(() => {
    const { height, width } = deviceBoxRef.current.getBoundingClientRect()
    deviceBoxRef.current.style.marginLeft = -1 * (width / 2 - pWidth / 2) + "px"

    // redudancy ftw
    deviceBoxRef.current.style.marginTop =
      -1 * document.querySelector(".device-box-container").clientHeight + "px"
    deviceBoxRef.current.style.marginTop =
      -1 * document.querySelector(".device-box-container").clientHeight -
      10 +
      "px"

    deviceBoxRef.current.style.marginLeft =
      -1 *
        (document.querySelector(".device-box-container").clientWidth / 2 -
          pWidth / 2) +
      "px"
  }, [devices])
  if (typeof window === "undefined" || !devices) return <div></div>
  return (
    <div
      className="device-box-container"
      ref={deviceBoxRef}
      style={{
        top: y + window.scrollY,
        left: x,
      }}
    >
      {devices.length === 0 && (
        <div style={{ margin: 10 }}>{noDevicesWarning}</div>
      )}
      {devices.map(device => {
        return (
          <div
            style={{
              textAlign: "left",
              display: "grid",
              gridTemplateColumns: "12px 1fr",
              gridColumnGap: "7px",
            }}
            key={device.id}
            className="device"
            onClick={() => {
              pickDevice(device.id, albumUri, queuedTrack)
              setShowDevicePicker(false)
            }}
          >
            {device.id === chosenDevice && (
              <div style={{ height: 10, fill: "#3fff48" }}>
                <SVG src={require("../../images/music-note.svg")} />
              </div>
            )}
            <div style={{ gridColumn: 2 }}>{device.name}</div>
          </div>
        )
      })}
      <div className="bottom-notch">
        <SVG src={require("../../images/bottom-notch.svg")} />
      </div>
    </div>
  )
}

export default DevicePicker
