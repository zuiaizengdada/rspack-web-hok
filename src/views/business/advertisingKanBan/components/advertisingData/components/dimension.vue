<template>
  <div id="dimension" :class="{ warpper: true, 'selected-warpper': isFocus }">
    <el-popover
      v-model="isFocus"
      placement="bottom-start"
      popper-class="dimension-popover"
    >
      <div class="popover-d">
        <el-form label-width="90px">
          <el-form-item label="投放平台">
            <el-select
              v-model="form.platformId"
              class="select"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in launchPlatformOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="投放部门">
            <el-cascader
              ref="depCascader"
              v-model="form.deptId"
              clearable
              :options="depts"
              :props="{
                checkStrictly: true,
                label: 'label',
                value: 'id',
                emitPath: false
              }"
              :show-all-levels="false"
              @change="deptChange"
            />
          </el-form-item>
          <el-form-item label="投放账号">
            <el-input
              v-model.trim="form.advertiserId"
              placeholder="请输入投放账号"
              clearable
            />
          </el-form-item>
          <el-form-item label="投手">
            <el-select
              v-model="form.userId"
              class="select"
              placeholder="请选择投手"
              filterable
              :filter-method="getUserByName"
              clearable
              @change="userChange"
              @clear="clearUser"
            >
              <el-option
                v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="广告计划ID">
            <el-input
              v-model.trim="form.adId"
              placeholder="请输入广告计划ID"
              :maxlength="30"
              clearable
            />
          </el-form-item>
          <el-form-item label="广告创意ID">
            <el-input
              v-model.trim="form.creativeId"
              placeholder="请输入广告创意ID"
              :maxlength="30"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>

      <div slot="reference" class="reference">
        <img
          class="target"
          src="@/assets/image/advertisingKanBan/dimension.png"
          alt=""
        >
        <span class="label">维度</span>
        <div v-if="form.platformId" class="content">
          投放平台：{{
            launchPlatformOption.find(f => f.value === form.platformId).label
          }}
          <i
            class="el-icon-close"
            style="color: #3c8bff"
            @click.stop="clear('platformId')"
          />
        </div>
        <div v-if="form.deptId" class="content">
          投放部门：{{ deptName }}
          <i
            class="el-icon-close"
            style="color: #3c8bff"
            @click.stop="clear('deptId')"
          />
        </div>
        <div v-if="form.advertiserId" class="content">
          投放账号：{{ form.advertiserId }}
          <i
            class="el-icon-close"
            style="color: #3c8bff"
            @click.stop="clear('advertiserId')"
          />
        </div>
        <div v-if="form.userId" class="content">
          投手：{{ userName }}
          <i
            class="el-icon-close"
            style="color: #3c8bff"
            @click.stop="clear('userId')"
          />
        </div>
        <div v-if="form.adId" class="content">
          广告计划ID：{{ form.adId }}
          <i
            class="el-icon-close"
            style="color: #3c8bff"
            @click.stop="clear('adId')"
          />
        </div>
        <div v-if="form.creativeId" class="content">
          广告创意ID：{{ form.creativeId }}
          <i
            class="el-icon-close"
            style="color: #3c8bff"
            @click.stop="clear('creativeId')"
          />
        </div>

        <div
          v-if="
            !form.platformId &&
              !form.deptId &&
              !form.advertiserId &&
              !form.userId &&
              !form.adId &&
              !form.creativeId
          "
          class="content-p"
        >
          请选择
        </div>
        <img
          class="down"
          src="@/assets/image/advertisingKanBan/icon_xiala.png"
          alt=""
        >
      </div>
    </el-popover>
  </div>
</template>
<script>
import {
  getPlatformDropdown,
  getUserByName,
  getDeptList
} from '@/api/advertisingKanBan'
export default {
  name: 'Target',
  data() {
    return {
      launchPlatformOption: [],
      userList: [],
      depts: [],
      isFocus: false,
      radio: '1',
      form: {},
      deptName: '',
      userName: ''
    }
  },
  watch: {
    'form.advertiserId': {
      handler(val) {
        if (val && !/^[A-Za-z0-9]+$/g.test(val)) {
          this.$set(this.form, 'advertiserId', undefined)
        }
      },
      deep: true,
      immediate: true
    },
    'form.adId': {
      handler(val) {
        if (val && !/^[A-Za-z0-9]+$/g.test(val)) {
          this.$set(this.form, 'adId', undefined)
        }
      },
      deep: true,
      immediate: true
    },
    'form.creativeId': {
      handler(val) {
        if (val && !/^[A-Za-z0-9]+$/g.test(val)) {
          this.$set(this.form, 'creativeId', undefined)
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    document.addEventListener('click', this.addClick)
    this.getPlatformDropdown()
    this.getUserByName()
    this.getDeptList()
  },
  beforeDestroy() {
    document.removeEventListener('click', this.addClick)
  },
  methods: {
    deptChange() {
      setTimeout(() => {
        this.deptName = this.$refs.depCascader.inputValue
      }, 100)
    },
    userChange(val) {
      this.userName = this.userList.find(f => f.value === val).label
      this.userList = []
    },
    clearUser() {
      this.form.userId = undefined
    },
    async getDeptList() {
      const res = await getDeptList()
      if (res.code === 1) {
        this.depts = res.data
      }
    },
    async getUserByName(val) {
      const res = await getUserByName({ userName: val || undefined })
      if (res.code === 1) {
        this.userList = res.data.map(m => ({
          label: m.nickName,
          value: m.userId
        }))
      }
    },
    async getPlatformDropdown() {
      const res = await getPlatformDropdown()
      if (res.code === 1) {
        this.launchPlatformOption = res.data.items.map(m => ({
          label: m.platformName,
          value: m.platformId
        }))
      }
    },
    addClick(e) {
      if (!e) {
        return
      }
      const isM = document.getElementById('dimension').contains(e.target)
      this.isFocus = isM
    },
    reset() {
      this.isFocus = false
      this.form = {}
    },
    clear(key) {
      this.isFocus = false
      this.form[key] = undefined
      this.$emit('onSearch')
    }
  }
}
</script>
<style lang="scss" scoped>
.warpper {
  position: relative;
  .reference {
    min-width: 234px;
    height: 36px;
    position: relative;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #d8dce6;
    display: flex;
    align-items: center;
    padding: 10px 20px 10px 8px;
  }

  .selected-warpper {
    border-color: #0c6fff;
  }
  .label {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
    margin-right: 8px;
  }
  .target {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
  .down {
    width: 12px;
    height: 12px;
    position: absolute;
    right: 8px;
  }
  .content {
    max-width: 150px;
    padding: 2px 8px;
    background: #e7f0ff;
    border-radius: 4px;
    border: 1px solid #dae9ff;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0c6fff;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 8px;
    i {
      &:hover {
        cursor: pointer;
      }
    }
  }
  .content-p {
    padding: 2px 8px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
  }
}
::v-deep {
  .select {
    div input {
      height: 32px;
    }
  }
  .el-form-item__label {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
}
</style>
<style lang="scss">
.dimension-popover {
  width: 290px;
  max-height: 382px;
  background: #ffffff;
  box-shadow: 0px 4px 12px 0px rgba(22, 22, 22, 0.25);
  padding-bottom: 15px;
  .popper__arrow {
    left: 12% !important;
  }
  .popover-d {
    .popover-radio {
      margin-top: 10px;
    }
  }
}
</style>
