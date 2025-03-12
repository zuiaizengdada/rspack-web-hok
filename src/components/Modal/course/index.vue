<template>
  <el-drawer
    class="drawer"
    :title="title"
    :visible="visible"
    :direction="direction"
    :size="width"
    :wrapper-closable="false"
    :destroy-on-close="true"
    :append-to-body="true"
    @close="close"
  >
    <template v-if="visible">
      <components :is="type" :goods-id="goodsId" :is-dou="isDou" :success="success" @close="visible = false" />
    </template>
  </el-drawer>
</template>

<script>
import editVideo from './editVideo.vue'
import editAudio from './editAudio.vue'
import editImage from './editImage.vue'
import editOffline from './editOffline.vue'
import editColumn from './editColumn.vue'
import editCollegeColumn from './editCollegeColumn.vue'
export default {
  components: {
    editVideo,
    editAudio,
    editImage,
    editOffline,
    editColumn,
    editCollegeColumn
  },
  props: {
    type: {
      type: String, // 1: 新增; 2查看; 3编辑;
      default: 'editVideo'
    },
    visible: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'rtl'
    },
    title: {
      type: String,
      default: '编辑'
    },
    isDou: {
      type: Boolean,
      default: false
    },
    width: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Number,
      default: '800px'
    },
    size: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Number,
      default: '50%'
    },
    goodsId: {
      type: String,
      default: ''
    },
    success: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
    }
  },
  methods: {
    close() {
      console.log('关闭触发')
      this.visible = false
    //   this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.groupDrawer {
  flex-direction: column;
  display: flex;
  flex-direction: column;
  height: 100%;
  .form {
    // flex: 1;
    height: calc(100vh - 77px - 50px);
    width: 100%;
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .demo-drawer__footer {
    width: 100%;
    height: 50px;
    padding-top: 10px;
    padding-left: 10px;
    -webkit-box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
    box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  }
  .form_avatar {
    display: flex;
    align-items: center;
    .form_btn {
      height: 30px;
      margin-left: 10px;
    }
  }
  .form_textarea {
    width: 600px;
    margin-right: 10px;
  }
}
</style>
