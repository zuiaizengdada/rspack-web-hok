// value: key
// label: name
// hide: 显示隐藏        true: 隐藏， false  展示
// disabled： 是否禁用   true: 禁用

// 静态字典文件
const dict = {
  DELIVERY_SHAPE: [
    { value: 1, label: '线上视频交付' },
    { value: 2, label: '线下授课交付' }
  ],
  DELIVERY_STATUS: [
    { value: 1, label: '待交付' },
    { value: 2, label: '交付中' },
    { value: 3, label: '延期交付' },
    { value: 4, label: '锁定交付' },
    { value: 5, label: '已交付' },
    { value: 6, label: '已关闭' }
  ],
  GOODS_STATUS: [
    { value: 0, label: '图片' },
    { value: 1, label: '音频' },
    { value: 2, label: '视频' },
    { value: 3, label: '专栏' },
    { value: 4, label: '大专栏' },
    { value: 5, label: '线下课程' },
    { value: 6, label: '直播专栏' },
    { value: 7, label: '套餐课' },
    { value: 8, label: '直播课' }
  ],
  IS_FEATURED: [
    {
      value: '',
      label: '全部'
    },
    {
      value: 1,
      label: '精选'
    },
    {
      value: 0,
      label: '非精选'
    }
  ],
  DELIVERY_ONE_STATUS: [
    { value: 1, label: '待交付' },
    { value: 2, label: '交付中' },
    { value: 3, label: '已交付' },
    { value: 4, label: '已关闭' },
    { value: 5, label: '锁定交付' }
  ],
  IS_AVAILABLE_STATUS: [
    { value: 0, label: '有效' },
    { value: 1, label: '无效' }
  ],
  IS_ADDRESS_TYPE: [
    { value: 2, label: '已填' },
    { value: 1, label: '未填' }
  ],
  PACKAGE_DELIVERY_ONE_STATUS: [
    { value: 1, label: '待交付' },
    { value: 2, label: '交付中' },
    { value: 3, label: '延期交付' },
    { value: 4, label: '锁定交付' },
    { value: 5, label: '已交付' },
    { value: 6, label: '已关闭' },
    { value: 7, label: '其它' }
  ],
  ADD_WECHAT_STATUS: [
    { value: 1, label: '未加企微' },
    { value: 2, label: '未加个微' },
    { value: 3, label: '企微和个微均未加上' }
  ],
  TIME_TYPE: [
    { value: 'addGwTime', label: '加个微时间' },
    { value: 'addQwTime', label: '加企微时间' }
  ],
  ADD_QW_AND_GW_LIST: [
    { value: 1, label: '已加企微' },
    { value: 2, label: '已加个微' },
    { value: 3, label: '已加企微或个微' },
    { value: 4, label: '已加企微和个微' },
    { value: 5, label: '未加企微' },
    { value: 6, label: '未加个微' },
    { value: 7, label: '企微个微均未加' }
  ],
  WX_TYPE: [
    { value: 'wechatNickName', label: '微信昵称' },
    { value: 'remark', label: '微信备注名' }
  ],
  INHERIT_STATUS: [
    { value: 1, label: '离职继承' },
    { value: 0, label: '在职继承' },
    { value: 2, label: '不继承' }
  ],
  CLASS_STATUS: [
    { value: 0, label: '未到课' },
    { value: 1, label: '已到课' }
  ],
  GOODS_TYPE: [
    { value: 0, label: '视频课' },
    { value: 1, label: '直播课' },
    { value: 2, label: '线下课' }
  ],
  COURSE_WORK_STATUS: [
    { value: 1, label: '未收集' },
    { value: 2, label: '已收集' }
  ],
  VIDEO_SOURCE: [
    { value: 1, label: '手动上传' },
    { value: 2, label: '初剪视频' },
    { value: 3, label: '直播回放' }
  ],
  RECORDINGTYPE: [
    { value: 0, label: '云端录制' },
    { value: 1, label: '回放合成' }
  ],
  CORERT_STATUS: [
    { value: 1, label: '转码中' },
    { value: 2, label: '转码成功' },
    { value: 3, label: '转码失败' }
  ],
  VIDEO_TYPE_SOURCE: [
    { value: 1, label: '启用' },
    { value: 2, label: '禁用' }
  ],
  SUCCESS_TYPE: [
    { value: 1, label: '成功' },
    { value: 2, label: '失败' }
  ],
  OKISNO_TYPE: [
    { value: 1, label: '是' },
    { value: 0, label: '否' }
  ],
  DELIVERY_REASON: [
    { value: '确定未交付', label: '确定未交付' },
    { value: '代签误操作', label: '代签误操作' }
  ],
  COMMODITY_SORT: [
    { label: '文件名称（A-Z）', value: 0 },
    { label: '文件名称（Z-A）', value: 1 },
    { label: '上传时间（新-旧）', value: 2 },
    { label: '上传时间（旧-新）', value: 3 }
  ],
  ORDER_STATUS: [
    { label: '未处理', value: 0 },
    { label: '退款中', value: 1 },
    { label: '已退款', value: 2 },
    { label: '已关闭', value: 3 },
    { label: '退款异常', value: 4 },
    { label: '处理中', value: 5 },
    { label: '商家拒绝退款', value: 6 },
    { label: '部分退款', value: 7 }
  ],
  CONTACT_TYPE: [
    { label: '手机号', value: 1 },
    { label: '邮箱号', value: 2 }
  ],
  OERDER_TYPE: [
    { label: '订单号', value: 'orderNo' },
    { label: '交易单号', value: 'transactionId' },
    { label: '买家昵称', value: 'userName' },
    { label: '买家手机号', value: 'userPhone' },
    { label: '买家邮箱', value: 'email' },
    { label: '用户ID', value: 'userId' },
    { label: '商品名称', value: 'goodsName' }
  ],
  ACTION_TYPE: [
    { label: '数据同步', value: 1 },
    { label: '延期', value: 2 },
    { label: '关闭交付', value: 3 },
    { label: '换人就读', value: 4 }
  ],
  // 跟进状态
  FOLLOW_STATUS: [
    { label: '已加个微待通过', value: 1 },
    { label: '不需要', value: 2 },
    { label: '在忙', value: 3 },
    { label: '未接', value: 4 },
    { label: '意向客户', value: 5 },
    { label: '未知', value: 6 },
    { label: '未接2', value: 7 },
    { label: '未接3', value: 8 },
    { label: '电话搜不到微信', value: 9 },
    { label: '已发短信', value: 10 }
  ],
  DYNAMIC_STATUS: [
    { label: '人工外呼', value: 4 },
    { label: '跟进记录', value: 1 },
    { label: 'AI外呼', value: 2 },
    { label: '短信', value: 3 }
  ],
  ADD_W_LIST: [
    {
      label: '已加',
      value: 1
    },
    {
      label: '未加',
      value: 0
    }
  ],
  COMMENT_TYPE: [
    {
      value: 1,
      label: '有图片'
    },
    {
      value: 2,
      label: '有内容'
    }
  ],
  COMMENT_TYPE: [
    {
      value: 'userPhone',
      label: '电话'
    },
    {
      value: 'userName',
      label: '姓名'
    },
    {
      value: 'email',
      label: '邮箱'
    }
  ],
  EVALUATION_LEVEL: [
    {
      value: 1,
      label: '好评'
    },
    {
      value: 2,
      label: '中评'
    },
    {
      value: 3,
      label: '差评'
    }
  ],
  AUDITOR_STATE: [
    {
      value: 1,
      label: '未审核'
    },
    {
      value: 2,
      label: '审核通过'
    },
    {
      value: 3,
      label: '审核未通过'
    }
  ],
  LEVEL_GRADE: [
    {
      value: 1,
      label: '好'
    },
    {
      value: 2,
      label: '中'
    },
    {
      value: 3,
      label: '差'
    }
  ],
  ASSIGNMENTRULE_TYPE: [
    {
      value: 1,
      label: '按权重分配'
    }
  ],
  PRIORITY_STATUS: [
    {
      value: 1,
      label: '高'
    },
    {
      value: 2,
      label: '中'
    },
    {
      value: 3,
      label: '低'
    }
  ],
  CONDITION_TYPE: [
    {
      value: 1,
      label: '按第三方店铺商品'
    },
    {
      value: 2,
      label: '按伏羲云商品'
    },
    {
      value: 3,
      label: '按伏羲云商品类型'
    }
  ],
  ORDERSTATUS_OPTIONS: [
    { label: '未支付', value: 1 },
    { label: '支付成功', value: 2 },
    { label: '超时已关闭', value: 3 },
    { label: '用户已取消', value: 4 },
    { label: '退款中', value: 5 },
    { label: '部分退款', value: 6 },
    { label: '全部退款', value: 7 },
    { label: '交易结束', value: 8 },
    { label: '没有向第三方发起支付请求', value: 9 },
    { label: '退款金额异常', value: 10 }
  ],
  liveRoomMode: [
    {
      value: 'PERSON_LIVE',
      label: '真人直播'
    },
    {
      value: 'AI_LIVE',
      label: '智能直播'
    },
    {
      value: 'DIGITAL_PERSON_LIVE',
      label: '数字人直播'
    }
  ],
  singleLectureType: [
    {
      value: 1,
      label: '课程只有本老师'
    },
    {
      value: 0,
      label: '课程含有本老师'
    }
  ]
}
export default dict
