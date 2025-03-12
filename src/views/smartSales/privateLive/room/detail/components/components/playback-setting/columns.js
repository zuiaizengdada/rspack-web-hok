const columns = [
  {
    attrs: {
      type: 'selection'
    }
  },
  {
    prop: 'cloudId',
    label: '录播ID',
    width: 165
  },
  {
    prop: 'cloudName',
    label: '录制文件名称',
    width: 200,
    atts: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'recordingType',
    type: 'slot',
    label: '录制类型'
  },
  {
    prop: 'recordingTime',
    type: 'slot',
    label: '录制时间'
  },
  {
    prop: 'transcodeStatus',
    type: 'slot',
    label: '直播转码状态'
  },
  {
    prop: 'recordingDuration',
    type: 'slot',
    label: '录制时长'
  },
  {
    prop: 'videoClarity',
    label: '视频清晰度'
  },
  {
    prop: 'codeRate',
    type: 'slot',
    label: '码率'
  },
  {
    prop: 'frameRate',
    type: 'slot',
    label: '帧率'
  },
  {
    prop: 'operate',
    type: 'slot',
    label: '操作'
  }
]
export { columns }
