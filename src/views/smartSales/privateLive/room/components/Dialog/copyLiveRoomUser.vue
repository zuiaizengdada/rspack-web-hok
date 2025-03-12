<template>
  <AppDialog v-model="visible" title="复制直播间人员" width="650px" :loading="loading" height="auto" :top="top" @success="sure">
    <div class="copyLiveRoomUser overflowOuto">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="选择直播间" prop="liveRoomName">
          <AppSelect
            :get-api-fn="getLivePage"
            search-key="liveRoomName"
            :value="form.liveRoomId"
            :label="form.liveRoomName"
            :props="{
              label: 'liveRoomName',
              value: 'id'
            }"
            @selected="selected"
          />
        </el-form-item>
        <el-form-item label="创建人" prop="createUserName">
          <span>{{ form.createUserName }}</span>
        </el-form-item>
        <el-form-item label="开播时间" prop="startTime">
          <span v-if="form.startTime">{{ form.startTime ? moment(form.startTime).format('YYYY-MM-DD HH:mm:ss') : '' }}</span>
        </el-form-item>
        <el-form-item label="指定人数" prop="whitePeopleNum">
          <span v-if="form.whitePeopleNum !== ''">{{ form.whitePeopleNum }}人</span>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppSelect from '@/components/AppSelect'
import AppDialog from '@/components/AppDialog'
import moment from 'moment'
import { getLiveListByConditions, getLiveRoomPassUserInfo, copyWhiteList } from '@/api/liveRoom/setting.js'
export default {
  components: {
    AppDialog,
    AppSelect
  },
  data() {
    return {
      loading: false,
      detailLoading: false,
      visible: true,
      liveRoomId: '',
      form: {
        liveRoomId: '',
        liveRoomName: '',
        startTime: '',
        createUserName: '',
        whitePeopleNum: ''
      },
      rules: {
        liveRoomName: [
          { required: true, message: '请选择直播间', trigger: 'change' }
        ]
      },
      top: '10vh',
      success: () => {}
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.loading = false
        if (val) {
          this.form = {
            liveRoomId: '',
            liveRoomName: '',
            startTime: '',
            createUserName: '',
            whitePeopleNum: ''
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 418) / 2 + 'px'
  },
  methods: {
    moment,
    sure() {
      console.log('1111')
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(valid, 'valid')
          this.loading = true
          const data = {
            liveRoomId: this.liveRoomId,
            selectLiveRoomId: this.form.liveRoomId
          }
          copyWhiteList(data).then(res => {
            this.loading = false
            this.visible = false
            this.success && this.success()
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    //   this.visible = false
    },
    selected(val) {
      console.log(val)
      if (val.id) {
        this.form.liveRoomId = val.id
        this.form.liveRoomName = val.liveRoomName
        // this.form.startTime = val.startTime
        this.detailLoading = true
        const data = {
          liveRoomId: val.id
        }
        getLiveRoomPassUserInfo(data).then(res => {
          console.log(res, 'res')
          this.form.liveRoomName = res.data.liveRoomName
          this.form.startTime = res.data.startTime
          this.form.whitePeopleNum = res.data.whitePeopleNum
          this.form.createUserName = res.data.createUserName
          this.detailLoading = false
        }).catch(() => {
          this.detailLoading = false
        })
      } else {
        this.form = {
          liveRoomId: '',
          liveRoomName: '',
          createUserName: '',
          startTime: '',
          whitePeopleNum: ''
        }
      }
    },
    getLivePage(params) {
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        liveRoomName: params.liveRoomName
      }
      return getLiveListByConditions(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.copyLiveRoomUser {
  height: 300px;
  padding: 20px 20px 0;
}
</style>
