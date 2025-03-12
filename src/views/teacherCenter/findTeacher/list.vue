<template>
  <!-- 寻找师资 -->
  <div class="page_wrap hoc-main-min-height">
    <MCard class="hoc-main-min-height">
      <div class="search">
        <el-form
          :inline="true"
          :model="search"
          size="small"
          label-position="left"
          label-width="80px"
        >
          <el-row>
            <el-form-item label="关键词">
              <span slot="label">
                关键词
                <el-tooltip
                  class="item"
                  effect="dark"
                  content=" 注：关键词+企业管理，即查关键词加企业管理的内容。"
                  placement="top"
                >
                  <div slot="content" v-html="tips" />
                  <svg-icon icon-class="question" style="font-size: 16px" />
                </el-tooltip>
              </span>
              <el-input
                v-model="search.keyWord"
                class="w-200"
                maxlength="20"
                @keyup.enter.native="searchFn"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <!-- <el-form-item label="所属行业">
              <el-cascader
                ref="cascader"
                v-model="search.industry"
                class="w-200"
                :show-all-levels="false"
                :options="industryOption"
                :props="{
                  checkStrictly: true,
                  label: 'catName',
                  children: 'children',
                  value: 'catId',
                  expandTrigger: 'hover'
                }"
                clearable
              />
            </el-form-item> -->
            <el-form-item label="所属领域">
              <el-select v-model="search.area" class="w-200" clearable>
                <el-option
                  v-for="(item, index) in areaOption"
                  :key="index"
                  :label="item.domainName"
                  :value="item.domainName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="排序规则">
              <el-select v-model="search.sort" size="small">
                <el-option label="发布时间" :value="1" />
                <el-option label="播放量" :value="2" />
                <el-option label="点赞量" :value="3" />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="视频渠道">
              <el-checkbox-group v-model="search.type">
                <el-checkbox
                  v-permission="['web:findTeacher:douyin', permsList]"
                  label="3"
                >抖音视频</el-checkbox>
                <el-checkbox
                  v-permission="['web:findTeacher:baidu', permsList]"
                  label="1"
                >百度视频</el-checkbox>
                <el-checkbox
                  v-permission="['web:findTeacher:B', permsList]"
                  label="2"
                >搜狗视频</el-checkbox>
                <!-- <el-checkbox v-permission="['web:findTeacher:kuaishou', permsList]" label="4">快手视频</el-checkbox>
                <el-checkbox v-permission="['web:findTeacher:hong', permsList]" label="5">小红书视频</el-checkbox> -->
              </el-checkbox-group>
            </el-form-item>
          </el-row>
        </el-form>
        <div class="searchBtn">
          <el-button
            size="small"
            type="primary"
            :loading="loading"
            @click="searchFn"
          >查询</el-button>
          <el-button size="small" @click="openBaiDu">百度找资料</el-button>
        </div>
      </div>
      <div class="contant">
        <!-- <div v-show="data.length > 0" class="sort">
          <div class="sortTitle">查询结果</div>
          <el-select v-model="search.sort" size="small">
            <el-option label="发布时间" :value="1" />
            <el-option label="播放量" :value="2" />
            <el-option label="点赞量" :value="3" />
          </el-select>
        </div> -->
        <!-- 列表 -->
        <div
          v-infinite-scroll="getAllList"
          :infinite-scroll-disabled="disabled"
          class="infinite-list overflowOuto"
          :infinite-scroll-distance="800"
        >
          <div class="list_falls">
            <div v-for="(item, index) in data" :key="index" class="listView">
              <div class="listViewContant">
                <div class="list_image" @click="openPlay(item)">
                  <el-image
                    v-if="!item.coverSrc"
                    fit="contain"
                    class="list_image_url"
                    :src="require('@/assets/image/videoPoster.png')"
                  />
                  <el-image
                    v-else
                    fit="contain"
                    class="list_image_url"
                    :src="item.coverSrc"
                  />
                </div>
                <div class="list_title text_hidden" v-html="item.title" />
                <div class="list_play list_text">
                  <span>播放量: {{ item.playCount || '-' }}</span>
                  <span>点赞量: {{ item.zanCount || '-' }}次</span>
                </div>
                <div class="list_public list_text">
                  <span> 发布时间: {{ item.publishDate }} </span>
                  <span v-if="item.author">来源渠道:{{ item.author }}</span>
                  <span v-else>
                    来源渠道: {{ item.platform | getOptionsValue(PLATFORM) }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="data.length === 0 && !searchType" class="noData">
              <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
              <p class="text-center" style="color: #606266; font-size: 14px">
                暂无搜索内容
              </p>
            </div>
            <div v-if="data.length === 0 && searchType" class="noSearch">
              <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
              <p class="text-center" style="color: #606266; font-size: 14px">
                未搜索到相关内容，<span
                  class="cursor-pointer"
                  style="color: #0c6fff"
                  @click="handleClickResetSearch"
                >请重试</span>
              </p>
            </div>
          </div>
        </div>
        <transition name="fade">
          <div v-if="loading" class="loadingStatus">
            <svg-icon icon-class="loading" class="loadingSvg" />
          </div>
        </transition>
      </div>
    </MCard>

    <AppDialog
      v-model="dialog.visible"
      :title="dialog.title"
      :width="dialog.width"
      :height="dialog.height"
      :top="dialog.top"
    >
      <template
        v-if="
          (dialog.form.platform && dialog.form.platform === 3) ||
            !whiteIframeList.includes(dialog.form.author)
        "
      >
        <div style="color: #d9001b; padding: 20px; text-align: center">
          该视频无法直接观看，请点击<span
            style="color: #0000ff; cursor: pointer"
            @click="openUrl(dialog.form)"
          >查看视频</span>
        </div>
      </template>
      <template v-else>
        <div v-if="dialog.visible" class="dialogModle">
          <template v-if="!dialog.form.ifVideo">
            <iframe
              style="width: 100%; height: 100%"
              allowpaymentrequest="true"
              frameborder="0"
              :src="dialog.form.iframeSrc"
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
            />
          </template>
          <template v-else>
            <div id="iframeVideo" />
          </template>
        </div>
      </template>

      <div slot="footer" class="footerfooter" :style="{ width: dialog.width }">
        <div class="footer-center">
          <div class="footer-box">
            <div class="footer-title">选择分类：</div>
            <div class="footer-info">
              <el-radio v-model="radioClass" label="2">IP档案</el-radio>
              <el-radio v-model="radioClass" label="1">IP初审</el-radio>
            </div>
          </div>
          <div class="footer-box">
            <div class="footer-title">选择老师:</div>
            <div class="footer-info tearchSelect">
              <template v-if="radioClass === '1'">
                <el-input
                  v-model="dialog.form.teacherName"
                  style="width: 200px"
                  maxlength="10"
                  size="small"
                  placeholder="请输入老师名称1"
                />
              </template>
              <template v-else>
                <TeacherSelect
                  ref="teacherSelect"
                  :default-tearch-id="dialog.form.tearch.teacherId"
                  add-tearch
                  :search-tearch="search.keyWord"
                  :search-video="dialog.form.iframeSrc"
                  :value="dialog.form.tearch.teacherName"
                  @selected="teacherSelect"
                />
              </template>
              <el-button
                v-if="radioClass === '1'"
                :loading="dialog.loading"
                :disabled="dialog.form.teacherName === ''"
                size="small"
                type="primary"
                class="m-l-10"
                @click="collect"
              >收藏视频</el-button>
              <el-button
                v-else
                :loading="dialog.loading"
                :disabled="dialog.form.tearch.teacherId === ''"
                size="small"
                type="primary"
                class="m-l-10"
                @click="collect"
              >收藏视频</el-button>
              <el-button
                :loading="dialog.loading"
                size="small"
                @click="dialog.visible = false"
              >关闭</el-button>
            </div>
          </div>
        </div>
      </div>
    </AppDialog>
  </div>
</template>

<script>
const key = 'c3b6a6a563290dc4a394eed21631e352ff26d2aa76240471a7caf31d'
import { mapGetters } from 'vuex'
import {
  getExternalTeacherListApi,
  collectTeacher,
  getExternalTeacherListKuaiShouApi
} from '@/api/tearchCenter/findTearch'
import { addAuditTeacher } from '@/api/tearchCenter/index'
import { mixinNode } from './mixinNode'
import AppDialog from '@/components/AppDialog'
import moment from 'moment'
import TeacherSelect from './components/teacherSelect'
import Player from 'xgplayer'
import { PLATFORM } from '../enum'
import Cookies from 'js-cookie'
export default {
  components: {
    AppDialog,
    TeacherSelect
  },
  mixins: [mixinNode],
  data() {
    return {
      radioClass: '2',
      tips: `注：关键词非必填，限20个字以内。<br />
         关键词+所属领域，即查关键词加所属领域的内容。<br />
      `,
      PLATFORM,
      search: {
        keyWord: '', // 关键词
        industry: '', // 所属行业
        area: '', // 所属领域
        type: [],
        sort: 1
      },
      count: 0,
      data: [],
      loading: false,
      dialog: {
        visible: false,
        title: '查看',
        width: '1169px',
        height: '652px',
        form: {
          vidoeId: '',
          coverSrc: '',
          title: '',
          iframeSrc: '',
          playCount: '',
          zanCount: '',
          publishDate: '',
          duration: '',
          tearch: {
            teacherId: '',
            teacherName: ''
          },
          teacherName: ''
        },
        loading: false
      },
      player: null,
      current: 1,
      cursor: 1,
      pageSize: 10,
      noMore: true,
      searchType: false,
      permsList: this.$route.meta.permsList || [],
      whiteIframeList: ['哔哩哔哩', '好看视频', '爱奇艺']
    }
  },
  computed: {
    ...mapGetters(['industryOption', 'areaOption', 'userInfo']),
    disabled() {
      return this.loading || this.noMore
    }
  },
  mounted() {
    if (this.$route.meta.permsList.includes('web:findTeacher:douyin')) {
      this.search.type = ['3']
    }
    if (this.$route.meta.permsList.includes('web:findTeacher:baidu')) {
      this.search.type.push('1')
    }
    if (this.$route.meta.permsList.includes('web:findTeacher:B')) {
      this.search.type.push('2')
    }
    if (JSON.stringify(this.$route.query) !== '{}') {
      this.search.keyWord = this.$route.query?.teacherName ?? ''
      this.searchFn()
    }
    this.getAreaList()
    this.getIndustryOption()
  },
  destroyed() {},
  methods: {
    // 获取领域数据
    async getAreaList() {
      await this.$store.dispatch('option/getAreaOption')
    },
    // 获取行业数据
    async getIndustryOption() {
      await this.$store.dispatch('option/getIndustryOption')
    },
    // 点击打开百度百科
    openBaiDu() {
      let keyword = this.search.keyWord
      if (this.search.industry && this.search.industry.length > 0) {
        const industry = this.$refs.cascader.getCheckedNodes(true)[0].label
        keyword = keyword + ' ' + industry
      }
      console.log(this.search.area, 'this.search.area')
      if (this.search.area !== '') {
        keyword = keyword + ' ' + this.search.area
      }
      if (!keyword) {
        window.open(`https://www.baidu.com/`, '_blank')
      } else {
        window.open(
          `https://www.baidu.com/s?tn=02003390_19_hao_pg&ie=utf-8&wd=${keyword}`,
          '_blank'
        )
      }
    },
    // 百度视频
    async getBaiduList() {
      const baiduList = []
      if (!this.search.type.includes('1')) {
        return baiduList
      }
      try {
        let keyword = this.search.keyWord
        if (this.search.industry && this.search.industry.length > 0) {
          const industry = this.$refs.cascader.getCheckedNodes(true)[0].label
          keyword = keyword + ' ' + industry
        }
        if (this.search.area !== '') {
          keyword = keyword + ' ' + this.search.area
        }
        Cookies.set('BAIDUID', '0559F07E3D97959D297A207A26A36183')
        Cookies.set('FG', '1')
        const res = await getExternalTeacherListApi(
          `/baidu/web/search/api?pn=${this.current}&rn=${this.pageSize}&type=video&query=${keyword}`
          // `/baidu?keyword=${keyword}`
        )
        if (res.status === 200) {
          const { data, errmsg } = res.data
          if (errmsg === '成功') {
            data.list &&
              data.list.forEach(item => {
                baiduList.push({
                  vidoeId: item.vid,
                  coverSrc: item.cover_src,
                  title: item.title,
                  iframeSrc: item.url,
                  playCount: item.read_num,
                  zanCount: '',
                  publishDate: item.publishTimeText,
                  platform: 1
                })
              })
            console.log(baiduList, '获取到的百度数据')
          }
        }
      } catch (err) {
        console.log(err)
      }
      return baiduList
    },
    // B站
    async getBibiliList() {
      const bibiliList = []
      if (!this.search.type.includes('2')) {
        return bibiliList
      }
      let order
      if (this.search.sort === 1) {
        // 发布时间
        order = 'pubdate'
      } else if (this.search.sort === 2) {
        // 播放量
        order = 'click'
      } else if (this.search.sort === 3) {
        // 点赞量
        order = ''
      }
      try {
        let keyword = this.search.keyWord
        if (this.search.industry && this.search.industry.length > 0) {
          const industry = this.$refs.cascader.getCheckedNodes(true)[0].label
          keyword = keyword + ' ' + industry
        }
        console.log(this.search.area, 'this.search.area')
        if (this.search.area !== '') {
          keyword = keyword + ' ' + this.search.area
        }
        Cookies.set(
          'main_confirmation',
          '5rbfDuxKd9tm%2BpzFwX%2BbGJzOPgEKhXPFMuLQRNbFC%2Bo%3D'
        )
        Cookies.set('innersign', '0')
        Cookies.set('buvid3', '042543FD-B652-5D03-D5CA-D146F9820DAE85358infoc')
        const res = await getExternalTeacherListApi(
          `/bibili/x/web-interface/search/type?page=${this.current}&page_size=${this.pageSize}&search_type=video&keyword=${keyword}&order=${order}`
        )
        if (res.status === 200) {
          const { data, code } = res.data
          if (code === 0) {
            data.result &&
              data.result.forEach(item => {
                bibiliList.push({
                  vidoeId: item.id,
                  coverSrc: 'http:' + item.pic,
                  title: item.title,
                  iframeSrc: item.arcurl.replace(
                    /^(https?:\/\/)(.*)?/i,
                    'https://$2'
                  ),
                  playCount: item.play,
                  zanCount: item.like,
                  publishDate: moment(item.pubdate * 1000).format(
                    'YYYY-MM-DD HH:mm:ss'
                  ),
                  duration: item.duration,
                  platform: 2
                })
              })
          }
        }
      } catch (err) {
        console.log(err, '错误')
      }
      return bibiliList
    },
    // 抖音
    async getTikTokList() {
      const tikTokList = []
      if (!this.search.type.includes('3')) {
        return tikTokList
      }
      try {
        let order
        if (this.search.sort === 1) {
          // 发布时间
          order = '2'
        } else if (this.search.sort === 2) {
          // 播放量
          order = '0'
        } else if (this.search.sort === 3) {
          // 点赞量
          order = '1'
        }
        let keyword = this.search.keyWord
        if (this.search.industry && this.search.industry.length > 0) {
          const industry = this.$refs.cascader.getCheckedNodes(true)[0].label
          keyword = keyword + ' ' + industry
        }
        console.log(this.search.area, 'this.search.area')
        if (this.search.area !== '') {
          keyword = keyword + ' ' + this.search.area
        }
        const res = await getExternalTeacherListApi(
          `/whosecard/api/douyin/aweme/search?search_source=video_search&key=${key}&keyword=${keyword}&cursor=${this.cursor}&sort_type=${order}`
        )
        if (res.status === 200) {
          const { ok, result } = res.data
          if (ok) {
            result.aweme_list.forEach(item => {
              console.log(item.mix_info, 5959595)
              tikTokList.push({
                vidoeId: item.aweme_id,
                coverSrc:
                  item.video.cover.url_list.length > 0
                    ? item.video.cover.url_list[0]
                    : '',
                title: item.desc,
                iframeSrc: `https://www.douyin.com/video/${item.aweme_id}`,
                playCount: '',
                zanCount: item.statistics.digg_count,
                publishDate: moment(item.create_time * 1000).format(
                  'YYYY-MM-DD HH:mm:ss'
                ),
                duration: item.duration,
                ifLink: true,
                platform: 3
              })
            })
            this.cursor = result.cursor
          }
        }
      } catch (err) {
        console.log(err)
      }
      return tikTokList
    },
    // 抖音 方法2
    async getTikTokList2() {
      const tikTokList = []
      if (!this.search.type.includes('3')) {
        return tikTokList
      }
      try {
        // let order
        // if (this.search.sort === 1) {
        //   // 发布时间
        //   order = '2'
        // } else if (this.search.sort === 2) {
        //   // 播放量
        //   order = '0'
        // } else if (this.search.sort === 3) {
        //   // 点赞量
        //   order = '1'
        // }
        let keyword = this.search.keyWord
        if (this.search.industry && this.search.industry.length > 0) {
          const industry = this.$refs.cascader.getCheckedNodes(true)[0].label
          keyword = keyword + ' ' + industry
        }
        console.log(this.search.area, 'this.search.area')
        if (this.search.area !== '') {
          keyword = keyword + ' ' + this.search.area
        }
        const url = `${
          this.apiUrl['douyin'][process.env.NODE_ENV]
        }/douyin?keyword=${keyword}&userId=${this.userInfo.userId}&pn=1`
        // const url = `http://172.17.82.56:7001/douyin?keyword=${keyword}&userId=${this.userInfo.userId}&pn=1`
        const res = await getExternalTeacherListApi(url)
        console.log(res, 'res')
        const { data, status } = res
        if (status === 200) {
          data.data.forEach(item => {
            tikTokList.push({
              vidoeId: item.aweme_info.aweme_id,
              coverSrc:
                item.aweme_info.video.cover.url_list.length > 0
                  ? item.aweme_info.video.cover.url_list[0]
                  : '',
              title: item.aweme_info.desc,
              iframeSrc: `https://www.douyin.com/video/${item.aweme_info.aweme_id}`,
              playCount: item.playNum,
              zanCount: item.aweme_info.statistics.digg_count,
              publishDate: moment(item.aweme_info.create_time * 1000).format(
                'YYYY-MM-DD HH:mm:ss'
              ),
              duration: moment(item.aweme_info.video.duration).format('mm:ss'),
              ifLink: true,
              platform: 3
            })
          })
          // this.cursor = result.cursor
        }
      } catch (err) {
        console.log(err)
      }
      return tikTokList
    },
    // 小红书 /whosecard/api/xiaohongshu/search/notes/v1
    async getXiaohongshuList() {
      const XiaohongshuList = []
      if (!this.search.type.includes('5')) {
        return XiaohongshuList
      }
      try {
        let order
        if (this.search.sort === 1) {
          // 发布时间
          order = 'time_descending'
        } else if (this.search.sort === 2) {
          // 播放量
          order = 'popularity_descending'
        } else if (this.search.sort === 3) {
          // 点赞量
          order = 'general'
        }
        let keyword = this.search.keyWord
        if (this.search.industry && this.search.industry.length > 0) {
          const industry = this.$refs.cascader.getCheckedNodes(true)[0].label
          keyword = keyword + ' ' + industry
        }
        console.log(this.search.area, 'this.search.area')
        if (this.search.area !== '') {
          keyword = keyword + ' ' + this.search.area
        }
        const res = await getExternalTeacherListApi(
          `/whosecard/api/xiaohongshu/search/notes/v1?page=${this.current}&sort=general&filter_note_type=视频笔记&key=${key}&keyword=${keyword}&sort=${order}`
        )
        if (res.status === 200) {
          console.log(res, '小红书返回结果')
          const { ok, result } = res.data
          if (ok) {
            result.data.items.forEach(item => {
              // console.log('item', item, item.note?.video_info_v2?.media)
              let iframeSrc = ''
              if (
                item.note?.video_info_v2?.media?.stream.h264[0]?.backup_urls
              ) {
                if (
                  item.note?.video_info_v2?.media?.stream.h264[0]?.backup_urls
                    .length > 1
                ) {
                  const arr =
                    item.note.video_info_v2.media.stream.h264[0].backup_urls
                  arr.push(
                    item.note?.video_info_v2?.media?.stream.h264[0]?.master_url
                  )
                  arr.map(v => {
                    /sns-video-bd.xhscdn.com/.test(v) && (iframeSrc = v)
                  })
                } else {
                  iframeSrc =
                    item.note?.video_info_v2?.media.stream.h264[0]
                      .backup_urls[0]
                }
              } else {
                iframeSrc =
                  item.note?.video_info_v2?.media?.stream.h264[0]?.master_url
              }
              XiaohongshuList.push({
                vidoeId: item.note.id,
                coverSrc:
                  item.note.images_list.length > 0
                    ? item.note.images_list[0].url_size_large
                    : '',
                title: item.note.title + item.note.desc,
                iframeSrc,
                playCount: '',
                zanCount: item.note.liked_count,
                publishDate: moment(item.note.timestamp * 1000).format(
                  'YYYY-MM-DD HH:mm:ss'
                ),
                duration:
                  item.note.video_info?.media?.stream?.h264[0]?.video_duration,
                ifVideo: true,
                platform: 5
              })
            })
          }
        }
      } catch (err) {
        console.log(err, 'err')
      }
      return XiaohongshuList
    },
    // 快手 /whosecard/api/kuaishou/search
    async getKuaishouList() {
      const KuaishouList = []
      if (!this.search.type.includes('4')) {
        return KuaishouList
      }
      try {
        let keyword = this.search.keyWord
        if (this.search.industry && this.search.industry.length > 0) {
          const industry = this.$refs.cascader.getCheckedNodes(true)[0].label
          keyword = keyword + ' ' + industry
        }
        console.log(this.search.area, 'this.search.area')
        if (this.search.area !== '') {
          keyword = keyword + ' ' + this.search.area
        }
        const res = await getExternalTeacherListKuaiShouApi(
          `/whosecard/api/kuaishou/search?search_type=feed&key=${key}&keyword=${keyword}&pcursor=${this.current}`
        )
        console.log(res, '快手返回结果')
        if (res.status === 200) {
          const { ok, result } = res.data
          if (ok) {
            result.feeds.forEach(item => {
              KuaishouList.push({
                vidoeId: item.kwaiId,
                coverSrc:
                  item.coverUrls.length > 0 ? item.coverUrls[0].url : '',
                title: item.caption,
                iframeSrc: item.mainMvUrls[0].url,
                playCount: item.viewCount,
                zanCount: item.likeCount,
                publishDate: moment(item.timestamp).format(
                  'YYYY-MM-DD HH:mm:ss'
                ),
                duration: item.duration,
                ifVideo: true,
                platform: 4
              })
            })
          }
        }
      } catch (err) {
        console.log(err)
      }
      return KuaishouList
    },
    getAllList() {
      if (this.noMore) {
        return false
      }
      if (this.search.type.length < 1) {
        return this.$message.error('请选择视频渠道')
      }
      this.loading = true
      Promise.all([
        this.getBaiduVideoList(),
        this.getSogouVideoList(),
        this.getTikTokList2(),
        this.getXiaohongshuList(),
        this.getKuaishouList()
      ])
        .then(res => {
          console.log('获取到的数据', res)
          if (this.current === 1) {
            this.data = []
          }
          let count = 0
          res.forEach(item => {
            if (item) {
              count += item.length
              this.data = [...this.data, ...item]
            }
          })
          this.noMore = count === 0
          this.current += 1
          this.loading = false
          this.searchType = true
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
      // this.loading = false
    },
    openPlay(item) {
      // console.log(item, 'item')
      const teacherName = this.search.keyWord
      if (item.ifLink || !this.whiteIframeList.includes(item.author)) {
        this.dialog = {
          visible: true,
          title: '查看',
          width: '500px',
          height: 'auto',
          top: '20vh',
          form: {
            ...item,
            tearch: {
              teacherId: '',
              teacherName: ''
            },
            teacherName
          },
          loading: false
        }
        return
        // return window.open(item.iframeSrc, '_blank')
      }
      this.dialog = {
        visible: true,
        title: '查看',
        width: '1169px',
        height: '652px',
        top: '40px',
        form: {
          ...item,
          tearch: {
            teacherId: '',
            teacherName: ''
          },
          teacherName
        },
        loading: false
      }
      this.$nextTick(() => {
        if (item.ifVideo) {
          this.player = new Player({
            id: 'iframeVideo',
            width: '100%',
            height: '100%',
            url: item.iframeSrc,
            poster: item.coverSrc
          })
        }
      })
    },
    openUrl(form) {
      window.open(
        form.iframeSrc,
        '',
        'width=1000,height=800,left=200,right=200'
      )
    },
    searchFn() {
      this.current = 1
      this.cursor = 1
      // this.data = []
      this.noMore = false
      this.$uweb && this.$uweb.setAction('Event_Teacher_Center_Search')
      this.getAllList()
    },
    handleClickResetSearch() {
      this.searchFn()
    },
    // 点击选择老师
    teacherSelect(item) {
      this.dialog.form.tearch = item
    },
    // 点击收藏按钮
    collect() {
      console.log(this.dialog)
      this.dialog.loading = true
      if (this.radioClass === '1') {
        let type = ''
        if ([4, 5].includes(this.dialog.form.platform)) {
          type = 3 // 短视频
        } else {
          type = 2 // 网址
        }
        console.log('this.dialog.form.tearch', this.dialog.form.tearch)
        const data = {
          videos: [
            {
              platform: this.dialog.form.platform,
              type,
              url: this.dialog.form.iframeSrc
            }
          ],
          teacherId: this.dialog.form.tearch.teacherId,
          teacherName: this.dialog.form.teacherName
        }
        console.log('data', data)
        addAuditTeacher(data)
          .then(res => {
            this.dialog.loading = false
            this.$notify.success({ title: '提示', message: '收藏成功!' })
          })
          .catch(() => {
            this.dialog.loading = false
          })
      } else {
        let type = ''
        if ([4, 5].includes(this.dialog.form.platform)) {
          type = 3 // 短视频
        } else {
          type = 2 // 网址
        }
        // addAuditTeacher
        const data = {
          type: type,
          platform: this.dialog.form.platform,
          teacherId: this.dialog.form.tearch.teacherId,
          url: this.dialog.form.iframeSrc
        }
        collectTeacher(data)
          .then(res => {
            this.dialog.loading = false
            this.$notify.success({ title: '提示', message: '收藏成功!' })
          })
          .catch(() => {
            this.dialog.loading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  // height: 100%;
  .search {
    margin-left: 20px;
    margin-right: 20px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e7e7e7;
    .searchBtn {
      padding-bottom: 20px;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
    }
  }
  .contant {
    height: calc(100% - 156px);
    .sort {
      padding-left: 20px;
      padding-right: 20px;
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      margin-bottom: 20px;
      .sortTitle {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #333333;
        line-height: 24px;
      }
    }
    .infinite-list {
      height: calc(100% - 52px);
      .list_falls {
        padding-top: 20px;
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        margin-left: 5px;
        margin-right: 5px;
        .listView {
          flex: 25% 0 0;
          padding-left: 10px;
          padding-right: 10px;
          margin-bottom: 30px;
          .listViewContant {
            .list_image {
              overflow: hidden;
              background-color: #f0edf1;
              width: 100%;
              padding-top: 63%;
              box-sizing: border-box;
              border-radius: 12px;
              border: 1px solid #fff;
              cursor: pointer;
              /* 背景图垂直、水平均居中 */
              background-position: center center;
              /* 背景图不平铺 */
              background-repeat: no-repeat;
              background-size: cover;
              position: relative;
              &:hover {
                border: 1px solid #0c6fff;
                box-shadow: 0px 12px 18px 0px rgba(22, 22, 22, 0.25);
              }
              .list_image_url {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
              }
            }
            .list_title {
              margin-top: 12px;
              height: 44px;
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #333333;
              line-height: 22px;
            }
            .list_play {
              display: flex;
              justify-content: space-between;
            }
            .list_public {
              display: flex;
              justify-content: space-between;
            }
            .list_text {
              font-size: 12px;
              font-family: MicrosoftYaHei;
              color: #777777;
              line-height: 20px;
            }
          }
        }
        .loading {
          height: 32px;
          width: 100%;
          text-align: center;
          line-height: 32px;
          background: #777;
        }
        > .noData {
          margin: 224px auto 0;
          > img {
            width: 405px;
            height: 202px;
          }
        }
        > .noSearch {
          margin: 223px auto 0;
          > img {
            width: 405px;
            height: 202px;
          }
        }
      }
    }
    .loadingStatus {
      position: absolute;
      bottom: 65px;
      left: 50%;
      right: 0;
      z-index: 10;
      border: 1px solid #fff;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      width: 30px;
      height: 30px;
      border-radius: 50%;
      .loadingSvg {
        font-size: 28px;
        animation: mymove 1s infinite;
      }
    }
  }
}
.dialogModle {
  width: 1169px;
  height: 652px;
}

.footerfooter {
  width: 1168px;
  height: 120px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  .footer-center {
    .footer-box {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      .footer-title {
        width: 80px;
        height: 22px;
        font-size: 14px;
        color: #333333;
      }
      .footer-info {
        flex: 1;
        display: flex;
        justify-content: flex-start;
      }
    }
  }
}
.my-popover {
  padding: 0 !important;
}
::v-deep {
  .tearchInput {
    .el-input__inner {
      cursor: pointer;
      background-color: #fff;
      color: #000;
    }
  }
}
.infinite-list {
  height: 700px;
  position: relative;
}

.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 2s;
}
.fade-enter-to {
  opcaity: 1;
}
.fade-leave-from {
  opacity: 1;
}
.fade-leave-active {
  transition: all 2s;
}
.fade-leave-to {
  opcaity: 0;
}

@keyframes mymove {
  100% {
    transform: rotate(360deg);
  }
}
</style>
