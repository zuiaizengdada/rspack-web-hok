<template>
  <div class="filterTop">
    <!-- 筛选栏 -->
    <el-form ref="form" :model="search" size="small" :inline="true">
      <el-form-item label="IP真实姓名" label-width="108px">
        <el-input
          v-model.trim="search.teacherRealName"
          clearable
          maxlength="20"
          @keyup.enter.native="handleSubmit"
          @clear="handleSubmit"
        />
      </el-form-item>
      <el-form-item label="跟进人所属机构" label-width="108px">
        <el-select
          v-model="search.tenantId"
          clearable
          @change="onTenantIdChange"
        >
          <el-option
            v-for="item in orgList"
            :key="item.organizationId"
            :label="item.name"
            :value="item.organizationId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="跟进人" label-width="52px">
        <m-select
          ref="mSelect"
          v-model="search.followerId"
          remote
          clearable
          filterable
          :request="getUserList"
          :param="{ value: 'sysUserId', label: 'userName' }"
          @change="handleSubmit"
        />
      </el-form-item>
      <el-form-item label="跟进状态" label-width="66x">
        <el-select
          v-model="search.cooperateStatus"
          clearable
          @change="handleSubmit"
        >
          <el-option
            v-for="item in COOPERATION_TYPE"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="handleSubmit">
          查询
        </el-button>
        <el-button size="small" @click="handleInit">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="navType">
      <div class="navTypeUl">
        <div
          class="navTypeLi"
          :class="{ active: search.poolType === 1 }"
          @click="onTypeChange(1)"
        >
          跟进池
        </div>
        <div
          class="navTypeLi"
          :class="{ active: search.poolType === 2 }"
          @click="onTypeChange(2)"
        >
          公海池
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDict } from '@/utils/index'
import { getItem } from '@/utils/localStorage'
import { querySysUser } from '@/api/tearchCenter/tearchSharing.js'
import { userNoPage } from '@/api/addressBookApi'
export default {
  components: {},
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          poolType: 1, // 池子类型 1-跟进池 2-共享池
          cooperateStatus: '', // 跟进状态
          followerId: '', // 跟进人Id
          followerName: '', // 跟进人姓名
          teacherRealName: '', // 老师真实姓名
          teacherPhoneNum: '', // 老师手机号
          queryDetail: false, // 是否查看跟进池已存在老师详情
          tenantId: '', // 跟进人所属机构id
          pageIndex: 1,
          pageSize: 10
        }
      }
    }
  },
  data() {
    return {
      COOPERATION_TYPE: [],
      orgList: [],
      userNoPage
    }
  },
  async created() {
    this.COOPERATION_TYPE = await getDict('COOPERATION_TYPE')
    this.orgList = await getDict('TEARCHER_ORGLIST')
  },
  mounted() {},
  methods: {
    handleSubmit() {
      const search = {
        ...this.search,
        pageIndex: 1
      }
      this.$emit('search', search)
    },
    onTypeChange(val) {
      const search = {
        ...this.search,
        pageIndex: 1,
        pageSize: 10,
        poolType: val
      }
      this.$emit('search', search)
    },
    handleInit() {
      const search = {
        ...this.search,
        cooperateStatus: '',
        followerId: '',
        followerName: '',
        teacherRealName: '',
        teacherPhoneNum: '',
        queryDetail: false,
        tenantId: '',
        pageIndex: 1,
        pageSize: 10
      }
      this.$emit('search', search)
    },
    onTenantIdChange() {
      const search = {
        ...this.search,
        followerId: '',
        pageIndex: 1,
        followerName: ''
      }
      this.$refs.mSelect.clearOption()
      this.$emit('search', search)
    },
    // 根据指定机构获取系统员工
    getUserList(val) {
      const orginfo = getItem('orgInfo')
      const data = {
        tenantId: this.search.tenantId
          ? this.search.tenantId
          : orginfo.organizationId,
        nickName: val.name
      }
      return querySysUser(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.navType {
  background: #f5f7fa;
  padding: 4px 4px 0 4px;
  .navTypeUl {
    display: flex;
    width: 100%;
    .navTypeLi {
      width: 104px;
      height: 40px;
      line-height: 36px;
      text-align: center;
      background: #f5f7fa;
      border-radius: 6px 6px 0px 0px;
      font-size: 15px;
      font-family: MicrosoftYaHei;
      color: #333333;
      cursor: pointer;
      border-top: 4px solid transparent;
    }
    .active {
      background: #ffffff;
      color: #0c6fff;
      border-top: 4px solid #0c6fff;
    }
  }
}
</style>
