var objectKeys = require('object-keys')
var assert = require('assert')
var xtend = require('xtend')
var Enoki = require('choo-dat-hypha/lib')

module.exports = sites

function sites (state, emitter, app) {
  var enoki = new Enoki()
  var storage

  // state
  state.sites = {
    loaded: false,
    archives: { },
    create: { },
    active: '',
    error: ''
  }

  // events
  state.events.SITES_LOADED = 'sites:loaded'
  state.events.SITE_CREATOR = 'site:creator'
  state.events.SITE_REFRESH = 'site:refresh'
  state.events.SITE_CREATE = 'site:create'
  state.events.SITES_RESET = 'sites:reset'
  state.events.SITE_LOADED = 'site:loaded'
  state.events.SITE_REMOVE = 'site:remove'
  state.events.SITE_LOAD = 'site:load'
  state.events.SITE_ADD = 'site:add'

  // listeners
  emitter.on(state.events.DOMCONTENTLOADED, handleSetup)
  emitter.on(state.events.SITE_CREATOR, handleCreator)
  emitter.on(state.events.SITE_REFRESH, handleRefresh)
  emitter.on(state.events.SITE_CREATE, handleCreate)
  emitter.on(state.events.SITE_REMOVE, handleRemove)
  emitter.on(state.events.SITES_RESET, handleReset)
  emitter.on(state.events.SITE_LOAD, handleLoad)
  emitter.on(state.events.SITE_ADD, handleAdd)

  async function handleSetup () {
    storage = window.localStorage
    state.sites.archives = JSON.parse(storage.getItem('archives')) || { }
    state.sites.active = storage.getItem('active') || ''

    if (state.sites.active) {
      emitter.emit(state.events.SITE_LOAD, { url: state.sites.active })
    } else {
      state.sites.loaded = true
      emitter.emit(state.events.RENDER)
    }
  }

  function handleCreator (data) {
    assert.equal(typeof data, 'object', 'enoki: data must be type object')
    var changes = state.sites.create
    state.sites.create = xtend(changes, data.data)
    emitter.emit(state.events.RENDER)
  }

  async function handleCreate (data) {
    var url = state.designs.public.starterkit.url
    try {
      // fork the design archive
      var archiveCreate = await DatArchive.fork(url, state.sites.create)

      // reset create state
      state.designs.create = { }

      // one time commit those changes
      emitter.once(state.events.SITE_LOADED, function () {
        emitter.emit(state.events.PANEL_SAVE, {
          path: state.content['/'].path,
          url: '/',
          page: { title: state.sites.create.title }
        })
      })

      // commit to loading
      emitter.emit(state.events.SITE_LOAD, {
        url: archiveCreate.url,
        redirect: true
      })
    } catch (err) {
      console.warn(err)
    }
  }

  async function handleAdd () {
    try {
      var archive = await DatArchive.selectArchive({
        title: 'Choose a Site or Content',
        buttonLabel: 'Add this archive',
        filters: { isOwner: true }
      })
      emitter.emit(state.events.SITE_LOAD, { url: archive.url, redirect: true })
    } catch (err) {
      state.sites.error = err.message
      emitter.emit(state.events.RENDER)
    }
  }

  async function handleLoad (props) {
    emitter.emit(state.events.PANEL_LOADING, { loading: true, render: true })

    try {
      await enoki.load(props.url)
      var archives = await enoki.getArchives()
      var content = await enoki.readContent()
      var site = await enoki.readSite()
      var info = await archives.site.getInfo()

      if (!info.isOwner) throw new Error('You must be the owner of the site')

      state.sites.archives[info.url] = info
      state.sites.active = info.url
      storage.setItem('archives', JSON.stringify(state.sites.archives))
      storage.setItem('active', info.url)

      emitter.emit(state.events.PANEL_LOAD_SITE, {
        archive: archives.content,
        content: content,
        site: site,
        render: false
      })

      emitter.emit(state.events.PANEL_LOADING, { loading: false })
      emitter.emit(state.events.SITE_LOADED)

      if (props.redirect === true) {
        emitter.emit(state.events.PUSHSTATE, '/?url=/')
      } else if (props.render !== false) {
        state.sites.loaded = true
        emitter.emit(state.events.RENDER)
      }
    } catch (err) {
      var archiveInfo = state.sites.archives[props.url]
      if (typeof archiveInfo === 'object') {
        archiveInfo.error = err.message
      }
      state.sites.error = err.message
      state.sites.loaded = true
      emitter.emit(state.events.PANEL_LOADING, { loading: false })
      emitter.emit(state.events.RENDER)
    }
  }

  async function handleRefresh (props) {
    await handleLoad({ url: state.sites.active })
    emitter.emit(state.events.RENDER)
  }

  function handleRemove (props) {
    delete state.sites.archives[props.url]
    if (props.url === state.sites.active) state.sites.active = ''
    storage.setItem('active', state.sites.active)
    storage.setItem('archives', JSON.stringify(state.sites.archives))
    if (props.render !== false) emitter.emit(state.events.RENDER)
  }

  function handleReset () {
    state.sites.active = ''
    state.sites.archives = { }
    storage.setItem('active', state.sites.active)
    storage.setItem('archives', JSON.stringify(state.sites.archives))
    emitter.emit(state.events.RENDER)
  }
}