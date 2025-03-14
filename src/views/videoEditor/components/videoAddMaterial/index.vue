<template>
  <div class="dialog">
    <el-dialog
      :width="width"
      :title="title"
      :visible.sync="visible"
      custom-class="dialog-body"
      :show-close="false"
      :close-on-click-modal="false"
      :press-escape="false"
      :close-on-press-escape="false"
      :top="top"
      @closed="close"
    >
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">{{ title }}</div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <div
        :style="{ width: width, height: height }"
        class="flex dialog-body-content my_content"
      >
        <!-- 左边部分 -->
        <div class="my_left">
          <div>
            <filterTop
              ref="filterTop"
              class="p-l-r-16"
              @onTeacherSelect="onTeacherSelect"
              @keyWordChange="keyWordChange"
              @clear="onTeacherSelect"
            />
          </div>
          <div>我的工程</div>
          <div v-if="isSearch">
            <list ref="MList" :data="listData" @change="onhandeChange" />
            <div v-if="listData && listData.length > 0" class="pagination">
              <div>共{{ config.total }}条</div>
              <pagination
                :total="config.total"
                :current="config.current"
                :size="config.size"
                @currentChange="currentChange"
              />
            </div>
          </div>
          <el-tree
            v-else
            ref="treeForPage"
            class="my_tree"
            :data="treeListData"
            style="overflow-y: auto; max-height: 90%"
            :props="defaultProps"
            auto-expand-parent
            :current-node-key="currentLivingId"
            node-key="code"
            :default-expand-all="false"
            :default-expanded-keys="defaultkeyarr"
            @node-expand="fnnodepand"
            @node-collapse="closePand"
            @node-click="handleNodeClick"
          >
            <div slot-scope="{ data }" class="customize-tree-p active-mode" style="width: 100%;">
              <i
                class="icn-title"
                :class="data.type === 1 ? 'icn-wjj' : 'icn-wj'"
              />
              <span class="title-span">
                <span class="projectName">{{ data.type === 1 ? data.groupName : data.projectName
                }}{{
                  data.type === 1 && data.projectNum
                    ? '(' + data.projectNum + ')'
                    : ''
                }}</span>
                <span
                  v-if="data.havaExistence && data.type !== 1"
                  class="nums-prompt"
                  :style="data.havaExistence < 10 ? ' border-radius: 50%;' : ''"
                >{{ data.havaExistence > 99 ? '99+' : data.havaExistence }}</span>
              </span>
              <i v-if="data.type === 2" class="active-right" />
            </div>
          </el-tree>
        </div>
        <!-- 右边部分 -->
        <materialList ref="materialList" :external-selected-data="externalSelectedData" :right-list="rightList" @handleSelectionChange="handleSelectionChange" />
      </div>
      <div class="ss-material-box-bottom">
        <el-button
          class="myBtn btnCancel"
          size="small"
          :loading="loading"
          @click="close"
        >取消</el-button>
        <el-button
          class="myBtn"
          size="small"
          :disabled="!allNums"
          :loading="loading"
          type="primary"
          @click="succeseFn"
        >确定（{{ allNums }}）</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { icn_wjj } from '@/assets/image/video/wenjianjia_icon.png'
import { icn_wj } from '@/assets/image/video/wenjian_icon.png'
import { getMyprojectList } from '@/api/videoManagement/clipWork'
import { externalVideoAdd } from '../../api'
import { myProjectShaixuan } from '@/api/videoManagement/clipWork'
import pagination from './pagination.vue'
import filterTop from './filterTop'
import list from './list'
import materialList from './materialList'
export default {
  components: {
    filterTop,
    pagination,
    materialList,
    list
  },
  props: {
    // 外部视频 需要禁用
    externalList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      icn_wjj,
      icn_wj,
      visible: false,
      listData: [],
      defaultProps: {
        children: 'childrenList',
        label: 'groupName'
      },
      search: {
        tearch: {
          tearchId: '',
          tearchName: ''
        },
        keyWord: ''
      },
      config: {
        total: 0,
        current: 1,
        size: 20
      },
      allNums: 0,
      currentLivingId: '',
      rightList: [],
      defaultkeyarr: ['0'],
      treeListData: [],
      loading: false,
      isSearch: false,
      width: '1317px',
      height: '652px',
      title: '添加素材',
      top: '114px'
    }
  },
  computed: {
    // 选中的数据
    externalSelectedData() {
      return this.externalList.map((item) => item.oldVideoId)
    }
  },
  mounted() {
    this.top = Math.abs(document.body.scrollHeight - 784) / 2 + 'px'
  },
  methods: {
    showMaterial() {
      console.log(this.externalList, '外部视频数量')
      this.visible = true
    },
    close() {
      // 清空this.rightList
      this.rightList = []
      this.defaultkeyarr = ['0']
      this.$refs.filterTop.clear()
      this.isSearch = false
      this.loading = false
      this.visible = false
    },
    changehavExistenceNum() {
      console.log(this.rightList, 'this.rightList')
      this.treeListData.forEach((item, index) => {
        if (item.childrenList) {
          item.childrenList.forEach((child, i) => {
            this.$set(child, 'havaExistence', 0)
            // this.externalList.forEach((ele) => {
            // if (ele.oldProjectId === child.code) {
            // 数量加1
            // child.havaExistence++
            // }
            // })
            if (child.code === this.$route.query.projectId) {
              this.treeListData[index].childrenList.splice(i, 1)
            }
          })
        }
      })
    },
    changeNums() {
      // 匹配到的对应的this.currentLivingId数量+1
      // 创建一个映射，将 rightList 的项目ID映射到其 projectVideoIds.length
      const rightListMap = this.rightList.reduce((map, item) => {
        console.log(this.externalSelectedData, item, '这一次需要的')
        // item.projectVideoIds不包含在this.externalSelectedData里面的数据
        map[item.projectId] = item.projectVideoIds.filter((id) => !this.externalSelectedData.includes(id)).length
        return map
      }, {})
      // 所有选中的总数
      this.allNums = Object.values(rightListMap).reduce((sum, num) => sum + num, 0)
      this.treeListData.forEach((item) => {
        if (item.childrenList) {
          item.childrenList.forEach((child) => {
            if (child.code === this.currentLivingId) {
              // 使用 $set 方法来确保 havaExistence 属性是响应式的
              this.$set(child, 'havaExistence', 0)
              // 用 rightListMap 里面的数据匹配
              if (rightListMap[child.code] !== undefined) {
                // 使用 $set 方法来更新 havaExistence 属性的值
                console.log(rightListMap, 'rightListMap')
                this.$set(child, 'havaExistence', rightListMap[child.code])
              }
            }
          })
        }
      })
      console.log(this.treeListData, 'this.treeListData===========')
    },
    async loadData() {
      const res = await getMyprojectList({ projectId: this.$route.query.projectId })
      this.treeListData = res.data
      this.changehavExistenceNum()
      // 过滤this.$route.query.projectId跟this.treeListData里面childrenList一致的数据 并且删除那条数据
      if (
        this.treeListData[0].childrenList &&
        this.treeListData[0].childrenList.length > 0
      ) {
        this.$nextTick(() => {
          this.currentLivingId = this.treeListData[0].childrenList[0].code
          console.log(this.treeListData, '列表')
          this.$refs.materialList.getDetail(this.currentLivingId)
          this.$refs.treeForPage &&
            this.$refs.treeForPage.setCurrentKey(this.currentLivingId)
        })
      } else {
        console.log(1)
      }
    },
    // 列表数据改变触发
    onhandeChange(item, videoId) {
      console.log(item, videoId, '列表改变触发')
      this.currentLivingId = item.projectId
      this.$refs.materialList.getDetail(item.projectId)
    },
    // 点击表格触发
    handleSelectionChange(data, projectId) {
      console.log(data, projectId, '是否是切换工程时触发')
      // 拿data里面的projectVideoId
      const projectVideoIds = data.map(item => item.projectVideoId)
      // 当前工程id
      const obj = { projectId: this.currentLivingId, projectVideoIds: projectVideoIds }
      // 判断this.rightList里面是否有这个数据
      const index = this.rightList.findIndex(item => item.projectId === this.currentLivingId)
      if (index === -1) {
        this.rightList.push(obj)
      } else {
        // 如果this.rightList[index].projectVideoIds已经有了传入的projectVideoIds 就不变
        // 如果没有就push进去 如果有了且不是在externalSelectedData里面的则删除  直接替换会导致无法选中

        // 此处在切换工程时会传空数据进来 还没有处理
        this.rightList[index].projectVideoIds = projectVideoIds
        // projectVideoIds.forEach((item) => {
        //   if (this.rightList[index].projectVideoIds.indexOf(item) === -1) {
        //     this.rightList[index].projectVideoIds.push(item)
        //   }
        // })
      }
      this.changeNums()
    },
    closePand(node) {
      this.defaultkeyarr.some((item, index) => {
        if (item === node.code) {
          this.defaultkeyarr.splice(index, 1)
        }
      })
    },
    fnnodepand(node) {
      this.defaultkeyarr.push(node.code)
    },
    // 筛选栏选择老师变化
    onTeacherSelect(item) {
      this.search.tearch.tearchId = item.teacherId
      this.search.tearch.tearchName = item.teacherName
      this.getList()
    },
    // 分页改变触发
    currentChange(val) {
      this.config.current = val
      this.loading = true
      this.getList()
    },
    // 搜索关键词变化
    keyWordChange(val) {
      this.config.current = 1
      this.search.keyWord = val
      this.getList()
    },
    // 获取列表数据
    async getList(name) {
      this.loading = true
      const params = {
        pageSize: this.config.size,
        pageIndex: this.config.current,
        teacherId: this.search.tearch.tearchId,
        projectId: this.$route.query.projectId,
        name: this.search.keyWord
      }
      if (params.teacherId === '' && params.name === '') {
        this.isSearch = false
        this.loading = false
        return
      } else {
        this.isSearch = true
      }
      const res = await myProjectShaixuan(params)
      this.listData = res.data.items
      this.config.total = res.data.total
      // 过滤this.$route.query.projectId跟this.listData里面projectId一致的数据 并且删除那条数据 同时把res.data.total-1
      this.listData.forEach((item, index) => {
        if (item.projectId === this.$route.query.projectId) {
          this.listData.splice(index, 1)
          this.config.total = res.data.total - 1
        }
      })
      if (this.listData.length > 0) {
        this.currentItem = this.listData[0]
        this.$refs.MList.onClick(this.listData[0])
        // this.$refs.ClipWorkMyProjectChange.current = 1
      } else {
        this.$refs.materialList.clearData()
      }
      this.loading = false
    },
    handleNodeClick(data) {
      console.log(data, '当前点击的')
      if (data.childrenList || data.type === 1) {
        return
      }
      data.newVideoNum = 0
      this.currentLivingId = data.code
      this.$refs.materialList.getDetail(this.currentLivingId)
    },
    // 确定提交
    async succeseFn() {
      console.log('点击了')
      this.loading = true
      // 过滤this.rightList中的projectVideoId跟this.externalSelectedData的数据
      const newArr = this.rightList.map((item) => {
        const obj = {
          projectId: item.projectId,
          projectVideoIds: item.projectVideoIds.filter((ele) => !this.externalSelectedData.includes(ele))
        }
        return obj
      })
      console.log(newArr, '过滤后的数据')
      const obj = {
        projectId: this.$route.query.projectId,
        req: newArr
      }
      await externalVideoAdd(obj)
      this.close()
      this.$emit('updataList')
    },
    done() {
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.my_content {
  padding: 16px 20px;
  box-sizing: border-box;
  .projectName{
    width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #fff;
  }
  .title-span {
      font-style: normal;
      margin-right: 5px;
      padding-right: 40px;
      position: relative;
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: relative;
      .nums-prompt{
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        padding: 0 6px;
        background: #F53F3F;
        border-radius: 8px;
        position: absolute;
        right: 18px;
        top: 2px;
      }
  }
  .pagination {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding-left: 18px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 22px;
    user-select: none;
  }
  .icn-title {
    float: left;
    width: 16px;
    height: 16px;
    margin-top: 3px;
    margin-right: 5px;
  }
  ::v-deep .el-tree-node.is-current > .el-tree-node__content {
    color: #187aff;
    background: #2b2b2b;
    width: 100%;
    position: relative;
    ::v-deep .el-tree-node__expand-icon {
      color: rgb(0, 112, 255);
    }
    ::v-deep .is-leaf {
      color: rgba(0, 0, 0, 0);
    }
    .active-mode {
      width: 100%;
      right: 9px;
      background: #2b2b2b;
        .projectName{
            color: #187aff !important;
        }
    }
    .active-right {
      position: absolute;
      right: 9px;
      top: 4px;
      display: block;
    }
  }
  .active-right {
    width: 18px;
    height: 18px;
    display: none;
    background-image: url(../../../../assets/image/video/icn_bz.png);
    background-size: 100%;
  }
  .icn-wjj {
    background-image: url(../../../../assets/image/video/wenjianjia_icon.png);
    background-size: 100% 100%;
  }
  .icn-wj {
    background-image: url(../../../../assets/image/video/wenjian_icon.png);
    background-size: 100% 100%;
  }
}
.my_left {
  width: 294px;
  height: 100%;
  border-radius: 10px;
  opacity: 1;
  border: 1px solid #4d4d4d;
  padding: 20px;
  box-sizing: border-box;
  .my_tree {
    margin-top: 8px;
    background: transparent;
  }
}
::v-deep {
  .el-tree-node__content:hover {
    background: #2b2b2b;
  }
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #2b2b2b;
  }
}
.dialog ::v-deep .el-dialog__wrapper {
  background: rgb(0 0 0 / 70%);
}
::v-deep {
  .dialog-body {
    position: relative;
    width: 1317px;
    flex: none;
    display: flex;
    flex-direction: column;
    vertical-align: middle;
    text-align: initial;
    background: #1e1f1e;
    border-radius: 2px;
    overflow: hidden;
    border-radius: 10px;
    .el-dialog__header {
      padding: 0;
      padding-bottom: 0;
    }
    .el-dialog__body {
      padding: 0;
    }
    .ss-material-box-header {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 52px;
      padding: 15px 20px;
      background: #1e1f1e;
      border-radius: 2px 2px 0 0;
      border-bottom: 1px solid #000000;
      color: #d9d9d9;
      font-size: 16px;
      font-weight: bold;
      .ss-material-box-header-title {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }
    .close {
      color: #d9d9d9;
      margin-left: auto;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    .ss-material-box-bottom {
      display: flex;
      padding-right: 20px;
      padding-left: 20px;
      justify-content: flex-end;
      align-items: center;
      margin-top: auto;
      width: 100%;
      height: 80px;
      border-radius: 2px 2px 0 0;
      .myBtn {
        width: 104px;
        height: 40px;
        border-radius: 6px;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #fff;
      }
      .btnCancel {
        width: 104px;
        height: 40px;
        border-radius: 6px;
        border: 1px solid #4d4d4d;
        background: transparent;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #dedede;
      }
    }
  }
  .el-form-item__label {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 32px;
    font-weight: 400;
  }
  .el-popper[x-placement^='bottom'] {
    margin-top: 20px;
  }
}

.el-check-form {
  ::v-deep .el-checkbox__label {
    color: #d9d9d9;
  }
  ::v-deep .is-checked {
    .el-checkbox__label {
      color: #1778ff;
    }
  }
}
</style>

<template>
  <div class="video-add-material">
    <!-- 组件内容 -->
  </div>
</template>

<script>
import icnWjj from '@/assets/image/video/wenjianjia_icon.png'
import icnWj from '@/assets/image/video/wenjian_icon.png'

export default {
  name: 'VideoAddMaterial',
  data() {
    return {
      icn_wjj: icnWjj,
      icn_wj: icnWj,
      visible: false,
      listData: []
    }
  }
}
</script>
