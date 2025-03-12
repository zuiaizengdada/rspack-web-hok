<template>
  <div class="select-class-panel">
    <el-button type="primary" size="small" @click="handleSelectClass">
      选择已有班级
    </el-button>

    <div
      v-if="showClassError && !selectedClass"
      class="select-class-panel-tip-error"
    >
      请选择班级
    </div>

    <div v-if="selectedClass" class="select-class-info">
      <div class="select-class-info-item">
        <div class="select-class-info-item-label">班级名称</div>
        <div class="select-class-info-item-value">
          {{ selectedClass.scheduleNum }}
        </div>
      </div>

      <div class="select-class-info-item">
        <div class="select-class-info-item-label">课程名称</div>
        <div
          class="select-class-info-item-value"
          style="flex-direction: column; align-items: flex-start; gap: 10px"
        >
          <p v-for="item in selectedClass.goodsNameList" :key="item">
            {{ item }}
          </p>
        </div>
      </div>

      <div class="select-class-info-item">
        <div class="select-class-info-item-label">计划班级人数</div>
        <div class="select-class-info-item-value">
          {{ selectedClass.capacity }}
        </div>
      </div>

      <div class="select-class-info-item">
        <div class="select-class-info-item-label">班级状态</div>
        <div class="select-class-info-item-value">
          <span
            :style="
              selectedClass.scheduleStatus === 1
                ? 'color: #ff0000'
                : 'color: #00c313'
            "
          >
            {{ selectedClass.scheduleStatusName }}
          </span>
        </div>
      </div>

      <div class="select-class-info-item">
        <div class="select-class-info-item-label">入班人数</div>
        <div class="select-class-info-item-value">
          {{ selectedClass.enrollNum }}
        </div>
      </div>

      <div class="select-class-info-item">
        <div class="select-class-info-item-label">交付人数</div>
        <div class="select-class-info-item-value">
          {{ selectedClass.deleveryedNum }}
        </div>
      </div>

      <div class="select-class-info-item">
        <div class="select-class-info-item-label">开班时间</div>
        <div class="select-class-info-item-value">
          {{ selectedClass.deliveryStartTime }}
        </div>
      </div>

      <div class="select-class-info-item">
        <div class="select-class-info-item-label">创建人</div>
        <div class="select-class-info-item-value">
          {{ selectedClass.createByName }}
        </div>
      </div>

      <div class="select-class-info-item">
        <div class="select-class-info-item-label">创建时间</div>
        <div class="select-class-info-item-value">
          {{ selectedClass.createTime }}
        </div>
      </div>
    </div>

    <el-drawer
      :visible.sync="drawer"
      :title="'选择已有班级'"
      size="80%"
      :modal="false"
      :show-close="false"
      :destroy-on-close="true"
      :wrapper-closable="false"
    >
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">选择已有班级</div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <div class="select-class-table">
        <el-table :data="tableData" :height="tableHeight">
          <el-table-column label="选择" width="55">
            <template #default="scope">
              <el-radio
                v-model="selectedRow"
                :label="scope.row.id"
                @change="handleRadioChange(scope.row)"
              >&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="scheduleNum" label="班级名称" />
          <el-table-column prop="goodsNameList" label="课程名称">
            <template #default="scope">
              <span>{{ scope.row.goodsNameList.join('、') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="capacity" label="计划班级人数" />
          <el-table-column prop="scheduleStatus" label="班级状态">
            <template #default="scope">
              <div class="status-dot-box">
                <div
                  class="status-dot"
                  :class="
                    scope.row.scheduleStatusName === '已开班'
                      ? 'status-dot-success'
                      : 'status-dot-danger'
                  "
                />
                <span>{{ scope.row.scheduleStatusName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="enrollNum" label="入班人数" />
          <el-table-column prop="deleveryedNum" label="交付人数" />
          <el-table-column prop="deliveryStartTime" label="开班时间" />
          <el-table-column prop="createByName" label="创建人" />
          <el-table-column prop="createTime" label="创建时间" />
        </el-table>

        <el-row
          type="flex"
          justify="end"
          style="background: #fff; padding: 20px; border-radius: 0 0 10px 10px"
        >
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @prev-click="handlePrevClick"
            @next-click="handleNextClick"
          />
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getSchedulePage } from '@/api/deliver/assistant'

export default {
  name: 'SelectPanel',
  props: {
    goodsIdList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      drawer: false,
      selectedRow: '',
      status: 1,
      selectedClass: null,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableHeight: 500,
      showClassError: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.calculateTableHeight()
    })
  },
  methods: {
    async getSchedulePage() {
      const { data } = await getSchedulePage({
        size: this.pageSize,
        current: this.currentPage,
        type: 2,
        goodsIdList: this.goodsIdList,
        scheduleStatus: 1
      })
      this.tableData = data.records
      this.total = +data.total
    },

    handleValid() {
      if (!this.selectedClass) {
        return false
      }
      return true
    },
    calculateTableHeight() {
      const windowHeight = window.innerHeight
      this.tableHeight = windowHeight - 52 - 40 - 72
    },
    handleSelectClass() {
      this.drawer = true
      this.$nextTick(() => {
        this.calculateTableHeight()
        this.getSchedulePage()
      })
    },
    close() {
      this.drawer = false
    },
    handleRadioChange(row) {
      this.selectedClass = row
      this.selectedRow = row.id
      this.status = row.status
      this.close()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSchedulePage()
    },
    handlePrevClick() {
      this.currentPage--
      this.getSchedulePage()
    },
    handleNextClick() {
      this.currentPage++
      this.getSchedulePage()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getSchedulePage()
    }
  }
}
</script>

<style lang="scss" scoped>
.select-class-panel {
  .select-class-info {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    margin-top: 20px;

    &-item {
      display: flex;
      margin-top: -1px;

      &:first-child {
        margin-top: 0;
        .select-class-info-item-label {
          border-radius: 10px 0 0 0;
        }
        .select-class-info-item-value {
          border-radius: 0 10px 0 0;
        }
      }

      &:last-child {
        .select-class-info-item-label {
          border-radius: 0 0 0 10px;
        }
        .select-class-info-item-value {
          border-radius: 0 0 10px 0;
        }
      }

      &-label {
        width: 120px;
        color: #000000;
        background-color: #fafafa;
        font-size: 14px;
        display: flex;
        align-items: center;
        padding: 10px 15px;
        border: 1px solid #dcdee1;
      }

      &-value {
        padding: 10px 15px;
        display: flex;
        align-items: center;
        flex: 1;
        color: #555555;
        font-size: 14px;
        border: 1px solid #dcdee1;
        margin-left: -1px;
        p {
          margin: 0;
          line-height: 1.5;
        }
      }
    }
  }

  .select-class-table {
    padding: 0 20px;
    height: 100%;

    .status-dot-box {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;

      .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: inline-block;
      }

      .status-dot-success {
        background-color: #00c313;
      }

      .status-dot-danger {
        background-color: #ff0000;
      }
    }

    ::v-deep .el-radio {
      margin-right: 0;
      .el-radio__label {
        display: none;
      }
    }
  }

  .select-class-panel-tip-error {
    color: #ff0000;
    font-size: 12px;
    margin-top: 5px;
  }
}

.ss-material-box-header {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 52px;
  padding: 15px 20px;
  margin-bottom: 20px;
  background: #ffffff;
  border-radius: 10px 10px 0 0;
  border-bottom: 1px solid #f2f2f2;
  color: #353535;
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
  color: #b2b2b2;
  margin-left: auto;
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}

::v-deep {
  .el-table {
    th {
      background: #eff2f6;
      font-weight: 700;
      color: #000000;
    }
  }
  .el-drawer__header {
    padding: 0;
    margin-bottom: 0;
  }
}
</style>
