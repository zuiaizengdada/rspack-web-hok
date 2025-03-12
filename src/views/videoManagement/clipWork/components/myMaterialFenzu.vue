<template>
  <div class="page_wrap overflowOuto">
    <el-tree
      ref="treeForPage"
      :data="listData"
      :props="defaultProps"
      :current-node-key="currentLivingId"
      node-key="code"
      :default-expanded-keys="defaultkeyarr"
      @node-click="handleNodeClick"
      @node-expand="fnnodepand"
      @node-collapse="closePand"
    >
      <div slot-scope="{ data }" class="customize-tree-p active-mode">
        <i class="icn-title" :class="data.type === 1 ? 'icn-wjj' : 'icn-wj'" />
        <span
          class="title-span"
        >{{ data.type === 1 ? data.code : data.projectName
        }}{{ data.num ? '(' + data.num + ')' : '' }}</span>
        <i v-if="data.type === 2" class="active-right" />
      </div>
    </el-tree>
  </div>
</template>

<script>
import { getMyMaterialList } from '@/api/videoManagement/clipWork'
export default {
  components: {},
  props: {},
  data() {
    return {
      countNumber: 1,
      listData: [],
      currentLivingId: 0,
      openString: '',
      defaultProps: {
        children: 'childrenList',
        label: 'code'
      },
      defaultkeyarr: ['最新素材'],
      nowChooseObj: {},
      nowChooseObjFlag: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.listData && this.listData.length > 0) {
        console.log('1')
      } else {
        this.loadData()
        // this.$refs.tree.setCurrentKey(0)
      }
    })
  },
  created() {
    const arrCode = localStorage.getItem('materialTreeOpenCodeArr')
    let arr = []
    if (arrCode) {
      arr = arrCode.split(',')
    }
    if (arr && arr.length > 0) {
      this.defaultkeyarr = arr
    } else {
      this.defaultkeyarr = ['最新素材']
    }
    const chooseObj = localStorage.getItem('materialChooseObj')
    if (chooseObj) {
      this.nowChooseObjFlag = false
      this.nowChooseObj = JSON.parse(chooseObj)
      this.currentLivingId = this.nowChooseObj.code
      // alert(this.currentLivingId)
      this.$emit('tohander', this.nowChooseObj)
    } else {
      this.nowChooseObjFlag = true
    }
  },
  methods: {
    closePand(node) {
      this.defaultkeyarr.some((item, index) => {
        console.log('ssssssssss:', item)
        if (item === node.code) {
          this.defaultkeyarr.splice(index, 1)
        }
      })
      localStorage.setItem('materialTreeOpenCodeArr', this.defaultkeyarr)
      this.closeMoren(node)
    },
    closeMoren(node) {
      if (node.childrenList && node.childrenList.length) {
        node.childrenList.some(item => {
          if (item.type === 1) {
            this.defaultkeyarr.some((obj, index) => {
              console.log('ssssssssss:', obj)
              if (obj === item.code) {
                this.defaultkeyarr.splice(index, 1)
              }
            })
            localStorage.setItem('materialTreeOpenCodeArr', this.defaultkeyarr)
            this.closeMoren(item)
          }
        })
      }
    },
    handleNodeClick(data) {
      console.log(data)
      if (data.childrenList) {
        return
      }
      this.currentLivingId = data.code
      localStorage.setItem('materialChooseObj', JSON.stringify(data))
      // this.currentLivingId = data.id
      this.$emit('tohander', data)
    },
    fnnodepand(node) {
      console.log('ddddddddddddddddddddddd:', node)
      console.log('mmmmmmmmmmmmmmmm:', this.defaultkeyarr)
      this.defaultkeyarr.push(node.code)
      localStorage.setItem('materialTreeOpenCodeArr', this.defaultkeyarr)
    },
    findParent(id, list) {
      let arr = []
      list.some(item => {
        if (item.code === id) {
          arr.push(item.code)
          return true
        } else {
          if (item.childrenList && item.childrenList.length > 0) {
            const arr1 = this.findParent(id, item.childrenList)
            if (arr1 && arr1.length > 0) {
              arr = arr.concat(arr1)
              arr.push(item.code)
              return true
            }
          }
        }
      })
      return arr
    },
    loadData() {
      const params = {}
      getMyMaterialList(params).then(res => {
        this.listData = res.data
        if (
          this.nowChooseObjFlag &&
          this.listData[0].childrenList &&
          this.listData[0].childrenList.length > 0
        ) {
          this.$nextTick(() => {
            this.currentLivingId = this.listData[0].childrenList[0].code
            this.$refs.treeForPage &&
              this.$refs.treeForPage.setCurrentKey(this.currentLivingId)
          })
          this.$emit('tohander', this.listData[0].childrenList[0])
          localStorage.setItem(
            'materialChooseObj',
            JSON.stringify(this.listData[0].childrenList[0])
          )
        } else {
          console.log(this.currentLivingId, 1000868686)
          // 通过this.currentLivingId递归来找到所有父级的code
          if (this.currentLivingId) {
            this.defaultkeyarr = this.findParent(
              this.currentLivingId,
              this.listData
            )
            // 过滤掉this.currentLivingId的这条数据
            this.defaultkeyarr = this.defaultkeyarr.filter(
              item => item !== this.currentLivingId
            )
            console.log(this.defaultkeyarr)
          }
        }
        // this.resetData(this.listData)
        // console.log('%%%%%%%%%%%%%%##########: ', this.listData)
        // this.openString = this.listData[0].id
        // this.currentLivingId = this.listData[0].childrenList[0].id
        // this.$emit('tohander', this.listData[0].childrenList[0])
      })
    },
    resetData(array) {
      array.some((item, index) => {
        this.countNumber++
        this.$set(item, 'id', this.countNumber + '' + index + '')
        if (item.childrenList && item.childrenList.length > 0) {
          this.resetData(item.childrenList)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(139px);
  width: 100%;
  overflow-y: auto;
  // margin-top: 10px;
  background: #fafcff;
  ::v-deep .el-tree {
    background-color: #fafcff;
  }
  .customize-tree-p {
    width: 100%;
    height: 28px;
    font-size: 14px;
    margin-top: 5px;
    padding-top: 5px;
    margin-bottom: 5px;
    ::v-deep .is-current {
      background-color: #fff;
      color: #0c6fff;
    }
    .icn-title {
      float: left;
      width: 16px;
      height: 16px;
      margin-top: 3px;
      margin-right: 5px;
    }
    .icn-wjj {
      background-image: url(../../../../assets/image/video/wenjianjia_icon.png);
      background-size: 100% 100%;
    }
    .icn-wj {
      background-image: url(../../../../assets/image/video/wenjian_icon.png);
      background-size: 100% 100%;
    }
    .title-span {
      font-style: normal;
      margin-right: 5px;
      padding-right: 30px;
      position: relative;
      display: block;
      height: 28px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .title-p {
      float: left;
      width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .long-p {
      width: 150px;
    }
  }
  ::v-deep .el-tree-node.is-current > .el-tree-node__content {
    background: #fff;
    color: #187aff;
    width: 100%;
    position: relative;
    ::v-deep .el-tree-node__expand-icon {
      color: rgb(0, 112, 255);
    }
    ::v-deep .is-leaf {
      color: rgba(0, 0, 0, 0);
    }
    .active-mode {
      float: left;
      width: 100%;
      height: 28px;
      background: #fff;
      color: #187aff;
    }
    .active-right {
      position: absolute;
      right: 0px;
      top: 9px;
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
}
::v-deep .el-tree-node__content {
  height: 32px;
}
::v-deep .el-tree-node__expand-icon {
  margin-top: 5px;
}
</style>
