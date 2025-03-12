<template>
  <div class="pdfCard-container">
    <img v-if="['pdf'].includes(imgType)" :src="pdfIcon" class="pdfCard-img" />
    <img
      v-else-if="['xls', 'xlsx', 'cvs', 'xlsm'].includes(imgType)"
      src="@/assets/image/pdf.png"
      fit="contain"
      class="pdfCard-img"
    />
    <img
      v-else-if="['ppt', 'pptx'].includes(imgType)"
      src="@/assets/image/ppt.png"
      fit="contain"
      class="pdfCard-img"
    />
    <img
      v-else-if="['doc', 'docx'].includes(imgType)"
      src="@/assets/image/ppt2.png"
      fit="contain"
      class="pdfCard-img"
    />
    <img
      v-else-if="['word'].includes(imgType)"
      src="@/assets/image/word.png"
      fit="contain"
      class="pdfCard-img"
    />
    <img
      v-else-if="['txt'].includes(imgType)"
      src="@/assets/image/txt.png"
      fit="contain"
      class="pdfCard-img"
    />
    <img
      v-else-if="['jpg', 'png'].includes(imgType)"
      src="@/assets/image/tupian.png"
      fit="contain"
      class="pdfCard-img"
    />
    <img
      v-else
      src="@/assets/image/weizhigeshi.png"
      fit="contain"
      class="pdfCard-img"
    />
    <div class="pdfCard-content">
      <div>
        <!-- <template v-if="type==='file'">
          <div >{{ content.fileName }}</div>
          <div>{{ content.companySealStatus === 2 ? content.companySealTime : content.employeeSignTime }}</div>
        </template>
        <template v-else-if="type==='resume'">
          <div >{{ content.name }}</div>
        </template>
        <template v-else>
          <div >{{ title }}</div>
          <div>{{ date }}</div>
        </template> -->
        <div :title="name">{{ handleTitle(name) }}</div>
        <div>{{ getTime(date, '-', '-') }}</div>
      </div>
      <slot />
      <el-dropdown trigger="hover">
        <span class="el-dropdown-link">
          <i class="el-icon-more more-icon" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-if="showBrowseBtn"
            @click.native="browse(url)"
          >预览</el-dropdown-item>
          <el-dropdown-item
            v-if="showDownBtn"
            @click.native="down()"
          >下载</el-dropdown-item>
          <el-dropdown-item
            v-if="showDelBtn"
            @click.native="del()"
          >删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import pdfIcon from '@/assets/image/oa/pdf.png'
import { fileDownload } from '@/utils/index'
// import Dialog from '@/components/Dialog/index.js'
import moment from 'moment'
import { hasValue } from '@/utils/index'
import { browse } from '@/views/oaMannagement/utils/common'

export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    content: {
      type: Object,
      default: () => {}
    },
    name: {
      type: String,
      default: ''
    },
    date: {
      type: [String, Number],
      default: ''
    },
    showBrowseBtn: {
      type: Boolean,
      default: false
    },
    showDelBtn: {
      type: Boolean,
      default: false
    },
    showDownBtn: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pdfIcon
    }
  },
  computed: {
    imgType() {
      return this.url.split('.').pop().toLowerCase()
    }
  },
  methods: {
    browse,
    getTime(time, x, y, z) {
      return time ? moment(time).format(`YYYY${x}MM${y}DD${z || ''}`) : ''
    },
    handleTitle(name) {
      if (!hasValue(name)) {
        return ''
      }
      return name.length > 10 ? `${name.slice(0, 10)}...` : name.slice(0, 10)
    },
    down() {
      if (!this.url) {
        return
      }
      fileDownload(this.url, `${this.name}`)
    },
    del() {
      this.$emit('del')
    }
  }
}
</script>
<style lang="scss" scoped>
.more-icon {
  // 旋转90度
  transform: rotate(90deg);
}
.pdfCard-container {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 15.5px 27.5px;
  position: relative;
  .pdfCard-content {
    display: flex;
    align-items: center;
    flex: 1 0 0;
    justify-content: space-between;
    margin-left: 8px;
  }
  .pdfCard-img {
    width: 48px;
    height: 48px;
  }
}
</style>
