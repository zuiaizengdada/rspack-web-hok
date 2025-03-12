<template>
  <AppDialog
    v-model="visible"
    title="发送"
    width="760px"
    :loading="loading"
    height="auto"
    :top="top"
    :drag="drag"
    :modal="false"
    :footer-text="['发送', '取消']"
    @success="sure"
  >
    <div class="robotSend overflowOuto">
      <el-form ref="form" v-loading="loading" :model="form" label-width="auto" size="small" :rules="rules" @submit.native.prevent>
        <el-form-item label="选择人员" prop="senderType">
          <el-radio-group v-model="form.senderType">
            <el-radio :label="1">学员</el-radio>
            <el-radio :label="2" disabled>数字人</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="robots">
          <div class="robotsBox">
            <div class="robotsSearch">
              <span class="searchTips m-r-10">人员搜索</span>
              <el-input v-model.trim="search.robotNickName" clearable style="width: 180px" size="small" @keyup.enter.native="getList()" @clear="getList()" />
              <el-button type="primary" size="small" class="m-l-10" @click="getList">查询</el-button>
              <span class="searchTips m-r-10" style="margin-left: 30px">随机选人</span>
              <el-select v-model="randomlySelect" clearable placeholder="选择" style="width: 75px" size="small" @change="randSelect">
                <el-option label="1位" :value="1" />
                <el-option label="2位" :value="2" />
                <el-option label="3位" :value="3" />
                <el-option label="4位" :value="4" />
                <el-option label="5位" :value="5" />
                <el-option label="6位" :value="6" />
                <el-option label="7位" :value="7" />
                <el-option label="8位" :value="8" />
                <el-option label="9位" :value="9" />
                <el-option label="10位" :value="10" />
              </el-select>
            </div>
            <div class="icon-list overflowOuto">
              <div v-if="list.length === 0" class="noData">
                暂无数据
              </div>
              <virtualList v-else ref="Virtual" v-slot="{item}" id-name="robotSend" :list-data="showlist" :estimated-item-size="30" style="width: 100%">
                <div class="robotSendItemList">
                  <el-checkbox :key="list[item].robotId" :value="form.robots.includes(list[item].robotId)" :disabled="form.robots.length >= 20 && !form.robots.includes(list[item].robotId)" :label="list[item].robotId" @click.native.prevent="robotsClickFn(list[item])">
                    <span class="robotNickName">
                      <el-image :src="list[item].robotHeadPic" style="width: 36px;height: 36px;margin-right: 10px;border-radius: 50%;min-width: 36px;" />
                      <!-- <el-tag v-if="renderRoleInfo(list[item].robotId).role" size="mini" style="margin-right: 5px;" effect="dark">{{ renderRoleInfo(list[item].robotId).role }}</el-tag> -->
                      <span v-if="renderRoleInfo(list[item].robotId).role" class="user_info_role">{{ renderRoleInfo(list[item].robotId).role }}</span>
                      <textShowMore :line-clamp="1" :text="list[item].robotNickName" />
                    </span>
                  </el-checkbox>
                  <template v-if="list.length > item + 1">
                    <el-checkbox :key="list[item + 1].robotId" :value="form.robots.includes(list[item + 1].robotId)" :disabled="form.robots.length >= 20 && !form.robots.includes(list[item + 1].robotId)" :label="list[item + 1].robotId" @click.native.prevent="robotsClickFn(list[item + 1])">
                      <span class="robotNickName">
                        <el-image :src="list[item + 1].robotHeadPic" style="width: 36px;height: 36px;margin-right: 10px;border-radius: 50%;min-width: 36px;" />
                        <!-- <el-tag v-if="renderRoleInfo(list[item + 1].robotId).role" size="mini" style="margin-right: 5px;" effect="dark">{{ renderRoleInfo(list[item + 1].robotId).role }}</el-tag> -->
                        <span v-if="renderRoleInfo(list[item + 1].robotId).role" class="user_info_role">{{ renderRoleInfo(list[item + 1].robotId).role }}</span>
                        <textShowMore :line-clamp="1" :text="list[item + 1].robotNickName" />
                      </span>
                    </el-checkbox>
                  </template>
                  <template v-if="list.length > item + 2">
                    <el-checkbox :key="list[item + 2].robotId" :value="form.robots.includes(list[item + 2].robotId)" :disabled="form.robots.length >= 20 && !form.robots.includes(list[item + 2].robotId)" :label="list[item + 2].robotId" @click.native.prevent="robotsClickFn(list[item + 2])">
                      <span class="robotNickName">
                        <el-image :src="list[item + 2].robotHeadPic" style="width: 36px;height: 36px;margin-right: 10px;border-radius: 50%;min-width: 36px;" />
                        <!-- <el-tag v-if="renderRoleInfo(list[item + 2].robotId).role" :type="renderRoleInfo(list[item + 2].robotId).type" size="mini" style="margin-right: 5px;" effect="plain">{{ renderRoleInfo(list[item + 2].robotId).role }}</el-tag> -->
                        <span v-if="renderRoleInfo(list[item + 2].robotId).role" class="user_info_role">{{ renderRoleInfo(list[item + 2].robotId).role }}</span>
                        <textShowMore :line-clamp="1" :text="list[item + 2].robotNickName" />
                      </span>
                    </el-checkbox>
                  </template>
                </div>
              </virtualList>
            </div>
          </div>
          <div v-if="robotsError" class="errorTips">
            请至少选择一个
          </div>
        </el-form-item>
        <el-form-item label="消息类型" prop="msgType">
          <msgSelect v-model="form.msgContent" :type.sync="form.msgType" @onChange="onhandleTypeChange" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="ss-material-box-bottom">
      <el-button size="small" type="primary" :loading="loading" @click="sure">发送</el-button>
      <el-button size="small" type="primary" :loading="loading" @click="sure('close')">发送并关闭</el-button>
      <el-button size="small" :loading="loading" @click="visible = false">取消</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import msgSelect from '../../../script/scriptConfiguration/component/msgSelect.vue'
import { getRobotListByRoomId, sendRobotMsg } from '@/api/liveRoom/index.js'
import { renderRoleInfo } from '@/views/live/columns.js'
import textShowMore from '@/components/textShowMore/index2.vue'
import virtualList from './virtualList'
import axios from 'axios'
export default {
  components: {
    AppDialog,
    msgSelect,
    textShowMore,
    virtualList
  },
  data() {
    var checkType = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择话述类型'))
      } else if (this.form.msgContent === '') {
        const ErrorText = {
          1: '请输入内容',
          3: '请输入话述',
          2: '请输入内容',
          5: '请选择表情包',
          4: '请上传图片'
        }
        callback(new Error(ErrorText[value]))
      } else {
        callback()
      }
    }
    return {
      drag: true,
      loading: false,
      visible: false,
      top: '114px',
      search: { robotNickName: '' },
      list: [],
      showlist: [],
      // pageSize: 30,
      // total: 0,
      // currentPage: 1,
      form: {
        senderType: 1, // 人员类型 1机器人 2数字人
        robots: [], // 用户/机器人
        msgType: 3, // 消息类型
        msgContent: '' // 消息内容
      },
      robotsError: false,
      rules: {
        senderType: [{ required: true, message: '请选择学员类型', trigger: 'blur' }],
        msgType: [{ required: true, validator: checkType, trigger: 'blur' }]
      },
      liveRoomId: '',
      groupId: '',
      randomlySelect: '' // 随机选人
    }
  },
  watch: {
    visible: {
      handler(val) {
        val && this.getList()
      }
    },
    deep: true,
    immediate: true
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 582) / 2 + 'px'
  },
  methods: {
    renderRoleInfo,
    sure(type) {
      this.robotsError = this.form.robots.length === 0
      if (this.robotsError) { return }
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('baocun ')
          this.onhandleSend(type)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async onhandleSend(type) {
      this.loading = true
      let width = 0
      let height = 0
      if (this.form.msgType === 4) {
        // 获取OSS图片宽高
        const res = await axios(this.form.msgContent + '?x-oss-process=image/info')
        console.log(res, '获取的图片信息')
        if (res?.data?.ImageHeight) {
          height = Number(res.data.ImageHeight.value)
        }
        if (res?.data?.ImageWidth) {
          width = Number(res.data.ImageWidth.value)
        }
      } else if (this.form.msgType === 2) {
        width = 20
        height = 20
      }
      const data = {
        groupId: this.groupId,
        width,
        height,
        ...this.form,
        robotIds: this.form.robots
      }
      sendRobotMsg(data).then(res => {
        this.$message.success({ message: '发送成功' })
        this.form = {
          senderType: 1, // 人员类型 1机器人 2数字人
          robots: [], // 用户/机器人
          msgType: 3, // 消息类型
          msgContent: '' // 消息内容
        }
        this.loading = false
        if (type === 'close') {
          this.visible = false
        }
        // this.visible = false
      }).catch(() => {
        this.loading = false
      })
    },
    onhandleTypeChange() {
      this.$refs.form && this.$refs.form.clearValidate()
    },
    getList() {
      this.loading = true
      const data = {
        // pageIndex: this.currentPage,
        // pageSize: this.pageSize,
        liveRoomId: this.liveRoomId,
        robotNickName: this.search.robotNickName
      }
      getRobotListByRoomId(data).then(res => {
        this.showlist = res.data.reduce((pre, next, index) => {
          (index % 3 === 0) && pre.push(index)
          return pre
        }, [])
        this.list = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    robotsChangeFn(res) {
      this.robotsError = this.form.robots.length === 0
    },
    robotsClickFn(res) {
      const index = this.form.robots.findIndex(v => { return v === res.robotId })
      if (index > -1) {
        this.form.robots.splice(index, 1)
      } else {
        if (this.form.robots.length >= 20) {
          return
        }
        this.form.robots.push(res.robotId)
      }
    },
    randSelect(res) {
      console.log(this.list, 'list')
      if (res) {
        // const arr = JSON.parse(JSON.stringify(this.list))
        const arr = this.list.reduce((pre, next) => {
          renderRoleInfo(next.robotId).role === '' && pre.push(next)
          return pre
        }, [])
        const randArr = this.randomArr(arr, res > arr.length ? arr.length : res)
        this.form.robots = randArr
      }
      this.robotsChangeFn()
    },
    randomArr(arr, max) {
      console.log(max)
      const newArr = []// 创建一个新数组
      for (let i = 0; i < max; i++) {
        const temp = Math.floor(Math.random() * arr.length)// 取随机下标
        newArr.push(arr[temp].robotId)// 添加到新数组
        arr.splice(temp, 1)// 删除当前的数组元素,避免重复
      }
      return newArr
    }
  }
}
</script>

<style lang='scss' scoped>
.robotSend {
  height: 479px;
  padding: 20px;
  .robotsBox {
    width: 640px;
    height: 220px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    .robotsSearch {
      display: flex;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #E1E6ED;
    }
    .icon-list {
      height: 155px;
      .noData {
        line-height: 155px;
        text-align: center;
      }
      .selectList {
        padding: 15px;
      }
      .robotSendItemList {
        display: flex;
      }
      .robotNickName {
        display: flex;
        width: 156px;
        // display: inline-block;
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
        align-items: center;
      }
    }
    .searchTips {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
    }
  }
}
::v-deep {
  .infinite-list {
    padding: 15px;
  }
  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
  }
  .el-checkbox {
    margin-right: 16px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
}
.errorTips {
  color: #ff4949;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}
::v-deep {
  .textShowMore {
    width: auto;
  }
}
.user_info_role {
  width: 28px;
  height: 16px;
  background: #0091FF;
  border-radius: 2px;
  font-size: 10px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 14px;
  text-align: center;
  // margin-left: 4px;
  margin-right: 4px;
}
</style>
