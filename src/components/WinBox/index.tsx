import WinBox from 'winbox'

let instance: WinBox

export function MediaMiniView(title: string, options?: WinBox.Params) {
  if(!instance) {
    instance = new WinBox(title, options)
  }else {
    instance.setTitle(title)
  }
  return instance
}

