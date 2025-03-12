<template>
  <div class="filterTop">
    <el-form ref="form" :model="search" label-width="auto" size="small" :inline="true">
      <el-form-item label="达人渠道">
        <el-select v-model="search.expertChannel" placeholder="请选择" class="w-200" clearable @change="onSearch" @clear="onSearch">
          <el-option label="全部" value="" />
          <el-option v-for="(item) in liveChannel" :key="item.code" :label="item.message" :value="item.code">
            <img class="channel-cls" :src="item.imageUrl" />
            {{ item.message }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="达人ID">
        <el-input v-model.trim="search.expertId" placeholder="请输入达人ID" class="w-200" clearable maxlength="30" @clear="onSearch" @input="delNumber" />
      </el-form-item>
      <el-form-item label="员工姓名">
        <AppUserSelect
          class="w-200"
          @change="changeUser"
        />
      </el-form-item>
      <el-form-item label="部门">
        <el-cascader
          ref="cascader1"
          v-model="deptIdArray"
          :options="getdeptList"
          :props="cascaderProps"
          :show-all-levels="false"
          :clearable="search.corpMangerFlag"
          @change="update($event)"
        />
        <!-- <searchSelect :value="search.departmentName" class="w-200" @onClick="changeDept" @onClear="onhanldeDeptClear" /> -->
      </el-form-item>
      <el-form-item label="是否绑定抖音OpenID">
        <el-select v-model="search.bindOpenIdFlag" placeholder="请选择" class="w-200" clearable @change="onSearch" @clear="onSearch">
          <el-option label="是" :value="true" />
          <el-option label="否" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="达人昵称">
        <el-select
          v-model="search.expertName"
          clearable
          filterable
          remote
          reserve-keyword
          placeholder="请输入需要查询的昵称"
          :remote-method="remoteMethod"
          class="user-select"
          :loading="loading"
          @change="onSearch"
          @clear="handleClear"
        >
          <el-option
            v-for="item in options"
            :key="item.expertId"
            :label="item.expertName"
            :value="item.expertName"
          >
            <div class="show-cls">
              <img :src="returnImgString(item.expertChannel)" />
              <span>{{ item.expertName }}</span>
            </div>
          </el-option>
        </el-select>
        <!-- <el-input v-model="search.expertName" placeholder="请输入达人昵称" /> -->
      </el-form-item>
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-button type="primary" size="small" @click="onSearch">查询</el-button>
          <el-button size="small" @click="onClear">重置</el-button>
        </el-col>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="onhandleAdd">新增达人 </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import AppUserSelect from '@/components/AppUserSelect'
import { searchExpertChannelEnums, listExpertManByName } from '@/api/order/performanceShare'
import { mapGetters } from 'vuex'
export default {
  components: {
    AppUserSelect
  },
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          expertChannel: '', // 达人渠道
          expertId: '', // 平台达人ID
          expertName: '',
          operateUid: '', // 运营人员ID
          operateName: '', // 运营人员姓名
          departmentId: '', // 部门id
          departmentName: '', // 部门名称
          bindOpenIdFlag: '',
          corpMangerFlag: true
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      cascaderProps: {
        checkStrictly: true,
        value: 'id'
      },
      liveChannel: [],
      deptIdArray: [],
      options: []
    }
  },
  computed: {
    ...mapGetters(['thirdShopDataType', 'deptList', 'orderType_options']),
    getdeptList() {
      return this.deptList?.length
        ? this.deptList?.map(item => {
          return {
            ...item,
            children: item.children?.map(childrenItem => ({
              ...childrenItem,
              children: null
            }))
          }
        })
        : []
    }
  },
  created() {
    this.$store.dispatch('option/getDeptList', { deptId: 0 })
  },
  mounted() {
    this.searchExpertChannelEnumsd()
  },
  methods: {
    returnImgString(str) {
      let returnString = ''
      this.liveChannel.some(item => {
        if (item.code === str) {
          returnString = item.imageUrl
        }
      })
      return returnString
    },
    handleClear() {
      this.search.expertName = ''
    },
    async remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        try {
          const { data } = await listExpertManByName(query)
          console.log('未IE我IE我IE我IE我', data)
          this.loading = false
          this.options = data ?? []
        } catch (e) {
          this.loading = false
        }
      } else {
        this.options = []
      }
    },
    searchExpertChannelEnumsd() {
      searchExpertChannelEnums().then(res => {
        console.log('dsfew时代峰峻何凯文及两端撒：', res)
        this.liveChannel = res.data
      })
    },
    update(e) {
      this.search.departmentId = this.deptIdArray
        ? this.deptIdArray[this.deptIdArray.length - 1]
        : undefined
      this.$emit('onSearch')
    },
    // 限制只能输入英文和数字
    delNumber(e) {
      this.search.expertId = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    // 点击查询按钮
    onSearch() {
      console.log(this.search)
      this.$emit('onSearch')
    },
    // 点击重置按钮
    onClear() {
      this.$emit('onClear')
    },
    // 点击新增规则按钮
    onhandleAdd() {
      this.$emit('onAdd')
    },
    // 点击部门
    changeDept() {
      const checkDept = []
      if (this.search.departmentName) {
        checkDept.push({ name: this.search.departmentName, deptId: this.search.departmentId })
      }
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [0],
        checkDept,
        success: (res) => {
          if (res.dept.length > 0) {
            this.search.departmentName = res.dept[0].name
            this.search.departmentId = res.dept[0].deptId
            this.$emit('onSearch')
          }
        }
      })
    },
    // 点击清空部门
    onhanldeDeptClear() {
      this.search.departmentName = ''
      this.search.departmentId = ''
      this.$emit('onSearch')
    },
    // 点击员工
    changeUser(userId) {
      this.search.operateUid = userId
      this.$emit('onSearch')
    },
    // 点击清空员工
    onhanldeUserClear() {
      this.search.operateName = ''
      this.search.operateUid = ''
      this.$emit('onSearch')
    },
    // 点击选择
    handleSelect(item) {
      console.log(item)
      this.$emit('onSearch')
    }
  }
}
</script>

<style lang='scss' scoped>
.filterTop {
  padding-bottom: 20px;
  border-bottom: 1px solid #E7E7E7;
  margin-bottom: 20px;
}
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
}

.channel-cls {
  width: 15px;
  height: 15px;
  border-radius: 100%;
  margin-right: 8px;
  margin-top: 9px;
  float: left;
}

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
</style>
