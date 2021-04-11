import { getNavCardList, getDataStatisticsList, getUserStatisticsList, getVisitStatisticsList, getKeywordStatisticsList, getDataTypeStatisticsList } from './service'

export default {

  namespace: 'dashboardAndanalysis',

  state: {
    navCard: {},
    dataList: {},
    visitList: [],
    keywordData: {},
    typeList: {
      data: [],
      total: {}
    }
  },

  effects: {

    * initData(_: any, { call, put }: { call: any, put: any }) {
      const navCard = yield call(getNavCardList)
      const dataList = yield call(getDataStatisticsList)
      const userList = yield call (getUserStatisticsList)
      const visitList = yield call (getVisitStatisticsList)
      const keywordData = yield call(getKeywordStatisticsList)
      const typeList = yield call(getDataTypeStatisticsList)

      yield put({
        type: 'save',
        payload: {
          navCard,
          dataList,
          userList,
          visitList,
          keywordData,
          typeList
        }
      })

    },
    
    * getNavCardList(_: any, { call, put }: { call: any, put: any }) {
      const navCard = yield call(getNavCardList)

      yield put({
        type: 'save',
        payload: {
          navCard
        }
      })
    },
    
    * getDataStatisticsList(params: {
      date_type?: 'year' | 'month' | 'week' | 'day'
      start_date?: string
      end_date?: string
    }, { call, put }: { call: any, put: any }) {
      const dataList = yield call(getDataStatisticsList, params)
      yield put({
        type: 'save',
        payload: {
          dataList
        }
      })
    },
    
    * getUserStatisticsList(params: {
      date_type?: 'year' | 'month' | 'week' | 'day'
      start_date?: string
      end_date?: string
    }, { call, put }: { call: any, put: any }) {
      const dataList = yield call(getUserStatisticsList, params)

      yield put({
        type: 'save',
        payload: {
          dataList
        }
      })
    },
    
    * getVisitStatisticsList(params: {
      date_type?: 'year' | 'month' | 'week' | 'day'
      start_date?: string
      end_date?: string
    }, { call, put }: { call: any, put: any }) {
      const visitList = yield call(getVisitStatisticsList, params)

      yield put({
        type: 'save',
        payload: {
          visitList
        }
      })
    },
    
    * getKeywordStatisticsList(params: {
      currPage?: number
      pageSize?: number
      sort?: string
    }, { call, put }: { call: any, put: any }) {
      
      const keywordData = yield call(getKeywordStatisticsList, params)

      yield put({
        type: 'save',
        payload: {
          keywordData
        }
      })

    },
    
    * getDataTypeStatisticsList(_: any, { call, put }: { call: any, put: any }) {
      const typeList = yield call(getDataTypeStatisticsList)
      yield put({
        type: 'save',
        payload: {
          typeList
        }
      })
      
      return typeList
    },

  },

  reducers: {
    save(state: any, { payload }: any) {
      return { ...state, ...payload }
    }
  }

}