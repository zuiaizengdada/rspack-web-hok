<template>
  <el-dialog
    title="关联数字人形象"
    :visible.sync="visible"
    width="650px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    append-to-body
  >
    <div class="imgList overflowOuto">
      <div v-for="item in imgList" :key="item.characterId" class="imgcheckbox">
        <div
          :class="
            characterId.includes(item.characterId)
              ? 'imgBox imgActive'
              : 'imgBox'
          "
          :style="{
            backgroundImage: `url(${item.photoUrl})`,
            backgroundColor: item.isUse == 1 ? 'rgba(245, 245, 245, 0.6)' : ''
          }"
          @click="selectImg(item)"
        >
          <img
            v-if="characterId.includes(item.characterId)"
            :src="iconPanel"
            class="iconPanel"
            style="z-index: 999"
          />
          <img v-if="item.isUse == 1" :src="aidisable" class="iconPanel" />
        </div>
        <div class="imgName">{{ item.name }}</div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" :loading="loading" @click="submit">
        确定
      </el-button>
      <el-button size="small" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import iconPanel from '@/assets/svg/panel/aiselect_icon.svg'
import aidisable from '@/assets/svg/panel/aidisable_icon.svg'
import { getCharactersList } from '@/api/aiVideoManage'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imgList: [],
      characterId: [],
      iconPanel,
      aidisable,
      loading: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getlist()
      } else {
        this.characterId = []
      }
    }
  },
  methods: {
    submit() {
      const info = this.imgList.find(
        item => item.characterId === this.characterId[0]
      )
      this.$emit('submit', info)
    },
    // 查询所有的形象
    async getlist() {
      const { data } = await getCharactersList({ pageIndex: 1, pageSize: 12 })
      this.imgList = data.items
    },
    selectImg(item) {
      if (item.isUse === 1) {
        return
      }
      if (!this.characterId.includes(item.characterId)) {
        this.characterId = [item.characterId]
      }
    },
    handleClose() {
      this.$emit('handleClose', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.imgList {
  display: flex;
  flex-wrap: wrap;
  max-height: 520px;
}
.imgcheckbox {
  width: 90px;
  margin-right: 10px;
  position: relative;
  .imgName {
    width: 100%;
    font-size: 14px;
    color: #333333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .open-image {
    width: 90px;
    height: 160px;
    background: #f5f5f5;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    border: 1px dashed transparent;
    cursor: pointer;
  }
}
.imgBox {
  background: #f5f5f5;
  border-radius: 4px;
  width: 90px;
  height: 160px;
  position: relative;
  border: 1px solid transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 4px;
}
.del_ab {
  position: absolute;
  width: 90px;
  height: 24px;
  background: #333333;
  border-radius: 0px 0px 4px 4px;
  opacity: 0.4;
  bottom: 33px;
  text-align: center;
  line-height: 1.8;
  z-index: 999;
  span {
    cursor: pointer;
    color: #ffffff;
  }
}
.imgActive {
  border: 1px solid #0c6fff;
}
.iconPanel {
  position: absolute;
  right: 0;
  top: 0;
  width: 16px !important;
  height: 16px !important;
  font-size: 16px;
  user-select: none;
}
::v-deep .imgBox {
  img {
    width: auto;
    height: 180px;
  }
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #ebeef5;
}
</style>
