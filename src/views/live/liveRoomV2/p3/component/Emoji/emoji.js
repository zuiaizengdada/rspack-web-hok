// const emoji = {
//   '[点赞]': '点赞.png',
//   '[鼓掌]': '鼓掌.png',
//   '[耶]': '耶.png',
//   '[新年快乐]': '新年快乐.png',
//   '[加1]': '加1.png',
//   '[花痴]': '花痴.png',
//   '[酷]': '酷.png',
//   '[送花]': '送花.png',
//   '[大笑]': '大笑.png',
//   '[比心]': '比心.png',
//   '[666]': '666.png',
//   '[笑哭了]': '笑哭了.png',
//   '[福袋]': '福袋.png',
//   '[灯笼]': '灯笼.png',
//   '[眨眼笑]': '眨眼笑.png',
//   '[亲亲]': '亲亲.png',
//   '[微笑]': '微笑.png',
//   '[哈哈]': '哈哈.png',
//   '[嘿嘿]': '嘿嘿.png',
//   '[记录]': '记录.png',
//   '[心]': '心.png'
// }
const emoji = {
  '[666]': '666_iSpt.png',
  '[点赞]': '点赞_iSpt.png',
  '[鼓掌]': '鼓掌_iSpt.png',
  '[比心]': '比心_iSpt.png',
  '[送花]': '送花_iSpt.png',
  '[爱心]': '爱心_iSpt.png',
  '[色笑]': '色笑_iSpt.png',
  '[酷]': '酷_iSpt.png',
  '[辛苦了]': '辛苦了_iSpt.png',
  '[奋斗]': '奋斗_iSpt.png',
  '[笑出眼泪]': '笑出眼泪_iSpt.png',
  '[打call]': '打call_iSpt.png',
  '[捂脸]': '捂脸_iSpt.png',
  '[笑]': '笑_iSpt.png',
  '[龇牙笑]': '龇牙笑_iSpt.png',
  '[哭泣]': '哭泣_iSpt.png',
  '[早上好]': '早上好_iSpt.png',
  '[星星]': '星星_iSpt.png',
  '[蛋糕]': '蛋糕_iSpt.png',
  '[红唇]': '红唇_iSpt.png',
  '[礼物]': '礼物_iSpt.png'
}
const emoji1 = {
  '[666]': '666.png',
  '[点赞]': '点赞.png',
  '[鼓掌]': '鼓掌.png',
  '[比心]': '比心.png',
  '[送花]': '送花.png',
  '[爱心]': '爱心.png',
  '[色笑]': '色笑.png',
  '[酷]': '酷.png',
  '[辛苦了]': '辛苦了.png',
  '[奋斗]': '奋斗.png',
  '[笑出眼泪]': '笑出眼泪.png',
  '[打call]': '打call.png',
  '[捂脸]': '捂脸.png',
  '[笑]': '笑.png',
  '[龇牙笑]': '龇牙笑.png',
  '[哭泣]': '哭泣.png',
  '[早上好]': '早上好.png',
  '[星星]': '星星.png',
  '[蛋糕]': '蛋糕.png',
  '[红唇]': '红唇.png',
  '[礼物]': '礼物.png'
}
const emojiList = []
const emojiMap = {}
for (const i in emoji) {
  const obj = {}
  obj.name = i
  obj.value = require(`@/assets/emoji1/${emoji[i]}`)
  emojiMap[i] = obj.value
  emojiList.push(obj)
}
const emojiList1 = []
const emojiMap1 = {}
for (const i in emoji1) {
  const obj = {}
  obj.name = i
  obj.value = require(`@/assets/emoji1/${emoji1[i]}`)
  emojiMap1[i] = obj.value
  emojiList1.push(obj)
}
export { emojiList, emojiMap, emojiList1 }

