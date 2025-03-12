<template>
  <div class="live-content">
    <el-button type="success" @click="inserts">新增</el-button>
    <el-button type="success" @click="toEdit">编辑</el-button>
    <el-button type="success" @click="toReview">演示</el-button>
    <iframe
      v-show="isShowIframe"
      id="iframeId"
      ref="iframeId"
      src="https://test.ppt.hokkj.cn"
      class="iframe-cls"
      frameborder="0"
      allowFullScreen="true"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
    />
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      pptData: '',
      isShowIframe: false,
      iframeWin: ''
    }
  },
  mounted() {
    this.iframeWin = this.$refs.iframeId.contentWindow
  },
  created() {
    const that = this
    window.addEventListener('message', function (event) {
      if (event.origin !== 'https://test.ppt.hokkj.cn') return
      that.pptData = event.data
      console.log(event)
      that.closeIframe()
    })
  },
  methods: {
    inserts() {
      this.isShowIframe = true
      const data = [] // [{ 'id': 'test-slide-1', 'elements': [{ 'type': 'shape', 'id': '4cbRxp', 'left': 0, 'top': 200, 'width': 546, 'height': 362.5, 'viewBox': [200, 200], 'path': 'M 0 0 L 0 200 L 200 200 Z', 'fill': '#5b9bd5', 'fixedRatio': false, 'opacity': 0.7, 'rotate': 0 }, { 'type': 'shape', 'id': 'ookHrf', 'left': 0, 'top': 0, 'width': 300, 'height': 320, 'viewBox': [200, 200], 'path': 'M 0 0 L 0 200 L 200 200 Z', 'fill': '#5b9bd5', 'fixedRatio': false, 'flipV': true, 'rotate': 0 }, { 'type': 'text', 'id': 'idn7Mx', 'left': 355, 'top': 65.25, 'width': 585, 'height': 154.390625, 'lineHeight': 1.2, 'content': '<p style=\'\'><strong><span style=\'font-size: 112px\'>test</span></strong></p>', 'rotate': 0, 'defaultFontName': 'Microsoft Yahei', 'defaultColor': '#333' }, { 'type': 'text', 'id': '7stmVP', 'left': 355, 'top': 253.25, 'width': 585, 'height': 56, 'content': '<p style=\'\'><span style=\'font-size: 24px\'>地方撒范德萨发生大发的</span></p>', 'rotate': 0, 'defaultFontName': 'Microsoft Yahei', 'defaultColor': '#333' }, { 'type': 'line', 'id': 'FnpZs4', 'left': 361, 'top': 238, 'start': [0, 0], 'end': [549, 0], 'points': ['', ''], 'color': '#5b9bd5', 'style': 'solid', 'width': 2 }], 'background': { 'type': 'solid', 'color': '#ffffff' } }, { 'id': 'test-slide-2', 'elements': [{ 'type': 'text', 'id': 'ptNnUJ', 'left': 145, 'top': 148, 'width': 711, 'height': 77.59375, 'lineHeight': 1.2, 'content': '<p style="text-align: center;"><strong><span style="font-size: 48px">任务及佛教为了第三方而我就看</span></strong></p>', 'rotate': 0, 'defaultFontName': 'Microsoft Yahei', 'defaultColor': '#333' }, { 'type': 'text', 'id': 'mRHvQN', 'left': 207.50000000000003, 'top': 249.84259259259264, 'width': 585, 'height': 56, 'content': '<p style="text-align: center;"><span style="font-size: 24px">是非得失</span></p>', 'rotate': 0, 'defaultFontName': 'Microsoft Yahei', 'defaultColor': '#333' }, { 'type': 'line', 'id': '7CQDwc', 'left': 323.09259259259267, 'top': 238.33333333333334, 'start': [0, 0], 'end': [354.8148148148148, 0], 'points': ['', ''], 'color': '#5b9bd5', 'style': 'solid', 'width': 4 }, { 'type': 'shape', 'id': '09wqWw', 'left': -27.648148148148138, 'top': 432.73148148148147, 'width': 1056.2962962962963, 'height': 162.96296296296296, 'viewBox': [200, 200], 'path': 'M 0 20 C 40 -40 60 60 100 20 C 140 -40 160 60 200 20 L 200 180 C 140 240 160 140 100 180 C 40 240 60 140 0 180 L 0 20 Z', 'fill': '#5b9bd5', 'fixedRatio': false, 'rotate': 0 }], 'background': { 'type': 'solid', 'color': '#fff' } }, { 'id': 'test-slide-3', 'elements': [{ 'type': 'shape', 'id': 'vSheCJ', 'left': 183.5185185185185, 'top': 175.5092592592593, 'width': 605.1851851851851, 'height': 185.18518518518516, 'viewBox': [200, 200], 'path': 'M 0 0 L 200 0 L 200 200 L 0 200 Z', 'fill': '#5b9bd5', 'fixedRatio': false, 'rotate': 0 }, { 'type': 'shape', 'id': 'Mpwv7x', 'left': 211.29629629629628, 'top': 201.80555555555557, 'width': 605.1851851851851, 'height': 185.18518518518516, 'viewBox': [200, 200], 'path': 'M 0 0 L 200 0 L 200 200 L 0 200 Z', 'fill': '#5b9bd5', 'fixedRatio': false, 'rotate': 0, 'opacity': 0.7 }, { 'type': 'text', 'id': 'WQOTAp', 'left': 304.9074074074074, 'top': 145.75179065234144, 'width': 417.9629629629629, 'height': 260, 'content': '<p style="text-align: center;"><strong><span style="color: #ffffff;"><span style="font-size: 80px">hello word</span></span></strong></p>', 'rotate': 0, 'defaultFontName': 'Microsoft Yahei', 'defaultColor': '#333', 'wordSpace': 5 }], 'background': { 'type': 'solid', 'color': '#fff' } }]
      const params = {
        type: 'insert',
        data: data
      }
      this.iframeWin = this.$refs.iframeId.contentWindow
      this.iframeWin.postMessage(params, 'https://test.ppt.hokkj.cn')
    },
    toEdit() {
      this.isShowIframe = true
      const data = [
        {
          id: 'test-slide-1',
          elements: [
            {
              type: 'shape',
              id: '4cbRxp',
              left: 0,
              top: 200,
              width: 546,
              height: 362.5,
              viewBox: [200, 200],
              path: 'M 0 0 L 0 200 L 200 200 Z',
              fill: '#5b9bd5',
              fixedRatio: false,
              opacity: 0.7,
              rotate: 0
            },
            {
              type: 'shape',
              id: 'ookHrf',
              left: 0,
              top: 0,
              width: 300,
              height: 320,
              viewBox: [200, 200],
              path: 'M 0 0 L 0 200 L 200 200 Z',
              fill: '#5b9bd5',
              fixedRatio: false,
              flipV: true,
              rotate: 0
            },
            {
              type: 'text',
              id: 'idn7Mx',
              left: 355,
              top: 65.25,
              width: 585,
              height: 154.390625,
              lineHeight: 1.2,
              content: "<p style=''><strong><span style='font-size: 112px'>test</span></strong></p>",
              rotate: 0,
              defaultFontName: 'Microsoft Yahei',
              defaultColor: '#333'
            },
            {
              type: 'text',
              id: '7stmVP',
              left: 355,
              top: 253.25,
              width: 585,
              height: 56,
              content: "<p style=''><span style='font-size: 24px'>地方撒范德萨发生大发的</span></p>",
              rotate: 0,
              defaultFontName: 'Microsoft Yahei',
              defaultColor: '#333'
            },
            {
              type: 'line',
              id: 'FnpZs4',
              left: 361,
              top: 238,
              start: [0, 0],
              end: [549, 0],
              points: ['', ''],
              color: '#5b9bd5',
              style: 'solid',
              width: 2
            }
          ],
          background: { type: 'solid', color: '#ffffff' }
        },
        {
          id: 'test-slide-2',
          elements: [
            {
              type: 'text',
              id: 'ptNnUJ',
              left: 145,
              top: 148,
              width: 711,
              height: 77.59375,
              lineHeight: 1.2,
              content:
                '<p style="text-align: center;"><strong><span style="font-size: 48px">任务及佛教为了第三方而我就看</span></strong></p>',
              rotate: 0,
              defaultFontName: 'Microsoft Yahei',
              defaultColor: '#333'
            },
            {
              type: 'text',
              id: 'mRHvQN',
              left: 207.50000000000003,
              top: 249.84259259259264,
              width: 585,
              height: 56,
              content: '<p style="text-align: center;"><span style="font-size: 24px">是非得失</span></p>',
              rotate: 0,
              defaultFontName: 'Microsoft Yahei',
              defaultColor: '#333'
            },
            {
              type: 'line',
              id: '7CQDwc',
              left: 323.09259259259267,
              top: 238.33333333333334,
              start: [0, 0],
              end: [354.8148148148148, 0],
              points: ['', ''],
              color: '#5b9bd5',
              style: 'solid',
              width: 4
            },
            {
              type: 'shape',
              id: '09wqWw',
              left: -27.648148148148138,
              top: 432.73148148148147,
              width: 1056.2962962962963,
              height: 162.96296296296296,
              viewBox: [200, 200],
              path: 'M 0 20 C 40 -40 60 60 100 20 C 140 -40 160 60 200 20 L 200 180 C 140 240 160 140 100 180 C 40 240 60 140 0 180 L 0 20 Z',
              fill: '#5b9bd5',
              fixedRatio: false,
              rotate: 0
            }
          ],
          background: { type: 'solid', color: '#fff' }
        },
        {
          id: 'test-slide-3',
          elements: [
            {
              type: 'shape',
              id: 'vSheCJ',
              left: 183.5185185185185,
              top: 175.5092592592593,
              width: 605.1851851851851,
              height: 185.18518518518516,
              viewBox: [200, 200],
              path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
              fill: '#5b9bd5',
              fixedRatio: false,
              rotate: 0
            },
            {
              type: 'shape',
              id: 'Mpwv7x',
              left: 211.29629629629628,
              top: 201.80555555555557,
              width: 605.1851851851851,
              height: 185.18518518518516,
              viewBox: [200, 200],
              path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
              fill: '#5b9bd5',
              fixedRatio: false,
              rotate: 0,
              opacity: 0.7
            },
            {
              type: 'text',
              id: 'WQOTAp',
              left: 304.9074074074074,
              top: 145.75179065234144,
              width: 417.9629629629629,
              height: 260,
              content:
                '<p style="text-align: center;"><strong><span style="color: #ffffff;"><span style="font-size: 80px">hello word</span></span></strong></p>',
              rotate: 0,
              defaultFontName: 'Microsoft Yahei',
              defaultColor: '#333',
              wordSpace: 5
            }
          ],
          background: { type: 'solid', color: '#fff' }
        }
      ]
      const params = {
        type: 'edit',
        data: data
      }
      this.iframeWin = this.$refs.iframeId.contentWindow
      this.iframeWin.postMessage(params, 'https://test.ppt.hokkj.cn')
    },
    toReview() {
      this.isShowIframe = true
      const data = [
        {
          id: 'test-slide-1',
          elements: [
            {
              type: 'shape',
              id: '4cbRxp',
              left: 0,
              top: 200,
              width: 546,
              height: 362.5,
              viewBox: [200, 200],
              path: 'M 0 0 L 0 200 L 200 200 Z',
              fill: '#5b9bd5',
              fixedRatio: false,
              opacity: 0.7,
              rotate: 0
            },
            {
              type: 'shape',
              id: 'ookHrf',
              left: 0,
              top: 0,
              width: 300,
              height: 320,
              viewBox: [200, 200],
              path: 'M 0 0 L 0 200 L 200 200 Z',
              fill: '#5b9bd5',
              fixedRatio: false,
              flipV: true,
              rotate: 0
            },
            {
              type: 'text',
              id: 'idn7Mx',
              left: 355,
              top: 65.25,
              width: 585,
              height: 154.390625,
              lineHeight: 1.2,
              content: "<p style=''><strong><span style='font-size: 112px'>test</span></strong></p>",
              rotate: 0,
              defaultFontName: 'Microsoft Yahei',
              defaultColor: '#333'
            },
            {
              type: 'text',
              id: '7stmVP',
              left: 355,
              top: 253.25,
              width: 585,
              height: 56,
              content: "<p style=''><span style='font-size: 24px'>地方撒范德萨发生大发的</span></p>",
              rotate: 0,
              defaultFontName: 'Microsoft Yahei',
              defaultColor: '#333'
            },
            {
              type: 'line',
              id: 'FnpZs4',
              left: 361,
              top: 238,
              start: [0, 0],
              end: [549, 0],
              points: ['', ''],
              color: '#5b9bd5',
              style: 'solid',
              width: 2
            }
          ],
          background: { type: 'solid', color: '#ffffff' }
        },
        {
          id: 'test-slide-2',
          elements: [
            {
              type: 'text',
              id: 'ptNnUJ',
              left: 145,
              top: 148,
              width: 711,
              height: 77.59375,
              lineHeight: 1.2,
              content:
                '<p style="text-align: center;"><strong><span style="font-size: 48px">任务及佛教为了第三方而我就看</span></strong></p>',
              rotate: 0,
              defaultFontName: 'Microsoft Yahei',
              defaultColor: '#333'
            },
            {
              type: 'text',
              id: 'mRHvQN',
              left: 207.50000000000003,
              top: 249.84259259259264,
              width: 585,
              height: 56,
              content: '<p style="text-align: center;"><span style="font-size: 24px">是非得失</span></p>',
              rotate: 0,
              defaultFontName: 'Microsoft Yahei',
              defaultColor: '#333'
            },
            {
              type: 'line',
              id: '7CQDwc',
              left: 323.09259259259267,
              top: 238.33333333333334,
              start: [0, 0],
              end: [354.8148148148148, 0],
              points: ['', ''],
              color: '#5b9bd5',
              style: 'solid',
              width: 4
            },
            {
              type: 'shape',
              id: '09wqWw',
              left: -27.648148148148138,
              top: 432.73148148148147,
              width: 1056.2962962962963,
              height: 162.96296296296296,
              viewBox: [200, 200],
              path: 'M 0 20 C 40 -40 60 60 100 20 C 140 -40 160 60 200 20 L 200 180 C 140 240 160 140 100 180 C 40 240 60 140 0 180 L 0 20 Z',
              fill: '#5b9bd5',
              fixedRatio: false,
              rotate: 0
            }
          ],
          background: { type: 'solid', color: '#fff' }
        },
        {
          id: 'test-slide-3',
          elements: [
            {
              type: 'shape',
              id: 'vSheCJ',
              left: 183.5185185185185,
              top: 175.5092592592593,
              width: 605.1851851851851,
              height: 185.18518518518516,
              viewBox: [200, 200],
              path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
              fill: '#5b9bd5',
              fixedRatio: false,
              rotate: 0
            },
            {
              type: 'shape',
              id: 'Mpwv7x',
              left: 211.29629629629628,
              top: 201.80555555555557,
              width: 605.1851851851851,
              height: 185.18518518518516,
              viewBox: [200, 200],
              path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
              fill: '#5b9bd5',
              fixedRatio: false,
              rotate: 0,
              opacity: 0.7
            },
            {
              type: 'text',
              id: 'WQOTAp',
              left: 304.9074074074074,
              top: 145.75179065234144,
              width: 417.9629629629629,
              height: 260,
              content:
                '<p style="text-align: center;"><strong><span style="color: #ffffff;"><span style="font-size: 80px">hello word</span></span></strong></p>',
              rotate: 0,
              defaultFontName: 'Microsoft Yahei',
              defaultColor: '#333',
              wordSpace: 5
            }
          ],
          background: { type: 'solid', color: '#fff' }
        }
      ]
      const params = {
        type: 'review',
        data: data
      }
      this.iframeWin = this.$refs.iframeId.contentWindow
      this.iframeWin.postMessage(params, 'https://test.ppt.hokkj.cn')
    },
    closeIframe() {
      this.isShowIframe = false
    }
  }
}
</script>

<style lang="scss" scoped>
.live-content {
  min-width: 1200px;
  background: #fff;
}

.iframe-cls {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999999;
}
</style>
