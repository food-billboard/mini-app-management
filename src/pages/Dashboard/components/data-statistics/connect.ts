export const mapStateToProps = (state: any) => {
  const { data, rank } = state.dashboardAndanalysis.dataList
  return {
    data,
    rank,
    dataLoading: !!state.loading.effects['dashboardAndanalysis/getDataStatisticsList'],
    userLoading: !!state.loading.effects['dashboardAndanalysis/getUserStatisticsList']
  }
}

export const mapDispatchToProps = (dispatch: any) => ({
  getDataStatisticsList: (params: any) => dispatch({ type: 'dashboardAndanalysis/getDataStatisticsList', ...params }),
  getUserStatisticsList: (params: any) => dispatch({ type: 'dashboardAndanalysis/getUserStatisticsList', ...params })
})