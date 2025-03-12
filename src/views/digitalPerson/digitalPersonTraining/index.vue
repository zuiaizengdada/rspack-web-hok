<template>
  <div class="digitalPersonTraining-wrapper">
    <el-row class="tabs" type="flex">
      <div
        v-if="
          imageTrainingPerms.children && imageTrainingPerms.children.length > 0
        "
        class="tabs-item"
        :class="activeTabName === 'ImageTraining' ? 'active' : ''"
        @click="activeTabName = 'ImageTraining'"
      >
        形象训练
      </div>

      <div
        v-if="
          voiceTrainingPerms.children && voiceTrainingPerms.children.length > 0
        "
        class="tabs-item"
        :class="activeTabName === 'VoiceTraining' ? 'active' : ''"
        @click="activeTabName = 'VoiceTraining'"
      >
        声音训练
      </div>
    </el-row>

    <div class="change-type">
      <div
        v-if="mapIsMDA(1)"
        :class="{ 'row-div': true, active: 1 === type }"
        @click="changeType(1)"
      >
        我的
      </div>
      <div
        v-if="mapIsMDA(2)"
        :class="{ 'row-div': true, active: 2 === type }"
        @click="changeType(2)"
      >
        部门的
      </div>
      <div
        v-if="mapIsMDA(3)"
        :class="{ 'row-div': true, active: 3 === type }"
        @click="changeType(3)"
      >
        全部的
      </div>
    </div>
    <div
      style="
        width: 100%;
        height: 1px;
        background-color: #d9d9d94d;
        margin-top: 20px;
      "
    />

    <component :is="activeTabName" ref="activeTabRef" :perms-list="permsList" />
  </div>
</template>

<script>
import ImageTraining from './components/ImageTraining/index.vue'
import VoiceTraining from './components/VoiceTraining/index.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    ImageTraining,
    VoiceTraining
  },
  data() {
    return {
      activeTabName: undefined,
      permsList: [],
      types: [
        {
          name: '我的',
          active: 1
        },
        {
          name: '部门的',
          active: 2
        },
        {
          name: '全部的',
          active: 3
        }
      ],
      type: 1,
      imageTrainingPerms: [],
      voiceTrainingPerms: []
    }
  },
  computed: {
    ...mapGetters(['permission_routes'])
  },
  watch: {
    activeTabName() {
      this.getPermsList(true)
      this.$nextTick(() => {
        this.$refs.activeTabRef.searchForm.formData.type = 1
      })
    }
  },
  created() {
    this.mapPerms()
  },
  methods: {
    getPermsList(isType = false) {
      const ls =
        this.activeTabName === 'ImageTraining'
          ? this.imageTrainingPerms
          : this.voiceTrainingPerms
      if (isType) {
        this.type = this.mapIsMDA(1) ? 1 : this.mapIsMDA(2) ? 2 : 3
      }
      const permskey =
        this.type === 1 ? 'MyData' : this.type === 2 ? 'DeptData' : 'AllData'
      this.permsList =
        ls?.children.find(item => item.path === permskey)?.meta.permsList || []
      return this.permsList
    },
    // 判断拥有我的-部门-全部的权限
    mapIsMDA(type) {
      const ps =
        this.activeTabName === 'ImageTraining'
          ? this.imageTrainingPerms
          : this.voiceTrainingPerms
      const mdas = ps.children || []
      if (mdas.length > 0) {
        if (type === 1 && mdas.filter(item => item.path === 'MyData').length) {
          return true
        }
        if (
          type === 2 &&
          mdas.filter(item => item.path === 'DeptData').length
        ) {
          return true
        }
        if (type === 3 && mdas.filter(item => item.path === 'AllData').length) {
          return true
        }
        return false
      }
      return false
    },
    mapPerms() {
      this.permission_routes?.forEach(i => {
        if (i.path === '/digitalPerson') {
          i.children &&
            i.children?.forEach(j => {
              if (j.path === 'digitalPersonTraining') {
                const k1 = j.children.find(
                  item => item.path === 'digitalPersonImageTraining'
                )
                const k2 = j.children.find(
                  item => item.path === 'digitalPersonVoiceTraining'
                )
                if (k1 && k1.children && k1.children.length > 0) {
                  this.imageTrainingPerms = k1
                  this.activeTabName = 'ImageTraining'
                  this.type = this.mapIsMDA(1) ? 1 : this.mapIsMDA(2) ? 2 : 3
                  if (k1.children && k1.children.length > 0) {
                    this.getPermsList()
                  }
                }
                if (k2 && k2.children && k2.children.length > 0) {
                  this.voiceTrainingPerms = k2
                  if (!this.activeTabName) {
                    this.activeTabName = 'VoiceTraining'
                    this.type = this.mapIsMDA(1) ? 1 : this.mapIsMDA(2) ? 2 : 3
                  }
                  if (this.activeTabName === 'VoiceTraining') {
                    this.getPermsList()
                  }
                }
              }
            })
        }
      })
    },
    changeType(val) {
      this.type = val
      this.getPermsList()
      this.$refs.activeTabRef.typeSearchFn(val)
    }
  }
}
</script>

<style scoped lang="scss">
.digitalPersonTraining-wrapper {
  position: relative;
  width: 100%;
  border-radius: 10px;
  background-color: #fff;
  padding: 20px 20px 0;
  .change-type {
    display: flex;
    align-items: center;
    max-width: 230px;
    padding: 3px;
    height: 32px;
    border-radius: 4px;
    background: #f0f0f0;
    cursor: pointer;
    user-select: none;
    margin-top: 20px;
    .row-div {
      /* width: 50%; */
      text-align: center;
      color: #000;
      font-size: 14px !important;
      width: 130px;
    }
    .active {
      padding-top: 2px;
      height: 26px;
      border-radius: 4px;
      color: #0c6fff;
      background: #fff;
    }
  }
  .tabs {
    margin: 0;
    gap: 10px;

    .tabs-item {
      padding: 10px 32px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      background: #f7f7f7;
      font-weight: 600;
      cursor: pointer;
    }

    .active {
      background: linear-gradient(90deg, #cee2ff 0%, #bcc9ff 100%);
    }
  }
}
</style>
