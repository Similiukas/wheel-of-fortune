# Simple wheel of fortune animation using Pixi.js

## Overview:

This is a simple demonstration of the wheel of fortune animation using pixi.js

The code is written in TypeScript with webpack as builder. This allows for ease of development and optimisation when building production scripts.

There are two parts for the front-end: `header-animation` and `wheel-animation`. These respectively control animations for the header and wheel. The code is well documented for the reader to understand what is used. A few improvements could be used such as better design, especially for various non-standard mobile device sizes. Moreover, better visualisation for the final wheel position could be used or additionally, another some indicator to show the final result.

The back-end is an incredibly simple HTTP server to listen only for one endpoint and return a random number from 0 to 3 for the position of the wheel. For production, express framework should be used for security and better scaling, however, this is just to demonstrate the functionality.

## How to install and run it:

First, make sure Node is installed, then in the project directory run:
```sh
npm install
```

After this, to get the production build, run these commands:

This will build the optimised (minified and in chunks) production files in the `dist/` directory
```sh
npm run build
```

This will start the live server and open the browser
```sh
npm start
```

*Note:* Do not forget to also start the back-end server. In another terminal run:
```sh
node server.js
```