var Nanocomponent = require('nanocomponent')
var html = require('choo/html')

module.exports = Modal

function Modal () {
  if (!(this instanceof Modal)) return new Modal()
  this.handleContainerClick = this.handleContainerClick.bind(this)
  Nanocomponent.call(this)
}

Modal.prototype = Object.create(Nanocomponent.prototype)

Modal.prototype.createElement = function (props) {
  this.content = props.content
  this.handleContainerClick = props.handleContainerClick || this.handleContainerClick
  this.className = props.className || ''

  return html`
    <div
      id="modal"
      class="p1 psf t0 l0 r0 b0 x xjc xac z3"
      style="margin-left: 7rem"
    >
      <div
        class="psr z2 ${this.className}"
      >
        ${this.content} 
      </div>
      <div
        class="psa t0 l0 r0 b0 z1 curp"
        style="background: rgba(20, 20, 20, 0.75)"
        onclick=${this.handleContainerClick}
      ></div>
    </div>
  `
}

Modal.prototype.update = function (state) {
  return true
}

Modal.prototype.handleContainerClick = function(event) {

}