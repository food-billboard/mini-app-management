import { 
  App, 
  message as AntMessage, 
  notification as AntNotification, 
  Modal as AntModal
} from 'antd'
import type { MessageInstance } from 'antd/es/message/interface.d'
import type { HookAPI } from 'antd/es/modal/useModal'
import type { NotificationInstance } from 'antd/es/notification/interface.d'
import { useEffect } from 'react'

let message: MessageInstance = AntMessage
let modal: HookAPI = AntModal as any
let notification: NotificationInstance = AntNotification

const useToast = () => {

  const {
    message: internalMessage,
    modal: internalModal,
    notification: internalNotification
  } = App.useApp()

  useEffect(() => {
    message = internalMessage
    modal = internalModal
    notification = internalNotification
  }, [internalMessage, internalModal, internalNotification])

}

export {
  message,
  modal,
  notification
}

export default useToast