<template>
  <div class="filterTop">
    <!-- 筛选栏 -->
    <el-form ref="form" :model="search" label-width="auto" size="small">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="视频课件ID">
            <el-input v-model="search.videoId" clearable @keyup.enter.native="handleSubmit" @clear="handleSubmit" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="视频课件名称">
            <el-input v-model="search.videoName" clearable @keyup.enter.native="handleSubmit" @clear="handleSubmit" />
          </el-form-item>
        </el-col>
        <el-col v-if="navType === 1" :span="6">
          <el-form-item label="视频来源">
            <m-select
              v-model="search.videoSource"
              dict-key="VIDEO_SOURCE"
              @change="handleSubmit"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="orgModules.enableLecturer && navType === 1" :span="6">
          <el-form-item label="关联讲师">
            <m-select
              v-model="search.teacherId"
              remote
              :request="teacherQueryByName"
              :param="{value:'teacherId',label:'teacherName'}"
              @change="handleSubmit"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="navType === 2" :span="12" class="btn-filter">
          <div>
            <el-button type="primary" size="small" @click="handleSubmit">查询</el-button>
            <el-button size="small" @click="handleInit">重置</el-button>
          </div>
          <!-- <div>
            <el-button type="primary" size="small" @click="onhandleUpload">上传视频</el-button>
          </div> -->
        </el-col>
      </el-row>
      <el-row v-if="navType === 1" :gutter="20">
        <el-col :span="6">
          <el-form-item label="视频标签">
            <m-select
              v-model="search.labelText"
              :request="getVideoLabels"
              :param="{value:'label',label:'label'}"
              @change="handleSubmit"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="上传人">
            <m-select
              v-model="search.createUserId"
              :request="userNoPage"
              :param="{value:'userId',label:'nickName'}"
              @change="handleSubmit"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="btn-filter">
          <div>
            <el-button type="primary" size="small" @click="handleSubmit">查询</el-button>
            <el-button size="small" @click="handleInit">重置</el-button>
          </div>
          <div>
            <el-button type="primary" size="small" @click="onhandleUpload">上传视频</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <div class="navType">
      <div class="navTypeUl">
        <div class="navTypeLi" :class="{'active': navType === 1}" @click="navType === 1 ? '' : $emit('onnavTypeChange', 1)">正式</div>
        <div class="navTypeLi" :class="{'active': navType === 2}" @click="navType === 2 ? '' : $emit('onnavTypeChange', 2)">草稿</div>
      </div>
    </div>
  </div>
</template>

<script>
import { teacherQueryByName } from '@/api/tearchCenter/index'
import { getVideoLabels } from '@/api/liveVideo'
import { userNoPage } from '@/api/addressBookApi'
import { mapGetters } from 'vuex'
export default {
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          videoId: '',
          videoName: '',
          videoSource: '',
          teacherId: '',
          labelText: '',
          createUserId: ''
        }
      }
    },
    navType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // navType: 1, // 1：正式，2：草稿
      teacherQueryByName,
      getVideoLabels,
      userNoPage
    }
  },
  computed: {
    ...mapGetters([
      'orgModules'
    ])
  },
  created() {
    this.$emit('onSearch')
  },
  mounted() {},
  methods: {
    // 点击上传视频按钮
    onhandleUpload() {
      this.$emit('onUpload')
    },
    handleSubmit() {
      this.$emit('onSearch')
    },
    handleInit() {
      this.$emit('onClear')
    }
  }
}
</script>

<style lang='scss' scoped>
.filterTop {
  padding-top: 20px;
  // border-bottom: 1px solid #E7E7E7;
  margin-bottom: 20px;
}
.btn-filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.navType {
  background: #F5F7FA;
  padding: 4px 4px 0 4px;
  .navTypeUl {
    display: flex;
    width: 100%;
    .navTypeLi {
      width: 104px;
      height: 40px;
      line-height: 36px;
      text-align: center;
      background: #F5F7FA;
      border-radius: 6px 6px 0px 0px;
      font-size: 15px;
      font-family: MicrosoftYaHei;
      color: #333333;
      cursor: pointer;
      border-top: 4px solid transparent;
    }
    .active {
      background: #FFFFFF;
      color: #0C6FFF;
      border-top: 4px solid #0C6FFF;
    }
  }
}
</style>
