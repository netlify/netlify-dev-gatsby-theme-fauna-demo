import React, { useState } from "react"
// import Layout from "../components/layout"
// import SEO from "../components/seo"
import { graphql } from "gatsby"

// 0 dependency axios clone with fauna endpoint baked in
const xios = {
  get: _xios("GET"),
  post: _xios("POST"),
  put: _xios("PUT"),
  delete: _xios("DELETE")
}

/** main page layout */
export default function Guestbook(props) {
  const { data } = props
  const siteTitle = data.site.siteMetadata.title

  const [messages, setMessages] = React.useState([])
  const [status, setStatus] = useState(null)

  const refresh = () => {
    setStatus([true, "loading..."])
    return xios
      .get()
      .then(x => console.log(x) || setMessages(x.reverse()))
      .then(() => setStatus(null))
  }
  const deleteMsg = ref => () => {
    setStatus([true, "deleting..."])
    xios
      .delete(ref["@ref"].id)
      .then(refresh)
      .then(() => setStatus(null))
      .catch(err => {
        throw new Error(err)
      })
  }
  React.useEffect(() => void refresh(), [])
  return (
    // <Layout location={props.location} title={siteTitle}>
    <div style={{ transition: "all 0.5s" }}>
      {/* <SEO title="Guestbook" /> */}
      <h1>Guestbook</h1>
      <p>leave a message after the tone!</p>
      {!messages.length ? (
        <Pre> Guestbook is empty! Say something! </Pre>
      ) : (
        <div>
          {messages.map(({ data: { name, message }, ref }, i) => {
            return <Comment key={i} {...{ name, message, handler: deleteMsg(ref) }} />
          })}
        </div>
      )}
      {status &&
        (status[0] /** loading or error state */ ? (
          <Spinner />
        ) : (
          <div>
            <Pre>{status[1]}</Pre>
          </div>
        ))}
      <CommentForm {...{ refresh, setStatus }} />
    </div>
    // </Layout>
  )
}

/** main form component */
function CommentForm({ refresh, setStatus }) {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  const handler = e => {
    e.preventDefault()
    setName("") || setMessage("") || setStatus([true, "submitting..."])
    xios
      .post("", { body: JSON.stringify({ name, message }) })
      .then(() => setStatus([true, "success!"]))
      .then(refresh)
      .then(() => setStatus(null))
      .catch(err => setStatus([false, "failed!"]))
  }
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <form
        onSubmit={handler}
        style={{
          display: "inline-flex",
          flexDirection: "column"
        }}
      >
        <label style={{ marginBottom: 20 }}>
          <div>Name:</div>
          <NiceInput type="text" value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label style={{ marginBottom: 20 }}>
          <div>Message:</div>
          <NiceInput value={message} onChange={e => setMessage(e.target.value)} required />
        </label>
        <button style={{ background: "palegoldenrod", borderRadius: 5 }}>Submit</button>
      </form>
    </div>
  )
}

/**
 *
 * EVERYTHING BELOW IS MINOR DETAILS
 *
 */

/** gatsby doing its thing */
export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

/** just some styled components */
function Comment({ name, message, handler }) {
  return (
    <div>
      <blockquote
        style={{
          background: "rgba(100,200,200,0.1)",
          marginLeft: 0,
          padding: "10px 30px"
        }}
      >
        {message}
        <div style={{ textAlign: "right", fontStyle: "normal" }}>
          <b>{name}</b>
          <button
            style={{
              border: 0,
              cursor: "pointer",
              background: "palegoldenrod",
              borderRadius: 5,
              margin: 10
            }}
            onClick={handler}
          >
            x
          </button>
        </div>
      </blockquote>
    </div>
  )
}

function Pre({ children }) {
  return (
    <pre
      style={{
        background: "rgba(20,80,80,0.4)",
        borderRadius: 10,
        padding: 10
      }}
    >
      {children}
    </pre>
  )
}

function NiceInput(props) {
  return (
    <input
      {...props}
      style={{
        background: "rgba(0,0,0,0.15)",
        border: "none",
        borderRadius: 10,
        padding: "5px 10px"
      }}
    />
  )
}
/** lets have a nice spinner http://tobiasahlin.com/spinkit/ */
function Spinner() {
  return (
    <div className="spinner">
      <div className="rect1" />
      <div className="rect2" />
      <div className="rect3" />
      <div className="rect4" />
      <div className="rect5" />
    </div>
  )
}

/** just a nice wrapper over fetch */
function _xios(method) {
  return (endpoint = "", obj = {}) => {
    endpoint = "/.netlify/functions/fauna/" + endpoint // bake in the endpoint
    const defaultObj = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
    const finalObj = Object.assign(defaultObj, { method }, obj)
    return fetch(endpoint, finalObj).then(res =>
      finalObj.headers["Content-Type"] === "application/json" ? res.json() : res
    )
  }
}
