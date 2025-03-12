<template>
  <div class="video-sort">
    <div class="title">导出排序</div>
    <div class="video-sort-cnt">
      <draggable
        :list="list"
        tag="div"
        draggable=".draggle"
        class="upload-items"
        v-bind="{
          animation: 500,
          handle: '.draggle'
        }"
      >
        <div v-for="(item, index) in list" :key="index" class="draggle">
          <div class="sort-cell flex">
            <img class="m-l-4" src="@/assets/svg/aiManage/draggle.svg" alt="" />
            <div class="sort-cell-name">
              <el-tooltip
                class="video-name-tooltip"
                effect="dark"
                :content="item.videoName"
                placement="top-start"
              >
                <span class="video-name">{{ item.videoName }}</span>
              </el-tooltip>
              <span class="shrink">
                <template v-if="item.name">
                  {{ item.name }}
                </template>
                <template v-else>
                  片段{{ item.index + 1 }}
                </template>
              </span>
            </div>
            <i class="icon el-icon-close" @click="handleDel(item)" />
          </div>
        </div>
      </draggable>
      <div v-if="list.length === 0" class="noData">
        <img
          src="@/assets/image/video/export_noData.png"
          alt=""
          style="width: 120px; height: 120px"
        />
        <span class="noData-font">请选择视频片段</span>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  props: {
    fileInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      list: []
    }
  },
  computed: {
    listCuttingIds() {
      return this.list.map(item => item.draggableId)
    }
  },
  watch: {
    fileInfo(val, oldVal) {
      const arr = []
      for (const key in val) {
        const item = val[key]
        // draggableId 只有一条数据 并无切片id 使用视频id
        val[key].forEach(el => {
          arr.push({
            ...el,
            videoId: key,
            draggableId:
              item.length === 1 && !item[0].cuttingId ? key : el.cuttingId
          })
        })
      }
      if (this.listCuttingIds.length > arr.length) {
        // 删除
        const deppIds = JSON.parse(JSON.stringify(this.listCuttingIds))
        for (let i = deppIds.length; i >= 0; i--) {
          if (!arr.some(s => s.draggableId === deppIds[i])) {
            this.list.splice(i, 1)
          }
        }
      } else if (this.listCuttingIds.length === arr.length) {
        // 修改名称 替换
        arr.forEach(f => {
          for (let i = 0; i < this.listCuttingIds.length; i++) {
            if (f.draggableId === this.listCuttingIds[i]) {
              this.$set(this.list[i], 'name', f.name)
              break
            }
          }
        })
      } else {
        // 添加
        arr.forEach(f => {
          if (!this.listCuttingIds.includes(f.draggableId)) this.list.push(f)
        })
      }
    }
  },

  methods: {
    fileTransformlist() {
      this.list = this.fileInfo.cutting
    },
    handleDel(item) {
      console.log(item)
      this.$emit('del', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.video-sort {
  width: 335px;
  margin-left: 15px;
  .title {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #dedede;
    line-height: 28px;
    margin-bottom: 16px;
  }
  .video-sort-cnt {
    width: 100%;
    height: 494px;
    overflow-y: auto;
    background: #1e1f1e;
    border: 1px solid #000000;
    padding: 10px 8px 8px 8px;
    .sort-cell {
      width: 100%;
      color: #ffffff;
      height: 32px;
      display: flex;
      align-items: center;
      font-family: 'Microsoft YaHei';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 32px;
      &:hover {
        background: #444;
        border-radius: 4px;
        cursor: pointer;
      }
      .sort-cell-name {
        flex: 1;
        line-height: 32px;
        display: flex;
        overflow-x: hidden;
        .video-name-tooltip {
          display: inline-block;
          flex: 1;
          white-space: nowrap;
          overflow-x: hidden;
          text-overflow: ellipsis;
          line-height: 32px;
        }
      }
      .shirk {
        flex-shrink: 0;
      }
      img {
        height: 18px;
        width: 18px;
        margin: 0 8px;
      }
      .icon {
        display: block;
        font-size: 14px;
        flex-shrink: 0;
        padding: 0 8px;
        margin-top: 1px;
      }
    }
    .noData {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      .noData-font {
        margin-top: 16px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
    }
  }
}
</style>
