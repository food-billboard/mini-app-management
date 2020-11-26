import { ConnectState } from '@/models/connect'

export const mapStateToProps = (state: any) => {
  const { use_count, visit_day, data_count, feedback_count } = state.dashboardAndanalysis.navCard
  return {
    use_count,
    visit_day,
    data_count,
    feedback_count,
    loading: !!state.loading.effects['dashboardAndanalysis/getNavCardList']
  }
}

export const mapDispatchToProps = (dispatch: any) => ({
  fetchData: () => dispatch({ type: 'dashboardAndanalysis/getNavCardList' })
})