<template>
  <div class="page_warp">
    <div class="page_header">
      <div>
        <span class="pointer" @click="$router.push({ path: `/ptyy/member/list` })">用户列表</span>
        <span class="m-l-10 m-r-10">/</span>
        <span>用户详情</span>
      </div>
      <div class="fl">
        <!-- <el-dropdown>
          <el-button type="primary">
            联系用户<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>发短信</el-dropdown-item>
            <el-dropdown-item>发站内信</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <!--        <el-button-->
        <!--          v-permission="['user:edit', $route.meta.permsList]"-->
        <!--          class="header_Detail m-l-20"-->
        <!--          @click="openDetailEdit"-->
        <!--        >编辑资料</el-button>-->
      </div>
    </div>

    <div class="page_user_info m-t-20">
      <el-row class="w-100p customer-info-content">
        <el-col :span="12">
          <div class="fl w-100p">
            <AppAvatar
              :avatar="detail.headImg"
              :name="detail.name || detail.realName || detail.id || detail.phone"
              width="80"
              :no-name="true"
            />
            <div class="m-l-20 w-100p">
              <div class="user_name">{{ detail.name }}</div>
              <div class="customer-info-list">
                <div>
                  <span>真实姓名:</span>
                  <span>{{ detail.realName }}</span>
                </div>
                <div>
                  <span>手机号:</span>
                  <span>
                    <tablePhoneItem
                      v-model="detail.phone"
                      :phone-area-code="detail.phoneAreaCode"
                      :row-data="detail"
                      type="platformUser"
                    />
                  </span>
                </div>
                <div>
                  <span>邮箱:</span>
                  <span>
                    <tablePhoneItem
                      v-model="detail.email"
                      :value="detail.email"
                      :row-data="detail"
                      type="email"
                    />
                  </span>
                </div>
                <div>
                  <span> 来源:</span>
                  <span>
                    {{
                      detail.userSource | getOptionsValue(userSourceType)
                    }}</span>
                </div>
                <div>
                  <span>性别:</span>
                  <span>{{ { 1: '男性', 2: '女性', 3: '未知' }[detail.sex] }}</span>
                </div>
                <div>
                  <span>生日:</span>
                  <span>{{ detail.birthday }}</span>
                </div>
                <div>
                  <span>地区:</span>
                  <span>{{ detail.areaName }}</span>
                </div>
                <div>
                  <span>公司:</span>
                  <span>{{ detail.company }}</span>
                </div>
                <div>
                  <span>职位:</span>
                  <span>{{ detail.position }}</span>
                </div>
                <div>
                  <span>微信号:</span>
                  <span>{{ detail.wechatNumber }}</span>
                </div>
                <div style="width: 66%; display: flex; align-items: center">
                  <span>id:</span>
                  <AppIconClipboard :src="detail.id">
                    <span class="m-l-10">{{ detail.id }}</span>
                  </AppIconClipboard>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="customer-transaction">
            <div class="customer-title">
              <span>交易统计</span>
              <!--              <div>-->
              <!--                <el-button v-permission="['web:user:editPhone', $route.meta.permsList]" size="small" @click="openEditMsg(detail)">修改记录</el-button>-->
              <!--                <el-button-->
              <!--                  v-permission="['web:user:editPhone', $route.meta.permsList]"-->
              <!--                  type="primary"-->
              <!--                  size="small"-->
              <!--                  @click="openEditPhone(detail)"-->
              <!--                >修改手机</el-button>-->
              <!--              </div>-->
            </div>
            <div class="customer-transaction-list">
              <div class="customer-transaction-item">
                <div class="customer-transaction-title">消费总额(元)</div>
                <div class="customer-transaction-number">{{ (detail.consumeAmount || 0) | filtersMoney }}</div>
              </div>
              <div class="customer-transaction-item">
                <div class="customer-transaction-title">消费次数</div>
                <div class="customer-transaction-number">{{ detail.consumeNum }}</div>
              </div>
              <div class="customer-transaction-item">
                <div class="customer-transaction-title">最近消费时间</div>
                <div class="customer-transaction-number">{{ detail.createTime | parseTime }}</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="customer-info-more">
        <div class="customer-info-more__box customer-info-remark">
          <div class="customer-info-more__title">
            <span>备注:</span>
          </div>
          <div class="customer-info-more__content">
            <span v-if="!detail.remark" class="customer-info-remark__none">暂无备注</span>
            <span v-else class="text_more">{{ detail.remark }}</span>
          </div>
          <el-popover v-model="visible" placement="left-start" title="备注" width="500" trigger="click">
            <el-input v-model.trim="textarea" maxlength="500" show-word-limit type="textarea" :rows="4" />
            <div class="m-t-10 user-popover-content__foot">
              <el-button @click="visible = false">取消</el-button>
              <el-button type="primary" :loading="remakeLoading" @click="editRemake">确定</el-button>
            </div>
            <i slot="reference" class="el-icon-edit customer-info-remark__Detail" type="primary" />
          </el-popover>
        </div>
        <div class="customer-info-more__box customer-info-remark">
          <div class="customer-info-more__title"><span>标签:</span></div>
          <div class="customer-info-more__content">
            <el-tag
              v-for="(item, index) in detail.labelList"
              :key="item.labelId"
              class="m-r-10"
              closable
              :disable-transitions="false"
              @close="handleClose(item, index)"
            >
              {{ item.labelName }}
            </el-tag>
            <span v-if="detail.labelList.length === 0" class="customer-info-remark__none">暂无标签</span>
          </div>
          <el-popover v-model="labelVisible" placement="right-start" width="325" trigger="click">
            <el-select v-model="labelList" class="w-300" multiple :loading="labelLoading" value-key="labelId">
              <div class="search-input-box p-10">
                <el-input v-model.trim="labelSearch" suffix-icon="el-icon-search" clearable @input="getLabeloption" />
              </div>
              <el-option v-for="item in labelOption" :key="item.labelId" :label="item.labelName" :value="item">
                {{ item.labelName }}
              </el-option>
            </el-select>
            <div class="m-t-10 tag-popover-footer">
              <el-button type="text" @click="openAddGroup">新建标签</el-button>
              <div class="btn-box">
                <el-button @click="labelVisible = false">取消</el-button>
                <el-button type="primary" :loading="labelLoading" @click="editLebal">确定</el-button>
              </div>
            </div>
            <span slot="reference" type="text" class="tielabel">贴标签</span>
          </el-popover>
        </div>
      </div>

      <div class="w_100p">
        <el-tabs v-model="activeName">
          <el-tab-pane label="开通记录" name="openRecord" />
          <el-tab-pane label="学习数据" name="learningData" />
          <el-tab-pane label="跟进记录" name="userFollow" />
          <el-tab-pane label="虚拟币" name="virtualCurrency" />
        </el-tabs>
        <components :is="activeName" :phone-area-code="phoneAreaCode" :data="detail.goodsOrderDetailVoList" :user-id="$route.params.id" />
      </div>
    </div>

    <!-- 新建标签弹框层 -->
    <AppDialog v-model="modal.visible" :title="modal.title" width="500px" height="200px" @success="sendSuccess">
      <div class="choose_resource m-t-20 p-10">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="标签名称" prop="labelName">
            <el-input v-model.trim="form.labelName" class="w-300" maxlength="20" show-word-limit />
          </el-form-item>
          <el-form-item label="标签类型">
            <span>{{ { 0: '手动标签', 1: '其他标签' }[form.labelType] }}</span>
          </el-form-item>
        </el-form>
      </div>
    </AppDialog>

    <AppDialog
      v-model="detailModal.visible"
      :title="detailModal.title"
      width="900px"
      height="400px"
      @success="detailEdit"
    >
      <div v-loading="detailFormLoading" class="choose_resource m-t-20 p-10">
        <el-form ref="detailForm" :model="detailForm" label-width="80px" :inline="true" :rules="detailEditRules">
          <el-form-item label="id" prop="labelName">
            <el-input v-model.trim="detail.id" class="w-200" :disabled="true" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model.trim="detail.phone" class="w-200" :disabled="true" />
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input v-model.trim="detailForm.name" class="w-200" />
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model.trim="detailForm.realName" class="w-200" />
          </el-form-item>

          <el-form-item label="性别" prop="sex">
            <el-select v-model="detailForm.sex" class="w-200" placeholder="请选择">
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
              <el-option label="未知" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker
              v-model="detailForm.birthday"
              class="w-200"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
          </el-form-item>

          <el-form-item label="邮箱" prop="mailbox">
            <el-input v-model.trim="detailForm.mailbox" class="w-200" />
          </el-form-item>
          <el-form-item label="微信号" prop="wechatNumber">
            <el-input v-model.trim="detailForm.wechatNumber" class="w-200" />
          </el-form-item>

          <el-form-item label="公司" prop="company">
            <el-input v-model.trim="detailForm.company" class="w-200" />
          </el-form-item>
          <el-form-item label="职位" prop="position">
            <el-select v-model="detailForm.position" placeholder="请选择" class="w-200">
              <el-option label="董事长" value="董事长" />
              <el-option label="总经理" value="总经理" />
              <el-option label="高管" value="高管" />
              <el-option label="中层" value="中层" />
              <el-option label="普通员工" value="普通员工" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>

          <el-form-item label="省市区" prop="city">
            <!-- <el-cascader
              v-model="detailForm.city"
              :options="city"
              :props="{ label: 'label', value: 'label' }"
              style="width: 490px"
            /> -->
            <AppChinaArea v-model="detailForm.city" clearable :check-strictly="true" :maxlevel="4" propsvalue="name" style="width: 500px" />
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model.trim="detailForm.address" style="width: 780px" />
          </el-form-item>
        </el-form>
      </div>
    </AppDialog>

    <openPhoneModal ref="openPhoneModal" @success="getDetail" />
    <editMsgModal ref="editMsgRef" />
  </div>
</template>

<script>
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { PlatformDetail, userEdit, userLabelDisassociate, userLabelBatch } from '@/api/user/member'
import openRecord from './openRecord.vue'
import learningData from './learningData.vue'
import userFollow from './userFollow.vue'
import virtualCurrency from './virtualCurrency/index.vue'
import { GetList, Add } from '@/api/user/label'
import AppDialog from '@/components/AppDialog'
import AppIconClipboard from '@/components/AppIconClipboard'
import city from '@/utils/city.js'
import openPhoneModal from './components/editPhoneModal'
import editMsgModal from './components/editMsgModal'
import AppChinaArea from '@/components/AppChinaArea'
import { userSourceType } from '@/utils/enum'
import { userGetPhone } from '@/api/phoneEncrypt'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
export default {
  components: {
    AppAvatar,
    openRecord,
    learningData,
    AppDialog,
    AppIconClipboard,
    userFollow,
    virtualCurrency,
    openPhoneModal,
    AppChinaArea,
    editMsgModal,
    tablePhoneItem
  },
  data() {
    var checkcity = (rule, value, callback) => {
      if (value.length === 1) {
        callback(new Error('省市区请至少选择两级'))
      } else {
        callback()
      }
    }
    return {
      phoneAreaCode: '',
      connect: '',
      city,
      userSourceType,
      detail: {
        channelSource: '',
        cityCode: '',
        consumeAmount: '',
        consumeNum: '',
        createTime: '',
        phoneAreaCode: '',
        goodsOrderDetailVoList: [],
        headImg: '',
        idCard: '',
        labelList: [],
        name: '',
        phone: '',
        realName: '',
        sex: '',
        type: '',
        uid: '',
        id: '',
        userSource: '',
        remark: ''
      },
      activeName: 'openRecord',
      visible: false, // 编辑备注
      labelVisible: false, // 贴标签弹框
      textarea: '',
      remakeLoading: false,
      labelLoading: false,
      labelOption: [],
      labelList: [],
      labelSearch: '',
      // 新建标签弹框属性
      modal: {
        title: '新增标签',
        type: 1, // 1: 新增; 2查看; 3编辑;
        visible: false
      },
      // 新建标签弹框form
      form: {
        labelName: '',
        labelType: 0
      },
      // 新建标签弹框rule
      rules: {
        labelName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },

      // 编辑资料弹框
      detailModal: {
        title: '编辑资料',
        visible: false
      },
      // 编辑资料form
      detailForm: {
        name: '', // 昵称
        realName: '', // 真实性别
        sex: '', // 性别
        birthday: '', // 生日
        city: ['', '', '', ''], // 省市区
        address: '', // 详细地址
        company: '', // 公司
        position: '', // 职位
        mailbox: '', // 邮箱
        wechatNumber: '' // 微信号
      },
      // 编辑资料rule
      detailEditRules: {
        city: [
          { validator: checkcity, trigger: 'change' }
        ]
      },
      detailFormLoading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getDetail()
      this.getLabeloption('')
    },
    getDetail() {
      this.loading = true
      PlatformDetail(this.$route.params.id)
        .then((res) => {
          console.log(res, '获取详情信息')
          const city = ['', '', '']
          if (res.data.areaName) {
            const arr = res.data.areaName.split('\t')
            city[0] = arr[0] ? arr[0] : ''
            city[1] = arr[1] ? arr[1] : ''
            city[2] = arr[2] ? arr[2] : ''
            // city[3] = arr[3] ? arr[3] : ''
          }
          console.log(city, 'city')
          this.detail = {
            areaName: res.data.areaName ? res.data.areaName.replace(/\t/g, '/') : '',
            channelSource: res.data.channelSource || '',
            email: res.data.email || '',
            cityCode: res.data.cityCode || '',
            consumeAmount: res.data.consumeAmount || '',
            consumeNum: res.data.consumeNum || '',
            createTime: res.data.createTime || '',
            goodsOrderDetailVoList: res.data.goodsOrderDetailVoList || [],
            headImg: res.data.headImg || '',
            idCard: res.data.idCard || '',
            labelList: res.data.labelList || [],
            name: res.data.name || '',
            phone: res.data.phone || '',
            phoneAreaCode: res.data.phoneAreaCode || '',
            realName: res.data.realName || '',
            sex: res.data.sex || '',
            type: res.data.type || '',
            uid: res.data.uid || '',
            id: res.data.id || '',
            userSource: res.data.userSource || '',
            remark: res.data.remark || '',
            birthday: res.data.birthday || '', // 生日
            city, // 省市区
            address: res.data.address || '', // 详细地址
            company: res.data.company || '', // 公司
            position: res.data.position || '', // 职位
            mailbox: res.data.mailbox || '', // 邮箱
            wechatNumber: res.data.wechatNumber || '' // 微信号
          }
          this.textarea = this.detail.remark || ''
          this.labelList = JSON.parse(JSON.stringify(this.detail.labelList))
          this.loading = false
          this.phoneAreaCode = res.data.phoneAreaCode
          console.log('eeeeeeee:', this.detail)
        })
        .catch(() => {
          this.loading = false
        })
    },
    async openEditPhone(row) {
      const { data } = await userGetPhone(row.id)
      this.$refs.openPhoneModal.open({
        ...row,
        phone: data
      })
    },
    openEditMsg(row) {
      this.$refs.editMsgRef.open(row)
    },
    // 删除标签
    handleClose(row, i) {
      console.log(row)
      const params = {
        labelId: row.labelId,
        platformUserId: this.$route.params.id
      }
      userLabelDisassociate(params)
        .then((res) => {
          this.init()
        })
        .catch(() => {})
    },
    // 编辑备注
    editRemake() {
      this.remakeLoading = true
      const data = {
        id: this.detail.id,
        remark: this.textarea
      }
      userEdit(data)
        .then((res) => {
          this.visible = false
          this.remakeLoading = false
          this.init()
        })
        .catch(() => {
          this.remakeLoading = false
        })
    },
    getLabeloption(query) {
      this.labelLoading = true
      const params = {
        size: 20,
        current: 1,
        labelName: query
      }
      GetList(params)
        .then((res) => {
          if (res.data && res.data.records) {
            this.labelOption = res.data.records
          }
          this.labelLoading = false
        })
        .catch(() => {
          this.labelLoading = false
        })
    },
    // 编辑标签
    editLebal() {
      this.labelVisible = false
      this.labelLoading = true
      const list = []
      this.labelList.map((v) => {
        list.push({
          labelIdList: [v.labelId],
          platformUserId: this.$route.params.id
        })
      })
      const data = {
        list
      }
      userLabelBatch(data)
        .then((res) => {
          this.visible = false
          this.labelLoading = false
          this.init()
        })
        .catch(() => {
          this.labelLoading = false
        })
    },
    // 新增标签确定
    sendSuccess() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.form))
          let res = null
          if (this.modal.type === 1) {
            // 新增
            res = await Add(data)
          }
          if (res) {
            this.closeModal()
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success'
            })
            this.getLabeloption('')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 关闭新增标签弹框
    closeModal() {
      // this.groupStore.clearForm()
      this.modal.visible = false
    },
    // 打开新增标签
    openAddGroup() {
      this.modal = {
        title: '新建',
        type: 1,
        visible: true
      }
      this.form = {
        labelName: '',
        labelType: 0
      }
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    openDetailEdit() {
      this.$refs.detailForm && this.$refs.detailForm.clearValidate()
      console.log(this.detail)
      this.detailModal.visible = true
      this.detailForm = {
        name: this.detail.name || '',
        realName: this.detail.realName || '',
        sex: this.detail.sex || '', // 性别
        birthday: this.detail.birthday || '', // 生日
        city: this.detail.city, // 省市区
        address: this.detail.address || '', // 详细地址
        company: this.detail.company || '', // 公司
        position: this.detail.position || '', // 职位
        mailbox: this.detail.mailbox || '', // 邮箱
        wechatNumber: this.detail.wechatNumber || '' // 微信号
      }
    },
    detailEdit() {
      this.$refs.detailForm.validate((valid) => {
        if (valid) {
          this.detailModal.visible = false
          this.detailFormLoading = true
          console.log(this.detailForm.city)
          const cityCode = this.getCityCode(this.detailForm.city)
          let areaName = ''
          if (this.detailForm.city[0]) {
            areaName = this.detailForm.city.join('\t')
          }
          const data = {
            id: this.detail.id,
            ...this.detailForm,
            cityCode,
            areaName
          }
          userEdit(data)
            .then((res) => {
              this.detailFormLoading = false
              this.init()
            })
            .catch(() => {
              this.detailFormLoading = false
              this.remakeLoading = false
            })
        } else {
          return false
        }
      })
    },
    getCityCode(arr) {
      try {
        if (arr && arr[0]) {
          const obj = this.city.find((v) => v.label === this.detailForm.city[0])
          if (obj.children && obj.children.length > 0) {
            const areaName = obj.children.find((v) => v.label === this.detailForm.city[1])
            return areaName.value || ''
          } else {
            return obj.value || ''
          }
        } else {
          return ''
        }
      } catch (err) {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page_warp {
  width: 100%;
  .page_header {
    width: 100%;
    background-color: #fff;
    border-radius: 4px;
    padding: 20px 21px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header_connect {
      padding: 8px;
      text-align: center;
      margin-right: 10px;
      width: 120px;
      background: #ccc;
    }
    // .header_Detail {
    //   padding: 8px;
    //   text-align: center;
    //   margin-right: 10px;
    //   width: 120px;
    //   background: #ccc;
    //   font-size: 14px;
    //   color: #606266;
    // }
  }
  .page_user_info {
    width: 100%;
    background-color: #fff;
    border-radius: 4px;
    padding: 20px 21px;
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    .customer-info-content {
      border-bottom: 1px solid #eee;
    }
    .user_name {
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      margin-bottom: 18px;
    }
    .customer-transaction {
      .customer-title {
        margin-right: 8px;
        font-size: 16px;
        margin-bottom: 20px;
        height: 22px;
        line-height: 22px;
        color: #333;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .customer-transaction-list {
        width: 100%;
        display: flex;
        padding: 10px 0;
        border-radius: 2px;
        border: 1px solid #eee;
        .customer-transaction-item {
          width: 33.33%;
          padding-left: 20px;
          border-right: 1px solid #eee;
          .customer-transaction-title {
            margin-bottom: 4px;
            color: #333;
          }
          .customer-transaction-number {
            margin-bottom: 0;
            color: #333;
            font-size: 20px;
            font-weight: 600;
            line-height: 28px;
          }
        }
      }
    }
    .customer-info-list {
      max-height: 600px;
      position: relative;
      display: flex;
      flex-wrap: wrap;
      //max-height: 40px;
      overflow: hidden;
      transition: max-height 0.5s;
      width: 100%;
      > div {
        width: 33.33%;
        line-height: 20px;
        margin-bottom: 16px;
        display: flex;
        > span:nth-child(1) {
          // margin-right: 8px;
          word-break: keep-all;
          line-height: 22px;
          font-size: 14px;
        }
        > span:nth-child(2) {
          white-space: pre-wrap;
          word-break: break-all;
          line-height: 22px;
          font-size: 14px;
        }
      }
    }
    .customer-info-more {
      padding-top: 20px;
      font-size: 14px;
      .customer-info-more__box {
        display: flex;
        line-height: 20px;
        margin-bottom: 24px;
        .customer-info-more__title {
          min-width: 70px;
          flex-shrink: 0;
          margin-right: 8px;
          text-align: right;
        }
        .customer-info-more__content {
          margin-right: 8px;
          .customer-info-remark__none {
            color: #999;
          }
        }
      }
    }
    .text_more {
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}
.user-popover-content__foot {
  text-align: right;
}
.tag-popover-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.customer-info-remark__Detail {
  cursor: pointer;
  color: #409eff;
}
.customer-info-remark__none {
  font-size: 14px;
  color: #999;
}
.scrollMenuBox {
  width: 300px;
  height: 200px;
}
.checkBox {
  padding: 12px;
  box-sizing: border-box;
  margin-right: 0 !important;
}
::v-deep {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
.tielabel {
  line-height: 22px;
  cursor: pointer;
  color: #409eff;
}
</style>
