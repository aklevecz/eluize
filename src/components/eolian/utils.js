export const ebid = id => document.querySelector(`#${id}`)
export const hel = e => (e.style.visibility = "hidden")
export const getBaseId = e => e.id.split("-")[0]
export const addClass = (e, c) => e.classList.add(c)
export const isDesk = () => {
  if (typeof window !== "undefined")
    return window.innerWidth > window.innerHeight
}
export const collectTextEls = g => {
  const texts = g.getElementsByTagName("text")
  return Array.from(texts)
}

export const collectCoords = g => {
  const targets = g.getElementsByTagName("text")
  const data = {}
  Array.from(targets).forEach(target => {
    const baseId = getBaseId(target)
    const transform = target
      .getAttribute("transform")
      .split("(")[1]
      .split(")")[0]
      .split(" ")
    const x = parseFloat(transform[0])
    const y = parseFloat(transform[1])
    data[baseId] = { x, y }
  })
  return data
}

export const movePercentBar = v => {
  const x1 = parseInt(ebid("volume-target").getAttribute("x1"))
  const x2 = parseInt(ebid("volume-target").getAttribute("x2"))

  ebid("volume-percent").setAttribute("x2", x1 + (x2 - x1) * (v / 100))
}
