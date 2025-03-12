<template>
  <!-- 营销通客服 -->
  <div class="page_wrap">
    <div class="m-t-20 m-b-20">
      <el-alert title="加微客服需要单独购买，并且客服需要审核。一个客服对应伏羲云一个员工账号，员工必须绑定企业微信" type="warning" :closable="false" />
      <el-button class="m-t-20" icon="el-icon-plus" type="primary" size="mini" @click="onhandleAdd">新增</el-button>
    </div>
    <div class="tableBox">
      <el-table v-loading="loading" height="100%" :data="tableData" :header-cell-style="{ background: '#f5f5f5' }">
        <el-table-column prop="deptName" label="部门名称" :show-overflow-tooltip="true" />
        <el-table-column prop="userName" label="伏羲云员工姓名" align="center" />
        <el-table-column prop="customerName" label="客服名称" />
        <el-table-column prop="qrCode" label="客服素材二维码" align="center" width="182">
          <template slot-scope="{ row }">
            <template v-if="row.fileId">
              <el-popover placement="bottom" width="152" trigger="hover">
                <div class="popoverBox">
                  <el-image style="width: 123px; height: 123px" :src="row.qrCode" :preview-src-list="[row.qrCode]" />
                  <el-button class="downBtn" type="primary" size="mini" @click="downUrl(row.qrCode, row)">下载</el-button>
                </div>
                <el-image slot="reference" style="width: 48px; height: 48px" :src="row.qrCode" :preview-src-list="[row.qrCode]" />
              </el-popover>
            </template>
            <template v-else>
              <div class="qrCodeCreatBox">
                <AppStatus status="error"><span class="c_error">未生成</span></AppStatus>
                <span class="create_btn" @click="onhandleCreate(row)">生成</span>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="checkResult" label="二维码审核状态">
          <template slot-scope="{ row }">
            <!-- {{ { 0: '未审核', 1: '审核成功', 2: '审核未通过' }[row.checkResult] }} -->
            <MIconStatus
              :background="getOptionsValueByKey('value','background',row.checkResult,checkResultOption)"
              :color="getOptionsValueByKey('value','color', row.checkResult,checkResultOption)"
              :icon-class="getOptionsValueByKey('value', 'icon', row.checkResult, checkResultOption)"
              :title="getOptionsValueByKey('value','label',row.checkResult,checkResultOption)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="expirationDate" label="过期时间" />
        <el-table-column prop="isDefault" label="兜底人员" align="center">
          <template slot-scope="{ row }">
            {{ { 0: '否', 1: '是' }[row.isDefault] }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="onhandleEdit(row)">编辑</el-button>
            <el-button
              v-if="row.isDefault === 0 && row.checkResult === 1"
              type="text"
              @click="editSetIsDefault(row)"
            >设为兜底人员</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <addCustomerDialog
      :config="addDialogConfig"
      @success="onhandleCloseDialog"
    />
  </div>
</template>

<script>
import { getCluePageList, setIsDefault, createQrCode } from '@/api/privateArea/toolbox'
import addCustomerDialog from './components/addCustomerDialog.vue'
import { downLink } from '@/utils/index'
import { getOptionsValueByKey } from '@/filters/index'
import AppStatus from '@/components/AppStatus'
export default {
  components: {
    addCustomerDialog,
    AppStatus
  },
  data() {
    return {
      tableData: [],
      loading: false,
      addDialogConfig: {
        visible: false,
        type: 1, // 1新增,2编辑
        row: {}
      },
      checkResultOption: [
        { label: '未审核', value: 0, background: '#EEF2F9', color: '#717F99', icon: '未审核' },
        { label: '审核成功', value: 1, background: '#E6F7EA', color: '#00B42A', icon: 'audit_success' },
        { label: '审核未通过', value: 2, background: '#FEECEC', color: '#F53F3F', icon: 'audit_fail' }
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getOptionsValueByKey,
    // 获取列表数据
    getList() {
      // this.loading = true
      console.log('获取数据')
      this.loading = true
      getCluePageList()
        .then(res => {
          this.tableData = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击新增
    onhandleAdd() {
      this.addDialogConfig = {
        visible: true,
        type: 1,
        row: {}
      }
    },
    onhandleEdit(row) {
      this.addDialogConfig = {
        visible: true,
        type: 2,
        row: row
      }
    },
    onhandleCloseDialog() {
      this.addDialogConfig.visible = false
      this.getList()
    },
    // 点击设为兜底人员
    editSetIsDefault(row) {
      this.$delModal({
        tips: '是否确认当前人员为兜底人员，设置为兜底人员后，其他找不到客服的人员默认走兜底逻辑。',
        success: () => {
          this.loading = true
          const data = {
            userId: row.userId
          }
          setIsDefault(data)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    downUrl(url, row) {
      downLink(url, row.customerName + '.png')
    },
    // 点击生成按钮
    onhandleCreate(row) {
      this.loading = true
      const data = {
        userId: row.userId
      }
      createQrCode(data).then(res => {
        this.loading = false
        this.getList()
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  height: calc(100vh - 186px);
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  .tableBox {
    flex: 1 0 0;
  }
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 10px 0px 0px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
.popoverBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .downBtn {
    margin-top: 16px;
    width: 68px;
  }
}
.qrCodeCreatBox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 162px;
  > .AppStatus {
    width: 70px;
  }
  .c_error {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #F53F3F;
    line-height: 22px;
  }
  .create_btn {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0C6FFF;
    line-height: 22px;
    cursor: pointer;
  }
}
</style>
