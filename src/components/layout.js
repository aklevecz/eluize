import React, { useEffect, useContext } from "react"
import PropTypes from "prop-types"
import "./layout.css"
import { playerContext } from "../../wrap-with-provider"

const Layout = ({ children }) => {
  const context = useContext(playerContext)
  useEffect(() => {
    const code = window.location.search.split("?code=")[1]
    if (!code) return
    var redirect_uri = `${window.location.protocol}//${
      window.location.hostname
    }${process.env.NODE_ENV === "development" ? ":8000" : ""}`
    fetch("https://accounts.spotify.com/api/token", {
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(
        redirect_uri
      )}`,
      headers: {
        Authorization: "Basic " + process.env.GATSBY_BB,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })
      .then(r => {
        console.log(r.status)
        if (r.status !== 200) throw new Error("invalid token")
        return r.json()
      })
      .then(data => {
        console.log(data)
        localStorage.setItem("refrashT", data.refresh_token)
        localStorage.setItem("arcsasT", data.access_token)
        context.initPlayer()
        window.close()
      })
      .catch(error => {
        localStorage.setItem("error", error)
        window.close()
      })
  }, [])

  return (
    <>
      <div className="layout">
        <main>{children}</main>
      </div>
    </>
  )
}

Layout.propTypes = {
  // children: PropTypes.node.isRequired,
}

export default Layout
