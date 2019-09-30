import { Radio } from 'iframe-radio'
import { settingsStore, ISettings } from './utils/settings'

export class PluginGadgets {
  private key: string
  private iframeId: string
  private radio?: Radio<{ name: string; payload: any }>
  private unlistener?: () => void
  constructor(domainKey: string, random: string) {
    this.key = domainKey
    this.iframeId = `wga-plugin${random ? `-${random}` : ''}`
  }
  /**
   * Create an iframe with gadgets.
   */
  public render() {
    const iframe = document.createElement('iframe')
    iframe.src = document.location.hostname.includes('localhost')
      ? 'http://localhost:3100/'
      : 'https://plugin.wga.windowgadgets.io/'
    iframe.id = this.iframeId
    iframe.width = '100%'
    iframe.height = '100%'
    iframe.style.border = 'none'
    iframe.style.boxShadow = 'none'
    iframe.style.position = 'fixed'
    iframe.style.top = '0'
    iframe.style.bottom = '0'
    iframe.style.right = '0'
    iframe.style.left = '0'
    document.body.appendChild(iframe)
    if (this.radio) this.radio.destroy()
    this.radio = new Radio({
      id: 'wga',
      node: iframe.contentWindow,
    })
    if (this.unlistener) this.unlistener()
    this.unlistener = this.radio.listen(({ name, payload }) => {
      switch (name) {
        case 'wga:set':
          settingsStore.change(payload)
          break
        default:
          console.log(`No radio handler for ${name} action`)
          break
      }
    })
    this.radio.message({
      name: 'wga:request',
      payload: undefined,
    })
  }
  /**
   * Get the current state of the gadgets.
   */
  public get state() {
    return settingsStore.state
  }
  /**
   * Listen to changes to the internal state.
   */
  public listen(callback: (current: ISettings['current']) => void) {
    return settingsStore.listen(({ current }) => callback(current))
  }
}
