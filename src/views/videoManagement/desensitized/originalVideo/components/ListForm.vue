<template>
  <div class="form-filter">
    <el-form ref="form" :model="form" inline>
      <el-form-item label="交付场景" prop="sceneId">
        <el-select
          v-model="form.sceneId"
          clearable
          filterable
          @change="handleClickSearch"
        >
          <el-option
            v-for="item in senceOptions"
            :key="item.id"
            :label="item.sceneName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="IP" prop="teacherId">
        <el-select
          v-model="form.teacherId"
          clearable
          filterable
          remote
          :remote-method="tearchFilter"
          placeholder="请选择IP"
          @blur="()=>tearchFilter('')"
          @change="handleChangeTeacher"
        >
          <el-option-group
            v-for="group in filteredGroups(teacherOptions)"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span class="flex flex-between"><span>{{ item.label }} </span><span style="color: #f53f3f;">{{ item.cooperateStatus === 1?'已签合同':'' }}</span></span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="keyWord">
        <el-input
          v-model="form.keyWord"
          placeholder="请输入"
          clearable
          @keyup.enter.native="handleClickSearch"
        />
      </el-form-item>
      <el-form-item label="字幕" prop="subtitle">
        <el-input
          v-model="form.subtitle"
          placeholder="请输入"
          clearable
          @keyup.enter.native="handleClickSearch"
        />
      </el-form-item>
      <el-form-item label="视频组类型">
        <el-select v-model="form.type" clearable placeholder="请选择" @change="handleClickSearch">
          <el-option
            v-for="item in videoTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="脱敏状态">
        <el-select v-model="form.status" clearable placeholder="请选择状态" @change="handleClickSearch">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建者">
        <el-select v-model="form.createUserId" clearable filterable placeholder="请选择创建者" @change="handleChangeUser">
          <el-option-group
            v-for="group in userOptions"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="form.timeArray"
          class="m-l-10 datePicker"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="日期选择：开始日期"
          end-placeholder="结束日期"
          @change="timeChange"
        />
      </el-form-item>
      <el-form-item>
        <el-checkbox
          v-model="form.myCreated"
          @change="handleClickMe"
        >我创建的</el-checkbox>
      </el-form-item>
      <el-form-item>
        <div class="buttons">
          <el-button
            :loading="searchIng"
            type="primary"
            size="small"
            @click="handleClickSearch"
          >查询</el-button>
          <el-button size="small" @click="handleClickReset">重置</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="tools flex justify-start items-center">
          <el-button
            v-permission="['web:desenitization:addVideoGroup', permsList]"
            style="margin-right: 5px"
            type="primary"
            size="small"
            class="mr-4"
            @click="handleClickTo"
          >新建视频组</el-button>
          <el-button
            type="primary"
            size="small"
            class="mr-4"
            @click="handleClickToTj"
          >成品视频统计</el-button>
          <custom-tabel-header v-bind="$attrs" v-on="$listeners" />
        </div>
      </el-form-item>
      <!-- <div class="flex justify-between mb-4">
        <div class="buttons" />
        <div class="tools flex justify-start items-center">
          <el-button style="margin-right: 5px;" type="primary" size="small" class="mr-4" @click="handleClickTo">新建视频组</el-button>
          <el-button type="primary" size="small" class="mr-4" @click="handleClickToTj">成品视频统计</el-button>
          <custom-tabel-header v-bind="$attrs" v-on="$listeners" />
        </div>
      </div> -->
    </el-form>
  </div>
</template>
<script>
import { searchDeliveryData } from '@/api/product/setting'
import CustomTabelHeader from './CustomTabelHeader.vue'
import { mapGetters } from 'vuex'
import { loadUserData, changeTeacher, tearchFilter, filteredGroups } from '@/utils/videoMange'

// web:desenitization:addVideoGroup

export default {
  components: {
    CustomTabelHeader
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filteredGroups,
      form: {
        sceneId: '',
        teacherId: '',
        keyWord: '',
        subtitle: '',
        myCreated: true,
        status: '',
        type: null,
        createUserId: '',
        timeArray: []
      },
      videoTypeOptions: [
        { label: '单机位视频组', value: 1 },
        { label: '多机位视频组', value: 2 }
      ],
      statusList: [
        { label: '已自动脱敏', value: 1 },
        { label: '已手动脱敏', value: 2 },
        { label: '已共享', value: 3 },
        { label: '未手动脱敏', value: 4 },
        { label: '未共享', value: 5 },
        { label: '未自动脱敏', value: 6 }
      ],
      teacherOptions: [],
      userOptions: [],
      tearchList: [],
      userList: [],
      senceOptions: [],
      planOptions: [],
      searchIng: false,
      list: [],
      permsList: this.$route.meta.permsList || []
    }
  },
  watch: {
    loading(val) {
      this.searchIng = val
    }
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    // eslint-disable-next-line no-undef
    this.form.createUserId = this.userInfo.userId
    this.loadTeacherData()
    this.loadUserData()
    this.getSenceOptions()
    this.$emit('search')
  },
  methods: {
    async loadTeacherData() {
      const { tearchArray, tearchList } = await loadUserData('desensitiCommonUse', 1)
      this.teacherOptions = tearchArray
      this.tearchList = tearchList
      this.tearchFilter('')
    },
    async handleChangeTeacher() {
      if (this.form.teacherId) {
        const res = await changeTeacher(this.tearchList, this.teacherOptions, 'desensitiCommonUse', this.form.teacherId)
        this.teacherOptions = res
      }
      this.$emit('search')
    },
    async tearchFilter(query) {
      setTimeout(async() => {
        const res = await tearchFilter(query, this.tearchList)
        this.teacherOptions[0].isHidden = query.length > 0
        this.teacherOptions[1].options = res
      }, 300)
    },
    async loadUserData() {
      const { tearchArray, tearchList } = await loadUserData('desensitiCommonUser', 2)
      this.userOptions = tearchArray
      this.userList = tearchList
    },
    async handleChangeUser() {
      if (this.form.createUserId) {
        this.form.myCreated = this.form.createUserId === this.userInfo.userId
        const res = await changeTeacher(this.userList, this.userOptions, 'desensitiCommonUser', this.form.createUserId)
        this.userOptions = res
      } else {
        this.form.myCreated = false
      }
      this.$emit('search')
    },
    async getSenceOptions(query) {
      const { data } = await searchDeliveryData({
        sceneName: query,
        ...{ pageIndex: 1, pageSize: 100 }
      })
      this.senceOptions = data.items.filter(item => {
        return item.status === 1
      })
    },
    timeChange() {
      this.$emit('search')
    },
    handleClickMe() {
      this.form.createUserId = !this.form.myCreated ? '' : this.userInfo.userId
      this.handleClickSearch()
    },
    handleClickSearch() {
      this.form.type = this.form.type || null
      // eslint-disable-next-line no-undef
      this.$emit('search')
    },
    handleClickReset() {
      this.form = {
        sceneId: '',
        teacherId: '',
        keyWord: '',
        subtitle: '',
        myCreated: true,
        status: '',
        createUserId: '',
        type: null,
        timeArray: []
      }
      this.form.createUserId = !this.form.myCreated ? '' : this.userInfo.userId
      this.$refs.form.resetFields()
      this.$emit('search')
    },
    async handleClickTo() {
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'newVideoGroup'
      )
      if (!res) {
        this.$router.push({ name: 'OriginalVideoAdd' })
      }
    },
    handleClickToTj() {
      this.$router.push({ name: 'VideoUsage' })
    }
  }
}
</script>
