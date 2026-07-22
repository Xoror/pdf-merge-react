import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "../node_modules/stargazer-ui/styles/stargazerui.css"

import './global.scss'
import PdfMerge from "./App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PdfMerge />
  </StrictMode>,
)
