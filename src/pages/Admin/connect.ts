import { ConnectState } from '@/models/connect' 

export const mapStateToProps = (state: ConnectState) => {
  return {
    userInfo: state.user.currentUser,
    loading: state.loading.effects["user/fetchCurrent"] || false
  }
}

export const mapDispatchToProps = (dispatch: any) => ({
  getUserInfo: () => dispatch({ type: 'user/fetchCurrent' })
})