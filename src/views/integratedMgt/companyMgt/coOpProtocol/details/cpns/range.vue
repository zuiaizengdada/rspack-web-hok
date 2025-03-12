<template>
  <div class="detail-range">
    <template v-for="item in rangeList">
      <div :key="item.code" class="range-item">
        <div class="flex flex-middle">
          <div class="title mr12">{{ item.name }}</div>
          <div class="content flex flex-middle">
            <span class="check-icon" />
            <span class="black-txt">开启</span>
          </div>
        </div>
        <div
          v-for="itemChildren in item.children"
          :key="itemChildren.code"
          class="flex flex-align-start"
        >
          <div class="flex flex-middle shrink">
            <span class="check-icon" />
            <div class="black-txt">{{ itemChildren.name }}</div>
          </div>
          <div>
            <div
              v-for="itemChild in itemChildren.children"
              :key="itemChild.code"
              class="ml58 flex shrink"
            >
              <div class="title mr12 shirk shrink">
                合作范围-{{ itemChild.name }}
              </div>
              <div class="content">
                <template v-if="itemChild.isAll">
                  <span class="black-txt txt-item shrink">{{
                    itemChild.allTxt
                  }}</span>
                </template>
                <template v-else>
                  <span
                    v-for="txtItem in itemChild.childrenValue"
                    :key="txtItem.code"
                    class="txt-item black-txt"
                  >
                    {{ txtItem | splitChildrenFt }}
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  filters: {
    splitChildrenFt(str = '') {
      const arr = str.split('-')
      arr.shift()
      return arr.join('-') || '--'
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      rangeList: []
    }
  },
  mounted() {
    this.transferList(this.list)
  },
  methods: {
    transferList(arr) {
      const codeObj = {}
      for (const item of arr) {
        if (codeObj[item.coopScope]) {
          // 有值
          codeObj[item.coopScope].children.push({
            name: item.coopContentName,
            code: item.coopContent,
            children: [
              {
                name: item.childrenScopeName,
                code: item.childrenScope,
                isAll: item.isAll,
                childrenValue: JSON.parse(item.specifyContent),
                allTxt:
                  item.coopScope === 'coop_content' ? '所有IP' : '所有达人'
              }
            ]
          })
        } else {
          codeObj[item.coopScope] = {
            name: item.coopScopeName,
            code: item.coopScope,
            children: [
              {
                name: item.coopContentName,
                code: item.coopContent,
                children: [
                  {
                    name: item.childrenScopeName,
                    code: item.childrenScope,
                    isAll: item.isAll,
                    childrenValue: JSON.parse(item.specifyContent),
                    allTxt:
                      item.coopScope === 'coop_content' ? '所有IP' : '所有达人'
                  }
                ]
              }
            ]
          }
        }
      }
      const newArr = []
      for (const key in codeObj) {
        newArr.push(codeObj[key])
      }
      console.log('codeObj---', newArr)
      this.rangeList = newArr
    }
  }
}
</script>

<style lang="scss" scoped>
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
    background: #fff6f2;
  }
  &:nth-child(odd) {
    background: #f2f7ff;
  }
  .check-icon {
    display: inline-block;
    height: 20px;
    width: 20px;
    background: url('~@/assets/image/coOpProtocol/check_details.png') no-repeat;
    background-size: 100%;
    margin-right: 8px;
  }
  .title {
    color: #333333;
    font-size: 14px;
    font-weight: 400;
  }
  .black-txt {
    color: #131523;
    font-size: 14px;
    font-weight: 400;
  }
  .flex-align-start {
    align-items: flex-start;
  }
  .txt-item {
    display: inline-block;
    width: auto;
    padding: 0 18px;
    height: 32px;
    border-radius: 4px;
    opacity: 1;
    background: #e7f0ff;
    color: #333333;
    font-size: 14px;
    font-weight: 400;
    line-height: 32px;
    margin-bottom: 6px;
    margin-right: 6px;
  }
  .shrink {
    flex-shrink: 0;
  }
  .mr12 {
    margin-right: 12px;
  }
  .ml58 {
    margin-left: 58px;
  }
  .mb24 {
    margin-bottom: 24px;
  }
}
</style>
