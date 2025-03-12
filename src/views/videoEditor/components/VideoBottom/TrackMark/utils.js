
import OSS from 'ali-oss'
import { getOssToken } from '@/api/qiniu'
import { toBlob } from 'dom-to-image'
import { getDurationSS } from '../../../utils'
export function getImageItemNode(currentTime) {
  const time = getDurationSS(currentTime)
  const nodes = document.querySelectorAll('.frame-sprite-container .frame-item')
  const firstItemIndex = Number(nodes[0].getAttribute('index'))
  // const secondItemIndex = Number(nodes[1].getAttribute('index'))
  // const n = secondItemIndex - firstItemIndex
  let n
  if (nodes.length > 1) {
    const secondItemIndex = Number(nodes[1].getAttribute('index'))
    n = secondItemIndex - firstItemIndex
  }
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
  return node || nodes[0]
}
export async function getVideoFrameImage(time) {
  let pictureUrl
  const node = getImageItemNode(time)
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
  }
  return pictureUrl
}
