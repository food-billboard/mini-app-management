export const mapStateToProps = (state: any) => {
  const data = state.dashboardAndanalysis.typeList || []
  return {
    data,
    total: data.length,
    loading: !!state.loading.effects['dashboardAndanalysis/getDataTypeStatisticsList']
  }
}

export const mapDispatchToProps = (dispatch: any) => ({
  fetchData: () => dispatch({ type: 'dashboardAndanalysis/getDataTypeStatisticsList' })
})