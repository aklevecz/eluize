import React, { useRef, useEffect } from "react"
import "./popup.scss"
import { createPortal } from "react-dom"

const Popup = ({ children, overlayOnClick, title }) => {
  const popRef = useRef()
  useEffect(() => {
    const { height, width } = popRef.current.getBoundingClientRect()
    popRef.current.style.marginLeft = (width / 2) * -1 + "px"
    popRef.current.style.marginTop = (height / 2) * -1 + "px"
  })
  return createPortal(
    <>
      <div className="popup-overlay" onClick={overlayOnClick}></div>
      <div ref={popRef} className="popup">
        <div className="popup-header">{title}</div>
        {children}
      </div>
    </>,
    document.getElementById("portal")
  )
}

export default Popup
