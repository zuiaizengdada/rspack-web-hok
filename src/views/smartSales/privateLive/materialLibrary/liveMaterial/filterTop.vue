<template>
  <div class="filterTop">
    <el-form
      ref="form"
      :model="search"
      label-width="70px"
      size="small"
      :inline="true"
    >
      <el-form-item label="文件类型">
        <el-select
          v-model="search.fileType"
          class="w-200"
          placeholder="请选择"
          clearable
          size="small"
          @change="$emit('onSearch')"
        >
          <el-option label="图片" :value="1" />
          <el-option label="视频" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="文件名称">
        <el-input
          v-model.trim="search.fileName"
          placeholder="请输入文件名称"
          style="width: 220px"
          class="m-r-20"
          size="small"
          clearable
          @keyup.enter.native="$emit('onSearch')"
          @clear="$emit('onSearch')"
        />
      </el-form-item>
      <el-form-item label="标签">
        <el-input
          v-model.trim="search.tag"
          placeholder="请输入标签名称"
          style="width: 220px"
          class="m-r-20"
          size="small"
          clearable
          @keyup.enter.native="$emit('onSearch')"
          @clear="$emit('onSearch')"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="$emit('onSearch')">查询</el-button>
        <!-- <el-button @click="$emit('onClear')">清空</el-button> -->
      </el-form-item>
      <el-form-item class="fr m-r-0">
        <el-button
          type="primary"
          @click="$emit('onAdd')"
          v-permission="['btn:newliveMaterial:uploading', permsList]"
          >上传</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          fileType: '',
          fileName: '',
          tag: ''
        }
      }
    },
    option: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
    }
  },
  mounted() {},
  methods: {
    remoteLabelSearch() {}
  }
}
</script>

<style lang='scss' scoped>
.filterTop {
  border-bottom: 1px solid #e7e7e7;
  margin-bottom: 20px;
}
.m-r-0 {
  margin-right: 0 !important;
}
</style>
