<template>
  <div>
    <div>
      <div>仅打开</div>
      <el-button size="small" type="primary" @click="open">打开任务中心</el-button>
    </div>
    <div>
      仅展示:
      <el-upload
        multiple
        class="upload-demo"
        action="#"
        :show-file-list="false"
        :http-request="openTaskCenter"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>

    <div>
      <div>原视频|半成品视频|成品视频 批量选择文件错误需要提交失败请求给后端:</div>
      <el-button size="small" type="primary" @click="errorUpload">点击上传</el-button>
    </div>

    <div>
      测试任务1：火山上传原视频【视频上传,md5校验,上传成功飞书通知，上传失败飞书通知】
      <el-upload
        multiple
        class="upload-demo"
        action="#"
        :show-file-list="false"
        :http-request="openTaskCenter1"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>

    <div>
      测试任务2：火山上传半成品视频|成品视频【视频上传,md5校验,上传成功飞书通知，上传失败飞书通知】
      <el-upload
        multiple
        class="upload-demo"
        action="#"
        :show-file-list="false"
        :http-request="openTaskCenter2"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>

    <div>
      测试任务3：oss上传【图片，音频，视频，文件上传】
      <el-upload
        multiple
        class="upload-demo"
        action="#"
        :show-file-list="false"
        :http-request="openTaskCenter3"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>

    <div>
      传参说明：
      <div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="params" label="参数" />
          <el-table-column prop="explain" label="说明" />
          <el-table-column prop="type" label="类型" />
          <el-table-column prop="pptionalValues" label="可选值" />
          <el-table-column prop="default" label="默认值" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      tableData: [
        {
          params: 'this.$taskCenter.on(name, fn)',
          explain: '监听事件的回调',
          type: '',
          pptionalValues: 'name:successTaks 监听成功的回调; failTaks 监听失败的回调。fn: 回调触发方法。返回参数[arr]。成功的数组',
          default: ''
        },
        {
          params: 'this.$taskCenter.addTask(obj)',
          explain: '添加上传任务',
          type: '',
          pptionalValues: '',
          default: ''
        },
        {
          params: 'obj.file',
          explain: '选择的文件,非必填',
          type: 'object',
          pptionalValues: '',
          default: ''
        },
        {
          params: 'obj.task',
          explain: '上传类型,非必填',
          type: 'string',
          pptionalValues: '1 原视频上传 2 半成品/成品视频上传 3 oss上传 非必填,字符串类型, 为空时仅展示',
          default: ''
        },
        {
          params: 'obj.origin',
          explain: '文件来源,非必填',
          type: 'string',
          pptionalValues: '',
          default: ''
        },
        {
          params: 'obj.originUrl',
          explain: '上传文件页面pathName,非必填',
          type: 'string',
          pptionalValues: '',
          default: ''
        },
        {
          params: 'obj.params',
          explain: '额外传参,非必填',
          type: 'object',
          pptionalValues: '',
          default: ''
        },
        {
          params: 'obj.icon',
          explain: '图标,非必填',
          type: 'string',
          pptionalValues: '图标来源取src/icons/svg的文件名',
          default: 't_video'
        },
        {
          params: 'obj.errorReason',
          explain: '错误原因,非必填',
          type: 'string',
          pptionalValues: '',
          default: ''
        },
        {
          params: 'obj.ossConfig',
          explain: 'oss配置项，oss上传时必传',
          type: 'object',
          pptionalValues: '',
          default: ''
        },
        {
          params: 'ossConfig.ossTeacherFolder',
          explain: 'oss上传指定文件夹',
          type: 'string',
          pptionalValues: '',
          default: ''
        },
        {
          params: 'ossConfig.parallel',
          explain: '设置并发上传的分片数量，非必填',
          type: 'number',
          pptionalValues: '',
          default: '4'
        },
        {
          params: 'ossConfig.partSize',
          explain: '设置分片大小,非必填。',
          type: 'number',
          pptionalValues: '',
          default: '1024 * 1024'
        }
      ]
    }
  },
  mounted() {
    this.$taskCenter.on('successTaks', (msg) => {
      console.log(msg, 'msg')
    })
  },
  methods: {
    open() {
      this.$taskCenter.open()
    },
    // 仅展示
    openTaskCenter(e) {
      this.$taskCenter.addTask({
        // file: { size: '', name: '这是一个错误的文件名' },
        origin: '测试失败',
        originUrl: 'TaskCenterTest',
        errorReason: '文件名错误'
      })
    },
    // 原视频|半成品视频|成品视频 批量选择文件错误需要提交失败请求给后端:
    errorUpload() {
      this.$taskCenter.addTask({
        task: '1',
        file: { size: '', name: '这是一个错误的文件名' },
        origin: '原视频失败',
        originUrl: 'TaskCenterTest',
        errorReason: '文件名错误', // 失败原因
        params: {
          type: 1 // 1 原视频 3 半成品视频 4 成品视频
        }
      })
    },
    // 火山上传原视频
    openTaskCenter1(e) {
      this.$taskCenter.addTask({
        file: e.file, // 文件
        task: '1', // 上传类型
        type: 'file_video',
        origin: '原视频', // 文件来源
        params: { // 额外传参
          originId: '1603654716080832512'
        }
      })
    },
    // 火山上传半成品视频|成品视频
    openTaskCenter2(e) {
      this.$taskCenter.addTask({
        file: e.file, // 文件
        task: '2', // 上传类型
        origin: '原视频', // 文件来源
        params: { // 额外传参
          optional: { teacherId: '' },
          type: 1
        }
      })
    },

    // oss上传
    openTaskCenter3(e) {
      this.$taskCenter.addTask({
        file: e.file, // 文件
        task: '3', // 上传类型
        origin: 'oss上传', // 文件来源
        ossConfig: {
          ossTeacherFolder: 'hok_liuhui/test/'
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
