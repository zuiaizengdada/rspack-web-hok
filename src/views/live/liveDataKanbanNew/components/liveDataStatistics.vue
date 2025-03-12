<template>
  <div class="liveDataStatistics">
    <MTitle class="live-data-title">直播数据统计</MTitle>
    <HokSearchForm
      :form-opts="formOptsLiveData"
      :ref-obj.sync="formOptsLiveData.ref"
      :is-more-outside="false"
      class="pd20"
    >
      <template #liveModel>
        <el-select
          v-model="formOptsLiveData.formData.liveModel"
          clearable
          @change="searchFn"
        >
          <el-option
            v-for="(item, index) in formOptsLiveData.optionsObj.liveModel"
            :key="item.value + index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template #feesType>
        <el-radio-group
          v-model="formOptsLiveData.formData.feesType"
          style="width: 500px"
          @change="liveModalChange"
        >
          <el-radio
            v-for="(item, index) in formOptsLiveData.optionsObj.feesType"
            :key="index"
            class="radio-cls"
            :class="index === 0 ? 'radio-cls-one' : ''"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </template>
      <template #ipTeacherId>
        <el-select
          v-model="formOptsLiveData.formData.ipType"
          class="two-min-select"
          @change="changeIpType"
        >
          <el-option label="真人IP" :value="1" />
          <el-option label="视频IP" :value="2" />
        </el-select>
        <em
          style="float: left; width: 1px; height: 30px; background: #dfe1e3"
        />
        <el-select
          v-if="formOptsLiveData.formData.ipType === 1"
          v-model="formOptsLiveData.formData.ipTeacherId"
          filterable
          clearable
          class="select-secord"
          @change="searchFn"
        >
          <el-option-group
            v-for="(group, index) in realPeopleArray"
            :key="index"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-option-group>
        </el-select>
        <!-- <el-select v-if="formOptsLiveData.formData.ipType === 2" v-model="formOptsLiveData.formData.ipTeacherId" class="select-secord">
          <el-option-group
            v-for="(group,index) in videoPeopleArray"
            :key="index"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.lecturerId"
              :label="item.lecturerName"
              :value="item.lecturerId"
            />
          </el-option-group>
        </el-select> -->
        <el-select
          v-if="formOptsLiveData.formData.ipType === 2"
          v-model="formOptsLiveData.formData.ipTeacherId"
          class="select-secord"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
        >
          <el-option-group
            v-for="(group, index) in videoPeopleArray"
            :key="index"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.teacherId"
              :label="item.teacherName"
              :value="item.teacherId"
            />
          </el-option-group>
        </el-select>
      </template>
      <template #userIds>
        <el-select
          v-model="formOptsLiveData.formData.userIds"
          filterable
          clearable
          multiple
          @change="searchFn"
        >
          <el-option-group
            v-for="(group, index) in invitePeopleArray"
            :key="index"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-option-group>
        </el-select>

        <!-- <el-select v-model="formOptsLiveData.formData.userIds" multiple filterable placeholder="请选择">
          <el-option
            v-for="item in userArray"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select> -->
      </template>
      <template #time>
        <el-date-picker
          v-model="formOptsLiveData.formData.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :clearable="false"
          @change="searchFn"
        />
      </template>
    </HokSearchForm>
    <liveDataStatisticTable
      ref="liveDataStatisticTable"
      :columns="liveDataStatisticTableFeers"
      :is-pages="true"
      :get-list="getList"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
    >
      <template v-slot:startTime="{ scope }">
        <span>{{ moment(scope.row.startTime).format('YYYY-MM-DD') }}</span>
      </template>
      <template v-slot:startTimeTime="{ scope }">
        <span>{{ moment(scope.row.startTime).format('HH:mm:ss') }}</span>
      </template>
      <template v-slot:teachers="{ scope }">
        <span v-if="!scope.row.teachers || scope.row.teachers.length <= 0">
          -
        </span>
        <el-tooltip
          v-else
          :content="scope.row.teachers | renderTearch"
          placement="top"
        >
          <div class="teachers-cell">
            {{ scope.row.teachers | renderTearch }}
          </div>
        </el-tooltip>
      </template>
      <template v-slot:name="{ scope }">
        <span class="ls-blue" @click="gotoLiveDetailData(scope.row)">{{
          scope.row.name
        }}</span>
      </template>
      <template v-slot:liveModel="{ scope }">
        <span
          v-if="scope.row.liveModel === 'PERSON_LIVE'"
          style="color: #1989fa"
        >真人直播</span>
        <span
          v-if="scope.row.liveModel === 'AI_LIVE'"
          style="color: #00c313"
        >数字直播</span>
        <span
          v-if="scope.row.liveModel === 'DIGITAL_PERSON_LIVE'"
          style="color: #00c313"
        >数字直播</span>
      </template>
      <template v-slot:feesType="{ scope }">
        <span v-if="scope.row.feesType === 1">免费</span>
        <span v-if="scope.row.feesType === 2">付费</span>
      </template>
      <template v-slot:videoName="{ scope }">
        <span>{{
          scope.row.videoName
            ? scope.row.videoName.length > 25
              ? scope.row.videoName.subString(0, 24)
              : scope.row.videoName
            : '-'
        }}</span>
      </template>
      <template v-slot:price="{ scope }">
        <span>{{ filterPrice(scope.row.price) }}</span>
      </template>
      <template v-slot:gmv="{ scope }">
        <span>{{ filterPrice(scope.row.gmv) }}</span>
      </template>
      <template v-slot:totalRplCount="{ scope }">
        <span>{{ filterPrice(scope.row.totalRplCount) }}</span>
      </template>
      <template v-slot:attendTransRate="{ scope }">
        <span>{{
          scope.row.attendTransRate ? scope.row.attendTransRate + '%' : '-'
        }}</span>
      </template>
    </liveDataStatisticTable>
  </div>
</template>

<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
// import TeacherSelect from '@/views/deliver/components/tearchSelect.vue'
import liveDataStatisticTable from './table.vue'
import {
  feesOptsLiveDataStatistics,
  liveDataStatisticTableFeers
} from './tableData'
import { deepClone } from '@/utils/FormGenerator/index'
import { userNoPage } from '@/api/addressBookApi'
import {
  getTearchRecord,
  setPersonSetUpRecord,
  setPersonUpBatchSave,
  allLiveRoomStatistics // 所有直播间数据看板-直播数据统计
} from '@/api/liveRoom/kanban.js'
import { getTeacherList } from '@/api/tearchCenter/index'
import { canEnterLiveRoom } from '@/api/liveRoom/index'
import moment from 'moment'
import { filterPrice } from '@/utils/index.js'
export default {
  filters: {
    renderTearch(val) {
      if (!val || val.length === 0) return ''
      return val.reduce((pre, next) => {
        next && (pre = `${pre}${pre ? '、' : ''}${next.userName}`)
        return pre
      }, '')
    }
  },
  components: {
    HokSearchForm,
    // TeacherSelect,
    liveDataStatisticTable
  },
  props: {},
  data() {
    return {
      enterLiveRoom: false,
      realPeopleArray: [],
      tearchArray: [],
      tearchListArray: [],
      videoPeopleArray: [],
      invitePeopleArray: [],
      liveDataStatisticTableFeers: liveDataStatisticTableFeers,
      formOptsLiveData: {
        formData: {
          name: '',
          videoName: '',
          liveModel: '',
          feesType: '',
          ipTeacherId: '',
          userIds: '',
          time: []
        }
      },
      userArray: [],
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  computed: {},
  created() {
    this.canEnterLiveRoom()
    setTimeout(() => {
      this.searchFn()
    }, 300)
  },
  mounted() {
    this.initPage()
    this.loadUserNoPage()
  },
  methods: {
    filterPrice,
    canEnterLiveRoom() {
      return canEnterLiveRoom().then(res => {
        this.enterLiveRoom = res.data
      })
    },
    remoteMethod(query) {
      getTeacherList({ pageIndex: 1, pageSize: 100, teacherName: query }).then(
        res => {
          if (res.code === 1 && res.data.items) {
            this.videoPeopleArray = []
            this.tearchArray = []
            res.data.items.some(item => {
              const obj = {
                teacherId: item.teacherId,
                teacherName: item.teacherName
              }
              this.tearchArray.push(obj)
            })
            const optionVideo = {
              label: '历史记录',
              options: this.tearchListArray
            }
            const optionsVideos = {
              label: '请选择',
              options: this.tearchArray
            }
            this.videoPeopleArray.push(optionVideo)
            this.videoPeopleArray.push(optionsVideos)
          }
        }
      )
    },
    moment,
    loadTearcherData() {
      const params = {
        code: 'LIVE_ROOM_DATA_DASHBOARD_STATI_SYS_TEACHER_QUERY'
      }
      getTearchRecord(params).then(res => {
        if (res.code === 1 && res.data) {
          const userArrayLine = []
          res.data.some(item => {
            const obj = {
              userId: item.key,
              nickName: item.value
            }
            userArrayLine.push(obj)
          })
          const option = {
            label: '历史记录',
            options: userArrayLine
          }
          const options = {
            label: '请选择',
            options: this.userArray
          }
          this.realPeopleArray.push(option)
          this.realPeopleArray.push(options)
        }
      })

      const paramVideo = {
        code: 'LIVE_ROOM_DATA_DASHBOARD_STATI_IP_TEACHER_QUERY'
      }
      getTearchRecord(paramVideo).then(res => {
        if (res.code === 1 && res.data) {
          this.tearchListArray = []
          res.data.some(item => {
            const obj = {
              teacherId: item.key,
              teacherName: item.value
            }
            this.tearchListArray.push(obj)
          })
        }
      })
      const params2 = {
        code: 'LIVE_ROOM_DATA_DASHBOARD_STATI_INVITER_QUERY'
      }
      getTearchRecord(params2).then(res => {
        if (res.code === 1 && res.data) {
          const userArrayLine = []
          res.data.some(item => {
            const obj = {
              userId: item.key,
              nickName: item.value
            }
            userArrayLine.push(obj)
          })
          const option = {
            label: '历史记录',
            options: userArrayLine
          }
          const options = {
            label: '请选择',
            options: this.userArray
          }
          this.invitePeopleArray.push(option)
          this.invitePeopleArray.push(options)
        }
      })
    },
    changeIpType() {
      this.formOptsLiveData.formData.ipTeacherId = ''
    },
    getList() {
      const params = {
        ...this.tableConfig,
        name: this.formOptsLiveData.formData.name,
        videoName: this.formOptsLiveData.formData.videoName,
        liveModel: this.formOptsLiveData.formData.liveModel,
        feesType: this.formOptsLiveData.formData.feesType,
        ipType: this.formOptsLiveData.formData.ipType,
        ipTeacherId: this.formOptsLiveData.formData.ipTeacherId,
        userIds: this.formOptsLiveData.formData.userIds
          ? this.formOptsLiveData.formData.userIds
          : [],
        startTime:
          this.formOptsLiveData.formData.time &&
          this.formOptsLiveData.formData.time[0]
            ? this.formOptsLiveData.formData.time[0]
            : moment().format('YYYY-MM-DD'),
        endTime:
          this.formOptsLiveData.formData.time &&
          this.formOptsLiveData.formData.time[1]
            ? this.formOptsLiveData.formData.time[1]
            : moment().format('YYYY-MM-DD')
        // time: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
      }
      console.log('wwwwww:', params)
      if (params.ipType === 1 && params.ipTeacherId) {
        this.saveTearchOrUser(
          'LIVE_ROOM_DATA_DASHBOARD_STATI_SYS_TEACHER_QUERY'
        )
      }
      if (params.ipType === 2 && params.ipTeacherId) {
        this.saveTearchOrUser('LIVE_ROOM_DATA_DASHBOARD_STATI_IP_TEACHER_QUERY')
      }
      if (params.userIds && params.userIds.length > 0) {
        this.saveTearchOrUser('LIVE_ROOM_DATA_DASHBOARD_STATI_INVITER_QUERY')
      }

      return allLiveRoomStatistics(params)
    },
    chooseTearch(event) {
      this.formOptsLiveData.formData.ipTeacherId = event
    },
    saveTearchOrUser(type) {
      if (type === 'LIVE_ROOM_DATA_DASHBOARD_STATI_SYS_TEACHER_QUERY') {
        const params = {
          code: type,
          value: this.formOptsLiveData.formData.ipTeacherId,
          valueList: []
        }
        setPersonSetUpRecord(params).then(res => {
          console.log('真人：', res)
        })
      } else if (type === 'LIVE_ROOM_DATA_DASHBOARD_STATI_IP_TEACHER_QUERY') {
        const params = {
          code: type,
          value: this.formOptsLiveData.formData.ipTeacherId,
          valueList: []
        }
        setPersonSetUpRecord(params).then(res => {
          console.log(res)
        })
      } else {
        const params = {
          code: type,
          value: '',
          valueList: this.formOptsLiveData.formData.userIds
        }
        setPersonUpBatchSave(params).then(res => {
          console.log(res)
        })
      }
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.$refs.liveDataStatisticTable.init()
    },
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.$refs.liveDataStatisticTable.init()
    },
    searchFn() {
      this.tableConfig.pageIndex = 1
      this.$refs.liveDataStatisticTable.init()
    },
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
          this.loadTearcherData()
        })
        .catch(() => {})
    },
    async initPage() {
      this.formOptsLiveData = {
        ...deepClone(feesOptsLiveDataStatistics.form),
        operatorList: [
          { label: '搜索', fn: this.searchFn },
          {
            label: '重置',
            fn: this.clearFn,
            type: 'plain',
            bind: { plain: true }
          }
        ]
      }
      this.formOptsLiveData.formData.time = [
        moment().format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD')
      ]
    },
    clearFn() {
      console.log('this.formOpts.ref', this.formOpts)
      this.formOptsLiveData.ref.resetFields()
      this.formOptsLiveData.formData = feesOptsLiveDataStatistics.form.formData
      this.formOptsLiveData.formData.time = [
        moment().format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD')
      ]
      this.searchFn()
      // this.getTableInfo()
    },
    liveModalChange() {
      this.searchFn()
    },
    canShowGotoLiveRoom(row) {
      if (this.enterLiveRoom) {
        return true
      }
      if (!row.teachers || row.teachers.length === 0) {
        return false
      }
      const obj = row.teachers.find(v => v.userId === this.userInfo.userId)
      return Boolean(obj)
    },
    // 点击直播间名称跳转直播间数据
    gotoLiveDetailData(row) {
      if (!this.canShowGotoLiveRoom(row)) {
        return this.$message.error('你暂无权限访问。')
      }
      const { href } = this.$router.resolve({
        path: `/privateLive/room/detail/${row.liveRoomId}`
      })
      window.open(href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.liveDataStatistics {
  background: #ffffff;
  padding: 0;
  border-radius: 8px;
}
.live-data-title {
  margin-bottom: 10px;
}

.two-min-select {
  float: left;
  width: 120px !important;
  ::v-deep .el-input__inner {
    padding-left: 10px;
  }
}

.select-secord {
  float: left;
  margin-left: 10px;
  width: calc(100% - 131px) !important;
  background: yellow;
}

.ls-blue {
  color: #0c6fff;
  cursor: pointer;
}

.teachers-cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
  display: inline-block;
}
</style>
