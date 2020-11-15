import {  } from '@/services'
import { IDataState } from './data'

export default {

  namespace: 'dashboardAndanalysis',

  state: {

  },

  effects: {

  },

  reducers: {
    save(state: IDataState, { payload }: any) {
      return { ...state, ...payload }
    }
  }

}