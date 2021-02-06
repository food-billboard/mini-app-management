export const mapStateToProps = (state: any) => {
  const { data=[], total=0 } = state.dashboardAndanalysis.typeList || {} 
  return {
    data,
    total,
    loading: !!state.loading.effects['dashboardAndanalysis/getDataTypeStatisticsList']
  }
}

export const mapDispatchToProps = (dispatch: any) => ({
  fetchData: () => dispatch({ type: 'dashboardAndanalysis/getDataTypeStatisticsList' })
})