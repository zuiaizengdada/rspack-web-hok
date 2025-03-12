<template>
  <el-dialog :title="title" :visible.sync="visible" width="600px">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="达人" prop="expertOpenId">
        <el-select
          v-model="form.expertOpenId"
          filterable
          remote
          placeholder="渠道-昵称"
          clearable
          :remote-method="remoteMethod"
          size="small"
          :loading="loading"
          @change="handleChange"
        >
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.expertName"
            :value="item.value"
          >
            <div class="show-cls">
              <img :src="returnImgString(item.expertChannel)" />
              <span>{{ item.expertName }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div v-if="show" class="form-box">
      <div class="form-item" style="margin-bottom: 16px">
        <div class="form-text">
          <span class="form-title">路径：</span>
          <span>{{ link }}</span>
        </div>
        <el-button
          v-if="link"
          type="primary"
          size="small"
          @click="handleCopy(link)"
        >复制</el-button>
      </div>
      <div class="form-item" style="margin-bottom: 16px">
        <div class="form-text">
          <span class="form-title">参数：</span>
          <span>{{ params }}</span>
        </div>
        <el-button
          v-if="params"
          type="primary"
          size="small"
          @click="handleCopy(params)"
        >复制</el-button>
      </div>
      <div class="form-item">
        <div class="form-text">
          <span class="form-title">商品名称：</span>
          <span>{{ details.contentName }}</span>
        </div>
        <el-button
          v-if="details.contentName"
          type="primary"
          size="small"
          @click="handleCopy(details.contentName)"
        >复制</el-button>
      </div>
    </div>
    <div class="flex flex-right">
      <el-button
        type="primary"
        size="small"
        @click="getLink"
      >生成路径</el-button>
      <el-button size="small" @click="visible = false">取消</el-button>
    </div>
    <el-dialog
      width="1050px"
      title="当前达人未绑定"
      :visible.sync="innerVisible"
      append-to-body
    >
      <div class="dialog-content">
        <div class="dialog-header">
          <div class="flex" style="font-size: 16px;">
            <img src="@/assets/image/icon_zhuyi.png" alt="" />
            注意
          </div>
          <div style="margin:8px 0 0 32px;">
            当前达人未绑定获课小程序，按下面图片指引进行绑定！如果您的达人是员工号，请联系IT处理。
          </div>
        </div>
        <div class="dialog-box">
          <div class="title">绑定步骤</div>
          <div class="content">
            <div class="item">
              <div class="flex">
                <div class="index">1</div>
                使用达人抖音扫描去绑定
              </div>
              <img
                class="item-qrcode"
                src="@/assets/image/dou/dou_qrcode.png"
                alt=""
              />
            </div>
            <div class="item">
              <div class="flex">
                <div class="index">2</div>
                点击我的，再点击设置
              </div>
              <img
                class="item-img"
                src="@/assets/image/dou/dou_tip.png"
                alt=""
              />
            </div>
            <div class="item">
              <div class="flex">
                <div class="index">2</div>
                点击绑定openid
              </div>
              <img
                class="item-img"
                src="@/assets/image/dou/dou_tip1.png"
                alt=""
              />
            </div>
            <div class="item">
              <div class="flex">
                <div class="index">3</div>
                点击绑定达人账号，进行账号绑定
              </div>
              <img
                class="item-img"
                src="@/assets/image/dou/dou_tip2.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { goodsMountAdd } from '@/api/course'
import { searchExpertChannelEnums } from '@/api/order/performanceShare'
import { getexpertManPage } from '@/api/order/performanceShare'
import { copy } from '@/utils/index'
export default {
  data() {
    return {
      visible: false,
      innerVisible: false,
      details: {},
      form: {
        expertChannel: '',
        expertOpenId: '',
        expertName: ''
      },
      loading: false,
      link: '',
      params: '',
      options: [],
      type: 1,
      rules: {
        expertOpenId: [
          { required: true, message: '请选择达人', trigger: 'change' }
        ]
      },
      liveChannel: [],
      title: '',
      show: false
    }
  },
  mounted() {
    this.searchExpertChannelEnumsd()
    this.remoteMethod()
  },
  methods: {
    open(row, type) {
      this.reset()
      this.visible = true
      this.details = row
      this.type = type
      this.title = type === 1 ? '生成直播链接' : '生成投放链接'
    },
    reset() {
      this.show = false
      this.form = {
        expertChannel: '',
        expertOpenId: '',
        expertName: ''
      }
    },
    searchExpertChannelEnumsd() {
      searchExpertChannelEnums().then(res => {
        this.liveChannel = res.data
      })
    },
    returnImgString(str) {
      let returnString = ''
      this.liveChannel.some(item => {
        if (item.code === str) {
          returnString = item.imageUrl
        }
      })
      return returnString
    },
    getLink() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (
            this.form.expertName !== this.form.expertOpenId &&
            this.form.expertName
          ) {
            this.show = true
            this.goodsMountAdd()
          } else {
            this.innerVisible = true
            this.visible = false
          }
        }
      })
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    handleChange() {
      const data =
        this.options.find(i => i.value === this.form.expertOpenId) ?? {}
      this.show = false
      this.params = ''
      this.link = ''
      this.form.expertChannel = ''
      this.form.expertName = ''
      if (data.expertName !== data.value) {
        this.form.expertChannel = data?.expertChannel
        this.form.expertName = data?.expertName
      }
    },
    remoteMethod(query) {
      this.loading = true
      const params = {
        pageIndex: 1,
        pageSize: 999,
        expertName: query,
        expertChannel: 1
      }
      getexpertManPage(params)
        .then(res => {
          this.options = res.data.items.map((i) => {
            const data =
              i?.douAppExpertList?.find(j => j.appId === 'ttcf1db9a0502c0d3301') ?? ''
            return {
              ...i,
              value: data.expertOpenId || i.expertName
            }
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCopy(val) {
      copy(val)
      this.$message.success('复制成功')
    },
    goodsMountAdd() {
      this.link =
        this.details.goodsType !== 5
          ? 'pages/courseDetails/online/index'
          : 'pages/courseDetails/offline/index'
      if(this.details.goodsType === 8){
        this.link = 'pages/courseDetails/live/index'
      }
      this.params = `id=${this.details.goodsId}&expertOpenId=${this.form.expertOpenId}&shopId=${this.details.tenantId}`
      goodsMountAdd({
        expertChannel: this.form.expertChannel,
        expertOpenId: this.form.expertOpenId,
        expertName: this.form.expertName,
        goodsId: this.details.goodsId,
        param: this.params,
        route: this.link,
        type: this.type,
        tenantId: this.details.tenantId
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.show-cls {
  img {
    float: left;
    width: 16px;
    height: 16px;
    margin-top: 9px;
    border-radius: 100%;
    margin-right: 10px;
  }
  span {
    float: left;
  }
}
.form-box {
  background: #fafafa;
  border-radius: 5px;
  padding: 16px;
  margin-bottom: 48px;
  .form-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333333;
    font-size: 14px;
    .form-text{
      margin-right: 10px;
    }
    .form-title {
      color: #777777;
    }
    .el-button {
      border-radius: 4px;
      border: 1px solid #0c6fff;
      background: #fff;
      color: #0c6fff;
    }
  }
}
.dialog-content {
  .dialog-header {
    padding: 10px;
    border-radius: 15px;
    color: #ff7d00;
    background: #fff2e6;
    margin-bottom: 20px;
    img {
      height: 24px;
      width: 24px;
      margin-right: 8px;
    }
  }
  .dialog-box {
    border-radius: 8px;
    background: #fafafa;
    padding: 20px;
    .title {
      font-weight: 700;
      color: #000000;
      font-size: 16px;
    }
    .content {
      display: flex;
      font-size: 14px;
      .index {
        width: 20px;
        height: 20px;
        color: #fff;
        background: #0c6fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 5px;
      }
      .item {
        display: flex;
        flex-direction: column;
        margin-right: 20px;
        img{
          margin-top: 10px;
        }
        .item-img {
          width: 240px;
          height: 160px;
        }
        .item-qrcode {
          width: 160px;
          height: 160px;
        }
      }
    }
  }
}
</style>
