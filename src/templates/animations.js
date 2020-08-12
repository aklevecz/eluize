export const lerpTranslateY = (el, start, finish) => {
  let frame
  let counter = 0
  let val = start
  const animate = () => {
    if (counter > 1) {
      return cancelAnimationFrame(frame)
    }
    val = start + (finish - start) * easeIn(counter)
    el.setAttribute("transform", `translate(0, ${val})`)
    counter += 0.1
    requestAnimationFrame(animate)
  }
  animate()
}

export const lerpTranslateXY = (
  el,
  startX,
  finishX,
  startY,
  finishY,
  c = 0.01
) => {
  return new Promise(resolve => {
    let frame
    let counter = 0
    let valX = startX
    let valY = startY
    const animate = () => {
      valX = startX + (finishX - startX) * easeIn(counter)
      valY = startY + (finishY - startY) * easeIn(counter)
      el.setAttribute("transform", `translate(${valX}, ${valY})`)
      if (counter > 1) {
        resolve()
        return cancelAnimationFrame(frame)
      }
      counter += c
      requestAnimationFrame(animate)
    }
    animate()
  })
}

export const lerpScrollY = (start, finish) => {
  let frame
  let counter = 0
  let val = start
  const animate = () => {
    val = start + (finish - start) * easeOutSine(counter)
    window.scrollTo(0, val)
    counter += 0.01
    if (counter > 1) {
      return cancelAnimationFrame(frame)
    }
    requestAnimationFrame(animate)
  }
  animate()
}

export const lerpOpacityOut = el => {
  return new Promise((resolve, reject) => {
    let frame
    let counter = 0
    let val = 1
    const start = 1
    const finish = 0
    const animate = () => {
      val = start + (finish - start) * easeOutSine(counter)
      el.style.opacity = val
      counter += 0.01
      if (counter > 1) {
        resolve()
        return cancelAnimationFrame(frame)
      }
      requestAnimationFrame(animate)
    }
    animate()
  })
}

export const lerpOpacityIn = el => {
  return new Promise((resolve, reject) => {
    let frame
    let counter = 0
    let val = 0
    const start = 0
    const finish = 1
    const animate = () => {
      val = start + (finish - start) * easeIn(counter)
      el.style.opacity = val
      counter += 0.01
      if (counter > 1) {
        resolve()
        return cancelAnimationFrame(frame)
      }
      requestAnimationFrame(animate)
    }
    animate()
  })
}

function easeIn(x) {
  return 1 - Math.cos((x * Math.PI) / 2)
}

function easeOutSine(x) {
  return Math.sin((x * Math.PI) / 2)
}
