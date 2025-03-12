<template>
  <div class="panel">
    <div class="top-panel">
      <panel-type3
        :content="list[0]"
        :select-list="selectList"
        :title="title"
        :sort="1"
        @selectPanel="selectPanel"
      />
      <div class="panel-list1">
        <panel-type2
          :content="list[5]"
          style="margin-bottom: 16px;"
          :select-list="selectList"
          :title="title"
          :sort="6"
          :flag="true"
          @selectPanel="selectPanel"
        />
        <panel-type2
          :content="list[2]"
          :select-list="selectList"
          :title="title"
          :sort="3"
          @selectPanel="selectPanel"
        />
      </div>
      <div class="panel-list1">
        <panel-type2
          :content="list[6]"
          style="margin-bottom: 16px;"
          :select-list="selectList"
          :sort="7"
          :title="title"
          :flag="true"
          @selectPanel="selectPanel"
        />
        <panel-type2
          :content="list[7]"
          :select-list="selectList"
          :title="title"
          :sort="8"
          @selectPanel="selectPanel"
        />
      </div>
    </div>
  </div>
</template>

<script>
import panelType3 from './panelType3'
import panelType2 from './panelType2'
export default {
  name: 'DataPanel',
  components: {
    panelType2,
    panelType3
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectList: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: '较昨日'
    }
  },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {
    selectPanel(val) {
      this.$emit('selectPanel', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel{
  width: 100%;
  margin-top: 25px;
  .top-panel,.bottom-panel{
    display: flex;
    align-items: center;
    justify-content: space-between;
    >div{
      flex: 1;
    }
  }
  .bottom-panel{
    margin-top: 16px;
  }
  .panel-list1,.panel-list2{
    margin-left: 16px;

  }
}
</style>
