<template>
  <el-card v-loading="loading" class="bannerTable">
    <div slot="header" class="clearfix">
      <span>{{ row.title }}</span>
      <!-- <el-button style="float: right; padding: 3px 0" class="m-l-10" type="text" @click="save()">保存</el-button> -->
      <!-- <el-button style="float: right; padding: 3px 0" class="m-l-10" type="text" @click="save">保存并预览</el-button> -->
    </div>
    <div class="cell">
      <div class="title">添加内容</div>
      <el-alert class="m-t-10 m-b-10" title="最多添加6个轮播图,拖动选中的轮播图可对其排序,只允许上传尺寸686x296像素的图片，图片大小不超过2M" type="warning" :closable="false" />
      <div class="drag-content">
        <el-form
          v-for="(item, index) in bannerList"
          :ref="`form_${index}`"
          :key="index"
          v-dragging="{ item: item, list: bannerList, group: 'item' }"
          :model="item"
          class="drag_item"
        >
          <div
            class="drag_ul"
            @mouseenter="mouseenter(index)"
            @mouseleave="mouseleave()"
          >
            <el-form-item prop="imgUrl" :rules="[{ required: true, message: '请上传图片', trigger: 'blur' }]">
              <div v-if="!item.imgUrl" class="imageBox" :style="{width: (row.width / 2) + 'px', height: (row.height / 2) + 'px'}" @click="selectImage(item, index)">
                <i class="el-icon-plus" />
                <span>点击上传图片</span>
              </div>
              <AppMyImage
                v-else
                class="imageBox"
                :src="item.imgUrl"
                no-cropper
                :style="{width: (row.width / 2) + 'px', height: (row.height / 2) + 'px'}"
                :options="{
                  width: 567,
                  fixed: true,
                  option: {
                    fixed: true,
                    fixedNumber: [row.width / 2, row.height / 2],
                    fixedBox: false
                  }
                }"
                @close="delImage(item, index)"
                @success="(res) => changeImage(item, res, index)"
              />
            </el-form-item>
            <div class="banner_info">
              <div class="info_form">
                <div class="info_form_label">跳转方式: </div>
                <div>
                  <el-radio-group v-model="item.jumpType" @change="radioChange(index)">
                    <el-radio :label="1">html5</el-radio>
                    <el-radio :label="2">商品详情</el-radio>
                  </el-radio-group>
                </div>
              </div>

              <div class="info_form">
                <div class="info_form_label">
                  <span class="c_red">*</span>
                  跳转对象:
                </div>
                <!-- <div class="fl"> -->
                <el-form-item v-if="item.jumpType === 1" prop="jumpObject" :rules="[{ required: true, message: '请输入跳转地址', trigger: 'blur' }]">
                  <div class="fl">
                    <el-input v-model="item.jumpObject" class="m-r-10" :disabled="item.jumpType === 2" />
                  </div>
                </el-form-item>
                <el-form-item v-if="item.jumpType === 2" prop="goodsId" :rules="[{ required: true, message: '请选择商品', trigger: 'blur' }]">
                  <div class="fl">
                    <el-input v-model="item.goodsId" class="m-r-10" :disabled="item.jumpType === 2" />
                    <el-button type="text" @click="openSelectGoods(item, index)">选择商品</el-button>
                  </div>
                </el-form-item>
                <!-- </div> -->
              </div>

              <div class="info_form">
                <div class="info_form_label">状态: </div>
                <div>
                  <el-switch
                    v-model="item.enabled"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                    active-text="上架"
                    inactive-text="下架"
                  /></div>
              </div>

              <div v-if="index === dexIndex" v-permission="['system:banner:remove', permsList]" class="info_del" @click="del(item, index)">
                <i class="el-icon-error" />
              </div>
            </div>
          </div>
        </el-form>

      </div>
      <div class="footerBtn">
        <div v-permission="['system:banner:add', permsList]" class="add-btn-input drag_item" @click="addImage()">
          <i class="el-icon-plus" />添加轮播图
        </div>
        <div v-permission="['system:banner:add,system:banner:edit', permsList]" class="btn-save" @click="save()">保存</div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { getBannerList, editBannerList } from '@/api/shop'
import AppMyImage from '@/components/AppMyImage'
export default {
  components: {
    AppMyImage
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['row'],
  data() {
    return {
      loading: false,
      bannerList: [],
      dexIndex: -1,
      permsList: this.$route.meta.permsList || []
    }
  },
  watch: {
    row: {
      handler(value) {
        this.getList()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // console.log(this.row)
    // this.getList()
  },
  mounted() {
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', (res) => {
      console.log(res)
    })
  },
  methods: {
    getList() {
      this.loading = true
      const params = {
        type: this.row.type
      }
      getBannerList(params).then(res => {
        console.log(res, '列表数据')
        res.data.map(v => {
          if (v.jumpType === 2) {
            v.goodsId = v.jumpObject
            v.jumpObject = ''
          } else {
            v.goodsId = ''
          }
        })

        console.log(res.data, 'data')
        this.bannerList = res.data
        this.loading = false
      }).catch(() => {
        this.loaidng = false
      })
    },
    changeImage(item, res) {
      item.imgUrl = res
      // this.save()
    },
    addImage() {
      if (this.bannerList.length === 6) {
        return this.$message.error('不能再添加轮播图了')
      }

      this.$SelectMaterial({
        visible: true,
        types: [0],
        disabledFn: (row) => {
          return row.materialDes !== '686*296'
        },
        success: (res) => {
          console.log(res, 'res')
          this.bannerList.push({
            cityCode: 0, // 城市代码, 为空时全国可见
            createTime: '', // 创建时间
            enabled: 1, // 状态 1上架 0下架
            imgUrl: res.materialUrl, // 图片url
            jumpObject: '', // 跳转对象 jump_type为1时是跳转的url 为2时是对应id
            goodsId: '', // 跳转商品id
            jumpType: 1, // 跳转方式 1：html5 2：商品详情
            sort: 0, // 排序，数字越小排的越靠前
            type: this.row.type
          })
          // this.save()
        }
      })
    },
    delImage(item, index) {
      console.log(item)
      item.imgUrl = ''
      // this.save()
    },
    save() {
      console.log('点击保存')
      for (let i = 0; i < this.bannerList.length; i++) {
        const item = this.bannerList[i]
        const refName = `form_${i}`
        console.log(item.jumpType, item.jumpObject)
        if (item.jumpType === 1 && !item.jumpObject) {
          this.$refs[refName][0].validateField('jumpObject')
          return
        } else if (item.jumpType === 2 && !item.goodsId) {
          this.$refs[refName][0].validateField('goodsId')
          return
        }
        if (!item.imgUrl) {
          this.$refs[refName][0].validateField('imgUrl')
          return
        }
      }
      this.loading = true
      const data = JSON.parse(JSON.stringify(this.bannerList))
      data.map((v, i) => {
        v.sort = i
        if (v.jumpType === 2) {
          v.jumpObject = v.goodsId
        }
        delete v.goodsId
      })
      editBannerList({ type: this.row.type, list: data }).then(res => {
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
        // this.loading = false
        this.getList()
      }).catch(() => {
        this.loading = false
      })
    },
    mouseenter(i) {
      this.dexIndex = i
    },
    mouseleave() {
      this.dexIndex = -1
    },
    del(row, index) {
      console.log(row, index)
      this.bannerList.splice(index, 1)
      // this.save()
    },
    openSelectGoods(item, index) {
      console.log(item, 'item')
      this.$SelectGoods({
        visible: true,
        defaultValue: [item.goodsId],
        tabList: [
          { id: '0', name: '图文', api: '' },
          { id: '1', name: '音频', api: '' },
          { id: '2', name: '视频', api: '' },
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' },
          { id: '5', name: '线下课', api: '' }
        ],
        currentId: '0',
        success: (res) => {
          if (res.length > 0) {
            item.goodsId = res[0].goodsId
            this.$refs[`form_${index}`] && (this.$refs[`form_${index}`][0].clearValidate())
          }
        }
      })
    },
    selectImage(item, index) {
      this.$SelectMaterial({
        visible: true,
        types: [0],
        disabledFn: (row) => {
          return row.materialDes !== '686*296'
        },
        success: (res) => {
          item.imgUrl = res.materialUrl
          // this.save()
          const refName = `form_${index}`
          this.$refs[refName][0] && this.$refs[refName][0].validateField('imgUrl')
        }
      })
    },
    // 点击单选框
    radioChange(index) {
      console.log(index, 'index')
      const refName = `form_${index}`
      this.$refs[refName][0].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.bannerTable {
    width: 1000px;
    margin-left: 20px;
    flex: 1;
    ::v-deep {
        .el-card__body {
          height: calc( 100% - 18px - 35px);
            // overflow: auto;
        }
        .el-form-item {
          margin-bottom: 0px;
        }
        .cell {
          height: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
            .title {
                text-align: left;
                color: #A3A0A0;
                font-weight: 400;
            }
            .drag-content {
              flex: 1 0 0;
              width: 100%;
              padding: 8px;
              background: rgba(237, 237, 237, 0.53);
              overflow: auto;
              margin-bottom: 60px;
              .drag_item {
                  cursor: move;
                  width: 100%;
                  position: relative;
                  margin-bottom: 10px;
                  display: -webkit-flex;
                  display: flex;
                  -webkit-align-items: center;
                  align-items: center;
                  border-radius: 2px;
                  border: 1px solid #eeeeee;
                  background: #fff;
                  padding: 10px 6px;
                  font-size: 12px;

                  .drag_ul {
                      width: 100%;
                      display: flex;
                      position: relative;
                      .imageBox {
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          background: #A3A0A0;
                          cursor: pointer;
                      }
                      .banner_info {
                          flex: 1;
                          margin-left: 10px;
                          // margin-bottom: 20px;
                          .info_form {
                              display: flex;
                              margin-bottom: 20px;
                              .info_form_label {
                                  width: 80px;
                                  display: flex;
                                  align-items: center;
                              }
                          }
                      }
                      .info_del {
                          position: absolute;
                          top: 0px;
                          right: 0px;
                          color: #999;
                          font-size: 16px;
                          cursor: pointer;
                      }
                  }
              }
            }
            .footerBtn {
              position: absolute;
              bottom: 0;
              width: 100%;
              display: flex;
              background: #fff;
              padding: 10px 0 0;
              .btn-save {
                // width: 50%;
                flex: 1 0 0;
                height: 50px;
                text-align: center;
                color: #1472ff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                cursor: pointer;
                background: #409EFF;
                color: #fff;
                border-radius: 4px;
                margin-left: 10px;
              }
              .add-btn-input {
                margin-right: 10px;
                // width: 50%;
                flex: 1 0 0;
                // flex: 1 0 0;
                height: 50px;
                text-align: center;
                color: #1472ff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                border: 1px solid #409EFF;
                border-radius: 4px;
                cursor: pointer
              }
            }
        }
    }
}
</style>
