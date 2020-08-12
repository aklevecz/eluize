export default position_ms => {
  return fetch(
    `https://api.spotify.com/v1/me/player/seek?device_id=${localStorage.getItem(
      "deviceId"
    )}&position_ms=${position_ms}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("arcsasT")}`,
      },
    }
  ).catch(error => console.log(error))
}
