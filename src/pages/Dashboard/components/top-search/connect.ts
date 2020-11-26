import { ConnectState } from '@/models/connect'

export const mapStateToProps = (state: any) => {
  const { total, average, count_total_day, count_average_day, total_chart, average_chart, data } = state.dashboardAndanalysis.keywordData
  return {
    totalSearch: total, 
    averageSearch: average, 
    totalTrend: count_total_day, 
    averageTrend: count_average_day, 
    statisticsTopSearchChart: total_chart, 
    statisticsTopSearchAverageChart: average_chart, 
    topSearchList: data,
    loading: !!state.loading.effects['dashboardAndanalysis/getKeywordStatisticsList']
  }
}

export const mapDispatchToProps = (dispatch: any) => ({
  fetchData: (params: any={}) => dispatch({ type: 'dashboardAndanalysis/getKeywordStatisticsList', ...params })
})