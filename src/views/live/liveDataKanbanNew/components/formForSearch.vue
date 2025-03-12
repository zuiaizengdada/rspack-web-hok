<template>
  <div class="allHeader-search">
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
    >
      <template #deptId>
        <el-cascader
          v-if="isTopCascader"
          ref="cascader1"
          v-model="deptIdModealArray"
          :options="deptList"
          :props="cascaderProps"
          :show-all-levels="false"
          @change="update"
        />
      </template>
      <template #teacherId>
        <AppUserSelect @change="changeUser" />
      </template>
      <template #liveModel>
        <el-radio-group v-model="formOpts.formData.liveModel" style="width: 500px;" @change="liveModalChange">
          <el-radio v-for="(item,index) in formOpts.optionsObj.liveModel" :key="index" class="radio-cls" :class="index === 0 ? 'radio-cls-one':''" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </template>
    </HokSearchForm>
  </div>
</template>

<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { deepClone } from '@/utils/FormGenerator/index'
import { feesOpts } from './columns.js'
import { queryByAccountOrNames } from '@/api/guzi/order.js'
import AppUserSelect from '@/components/AppUserSelect'
// import { getDept } from '@/api/business'
import {
  deptTree
} from '@/api/addressBookApi'
import {
  getDeptId
} from '@/api/liveRoom/kanban.js'
export default {
  components: {
    HokSearchForm,
    AppUserSelect
  },
  props: {
  },
  data() {
    return {
      isTopCascader: false,
      deptIdModealArray: '',
      deptList: [],
      cascaderProps: {
        checkStrictly: true,
        emitPath: false,
        value: 'id'
      },
      formOpts: {},
      formForSearch: {
        departMentId: '',
        userId: '',
        liveType: ''
      }
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {
    this.initPage()
  },
  methods: {
    liveModalChange() {
      console.log(this.formOpts.formData)
      this.$emit('searchForChange', this.formOpts.formData)
    },
    loadDeptList() {
      deptTree({}).then(res => {
        if (res.code === 1) {
          if (res && res.data && res.data.length > 0) {
            const arr = res.data.reduce((pre, next) => {
              pre.push({ label: next.label, id: next.id, children: next.children })
              return pre
            }, [])
            this.deptList = arr
          }
          /* this.deptList = this.deptList?.length
            ? this.deptList?.map(item => {
              return {
                ...item,
                children: item.children?.map(childrenItem => ({
                  ...childrenItem,
                  children: null
                }))
              }
            })
            : [] */
        }
        console.log('ddddddd:', this.deptList)
      })
    },
    handleSelect(item) {
      this.formOpts.formData.shareUserId = item.id
    },
    async querySearchAsync(queryString, cb) {
      var results = []
      if (queryString === '') {
        cb(results)
      } else {
        const params = {
          pageIndex: 1,
          pageSize: 2000,
          name: this.formOpts.formData.shareUserName
        }
        const findResultse = await queryByAccountOrNames(params)
        if (findResultse.code === 1) {
          var result = findResultse.data.items
          // 循环放到一个远程搜索需要的数组
          result.map(v => {
            results.push({
              value: v.name,
              id: v.platformUserId
            })
          })
          cb(results)
        } else {
          results = []
          cb(results)
        }
      }
    },
    update() {
      console.log(this.deptIdModealArray)
      this.formOpts.formData.deptId = this.deptIdModealArray // [this.deptIdModealArray.length - 1]
      console.log(this.formOpts.formData.deptId)
      this.$emit('searchForChange', this.formOpts.formData)
    },
    changeUser(res, info) {
      this.formOpts.formData.teacherId = res
      this.$emit('searchForChange', this.formOpts.formData)
    },
    findPathToId(tree, targetId) {
      const path = []

      function traverse(node, currentPath) {
        // 如果找到了目标节点
        if (node.id === targetId) {
          path.push(...currentPath, node.id)
          return true
        }

        // 否则，继续搜索子节点
        if (node.children) {
          for (const child of node.children) {
            if (traverse(child, [...currentPath, node.id])) {
              return true
            }
          }
        }

        return false
      }

      // 从树的每个根节点开始搜索
      for (const root of tree) {
        if (traverse(root, [])) {
          break
        }
      }

      return path // 返回从根到目标节点的路径，包括目标节点
    },
    async initPage() {
      this.loadDeptList()
      this.formOpts = {
        ...deepClone(feesOpts.form),
        operatorList: [
        ]
      }
      getDeptId().then(res => {
        if (res.code === 1) {
          this.$nextTick(() => {
            this.isTopCascader = false
            // this.deptIdModealArray.push(res.data)
            this.deptIdModealArray = res.data// this.findPathToId(this.deptList, res.data)
            this.formOpts.formData.deptId = res.data// this.deptIdModealArray[this.deptIdModealArray.length - 1]
            console.log('dddessss:恶化基坑围护艰苦奋斗书法网科技：：', this.deptIdModealArray)
            this.$forceUpdate()
            setTimeout(() => {
              this.isTopCascader = true
              this.$emit('searchForChange', this.formOpts.formData)
            }, 300)
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.allHeader-search {
    float: left;
    margin-top: 10px;
    height: 40px!important;
}
.radio-cls {
  float: left;
  width: 80px;
  margin-right: 15px;
  color: #000;
}
.radio-cls-one {
  width: 50px;
}

</style>
