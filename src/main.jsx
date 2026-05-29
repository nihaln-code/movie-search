// React's core library — gives us the tools to build UIs with components
import { StrictMode } from 'react'
// createRoot is how we attach React to the HTML page
import { createRoot } from 'react-dom/client'
// Our global CSS file — the one line inside loads all of Tailwind's utility classes
import './index.css'
// The root component of our app — everything else lives inside this
import App from './App.jsx'

// Find the <div id="root"> in index.html and hand it to React.
// From this point on, React controls everything inside that div.
createRoot(document.getElementById('root')).render(
  // StrictMode is a development tool — it runs each component twice
  // to help catch bugs early. It has no effect in the final build.
  <StrictMode>
    <App />
  </StrictMode>,
)
