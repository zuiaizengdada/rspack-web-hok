
import {
  dictType
} from '@/api/system/dict'
import { getTeacherCooperateStatusData } from '@/utils/getApiData'
import { getAllOrgans } from '@/api/tearchCenter/tearchSharing.js'
import initDict from '@/strings'
const dict = {
  namespaced: true,
  state: {
    dictList: { ...initDict }
  },
  getters: {
    dictList(state) {
      return state.dictList
    }
  },
  mutations: {
    setDict(state, {
      name,
      value
    }) {
      state.dictList[name] = value
    }
  },
  actions: {
    async setDict({
      commit
    }, params) {
      if (params === 'COOPERATION_TYPE') {
        const data = await getTeacherCooperateStatusData()
        commit('setDict', {
          name: params,
          value: data
        })
        return
      } else if (params === 'TEARCHER_ORGLIST') {
        const data = await getAllOrgans()
        commit('setDict', {
          name: params,
          value: data.data
        })
        return
      }
      const {
        data
      } = await dictType(params)
      commit('setDict', {
        name: params,
        value: data
      })
    }
  }

}
export default dict
