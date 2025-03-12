import clipboard from '@/directive/clipboard/index.js'
import router from '@/router'
import { mapActions } from 'vuex'
export default {
  data: () => ({
    config: {
      type: 'recommend',
      visible: false,
      okText: '确认',
      closeText: '取消',
      title: '提示',
      content: ''
    }
  }),
  directives: {
    clipboard
  },
  methods: {
    ...mapActions('user', ['setSingleHistory']),
    goDetail(row, type) {
      const { goodsType } = row
      if (type === 'order') {
        this.setSingleHistory('/business/orderManage/list')
        router.push({
          path: `/business/orderManage/orderDetail/${row.orderNo}/${row.examineStatus || 0}/全部订单`
        })
        return
      }
      if (type === 'user') {
        this.setSingleHistory('/messageManager/member')
        router.push({
          path: `/messageManager/member/memberDetail/${row.userId}`
        })
        return
      }
      if (type === 'goods') {
        // 视频
        if (goodsType === 2) {
          this.setSingleHistory('/shop/video')
          router.push({
            path: `/shop/video/videoDetail/${row.goodsId}`
          })
          return
        }
        // 音频
        if (goodsType === 1) {
          this.setSingleHistory('/shop/audio')
          router.push({
            path: `/shop/audio/audioDetail/${row.goodsId}`
          })
          return
        }
        // 图文
        if (goodsType === 0) {
          this.setSingleHistory('/shop/image')
          router.push({
            path: `/shop/image/imageDetail/${row.goodsId}`
          })
          return
        }
        // 专栏
        if (goodsType === 3) {
          this.setSingleHistory('/shop/packageColumn')
          router.push({
            path: `/shop/packageColumn/columnDetail/${row.goodsId}`
          })
          return
        }
        // 大专栏
        if (goodsType === 4) {
          this.setSingleHistory('/shop/packageCollegeColumn')
          router.push({
            path: `/shop/packageCollegeColumn/collegeColumnDetail/${row.goodsId}`
          })
          return
        }
        // 线下课
        if (goodsType === 5) {
          this.setSingleHistory('/shop/offline')
          router.push({
            path: `/shop/offline/offlineDetail/${row.goodsId}`
          })
          return
        }
        // 套餐课
        if (goodsType === 8) {
          this.setSingleHistory('/shop/liveCourse')
          router.push({
            path: `/shop/liveCourse/detail/${row.goodsId}`
          })
          return
        }
        // 套餐课
        if (goodsType === 7) {
          this.setSingleHistory('/shop/package')
          router.push({
            path: `/shop/package/detail/${row.goodsId}`
          })
          return
        }
      }
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    handleOk() {
      this.$refs.table.onRefresh()
      this.$refs.table.toggleSelection()
      this.multipleSelection = []
    },
    handleClick(type) {
      if (type === 'recommend') {
        const num =
          this.multipleSelection.filter(item => item.level !== 1)?.length || 0
        this.config = {
          type: 'recommend',
          visible: true,
          okText: '确认设置为推荐',
          closeText: '取消',
          title: `确定将选择的${this.multipleSelection.length}项全部设置为推荐吗?`,
          content: num
            ? `选择的${num}项为中评，差评，不能设置为推荐，将自动忽略处理`
            : ''
        }
        return
      }
      if (type === 'stopRecommend') {
        const num =
          this.multipleSelection.filter(item => !item.isRecommend)?.length || 0
        this.config = {
          type: 'stopRecommend',
          visible: true,
          okText: '确认取消推荐',
          closeText: '取消',
          title: `确定将选择的${this.multipleSelection.length}项全部取消推荐吗?`,
          content: num ? `选择的${num}项为非推荐项，将自动忽略处理` : ''
        }
        return
      }
      if (type === 'process') {
        const num =
          this.multipleSelection.filter(item => item.level === 3)?.length || 0
        this.config = {
          type: 'process',
          visible: true,
          okText: '确定审核通过',
          closeText: '取消',
          title: `确定将选择的${this.multipleSelection.length}项全部审核通过吗?`,
          content: num
            ? `选择的${num}项为差评，不能审核通过，将自动忽略处理`
            : ''
        }
        return
      }
      if (type === 'stopProcess') {
        console.log(this.multipleSelection)
        const num =
          this.multipleSelection.filter(item => item.auditorState === 2)
            .length || 0
        const numno =
          this.multipleSelection.filter(item => item.auditorState === 3)
            .length || 0
        this.config = {
          type: 'stopProcess',
          visible: true,
          okText: '确定审核不通过',
          closeText: '取消',
          title: `确定将选择的${this.multipleSelection.length}项全部审核不通过?`,
          content: (num || numno) ? `选择的${num}项为审核通过和${numno}项审核不通过的内容，将自动忽略处理` : ''
        }
        return
      }
    }
  }
}

