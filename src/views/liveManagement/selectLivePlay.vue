<template>
  <!-- 选择主播 -->
  <div>
    <div class="selectLivePlay">
      <div class="content-left">
        <div class="p-l-16 p-r-16">
          <el-input v-model="search" size="small" placeholder="请输入微信昵称/手机号搜索" suffix-icon="el-icon-search" clearable @keyup.enter.native="searchFn" @clear="searchFn" />
        </div>
        <div class="textWrap">最近添加</div>
        <div v-infinite-scroll="load" class="teacherListWrap" infinite-scroll-disabled="disabled">
          <div v-for="(item, index) in list" :key="index" class="teacherList">
            <template v-if="disabledId.includes(item.id)">
              <span class="checkBox is_disabled">
                <svg-icon v-if="selectUser.findIndex(v => v.id === item.id) > -1" icon-class="gou" />
              </span>
            </template>
            <template v-else>
              <span class="checkBox" @click="onCheckBoxChange(item, index)">
                <svg-icon v-if="selectUser.findIndex(v => v.id === item.id) > -1" icon-class="gou" />
              </span>
            </template>
            <AppAvatar class="m-l-10" :avatar="item.headImg" width="36" :name="item.name" :no-name="true" />
            <span class="m-l-10 userName">{{ item.name }}</span>
          </div>
          <div v-if="loading" class="listLoading"><i class="el-icon-loading" />加载中...</div>
        </div>
      </div>
      <div class="content-right">
        <div v-if="selectUser.length === 0" class="hadSelectedCount">选择需要添加的人</div>
        <div v-else>已选({{ selectUser.length }})</div>
        <div class="teacherList_content">
          <div v-for="(item, index) in selectUser" :key="index" class="teacherList">
            <span class="userName">{{ item.name }}</span>
            <span v-if="!disabledId.includes(item.id)"><i class="el-icon-circle-close cursorPoninter" /></span>
          </div>
        </div>
      </div>
    </div>
    <div class="dialogfooter">
      <div>
        <span>新增IP：</span>
        <el-popover
          v-model="phoneAddMode.visible"
          placement="top"
          width="260"
          @show="phoneAddMode.value =''"
        >
          <div><el-input v-model="phoneAddMode.value" placeholder="请输入用户手机号" maxlength="11" /></div>
          <div style="text-align: right;" class="m-t-10">
            <el-button size="mini" type="text" @click="phoneAddMode.visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="addAnchorByPhone()">确定</el-button>
          </div>
          <span slot="reference" class="a_link m-r-20">手机号添加</span>
        </el-popover>
        <span class="a_link">微信邀请</span>
      </div>
      <div>
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" @click="sure()">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAnchorList, addAnchorListByPhone } from '@/api/live/live'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
export default {
  components: {
    AppAvatar
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    defulat: {
      type: Array,
      default: () => []
    },
    type: {
      type: [String, Number],
      default: 1
    },
    disabledId: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      noMore: false,
      search: '',
      selectUser: [],
      list: [],
      current: 1,
      size: 10,
      total: 0,
      // 手机号添加弹框
      phoneAddMode: {
        visible: false,
        value: ''
      }
    }
  },
  computed: {
    disabled () {
      return this.loading || this.noMore
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.selectUser = JSON.parse(JSON.stringify(this.defulat))
          this.searchFn()
        }
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    sure() {
      const selectUser = JSON.parse(JSON.stringify(this.selectUser))
      this.$emit('success', selectUser)
    },
    // 选中/取消选中
    onCheckBoxChange(item) {
      console.log(item, this.selectUser)
      const index = this.selectUser.findIndex(v => v.id === item.id)
      if (index > -1) {
        this.selectUser.splice(index, 1)
      } else {
        this.selectUser.push(item)
      }
      // if (this.selectUser.includes(item.id)) {
      //   this.selectUser.splice(index, 1)
      // } else {
      //   this.selectUser.push(item)
      // }
    },
    // 获取主播-助教列表
    load() {
      this.loading = true
      const params = {
        current: this.current,
        size: this.size,
        fuzzy: this.search
      }
      getAnchorList(params).then(res => {
        if (this.current === 1) {
          this.list = res.data.records
          console.log(res.data.records, 'res.data.records')
        } else {
          // this.list.push(...res.data.records)
          this.list = this.list.concat(res.data.records)
        }
        this.current = this.current + 1
        this.noMore = this.list.length === Number(res.data.total)
        this.noMore = true
        this.loading = false
      })
    },
    // 通过手机号添加IP-助教
    addAnchorByPhone() {
      const data = {
        phone: this.phoneAddMode.value
      }
      addAnchorListByPhone(data).then(res => {
        console.log(res, 'res')
        if (res.data.id) {
          this.selectUser.push(res.data)
          this.searchFn()
        }
        this.phoneAddMode.visible = false
      })
    },
    // 删除选中的数据
    del(item, index) {
      this.selectUser.splice(index, 1)
    },
    searchFn() {
      this.current = 1
      this.list = []
      this.load()
    }
  }
}
</script>

<style lang='scss' scoped>
.selectLivePlay {
  width: 100%;
  padding: 16px;
  display: flex;
  .content-left {
    width: 50%;
    height: 386px;
    padding-top: 16px;
    border: 1px solid #eee;
    position: relative;
    padding: 16px 0;
    box-sizing: border-box;
    .textWrap {
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 400;
      color: #999;
      line-height: 20px;
    }
    .teacherListWrap {
      height: 300px;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 4px;
        height: 10px;
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background-color: rgba(0,0,0,.2);
        transition: all .4s ease;
      }
      &::-webkit-scrollbar-track {
        background-color: rgba(0,0,0,.1);
      }
      .teacherList {
        display: flex;
        align-items: center;
        padding: 10px 0;
        margin: 0 16px;
        &:hover {
          background: #f5f5f5;
          transition: all .3s ease-in-out 0s;
        }
        .checkBox {
          width: 14px;
          height: 14px;
          background-color: transparent;
          border: 1px solid #dbdbdb;
        }
        .is_disabled {
          background-color: #edf2fc;
          border-color: #dcdfe6;
          cursor: not-allowed;
        }
      }
      .userName {
        width: 230px;
        overflow: hidden;
        text-overflow: ellipsis;  /* 超出部分省略号 */
        word-break: break-all;  /* break-all(允许在单词内换行。) */
        display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 2; /** 显示的行数 **/
      }
    }
  }
  .content-right {
    width: 50%;
    height: 386px;
    padding-top: 16px;
    border: 1px solid #eee;
    position: relative;
    padding: 16px;
    box-sizing: border-box;
    overflow: auto;
    .hadSelectedCount {
      margin-bottom: 16px;
      color: #333;
      line-height: 22px;
      text-align: left;
    }
    .teacherList {
      height: 40px;
      background: #fff;
      padding-right: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
    }
    .teacherList_content {
      margin-top: 20px;
      height: 310px;
      padding-right: 0;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 4px;
        height: 10px;
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background-color: rgba(0,0,0,.2);
        transition: all .4s ease;
      }
      &::-webkit-scrollbar-track {
        background-color: rgba(0,0,0,.1);
      }
      .userName {
        width: 230px;
        overflow: hidden;
        text-overflow: ellipsis;  /* 超出部分省略号 */
        word-break: break-all;  /* break-all(允许在单词内换行。) */
        display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 1; /** 显示的行数 **/
      }
    }
  }
}
.p-l-16 {
  padding-left: 16px;
  box-sizing: border-box;
}
.p-r-16 {
  padding-right: 16px;
}
.dialogfooter {
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.listLoading {
  text-align: center;
  color: #999;
  // display: flex;
}
</style>
