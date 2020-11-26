import { ConnectState } from '@/models/connect'

export const mapStateToProps = (state: any) => {
  const data = state.dashboardAndanalysis.visitList
  return {
    data,
    loading: !!state.loading.effects['dashboardAndanalysis/getVisitStatisticsList']
  }
}

export const mapDispatchToProps = (dispatch: any) => ({
  fetchData: (params: any={}) => dispatch({ type: 'dashboardAndanalysis/getVisitStatisticsList', ...params })
})