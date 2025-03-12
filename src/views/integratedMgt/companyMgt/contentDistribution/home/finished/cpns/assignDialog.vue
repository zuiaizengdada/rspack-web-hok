<template>
  <AppDialog
    v-model="modal.visible"
    :title="modal.title"
    width="550px"
    height="auto"
  >
    <div v-loading="modal.loading" class="dialog-content">
      <div :class="[arrs.length > 1 ? 'complex' : '']">
        <div v-for="(item, index) in arrs" :key="index" class="flex cell-box">
          <div class="cell">
            <div class="cell-label w80">视频名称：</div>
            <div class="cell-cnt mw120">
              <template v-if="item.name">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.name"
                  placement="top"
                >
                  <p class="txt-hidden">{{ item.name }}</p>
                </el-tooltip>
              </template>
              <template v-else>
                <p class="txt-hidden">--</p>
              </template>
            </div>
          </div>
          <div class="cell shrink">
            <div class="cell-label">IP：</div>
            <div class="cell-cnt mw60 txt-hidden">
              <template v-if="item.teacherName">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.teacherName"
                  placement="top"
                >
                  <p class="txt-hidden">{{ item.teacherName }}</p>
                </el-tooltip>
              </template>
              <template v-else>
                <p class="txt-hidden">--</p>
              </template>
            </div>
          </div>
          <div class="cell shrink">
            <div class="cell-label">大小：</div>
            <div class="cell-cnt">
              {{ item.size | filterSize }}
            </div>
          </div>
          <div class="cell shrink">
            <div class="cell-label">时长：</div>
            <div class="cell-cnt">
              {{ getPlayDuration(item.duration * 1000) }}
            </div>
          </div>
        </div>
      </div>
      <div>
        <el-form
          ref="formRef"
          :model="ruleForm"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="指派对象" prop="userIdList">
            <el-select
              v-model="ruleForm.userIdList"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入指派对象"
              :remote-method="userRemoteMethod"
              :loading="userLoading"
            >
              <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="`${item.nickName} (${item.deptName})`"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template slot="footer">
      <div class="footer-btn">
        <el-button size="small" @click="dialogChange(false)">取消</el-button>
        <el-button size="small" type="primary" @click="sure"> 确认 </el-button>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getPlayDuration } from '@/utils/index'
import { userNoPage } from '@/api/addressBookApi'
import { finishVideoAssignApi } from '@/api/contentDistribution/index.js'

export default {
  components: { AppDialog },
  data() {
    return {
      modal: {
        visible: false,
        title: '视频指派',
        loading: false,
        desc: '',
        type: ''
      },
      arrs: [],
      ruleForm: { userIdList: [] },
      rules: {
        userIdList: {
          type: 'array',
          required: true,
          message: '请选择指派对象',
          trigger: 'blur'
        }
      },
      userOptions: [],
      userLoading: false
    }
  },
  methods: {
    getPlayDuration,
    dialogChange(type, dataArr) {
      if (type) {
        this.modal = {
          visible: true,
          loading: false,
          title: dataArr.length > 1 ? '视频批量指派' : '视频指派'
        }
        this.arrs = dataArr
        this.$nextTick(() => {
          this.$refs.formRef.resetFields()
        })
      } else {
        this.$refs.formRef.resetFields()
        this.modal = {
          visible: false,
          loading: false,
          title: '视频指派'
        }
        this.arrs = []
      }
    },
    async sure() {
      this.$refs['formRef'].validate(async valid => {
        if (!valid) return
        this.modal.loading = true
        try {
          const { success } = await finishVideoAssignApi({
            idList: this.arrs.map(item => item.id),
            userIdList: this.ruleForm.userIdList
          })
          if (success) {
            this.$emit('refesh')
            this.dialogChange()
          }
        } catch (error) {
          console.log('error----agreementAcceptAddApi', error)
        }
        this.modal.loading = false
      })
    },
    async userRemoteMethod(query) {
      if (query !== '') {
        this.userLoading = true
        try {
          const { data } = await userNoPage({
            nickName: query
          })
          console.log('data-------', data)
          this.userOptions = data
        } catch (error) {
          console.log('error-----userNoPage', error)
        }
        this.userLoading = false
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.shrink {
  flex-shrink: 0;
}
.mw120 {
  max-width: 120px;
}
.dialog-content {
  padding: 20px 20px 0 20px;
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
  .complex {
    width: 100%;
    max-height: 172px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    /* padding: 0 0 10px 0; */
    margin-bottom: 10px;
    padding: 0 12px;
    overflow-y: auto;
    overflow-x: hidden;
    .cell-box {
      border-bottom: 1px solid #dcdfe6;
      height: 43px;
      line-height: 43px;
      margin-bottom: 0px;
      &:last-child {
        border: none;
      }
      .mw120 {
        width: 100px;
      }
    }
  }
  .cell-box {
    margin-bottom: 20px;
  }
  .cell {
    display: flex;
    .cell-label {
      width: 55px;
      color: #777777;
      font-size: 14px;
      font-weight: 400;
      text-align: right;
      flex-shrink: 0;
      &.w80 {
        width: 80px;
      }
    }
    .cell-cnt {
      color: #333333;
      font-size: 14px;
      font-weight: 400;
      &.mw60 {
        max-width: 60px;
      }
    }
  }
  .desc {
    color: #333333;
    font-size: 14px;
    font-weight: 400;
    padding-left: 70px;
  }
}
.footer-btn {
  width: 100%;
  height: 56px;
  border-radius: 0 0 10px 10px;
  background: #ffffff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  border-top: 1px solid #f2f2f2;
}
::v-deep .el-select {
  width: 100%;
}
.txt-hidden {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0; // 避免flex布局的影响
}
</style>
