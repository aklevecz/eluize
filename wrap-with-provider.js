import React, { useState, useEffect } from "react"
import refreshToken from "./src/services/refresh-token"
import startPlayingPlaylist from "./src/services/start-playing-playlist"
import pausePlaylistTrack from "./src/services/pause-playlist-track"
import getUserDevices from "./src/services/get-user-devices"
import getUserCurrentlyPlaying from "./src/services/get-user-currently-playing"

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
    } catch (err) {
      console.log("cant find this boy")
    }
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
  const [devices, setDevices] = useState()
  const [track, setTrack] = useState()
  useEffect(() => {
    const currentToken = localStorage.getItem("arcsasT")
    if (currentToken) {
      // getUser(currentToken).then(data => setUser(data.display_name))
    }

    const handlerEvent = event => {
      if (event.key !== "arcsasT") return
      initPlayer()
      getDevices()
    }
    if (window) window.addEventListener("storage", handlerEvent, false)

    return () => window.removeEventListener("storage", handlerEvent, false)
  }, [])
  useEffect(() => {
    if (!devices || playerType === "soundcloud") return
    let interval
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
          playerType === "spotify" && setIsPlaying(track.is_playing)
          console.log(track)
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

  const getDevices = () => {
    getUserDevices()
      .then(d => {
        setDevices(d.devices)
        d.devices.map(device => {
          if (device.is_active) {
            setIsPlaying(true)
          }
        })
        setSpotifyAuth(true)
      })
      .catch(error => {
        setSpotifyAuth(false)
      })
  }
  const pickDevice = (deviceId, playlistUri, trackUri) => {
    setChosenDevice(deviceId)
    localStorage.setItem("deviceId", deviceId)
    // Do I need a conditional here?
    playSpotifyTrack(playlistUri, trackUri)
  }
  const initSoundcloud = trackId => {
    // pausePlaylistTrack()
    const client_id = "68ca93c0637a090be108eb8c8f3f8729"
    if (!window.SC) return
    const SC = window.SC
    SC.initialize({
      client_id,
    })
    SC.stream(`/tracks/${trackId}`).then(function (player) {
      setScPlayer(player)
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
    if (playerType === "soundcloud") {
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
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [playerType])
  const pauseSoundcloud = () => {
    console.log("pausing soundcloud")
    scPlayer.pause()
    setIsPlaying(false)
  }

  const playSpotifyTrack = async (playlistUri, trackUri) => {
    if (isPlaying && scPlayer) pauseSoundcloud()
    setPlayerType("spotify")
    if (!spotifyAuth) {
      await initPlayer()
      await getDevices()
    }
    if (playlistUri) {
      await startPlayingPlaylist(playlistUri, trackUri)
    } else {
      await startPlayingPlaylist(undefined, undefined, undefined, trackUri)
    }
    getDevices()
  }

  const resumePlayback = () => {
    if (playerType === "spotify") {
      resumeSpotifyPlayback()
    } else if (playerType === "soundcloud") {
      scPlayer.play()
      setIsPlaying(true)
    }
  }
  const pausePlayback = () => {
    if (playerType === "spotify") {
      pausePlaylistTrack()
    } else if (playerType === "soundcloud") {
      pauseSoundcloud()
    }
  }
  const resumeSpotifyPlayback = () => startPlayingPlaylist()

  const initPlayer = () => {
    return new Promise((resolve, reject) => {
      const player = new window.Spotify.Player({
        name: RAPTOR_REPO_NAME,
        getOAuthToken: cb => {
          refreshToken().then(t => {
            localStorage.setItem("arcsasT", t)
            cb(t)
          })
        },
        volume: 0.5,
      })
      player.connect()
      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id)
        localStorage.setItem("deviceId", device_id)
        // getDevices()
        setChosenDevice(device_id)
        resolve()
        // Error handling
        player.addListener("initialization_error", ({ message }) => {
          console.error(message)
        })
        player.addListener("authentication_error", ({ message }) => {
          console.log("auth error")
          reject()

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
          // setTrack(currentTrack)
          setIsPlaying(!paused)
        })

        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id)
        })
        setPlayer(player)
      })
    })
  }
  return (
    <playerContext.Provider
      value={{
        antiAuth,
        chosenDevice,
        devices,
        getDevices,
        initPlayer,
        initSoundcloud,
        isPlaying,
        getAppToken,
        pausePlayback,
        pausePlaylistTrack,
        pauseSoundcloud,
        pickDevice,
        player,
        playSoundcloud,
        playSpotifyTrack,
        playerType,
        resumePlayback,
        setAntiAuth,
        setChosenDevice,
        setPlayerType,
        setSpotifyAuth,
        setTrack,
        spotifyAuth,
        track,
      }}
    >
      {/* <SEO title="freg" /> */}
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
