<template>
  <el-dialog
    v-if="visible"
    title="新增附件"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="900px"
    append-to-body
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="附件类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">图片</el-radio>
          <el-radio :label="2">链接</el-radio>
          <el-radio :label="5">视频</el-radio>
          <el-radio :label="6">普通文件</el-radio>
          <template v-if="type === 'wechat' && isWxOff">
            <el-radio :label="3">公众号</el-radio>
            <el-radio v-if="typeTour" :label="4">邀客链接</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.type === 2">
        <el-form-item label="标题" prop="linkTitle">
          <el-input v-model="form.linkTitle" maxlength="64" show-word-limit />
        </el-form-item>
        <el-form-item label="描述" prop="linkDesc">
          <el-input v-model="form.linkDesc" maxlength="256" show-word-limit />
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input v-model="form.link" maxlength="150" show-word-limit />
        </el-form-item>
      </template>
      <el-form-item v-if="[1].includes(form.type)" prop="fileList">
        <upload @change="handleChange" />
      </el-form-item>
      <el-form-item v-if="[5].includes(form.type)" prop="videoUrl">
        <uploadVideo @change="handleChange" />
      </el-form-item>
      <el-form-item v-if="[6].includes(form.type)" prop="videoUrl">
        <fileUpload
          acceptText="仅支持ppt,pptx,doc,docx,xls,xlsx,pdf,zip,rar格式，且不大于20M的文件"
          accept=".ppt,.pptx,.doc,.docx,.xls,.xlsx,.pdf,.zip,.rar"
          @change="handleChange"
          :maxM="20"
          :limit="1"
        />
      </el-form-item>
      <el-form-item v-if="[2].includes(form.type)" prop="fileList">
        <upload @change="handleChange" />
      </el-form-item>
      <template v-if="type === 'wechat'">
        <el-form-item
          v-if="form.type === 3"
          label="公众号"
          prop="weixinOfficialAccountsId"
        >
          <el-select
            v-model="form.weixinOfficialAccountsId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.officialId"
              :label="item.officialName"
              :value="item.officialId"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type === 4" prop="isInviteLessons">
          <span>推送消息时，会根据线索对应跟进人生成对应的邀课链接</span>
          <el-switch
            v-model="form.isInviteLessons"
            active-text="确定欢迎语中带邀课链接"
          />
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        size="mini"
        :loading="loading"
        @click="handleSave"
        >确 定</el-button
      >
      <el-button size="mini" @click="visible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import upload from '@/components/AppTemplate/Upload2OSS'
import fileUpload from '@/components/AppTemplate/Upload2OSS/uploadFile'
import uploadVideo from '@/components/AppTemplate/Upload2OSS/uploadVideo'
import {
  bizOfficialList,
  wechatUploadMedia,
  materialUpload
} from '@/api/privateArea/toolbox'
export default {
  components: {
    upload,
    uploadVideo,
    fileUpload
  },
  props: {
    typeTour: {
      default: true,
      type: Boolean
    },
    isWxOff: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        type: 1,
        fileList: [],
        linkTitle: '',
        videoUrl: '', // 视频链接
        linkDesc: '',
        link: '',
        linkImgUrl: '',
        mediaId: '',
        url: '',
        weixinOfficialAccountsId: '',
        isInviteLessons: false,
        id: null
      },
      rules: {
        linkTitle: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          }
        ],
        linkDesc: [
          {
            required: true,
            message: '请输入描述',
            trigger: 'blur'
          }
        ],
        fileList: [
          {
            required: true,
            type: 'array',
            message: '请上传图片',
            trigger: 'change'
          }
        ],
        link: [
          {
            required: true,
            message: '请输入链接',
            trigger: 'blur'
          }
        ],
        weixinOfficialAccountsId: [
          {
            required: true,
            message: '请选择公众号',
            trigger: 'change'
          }
        ],
        isInviteLessons: [
          {
            required: true,
            message: '请选择是否带邀课链接',
            trigger: 'change'
          }
        ]
      },
      options: [],
      type: ''
    }
  },
  watch: {
    'form.type': {
      handler: function () {
        this.$refs.form && this.$refs.form.clearValidate()
      }
    }
  },
  methods: {
    handleUploadVideo() {
      this.$OSSUpload({
        visible: true,
        success: res => {
          console.log(res, 'res')
          const arr = []
          res.map(v => {
            arr.push({
              url: v.url,
              // 视频宽高值， 单位px
              width: '650',
              controls: 'true'
            })
          })
          // that2.execCommand('insertvideo', arr)
        }
      })
    },
    open(type = 'wechat') {
      this.type = type
      this.init()
      this.visible = true
      this.getOptions()
    },
    init() {
      this.form = {
        type: 1,
        id: null,
        fileList: [],
        linkTitle: '',
        linkDesc: '',
        link: '',
        linkImgUrl: '',
        url: '',
        mediaId: '',
        weixinOfficialAccountsId: '',
        isInviteLessons: false
      }
      this.options = []
    },
    handleChange(fileList) {
      console.log(22222222, fileList)
      this.form.fileList = fileList
    },
    async getOfficialMediaId() {
      const officialId = this.$route.query.id
      const params = {
        officialId,
        url: this.form.fileList[0]?.url
      }
      const { data } = await materialUpload(params)
      this.form.mediaId = data
      console.log(data)
    },
    async getOptions() {
      const { data } = await bizOfficialList()
      this.options = data
    },
    async getMediaId(fileType,key) {
      const { data } = await wechatUploadMedia({
        fileType: fileType,
        [key]: this.form.fileList[0]?.url
      })
      this.form.mediaId = data
    },
    async handleSave() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          setTimeout(() => {
            this.loading = false
          }, 3000)
          if (this.form.fileList.length && this.form.type === 1) {
            if (this.type === 'wechat') {
              await this.getMediaId('image','imageUrl')
            } else {
              await this.getOfficialMediaId()
            }
          }
          if (this.form.fileList.length && this.form.type === 5) {
            if (this.type === 'wechat') {
              await this.getMediaId('video','imageUrl')
            } else {
              await this.getOfficialMediaId()
            }
          }
          if (this.form.fileList.length && this.form.type === 6) {
            if (this.type === 'wechat') {
              await this.getMediaId('file','imageUrl')
            } else {
              await this.getOfficialMediaId()
            }
          }
          const url = this.form.fileList[0]?.url ?? ''
          const params = {}
          if (this.form.type === 1) {
            params.linkImgUrl = url
            params.mediaId = this.form.mediaId
          } else if (this.form.type === 2) {
            params.linkTitle = this.form.linkTitle
            params.linkDesc = this.form.linkDesc
            params.linkImgUrl = url
            params.link = this.form.link
          } else if (this.form.type === 3) {
            params.linkImgUrl = this.form.weixinOfficialAccountsId
          } else if (this.form.type === 5) {
            params.videoUrl = url
            params.name = this.form.fileList[0]?.name
            params.mediaId = this.form.mediaId
          } else if (this.form.type === 6) {
            params.fileUrl = url
            params.name = this.form.fileList[0]?.name
            params.mediaId = this.form.mediaId
          } else {
            params.isInviteLessons = this.form.isInviteLessons
          }
          params.type = this.form.type
          if (this.form.id) {
            params.id = this.form.id
          }
          this.visible = false
          this.loading = false
          this.$emit('save', params)
        }
      })
    }
  }
}
</script>

<style></style>
