import React from "react"

export default ({ siteTitle }) => {
  return (
    <nav style={{ borderBottom: "3px solid black", display: "flex", justifyContent: "space-between", alignItems:"center" }}>
      <h1 style={{ display: "inline-block" }}>{siteTitle}</h1>
      <div style={{ display: "inline-block" }}>
        <a href="/">back to presentation >> </a>
      </div>
    </nav>
  )
}
