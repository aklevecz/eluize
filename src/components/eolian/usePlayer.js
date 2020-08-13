import { useState, useEffect } from "react"
import {
  lerpTranslateXY,
  lerpOpacityOut,
  lerpOpacityIn,
} from "../../templates/animations"
import { ebid, movePercentBar } from "./utils"
import { albumUri } from "../../pages"
import startPlayingPlaylist from "../../services/start-playing-playlist"
import setVolume from "../../services/set-volume"
import getUserCurrentlyPlaying from "../../services/get-user-currently-playing"

function usePlayer(
  loaded,
  playerOpen,
  setShowDevicePicker,
  context,
  queuedTrack,
  showDevicePicker
) {
  const [status, setStatus] = useState()
  const startPlaying = () => {
    startPlayingPlaylist().catch(e => {
      startPlayingPlaylist(albumUri, queuedTrack)
    })
  }

  // ** OPENING PLAYER **
  useEffect(() => {
    if (!loaded || typeof window === "undefined") return
    const player = ebid("player")
    const playerTarget = ebid("player-target")
    const tY = parseFloat(playerTarget.getAttribute("y"))
    const cY = parseFloat(player.querySelector("#bg").getAttribute("y"))
    if (playerOpen) {
      ebid("star-container").style.display = "inherit"
      lerpTranslateXY(player, 1, 1, 0, tY - cY, 0.05).then(() => {
        const { x: vX, y: vY, width } = ebid(
          "volume-target"
        ).getBoundingClientRect()
        ebid("volume-slider").style.top = vY + window.scrollY - 25 + "px"
        ebid("volume-slider").style.left = vX + "px"
        ebid("volume-slider").style.width = width + "px"
      })
    } else {
      ebid("star-container").style.display = "none"
      const playerY = player
        .getAttribute("transform")
        .split("(")[1]
        .split(")")[0]
        .split(",")[1]
      lerpTranslateXY(player, 1, 1, parseFloat(playerY), 0, 0.05)
      setShowDevicePicker(false)
    }
    if (!context.spotifyAuth) {
      ebid("pick-device").style.display = "none"
    }
  }, [playerOpen])

  // ** PROGRESS BAR
  useEffect(() => {
    if (!context.track) return
    const duration = context.track.item.duration_ms
    const progress = context.track.progress_ms
    const durationEl = ebid("duration")
    const dX1 = parseFloat(durationEl.getAttribute("x1"))
    const dX2 = parseFloat(durationEl.getAttribute("x2"))
    const length = dX2 - dX1
    const progressEl = ebid("progress")
    progressEl.setAttribute("x2", dX1 + length * (progress / duration))
  }, [context.track])

  // TRACK NAME
  // useEffect(() => {
  //   if (!loaded) return

  //   const currentTrack = ebid("track-name").textContent
  //   console.log(currentTrack, context.track.item.name)
  //   if (currentTrack !== context.track.item.name) {
  //     lerpOpacityOut(ebid("track-name")).then(() => {
  //       ebid("track-name").textContent = context.track.item.name
  //       lerpOpacityIn(ebid("track-name"))
  //     })
  //   }
  //   ebid("track-name").textContent = currentTrack
  // }, [context.track && context.track.item.name])

  useEffect(() => {
    if (!loaded) return

    const currentTrack = ebid("track-name").textContent
    console.log("checking song")
    getUserCurrentlyPlaying().then(data => {
      const trackName = data.item.name
      const albumName = data.item.album.name
      const albumImg = data.item.album.images[0].url
      if (currentTrack !== trackName) {
        lerpOpacityOut(ebid("track-name")).then(() => {
          ebid("track-name").textContent = trackName
          ebid("album-name").textContent = albumName
          ebid("album-picture").setAttribute("xlink:href", albumImg)
          lerpOpacityIn(ebid("track-name"))
        })
      }
    })
    //ebid("track-name").textContent = currentTrack
  }, [context.isPlaying])
  // ***

  // AUTO PLAY?
  useEffect(() => {
    if (playerOpen) {
      context.playSpotifyTrack(albumUri, queuedTrack).then(() => {
        setVolume(50)
        movePercentBar(50)
      })
    }
    if (!playerOpen && context.chosenDevice) {
      context.playSpotifyTrack(albumUri, queuedTrack)
    }
  }, [queuedTrack])

  // UPDATE PLAY CLICK
  useEffect(() => {
    if (!loaded) return
    const play = ebid("play")
    play.onclick = () => startPlaying()
  }, [queuedTrack])

  // PLAY AND PAUSE BUTTONS
  useEffect(() => {
    if (!loaded) return
    console.log(context.isPlaying)
    if (context.isPlaying) {
      ebid("pause").style.display = "inherit"
      ebid("play").style.display = "none"
      ebid("pause").onclick = context.pausePlayback
    } else {
      ebid("pause").style.display = "none"
      ebid("play").style.display = "inherit"
      ebid("play").onclick = context.resumePlayback
    }
  }, [context])

  // DEVICE PICKER
  useEffect(() => {
    const toggleDevicePicker = () => {
      setShowDevicePicker(!showDevicePicker)
    }
    if (!loaded) return
    const devicePicker = ebid("pick-device")
    if (!context.spotifyAuth) {
      devicePicker.style.display = "none"
    } else {
      devicePicker.style.display = "inherit"
    }
    devicePicker.onclick = toggleDevicePicker
  }, [loaded, showDevicePicker, context.spotifyAuth])

  // LISTENING TO DEVICE CHANGES
  useEffect(() => {
    if (!context.devices) return
    const activeDevice = context.devices.find(d => d.is_active)
    if (activeDevice) {
      const x1 = parseInt(ebid("volume-target").getAttribute("x1"))
      const x2 = parseInt(ebid("volume-target").getAttribute("x2"))
      const volumePercent = activeDevice.volume_percent / 100
      // const length = (x2 - x1) * volumePercent
      // ebid("volume-percent").setAttribute("x2", x1 + length)
    }
  }, [context.devices])

  return status
}

export default usePlayer
