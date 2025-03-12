<template>
  <!-- 顶部筛选栏 -->
  <div class="search-box">
    <div class="search-main">
      <el-form
        ref="form"
        v-model="search"
        class="filter-module"
        label-width="100px"
        size="small"
        :inline="true"
      >
        <el-form-item label="产品名称">
          <el-input
            v-model.trim="search.productName"
            placeholder="请输入产品名称"
            maxlength="50"
            clearable
          />
        </el-form-item>
        <el-form-item label="讲师名称">
          <el-input
            v-model.trim="search.teacherName"
            placeholder="请输入讲师名称"
            maxlength="50"
            clearable
          />
        </el-form-item>
        <el-form-item label="产品类别">
          <el-select
            v-model="search.sortLabel"
            filterable
            placeholder="请选择"
            clearable
            @change="searchFn"
          >
            <el-option
              v-for="item in sortLabelOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品ID">
          <el-input
            v-model.trim="search.goodsId"
            placeholder="请输入商品ID"
            maxlength="50"
            clearable
          />
        </el-form-item>
        <el-form-item label="研发进度">
          <el-select
            v-model="search.researchProgress"
            filterable
            placeholder="请选择"
            clearable
            @change="searchFn"
          >
            <el-option
              v-for="item in researchProgressArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课研人员">
          <el-input v-model="search.researcherId" style="display: none" />
          <AppUserSelect ref="appUserSelect" @change="changeUser" />
        </el-form-item>
        <el-form-item label="伏羲云商品ID">
          <el-input
            v-model.trim="search.sysGoodsId"
            placeholder="伏羲云商品ID"
            maxlength="50"
            clearable
          />
        </el-form-item>
        <el-form-item class="download-cls">
          <el-button
            type="primary"
            size="small"
            class="control-btn-primary"
            @click="searchFn"
          >查询</el-button>
          <el-button
            size="small"
            class="control-btn"
            @click="clearFn()"
          >重置</el-button>
        </el-form-item>
        <el-button
          v-permission="['web:product:insert', permsList]"
          style="position: absolute; right: 0.4%"
          size="small"
          type="primary"
          @click="onhandleAdd"
        >新增</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  sortLabelOption,
  researchProgressArray
} from '@/views/product/columns.js'
import AppUserSelect from '@/components/AppUserSelect'
export default {
  name: 'FilterTop',
  components: {
    AppUserSelect
  },
  props: {
    search: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      researchProgressArray,
      sortLabelOption,
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 点击员工
    changeUser(res, info) {
      this.search.researcherId = res
      // this.$refs['form'].resetFields('distributionUser')
      console.log('ssssssss:', res)
      console.log('ssssssss:', info)
    },
    onhandleAdd() {
      this.$emit('onhandleAdd')
    },
    clearFn() {
      this.$refs.appUserSelect.value = ''
      this.$emit('onClear')
    },
    searchFn() {
      this.$emit('onSearch', this.search)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  width: 100%;
  // display: flex;
  position: relative;
  .search-main {
    .input-with-select {
      width: 108px;
      height: 32px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      border-radius: 3px 0px 0px 3px;
    }
    .input-with-select-chang {
      ::v-deep .el-input__inner {
        border: none;
        border-radius: 3px 0px 0px 3px;
        border: 1px solid #d8dce6;
        border-right: none;
      }
    }
    .input-with-input {
      width: 308px;
    }
    .input-with-time {
      width: 228px;
      border: none;
      border-radius: 0px 3px 3px 0px;
      border: 1px solid #d8dce6;
    }
    .order-time-box {
      display: flex;
    }
    .select-width-200 {
      width: 250px;
    }
    .common-width {
      width: 308px;
      .folower-btn {
        width: 200px;
      }
      .price-in {
        width: 92px;
      }
    }
    .common-w336 {
      width: 336px;
    }
  }
  .search-control {
    display: flex;
    margin: 0 20px;
    padding-bottom: 16px;
    justify-content: space-between;
    border-bottom: 1px solid #e7e7e7;
    margin-bottom: 15px;
    .search-control-l {
      margin-left: 10px;
      .more-box {
        margin-left: 26px;
      }
    }
    .search-control-r {
      margin-right: 10px;
    }
    .control-btn-primary {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #ffffff;
    }
    .control-btn {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #161616;
    }
  }
  .approval-control {
    background: #f3f3f3;
    border-radius: 4px;
    padding: 2px;
    margin: 15px 30px;
    display: inline-block;
    .approval-list {
      display: flex;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently
        supported by Chrome, Edge, Opera and Firefox */
      .approval-child {
        width: 88px;
        height: 32px;
        line-height: 32px;
        background: #f3f3f3;
        border-radius: 2px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        text-align: center;
        cursor: pointer;
      }
      .approval-active {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #0c6fff;
        background: #ffffff;
      }
    }
  }
}
.filter-module {
  padding: 16px 16px 0 16px;
  width: 100%;
}

.btn_ground {
  display: flex;
  margin-left: 8px;
  .btn {
    padding: 0 16px;
    color: #333;
    margin-right: 8px;
    margin-bottom: 0;
    float: left;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    background: #fff;
    cursor: pointer;
  }
  .active {
    border-color: #2a75ed;
  }
}
.btn_more {
  transition: all 0.4s;
}
.btn_close {
  transform: rotate(180deg);
}
.model-conten {
  .notice-box {
    padding: 16px 20px 0 20px;
    .notice-title {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #777777;
      margin-bottom: 8px;
    }
    .notice-info {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
    }
  }
  .notice-top {
    margin-top: 4px;
  }
  .list-box {
    padding: 16px 20px;
    .list-title {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #777777;
    }
    .list-info {
      .info-search {
        margin-top: 8px;
        .model-with-input {
          width: 426px;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #333333;
          margin-right: 8px;
        }
        .model-with-select {
          width: 130px;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #333333;
          height: 10px;
        }
      }
      .info-item {
        margin-top: 10px;
        height: 186px;
        overflow-x: auto;
        // overflow: scroll;
      }
      .info-pop {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #f53f3f;
        .icon-svg {
          margin: 16px 8px 0 0;
        }
      }
      .info-pop-pass {
        color: #00b42a;
      }
    }
  }
}
.footer-box {
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}
.w-200 {
  width: 200px;
}
::v-deep .el-input-group__prepend {
  background-color: #ffffff;
}
::v-deep .el-form-item__label {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  // color: #333333;
}
::v-deep .el-input__inner {
  height: 32px;
}
::v-deep .ss-material-box-header-title {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold !important;
  color: #333333;
}
::v-deep ::-webkit-scrollbar-track {
  background: #ededed;
  border-radius: 0;
}
::v-deep ::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
}
::v-deep :hover ::-webkit-scrollbar-track-piece {
  cursor: pointer;
  background: #ededed;
  border-radius: 0;
}

::v-deep :hover::-webkit-scrollbar-thumb:hover {
  cursor: pointer;
  border-radius: 5px;
  background: #acacac;
  transition: color 0.2s ease;
}

::v-deep :hover::-webkit-scrollbar-thumb:vertical {
  cursor: pointer;
  border-radius: 5px;
  background: #acacac;
  transition: color 0.2s ease;
}

.download-cls {
  ::v-deep .el-loading-spinner {
    padding-top: 15px;
  }
}
</style>
