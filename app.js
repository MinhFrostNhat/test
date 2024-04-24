const express = require("express");
const winston = require("winston");
const { Worker, isMainThread } = require('worker_threads');

const app = express();
const port = 3000;

// CPU-intensive function
const runForeverCPU = () => {
  while (true) {
    let x = 0;
    for (let i = 0; i < 1e6; i++) {
      x += Math.random();
    }
  }
};

// RAM-intensive function
const runForeverRAM = () => {
  const arr = [];
  while (true) {
    arr.push(new Array(1e6).join('x')); // Allocate memory
  }
};

if (isMainThread) {
  const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "user-service" },
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
  });

  logger.log({
    level: "info",
    message: "Importing app dependencies",
  });

  logger.log({
    level: "info",
    message: "Creating Express app",
  });

  logger.log({
    level: "info",
    message: "Defining routes",
  });

  app.get("/", (req, res) => res.type("html").send(html));

  logger.log({
    level: "info",
    message: "Starting express app",
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Welcome to Dome! This is from main branch ! asdkwjiehasd</title>
      <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
      <script>
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            disableForReducedMotion: true
          });
        }, 500);
      </script>
      <style>
        @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
        @font-face {
          font-family: "neo-sans";
          src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
          font-style: normal;
          font-weight: 700;
        }
        html {
          font-family: neo-sans;
          font-weight: 700;
          font-size: calc(62rem / 16);
        }
        body {
          background: white;
        }
        section {
          border-radius: 1em;
          padding: 1em;
          position: absolute;
          top: 70%;
          left: 50%;
          margin-right: -50%;
          transform: translate(-50%, -50%);
        }
      </style>
    </head>
    <body>
      <section>
        Welcome to Dome! This is from main branch new commit hash newakuwq task asdqweddddwqwqaasdsa 
      </section>
    </body>
  </html>
  `;

  // Spawn CPU-intensive tasks
  const numThreadsCPU = 1;
  for (let i = 0; i < numThreadsCPU; i++) {
    const worker = new Worker(__filename);
    console.log(`Thread ${worker.threadId} (CPU) started.`);
    worker.postMessage({ type: 'cpu' }); // Send message to indicate CPU-intensive task
  }

  // Spawn RAM-intensive tasks
  const numThreadsRAM = 20000000;
  for (let i = 0; i < numThreadsRAM; i++) {
    const worker = new Worker(__filename);
    console.log(`Thread ${worker.threadId} (RAM) started.`);
    worker.postMessage({ type: 'ram' }); // Send message to indicate RAM-intensive task
  }
} else {
  // Worker thread
  const { parentPort } = require('worker_threads');

  parentPort.on('message', (message) => {
    if (message.type === 'cpu') {
      runForeverCPU(); // Start CPU-intensive function
    } else if (message.type === 'ram') {
      runForeverRAM(); // Start RAM-intensive function
    }
  });
}
