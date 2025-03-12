<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="800px"
    top="3%"
    :close-on-click-modal="false"
  >
    <div v-loading="loading" class="address">
      <div class="address_book">
        <div class="address_book_left">
          <div class="address_book_left_search">
            <template v-if="type.includes(0) && type.length === 1">
              <el-input
                v-model="search"
                clearable
                placeholder="请输入部门名称"
                class="input-with-select"
                size="small"
                @keyup.enter.native="handleSearch"
                @clear="handleSearch"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="handleSearch"
                />
              </el-input>
            </template>

            <template v-else>
              <el-input
                v-model="search"
                clearable
                placeholder="请输入"
                class="input-with-select"
                size="small"
                @keyup.enter.native="handleSearch"
                @clear="handleSearch"
              >
                <el-select
                  slot="prepend"
                  v-model="select"
                  class="w-100"
                  placeholder="请选择"
                >
                  <el-option label="用户姓名" value="nickName" />
                  <el-option label="手机号码" value="phone" />
                  <!-- <el-option label="英文名称" value="userName" /> -->
                </el-select>
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="handleSearch"
                />
              </el-input>
            </template>
          </div>

          <!-- 导航面包屑 -->
          <div class="crumbs">
            <span
              v-for="(item, index) in crumbs"
              :key="`crumbs_${item.deptId}`"
              class="crumbsView"
            >
              <span
                :class="index === crumbs.length - 1 ? 'colorBlue' : ''"
                @click="changeCrumbs(item, index)"
              >{{ item.name }}
              </span>
              <span v-if="index !== crumbs.length - 1" class="m-r-5">/</span>
            </span>
          </div>

          <!-- 部门列表 -->
          <div
            v-infinite-scroll="load"
            class="addressBooks"
            style="overflow: auto"
            infinite-scroll-disabled="disabled"
          >
            <div
              v-for="item in depts"
              :key="`dept_${item.deptId}`"
              class="addressBooksBox"
              @click="changeDept(item)"
            >
              <template
                v-if="disabledDept.includes(item.deptId) || item.status === 1"
              >
                <span
                  v-if="type.includes(0)"
                  :class="multiple ? 'checkBox' : 'checkBoxRadio'"
                  class="disabled"
                >
                  <svg-icon
                    v-if="checkDeptIds.includes(item.deptId)"
                    icon-class="gou"
                  />
                </span>
              </template>
              <template v-else>
                <span
                  v-if="type.includes(0)"
                  :class="multiple ? 'checkBox' : 'checkBoxRadio'"
                >
                  <svg-icon
                    v-if="checkDeptIds.includes(item.deptId)"
                    icon-class="gou"
                  />
                </span>
              </template>
              <span class="checkName">{{ item.name }}</span>
              <span class="next" @click.stop="goToNext(item)">下级</span>
            </div>

            <div class="userAddressBooks">
              <div
                v-for="(item, index) in users"
                :key="`user_${item.userId}_${index}`"
              >
                <div class="addressBooksBox">
                  <template v-if="disabledUser.includes(item.userId)">
                    <span
                      v-if="type.includes(1)"
                      :class="multiple ? 'checkBox' : 'checkBoxRadio'"
                      class="disabled"
                    >
                      <svg-icon
                        v-if="checkUserIds.includes(item.userId)"
                        icon-class="gou"
                      />
                    </span>
                  </template>
                  <template v-else>
                    <span
                      v-if="type.includes(1)"
                      :class="multiple ? 'checkBox' : 'checkBoxRadio'"
                      @click="changeUser(item)"
                    >
                      <svg-icon
                        v-if="checkUserIds.includes(item.userId)"
                        icon-class="gou"
                      />
                    </span>
                  </template>
                  <div class="checkName" @click="changeUser(item)">
                    <AppAvatar
                      :avatar="item.avatar"
                      :name="item.nickName"
                      :width="34"
                      class="m-r-5"
                      :no-name="true"
                    />
                    <div class="userInfo">
                      <div class="checkName">
                        <span class="userName">{{
                          item.nickName || item.name
                        }}</span>
                        <el-tag
                          v-if="item.status === 1"
                          class="m-l-10"
                          type="danger"
                          size="mini"
                        >离职</el-tag>
                      </div>
                      <div class="userInfoDetail">
                        <div class="userInfoDetailForm flex">
                          <span class="userInfoDetailFormLabel">手机号：</span>
                          <span class="userInfoDetailFormValue">
                            <tablePhoneItem
                              v-model="item.phoneNumber"
                              :row-data="{ uid: item.userId }"
                              type="system"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <el-popover placement="right" width="300" trigger="hover">
                    <div class="userDetailCard">
                      <div class="userDetailCard_header">
                        <AppAvatar
                          :avatar="item.avatar"
                          :name="item.nickName"
                          :width="34"
                          class="m-r-5"
                          :no-name="true"
                        />
                        <div class="m-l-10">
                          <div>{{ item.nickName || item.name }}</div>
                          <div>
                            <span>uid:{{ item.userId }}</span>
                            <el-tag
                              v-if="item.status === 1"
                              type="danger"
                              class="m-l-10"
                              size="mini"
                            >离职</el-tag>
                            <el-tag
                              v-else
                              class="m-l-10"
                              size="mini"
                            >在职</el-tag>
                          </div>
                        </div>
                      </div>
                      <div class="userDetailCardForm">
                        <span class="userDetailCardLabel">所属部门:</span>
                        <span class="userDetailCardValue">{{
                          item.deptName
                        }}</span>
                      </div>
                      <!-- <div class="userDetailCardForm">
                          <span class="userDetailCardLabel">登录账号:</span>
                          <span class="userDetailCardValue">{{ item.userName }}</span>
                        </div> -->
                      <div class="userDetailCardForm">
                        <span class="userDetailCardLabel">手机号码:</span>
                        <span class="userDetailCardValue">{{
                          item.phoneNumber
                        }}</span>
                      </div>
                      <div class="userDetailCardForm">
                        <span class="userDetailCardLabel">角色:</span>
                        <span class="userDetailCardValue">
                          <el-tag
                            v-for="(tag, i) in item.roleVoList"
                            :key="i"
                            size="mini"
                          >{{ tag.roleName }}</el-tag>
                        </span>
                      </div>
                    </div>
                    <span slot="reference" class="next">详情</span>
                  </el-popover>
                </div>
              </div>
            </div>

            <div v-if="depts.length === 0 && users.length === 0" class="noData">
              暂无数据
            </div>
            <!-- <p v-if="loading">加载中...</p> -->
            <!-- <p v-if="noMore">没有更多了</p> -->
          </div>
        </div>
        <div class="address_book_right">
          <!-- 人员列表 -->
          <template v-if="type.includes(1)">
            <div
              v-for="(item, index) in checkUser"
              :key="`${item.id}_${index}`"
              class="checkList"
            >
              <span>{{ item.nickName || item.name }}</span>
              <i class="el-icon-close" @click="delUserCheck(item, index)" />
            </div>
          </template>

          <!-- 部门列表 -->
          <template v-if="type.includes(0)">
            <div
              v-for="(item, index) in checkDept"
              :key="`${item.id}_${index}`"
              class="checkList"
            >
              <span>{{ item.name }}</span>
              <i class="el-icon-close" @click="delDeptCheck(item, index)" />
            </div>
          </template>
        </div>
      </div>
      <div class="address_footer">
        <div>
          <template v-if="ifCanCheck()">
            <template v-if="users.length > 0">
              <el-checkbox
                :value="checked"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
              >全选</el-checkbox>
              <span>(已选{{ checkUserIds.length }}项)</span>
            </template>
          </template>
          <template v-if="isShowSelect">
            <div class="inherit_select">
              <div>企业微信</div>
              <m-select
                v-model="qwInheritType"
                dict-key="INHERIT_STATUS"
                style="width: 200px"
                size="mini"
              />
            </div>
          </template>
        </div>
        <div class="footer_btn">
          <el-button
            type="primary"
            size="small"
            @click="sure()"
          >确 定</el-button>
          <el-button size="small" @click="cancel()">取 消</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  deptTree,
  // userPage,
  userNoPage
} from '@/api/addressBookApi'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
export default {
  name: 'AddressBook',
  components: {
    AppAvatar,
    tablePhoneItem
  },
  props: {
    title: {
      type: String,
      default: '选择'
    },
    defultCheck: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    },
    success: {
      type: Function,
      default: () => {}
    },
    isShowSelect: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
    },
    // 0: 选部门; 1: 选人
    type: {
      type: Array,
      default: () => [0, 1]
    },
    params: {
      type: Object,
      default: () => {}
    },
    // 禁选部门
    disabledDept: {
      type: Array,
      default: () => []
    },
    // 禁选人员
    disabledUser: {
      type: Array,
      default: () => []
    },
    // 最多选择
    maxlength: {
      type: Number,
      default: 0
    },
    // 最少选择
    minlength: {
      type: Number,
      default: 0
    },
    // 默认选择的用户
    defaultCheckUser: {
      type: Array,
      default: () => []
    },
    // 默认选择的部门
    defaultCheckDept: {
      type: Array,
      default: () => []
    },
    // 是否查询离职员工
    ifAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      qwInheritType: 1,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      search: '',
      select: 'nickName',
      props: {
        label: 'corpName',
        children: 'children',
        isLeaf: 'leaf'
      },
      // defultCheck: [], // 默认选中的数据
      checkDeptIds: [], // 选中的部门数据id
      checkDept: [], // 选中的部门数据
      checkUserIds: [], // 选中的人员数据id
      checkUser: [], // 选中的人员数据
      depts: [], // 展示的部门数据
      users: [], // 展示的人员数据
      crumbs: [{ id: '-1', name: '通讯录' }], // 面包屑数组
      parentId: '0',
      loading: false,
      tenantId: '',
      noMore: false,
      checked: false, // 全选的按钮状态
      isIndeterminate: false, // 全选的另一个选中但未全选的状态
      isSearch: false
    }
  },
  computed: {
    disabled() {
      return this.loading || this.noMore
    }
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        this.init()
      }
    },
    checkUserIds: {
      handler(val) {
        if (val.length > 0) {
          let length = 0
          this.users.forEach(e => {
            val.includes(e.userId) && length++
          })
          this.checked = length === this.users.length
          this.isIndeterminate = !(length === this.users.length)
        } else {
          this.isIndeterminate = false
          this.checked = false
        }
      },
      deep: true,
      immediate: true
    },
    users: {
      handler(val) {
        if (this.checkUserIds.length > 0) {
          let length = 0
          val.forEach(e => {
            this.checkUserIds.includes(e.userId) && length++
          })
          this.checked = length === val.length
          this.isIndeterminate = !(length === val.length)
        } else {
          this.isIndeterminate = false
          this.checked = false
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.init()
  },
  methods: {
    handleSearch() {
      if (this.search === '') {
        // this.init()
        this.crumbs = [{ id: '0', name: '通讯录' }]
        this.search = ''
        this.currentPage = 1
        // this.parentId = '0'
        this.tenantId = ''
        this.users = []
        this.dept = []
        this.getOrgTree()
      } else {
        this.currentPage = 1
        // this.parentId = ''
        this.tenantId = ''
        this.isSearch = true
        this.crumbs = [{ id: '-1', name: '通讯录' }]
        this.getOrgTree()
      }
    },
    init() {
      this.crumbs = [{ id: '0', name: '通讯录' }]
      this.search = ''
      this.currentPage = 1
      // this.parentId = '0'
      this.tenantId = ''
      this.select = 'nickName'
      this.checkDept = JSON.parse(JSON.stringify(this.defaultCheckDept)) // 选中的部门数据
      this.checkUser = JSON.parse(JSON.stringify(this.defaultCheckUser)) // 选中的人员数据
      this.checkDeptIds = [] // 选中的部门数据id
      this.checkDept.map(v => {
        this.checkDeptIds.push(v.deptId)
      })
      this.checkUserIds = [] // 选中的人员数据id
      this.checkUser.map(v => {
        this.checkUserIds.push(v.userId)
      })
      this.users = []
      this.dept = []
      this.getOrgTree()
    },
    async getOrgTree() {
      this.loading = true
      let deptName = ''
      if (this.type.includes(0) && this.type.length === 1) {
        deptName = this.search
      }
      const deptTreeParams = {
        parentId: '',
        deptName
      }
      if (!this.isSearch) {
        deptTreeParams.parentId = this.parentId
      }
      const userPageParams = {
        deptId: this.parentId,
        // current: this.currentPage,
        // size: this.pageSize,
        [this.select]: this.search
      }
      try {
        if (
          (this.type.includes(0) && this.type.length === 1) ||
          this.search === ''
        ) {
          const res1 = await deptTree(deptTreeParams)
          if (res1.data) {
            // eslint-disable-next-line no-return-assign
            res1.data.map(v => {
              v.deptId = v.id
              v.name = v.label
            })
            this.depts = res1.data
          }
        } else {
          this.depts = []
        }

        if (this.type.includes(1)) {
          const res2 = await userNoPage(userPageParams)
          if (this.parentId !== '0') {
            if (res2.data) {
              const ifAll = this.ifAll
              this.users = res2.data.reduce((pre, next) => {
                if (ifAll) {
                  pre.push({ ...next, name: next.userName })
                } else {
                  next.status !== 1 &&
                    pre.push({ ...next, name: next.userName })
                }
                return pre
              }, [])
              // const users = { users: res2.data.records, totalSize: res2.data.total }
              // this.total = users.totalSize
              // if (this.currentPage === 1) {
              //   // eslint-disable-next-line no-return-assign
              //   this.users = users.users
              // } else {
              //   console.log(users.users, 'res.data.users.users')
              //   this.users = this.users.concat(...users.users)
              // }
              this.noMore = true
              // if (users.users.length < this.pageSize) {
              //   this.noMore = true
              // } else {
              //   this.noMore = false
              // }
            }
          }
        }
        this.loading = false
      } catch (err) {
        this.noMore = true
        this.loading = false
        this.depts = []
        this.users = []
        this.total = 0
      }
      // deptTree(params).then(res => {
      //   const {
      //     depts,
      //     users = { users: [], totalSize: 0 }
      //   } = res.data

      //   console.log(depts, users, '12313')
      //   this.loading = false
      //   // eslint-disable-next-line no-return-assign
      //   users.users.map(v => v.id = v.userId)
      //   this.total = users.totalSize
      //   if (this.currentPage === 1) {
      //     // eslint-disable-next-line no-return-assign
      //     depts.map(v => v.id = v.deptId)
      //     this.depts = depts
      //     this.users = users.users
      //   } else {
      //     console.log(users.users, 'res.data.users.users')
      //     this.users = this.users.concat(...users.users)
      //   }

      //   if (users.users.length < this.pageSize) {
      //     this.noMore = true
      //   } else {
      //     this.noMore = false
      //   }

      //   console.log(this.users.length, '长度')

      //   console.log(this.noMore, 'this.noMore')
      // }).catch(() => {
      //   this.loading = false
      //   this.depts = []
      //   this.users = []
      //   this.total = 0
      // })
    },
    cancel() {
      this.visible = false
    },
    sure() {
      const length = this.checkUser.length + this.checkDept.length
      if (length < this.minlength) {
        return this.$message.error(`至少需要选择${this.minlength}项`)
      }
      if (this.isShowSelect && (!this.qwInheritType && this.qwInheritType !== 0)) {
        return this.$message.error(`请选择企业微信继承状态!`)
      }
      this.visible = false
      if (this.success) {
        // console.log(this.checkDept, this.checkUser)
        // if (this.type === 0) {
        //   this.success(this.checkDept)
        // } else if (this.type === 1) {
        //   this.success(this.checkUser)
        // }
        const objData = this.isShowSelect ? {
          dept: this.checkDept,
          user: this.checkUser,
          qwInheritType: this.qwInheritType
        } : {
          dept: this.checkDept,
          user: this.checkUser
        }
        this.success(objData)
      }
    },
    goToNext(row) {
      // console.log('点击下一级')
      // console.log(row, 'row')
      this.parentId = row.deptId
      this.tenantId = row.tenantId
      this.currentPage = 1
      // this.search = ''
      this.isSearch = false
      this.crumbs.push(row)
      this.getOrgTree()
    },
    changeUser(row) {
      // 判断是否是禁选人员
      if (this.disabledUser?.includes(row?.userId)) return

      // 不是禁选人员
      // console.log(row, 'row')
      if (this.multiple) {
        if (
          this.maxlength !== 0 &&
          this.checkUserIds.length >= this.maxlength
        ) {
          return this.$message.error(`最多只能选择${this.maxlength}项`)
        }

        // 多选
        if (this.checkUserIds.includes(row.userId)) {
          const index = this.checkUser.findIndex(v => v.userId === row.userId)
          this.checkUser.splice(index, 1)
          const i = this.checkUserIds.findIndex(v => v === row.userId)
          this.checkUserIds.splice(i, 1)
        } else {
          this.checkUser.push(row)
          this.checkUserIds.push(row.userId)
        }
      } else {
        this.checkUser = []
        this.checkUserIds = []
        // 单选
        if (!this.checkUserIds.includes(row.userId)) {
          this.checkUser.push(row)
          this.checkUserIds.push(row.userId)
        }
      }
    },
    changeDept(row) {
      // 判断是不是禁选部门
      if (this.disabledDept?.includes(row?.deptId) || row.status === 1) return
      // 不是禁选部门
      // console.log(row)
      if (this.multiple) {
        // 多选
        if (this.checkDeptIds.includes(row.deptId)) {
          const index = this.checkDept.findIndex(v => v.deptId === row.deptId)
          this.checkDept.splice(index, 1)
          const i = this.checkDeptIds.findIndex(v => v === row.deptId)
          this.checkDeptIds.splice(i, 1)
        } else {
          this.checkDept.push(row)
          this.checkDeptIds.push(row.deptId)
        }
      } else {
        this.checkDept = []
        this.checkDeptIds = []
        // 单选
        if (!this.checkDeptIds.includes(row.deptId)) {
          this.checkDept.push(row)
          this.checkDeptIds.push(row.deptId)
        }
      }
    },
    // 点击面包屑
    changeCrumbs(row, index) {
      if (index === this.crumbs.length - 1) {
        return
      }
      const i = this.crumbs.findIndex(v => v.id === row.id)
      // console.log(this.crumbs, i)
      this.crumbs.splice(i + 1, this.crumbs.length - 1)
      if (row.id === '-1') {
        this.parentId = ''
        this.tenantId = ''
      } else {
        this.parentId = row.id
        this.tenantId = row.tenantId
      }
      this.currentPage = 1
      this.users = []
      this.depts = []
      this.getOrgTree()
    },
    // 分页
    handleCurrentChange(row) {
      // console.log(row, '分页')
      this.currentPage = row
      this.getOrgTree()
    },
    // 滚动加载
    load() {
      // console.log('滚动加载')
      this.currentPage = this.currentPage + 1
      this.getOrgTree()
    },
    // 删除人员已选
    delUserCheck(row, index) {
      if (this.disabledUser.includes(row.userId)) {
        return this.$message.error('该人员不允许删除~')
      }
      // console.log(row, index)
      this.checkUser.splice(index, 1)
      this.checkUserIds.splice(index, 1)
    },
    // 删除部门已选
    delDeptCheck(row, index) {
      // console.log(row, index)
      this.checkDept.splice(index, 1)
      this.checkDeptIds.splice(index, 1)
    },
    // 点击全选按钮
    handleCheckAllChange(val) {
      // console.log(this.checked, '全选状态')
      if (!this.checked) {
        if (this.maxlength > 0) {
          const selectArr = []
          this.users.forEach(e => {
            if (!this.checkUserIds.includes(e.userId)) {
              selectArr.push(e)
            }
          })
          if (selectArr.length + this.checkUserIds.length > this.maxlength) {
            this.checked = false
            // console.log(this.checked)
            return this.$message.error(
              `人员最多不可超过${this.maxlength}个，请重新选择！`
            )
          } else {
            this.users.forEach(e => {
              if (!this.checkUserIds.includes(e.userId)) {
                this.checkUserIds.push(e.userId)
                this.checkUser.push(e)
              }
            })
            this.checked = true
          }
        } else {
          this.users.forEach(e => {
            if (!this.checkUserIds.includes(e.userId)) {
              this.checkUserIds.push(e.userId)
              this.checkUser.push(e)
            }
          })
          this.isIndeterminate = false
        }
      } else {
        this.isIndeterminate = false
        this.users.forEach(e => {
          const index = this.checkUserIds.findIndex(v => v === e.userId)
          index > -1 && this.checkUserIds.splice(index, 1)
          index > -1 && this.checkUser.splice(index, 1)
        })
      }
    },
    // 能否全选
    ifCanCheck() {
      const length = this.users.reduce((pre, next) => {
        this.disabledUser.includes(next.userId) && pre++
        return pre
      }, 0)
      return this.multiple && this.type.includes(1) && length === 0
    }
  }
}
</script>
<style lang="scss" scoped>
.address {
  .address_book {
    display: flex;
    width: 100%;
    height: 450px;
    .address_book_left {
      flex: 1;
      display: flex;
      flex-direction: column;
      border: 1px solid #eee;
      // overflow: auto;
      // display: flex;
      .address_book_left_search {
        padding-top: 16px;
        margin-left: 16px;
        margin-right: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .input-with-select {
        width: 100%;
        // margin-bottom: 10px;
      }
      .address_book_left_tree {
        width: 350px;
        overflow: auto;
      }
      .crumbs {
        width: 100%;
        margin: 10px 16px;
        .crumbsView {
          margin: 10px 0;
          cursor: pointer;
        }
        .colorBlue {
          color: #409eff;
        }
      }
      .addressBooks {
        &::-webkit-scrollbar {
          width: 4px;
          height: 10px;
          background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 6px;
          background-color: rgba(0, 0, 0, 0.2);
          transition: all 0.4s ease;
        }
        &::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
    }
    .address_book_right {
      // background: burlywood;
      flex: 1;
      overflow: auto;
      border: 1px solid #eee;
      &::-webkit-scrollbar {
        width: 4px;
        height: 10px;
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background-color: rgba(0, 0, 0, 0.2);
        transition: all 0.4s ease;
      }
      &::-webkit-scrollbar-track {
        background-color: rgba(0, 0, 0, 0.1);
      }
      .checkList {
        line-height: 30px;
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        padding: 0 8px;
        .el-icon-close {
          cursor: pointer;
        }
        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
  }
  .address_footer {
    margin-top: 10px;
    display: flex;
    > div {
      flex: 1;
    }
    .inherit_select {
      display: flex;
      align-items: center;
      > div:nth-of-type(1) {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        font-style: normal;
        margin-right: 5px;
        &::before {
          content: '*';
          color: red;
          margin-right: 3px;
        }
      }
    }
    .footer_btn {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }

  .addressBooks {
    // width: 350px;
    overflow: auto;
    // border-top: 1px solid #dcdfe6;
    // .addressBooksBox + .addressBooksBox {
    //   }
    .addressBooksBox {
      // border-bottom: 1px solid #dcdfe6;
      padding: 10px 10px;
      display: flex;
      align-items: center;
      &:hover {
        background: #f5f7fa;
      }
      .checkBox {
        margin-right: 10px;
        width: 16px;
        height: 16px;
        border: 1px solid #dcdfe6;
        border-radius: 2px;
      }
      .checkBoxRadio {
        margin-right: 10px;
        width: 16px;
        height: 16px;
        border: 1px solid #dcdfe6;
        border-radius: 50%;
      }
      .checkName {
        flex: 1;
        display: flex;
        .userName {
          max-width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .next {
        border-left: 1px solid #dcdfe6;
        padding-left: 10px;
        cursor: pointer;
      }
    }
  }
  .m-r-5 {
    margin-right: 5px;
  }
}

.noData {
  font-size: 14px;
  line-height: 100px;
  height: 100px;
  text-align: center;
  color: #c0c4cc;
}
.disabled {
  background-color: #f2f6fc !important;
  border-color: #dcdfe6 !important;
  cursor: not-allowed !important;
}
.userInfo {
  display: flex;
  flex-direction: column;

  .checkName {
    font-size: 14px;
    color: #000;
  }
  .userInfoDetail {
    font-size: 12px;
    margin-top: 5px;
    color: #999;
    // .userInfoDetailForm {
    //   .userInfoDetailFormLabel {
    //   }
    //   .userInfoDetailFormValue {
    //   }
    // }
  }
}
.userDetailCard {
  .userDetailCard_header {
    display: flex;
  }
  .userDetailCardForm {
    margin-top: 10px;
    width: 100%;
    float: left;
    .userDetailCardLabel {
      font-size: 12px;
      float: left;
    }
    .userDetailCardValue {
      float: left;
      margin-left: 10px;
      font-size: 12px;
      max-width: 80%;
    }
  }
}
</style>
