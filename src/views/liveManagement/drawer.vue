<template>
  <div class="liveDrawer">
    <!-- 新增/编辑 -->
    <div class="liveDrawerForm">
      <el-form ref="form" v-loading="loading" :model="form" label-width="120px" :rules="rules">
        <div class="header_tips">
          基本信息
        </div>
        <div class="m-t-20">
          <el-form-item label="直播名称" prop="liveName">
            <el-input v-model="form.liveName" placeholder="建议输入14字以内，不超过50字" maxlength="50" show-word-limit />
          </el-form-item>
          <el-form-item label="直播简介" prop="liveDes">
            <el-input v-model="form.liveDes" placeholder="请输入不超过200字的简介内容" type="textarea" :autosize="{ minRows: 4 }" maxlength="200" show-word-limit />
          </el-form-item>
          <!-- <el-form-item label="直播老师" prop="lecturer">
            <el-tag
              v-for="(item, index) in form.lecturer"
              :key="index"
              closable
              class="m-r-20"
              @close="handleDelLecturer(item, index)"
            >
              {{ item.lecturerName }}
            </el-tag>
            <el-button size="small" @click="selectLectur">选择</el-button>
          </el-form-item> -->

          <el-form-item label="选择IP" prop="lecturerIds">
            <el-select v-model="form.lecturerIds" placeholder="请选择IP" multiple>
              <el-option
                v-for="item in teacherOption"
                :key="item.lecturerId"
                :label="item.lecturerName"
                :value="item.lecturerId"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="直播模式">
            <el-radio-group v-model="form.liveMode">
              <el-radio :label="1">横屏模式</el-radio>
              <!-- <el-radio :label="2">竖屏模式</el-radio>
              <el-radio :label="3">语音直播</el-radio>
              <el-radio :label="4">录播直播</el-radio> -->
            </el-radio-group>
            <div class="caseShow">
              <div class="demoShow">选题展示</div>
              <img src="@/assets/image/livemode_1.png" width="250px" alt="" />
              <!-- 选题展示，根据选择更换展示图片 -->
            </div>
          </el-form-item>
          <el-form-item label="直播开始时间" prop="liveStartTime">
            <el-date-picker v-model="form.liveStartTime" :picker-options="pickerOptions" type="datetime" placeholder="选择日期时间" />
          </el-form-item>
          <el-form-item label="直播时长" prop="liveDuration">
            <!-- <el-input-number v-model="form.liveDuration" controls-position="right" :min="0" /> -->
            <!-- 小时 -->
            <el-select v-model="form.liveDuration" placeholder="请选择">
              <el-option
                v-for="item in liveTimeLengthOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="方形缩略图" prop="squCoverUrl">
            <div>
              <div v-if="!form.squCoverUrl" class="image_posterUrl" style="width: 138px;height: 138px" @click="getImgUrl('squCoverUrl')">
                <i class="el-icon-plus" />
                <span>点击上传图片</span>
              </div>
              <div v-else>
                <AppMyImage
                  :src="form.squCoverUrl"
                  style="width: 138px;height: 138px"
                  :options="{
                    width: 750,
                    fixed: true,
                    option: {
                      fixed: true,
                      fixedNumber: [1, 1],
                      fixedBox: false
                    }
                  }"
                  @close="delImage('squCoverUrl')"
                  @success="(res) => changeImage('squCoverUrl', res)"
                />
              </div>
              <div class="tips m-t-20">
                <div>方形缩略图是指在商品列表展示的图片。</div>
                <div>建议尺寸750*750，小于500K的JPG、PNG格式图片</div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="横版缩略图" prop="horCoverUrl">
            <div>
              <div v-if="!form.horCoverUrl" class="image_posterUrl" style="width: 200px;height: 150px" @click="getImgUrl('horCoverUrl')">
                <i class="el-icon-plus" />
                <span>点击上传图片</span>
              </div>
              <div v-else>
                <AppMyImage
                  :src="form.horCoverUrl"
                  style="width: 200px;height: 150px"
                  :options="{
                    width: 567,
                    fixed: true,
                    option: {
                      fixed: true,
                      fixedNumber: [4, 3],
                      fixedBox: false
                    }
                  }"
                  @close="delImage('horCoverUrl')"
                  @success="(res) => changeImage('horCoverUrl', res)"
                />
              </div>
              <div class="tips m-t-20">
                <div>横版缩略图是指在商品列表展示的图片。</div>
                <div>建议尺寸750*563或比例4:3，小于500K的JPG格式图片</div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="海报图片" prop="posterUrl">
            <div class="posterView">
              <template v-if="form.posterUrl.length > 0">
                <div v-for="(item, index) in form.posterUrl" :key="index" class="m-r-10">
                  <AppMyImage
                    :src="item"
                    style="width: 160px;height: 120px"
                    :options="{
                      width: 750,
                      fixed: true,
                      option: {
                        fixed: true,
                        fixedNumber: [4, 3],
                        fixedBox: false
                      }
                    }"
                    @close="delPosterUrl(item, index)"
                    @success="(res) => changePosterUrlImage(item, index, res)"
                  />
                </div>
              </template>
              <div v-if="form.posterUrl" class="image_poster" style="width: 160px;height: 120px" @click="addPosterUrl()">
                <i class="el-icon-plus" />
                <span>点击选择图片</span>
              </div>
            </div>
            <div class="tips m-t-20">
              <div>建议尺寸750*1125或比例2:3,小于2M的jpg,png格式的图片;可上传多张</div>
            </div>
          </el-form-item>
          <el-form-item label="暖场封面">
            <div>
              <div v-if="!form.warnCoverUrl" class="image_posterUrl" style="width: 200px;height: 112.5px" @click="getImgUrl('warnCoverUrl')">
                <i class="el-icon-plus" />
                <span>点击上传图片</span>
              </div>
              <div v-else>
                <AppMyImage
                  :src="form.warnCoverUrl"
                  style="width: 200px;height: 112.5px"
                  :options="{
                    width: 567,
                    fixed: true,
                    option: {
                      fixed: true,
                      fixedNumber: [16, 9],
                      fixedBox: false
                    }
                  }"
                  @close="delImage('warnCoverUrl')"
                  @success="(res) => changeImage('warnCoverUrl', res)"
                />
              </div>
              <div class="tips m-t-20">
                <div>建议尺寸750*422或比例16:9,小于2M</div>
                <div>只能上传一张jpg图片</div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="暖场视频">
            <div class="fl videoUpload">
              <!-- <div class="w-200 m-r-30"> -->
              <video v-if="form.warnVideoUrl" :src="form.warnVideoUrl" style="width: 200px; height: 112.5px" class="video-selector__left">
                <!-- <img src="~@/assets/image/video_cover.png" alt=""> -->
              </video>
              <!-- </div> -->
              <div class="m-l-20">
                <div>
                  <el-button @click="getVideo()">选择文件</el-button>
                </div>
                <div class="tips m-t-20">
                  <div>支持mp4，avi，wmv，flv，rmvb，3gp，m4v，mkv格式；文件最大不超过5G。</div>
                  <div>当前店铺版本最大支持1080超清转码;横版视频尺寸为16:9</div>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="直播详情">
            <!-- <el-input v-model="form.des" /> -->
            <AppUEditor v-model="form.liveDetails" @change="change" />
          </el-form-item>
          <el-form-item label="IP设置" prop="anchorList">
            <!-- <el-input v-model="form.anchorList" /> -->
            <el-button @click="addAnchor">添加IP/助教</el-button>

            <el-table v-if="form.anchorList.length > 0" :data="form.anchorList" style="width: 720px" max-height="500px">
              <el-table-column prop="name" label="主讲/助教" width="180">
                <template slot-scope="{ row }">
                  <div class="adminRole">
                    <AppAvatar class="m-l-10" :avatar="row.headImg" width="36" :name="row.name" :no-name="true" />
                    <div class="m-l-10">
                      <span class="adminRoleName" :title="row.name">{{ row.name }}</span>
                      <span v-if="row.controlType === 1" class="adminRoleRole">
                        <el-tag size="mini">主控人</el-tag>
                      </span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="角色" width="180">
                <template slot-scope="{ row }">
                  <el-select v-model="row.type">
                    <el-option label="老师" :value="1" />
                    <el-option label="助教" :value="2" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="aliasName" label="角色名称C端显示" width="180">
                <template slot-scope="{ row }">
                  <el-input v-model="row.aliasName" placeholder="IP/助手等" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.controlType === 0" type="text" @click="changeAnchorListControlFlag(scope.row, scope.$index)">设为主控人</el-button>
                  <el-button v-if="scope.row.controlType === 0" type="text" @click="delAnchor(scope.row)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="回放设置">
            <el-switch v-model="form.replay" />
          </el-form-item>
          <el-form-item v-if="form.replay" label="回放有效期" prop="replayValidity">
            <!-- <el-switch v-model="form.replay" /> -->
            <el-radio-group v-model="form.replayValiditySetting">
              <el-radio style="width: 100%" :label="1" class="m-t-10">永久</el-radio>
              <el-radio :label="2" style="width: 100%" class="m-t-10">
                <span>限时，截止至</span>
                <el-date-picker
                  v-model="form.replayValidity"
                  class="m-l-20"
                  :disabled="form.replayValiditySetting !== 2"
                  type="datetime"
                  placeholder="请设置截止日期"
                  :picker-options="pickerOptions"
                />
              </el-radio>
            </el-radio-group>
            <div class="tips">到期后，学员无法观看回放内容，但仍可进入直播间查看聊天内容及共享文件</div>
          </el-form-item>
          <el-form-item v-if="form.replay" label="倍速/快进" prop="speed">
            <!-- <el-switch v-model="form.replay" /> -->
            <el-radio-group v-model="form.speed">
              <el-radio :label="true" style="width: 100%" class="m-t-10">允许</el-radio>
              <el-radio :label="false" style="width: 100%" class="m-t-10">禁止</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="header_tips">
          商品信息
        </div>
        <div class="m-t-20">
          <el-form-item label="售卖方式" prop="sale">
            <el-checkbox v-model="form.relationSaleFlag" :true-label="0" :false-label="1">支持单独售卖</el-checkbox>
            <span>客户可以通过店铺或链接的方式单独购买该商品</span>

            <div class="sale-container m-b-20 m-l-20">
              <el-radio-group v-model="form.materialSalePicReq.saleType" style="width: 776px" @change="saleTypeChange">
                <el-radio :label="0">免费</el-radio>
                <el-radio :label="1">付费</el-radio>
                <!-- <el-radio :label="2">加密</el-radio> -->
                <!-- <el-radio :label="3">指定学员</el-radio> -->
              </el-radio-group>

              <div>
                <template v-if="form.materialSalePicReq.saleType === 1" ref="materialSalePicReqForm">
                  <el-form-item label="商品价格" prop="materialSalePicReq.salePrice" :rules="rules.materialSalePicReqRule.salePrice" style="margin-bottom: 20px">
                    <el-input-number
                      v-model.number="form.materialSalePicReq.salePrice"
                      :min="0.0001"
                      controls-position="right"
                      class="w-200 m-r-10"
                    />
                    <span class="m-l-10">元</span>
                  </el-form-item>
                  <el-form-item label="划线价格" prop="materialSalePicReq.marketPrice" :rules="rules.materialSalePicReqRule.marketPrice" style="margin-bottom: 20px">
                    <el-input v-model="form.materialSalePicReq.marketPrice" type="number" :min="0" controls-position="right" style="width: 200px;" />
                    <span class="m-l-10">元</span>
                  </el-form-item>
                  <div class="tips m-t-10">商品没有其他优惠（如拼团）的情况下，划线价格在商品详情会以划线形式显示</div>
                </template>

                <div v-if="form.materialSalePicReq.saleType === 2" class="m-b-10">
                  <div class="sale-input__label">密码</div>
                  <div class="sale-input__input">
                    <el-input
                      v-model="form.materialSalePicReq.password"
                      placeholder="请设置3-12位字母、数字或汉字格式密码"
                      style="width: 328px"
                    />
                  </div>
                </div>

                <div v-if="form.materialSalePicReq.saleType === 3" class="tips m-b-10">
                  仅被指定学员可免费学习课程，添加指定学员请前往【课程详情-学员列表】手动操作
                </div>

                <div>
                  <div class="vaildTimeText">课程有效期</div>
                  <div class="validTime">
                    <el-radio-group v-model="form.materialSalePicReq.saleValidity">
                      <el-radio :label="0" class="w-500 m-b-20" disabled>长期有效</el-radio>
                      <el-radio :label="1" class="w-500 m-b-20" :disabled="form.materialSalePicReq.saleType === 0">
                        购买后
                        <el-input-number v-model.number="form.materialSalePicReq.validityDays" :disabled="form.materialSalePicReq.saleValidity !== 1" :min="1" controls-position="right" class="w-200 m-r-10" />
                        <span>天有效</span>

                        <el-checkbox
                          v-model="form.materialSalePicReq.repeatPurchase"
                          class="m-l-20"
                          :true-label="0"
                          :false-label="1"
                          :disabled="form.materialSalePicReq.saleValidity !== 1"
                        >
                          允许学员在有效期内重复购买
                        </el-checkbox>
                      </el-radio>
                      <el-radio :label="2" class="w-500" :disabled="form.materialSalePicReq.saleType === 0">
                        固定时间
                        <el-date-picker
                          v-model="form.materialSalePicReq.fixedTime"
                          class="m-l-10"
                          :disabled="form.materialSalePicReq.saleValidity !== 2"
                          type="datetime"
                          placeholder="选择日期时间"
                        />
                      </el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </div>
            </div>

            <div class="tips m-l-20 m-b-20">课程带货：可同时关联实物商品和课程售卖，实物商品运费由商家承担，最多支持添加10个实物商品和课程</div>

            <!-- <div v-if="form.materialSalePicReq.saleType === 1" class="add-course-ware-btn m-l-20 m-b-20"><i class="el-icon-plus" />选择商品</div> -->

            <el-checkbox v-model="form.saleFlag" :true-label="0" :false-label="1">支持关联售卖</el-checkbox>
            <span class="tips m-l-20">该商品放入专栏/训练营中售卖</span>
            <div class="tips m-b-20" style="margin-left: 128px">[注：会员中新增、移除内容时，对于已经购买该会员的用户，需要一定时间更新该用户的权益（一般为10分钟左右）]</div>
            <div
              v-if="form.saleFlag === 0"
              class="add-course-ware-btn m-l-20"
              style="width: 195px"
              @click="selectColumn()"
            >
              <i class="el-icon-plus" />
              选择专栏/训练营
            </div>

            <!-- 关联专栏列表 -->
            <el-table
              v-if="form.materialGoodsReVoList && form.materialGoodsReVoList.length > 0 && form.saleFlag === 0"
              :header-cell-style="{background: '#f5f5f5', padding: '0'}"
              style="width: 800px; margin-top: 20px"
              :data="form.materialGoodsReVoList"
              max-height="450"
            >
              <el-table-column prop="materialName" label="文件">
                <template slot-scope="{ row }">
                  <div class="fl fl_ai_c">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="row.coverUrl"
                    />
                    <div class="m-l-20">
                      <div class="m-picture-title" :title="row.contentName">{{ row.contentName }}</div>
                      <div v-if="row.saleType === 0" class="c_777">免费</div>
                      <div v-if="row.saleType === 2" class="c_777">加密</div>
                      <div v-if="row.saleType === 1" class="c_777">￥{{ row.salePrice | filtersMoney }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="materialSize" label="类型" width="120">
                <template slot-scope="{ row }">
                  {{
                    goodsType_obj[row.goodsType]
                  }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click.native.prevent="deleteRow(scope.$index, form.materialGoodsReVoList)"
                  >
                    取消关联
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select
              v-model="form.groupingPicReqList"
              v-loading="catalogueLoading"
              multiple
              placeholder="选择商品分类"
              class="w-300"
              element-loading-spinner="el-icon-loading"
            >
              <el-option
                v-for="item in goodsGroupingOption"
                :key="item.catalogueId"
                :label="item.catalogueName"
                :value="item.catalogueId"
              />
            </el-select>
            <span v-loading="catalogueLoading" class="EC1 m-l-20 pointer" element-loading-spinner="el-icon-loading" @click="_getCatalogueList">
              刷新
            </span>
            <!-- <el-divider direction="vertical" />
          <router-link :to="{name: 'GoodsDivisionList'}" target="_blank">
            <span class="EC1 pointer">前往商品分类 ></span>
          </router-link> -->
          </el-form-item>
        </div>

        <div class="header_tips m-t-50">
          上架设置
        </div>

        <div class="m-t-20">
          <el-form-item label="上架设置">
            <el-radio-group v-model="form.shelveFlag">
              <el-radio :label="0" style="width: 100%" class="m-t-10">立即上架</el-radio>
              <el-radio :label="2" class="m-t-10">
                <span>定时上架</span>
                <el-date-picker
                  v-model="form.shelveTime"
                  class="m-l-20"
                  :disabled="form.shelveFlag !== 2"
                  type="datetime"
                  placeholder="请设置时间"
                  :picker-options="pickerOptions"
                />
              </el-radio>
              <el-radio :label="1" style="width: 100%" class="m-t-10">暂不上架</el-radio>
            </el-radio-group>

            <div class="EC1 m-t-20 m-b-10">更多设置</div>
            <div>
              <el-checkbox v-model="form.shelveHideFlag" :true-label="1" :false-label="0">隐藏</el-checkbox>
              <span class="tips m-l-20">上架的商品设置隐藏后，在店铺内不显示，但可以通过链接的方式访问</span>
            </div>
            <div>
              <el-checkbox v-model="form.androidHideFlag" :true-label="1" :false-label="0">在APP-安卓端隐藏</el-checkbox>
              <el-checkbox v-model="form.iosHideFlag" :true-label="1" :false-label="0">在APP-IOS端隐藏</el-checkbox>
              <el-checkbox v-model="form.appletHideFlag" :true-label="1" :false-label="0">在微信小程序端隐藏</el-checkbox>
              <el-checkbox v-model="form.douAppletHideFlag" :true-label="1" :false-label="0">在抖音小程序端隐藏</el-checkbox>
              <el-checkbox v-model="form.htmlHideFlag" :true-label="1" :false-label="0">在H5隐藏</el-checkbox>
            </div>
            <!-- <div>
              <el-checkbox v-model="form.shelveHaltFlag" :true-label="1" :false-label="0">停售</el-checkbox>
              <span class="tips m-l-20">上架的商品设置停售后，将停止售卖</span>
            </div> -->
            <el-divider />
            <div class="tips">
              <i class="el-icon-warning" />
              根据您上传的音视频大小需要0-30分钟不等的转码时间，转码过程中该商品将隐藏不可显示，转码完成后会根据您的设置进行显示/隐藏。
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="footer">
      <el-button :loading="loading" @click="$emit('close')">取消</el-button>
      <el-button type="primary" :loading="loading" @click="sure">确定</el-button>
    </div>

    <AppDialog
      v-model="mode.visible"
      :title="mode.title"
      width="700px"
      height="auto"
    >
      <selectLivePlay
        :disabled-id="[AnchorId]"
        :defulat="form.anchorList"
        :visible="mode.visible"
        @close="mode.visible = false"
        @success="selectAnchor"
      />
      <div slot="footer" />
    </AppDialog>
  </div>
</template>

<script>
import AppUEditor from '@/components/AppUEditor'
import { getTeacherList, getCatalogueList } from '@/api/shop'
import { addLiveRoom, editLiveRoom, getLiveDetail } from '@/api/live/live.js'
import selectLivePlay from './selectLivePlay.vue'
import AppDialog from '@/components/AppDialog'
import AppMyImage from '@/components/AppMyImage'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { mapGetters } from 'vuex'

// 表单默认数据
const defaultForm = {
  liveName: '', // 直播名称
  liveMode: 1, // 直播模式
  liveDes: '', // 直播简介
  lecturer: [], // 直播老师数组
  lecturerIds: [], // 直播老师id集
  liveStartTime: '', // 直播时间
  liveDuration: '', // 直播时长
  squCoverUrl: '', // 方形缩略图
  horCoverUrl: '', // 横版缩略图
  posterUrl: [], // 海报图片
  liveDetails: '', // 直播详情
  anchorList: [], // 直播主播信息
  warnCoverUrl: '', // 暖场封面
  warnVideoUrl: '', // 暖场视频
  replay: false, // 是否开启回放设置
  replayValiditySetting: 1, // 回放有效期前端展示字段: 1: 永久 2:限时
  replayValidity: '', // 回放有效期: null表示永久 不为null表示限时。
  playbackValidityDays: 0, // 回放限时时间
  speed: true, // 回放倍速
  // materialVo: { // 选择的视频信息
  //   dirId: '',
  //   materialDes: '',
  //   materialId: '',
  //   materialFrameUrl: '',
  //   materialName: '',
  //   materialSize: '',
  //   materialType: '',
  //   materialUrl: ''
  // },
  relationSaleFlag: 0,
  materialSalePicReq: { // 售卖方式关联商品集合
    fixedTime: '', // 课程有效期-固定时间 【sale_validity =2时生效】
    goodsId: '', // 商品信息关联id
    marketPrice: '', // 商品划线价格 单位分
    password: '', // 密码
    repeatPurchase: 0, // 是否允许学员重复购买 0允许,1,不允许
    salePrice: '', // 商品价格 单位：分
    saleType: 0, // 类型 0免费,1,付费 2,加密 3,指定学员
    saleValidity: 0, // 课程有效期 0长期有效,1,购买后 2,固定时间
    validityDays: 0 // 课程有效期
  },
  groupingPicReqList: [], // 商品分类ids
  shelveFlag: 0,
  materialGoodsReVoList: [], // 关联商品数组
  goodsReqList: [], // 关联商品ids
  shelveTime: '', // 定时上架时间shelveFlag==2是生效
  shelveTimingTime: '', // 定时上架时间shelveFlag==2是生效
  shelveHideFlag: 0, // 上架更多设置是否隐藏(0不隐藏，1隐藏)
  androidHideFlag: 0,
  iosHideFlag: 0,
  appletHideFlag: 0,
  douAppletHideFlag: 0,
  htmlHideFlag: 0
}
export default {
  components: {
    AppUEditor,
    selectLivePlay,
    AppDialog,
    AppMyImage,
    AppAvatar
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 1 // 1: 新增 2：编辑
    },
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    var validateSale = (rule, value, callback) => {
      if (this.form.relationSaleFlag === 1 && this.form.saleFlag === 1) {
        callback(new Error('请选择售卖方式!'))
      } else {
        callback()
      }
    }
    var checkSalePrice = (rule, value, callback) => {
      if (this.form.materialSalePicReq.salePrice === '') {
        callback(new Error('请输入商品价格!'))
      } else if (Number(this.form.materialSalePicReq.salePrice) === 0) {
        callback(new Error('商品价格要大于0!'))
      } else if (this.form.materialSalePicReq.marketPrice && this.form.materialSalePicReq.salePrice >= this.form.materialSalePicReq.marketPrice) {
        callback(new Error('商品价格要小于划线价格!'))
      } else {
        if (this.form.materialSalePicReq.salePrice < this.form.materialSalePicReq.marketPrice) {
          this.$refs.form.clearValidate('materialSalePicReq.marketPrice')
        }
        callback()
      }
    }
    var checkMarketPrice = (rule, value, callback) => {
      if (this.form.materialSalePicReq.marketPrice === '') {
        return callback()
      }
      if (this.form.materialSalePicReq.marketPrice <= this.form.materialSalePicReq.salePrice) {
        callback(new Error('划线价格要大于商品价格!'))
      } else {
        if (this.form.materialSalePicReq.salePrice < this.form.materialSalePicReq.marketPrice) {
          this.$refs.form.clearValidate('materialSalePicReq.salePrice')
        }
        callback()
      }
    }
    var validateReplayValidity = (rule, value, callback) => {
      if (this.form.replay && this.form.replayValiditySetting === 2 && !this.form.replayValidity) {
        return callback(new Error('请设置截止日期!'))
      } else {
        callback()
      }
    }
    var validaAnchor = (rule, value, callback) => {
      if (this.form.anchorList.length === 0) {
        return callback(new Error('请选择IP/助教!'))
      } else {
        const index = value.findIndex(v => v.controlType === 1)
        if (index < 0) {
          return callback(new Error('请设置主控人!'))
        } else {
          callback()
        }
      }
    }
    return {
      loading: false,
      form: {
        liveName: '', // 直播名称
        mode: 1, // 直播模式
        liveDes: '', // 直播简介
        lecturer: [], // 直播老师数组
        lecturerIds: [], // 直播老师id集
        liveStartTime: '', // 直播时间
        liveDuration: '', // 直播时长
        squCoverUrl: '', // 方形缩略图
        horCoverUrl: '', // 横版缩略图
        posterUrl: [], // 海报图片
        liveDetails: '', // 直播详情
        anchorList: [], // 直播主播信息
        warnCoverUrl: '', // 暖场封面
        warnVideoUrl: '', // 暖场视频
        replay: false, // 是否开启回放设置
        replayValiditySetting: 1, // 回放有效期前端展示字段: 1: 永久 2:限时
        replayValidity: '', // 回放有效期: null表示永久 不为null表示限时。
        playbackValidityDays: 0, // 回放限时时间
        speed: true, // 回放倍速
        // materialVo: { // 选择的视频信息
        //   dirId: '',
        //   materialDes: '',
        //   materialId: '',
        //   materialFrameUrl: '',
        //   materialName: '',
        //   materialSize: '',
        //   materialType: '',
        //   materialUrl: ''
        // },
        relationSaleFlag: 0,
        materialSalePicReq: { // 售卖方式关联商品集合
          fixedTime: '', // 课程有效期-固定时间 【sale_validity =2时生效】
          goodsId: '', // 商品信息关联id
          marketPrice: '', // 商品划线价格 单位分
          password: '', // 密码
          repeatPurchase: 0, // 是否允许学员重复购买 0允许,1,不允许
          salePrice: undefined, // 商品价格 单位：分
          saleType: 0, // 类型 0免费,1,付费 2,加密 3,指定学员
          saleValidity: 0, // 课程有效期 0长期有效,1,购买后 2,固定时间
          validityDays: 0 // 课程有效期
        },
        groupingPicReqList: [], // 商品分类ids
        shelveFlag: 0,
        goodsReqList: [], // 关联商品ids
        shelveTime: '', // 定时上架时间shelveFlag==2是生效
        shelveTimingTime: '', // 定时上架时间shelveFlag==2是生效
        shelveHideFlag: 0, // 上架更多设置是否隐藏(0不隐藏，1隐藏)
        androidHideFlag: 0,
        iosHideFlag: 0,
        appletHideFlag: 0,
        htmlHideFlag: 0,
        materialId: '' // 素材id
      },
      goodsGroupingOption: [],
      rules: {
        materialSalePicReqRule: {
          salePrice: [
            { validator: checkSalePrice, trigger: 'change', required: true }
          ],
          marketPrice: [
            { validator: checkMarketPrice, trigger: 'change' }
          ]
        },
        liveName: [
          { required: true, message: '请输入直播间名称', trigger: 'blur' }
        ],
        liveDes: [
          { required: true, message: '请输入直播简介', trigger: 'blur' }
        ],
        lecturer: [
          { required: true, type: 'array', message: '请选择直播老师', trigger: 'change' }
        ],
        liveStartTime: [
          { required: true, message: '请选中直播开始时间', trigger: 'blur' }
        ],
        squCoverUrl: [
          { required: true, message: '请选择方形缩略图', trigger: 'blur' }
        ],
        horCoverUrl: [
          { required: true, message: '请选择横版缩略图', trigger: 'blur' }
        ],
        anchorList: [
          { required: true, trigger: 'blur', type: 'array', validator: validaAnchor }
        ],
        sale: [
          { required: true, validator: validateSale, trigger: 'change' }
        ],
        replayValidity: [
          { required: true, validator: validateReplayValidity, trigger: 'change' }
        ]
      },
      // 设置选择今天以及今天之后的日期
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      catalogueLoading: false,
      // 添加讲师弹框
      mode: {
        visible: false
      },
      // 主控人id,禁止删除的时候使用
      AnchorId: '',
      liveTimeLengthOptions: [
        { label: '1小时', value: 1 },
        { label: '1.5小时', value: 1.5 },
        { label: '2小时', value: 2 },
        { label: '2.5小时', value: 2.5 },
        { label: '3小时', value: 3 },
        { label: '1天', value: 24 },
        { label: '2天', value: 48 },
        { label: '永久', value: '' }
      ],
      teacherOption: []
    }
  },
  computed: {
    ...mapGetters([
      'goodsType_obj'
    ])
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.getTeacherList()
          this._getCatalogueList()
        }
        if (this.type === 1) {
          this.form = JSON.parse(JSON.stringify(defaultForm))
        } else if (val && this.type === 2) {
          this.getLiveDetail()
        }

        if (!val) {
          this.$refs.form && this.$refs.form.resetFields()
        }
      },
      immediate: true
    },
    'phoneAddMode.value': function(curVal, oldVal) {
      if (!curVal) {
        this.phoneAddMode.value = ''
        return false
      }
      // 实时把非数字的输入过滤掉
      this.phoneAddMode.value = curVal.match(/\d/gi) ? curVal.match(/\d/gi).join('') : ''
    }
  },
  mounted() {},
  methods: {
    // 获取直播详情数据
    getLiveDetail() {
      this.loading = true
      const params = {
        id: this.id
      }
      getLiveDetail(params).then(res => {
        console.log(res)
        let anchorList = []
        if (res.data.anchorLiveVoList) {
          anchorList = res.data.anchorLiveVoList
        }
        if (res.data.materialSaleVo) {
          res.data.materialSaleVo.salePrice = (res.data.materialSaleVo.salePrice || 0) / 100
          if (Number(res.data.materialSaleVo.marketPrice) === 0) {
            res.data.materialSaleVo.marketPrice = ''
          } else {
            res.data.materialSaleVo.marketPrice = (res.data.materialSaleVo.marketPrice || 0) / 100
          }
        } else {
          res.data.materialSaleVo = { // 售卖方式关联商品集合
            fixedTime: '', // 课程有效期-固定时间 【sale_validity =2时生效】
            goodsId: '', // 商品信息关联id
            marketPrice: '', // 商品划线价格 单位分
            password: '', // 密码
            repeatPurchase: 0, // 是否允许学员重复购买 0允许,1,不允许
            salePrice: '', // 商品价格 单位：分
            saleType: 0, // 类型 0免费,1,付费 2,加密 3,指定学员
            saleValidity: 0, // 课程有效期 0长期有效,1,购买后 2,固定时间
            validityDays: 0 // 课程有效期
          }
        }
        const groupingPicReqList = []
        if (res.data.catalogueGroupingVoList) {
          res.data.catalogueGroupingVoList.map(v => groupingPicReqList.push(v.catalogueId))
        }
        let posterUrl = []
        if (res.data.posterUrl) {
          posterUrl = res.data.posterUrl.split(',')
        }
        // console.log(posterUrl, 'posterUrl')
        // catalogueGroupingVoList
        this.form = {
          ...JSON.parse(JSON.stringify(defaultForm)),
          ...res.data,
          materialSalePicReq: res.data.materialSaleVo,
          groupingPicReqList,
          posterUrl,
          liveDuration: res.data.liveDuration ? res.data.liveDuration : '',
          anchorList
        }
        // console.log(myform, 'myform')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 刷新分组
    _getCatalogueList() {
      this.catalogueLoading = true
      getCatalogueList().then(res => {
        console.log(res, '获取的商品分组列表')
        this.goodsGroupingOption = res.data
        this.catalogueLoading = false
      }).catch(() => {
        this.catalogueLoading = false
      })
    },
    // 获取直播老师列表
    getTeacherList() {
      this.tearchLoading = true
      getTeacherList().then(res => {
        this.teacherOption = res.data
        this.tearchLoading = false
      }).catch(() => {
        this.tearchLoading = false
      })
    },
    // 富文本编辑器内容改变时触发
    change(e) {},
    // 售卖方式改变时触发
    saleTypeChange(e) {
      console.log(e)
      this.form.materialSalePicReq.saleValidity = 0
      if (e === 0) {
        // 免费的音频不用设置片段试看
        this.$set(this.form, 'fragmentTrialFlag', 1)
      } else {
        this.form.materialSalePicReq.saleValidity = 1
      }
    },
    // 选择专栏
    selectColumn() {
      const goodsReqList = []
      this.form.materialGoodsReVoList && this.form.materialGoodsReVoList.map(v => {
        goodsReqList.push(v.goodsId)
      })
      this.$SelectGoods({
        visible: true,
        check: goodsReqList,
        multiple: true,
        initSearch: {
          tagType: 5
        },
        tabList: [
          { id: '3', name: '普通专栏', api: '' }
        ],
        currentId: '3',
        success: (res) => {
          console.log(res, 'res')
          this.form.materialGoodsReVoList = this.form.materialGoodsReVoList.concat(res)
        }
      })
    },

    // 选择图片
    getImgUrl(key) {
      this.$SelectMaterial({
        visible: true,
        types: [0],
        success: (res) => {
          console.log(res, 'res')
          this.form[key] = res.materialUrl
        }
      })
    },
    // 删除图片
    delImage(key) {
      this.form[key] = ''
    },
    // 裁剪图片
    changeImage(key, res) {
      this.form[key] = res
    },
    // 选择视频
    getVideo() {
      this.$SelectMaterial({
        visible: true,
        types: [2],
        success: (res) => {
          console.log(res, 'res')
          this.form.warnVideoUrl = res.materialUrl
          // console.log(res, '选择的视频文件 ')
          // this.form.materialId = res.materialId
          // this.form.materialVo = res
        }
      })
    },
    // 选择直播老师
    selectLectur() {
      this.$Select({
        type: 'teacher',
        visible: true,
        multiple: true,
        defultCheck: this.form.lecturer,
        success: (res) => {
          console.log(res, 'res')
          this.form.lecturer = res
        }
      })
    },
    // 删除选中的直播老师
    handleDelLecturer(item, index) {
      this.form.lecturer.splice(index, 1)
    },
    // 选择讲师/助教弹框
    addAnchor() {
      this.mode.visible = true
    },
    // 选中的讲师/助教返回
    selectAnchor(res) {
      const anchorList = []
      res.map((v, i) => {
        const index = this.form.anchorList.findIndex(e => v.id === e.id)
        if (index < 0) {
          anchorList.push({
            id: v.id,
            name: v.name,
            headImg: v.headImg,
            controlType: 0,
            type: 1,
            aliasName: 'IP'
          })
        }
      })
      this.mode.visible = false
      this.form.anchorList = this.form.anchorList.concat(anchorList)

      this.$refs.form.validateField('anchorList')
    },
    // 移除讲师
    delAnchor(row) {
      const index = this.form.anchorList.findIndex(v => v.id === row.id)
      this.form.anchorList.splice(index, 1)
    },
    // 点击确定
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const form = JSON.parse(JSON.stringify(this.form))
          form.anchorList.map(v => { v.anchorId = v.id })

          // 处理金额
          let marketPrice
          if (typeof this.form.materialSalePicReq.marketPrice === 'number') {
            marketPrice = (this.form.materialSalePicReq.marketPrice || 0) * 100
          } else {
            marketPrice = ''
          }
          const materialSalePicReq = {
            ...form.materialSalePicReq,
            marketPrice: marketPrice,
            salePrice: (this.form.materialSalePicReq.salePrice || 0) * 100
          }

          // 处理关联商品
          const goodsReqList = []
          this.form.materialGoodsReVoList && this.form.materialGoodsReVoList.map(v => {
            goodsReqList.push(v.goodsId)
          })

          const result = {
            ...form,
            liveStartTime: new Date(form.liveStartTime).getTime(),
            materialSalePicReq,
            goodsReqList,
            liveDuration: form.liveDuration * 3600,
            replayValidity: this.form.replayValiditySetting === 1 ? null : form.replayValidity,
            posterUrl: form.posterUrl.join(',')
          }
          if (this.type === 1) {
            this.addLiveRoom(result)
          } else {
            // 编辑
            this.editLiveRoom(result)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
      // this.$emit('success', result)
    },
    // 新增直播间
    addLiveRoom(result) {
      // 新增
      this.loading = true
      addLiveRoom(result).then(res => {
        console.log(res)
        this.loading = false
        this.$emit('success', result)
      }).catch(() => {
        this.loading = false
      })
    },
    // 编辑直播间
    editLiveRoom(result) {
      // 新增
      this.loading = true
      editLiveRoom(result).then(res => {
        console.log(res)
        this.loading = false
        this.$emit('success', result)
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击取消关联
    deleteRow(index, arr) {
      arr.splice(index, 1)
    },
    // 点击添加海报图
    addPosterUrl() {
      this.$SelectMaterialMultiple({
        visible: true,
        type: 'imageView',
        types: [0],
        max: 9,
        success: (res) => {
          console.log(res)
          const imageList = []
          res.imageList.map(v => {
            imageList.push(v.materialUrl)
          })
          this.form.posterUrl = this.form.posterUrl.concat(imageList)
        }
      })
      // this.$SelectMaterialMultiple({
      //   visible: true,
      //   types: [0],
      //   type: 0,
      //   success: (res) => {
      //     console.log(res, 'res')
      //     // this.form.posterUrl.push(res.materialUrl)
      //   }
      // })
    },

    // 删除海报图
    delPosterUrl(item, index) {
      this.form.posterUrl.splice(index, 1)
    },

    // 改变海报图片
    changePosterUrlImage(item, index, res) {
      this.$set(this.form.posterUrl, index, res)
    },

    // 改变主控人
    changeAnchorListControlFlag(row, index) {
      console.log(row, index)
      this.AnchorId = row.id
      // const index = this.form.anchorList.findIndex(v =>id === row.id)
      this.form.anchorList.map((v, i) => {
        v.controlType = (i === index ? 1 : 0)
      })
      this.$refs.form.validateField('anchorList')
    }
  }
}
</script>

<style lang='scss' scoped>
.liveDrawer {
  width: 100%;
  height: 100%;
  position: relative;
  padding-bottom: 50px;
  box-sizing: border-box;
  .liveDrawerForm {
    padding-left: 20px;
    padding-right: 20px;
    height: calc(100vh - 128px);
    overflow: auto;
  }
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 50px;
    padding-top: 10px;
    padding-left: 10px;
    box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  }
}

.header_tips {
    font-size: 20px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 0.9);
    line-height: 28px;
    position: relative;
    padding-left: 10px;
    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 5px;
      width: 4px;
      height: 20px;
      background: #0C6FFF;
      border-radius: 3px;
    }
  }
.tips {
    // margin-top: 20px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 22px;
  }
  .image_posterUrl {
    background: #F5F7FA;
    border-radius: 4px;
    border: 1px solid #DCDCDC;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    > span {
      margin-top: 13px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
      line-height: 20px;
    }
    &:hover {
      border: 1px dashed #1472ff;;
    }
  }
  .setting-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 776px;
    padding: 27px 20px;
    background: #f5f7fa;
  }
  .add-course-ware-btn {
    width: 106px;
    height: 35px;
    border-radius: 4px;
    border: 1px dashed #1890ff;
    font-size: 14px;
    font-weight: 400;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-align-items: center;
    align-items: center;
    cursor: pointer;
    color: #1890ff;
  }
  .EC1 {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #0052D9;
    line-height: 24px;
  }
  .sale-container {
    position: relative;
    width: 776px;
    padding: 20px;
    margin: 4px 0 10px 25px;
    background: #f5f5f5;
  }

  .vaildTimeText {
    display: inline-block;
    vertical-align: top;
  }
  .validTime {
    margin-top: 12px;
    display: inline-block;
    width: 600px;
    margin-left: 30px;
  }

  .sale-input__label {
    display: inline-block;
    width: 85px;
  }
  .sale-input__input {
    display: inline-block;
    // display: flex;
  }

  .video-selector__left {
  position: relative;
  background: #f7f8f9;
  border-radius: 2px;
  overflow: hidden;
  > img {
    width: 100%;
    height: 100%;
  }
}

.video-preview {
  height: 112px;
  width: 200px;
  background-color: #000000;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.6;
  .preview__mask {
    height: 112px;
    width: 200px;
    background-color: #000000;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.6;
  }
  .preview__text {
    position: absolute;
    height: 20px;
    line-height: 20px;
    width: 200px;
    bottom: 8px;
    padding: 0 12px;
    color: #ffffff;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.caseShow {
  // width: 300px;
  // height: 394px;
  // background: #eee;
  position: relative;
  .demoShow {
    position: absolute;
    top: 0;
    left: 0;
    padding: 5px 10px;
    background-color: #fdf6ec;
    color: #e6a23c;
  }
}
  .posterView {
    display: flex;
    flex-wrap: wrap;
    width: 510px;
    .image_poster {
      background: #F5F7FA;
      border-radius: 4px;
      border: 1px solid #DCDCDC;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      > span {
        margin-top: 13px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.4);
        line-height: 20px;
      }
      &:hover {
        border: 1px dashed #1472ff;;
      }
    }
  }
  // 主控人
  .adminRole {
    display: flex;
    align-items: center;
    .adminRoleName {
      overflow: hidden;
      text-overflow: ellipsis;  /* 超出部分省略号 */
      word-break: break-all;  /* break-all(允许在单词内换行。) */
      display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
      -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
      -webkit-line-clamp: 1; /** 显示的行数 **/
      font-size: 14px;
      font-weight: 400;
      color: #666;
      line-height: 20px;
      user-select: text;
    }
  }
</style>
