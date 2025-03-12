const publishAccountItemTemplateData = {
  account: {},
  title: '',
  cover: '',
  intro: '',
  topic: [],
  friends: [],
  address: '',
  openScope: 0,
  isReleaseTimed: false,
  publishTimed: {
    type: 0,
    value: ''
  }
}
export const tiktokTemplateData = {
  ...publishAccountItemTemplateData,
  shoppingCarGoodList: [],
  miniApp: null,
  collectionList: [],
  isSyncOtherPlatform: true,
  hotSentence: null,
  tiktokLabel: 1, // 1添加地址 2添加购物车
  isOtherSave: 1
}

export const tiktokOverSeasTemplateData = {
  ...publishAccountItemTemplateData
}

export const wechatTemplateData = {
  ...publishAccountItemTemplateData,
  extendLink: '',
  shoppingGoods: [],
  isJoinActivity: [],
  wechartFriend: [],
  isOriginal: false
}

export const kuaishouTemplateData = {
  ...publishAccountItemTemplateData,
  isGoodsRelevance: 0,
  goodsRelevanceList: null,
  personalizedSettingType: ['1'],
  fieldList: [],
  classifyList: []
}

export const xiaohongshuTemplateData = {
  ...publishAccountItemTemplateData
}

export const bilibiliTemplateData = {
  ...publishAccountItemTemplateData,
  tags: [],
  isSelfControl: true,
  isSelfUrl: '',
  classifyList: [],
  joinActivities: []
}
export const tamplateDataList = new Map([[19, tiktokTemplateData], [15, bilibiliTemplateData], [32, wechatTemplateData], [24, kuaishouTemplateData], [31, xiaohongshuTemplateData], [20, tiktokOverSeasTemplateData]])
export const tamplateDataName = new Map([[19, '抖音'], [15, 'b站'], [32, '视频号'], [24, '快手'], [31, '小红书'], [20, 'Tiktok']])
