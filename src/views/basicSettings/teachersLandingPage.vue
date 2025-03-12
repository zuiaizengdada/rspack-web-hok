<template>
  <MCard>
    <div class="videoDeliverySettings">师资落地页配置</div>
    <div class="form">
      <div class="tips">{{ tips }}</div>
      <!-- <el-button
        v-if="20 > form.urls.length"
        size="mini"
        @click="addUrls"
      ><i class="el-icon-plus el-icon--left" />添加</el-button> -->
      <el-form ref="form" :rules="rule" :model="form" label-width="100px">
        <template v-if="form.urls.length">
          <div v-for="(item, index) in form.urls" :key="index">
            <el-form-item :label="'落地页链接'+Number(index+1)" :prop="'urls.' + index + '.landingUrl'" :rules="[{ required: true, message: '请输入落地页链接：', trigger: 'blur' }]">
              <div class="urls-box">
                <div class="urls-box-l">
                  <el-input
                    v-model="item.landingUrl"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    class="w-500"
                  />
                </div>
                <div class="urls-box-r">
                  <el-button v-if="index === 0 && 20 > form.urls.length" type="primary" icon="el-icon-plus" circle @click="addUrls" />
                  <el-button v-if="index > 0" type="danger" icon="el-icon-delete" circle @click="delUrls(index)" />
                </div>
              </div>

            </el-form-item>
          </div>
        </template>
        <el-form-item>
          <el-button :loading="loading" size="small" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </MCard>
</template>

<script>
import { getTeachersLandingPage, updateTeachersLandingPage } from '@/api/deliver/baseSeeting'
export default {
  components: {},
  data() {
    return {
      tips: '链接地址必须带机构ID，且最多可添加20个',
      form: {
        urls: [
          {
            landingUrl: ''
          }
        ]
      },
      rule: {},
      loading: false
    }
  },
  mounted() {
    this.getTeachersLandingPage()
  },
  methods: {
    async getTeachersLandingPage() {
      const { data } = await getTeachersLandingPage()
      if (data.length) {
        this.form.urls = []
        data.map(v => {
          this.form.urls.push(v)
        })
      }
    },
    addUrls() {
      this.form.urls.push({ landingUrl: '' })
    },
    delUrls(index) {
      this.form.urls.splice(index, 1)
    },
    checkUrl(str) {
      const RegUrl = new RegExp()
      RegUrl.compile('^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$')
      if (!RegUrl.test(str)) {
        return false
      }
      return true
    },
    // 点击保存
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const flag = true
          // if (this.form.urls.length) {
          //   let status = true
          //   this.form.urls.map((v, i) => {
          //     if (status) {
          //       console.log('this.checkUrl(v.landingUrl)', this.checkUrl(v.landingUrl))
          //       this.checkUrl(v.landingUrl) === false ? status = false : ''
          //     }
          //     if (i === this.form.urls.length - 1) {
          //       status ? flag = true : ''
          //     }
          //   })
          // }
          if (flag) {
            const repeatArr = this.form.urls.map(item => item.landingUrl)
            const arrSet = new Set(repeatArr)
            if (arrSet.size === this.form.urls.length) {
              const params = {
                landingRequests: this.form.urls
              }
              console.log('params', params)
              this.loading = true
              updateTeachersLandingPage(params).then(res => {
                this.loading = false
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.getTeachersLandingPage()
              }).catch(() => {
                this.loading = false
              })
            } else {
              this.$message.error('链接不能相同')
            }
          } else {
            this.$message.error('添加链接存在不是以http://https://开头，或者不是网址！')
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
  .el-input-group__append, .el-input-group__prepend {
    padding: 0 10px;
  }
}
::v-deep  .el-form-item__label {
  width: 140px !important;
}
.videoDeliverySettings {
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 24px;
  padding-bottom: 20px;
  margin: 0 20px;
  border-bottom: 1px solid #E7E7E7;
}
.form {
  padding: 20px;
  .tips {
    background: #FFF2E6;
    border-radius: 4px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #FF7D00;
    line-height: 22px;
    padding: 9px 16px;
    margin-bottom: 16px;
  }
}
.formLabel {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 22px;
  font-weight: 500;
}
.formValue {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
.m-l-4 {
  margin-left: 4px;
}
.m-r-4 {
  margin-right: 4px;
}
.urls-box {
    display: flex;
    .urls-box-l {
    }
    .urls-box-r {
      padding-left: 10px;
      display: flex;
      align-items: center;
    }
}
</style>
