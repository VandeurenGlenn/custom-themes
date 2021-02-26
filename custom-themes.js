globalThis.__customElements__ = globalThis.__customElements__ || {}
globalThis.__customElements__.themes = globalThis.__customElements__.themes || {}

export default customElements.define('custom-themes', class CustomThemes extends HTMLElement {
  static get observedAttributes() {
    return ['theme']
  }

  constructor() {
    super()
  }

  connectedCallback() {
    if (!this.theme) this.theme = 'default'
  }

  attributeChangedCallback(name, old, value) {
    if (this[name] !== value) this[name] = value
  }

  set theme(value) {
    this._observer(value)
  }

  get theme() {
    return this.getAttribute('theme')
  }

  async _importTheme(theme) {
    const importee = await import(`./themes/${theme}.js`)
    globalThis.__customElements__.themes[theme] = importee.default
  }

  async _observer(theme) {
    if (this.theme === theme) return
    else this.setAttribute('theme', theme)

    if (!globalThis.__customElements__.themes[theme]) await this._importTheme(theme)

    theme = globalThis.__customElements__.themes[theme]
    for (const key of Object.keys(theme)) {
      document.querySelector('body').style.setProperty(`--${key}`, theme[key])
    }

    // TODO: replace with pubsub
    document.dispatchEvent(new CustomEvent('custom-themes-ready'))
  }
})
