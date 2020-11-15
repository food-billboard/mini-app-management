import { ConnectState } from '@/models/connect'

export const mapStateToProps = (state: ConnectState) => {
  return {
    loading: state.loading
  }
}

export const mapDispatchToProps = (dispatch: any) => ({

})