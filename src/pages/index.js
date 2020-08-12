import React, { useState, useEffect, useContext, useRef } from "react"
import SVG from "react-inlinesvg"
import "./eolian.scss"
import {
  lerpTranslateXY,
  lerpOpacityOut,
  lerpOpacityIn,
} from "../templates/animations"
import { playerContext } from "../../wrap-with-provider"
import pausePlaylistTrack from "../services/pause-playlist-track"
import startPlayingPlaylist from "../services/start-playing-playlist"
import getUserDevices from "../services/get-user-devices"
import SignInPopup from "../components/signin-popup"
import setVolume from "../services/set-volume"
import loadingGif from "../images/loading.gif"
import DevicePicker from "../components/eolian/DevicePicker"
import {
  ebid,
  hel,
  collectTextEls,
  collectCoords,
  isDesk,
  addClass,
  getBaseId,
  movePercentBar,
} from "../components/eolian/utils"
import usePlayer from "../components/eolian/usePlayer"
import Layout from "../components/layout"

export const albumUri = "spotify:album:00DHViaM6QJwQjipBFoqsB"
export const trackUris = {
  eolian: "spotify:track:495VVx56Vd5HkCw914GfCZ",
  losing_track: "spotify:track:2KjnarehBXAyjUc6FfcZ70",
  enklave: "spotify:track:5OfV5HdNjjUa8bvk1vBW6H",
  opulence: "spotify:track:4R6ofbEv0bcZzV4SgvzXVn",
  laze: "spotify:track:6afurbtcj10yYm4M1KMf0s",
  ae: "spotify:track:63m5LzFhvTRsze2CrWaAns",
}

const Eolian = () => {
  const [src, setSrc] = useState(
    isDesk()
      ? require("../images/eolian-desk.svg")
      : require("../images/eolian-mobile.svg")
  )
  const [playerOpen, setPlayerOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [queuedTrack, setQueuedTrack] = useState("")
  const [showDevicePicker, setShowDevicePicker] = useState(false)
  const [currentVolume, setCurrentVolume] = useState(50)
  const [muted, setMuted] = useState(false)
  const volChangeRef = useRef(Date.now())
  const [loaded, setLoaded] = useState(false)

  const context = useContext(playerContext)

  const playerStatus = usePlayer(
    loaded,
    playerOpen,
    setShowDevicePicker,
    context,
    queuedTrack,
    showDevicePicker
  )

  useEffect(() => {
    context.initPlayer().then(() => {
      context.getDevices()
    })
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const resize = () => {
      setSrc(
        isDesk()
          ? require("../images/eolian-desk.svg")
          : require("../images/eolian-mobile.svg")
      )
    }
    window.addEventListener("resize", resize, false)

    return () => window.removeEventListener("resize", resize, false)
  }, [])

  // ** VOLUME CHANGE
  const volumeChange = e => {
    // STAR IS THE ICON #SLIDER IS ITS DIV
    ebid("star").style.display = "inherit"
    const { x, y, width } = e.target.getBoundingClientRect()
    // SLIDER IS THE INPUT ELEMENT
    ebid("star-container").style.top = y + window.scrollY + 13 + "px"
    const volPos =
      x +
      width * (e.target.value / 100) -
      ebid("star-container").getBoundingClientRect().width / 2
    ebid("star-container").style.left = volPos + "px"
    if (typeof window === "undefined") return
    movePercentBar(e.target.value)
    if (Date.now() - volChangeRef.current > 1000) {
      setVolume(e.target.value)
      setCurrentVolume(e.target.value)
      volChangeRef.current = Date.now()
    }
  }

  const toggleMuted = () => setMuted(!muted)

  useEffect(() => {
    if (!loaded) return
    ebid("static-volume-icon").onclick = toggleMuted
    if (muted) {
      ebid("muted-cross").style.display = "inherit"
      ebid("volume-percent").style.display = "none"
      setVolume(0)
    }
    return () => {
      setVolume(currentVolume)
      movePercentBar(currentVolume)
      ebid("muted-cross").style.display = "none"
      ebid("volume-percent").style.display = "inherit"
    }
  }, [muted])

  useEffect(() => {
    if (!loaded) return
    if (context.antiAuth) {
      setPlayerOpen(false)
      const tracksPre = ebid("tracks-pre")
      const trackEls = collectTextEls(tracksPre)
      trackEls.forEach(text => {
        const uri = trackUris[text.id.toLowerCase().split("-")[0]].split(":")[2]
        text.onclick = () => {
          window.open(`https://open.spotify.com/track/${uri}`)
        }
      })
    }
  }, [context.antiAuth])

  // ** SETUP **
  const setup = () => {
    const viewBox = document.querySelector("#viewBox")
    const svg = document.querySelectorAll("svg")[1]
    svg.setAttribute(
      "viewBox",
      `0 0 ${viewBox.getAttribute("width")} ${viewBox.getAttribute("height")}`
    )
    ebid("track-name").textContent = ""
    const tracksPre = ebid("tracks-pre")
    const tracksTarget = ebid("tracks-target")
    const listenButton = ebid("listen-button")
    hel(tracksTarget)
    const preTexts = collectTextEls(tracksPre)
    const tarCoords = collectCoords(tracksTarget)
    const preCoords = collectCoords(tracksPre)

    const pause = ebid("pause")
    pause.style.display = "none"
    pause.onclick = () => pausePlaylistTrack()

    const close = ebid("player-close")
    const closePlayer = () => {
      setPlayerOpen(false)
    }
    close.onclick = closePlayer
    const openPlayer = e => {
      setPlayerOpen(true)
    }

    const moveTracks = () => {
      lerpOpacityOut(listenButton).then(() => {
        listenButton.remove()
      })
      preTexts.forEach(text => {
        const uri = trackUris[text.id.toLowerCase().split("-")[0]]
        text.onclick = e => {
          setShowPopup(true)
          openPlayer(e)
          setQueuedTrack(uri)
        }
        text.setAttribute("track-data", uri)
        addClass(text, "button")
        const baseId = getBaseId(text)
        lerpTranslateXY(
          text,
          preCoords[baseId].x,
          tarCoords[baseId].x,
          preCoords[baseId].y,
          tarCoords[baseId].y
        )
      })
    }

    addClass(listenButton, "button")
    listenButton.onclick = moveTracks
    ebid("static-volume-icon").onclick = toggleMuted

    // Shitty force of the loading screen
    setTimeout(() => {
      document.body.style.background = viewBox.style.fill
      document.querySelector("html").style.background = viewBox.style.fill
      setLoaded(true)
    }, 0)

    if (typeof window !== "undefined")
      ebid("bandcamp").onclick = () =>
        window.open("https://shallnotfade.bandcamp.com/album/eolian-ep")
    ebid("soundcloud").onclick = () =>
      window.open("https://soundcloud.com/eluize")
    ebid("spotify").onclick = () =>
      window.open("https://open.spotify.com/artist/4UynZk3RxczOK1AwaHR5ha")
  }

  return (
    <>
      <div>
        {/*just for token checking, don't really need it */}
        <Layout />
        <SVG
          style={{ width: 20, display: "none" }}
          id="star-container"
          src={require("../images/star.svg")}
        />
      </div>
      {!loaded && (
        <img
          style={{ display: "block", margin: "16% auto" }}
          id="loading-gif"
          src={loadingGif}
        />
      )}
      {showPopup && !context.chosenDevice && (
        <SignInPopup showPopup={setShowPopup} />
      )}
      {showDevicePicker && (
        <DevicePicker
          devices={context.devices}
          pickDevice={context.pickDevice}
          setShowDevicePicker={setShowDevicePicker}
          showDevicePicker={showDevicePicker}
          queuedTrack={queuedTrack}
        />
      )}
      <SVG
        src={src}
        onLoad={setup}
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 1s" }}
      />
      <input
        type="range"
        min="0"
        max="100"
        defaultValue="50"
        className="slider"
        id="volume-slider"
        onChange={volumeChange}
        onMouseUp={() => (ebid("star").style.display = "none")}
        onTouchEnd={() => (ebid("star").style.display = "none")}
      />
    </>
  )
}

export default Eolian
