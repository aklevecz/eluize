import React from "react"
import SEO from "../components/seo"
import Layout from "../components/layout"
const Callback = () => {
  if (typeof window === "undefined") return <div></div>
  const code = window.location.search.split("?code=")[1]
  const redirect_uri = "http://localhost:8000/callback"
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
    .then(r => r.json())
    .then(data => {
      localStorage.setItem("refrashT", data.refresh_token)
      localStorage.setItem("arcsasT", data.access_token)
      //   window.close()
    })
    .catch(error => {
      localStorage.setItem("error", error)
      //   window.close()
    })

  return (
    <Layout>
      <div style={{ fontSize: 100, color: "white" }}>YAY</div>
    </Layout>
  )
}

export default Callback
