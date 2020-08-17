import React, { useState, useEffect } from "react"
import refreshToken from "./src/services/refresh-token"
import startPlayingPlaylist from "./src/services/start-playing-playlist"
import pausePlaylistTrack from "./src/services/pause-playlist-track"
import getUserDevices from "./src/services/get-user-devices"
import getUserCurrentlyPlaying from "./src/services/get-user-currently-playing"
import { noDevicesWarning } from "./src/components/eolian/constants"

const RAPTOR_REPO_NAME = "Eluize's Eolian Player"
export const playerContext = React.createContext()

const showActiveTrack = uri => {
  try {
    const cPlaying = document.querySelector(".playing")
    if (cPlaying) {
      cPlaying.classList.remove("playing")
    }
    const element = document.getElementById(uri)
    element.classList.add("playing")
  } catch (err) {
    try {
      const element = getElementByXpath(
        `//*[@track-data="spotify:track:${uri}"]`
      )
      element.classList.add("playing")
    } catch (err) {}
  }
}
const Provider = ({ children }) => {
  const [appToken, setAppToken] = useState()
  const [antiAuth, setAntiAuth] = useState(false)
  const [spotifyAuth, setSpotifyAuth] = useState()
  const [playerType, setPlayerType] = useState()
  const [player, setPlayer] = useState()
  const [scPlayer, setScPlayer] = useState()
  const [isPlaying, setIsPlaying] = useState()
  const [chosenDevice, setChosenDevice] = useState()
  const [chosenService, setChosenService] = useState()
  const [devices, setDevices] = useState()
  const [track, setTrack] = useState()
  const [nextTrackUri, setNextTrackUri] = useState()
  const [warningMessage, setWarningMessage] = useState("")
  useEffect(() => {
    const currentToken = localStorage.getItem("arcsasT")
    if (currentToken) {
      // getUser(currentToken).then(data => setUser(data.display_name))
    }

    const handlerEvent = event => {
      if (event.key !== "arcsasT") return
      if (!localStorage.getItem("arcsasT")) return
      initPlayer()
      //      getDevices()
      // maybe redudant
      setPlayerType("spotify")
    }
    if (window) window.addEventListener("storage", handlerEvent, false)

    return () => window.removeEventListener("storage", handlerEvent, false)
  }, [])
  useEffect(() => {
    if (!devices || playerType === "soundcloud") return
    let interval
    return
    // const raptorRepoDevice = devices.find(
    //   device => device.name === RAPTOR_REPO_NAME
    // )
    // if (!raptorRepoDevice || chosenDevice !== raptorRepoDevice.id) {

    // I'm not sure where this set should actually be
    //   setPlayerType("spotify")
    let errorCount = 0
    const pollPlaying = () => {
      if (errorCount > 10) {
        setChosenDevice(undefined)
        return clearInterval(interval)
      }
      getUserCurrentlyPlaying()
        .then(track => {
          showActiveTrack(track.item.id)
          setIsPlaying(track.is_playing)
          setTrack(track)
        })
        .catch(err => {
          errorCount++
        })
    }

    interval = setInterval(pollPlaying, 1000)
    // }

    return () => {
      clearInterval(interval)
      console.log("clear")
    }
  }, [isPlaying, chosenDevice])

  const getAppToken = () => {
    return fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.GATSBY_BB}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `${encodeURIComponent("grant_type")}=${encodeURIComponent(
        "client_credentials"
      )}`,
    })
      .then(r => r.json())
      .then(data => {
        setAppToken(data.access_token)
        localStorage.setItem("appToken", data.access_token)
      })
  }

  const getDevices = async () => {
    return getUserDevices()
      .then(d => {
        setDevices(d.devices)
        d.devices.map(device => {
          if (device.is_active && !isPlaying) {
            // setIsPlaying(true)
            setChosenDevice(device.id)
            localStorage.setItem("deviceId", device.id)
          }
        })
        setSpotifyAuth(true)
        return { devices: d.devices }
      })
      .catch(error => {
        console.log(error)
        setSpotifyAuth(false)
        return { devices: [], error: "no_auth" }
      })
  }
  const pickDevice = (deviceId, playlistUri, trackUri) => {
    setChosenDevice(deviceId)
    localStorage.setItem("deviceId", deviceId)
    // Do I need a conditional here?
    playSpotifyTrack(playlistUri, trackUri)
  }
  const initSoundcloud = () => {
    // pausePlaylistTrack()
    const client_id = "68ca93c0637a090be108eb8c8f3f8729"
    if (!window.SC) return
    const SC = window.SC
    SC.initialize({
      client_id,
      // redirect_uri: "http://localhost:8000",
    })

    window.SC.stream(`/tracks/596387517`).then(function (player) {
      setScPlayer(player)
    })

    // SC.connect()
    //   .then(function () {
    //     return SC.get("/me")
    //   })
    //   .then(function (me) {
    //     alert("Hello, " + me.username)
    //   })
  }

  const playSoundcloudTrack = trackId => {
    window.SC.stream(`/tracks/${trackId}`).then(function (player) {
      setScPlayer(player)
      player.play()
      setIsPlaying(true)
    })
  }

  const playSoundcloud = () => {
    if (isPlaying && playerType === "spotify") {
      pausePlaylistTrack()
    }
    setPlayerType("soundcloud")
    scPlayer.play()
    setIsPlaying(true)
  }

  useEffect(() => {
    let interval
    if (playerType === "soundcloud" && scPlayer) {
      let loading = true
      interval = setInterval(() => {
        if (scPlayer.isActuallyPlaying() && loading) {
          loading = false
        }
        if (!loading) {
          setTrack({
            progress_ms: scPlayer.currentTime(),
            item: { duration_ms: scPlayer.getDuration() },
          })
          setIsPlaying(scPlayer.isActuallyPlaying())
        }
      }, 500)
    }
    return () => {
      clearInterval(interval)
    }
  }, [playerType])

  const pauseSoundcloud = () => {
    scPlayer.pause()
    setIsPlaying(false)
  }

  const playSpotifyTrack = async (playlistUri, trackUri) => {
    if (isPlaying && scPlayer) pauseSoundcloud()
    // maybe redudant
    let availableDevices = devices
    if (!spotifyAuth) {
      return console.log("no auth")
      // await initPlayer()
    } else {
      const response = await getDevices()
      availableDevices = response.devices
    }

    if (availableDevices.length === 0) {
      // return setWarningMessage(noDevicesWarning)
    }
    if (availableDevices && !chosenDevice) {
      console.log("chosing at play")
      setChosenDevice(availableDevices[0].id)
      localStorage.setItem("deviceId", availableDevices[0].id)
    }
    if (playlistUri) {
      await startPlayingPlaylist(playlistUri, trackUri).then(r => {
        if (r.status === 204) setIsPlaying(true)
      })
      setTimeout(() => setNextTrackUri(trackUri), 500)
    } else {
      await startPlayingPlaylist(undefined, undefined, undefined, trackUri)
      setTimeout(() => setNextTrackUri(trackUri), 500)
    }
    // Maybe this is redundant?
    // getDevices().then(d => {
    //   console.log(d)
    // })
  }

  const resumePlayback = () => {
    setIsPlaying(true)
    if (playerType === "spotify") {
      resumeSpotifyPlayback()
    } else if (playerType === "soundcloud") {
      scPlayer.play()
      setIsPlaying(true)
    }
  }
  const pausePlayback = () => {
    setIsPlaying(false)
    if (playerType === "spotify") {
      pausePlaylistTrack()
    } else if (playerType === "soundcloud") {
      pauseSoundcloud()
    }
  }
  const resumeSpotifyPlayback = () => startPlayingPlaylist()

  const initPlayer = () => {
    if (typeof window === "undefined" || typeof window.Spotify === "undefined")
      return
    let initError
    const player = new window.Spotify.Player({
      name: RAPTOR_REPO_NAME,
      getOAuthToken: cb => {
        if (initError) return
        // refreshToken().then(t => {
        const t = localStorage.getItem("arcsasT")
        cb(t)
        // })
      },
    })
    player.connect()
    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id)
      localStorage.setItem("deviceId", device_id)
      getDevices()
      setChosenDevice(device_id)
      setPlayer({ ...player, fuck: true })
    })

    player.addListener("initialization_error", ({ message }) => {
      getDevices()
      initError = true
      console.error(message)
    })
    player.addListener("authentication_error", ({ message }) => {
      console.log("auth error")
      console.error(message)
    })
    player.addListener("account_error", ({ message }) => {
      console.error(message)
    })
    player.addListener("playback_error", ({ message }) => {
      console.error(message)
    })

    // Playback status updates
    player.addListener("player_state_changed", state => {
      if (!state) return
      const currentTrack = state.track_window.current_track
      const paused = state.paused
      showActiveTrack(currentTrack.uri.split(":")[2])
      setIsPlaying(!paused)
    })

    player.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id)
    })
    setPlayer(player)
  }
  return (
    <playerContext.Provider
      value={{
        antiAuth,
        chosenDevice,
        chosenService,
        devices,
        getDevices,
        initPlayer,
        initSoundcloud,
        isPlaying,
        getAppToken,
        nextTrackUri,
        pausePlayback,
        pausePlaylistTrack,
        pauseSoundcloud,
        pickDevice,
        player,
        playSoundcloud,
        playSoundcloudTrack,
        playSpotifyTrack,
        playerType,
        resumePlayback,
        scPlayer,
        setAntiAuth,
        setChosenDevice,
        setChosenService,
        setPlayer,
        setPlayerType,
        setSpotifyAuth,
        setTrack,
        spotifyAuth,
        track,
        warningMessage,
        setWarningMessage,
      }}
    >
      {children}
    </playerContext.Provider>
  )
}

export default ({ element }) => <Provider>{element}</Provider>

function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue
}
