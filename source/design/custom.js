var options = require('./options')

module.exports = [
  typography(),
  copy(),
  media(),
  inputs(),
  extensions(),
  loader()
].join(' ')

function typography () {
  return `  
    html {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      box-sizing: border-box;
      font-size: 62.50%;
      height: auto;
    }

    body { line-height: 2rem; }

    a {
      color: ${options.colors.fg};
      text-decoration: none;
    }

    .truncate {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis; 
    }

    ::-moz-selection { background: rgba(127, 127, 127, 0.5) }
    ::selection { background: rgba(127, 127, 127, 0.5) }

    @font-face {
      font-family: 'Inter UI';
      font-style:  normal;
      font-weight: 400;
      src: url("/assets/fonts/Inter-UI-Regular.woff2?v=2.4") format("woff2"),
           url("/assets/fonts/Inter-UI-Regular.woff?v=2.4") format("woff");
    }

    @font-face {
      font-family: 'Inter UI';
      font-style:  italic;
      font-weight: 400;
      src: url("/assets/fonts/Inter-UI-Italic.woff2?v=2.4") format("woff2"),
           url("/assets/fonts/Inter-UI-Italic.woff?v=2.4") format("woff");
    }

    @font-face {
      font-family: 'Inter UI';
      font-style:  normal;
      font-weight: 700;
      src: url("/assets/fonts/Inter-UI-Bold.woff2?v=2.4") format("woff2"),
           url("/assets/fonts/Inter-UI-Bold.woff?v=2.4") format("woff");
    }
  `
}

function copy () {
  return `
    .copy > *,
    .editor-preview-side > *,
    .editor-preview > * {
      margin-top: 1.5rem; margin-bottom: 1.5rem;
    }

    .copy > *:first-child,
    .editor-preview-side > *:first-child,
    .editor-preview > *:first-child {
      margin-top: 0
    }

    .copy > *:last-child,
    .editor-preview-side > *:last-child,
    .editor-preview > *:last-child {
      margin-bottom: 0
    }

    .copy img,
    .editor-preview-side img,
    .editor-preview img {
      max-width: 100%;
    }

    .copy a,
    .editor-preview-side a,
    .editor-preview a {
      text-decoration: underline;
    }
  `
}

function media () {
  return `
    .ofc {
      object-fit: contain;
      height: 100%;
      width: 100%;
      padding: 10vmin;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .file-preview {
      max-height: 100vh;
      width: 100%;
      margin: -2rem -3rem -2rem 1rem;
      background-image: url('data:image/svg+xml;utf8,<svg height="10" width="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><rect height="5" width="5" x="0" y="0" fill="rgba(127, 127, 127, 0.15)" /><rect height="5" width="5" x="5" y="5" fill="rgba(127, 127, 127, 0.15)" /></svg>');
      background-repeat: repeat;
    }

    @media (max-width: 767px) {
      .file-preview {
        height: 100vh;
        width: 100vw;
        margin: -0.75rem;
      }

      .action-gradient { width: 100% }
    }
  `
}

function inputs () {
  return `
    .select {
      position: relative;
      width: 100%;
    }

    .select select {
      cursor: pointer;
      -moz-appearance: none;
      -webkit-appearance: none;
      background: #eee;
      line-height: 4rem;
      padding: 0 1rem;
      border-radius: 3px;
      font-family: ${options.typography.sans};
      line-height: 4rem;
      font-size: 1.8rem;
      font-weight: 400;
      outline: 0;
      width: 100%;
    }

    .select:before {
      content: '↓';
      position: absolute;
      font-size: 1.8rem;
      top: 0;
      right: 0;
      padding: 1rem;
      font-family: ${options.typography.mono};
    }

    .input {
      background: #eee;
      border-radius: 3px;
      font-family: ${options.typography.sans};
      line-height: 2rem;
      font-size: 1.8rem;
      font-weight: 400;
      outline: 0;
      width: 100%;
    }

    .input.lh1-5 { line-height: 1.5 }

    .input-disabled {
      color: #999;
    }

    [tabindex] { outline: 0 }

    textarea {
      min-height: 10rem;
    }

    button { outline: 0 }
    button:focus { outline: 0 }

    .button-large {
      display: block;
      cursor: pointer;
      font-weight: bold;
      color: #fff;
      font-size: 1.8rem;
      line-height: 6rem;
      text-align: center;
      padding: 0 4rem;
      border-radius: 3rem;
    }

    .button-medium {
      display: block;
      cursor: pointer;
      color: #fff;
      font-size: 1.8rem;
      line-height: 4rem;
      text-align: center;
      padding: 0 2rem;
      border-radius: 2rem;
    }

    .button-inline {
      background: #fff;
      color: #000;
      margin-left: 0.5rem;
      padding: 0.4rem 1rem 0.6rem;
      line-height: 1rem;
      height: 2rem;
      border-radius: 1rem;
      display: inline-block;
      border: 1px solid #000;
      text-transform: uppercase;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      cursor: pointer;
    }

    .button-inline:hover {
      background: #000;
      color: #fff;
    }
  `
}

function extensions () {
  return `
    .psst { position: sticky; position: -webkit-sticky; }
    .br1 { border-radius: 3px }

    .action-gradient {
      background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 25%);
      background: -webkit-linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 25%);
      background: -moz-linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 25%);
      position: absolute;
      bottom: 0;
      left: 0;
      height: 7rem;
      width: 33.3%;
    }

    .myc1 > * { position: relative; }

    .myc1 > *:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background: #ddd;
      height: 1px;
    }

    .myc1 > *:last-child:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: #ddd;
      height: 1px;
    }

    .breadcrumbs {
      display: flex;
      width: 100%;
      line-height: 4rem;
    }

    .breadcrumbs > a {
      display: block;
      position: relative;
      color: ${options.colors.bg70};
    }

    .breadcrumbs > a:first-child,
    .breadcrumbs > a:hover {
      color: ${options.colors.bg};
    }

    .breadcrumbs > a:not(:first-child):before {
      background: ${options.colors.bg90};
      content: '';
      display: block;
      height: 4rem;
      width: 1px;
      position: absolute;
      top: 1rem;
      right: 0;
      transform: rotate(15deg);
    }
  `
}

function loader () {
  return `
    .loader {
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
    }

    .loader {
      margin: 1.5rem;
      font-size: 3rem;
      position: relative;
      text-indent: -9999em;
      border-top: 2px solid #fff;
      border-right: 2px solid #fff;
      border-bottom: 2px solid #000;
      border-left: 2px solid #000;
      animation: load 1s infinite linear;
    }

    @keyframes load {
      0% { transform: rotate(0deg) }
      100% { transform: rotate(360deg) }
    }
  `
}