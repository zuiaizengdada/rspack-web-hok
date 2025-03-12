<template>
  <div class="filterTop">
    <div class="select-search">
      <div class="select-search-top">
        <el-input
          v-model.trim="search.name"
          class="select-search-key"
          :class="{ myBgF: search.name }"
          placeholder="搜索用户昵称或手机号"
          @keyup.enter.native="onChange"
        />
        <el-button
          class="select-search-key-btn"
          type="text"
          icon="el-icon-search"
          @click="onChange"
        />
      </div>
      <div v-if="showMoreSeach" class="select-box">
        <el-select
          v-model="search.inviterUser"
          clearable
          placeholder="请选择"
          class="m-l-10 select-box-select"
          filterable
          :loading="loading"
          @change="onChange"
        >
          <el-option label="全部" value="" />
          <el-option label="无归属邀请人" :value="0" />
          <el-option
            v-for="item in inviterUserOption"
            :key="item.teacherId"
            :label="item.teacherName"
            :value="item.teacherId"
          />
        </el-select>
        <el-select
          v-model="search.action"
          clearable
          placeholder="请选择"
          class="m-l-10 select-box-select"
          @change="onChange"
        >
          <!-- <el-option label="全部行为" value="" /> -->
          <el-option
            v-for="item in actionOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-checkbox
          v-if="search.inviterUser === ''"
          v-model="search.invitedStudentsCheck"
          class="m-l-10"
          @change="onChange"
        >
          仅查看邀约学员
        </el-checkbox>
      </div>
    </div>
    <grounpList
      v-if="showMoreSeach"
      :item="
        AVliveRoomConversationList.length > 0
          ? AVliveRoomConversationList[0]
          : null
      "
      @onClick="
        liveRoomClick(
          AVliveRoomConversationList.length > 0
            ? AVliveRoomConversationList[0]
            : null
        )
      "
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import grounpList from './groupList.vue'
import { querytutor } from '@/api/liveRoom/liveRoom.js'
export default {
  components: {
    grounpList
  },
  props: {
    showMoreSeach: {
      type: Boolean,
      default: true
    },
    search: {
      type: Object,
      default: () => {
        return {
          name: '', // 用户昵称/备注名
          inviterUser: '',
          action: '',
          invitedStudentsCheck: true
        }
      }
    },
    inviterUserOption: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      liveRoomId: this.$route.params.id,
      actionOption: [
        { label: '全部行为', value: '' },
        { label: '发言', value: 1 },
        { label: '领劵', value: 2 },
        { label: '查看商品', value: 3 },
        { label: '待付款', value: 4 }
      ]
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState({
      AVliveRoomConversationList: state => state.im.AVliveRoomConversationList
    }),
    traineesList() {
      // 普通学员离线
      return this.leftList.myTrainees.concat(this.leftList.generalTrainees)
    }
  },
  mounted() {
    // this.showMoreSeach && this.remoteMethod()
  },
  methods: {
    liveRoomClick(res) {
      this.$emit('onGrounpClick', res)
    },
    // remoteMethod() {
    //   console.log('1111')
    //   this.loading = true
    //   const data = {
    //     liveRoomId: this.liveRoomId,
    //     pageIndex: 1,
    //     pageSize: 1000
    //   }
    //   querytutor(data).then((res) => {
    //     this.inviterUserOption = res.data.items
    //     if (this.inviterUserOption.length > 0) {
    //       console.log(this.userInfo, 'userInfo', this.inviterUserOption)
    //       const obj = this.inviterUserOption.find(v => v.teacherId === this.userInfo.userId)
    //       if (obj) {
    //         this.search.inviterUser = obj.teacherId
    //         this.onChange()
    //       }
    //     }
    //     this.loading = false
    //   }).catch(() => {
    //     this.loading = false
    //   })
    // },
    onChange() {
      console.log('触发1111', this.search)
      // 非全部 不传递仅查看邀约人员
      this.$emit('change', {
        ...this.search,
        invitedStudentsCheck: this.inviterUser === ''
          ? false
          : this.search.invitedStudentsCheck
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTop {
  padding: 10px 0;
  // box-shadow: 0 0 10px 0 #0000001a;
  .select-search {
    .select-search-top {
      position: relative;
      .select-search-key {
        height: 44px;
        padding: 0 10px;
      }
      .select-search-key-btn {
        background: transparent;
        position: absolute;
        right: 22px;
        font-size: 16px;
        height: 44px;
        color: #787c7b;
      }
    }
  }
  .select-box {
    margin-top: 10px;
  }
  .select-box-select {
    width: 140px;
  }
}
@media screen and (max-width: 1855px) {
  .select-box-select {
    width: calc(50% - 15px) !important;
  }
}
::v-deep {
  .select-search-key {
    .el-input__inner {
      height: 44px;
      line-height: 44px;
      background: #f7f7f7;
      padding-right: 46px;
    }
  }
  .select-box-select {
    .el-input--medium .el-input__icon {
      line-height: 30px;
    }
    .el-input--medium .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
    .el-input__inner {
      color: #000;
    }
  }
  .el-checkbox__label {
    color: #000;
    font-weight: 450;
  }
  .myBgF {
    .el-input__inner {
      height: 44px;
      line-height: 44px;
      background: #fff;
      padding-right: 46px;
      color: #000;
    }
  }
}
</style>
