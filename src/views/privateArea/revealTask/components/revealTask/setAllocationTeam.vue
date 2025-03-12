<template>
  <div class="warpBox">
    <div class="contentBox">
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
        size="mini"
        label-width="120px"
        label-position="top"
      >
        <el-form-item label="订单来源团队：" prop="deptId">
          <el-button
            v-if="!form.deptId"
            type="primary"
            class="reception-replace-btn"
            @click="selectUser"
          >选择部门</el-button>
          <div v-else>
            <el-tag :closable="form.name !=='未知团队'" @close="handleDel">{{ form.name }}</el-tag>
          </div>
        </el-form-item>
        <el-form-item label="订单接量团队：" prop="deptList">
          <el-button
            type="primary"
            class="add"
            @click.native.stop="add"
          >新增部门</el-button>
          <draggable
            :list="form.deptList"
            :move="handleMove"
            v-bind="{
              group: { name: 'options' },
              animation: 200,
              ghostClass: 'ghost',
              handle: '.move-item'
            }"
            handle=".move-item"
            @sort="handleSort"
          >
            <div
              v-for="(item, index) in form.deptList"
              :key="item.id"
              class="dept-item"
            >
              <div class="flex flex-middle">
                <span class="index">{{ index + 1 }}</span>
                <el-tag class="detp-name">{{ item.deptName }}</el-tag>
                <div class="dept-item__content">
                  <span>单轮每人接满数量</span>
                  <el-input-number
                    v-model="form.deptList[index].receptionCount"
                    style="width: 60px; margin-left: 10px"
                    size="mini"
                    :controls="false"
                    :min="1"
                    :max="9999"
                    @change="handleSort"
                  />
                </div>
              </div>
              <div class="flex flex-middle">
                <el-button
                  class="move-item"
                  style="cursor: move"
                  type="text"
                >排序</el-button>
                <el-button
                  type="text"
                  style="color: #f1330d"
                  @click.native.stop="del(item)"
                >删除</el-button>
              </div>
            </div>
          </draggable>
        </el-form-item>
      </el-form>
    </div>
    <div class="btnBox">
      <el-button size="mini" @click="handleStop(1)">上一步</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="handleStop(3)"
      >下一步</el-button>
    </div>
  </div>
</template>
<script>
import {
  receptionPage,
  sourceDeptDel,
  sourceDeptAdd,
  sourceDeptDeptChangeSort,
  orderSourceDeptCheck
} from '@/api/privateArea/revealTask'
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  data() {
    return {
      loading: false,
      deptList: [],
      form: {
        deptId: '',
        name: '',
        deptList: []
      },
      taskId: '',
      deptName: '',
      rules: {
        deptId: [
          {
            required: true,
            message: '请选择订单来源团队',
            trigger: 'change'
          }
        ],
        deptList: [
          {
            required: true,
            message: '请选择订单接量团队',
            type: 'array',
            trigger: 'change'
          }
        ]
      },
      type: 'add'
    }
  },
  methods: {
    init(data, type) {
      this.form = {
        deptId: data.deptId,
        name: data.name,
        deptList: []
      }
      this.type = type
      this.taskId = data.taskId
      this.getList()
    },
    handleMove() {
      return true
    },
    add() {
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [0],
        checkUser: [],
        success: async res => {
          const dept = res.dept[0] ?? {}
          const params = {
            deptId: dept.deptId,
            receptionCount: 1
          }
          if (this.taskId) {
            params.taskId = this.taskId
          }
          const { code, data } = await sourceDeptAdd(params)
          if (code === 1) {
            this.taskId = data
            this.getList()
          }
        }
      })
    },
    async del(item) {
      const { code } = await sourceDeptDel(item.id)
      if (code === 1) {
        this.getList()
      }
    },
    async getList() {
      const { data } = await receptionPage({
        pageIndex: 1,
        pageSize: 999,
        taskId: this.taskId
      })
      this.form.deptList = data.items ?? []
    },
    handleDel() {
      this.form.deptId = ''
      this.form.name = ''
    },
    selectUser() {
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [0],
        checkUser: [],
        success: async res => {
          const dept = res.dept[0] ?? {}
          const { code } = await orderSourceDeptCheck({
            deptId: dept.deptId,
            taskId: this.taskId
          })
          if (code === 1) {
            this.form.deptId = dept.deptId
            this.form.name = dept.name
          }
        }
      })
    },
    handleSort() {
      const batch = this.form.deptList.map((i, index) => {
        return {
          ...i,
          sort: index + 1
        }
      })
      sourceDeptDeptChangeSort({
        batch
      })
    },
    async handleStop(value) {
      if (value === 3) {
        await this.$refs.ruleForm.validate()
      }
      this.handleSort()
      this.$emit('success', {
        step: value,
        taskId: this.taskId,
        name: this.form.name,
        deptId: this.form.deptId
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.warpBox {
  width: 100%;
  height: calc(100vh - 105px);
  // overflow: scroll;
  display: flex;
  flex-direction: column;
  > .contentBox {
    flex: 1;
    padding: 0 20px;
    padding-bottom: 40px;
    overflow: scroll;
    > .headBox {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      margin-top: -20px;
      // margin-bottom: -10px;
      > div:nth-of-type(1) {
        display: flex;
        align-items: center;
        .inputBox {
          width: 200px;
          margin-right: 20px;
        }
        > div:nth-of-type(1) {
          font-size: 14px;
          color: #333333;
          width: 70px;
          line-height: 22px;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
      }
    }
    .enabledBox {
      display: flex;
      align-items: center;
      .textContent {
        margin-left: 10px;
      }
    }
    .detp-name {
      max-width: 400px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cardBox {
      background: #fafafa;
      border-radius: 8px;
      display: flex;
      padding: 12px;
      > div:nth-of-type(1) {
        flex: 1;
        margin-right: 22px;
      }
    }
  }
  > .btnBox {
    display: flex;
    padding: 17px 0;
    padding-right: 20px;
    border-top: 1px solid #e7e7e7;
    justify-content: flex-end;
  }
  .add {
    margin-bottom: 20px;
  }
  .dept-item {
    display: flex;
    align-items: center;
    padding: 0 20px;
    margin-bottom: 10px;
    border-radius: 8px;
    background: #fafafa;
    height: 72px;
    justify-content: space-between;
    .index {
      color: #000000;
      font-size: 16px;
      font-weight: 700;
      line-height: 22px;
      margin-right: 20px;
    }
    .dept-item__btn {
      margin-left: 15px;
    }
    .dept-item__content {
      margin-left: 15px;
    }
  }
}
</style>
