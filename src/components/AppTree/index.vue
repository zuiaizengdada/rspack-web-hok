<template>
  <div class="custom-tree-container">
    <div v-loading="loading" class="block">
      <div class="search">
        <span v-if="searchType" @click="searchBack">返回</span>
        <el-input
          v-model.trim="search"
          size="small"
          suffix-icon="el-icon-search"
          clearable
          placeholder="请输入分类名称"
          @keyup.enter.native="searchFn"
        />
      </div>
      <div class="tree">
        <el-scrollbar class="ss-scroll">
          <el-tree
            ref="tree"
            style="width: 298px"
            :data="value"
            node-key="dirId"
            :default-expanded-keys="defaultKeys || [-1]"
            :expand-on-click-node="true"
            :props="defaultProps"
            :highlight-current="true"
            :filter-node-method="filterNode"
            v-bind="$attrs"
            @node-click="nodeClick"
            @node-expand="handleExpand"
            @node-collapse="handleCollapse"
          >
            <span slot-scope="{ node, vdata }" class="custom-tree-node">
              <span v-if="node.label.length < 8" class="treeLabel">{{ node.label }}</span>
              <el-tooltip v-else class="item" effect="dark" :content="node.label" placement="bottom-start">
                <span class="treeLabel">{{ node.label }}</span>
              </el-tooltip>

              <template v-if="node.label !== '默认分组'">
                <span v-if="!nobtn" class="label_tree">
                  <!--
                     -->
                  <el-button
                    v-permission="['system:material:add', permsList]"
                    type="text"
                    icon="el-icon-circle-plus-outline"
                    @click.native.stop="() => append(vdata, node)"
                  />
                  <el-dropdown v-if="node.data.id !== '-1'" trigger="click" :hide-on-click="false">
                    <span>
                      <img class="scgl-more" src="@/assets/image/icon/icon_scgl_more.png" />
                    </span>
                    <!-- <svg-icon icon-class="more" /> -->
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-permission="['system:material:remove', permsList]"
                        icon="el-icon-delete"
                        @click.native="() => remove(node, vdata)"
                      >删除</el-dropdown-item>
                      <el-dropdown-item
                        v-permission="['system:material:edit', permsList]"
                        icon="el-icon-edit"
                        @click.native="() => update(node, vdata)"
                      >重命名</el-dropdown-item>
                      <el-dropdown-item
                        v-if="node.data.teacherFlag === 2"
                        v-permission="['system:material:relationOn', permsList]"
                        icon="el-icon-star-on"
                        @click.native="() => relationOn(node)"
                      >取消关联</el-dropdown-item>
                      <el-dropdown-item
                        v-else-if="node.data.teacherFlag === 0"
                        v-permission="['system:material:relationOff', permsList]"
                        icon="el-icon-star-off"
                        @click.native="() => relationOff(node)"
                      >关联</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>
              </template>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
    </div>
    <AppDialog
      v-model="tDialog.visible"
      :title="tDialog.title"
      width="180"
      height="280"
      @success="tDialog.visible = false"
    >
      <div class="info-box">
        <div class="info-title">关联IP</div>
        <teacherSelect
          ref="teacherSelect"
          :value="select_val"
          :default-tearch-id="select_teacherId"
          @selected="onTeacherSelect"
        />
      </div>
      <div slot="footer" class="footer">
        <el-button :loading="data.loading" type="primary" @click="submitForm">选择引用</el-button>
      </div>
    </AppDialog>
  </div>
</template>
<script>
import AppDialog from '@/components/AppDialog'
import teacherSelect from './components/teacherSelect.vue'
import { getTeacherDirInfo } from '@/api/course'
export default {
  components: {
    AppDialog,
    teacherSelect
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['value', 'loading', 'nobtn'],
  data() {
    return {
      search: '',
      data: [],
      searchType: false,
      defaultProps: {
        children: 'children',
        label: 'dirName'
      },
      permsList: this.$route?.meta?.permsList || [],
      tDialog: {
        visible: false,
        title: '关联IP'
      },
      restaurants: [],
      select_val: '',
      select_teacherId: '',
      select_node: '',
      timeout: null,
      defaultKeys: ['-1']
    }
  },
  mounted() {
    this.restaurants = this.loadAll()
  },
  methods: {
    // 搜索事件
    searchFn(e) {
      this.searchType = true
      this.$refs.tree.filter(this.search)
    },
    // 搜索返回
    searchBack() {
      this.searchType = false
      this.$refs.tree.filter()
    },
    // 添加分类
    append(data, node) {
      this.$AppEditName({
        title: '请输入分类名称',
        maxlength: 30,
        success: (value) => {
          this.$emit('addHandle', value, node.data)
        }
      })
    },
    // 删除分类
    remove(node, data) {
      this.$delModal({
        tips: '确定删除该分类?',
        success: () => {
          this.defaultKeys = this.defaultKeys.filter(item => item !== node.data.dirId)
          this.$emit('delHandle', node.data)
        }
      })
    },
    // 点击分类
    nodeClick(data, node) {
      console.log('点击了啊')
      console.log('permsList--->', this.permsList)
      this.$emit('node-click', data, node)
    },
    //  展开触发
    handleExpand(data) {
      const defaultKes = [...this.defaultKeys, data.dirId]
      this.defaultKeys = [... new Set(defaultKes)]
    },
    // 平铺数组
    flatten(arr) {
      let result = []
      arr.forEach(item => {
        const { children, ...rest } = item
        result = [...result, rest.dirId]
        if (children && children.length > 0) {
          result = [...result, ...this.flatten(children)]
        }
      })
      return result
    },
    // 折叠触发
    handleCollapse(data) {
      const keys = this.flatten([data])
      this.defaultKeys = this.defaultKeys.filter(item => keys.indexOf(item) < 0)
      console.log(this.defaultKeys)
    },
    // 重命名分类
    update(node, data) {
      this.$AppEditName({
        title: '请输入分类名称',
        maxlength: 30,
        defaultValue: node.data.dirName,
        success: (value) => {
          this.$emit('editHandle', value, node.data)
        }
      })
    },
    // 关联老师
    relationOff(node) {
      console.log('关联')
      console.log(node)
      this.select_node = node
      getTeacherDirInfo(node.data.dirId)
        .then((res) => {
          console.log('res 结果', res.data)
          if (res.data) {
            this.$message.error(
              '您选择的文件夹下有子文件夹关联了老师,当前文件夹不能再关联老师,请先解除子文件夹的老师关联再操作当前文件夹!'
            )
          } else {
            this.tDialog.visible = true
          }
        })
        .catch(() => {
          this.treeLoading = false
        })
    },
    // 取消关联老师
    relationOn(node) {
      console.log(node)
      this.$emit('relationOnHandle', node.data)
    },
    filterNode(value, data) {
      console.log(data, 'data')
      if (!value) return true
      return data.dirName.indexOf(value) !== -1
    },
    setCurrentKey(key) {
      this.$refs.tree && this.$refs.tree.setCurrentKey(key)
    },
    submitForm() {
      const teacherId = this.select_teacherId
      const node = this.select_node
      if (teacherId) {
        const data = {
          teacherId,
          data: node.data
        }
        this.$emit('relationOffHandle', data)
      } else {
        this.$message({
          message: '请选择关联IP',
          type: 'warning'
        })
      }
    },
    clearRelationIofo() {
      this.select_node = ''
      this.select_teacherId = ''
      this.select_val = ''
      this.tDialog.visible = false
      this.$message({
        type: 'success',
        message: '关联成功!'
      })
    },
    loadAll() {
      return [
        { value: '三全鲜食（北新泾店）', address: '长宁区新渔路144号' },
        { value: 'Hot honey 首尔炸鸡（仙霞路）', address: '上海市长宁区淞虹路661号' },
        { value: '新旺角茶餐厅', address: '上海市普陀区真北路988号创邑金沙谷6号楼113' },
        { value: '泷千家(天山西路店)', address: '天山西路438号' },
        { value: '胖仙女纸杯蛋糕（上海凌空店）', address: '上海市长宁区金钟路968号1幢18号楼一层商铺18-101' },
        { value: '贡茶', address: '上海市长宁区金钟路633号' },
        { value: '豪大大香鸡排超级奶爸', address: '上海市嘉定区曹安公路曹安路1685号' },
        { value: '茶芝兰（奶茶，手抓饼）', address: '上海市普陀区同普路1435号' },
        { value: '十二泷町', address: '上海市北翟路1444弄81号B幢-107' },
        { value: '星移浓缩咖啡', address: '上海市嘉定区新郁路817号' },
        { value: '阿姨奶茶/豪大大', address: '嘉定区曹安路1611号' },
        { value: '新麦甜四季甜品炸鸡', address: '嘉定区曹安公路2383弄55号' },
        { value: 'Monica摩托主题咖啡店', address: '嘉定区江桥镇曹安公路2409号1F，2383弄62号1F' },
        { value: '浮生若茶（凌空soho店）', address: '上海长宁区金钟路968号9号楼地下一层' },
        { value: 'NONO JUICE  鲜榨果汁', address: '上海市长宁区天山西路119号' },
        { value: 'CoCo都可(北新泾店）', address: '上海市长宁区仙霞西路' },
        { value: '快乐柠檬（神州智慧店）', address: '上海市长宁区天山西路567号1层R117号店铺' },
        { value: 'Merci Paul cafe', address: '上海市普陀区光复西路丹巴路28弄6号楼819' },
        { value: '猫山王（西郊百联店）', address: '上海市长宁区仙霞西路88号第一层G05-F01-1-306' },
        { value: '枪会山', address: '上海市普陀区棕榈路' },
        { value: '纵食', address: '元丰天山花园(东门) 双流路267号' },
        { value: '钱记', address: '上海市长宁区天山西路' },
        { value: '壹杯加', address: '上海市长宁区通协路' },
        { value: '唦哇嘀咖', address: '上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元' },
        { value: '爱茜茜里(西郊百联)', address: '长宁区仙霞西路88号1305室' },
        { value: '爱茜茜里(近铁广场)', address: '上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺' },
        { value: '鲜果榨汁（金沙江路和美广店）', address: '普陀区金沙江路2239号金沙和美广场B1-10-6' },
        { value: '开心丽果（缤谷店）', address: '上海市长宁区威宁路天山路341号' },
        { value: '超级鸡车（丰庄路店）', address: '上海市嘉定区丰庄路240号' },
        { value: '妙生活果园（北新泾店）', address: '长宁区新渔路144号' },
        { value: '香宜度麻辣香锅', address: '长宁区淞虹路148号' },
        { value: '凡仔汉堡（老真北路店）', address: '上海市普陀区老真北路160号' },
        { value: '港式小铺', address: '上海市长宁区金钟路968号15楼15-105室' },
        { value: '蜀香源麻辣香锅（剑河路店）', address: '剑河路443-1' },
        { value: '北京饺子馆', address: '长宁区北新泾街道天山西路490-1号' },
        { value: '饭典*新简餐（凌空SOHO店）', address: '上海市长宁区金钟路968号9号楼地下一层9-83室' },
        { value: '焦耳·川式快餐（金钟路店）', address: '上海市金钟路633号地下一层甲部' },
        { value: '动力鸡车', address: '长宁区仙霞西路299弄3号101B' },
        { value: '浏阳蒸菜', address: '天山西路430号' },
        { value: '四海游龙（天山西路店）', address: '上海市长宁区天山西路' },
        { value: '樱花食堂（凌空店）', address: '上海市长宁区金钟路968号15楼15-105室' },
        { value: '壹分米客家传统调制米粉(天山店)', address: '天山西路428号' },
        { value: '福荣祥烧腊（平溪路店）', address: '上海市长宁区协和路福泉路255弄57-73号' },
        { value: '速记黄焖鸡米饭', address: '上海市长宁区北新泾街道金钟路180号1层01号摊位' },
        { value: '红辣椒麻辣烫', address: '上海市长宁区天山西路492号' },
        { value: '(小杨生煎)西郊百联餐厅', address: '长宁区仙霞西路88号百联2楼' },
        { value: '阳阳麻辣烫', address: '天山西路389号' },
        { value: '南拳妈妈龙虾盖浇饭', address: '普陀区金沙江路1699号鑫乐惠美食广场A13' }
      ]
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 3000 * Math.random())
    },
    createStateFilter(queryString) {
      return (state) => {
        return state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    onTeacherSelect(e) {
      this.select_val = e.teacherName
      this.select_teacherId = e.teacherId
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  position: relative;

  .label_tree {
    position: absolute;
    right: 9px;
    top: -9px;
    display: flex;
    align-items: center;
  }
}
.custom-tree-container {
  height: 100%;
  .block {
    display: flex;
    flex-direction: column;
    height: 100%;
    .search {
      padding: 10px;
      height: 50px;
      border-bottom: 1px solid #ebebeb;
      display: flex;
      align-items: center;
      > span {
        cursor: pointer;
        color: #105cfb;
        width: 3em;
      }
    }
    .tree {
      padding: 10px 0;
      flex: 1;
      overflow: auto;
      width: 100%;
      height: calc(100% - 50px);
    }
  }
  .scgl-more{
    height: 12.5px;
    width: 12.5px;
    margin: 1px 0 0 1px;
  }
}

.treeLabel {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
::v-deep {
  .ss-scroll {
    width: 100%;
    height: 100%;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .el-tree-node.is-current {
    > .el-tree-node__content {
      background-color: #cee2ff !important;
    }
  }
}
.info-box {
  display: flex;
  align-items: center;
  padding: 20px;
  .info-title {
    padding-right: 10px;
  }
}
.footer {
  margin: 20px;
}
</style>
