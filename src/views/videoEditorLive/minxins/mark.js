
import OSS from 'ali-oss'
import { getOssToken } from '@/api/qiniu'
import { toBlob } from 'dom-to-image'
import { formatPrTime } from '../utils'
export const mixinMark = {
  methods: {
    async getVideoFrameImage(startTime) {
      let pictureUrl
      const node = this.getImageItemNode(startTime)
      if (node) {
        const blob = await toBlob(node)
        const file = new File([blob], 'file', {
          type: blob.type,
          lastModified: Date.now()
        })
        const { data } = await getOssToken()
        const fileName = 'hok_video/' + new Date().getTime() + '.png'
        const oss = new OSS({
          region: 'oss-accelerate',
          accessKeyId: data.accessKeyId,
          accessKeySecret: data.accessKeySecret,
          bucket: data.ossBucket,
          secure: true
        })
        await oss.multipartUpload(fileName, file, {})
        pictureUrl = `${data.ossBucketUrl}${fileName}`
        console.log(pictureUrl, 44444)
      }
      // return pictureUrl
    },
    getImageItemNode(startTime) {
      const time = formatPrTime(startTime)
      const nodes = document.querySelectorAll('.frame-item')
      const firstItemIndex = Number(nodes[0].getAttribute('index'))
      const secondItemIndex = Number(nodes[1].getAttribute('index'))
      const n = secondItemIndex - firstItemIndex
      console.log(n, 3333)
      let node
      if (time > 30 * n) {
        let index = (Math.floor(time) - firstItemIndex)
        index = index < 0 ? 0 : Math.floor(index / n)
        node = nodes[index]
      } else {
        const index = Math.floor(time / n)
        index < 1 ? 1 : Math.floor(index) + 1
        node = nodes[index]
      }
      if (node) { return node }
    }
  }
}
