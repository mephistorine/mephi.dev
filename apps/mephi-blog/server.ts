import {APP_BASE_HREF} from "@angular/common"
import {CommonEngine} from "@angular/ssr"
import express from "express"
import {dirname, join, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import bootstrap from "./src/main.server"

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express()
  const serverDistFolder = dirname(fileURLToPath(import.meta.url))
  const browserDistFolder = resolve(serverDistFolder, "../browser")
  const indexHtml = join(serverDistFolder, "index.server.html")

  const commonEngine = new CommonEngine({
    enablePerformanceProfiler: true
  })

  server.set("view engine", "html")
  server.set("views", browserDistFolder)

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    "*.*",
    express.static(browserDistFolder, {
      maxAge: "1y"
    })
  )

/*  server.get("rss", (req, res, next) => {
    res.setHeader("Content-Type", "application/xml; charset=utf-8")
    res.send(`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">

<channel>
  <title>W3Schools Home Page</title>
  <link>https://www.w3schools.com</link>
  <description>Free web building tutorials</description>
  <item>
    <title>RSS Tutorial</title>
    <link>https://www.w3schools.com/xml/xml_rss.asp</link>
    <description>New RSS tutorial on W3Schools</description>
  </item>
  <item>
    <title>XML Tutorial</title>
    <link>https://www.w3schools.com/xml</link>
    <description>New XML tutorial on W3Schools</description>
  </item>
</channel>

</rss>`)
  })*/

  // All regular routes use the Angular engine
  server.get("*", (req, res, next) => {
    const {protocol, originalUrl, baseUrl, headers} = req

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{provide: APP_BASE_HREF, useValue: baseUrl}]
      })
      .then((html) => res.send(html))
      .catch((err) => next(err))
  })

  return server
}

function run(): void {
  const port = process.env["PORT"] || 4000

  // Start up the Node server
  const server = app()
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`)
  })
}

run()
