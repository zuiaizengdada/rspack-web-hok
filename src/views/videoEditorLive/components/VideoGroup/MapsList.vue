<template>
  <div class="mapslist-container">
    <div class="mapslist-header flex justify-between items-center ">
      <p class="title">贴图</p>
      <div class="relative">
        <el-upload :before-upload="beforeUpload" accept=".jpg,.png,.jpeg" :http-request="uploadOss" action="#" :show-file-list="false">
          <div class="upload-add flex items-center justify-between cursor-pointer">
            <el-image :src="uploadAddIcon" />
            <span>上传贴图</span>
          </div>
        </el-upload>
      </div>
    </div>
    <ul v-loading="mapsListLoading">
      <li v-for="(item,index) in mapsList" :key="item.materialId" draggable="true" @dragstart="updateaDragData(item)">
        <div class="relative image-content">

          <div class="image">
            <div v-if="item.stickerType==='1'">
              <div class="bg " />
              <p style="height:24px">色块</p>
            </div>

            <el-image v-else :src="item.url" class="cursor-move" fit="cover" draggable="true" style="width:100%;height:100%" />
          </div>
          <p v-if="item.operation===1" class="hover-bg">
            <img :src="deleteIcon" class="delete absolute cursor-pointer" @click="handleClickDelete(item)" />
          </p>

          <!-- <img :src="addIcon" class="add absolute  cursor-pointer" @click="updateaDragData(item)"> -->
        </div>
        <p class="flex item-name" style="height:24px">
          <span
            v-show="!item.visibleEditMapsInput"
            class="truncate"
            @dblclick="handeldbClickItemName(index)"
          > {{ item.name || '名称' }}</span>
          <el-input v-show="item.visibleEditMapsInput" :ref="'mapsItemInput'+index" v-model="currentEditMapsItemName" maxlength="20" style="height:100%" size="mini" auto-focus @blur="handleBlurItemName(index)" @keyup.native.enter="handleBlurItemName(index)" />
        </p>
      </li>
    </ul>
  </div>
</template>
<script>
import uploadAddIcon from '../../icons/videoGroup/uploadAddIcon.svg'
import deleteIcon from '../../icons/videoGroup/deleteIcon.svg'
import { uploadImg } from '@/api/file'
import { uploadStickerMateria, listStickerMateria, deleteStickerMateria, editStickerMateria } from '../../api/live'
export default {
  inject: ['updateCurrentDragItemData'],
  data() {
    return {
      uploadAddIcon,
      deleteIcon,
      mapsList: [],
      mapsListLoading: false,
      currentEditMapsItemName: '',
      mapsColorItemData: {
        url: 'https://dev.oss.hokkj.cn/hok_video_live/1703856930629.png',
        name: '色块',
        color: '#fff',
        panelColor: '',
        materialId: 0,
        stickerType: '1'
      }
    }
  },
  mounted() {
    this.getStickerMateriaList()
  },
  methods: {
    // 图片上传校验
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('贴图上传图片只能是 JPG/png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('贴图上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 图片上传
    async uploadOss(e) {
      const formData = new FormData()
      formData.append('file', e.file)
      const fileName = e.file.name
      const res = await uploadImg(formData)
      await uploadStickerMateria({
        name: fileName,
        url: res.data.url
      })
      this.$message.success('贴图上传成功')
      this.getStickerMateriaList()
    },
    async getStickerMateriaList() {
      this.mapsListLoading = true
      const res = await listStickerMateria({
        pageIndex: 1,
        pageSize: 100
      })
      const list = res.data.items
      list.forEach(item => {
        item.stickerType = '2'
        item.visibleEditMapsInput = false
      })
      list.unshift(this.mapsColorItemData)
      this.mapsList = list
      this.mapsListLoading = false
    },
    // 图片删除
    async handleClickDelete(item) {
      await deleteStickerMateria({
        materialId: item.materialId
      })
      this.$message.success('贴图删除成功')
      this.getStickerMateriaList()
    },
    // 图片添加
    updateaDragData(data) {
      const _data = JSON.parse(JSON.stringify(data))
      _data.dragId = Date.now()
      this.updateCurrentDragItemData(_data)
    },
    handeldbClickItemName(index) {
      this.currentEditMapsItemName = ''
      const mapsItem = this.mapsList[index]
      if (index === 0) return
      if (mapsItem.operation !== 1) return
      this.mapsList[index].visibleEditMapsInput = true
      this.$nextTick(() => {
        this.$refs['mapsItemInput' + index][0].focus()
        this.currentEditMapsItemName = this.mapsList[index].name
      })
    },
    async handleBlurItemName(index) {
      const mapsItem = this.mapsList[index]
      if (this.currentEditMapsItemName !== mapsItem.name) {
        await editStickerMateria({
          materialId: mapsItem.materialId,
          name: this.currentEditMapsItemName
        })
        mapsItem.name = this.currentEditMapsItemName
        this.$message.success('贴图名称修改成功')
      }
      mapsItem.visibleEditMapsInput = false
    }

  }

}
</script>
<style lang="scss" scoped>
.mapslist-container{
  .mapslist-header{
      height:40px;
      padding:0 20px;
      border-bottom:1px solid #000;
      color:#DEDEDE;
      font-size:16px;
      width:100%;
      .upload-add{
          width: 102px;
          height: 30px;
          background: #3B3B3B;
          border-radius: 4px;
          border: 1px solid #4D4D4D;
          padding:0 10px;
          font-size:14px;
      }
  }
  ul{
    padding:16px 20px;
    height: calc(100% - 42px);
       overflow: auto;
    li{
      width:110px;
      margin-bottom:14px;
      margin-right:10px;
      display: inline-block;
      .bg{
        background: #fff;
        border-radius: 4px;
        width:100%;
        height:70px;
        margin-bottom:4px;
      }
      .image-content{
        width:100%;
        height:70px;
        border:2px solid #1E1F1E;
        border-radius: 4px;
        overflow: hidden;
         margin-bottom:4px;
         .hover-bg{
          position: absolute;
          top:0;
          left:0;
          width:100%;
          height:100%;
          background: rgba(0,0,0,0.5);
          display: none;
         }
        &:hover{
          .hover-bg{
            display: block;
          }
            border:2px solid #0091FF;
          .delete{
            display:block;
          }
          .add{
            display:block;
          }
        }
        .image{
          width:100%;
          height:100%;

        }
        .delete{
          bottom:4px;
          left:4px;
          display: none;
        }
        .add{
          bottom:4px;
          right:4px;
          display: none;
        }
      }

        .item-name{
          span{
            font-size:12px;
            color:#A6A6A6;
          }
        }

    }
  }
}
::v-deep .el-input--mini .el-input__inner{
  height:20px;
  line-height: 20px;
}
</style>
