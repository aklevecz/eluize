import React from "react"
import ChevronUp from "./icons/chevron-up"
import "./scroll-up.scss"
import { lerpScrollY } from "../templates/animations"
const ScrollUp = () => {
  const scrollToTop = () => {
    lerpScrollY(document.documentElement.scrollTop, 0)
  }

  return (
    <div className="scroll-up-container" onClick={scrollToTop}>
      <ChevronUp fill="white" strole="white" />
    </div>
  )
}

export default ScrollUp
