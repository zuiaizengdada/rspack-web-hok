<template>
  <div class="online-off-search">
    <div class="on-off-search-top">
      <div v-if="roleFlag === 1">
        <div v-if="onlineAndOfflineForm.formData.employeeDeptId" @click="backToQye">
          <MTitle class="on-off-search-title" style=" cursor: pointer;"><em class="back-to-qy">返回</em>部门经营数据</MTitle>
        </div>
        <MTitle v-else class="on-off-search-title" title="企业经营数据" />
      </div>
      <div v-else-if="roleFlag === 2">
        <MTitle class="on-off-search-title" title="部门经营数据" />
      </div>
      <div class="yingshou-yj-cls">
        <RevenueOrYj ref="revenueOrYj" @changeFormData="changeFormData" />
      </div>
      <AppDatepicker
        ref="appDatepickerDashboard"
        style="width: 636px; float: right;"
        :show="[0,1, 2, 3, 4]"
        :default="3"
        :search="onlineAndOfflineForm.formData.time"
        :picker-options="pickerOptions"
        @change="timeChange"
      />
    </div>
    <div class="search-cls">
      <chooseType ref="chooseType" @changeFormData="changeFormData" @changeFormDataCom="changeFormDataCom" />
    </div>
    <div class="search-cls">
      <chooseChannel v-show="!formSearchForm.employeeDeptId && formSearchForm.offlineFlag === 0" ref="chooseChannel" @changeFormData="changeFormData" @changeBizTypeForForm="changeBizTypeForForm" />
    </div>
    <div class="search-cls">
      <div class="on-off-search-data">
        <HokSearchForm
          :form-opts="onlineAndOfflineForm"
          :ref-obj.sync="onlineAndOfflineForm.ref"
          :is-more-outside="false"
          class="pd20"
        >
          <template #deptArray>
            <el-cascader
              ref="cascader1"
              v-model="onlineAndOfflineForm.formData.employeeDeptId"
              :options="deptList"
              :props="cascaderProps"
              :show-all-levels="false"
              :clearable="roleFlag === 1"
              @change="changeBumen"
            />
          </template>
          <template #employeeUid>
            <el-select v-model="onlineAndOfflineForm.formData.employeeUid" clearable filterable @change="changeEmployeeId">
              <el-option
                v-for="item in userArray"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
          </template>
          <template #teacherIdList>
            <TeacherSelect
              ref="teacherSelect"
              class="tearch-cls"
              :default-tearch-id="onlineAndOfflineForm.formData.teacherId"
              :value="onlineAndOfflineForm.formData.lecturerName"
              @selected="teacherSelect"
            />
          </template>
          <template v-if="onlineAndOfflineForm.formData.employeeDeptId && revenType === 2" #orderChannel>
            <el-select v-model="orderDataChannel" clearable @change="changeChannelType">
              <el-option
                v-for="(item, index) in channelSourceArray"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
          <template v-else #orderChannel>
            <el-cascader
              ref="cascader1"
              v-model="onlineAndOfflineForm.formData.orderChannel"
              :options="newChannelSourceArray"
              :props="cascaderPropsForOrderChannel"
              clearable
              @change="searchFn"
            />
          </template>
          <template #itemIdList>
            <el-select
              v-model="onlineAndOfflineForm.formData.itemIdList"
              class="goods-choose-cls"
              multiple
              filterable
              :filter-method="getGoodsList"
              @change="goodsChange"
            >
              <el-option
                v-for="item in goodsList"
                :key="item.goodsId"
                :label="item.contentName"
                :value="item.goodsId"
              />
            </el-select>
          </template>
        </HokSearchForm>
        <div class="right-fixed">
          <el-button class="right-fixed-btn" type="primary" @click="getAccountPlacement">投放账号数据</el-button>
        </div>
      </div>
    </div>

    <tfDataDrawer ref="tfDataDrawer" />
  </div>

</template>

<script>
import AppDatepicker from './appDatePicker'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import tfDataDrawer from './accountPlacement/tfDataDrawer.vue'
import { onlineAndOfflineForm } from './searchAndTable'
import { cloneDeep } from 'lodash'
import {
  deptTree,
  userNoPage
} from '@/api/addressBookApi'
import moment from 'moment'
import TeacherSelect from './tearchSelect.vue'
import { getShowGoodsList } from '@/api/course'
import { getShopList, getDeptCategoryMess, getOfflineFlag } from '@/api/business/onlineAndOffline'
import { getNewChannelSource } from '@/api/option'
import { mapGetters } from 'vuex'
import { getItem } from '@/utils/localStorage'
import chooseType from './onlineAndOffline/chooseType'
import chooseChannel from './onlineAndOffline/chooseChannel.vue'
import RevenueOrYj from './onlineAndOffline/revenueOrYj.vue'
export default {
  components: {
    AppDatepicker,
    HokSearchForm,
    tfDataDrawer,
    TeacherSelect,
    chooseType,
    chooseChannel,
    RevenueOrYj
  },
  props: {
    roleFlag: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      formSearchForm: {},
      channelSourceArray: [],
      newChannelSourceArray: [],
      orgInfo: '',
      orderDataChannel: '',
      revenType: 1,
      goodsList: [],
      deptList: [],
      userArray: [],
      channelDataArray: [],
      cascaderProps: {
        checkStrictly: true,
        emitPath: false,
        value: 'id'
      },
      cascaderPropsForOrderChannel: {
        checkStrictly: true,
        value: 'value'
      },
      currentTime: '',
      onlineAndOfflineForm: {
        ...cloneDeep(onlineAndOfflineForm.form),
        operatorList: [
          { label: '搜索', fn: this.searchFn },
          {
            label: '重置',
            fn: this.clearFn,
            type: 'plain',
            bind: { plain: true }
          }
        ]
      },
      pickerOptions: {
        disabledDate: (time) => {
          // 先限制今天之前
          if (time.getTime() > Date.now()) {
            return true
          }
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            // 2个月以内
            const minTime = moment(this.currentTime).subtract(12, 'month').valueOf()
            const maxTime = moment(this.currentTime).add(12, 'month').valueOf()
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  provide() {
  },
  mounted() {
    this.orgInfo = getItem('orgInfo')
    this.getNewChannelSource()
    this.$nextTick(() => {
      this.loadDeptList()
      this.loadUserNoPage()
      // this.loadChannelSourceData()
      // this.$refs.appDatepickerDashboard.changeMorenTime(this.onlineAndOfflineForm.formData.time)
    })

    const setBusinessOtherData = JSON.parse(sessionStorage.getItem('setBusinessOtherData') || '{}')
    const nowUserOrgId = localStorage.getItem('userDeptId')
    if (this.userInfo.userId === setBusinessOtherData.userId && setBusinessOtherData.userOrgId === nowUserOrgId) {
      const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
      if (setBuObj.teacherId) {
        this.onlineAndOfflineForm.formData.teacherId = setBuObj.teacherId
        this.onlineAndOfflineForm.formData.lecturerName = setBuObj.lecturerName
      }
      if (setBuObj.orderChannel) {
        this.onlineAndOfflineForm.formData.orderChannel = setBuObj.orderChannel
      }
      if (setBuObj.itemIdList) {
        this.onlineAndOfflineForm.formData.itemIdList = setBuObj.itemIdList
        const setGoodsListData = JSON.parse(sessionStorage.getItem('setGoodsListData') || '{}')
        this.goodsList = setGoodsListData.goodsListed
      }
      if (setBuObj.time.time[0]) {
        this.onlineAndOfflineForm.formData.time = setBuObj.time
        this.$nextTick(() => {
          this.$refs.appDatepickerDashboard.changeAndFillDate(setBuObj.time)
        })
      }

      if (setBusinessOtherData.chooseType) {
        this.onlineAndOfflineForm.formData.chooseType = setBusinessOtherData.chooseType
      } else {
        this.onlineAndOfflineForm.formData.chooseType = 1
      }
      if (setBusinessOtherData.productCategory) {
        this.onlineAndOfflineForm.formData.productCategory = setBusinessOtherData.productCategory
      } else {
        this.onlineAndOfflineForm.formData.productCategory = 999
      }
      if (setBusinessOtherData.offlineFlag) {
        this.onlineAndOfflineForm.formData.offlineFlag = setBusinessOtherData.offlineFlag
      } else {
        this.onlineAndOfflineForm.formData.offlineFlag = 0
      }
    }
  },
  created() {
  },
  methods: {
    changeOnlineOrOffline() {
      this.$nextTick(() => {
        this.$refs.chooseType.loadData(this.formSearchForm)
      })
    },
    init(item) {
      this.formSearchForm = item
      this.$nextTick(() => {
        this.$refs.chooseType.loadData(item)
        this.$refs.revenueOrYj.init(item)
      })
    },
    returnHasDeptId(tree, targetId) {
    // 遍历树中的每个节点
      for (const node of tree) {
        // 如果当前节点的 id 与目标 id 匹配，返回 true
        if (node.id === targetId) {
          return true
        }
        // 如果当前节点有子节点，递归调用 findIdInTree
        if (node.children && node.children.length > 0) {
          if (this.returnHasDeptId(node.children, targetId)) {
            return true
          }
        }
      }
      // 如果遍历完所有节点都没有找到匹配的 id，返回 false
      return false
    },
    getNewChannelSource() {
      const param = {
        isUse: true,
        tenantId: this.orgInfo.organizationId
      }
      getNewChannelSource(param).then(res => {
        if (res.code === 1) {
          this.newChannelSourceArray = res.data
          this.channelSourceArray = []
          this.newChannelSourceArray.some(item => {
            item.value = item.channelSource
            item.label = item.channelSourceName
            this.channelSourceArray.push(item)
            item.children = item.shopList
            item.children.some(obj => {
              obj.value = obj.shopId
              obj.label = obj.shopName
            })
          })
        }
      })
    },
    huidiaoChooseType() {
      this.$nextTick(() => {
        this.$refs.revenueOrYj.huidiao()
      })
    },
    setChooseType(item) {
      this.$nextTick(() => {
        this.$refs.revenueOrYj.revenType = item.chooseType
      })
    },
    changeChannelTypeReturn() {
      return this.$refs.chooseChannel.channelType
    },
    changeChannelType() {
      this.onlineAndOfflineForm.formData.orderChannel = []
      this.formSearchForm.orderChannel = []
      this.onlineAndOfflineForm.formData.orderChannel.push(this.orderDataChannel)
      this.formSearchForm.orderChannel.push(this.orderDataChannel)
      this.searchFn()
    },
    changeBumen(val) {
      if (val) {
        this.findSecordDepartMentId(this.deptList, val)
        this.formSearchForm.employeeDeptId = val
      } else {
        this.onlineAndOfflineForm.formData.employeeDeptId = ''
        this.formSearchForm.employeeDeptId = ''
        this.onlineAndOfflineForm.formData.employeeSecondDeptId = ''
        this.formSearchForm.employeeSecondDeptId = ''
        this.searchFn()
      }
    },
    changeBumenFormChart(val) {
      this.onlineAndOfflineForm.formData.employeeDeptId = val
      this.formSearchForm.employeeDeptId = val
      this.onlineAndOfflineForm.formData.employeeSecondDeptId = val
      this.formSearchForm.employeeSecondDeptId = val
      // this.findSecordDepartMentId(this.deptList, val)
      this.searchFn()
    },
    findSecordDepartMentId(arr, val) {
      let flag = false
      arr.some(item => {
        if (item.id === val) {
          const ancestorsArr = item.ancestors.split(',')
          if (ancestorsArr && ancestorsArr.length >= 3) {
            this.onlineAndOfflineForm.formData.employeeSecondDeptId = ancestorsArr[2]
            this.formSearchForm.employeeSecondDeptId = ancestorsArr[2]
          } else {
            this.onlineAndOfflineForm.formData.employeeSecondDeptId = val
            this.formSearchForm.employeeSecondDeptId = val
          }
          flag = true

          this.searchFn()
          return false
        } else if (item.children && !flag) {
          this.findSecordDepartMentId(item.children, val)
        }
      })
    },
    changeEmployeeId() {
      this.$router.push({ path: '/business/onlineAndOfflinePerson', query: {
        employeeId: this.onlineAndOfflineForm.formData.employeeUid,
        timeActive: this.onlineAndOfflineForm.formData.time.active,
        startTime: this.onlineAndOfflineForm.formData.time.time[0],
        endTime: this.onlineAndOfflineForm.formData.time.time[1],
        offlineFlag: this.formSearchForm.offlineFlag
      } })
    },
    backToQye() {
      if (this.formSearchForm?.offlineFlag || this.formSearchForm?.offlineFlag === 0) {
        this.onlineAndOfflineForm.formData = this.formSearchForm
      }
      this.onlineAndOfflineForm.formData.employeeDeptId = ''
      this.onlineAndOfflineForm.formData.employeeSecondDeptId = ''
      const item = {
        flag: 'searchForm',
        obj: this.onlineAndOfflineForm.formData
      }
      this.$emit('changeFormData', item)
    },
    changeBizTypeForForm(type, typeName) {
      this.$emit('changeBizTypeForForm', type, typeName)
    },
    changeFormDataCom(item) {
      this.$nextTick(() => {
        this.$refs.revenueOrYj.changeFormChoose()
      })
    },
    changeFormData(item) {
      console.log('dddddd:', item)
      this.$emit('changeFormData', item)
    },
    changeDeptment(obj) {
      this.onlineAndOfflineForm.formData.employeeDeptId = obj.deptId
      this.formSearchForm.employeeDeptId = obj.deptId
      this.changeBumenFormChart(obj.deptId)
    },
    moment,
    loadChannelSourceData() {
      this.channelDataArray = []
      this.channelSourceType.some(item => {
        const obj = {
          id: item.value,
          label: item.label,
          children: []
        }
        const params = {
          current: 1,
          size: 1000,
          type: item.value
        }
        getShopList(params).then(res => {
          if (res.code === 1 && res.data.records) {
            res.data.records.some(shop => {
              obj.children.push({
                id: shop.shopId,
                label: shop.shopName
              })
            })
            this.channelDataArray.push(obj)
          } else {
            this.channelDataArray.push(obj)
          }
        })
      })
    },
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then((res) => {
          this.userArray = res.data
        })
        .catch(() => {
        })
    },
    getGoodsList(val) {
      const dangqianArray = []
      for (var i = 0; i < this.onlineAndOfflineForm.formData.itemIdList.length; i++) {
        this.goodsList.some(objPro => {
          if (objPro.goodsId === this.onlineAndOfflineForm.formData.itemIdList[i]) {
            dangqianArray.push(objPro)
          }
        })
      }
      getShowGoodsList({ contentName: val, current: 1, size: 500 }).then(
        res => {
          // this.goodsList = res.data.records
          var arr = [...res.data.records, ...dangqianArray].reduce((o, item) => {
            o[item.goodsId] = item
            return o
          }, {})
          arr = Object.keys(arr).map(n => arr[n])
          this.goodsList = arr
        }
      )
    },
    goodsChange(val) {
      const oldDataList = []
      if (val) {
        const setGoodsListData = JSON.parse(sessionStorage.getItem('setGoodsListData') || '{}')
        setGoodsListData.goodsListed = []
        val.some(obj => {
          this.goodsList.some(item => {
            if (item.goodsId === obj) {
              oldDataList.push(item)
              setGoodsListData.goodsListed.push(item)
            }
          })
        })
        sessionStorage.setItem('setGoodsListData', JSON.stringify(setGoodsListData))
      }
      this.searchFn()
    },
    loadDeptList() {
      deptTree({}).then(res => {
        if (res.code === 1) {
          if (res && res.data && res.data.length > 0) {
            const arr = res.data.reduce((pre, next) => {
              pre.push({ label: next.label, id: next.id, children: next.children })
              return pre
            }, [])
            if (this.roleFlag === 1) {
              this.deptList = arr[0].children
              const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
              const setBusinessOtherData = JSON.parse(sessionStorage.getItem('setBusinessOtherData') || '{}')
              const nowUserOrgId = localStorage.getItem('userDeptId')
              if (this.userInfo.userId === setBusinessOtherData.userId && setBusinessOtherData.userOrgId === nowUserOrgId) {
                if (setBuObj.employeeDeptId) {
                  this.onlineAndOfflineForm.formData.employeeDeptId = setBuObj.employeeDeptId
                  this.formSearchForm.employeeDeptId = setBuObj.employeeDeptId
                  this.onlineAndOfflineForm.formData.employeeSecondDeptId = setBuObj.employeeSecondDeptId
                  this.formSearchForm.employeeSecondDeptId = setBuObj.employeeSecondDeptId
                  this.searchFn()
                }
              }
              this.$nextTick(() => {
                this.$refs.appDatepickerDashboard.changeMorenTime(this.onlineAndOfflineForm.formData.time)
              })
            } else {
              this.returnDepartMentData(arr)
            }
            // this.deptList = arr
          }
        }
      })
    },
    retrunDepart(arr, deptId) {
      arr.some(item => {
        if (item.id === deptId) {
          this.deptList.push(item)
          const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
          const setBusinessOtherData = JSON.parse(sessionStorage.getItem('setBusinessOtherData') || '{}')
          const nowUserOrgId = localStorage.getItem('userDeptId')
          if (this.userInfo.userId === setBusinessOtherData.userId && setBusinessOtherData.userOrgId === nowUserOrgId) {
            if (this.returnHasDeptId(this.deptList, setBuObj.employeeDeptId)) {
              this.onlineAndOfflineForm.formData.employeeDeptId = setBuObj.employeeDeptId
              this.onlineAndOfflineForm.formData.employeeSecondDeptId = setBuObj.employeeSecondDeptId
              this.formSearchForm.employeeDeptId = setBuObj.employeeDeptId
              this.formSearchForm.employeeSecondDeptId = setBuObj.employeeSecondDeptId
              this.searchFn()
            } else {
              this.onlineAndOfflineForm.formData.employeeDeptId = deptId
              this.formSearchForm.employeeDeptId = deptId
              this.findSecordDepartMentId(this.deptList, deptId)
            }
          } else {
            this.onlineAndOfflineForm.formData.employeeDeptId = deptId
            this.formSearchForm.employeeDeptId = deptId
            this.findSecordDepartMentId(this.deptList, deptId)
          }
          this.$nextTick(() => {
            this.$refs.appDatepickerDashboard.changeMorenTime(this.onlineAndOfflineForm.formData.time)
          })
          // this.onlineAndOfflineForm.formData.employeeDeptId = deptId
          return
        } else if (item.children) {
          this.retrunDepart(item.children, deptId)
        }
      })
    },
    returnDepartMentData(arr) {
      getDeptCategoryMess().then(res => {
        if (res.code === 1 && res.data) {
          this.onlineAndOfflineForm.formData.employeeDeptId = ''
          this.retrunDepart(arr, res.data.deptId)
        }
      })
    },
    // 时间改变触发
    timeChange(val) {
      console.log('valuuuddee:', val)
      if (val.time[0]) {
        this.onlineAndOfflineForm.formData.time = val
        this.formSearchForm.time = val
      }
      this.searchFn()
    },
    searchFn() {
      const params = {
      }
      if (this.formSearchForm?.offlineFlag || this.formSearchForm?.offlineFlag === 0) {
        params.employeeSecondDeptId = this.formSearchForm.employeeSecondDeptId
        params.timeType = this.formSearchForm?.time?.active
        params.startTime = this.formSearchForm.time.time[0]
        params.endTime = this.formSearchForm.time.time[1]
      } else {
        params.employeeSecondDeptId = this.onlineAndOfflineForm.formData.employeeSecondDeptId
        params.timeType = this.onlineAndOfflineForm.formData?.time?.active
        params.startTime = this.onlineAndOfflineForm.formData.time.time[0]
        params.endTime = this.onlineAndOfflineForm.formData.time.time[1]
      }
      // this.formSearchForm = { ...this.onlineAndOfflineForm.formData }

      getOfflineFlag(params).then(res => {
        if (res.code === 1 && res.data) {
          if (res.data.length === 1) {
            this.onlineAndOfflineForm.formData.offlineFlag = res.data[0].code
            const item = {
              flag: 'searchForm',
              obj: (this.formSearchForm?.offlineFlag || this.formSearchForm?.offlineFlag === 0) ? this.formSearchForm : this.onlineAndOfflineForm.formData
            }
            sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(this.onlineAndOfflineForm.formData))
            this.$emit('changeFormData', item)
          } else {
            const item = {
              flag: 'searchForm',
              obj: (this.formSearchForm?.offlineFlag || this.formSearchForm?.offlineFlag === 0) ? this.formSearchForm : this.onlineAndOfflineForm.formData
            }
            sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(this.formSearchForm))
            this.$emit('changeFormData', item)
          }
        }
      })
    },
    clearFn() {
      this.onlineAndOfflineForm.ref.resetFields()
      this.onlineAndOfflineForm.formData = cloneDeep(onlineAndOfflineForm.form.formData)
      this.formSearchForm = this.onlineAndOfflineForm.formData
      const params = {
      }
      params.employeeSecondDeptId = this.onlineAndOfflineForm.formData.employeeSecondDeptId
      params.timeType = this.onlineAndOfflineForm.formData?.time?.active
      params.startTime = this.onlineAndOfflineForm.formData.time.time[0]
      params.endTime = this.onlineAndOfflineForm.formData.time.time[1]
      getOfflineFlag(params).then(res => {
        if (res.code === 1 && res.data) {
          if (res.data.length === 1) {
            this.onlineAndOfflineForm.formData.offlineFlag = res.data[0].code
            this.$refs.chooseType.changeTypeWithoutNothing(this.formSearchForm.offlineFlag)
            this.$refs.chooseChannel.changeChannelWithOutNothing(this.formSearchForm.productCategory)
            const item = {
              flag: 'searchForm',
              obj: this.onlineAndOfflineForm.formData
            }
            sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(this.onlineAndOfflineForm.formData))
            this.$emit('changeFormData', item)
          } else {
            const item = {
              flag: 'searchForm',
              obj: this.onlineAndOfflineForm.formData
            }
            this.$refs.chooseType.changeTypeWithoutNothing(this.formSearchForm.offlineFlag)
            this.$refs.chooseChannel.changeChannelWithOutNothing(this.formSearchForm.productCategory)
            sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(this.onlineAndOfflineForm.formData))
            this.$emit('changeFormData', item)
          }
        }
      })
      // this.searchFn()
    },
    teacherSelect(val) {
      this.onlineAndOfflineForm.formData.teacherId = val.lecturerId
      this.onlineAndOfflineForm.formData.lecturerName = val.lecturerName
      this.onlineAndOfflineForm.formData.teacherIdList = val.lecturerId ? [val.lecturerId] : undefined
      this.searchFn()
    },
    getAccountPlacement() {
      this.$nextTick(() => {
        this.$refs.tfDataDrawer.drawerFlag = true
        this.$refs.tfDataDrawer.toLoaderDeptID(this.onlineAndOfflineForm.formData.employeeDeptId)
      })
    },
    changeRevenType(type) {
      this.$nextTick(() => {
        this.$refs.revenueOrYj.changeRevenTypeWithoutNothing(type)
      })
    }
  }
}
</script>

  <style lang="scss" scoped>
  .online-off-search {
    float: left;
    width: 100%;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    padding-bottom: 0px;
    .on-off-search-title {
        float: left;
    }
    ::v-deep .el-select__input {
      margin-left: 0px!important;
    }
  }
  .on-off-search-line {
    width: 100%;
    border-top: 1px solid #F2F2F2;
    display: inline-block;
  }
  .on-off-search-data {
    width: 100%;
    margin-top: 19px;
  }
  .right-fixed {
    width: 100%;
    height: 40px;
    position: relative;
    text-align: right;
    margin-top: -50px;
    z-index: 0;
    pointer-events: none;
  }
  .right-fixed-btn {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 999;
    pointer-events: auto;
  }
  ::v-deep .hok-search-form .hok-search-form-btn .shrink-box {
    display: none!important;
  }
  .tearch-cls {
    float: left;
    width: 100%;
    height: 30px;
  }

  .goods-choose-cls {
    ::v-deep .el-select__tags {
      width: 100%;
      .el-tag {
        float: left;
      }
    }
  }

  .on-off-search-data {
    ::v-deep .el-form-item {
      height: auto!important;
    }
  }

  .search-cls {
    float: left;
    width: 100%;
  }
  .on-off-search-top {
    float: left;
    width: 100%;
    padding-bottom: 13px;
    border-bottom: 1px solid #F2F2F2;
  }

  .back-to-qy {
    color: #000000;
    font-family: "Microsoft YaHei";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    width: 36px;
    text-align: center;
    height: 20px;
    flex-shrink: 0;
    border-radius: 4px;
    background: #EDEDED;
    font-style: normal;
    float: left;
    margin-right: 5px;
    margin-top: 3px;
  }

  </style>
