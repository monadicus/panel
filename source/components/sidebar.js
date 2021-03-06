var objectValues = require('object-values')
var queryString = require('query-string')
var html = require('choo/html')
var xtend = require('xtend')

var Uploader = require('../components/uploader')
var methodsFile = require('../lib/file')
var uploader = Uploader()

module.exports = sidebar

function sidebar (props, emit) {
  props = props || { }
  props.pagesActive = props.pagesActive === true
  props.filesActive = props.filesActive === true
  props.uploadActive = props.uploadActive === true

  var pagePages = objectValues(props.page.pages || { }).map(function (pagePage) {
    return props.content[pagePage.url]
  })

  var pageFiles = objectValues(props.page.files || { }).map(function (pageFile) {
    var data = xtend(pageFile, { })
    data.urlPanel = queryString.stringify(xtend({
      file: methodsFile.encodeFilename(pageFile.filename)
    }, props.query))
    data.urlPanel = unescape(data.urlPanel)
    return data
  })

  return html`
    <div id="sidebar" class="c12">
      <div class="psst p1" style="top: 0.75rem;">
        ${props.pagesActive ? elPages() : ''}
        ${props.filesActive ? elFiles() : ''}
      </div>
    </div>
  `

  function elPage () {
    return html`
      <div id="sidebar-page" class="mb2">
        <div class="x xjb c12 py1 fs0-8 ttu fc-bg25 usn">
          <div class="fwb">
            Page
          </div>
          <div class="dn">
            <a class="button-inline">Settings</a>
          </div>
        </div>
        <ul class="c12 myc1 lsn">
          ${props.site.info
            ? html`
              <div>
                <a
                  href="${props.site.info.url}${props.page.url}"
                  target="_blank"
                  class="button-inline"
                >View in Site</a>
              </div>
            `
            : ''
          }
        </ul>
      </div>

    `
  }

  function elPages () {
    var urlPageNew = unescape(queryString.stringify(xtend({ page: 'new' }, props.query)))
    var urlPagesAll = unescape(queryString.stringify(xtend({ pages: 'all' }, props.query)))
    return html`
      <div id="sidebar-pages" class="mb2">
        <div class="x xjb c12 py1 fs0-8 ttu usn">
          <div class="fwb">
            <a href="?${urlPagesAll}" class="fc-bg25 fch-fg">Pages</a>
          </div>
          <div>
            <a href="?${urlPageNew}" class="button-inline">Create</a>
            <a href="?${urlPagesAll}" class="button-inline">All</a>
          </div>
        </div>
        <ul class="c12 myc1 lsn">
          ${elsChildren(pagePages)}
        </ul>
      </div>
    `
  }

  function elFiles () {
    var urlFileNew = unescape(queryString.stringify(xtend({ file: 'new' }, props.query)))
    var urlFilesAll = unescape(queryString.stringify(xtend({ files: 'all' }, props.query)))
    return html`
      <div id="sidebar-files" class="mb2 psr">
        <div class="x xjb py1 fs0-8 ttu usn">
          <div class="fwb">
            <a href="?${urlFilesAll}" class="fc-bg25 fch-fg">Files</a>
          </div>
          <div>
            <a
              href="?${urlFileNew}"
              class="button-inline"
              onclick=${handleFilesAdd}
            >Upload</a>
            <a href="?${urlFilesAll}" class="button-inline">All</a>
          </div>
        </div>
        ${props.handleFilesUpload ? elUploadContainer() : ''}
        <ul class="c12 myc1 lsn">
          ${elsFiles(pageFiles)}
        </div>
      </div>
    `
  }

  function elUploadContainer () {
    return html` 
      <div class="
        ${props.uploadActive ? 'x' : 'dn'}
        bgc-bg fc-fg psa t0 l0 r0 b0 x xjc xac z2
      ">
        ${uploader.render({
          text: 'Drag and drop here to add file',
          handleFiles: props.handleFilesUpload,
          handleDragEnter: function (event) {
            var el = event.target.parentNode.parentNode.parentNode
            el.classList.remove('bgc-bg', 'fc-fg')
            el.classList.add('bgc-fg', 'fc-bg')
          },
          handleDragLeave: function (event) {
            var el = event.target.parentNode.parentNode.parentNode
            el.classList.add('bgc-bg', 'fc-fg')
            el.classList.remove('bgc-fg', 'fc-bg')
          }
        }, emit)}
      </div>
    `
  }

  function handleFilesAdd (event) {
    uploader.open()
    event.preventDefault()
  }
}

function elsChildren (children) {
  children = children || [ ]

  if (children.length <= 0) {
    return html`
      <li class="m0 py1 fc-bg25">
        No sub-pages
      </li>
    `
  }

  return children
    .slice(0, 6)
    .map(function (child) {
      if (!child.url) return
      return html`
        <li id="page-${child.url}" class="m0">
          <a
            href="?url=${child.url}"
            class="db py1 truncate"
            ondragstart=${handleDragStart}
          >${child.title || child.name}</a>
        </li>
      `

    function handleDragStart (event) {
      event.dataTransfer.setData('text/plain', `[${child.title}](${child.url})`)
    }
  })
}

function elsFiles (files) {
  files = files || [ ]

  // Hide if there is nothing
  if (files.length <= 0) return html`
    <li class="m0 py1 fc-bg25">
      No files
    </li>
  `

  return files
    .slice(0, 6)
    .map(function (child) {
      if (!child.url) return
      return html`
        <li id="${child.url}" class="m0">
          <a
            href="?${child.urlPanel}"
            class="db py1 truncate"
            ondragstart=${handleDragStart}
          >${child.filename}</a>
        </li>
      `

    function handleDragStart (event) {
      event.dataTransfer.setData('text/plain', '![](' +child.source + ')')
    }
  })
}