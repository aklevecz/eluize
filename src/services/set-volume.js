export default volume => {
  return fetch(
    `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("arcsasT")}`,
      },
    }
  ).catch(error => console.log(error))
}
