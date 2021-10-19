import { ConnectState } from '@/models/connect' 

export const mapStateToProps = (state: ConnectState) => {
  return {
    userInfo: state.user.currentUser,
  }
}

export const mapDispatchToProps = () => ({})