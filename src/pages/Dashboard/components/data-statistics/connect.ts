export const mapStateToProps = (state: any) => {
  const { data, rank } = state.dashboardAndanalysis.dataList
  return {
    data,
    rank,
    loading: !!state.loading.effects['dashboardAndanalysis/getDataStatisticsList']
  }
}

export const mapDispatchToProps = (dispatch: any) => ({
  fetchData: (params: any) => dispatch({ type: 'dashboardAndanalysis/getDataStatisticsList', ...params })
})