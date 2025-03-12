<template>
  <div class="range-cnt" :loading="rangeLoading">
    <div
      v-for="(item1, index1) in cpOrgList"
      :key="item1.code"
      class="range-item"
    >
      <div class="range-item-tlt">
        <span class="txt mr12">{{ item1.name }}</span>
        <el-checkbox v-model="item1.checked">开启</el-checkbox>
      </div>
      <template v-if="item1.checked && item1.children.length">
        <div class="range-item-list flex flex-middle">
          <template v-for="(item2, index2) in item1.children">
            <div :key="item2.code" class="mr38">
              <el-checkbox
                v-model="item2.checked"
                @change="value => item2Click(index1, index2, value)"
              />
              <span
                :class="[
                  'txt',
                  'ml8',
                  'pointer',
                  index2 === item1.curIndex ? 'coopActive' : ''
                ]"
                @click="item2Click(index1, index2)"
              >
                {{ item2.name }}
              </span>
            </div>
          </template>
        </div>
      </template>
      <div
        v-if="item1.checked && item1.curIndex !== -1"
        :key="index1"
        class="flex three-box"
      >
        <!-- IP -->
        <template v-if="item1.code === 'coop_content'" }}>
          <el-radio-group v-model="item1.isAll" class="radio-box shrink">
            <el-radio :label="true">
              <span>所有IP</span>
            </el-radio>
            <el-radio :label="false">
              <span>指定IP</span>
            </el-radio>
          </el-radio-group>
          <template v-if="item1.isAll === false">
            <el-select
              ref="ipRef"
              v-model="item1.childrenValue"
              clearable
              multiple
              filterable
              :placeholder="`请选择IP`"
              @onkey.enter="function () {}"
              @focus="function () {}"
            >
              <el-option
                v-for="ipItem in IpInfo.options"
                :key="ipItem.value"
                :label="ipItem.label"
                :value="`${ipItem.value}-${ipItem.label}`"
              />
            </el-select>
          </template>
        </template>
        <!-- 达人 -->
        <template v-else-if="item1.code === 'coop_intelligent'">
          <el-radio-group v-model="item1.isAll" class="radio-box shrink">
            <el-radio :label="true">
              <span>所有达人</span>
            </el-radio>
            <el-radio :label="false">
              <span>指定达人</span>
            </el-radio>
          </el-radio-group>
          <template v-if="item1.isAll === false">
            <el-select
              ref="inteligentSelRef"
              v-model="item1.childrenValue"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="expertManMethod"
              :loading="expertManLoading"
            >
              <el-option
                v-for="item in expertManOptions"
                :key="item.expertId"
                :label="trfExpertLable(item)"
                :value="`${item.expertId}-${trfExpertLable(item)}`"
              />
            </el-select>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
// import { agreementCoopScopeTreeApi } from '@/api/coOpProtocol'
import { listExpertManByName } from '@/api/order/performanceShare.js'
import { searchExpertChannelEnums } from '@/api/order/performanceShare'
import { loadUserData } from '@/utils/videoMange'
import { rangeCheckList } from '../../data.js'
export default {
  data() {
    return {
      rangeLoading: false,
      cpOrgList: [],
      IpInfo: {
        value: null,
        options: []
      },
      expertManLoading: false,
      expertManOptions: [],
      liveChannel: [] // 渠道来源
    }
  },
  async created() {
    this.loadTeacherData()
    await this.getLiveChannel()
  },
  async mounted() {
    this.cpOrgList = JSON.parse(JSON.stringify(rangeCheckList))
  },
  methods: {
    async getLiveChannel() {
      const res = await searchExpertChannelEnums()
      this.liveChannel = res.data
    },
    trfExpertLable(item) {
      const curLive = this.liveChannel.find(i => i.code === item.expertChannel)
      if (curLive) {
        return `${curLive.message}：${item.expertName}`
      } else {
        return item.expertName
      }
    },
    async loadTeacherData() {
      const { tearchArray } = await loadUserData('finishedProductUse', 1)
      this.IpInfo.options = tearchArray[1].options
    },
    item2Click(index1, index2, value = true) {
      const { curIndex, isAll, childrenValue } = this.cpOrgList[index1]
      if (curIndex === index2 && value) return
      // 切换走先设置已勾选的第三层的值
      if (curIndex !== -1 && curIndex !== index2) {
        this.$set(
          this.cpOrgList[index1].children[curIndex].children[0],
          'isAll',
          isAll || false
        )
        this.$set(
          this.cpOrgList[index1].children[curIndex].children[0],
          'childrenValue',
          childrenValue || []
        )
      }
      // 切换后 设置最新的值
      this.$set(
        this.cpOrgList[index1],
        'curIndex',
        value === false ? -1 : index2
      )
      this.$set(
        this.cpOrgList[index1],
        'isAll',
        this.cpOrgList[index1].children[index2].children[0].isAll || false
      )
      this.$set(
        this.cpOrgList[index1],
        'childrenValue',
        this.cpOrgList[index1].children[index2].children[0].childrenValue || []
      )
    },
    async expertManMethod(query) {
      if (query !== '') {
        this.expertManLoading = true
        try {
          const { data } = await listExpertManByName(query)
          this.expertManOptions = data
        } catch (error) {
          console.log('error----listExpertManByName', error)
        }
        this.expertManLoading = false
      } else {
        this.expertManOptions = []
      }
    },
    // 将自定义的值转换为 接口所需的数据格式
    getRange() {
      const result = []
      const arr = JSON.parse(JSON.stringify(this.cpOrgList))
      console.log('arr------', arr)
      for (const item of arr) {
        if (!item.checked) continue
        for (let j = 0; j < item.children.length; j++) {
          const child = item.children[j]
          if (!child.checked) continue
          for (let index = 0; index < child.children.length; index++) {
            const children = child.children[index]
            if (item.curIndex === j) {
              if (item.isAll || item.childrenValue.length) {
                result.push({
                  childrenScope: children.code,
                  coopContent: child.code,
                  coopScope: item.code,
                  isAll: item.isAll ? 1 : 0,
                  specifyContent: JSON.stringify(item.childrenValue)
                })
              }
            } else {
              if (children.isAll || children.childrenValue.length) {
                result.push({
                  childrenScope: children.code,
                  coopContent: child.code,
                  coopScope: item.code,
                  isAll: children.isAll ? 1 : 0,
                  specifyContent: JSON.stringify(children.childrenValue)
                })
              }
            }
          }
        }
      }
      return result
    },
    // 将接口所需数据格式 转换到自定义的值
    async setRange(coopScopeList) {
      this.rangeLoading = true
      await this.tfrCoopScope(coopScopeList)
      this.rangeLoading = false
    },
    async tfrCoopScope(coopScopeList) {
      for (const coopScopeitem of coopScopeList) {
        for (const item of this.cpOrgList) {
          if (item.code === coopScopeitem.coopScope) {
            for (
              let childIndex = 0;
              childIndex < item.children.length;
              childIndex++
            ) {
              const item1 = item.children[childIndex]
              if (item1.code === coopScopeitem.coopContent) {
                for (let index = 0; index < item1.children.length; index++) {
                  item1.checked = true
                  const item2 = item1.children[index]
                  if (item2.code === coopScopeitem.childrenScope) {
                    item.checked = true
                    item.curIndex = childIndex
                    item.isAll = !!coopScopeitem.isAll
                    if (!item.isAll) {
                      const option = []
                      const arr = JSON.parse(coopScopeitem.specifyContent).map(
                        m => {
                          const csArr = m.split('-')
                          if (item2.code === 'inteligent_account') {
                            // 达人
                            const expert = csArr[1].split('：')
                            const cur = this.liveChannel.find(
                              f => f.message === expert[0]
                            )
                            option.push({
                              expertId: csArr[0],
                              expertName: expert[1],
                              expertChannel: cur.code
                            })
                          }
                          return m
                        }
                      )
                      item.childrenValue = arr
                      item1.children[index].childrenValue = arr
                      if (item2.code === 'inteligent_account') {
                        this.expertManOptions = option
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      console.log('cpOrgList-----', this.cpOrgList)
    }
  }
}
</script>

<style lang="scss" scoped>
.mr38 {
  margin-right: 38px;
}
.shrink {
  flex-shrink: 0;
}
.radio-box {
  padding: 10px 10px 10px 0;
}

.range-item {
  width: 100%;
  height: auto;
  padding: 8px 11px;
  border-radius: 4px;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  &:nth-child(even) {
    background: #f2f7ff;
  }
  &:nth-child(odd) {
    background: #fff6f2;
  }
  .txt {
    color: #333333;
    font-size: 14px;
    font-weight: 400;
    display: inline-block;
  }
  .pointer {
    cursor: pointer;
  }
  .mr12 {
    margin-right: 12px;
  }
  .ml8 {
    margin-left: 8px;
  }
  .coopActive {
    color: #0c6fff;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%);
      width: 0;
      height: 0;
      border: 6px solid #fff;
      border-color: transparent transparent #fff transparent;
    }
  }
  .three-box {
    background: #ffff;
    padding: 5px 14px;
    border-radius: 4px;
    box-shadow: 0 -2px 10px 0 rgba(0, 0, 0, 0.05);
  }
  /* ::v-deep .el-checkbox {
    display: inline-flex;
  } */
}
</style>
