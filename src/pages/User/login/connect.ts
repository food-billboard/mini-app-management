import { ConnectState } from '@/models/connect'

export const mapStateToProps = (state: ConnectState) => {
  return {
    isLogin: !!state.user.currentUser._id
  }
}

export const mapDispatchToProps = (dispatch: any) => ({
  login: (payload: {
    mobile: string
    password: string
  }) => dispatch({ type: 'user/login', payload })
})