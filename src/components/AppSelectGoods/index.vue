<template>
  <AppDialog
    v-model="visible"
    :title="title"
    width="1377px"
    height="593px"
    top="10vh"
    @success="successFn"
  >
    <div v-loading="loading" class="choose_resource">
      <div class="window-search">
        <span
          v-if="
            ['0', '1', '2', '3', '4', '5', '51', '7', '10'].includes(
              currentId
            ) && tearchSearch
          "
          class="text"
        >IP</span>
        <TeacherSelect
          v-if="
            ['0', '1', '2', '3', '4', '5', '51', '7', '10'].includes(
              currentId
            ) && tearchSearch
          "
          ref="teacherSelect"
          class="m-r-20"
          placeholder="请选择IP"
          :default-tearch-id="tearch.lecturerId"
          :value="tearch.lecturerName"
          @selected="teacherSelect"
        />
        <m-select
          v-if="
            ['0', '1', '2', '3', '4', '5', '51', '7', '10'].includes(
              currentId
            ) && tearchSearch
          "
          v-model="singleLecture"
          :clearable="false"
          dict-key="singleLectureType"
          style="width: 140px"
          size="small"
          class="m-r-20"
        />
        <!-- <span class="text">商品名称</span> -->
        <!-- <el-input v-model.trim="search" class="m-r-20" style="width: 160px" :placeholder="getPlaceholder()" prefix-icon="el-icon-search" clearable size="small" @keyup.enter.native="searchFn" @clear="searchFn" /> -->
        <div class="order-time-box">
          <el-select
            v-model="searchType"
            placeholder="请选择"
            size="small"
            class="input-with-select input-with-select-chang"
          >
            <el-option label="商品名称" :value="1" />
            <el-option label="商品ID" :value="2" />
          </el-select>
          <el-input
            v-if="searchType === 1"
            v-model.trim="search"
            class="filter_teacherSelect m-r-20"
            style="width: 160px"
            placeholder="请输入商品名称"
            clearable
            size="small"
            @keyup.enter.native="searchFn"
            @clear="searchFn"
          />
          <el-input
            v-else
            v-model.trim="searchGoodsId"
            class="filter_teacherSelect m-r-20"
            style="width: 160px"
            placeholder="请输入商品id"
            clearable
            size="small"
            @keyup.enter.native="searchFn"
            @clear="searchFn"
          />
        </div>

        <div
          v-if="
            isSearchPrice &&
              ['0', '1', '2', '3', '4', '5', '7', '10'].includes(currentId)
          "
          class="moneyBox m-r-20"
        >
          <span class="text">价格</span>
          <el-input-number
            v-model="starSalePrice"
            size="small"
            placeholder="请输入"
            style="width: 139px"
            :controls="false"
          />
          <span class="m-l-10 m-r-10">-</span>
          <el-input-number
            v-model="endSalePrice"
            size="small"
            placeholder="请输入"
            style="width: 139px"
            :controls="false"
          />
        </div>
        <template v-if="['A7'].includes(currentId) && showCourseType">
          <span class="text">课程标签</span>
          <el-select
            v-model="courseType"
            clearable
            placeholder="请选择"
            size="small"
            class="m-r-20"
            @clear="searchFn"
          >
            <el-option label="视频课" :value="0" />
            <el-option label="直播课" :value="1" />
          </el-select>
        </template>
        <el-button
          size="small"
          type="primary"
          class="search_btn search_paramy"
          @click="searchFn"
        >查询</el-button>
        <el-button
          size="small"
          class="search_btn"
          @click="searchReset"
        >重置</el-button>
      </div>
      <div class="window-tab">
        <div class="tab-wrapper">
          <el-tabs v-model="currentId" class="tab-item" @tab-click="changTab">
            <el-tab-pane
              v-for="item in tabList"
              :key="item.id"
              :label="item.name"
              :name="item.id"
              :disabled="Boolean(item.disabled)"
            />
          </el-tabs>
        </div>
        <div class="tab-slort">
          <span>排序：</span>
          <m-select
            v-model="slort"
            dict-key="COMMODITY_SORT"
            size="small"
            @change="handleSlortChage"
          />
        </div>
      </div>
      <div class="window-list">
        <div class="resource-item-wrapper">
          <template
            v-if="['0', '1', '2', '3', '4', '5', '6', '10'].includes(currentId)"
          >
            <div
              class="resource-item-wrapper-box"
              :class="{ noMultiple: !multiple }"
            >
              <el-checkbox-group v-model="checkList">
                <el-checkbox
                  v-for="(item, index) in tableData"
                  :key="item.goodsId"
                  :label="item.goodsId"
                  :disabled="check.includes(item.goodsId) || disabledFn(item)"
                  @change="res => checkChange(res, item, index)"
                >
                  <div class="resource-item-wrapper-box-group">
                    <div class="item-wrapper">
                      <ImagePreviewer
                        class="image-previewer"
                        :src="item.coverVerticalUrl"
                        alt=""
                        fit="contain"
                      />
                      <div class="item-info">
                        <div class="item-name">{{ item.contentName }}</div>
                        <div style="display: flex">
                          <span
                            v-if="isPlaform"
                            style="
                              color: #333;
                              line-height: 24px;
                              font-weight: 600;
                            "
                            class="m-r-10"
                          >{{ item.tenantVO.tenantName + ' ' }}</span>
                          <div
                            v-if="item.saleType === 0"
                            class="item-price m-r-10"
                          >
                            免费
                          </div>
                          <div
                            v-if="item.saleType === 2"
                            class="item-price m-r-10"
                          >
                            加密
                          </div>
                          <div
                            v-if="item.saleType === 1"
                            class="item-price m-r-10"
                          >
                            ￥{{ item.salePrice | filtersMoney }}
                          </div>
                          <!-- 0: '已上架#00b42a #E6F7EA el-icon-success', 1: '已下架#F53F3F #FEECEC el-icon-error', 2: '待上架#FF7D00 #FFF2E6 el-icon-time' -->
                          <AppTag
                            v-if="[0, 1, 2].includes(item.shelveFlag)"
                            :bg-color="getShelveFlagBgColor(item.shelveFlag)"
                          >
                            <template slot="icon">
                              <i
                                :class="getShelveFlagClass(item.shelveFlag)"
                                :style="{
                                  color: {
                                    0: '#00b42a',
                                    1: '#F53F3F',
                                    2: '#FF7D00'
                                  }[item.shelveFlag]
                                }"
                              />
                            </template>
                            <template slot="text">
                              <span
                                :style="{
                                  color: {
                                    0: '#00b42a',
                                    1: '#F53F3F',
                                    2: '#FF7D00'
                                  }[item.shelveFlag]
                                }"
                              >{{
                                { 0: '已上架', 1: '已下架', 2: '待上架' }[
                                  item.shelveFlag
                                ]
                              }}</span>
                            </template>
                          </AppTag>
                        </div>
                      </div>
                    </div>
                    <div v-if="packagePrice" class="packageInputView">
                      <span class="packageInputViewText">套餐单价</span>
                      <el-input-number
                        v-model="item.packagePrice"
                        :min="0"
                        size="small"
                        placeholder="请输入"
                        style="width: 262px; text-align: left"
                        :controls="false"
                      />
                    </div>
                  </div>
                </el-checkbox>
              </el-checkbox-group>

              <div
                v-if="tableData && tableData.length === 0"
                class="resource-item-wrapper-box-noData"
              >
                <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
                <div class="m-t-10 noDataText">暂无数据</div>
              </div>
            </div>
          </template>

          <template v-else-if="['8', '9'].includes(currentId)">
            <div class="ss-material-main-tree">
              <div class="ss-material-main-tree-left">
                <AppTree
                  v-model="classlist"
                  v-loading="loading"
                  style="width: 200px"
                  :loading="treeLoading"
                  :nobtn="true"
                  @node-click="treeClick"
                />
              </div>
              <div class="ss-material-main-tree-right">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox
                    v-for="(item, index) in tableData"
                    :key="item.materialId"
                    :label="item.materialId"
                    :disabled="check.includes(item.materialId)"
                    @change="res => checkChange(res, item, index)"
                  >
                    <div
                      class="resource-item-wrapper-box-group"
                      style="width: 1067px"
                    >
                      <div class="item-wrapper">
                        <img
                          v-if="currentId === '8'"
                          :src="item.materialFrameUrl"
                          alt=""
                          style="width: 60px; height: 60px"
                        />
                        <svg-icon
                          v-if="currentId === '9'"
                          class-name="size-icon"
                          style="width: 60px; height: 60px; font-size: 60px"
                          icon-class="audio"
                          @click="play(row.materialUrl)"
                        />
                        <div class="item-info">
                          <div class="item-name">{{ item.materialName }}</div>
                        </div>
                      </div>
                    </div>
                  </el-checkbox>
                </el-checkbox-group>
                <div v-if="tableData.length === 0" class="noData">暂无数据</div>
              </div>
            </div>
          </template>

          <template v-else-if="['51'].includes(currentId)">
            <div
              class="resource-item-wrapper-box"
              :class="{ noMultiple: !multiple }"
            >
              <el-checkbox-group v-model="checkList">
                <el-checkbox
                  v-for="(item, index) in tableData"
                  :key="item.specId"
                  :label="item.specId"
                  :disabled="check.includes(item.specId) || disabledFn(item)"
                  @change="res => checkChange(res, item, index)"
                >
                  <div class="item-wrapper">
                    <ImagePreviewer
                      class="image-previewer"
                      :src="
                        item.contentUrl ? item.contentUrl.split(',')[0] : ''
                      "
                      alt=""
                      fit="contain"
                    />
                    <div class="item-info">
                      <div class="item-name">{{ item.goodsName }}</div>
                      <div class="item-price">
                        <el-tag size="mini">{{ item.specName }}</el-tag>
                      </div>
                      <div class="item-price">
                        ￥{{ item.salePrice | filtersMoney }}
                      </div>
                    </div>
                  </div>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </template>

          <template v-else-if="['7'].includes(currentId)">
            <div
              ref="resourceItemWrapperBox"
              class="resource-item-wrapper-box"
              :class="{ noMultiple: !multiple }"
            >
              <div
                v-for="(item, index) in tableData"
                :id="'packageCoure-check-view-group' + item.goodsId"
                :key="item.goodsId"
                class="packageCoure-check-view-group"
                :label="item.goodsId"
              >
                <div
                  class="packageCoure-item-wrapper-box-group"
                  @click="onClickPackageCourse(item.goodsId, item, index)"
                >
                  <div class="m-r-10">
                    <el-checkbox
                      :value="checkList.includes(item.goodsId)"
                      :disabled="
                        check.includes(item.goodsId) || disabledFn(item)
                      "
                      @change="onClickPackageCourse(item.goodsId, item, index)"
                    />
                  </div>
                  <div class="packageCoure-item-wrapper">
                    <ImagePreviewer
                      class="image-previewer"
                      :src="item.coverVerticalUrl"
                      alt=""
                      fit="contain"
                    />
                    <div class="packageCoure-item-info">
                      <div class="item-name">{{ item.contentName }}</div>
                      <div style="display: flex">
                        <span
                          v-if="isPlaform"
                          style="
                            color: rgb(51, 51, 51);
                            line-height: 24px;
                            font-weight: 600;
                          "
                          class="m-r-10"
                        >{{ item.tenantVO.tenantName + ' ' }}</span>
                        <div
                          v-if="item.saleType === 0"
                          class="item-price m-r-10"
                        >
                          免费
                        </div>
                        <div
                          v-if="item.saleType === 2"
                          class="item-price m-r-10"
                        >
                          加密
                        </div>
                        <div
                          v-if="item.saleType === 1"
                          class="item-price m-r-10"
                        >
                          ￥{{ item.salePrice | filtersMoney }}
                        </div>
                        <AppTag
                          v-if="[0, 1, 2].includes(item.shelveFlag)"
                          :bg-color="
                            { 0: '#E6F7EA', 1: '#FEECEC', 2: '#FFF2E6' }[
                              item.shelveFlag
                            ]
                          "
                        >
                          <template slot="icon">
                            <i
                              :class="
                                {
                                  0: 'el-icon-success',
                                  1: 'el-icon-error',
                                  2: 'el-icon-time'
                                }[item.shelveFlag]
                              "
                              :style="{
                                color: {
                                  0: '#00b42a',
                                  1: '#F53F3F',
                                  2: '#FF7D00'
                                }[item.shelveFlag]
                              }"
                            />
                          </template>
                          <template slot="text">
                            <span
                              :style="{
                                color: {
                                  0: '#00b42a',
                                  1: '#F53F3F',
                                  2: '#FF7D00'
                                }[item.shelveFlag]
                              }"
                            >{{
                              { 0: '已上架', 1: '已下架', 2: '待上架' }[
                                item.shelveFlag
                              ]
                            }}</span>
                          </template>
                        </AppTag>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="item.children && item.children.length > 0"
                    class="packageCoure-item-wrapper-left"
                    @click.stop="onhandleOpen(item)"
                  >
                    <div class="btn-left">
                      {{ item.childrenOpen ? '收起' : '展开'
                      }}<i
                        :class="
                          item.childrenOpen
                            ? 'el-icon-arrow-down'
                            : 'el-icon-arrow-right'
                        "
                      />
                    </div>
                  </div>
                </div>

                <div
                  v-if="item.childrenOpen"
                  class="packageCoure-item-children"
                >
                  <div
                    v-for="c in item.children"
                    :key="c.goodsId"
                    class="packageCoure-item-wrapper-box-group"
                    style="padding: 18px 0px 0px 50px"
                  >
                    <div class="packageCoure-item-wrapper">
                      <ImagePreviewer
                        class="image-previewer"
                        :src="c.coverVerticalUrl"
                        alt=""
                        fit="contain"
                      />
                      <div class="packageCoure-item-info">
                        <div class="item-chidren-name">
                          <span class="item-name">{{ c.contentName }}</span>
                          <span
                            v-if="
                              (c.goodsType === 3 || c.goodsType === 4) &&
                                c.productCategory === 0
                            "
                            style="margin-left: 15px"
                            class="item-chidren-type"
                          >录播课</span>
                          <span
                            v-if="
                              (c.goodsType === 3 || c.goodsType === 4) &&
                                c.productCategory === 2
                            "
                            style="margin-left: 15px"
                            class="item-chidren-type"
                          >线下课</span>
                          <span
                            v-if="
                              (c.goodsType === 3 || c.goodsType === 4) &&
                                c.productCategory === 1
                            "
                            style="margin-left: 15px"
                            class="item-chidren-type item-chidren-type-live"
                          >直播课</span>
                        </div>
                        <div style="display: flex">
                          <div
                            v-if="c.saleType === 0"
                            class="item-price m-r-10"
                          >
                            免费
                          </div>
                          <div
                            v-if="c.saleType === 2"
                            class="item-price m-r-10"
                          >
                            加密
                          </div>
                          <div
                            v-if="c.saleType === 1"
                            class="item-price m-r-10"
                          >
                            ￥{{ c.salePrice | filtersMoney }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="tableData && tableData.length === 0"
                class="resource-item-wrapper-box-noData"
              >
                <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
                <div class="m-t-10 noDataText">暂无数据</div>
              </div>
            </div>
          </template>

          <template v-else-if="['A7'].includes(currentId)">
            <div ref="resourceItemWrapperBox" class="resource-item-wrapper-box">
              <div
                v-for="(item, index) in tableData"
                :id="'packageCoure-check-view-group' + item.goodsId"
                :key="item.goodsId"
                class="packageCoure-check-view-group"
                :label="item.goodsId"
              >
                <div class="packageCoure-item-wrapper-box-group">
                  <div class="m-r-10" :class="{ noMultiple: !multiple }">
                    <el-checkbox
                      :indeterminate="
                        packageCoure_checkList[item.goodsId] &&
                          packageCoure_checkList[item.goodsId].length > 0 &&
                          packageCoure_checkList[item.goodsId].length !==
                          item.liveCourseNum
                      "
                      :value="ifCheckAll(item)"
                      :disabled="item.liveCourseNum === 0 || disabledFn(item)"
                      @change="
                        res =>
                          onClickPackageA7Course(item.goodsId, item, index, res)
                      "
                    />
                  </div>
                  <div
                    class="packageCoure-item-wrapper"
                    @click.stop="
                      onClickPackageA7Course(
                        item.goodsId,
                        item,
                        index,
                        !ifCheckAll(item)
                      )
                    "
                  >
                    <ImagePreviewer
                      class="image-previewer"
                      :src="item.coverVerticalUrl"
                      alt=""
                      fit="contain"
                    />
                    <div class="packageCoure-item-info">
                      <div class="item-name">{{ item.contentName }}</div>
                      <span v-if="isPlaform" style="color: #000">{{
                        item.tenantVO.tenantName + ' '
                      }}</span>
                      <div style="display: flex">
                        <div
                          v-if="item.saleType === 0"
                          class="item-price m-r-10"
                        >
                          免费
                        </div>
                        <div
                          v-if="item.saleType === 2"
                          class="item-price m-r-10"
                        >
                          加密
                        </div>
                        <div
                          v-if="item.saleType === 1"
                          class="item-price m-r-10"
                        >
                          ￥{{ item.salePrice | filtersMoney }}
                        </div>
                        <AppTag
                          v-if="[0, 1, 2].includes(item.shelveFlag)"
                          :bg-color="
                            { 0: '#E6F7EA', 1: '#FEECEC', 2: '#FFF2E6' }[
                              item.shelveFlag
                            ]
                          "
                        >
                          <template slot="icon">
                            <i
                              :class="
                                {
                                  0: 'el-icon-success',
                                  1: 'el-icon-error',
                                  2: 'el-icon-time'
                                }[item.shelveFlag]
                              "
                              :style="{
                                color: {
                                  0: '#00b42a',
                                  1: '#F53F3F',
                                  2: '#FF7D00'
                                }[item.shelveFlag]
                              }"
                            />
                          </template>
                          <template slot="text">
                            <span
                              :style="{
                                color: {
                                  0: '#00b42a',
                                  1: '#F53F3F',
                                  2: '#FF7D00'
                                }[item.shelveFlag]
                              }"
                            >{{
                              { 0: '已上架', 1: '已下架', 2: '待上架' }[
                                item.shelveFlag
                              ]
                            }}</span>
                          </template>
                        </AppTag>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="item.children"
                    class="packageCoure-item-wrapper-left"
                    @click.stop="onhandleOpen(item)"
                  >
                    <div class="btn-left">
                      {{ item.childrenOpen ? '收起' : '展开'
                      }}<i
                        :class="
                          item.childrenOpen
                            ? 'el-icon-arrow-down'
                            : 'el-icon-arrow-right'
                        "
                      />
                    </div>
                  </div>
                </div>

                <div
                  v-if="item.childrenOpen"
                  class="packageCoure-item-children"
                >
                  <div
                    v-for="c in item.children"
                    :key="c._goodsId"
                    class="packageCoure-item-wrapper-box-group"
                    style="padding: 18px 0px 0px 25px"
                  >
                    <div class="packageCoure-item-wrapper">
                      <div class="m-r-10">
                        <el-checkbox
                          :value="checkList.includes(c._goodsId)"
                          :disabled="
                            !(
                              (c.goodsType === 3 || c.goodsType === 4) &&
                              c.productCategory === 1
                            ) ||
                              check.includes(c._goodsId) ||
                              disabledFn(c)
                          "
                          @change="
                            onClickA7PackageCourse(c._goodsId, c, index, item)
                          "
                        />
                      </div>
                      <ImagePreviewer
                        class="image-previewer"
                        :src="c.coverVerticalUrl"
                        alt=""
                        fit="contain"
                      />
                      <div
                        class="packageCoure-item-info"
                        @click.stop="
                          onClickA7PackageCourse(c._goodsId, c, index, item)
                        "
                      >
                        <div class="item-chidren-name">
                          <span class="item-name">{{ c.contentName }}</span>
                          <span
                            v-if="
                              (c.goodsType === 3 || c.goodsType === 4) &&
                                c.productCategory === 0
                            "
                            style="margin-left: 15px"
                            class="item-chidren-type"
                          >录播课</span>
                          <span
                            v-if="
                              (c.goodsType === 3 || c.goodsType === 4) &&
                                c.productCategory === 2
                            "
                            style="margin-left: 15px"
                            class="item-chidren-type item-chidren-type-offline"
                          >线下课</span>
                          <span
                            v-if="
                              (c.goodsType === 3 || c.goodsType === 4) &&
                                c.productCategory === 1
                            "
                            style="margin-left: 15px"
                            class="item-chidren-type item-chidren-type-live"
                          >直播课</span>
                        </div>
                        <span v-if="isPlaform" style="color: #000">{{
                          c.tenantVO.tenantName + ' '
                        }}</span>
                        <div style="display: flex">
                          <div
                            v-if="c.saleType === 0"
                            class="item-price m-r-10"
                          >
                            免费
                          </div>
                          <div
                            v-if="c.saleType === 2"
                            class="item-price m-r-10"
                          >
                            加密
                          </div>
                          <div
                            v-if="c.saleType === 1"
                            class="item-price m-r-10"
                          >
                            ￥{{ c.salePrice | filtersMoney }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="tableData && tableData.length === 0"
                class="resource-item-wrapper-box-noData"
              >
                <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
                <div class="m-t-10 noDataText">暂无数据</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div slot="footer" class="dialogFooter">
      <div class="flex">
        <div v-if="multiple" class="check-all">
          <el-checkbox v-model="checkedAll" :disabled="disabledAllFn" @change="handleCheckAll">全选</el-checkbox>
        </div>
        <el-pagination
          v-if="!['A7'].includes(currentId)"
          layout="jumper, prev, pager, next, sizes, total"
          :total="total"
          :page-size="size"
          :current-page="current"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
      <div class="dialogFooterRight">
        <el-button
          type="primary"
          class="search_btn search_paramy"
          @click="successFn()"
        >确定</el-button>
        <el-button class="search_btn" @click="close()">取消</el-button>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppTag from '@/components/AppTag'
import {
  getGoodsList,
  materialPage,
  getOfflineGoodsSpecPage,
  platformGoodsList,
  getMaterialGoodsByType
} from '@/api/course'
import { getLiveList } from '@/api/privateArea/class'
import TeacherSelect from '@/views/deliver/components/tearchSelect.vue'
import store from '@/store'
import AppTree from '@/components/AppTree'
export default {
  components: {
    AppTag,
    AppDialog,
    AppTree,
    TeacherSelect
  },
  props: {
    // 是否展示套餐课价格输入框
    packagePrice: {
      type: Boolean,
      default: false
    },
    // 是否展示课程标签搜索条件
    showCourseType: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择'
    },
    // 禁选项目
    check: {
      type: Array,
      default: () => {
        return []
      }
    },
    success: {
      type: Function,
      default: () => {
        return () => {}
      }
    },
    isSearchPrice: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
    },
    initSearch: {
      type: Object,
      default: undefined
    },
    // 选中项
    defaultValue: {
      type: Array,
      default: () => {
        return []
      }
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 选中的商品信息 二次修改时需要用到
    goodsInfo: {
      type: Array,
      default: () => {
        return []
      }
    },
    tearchSearch: {
      type: Boolean,
      default: false
    },
    filterateHidden: {
      type: Boolean,
      default: false
    },
    currentId: {
      type: String,
      default: '4'
    },
    isPlaform: {
      type: Boolean,
      default: false
    },
    sameSelected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkedAll: false,
      saleType: '',
      starSalePrice: undefined,
      endSalePrice: undefined,
      slort: 0,
      courseType: '',
      options: [
        { value: '', label: '全部' },
        { value: 0, label: '免费' },
        { value: 1, label: '付费' }
      ],
      singleLecture: 1,
      loading: false,
      search: '',
      searchGoodsId: '',
      searchType: 1, // 1商品名称 2: 商品Id
      goodsName: '',
      tearch: {
        lecturerId: '',
        lecturerName: ''
      },
      tabList: [
        { id: '0', name: '图文', api: '' },
        { id: '1', name: '音频', api: '' },
        { id: '2', name: '视频', api: '' },
        { id: '3', name: '普通专栏', api: '' },
        { id: '4', name: '大专栏', api: '' },
        { id: '5', name: '线下课', api: '' },
        { id: '6', name: '直播专栏', api: '' },
        { id: '8', name: '视频素材', api: '' },
        { id: '9', name: '音频素材', api: '' }
        // { id: '5', name: '公开课', api: '' },
        // { id: '6', name: '一对一', api: '' },
        // { id: '7', name: '落地班', api: '' },
        // { id: '10', name: '直播课', api: '' }, 10为直播课，goodstype为8，
      ],
      disabledFn: () => false,
      // currentId: '4',
      checkList: [], // 记录id
      checkListInfo: [], // 记录对象
      current: 1,
      size: 10,
      total: 0,
      tableData: [],
      noMore: false,
      form: {
        id: '',
        name: ''
      },
      changeLoading: false, // 加个loading防止点击过快
      classlist: [],
      treeLoading: false,
      onlineFlag: 0, // 是否线上(0线上，1线下)
      shelveHideFlag: '',
      packageChildren: [], // 套餐课的子课
      packageCoure_checkList: {}
    }
  },
  computed: {
    // noMore() {
    //   return this.tableData.length >= this.total
    // },
    disabled() {
      return this.loading || this.noMore
    },
    disabledAllFn() {
      if (['0', '1', '2', '3', '4', '5', '6', '7', 'A7', '10'].includes(this.currentId)) {
        const arr = this.tableData.map(v => v.goodsId)
        return arr.every(v => this.check.includes(v))
      } else if (['8', '9'].includes(this.currentId)) {
        const arr = this.tableData.map(v => v.materialId)
        return arr.every(v => this.check.includes(v))
      } else if (['51'].includes(this.currentId)) {
        const arr = this.tableData.map(v => v.specId)
        return arr.every(v => this.check.includes(v))
      }
      return false
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          console.log('打开弹框')
          this.init()
        }
      },
      deep: true,
      immediate: true
    },
    checkList: {
      handler(val) {
        this.get_packageCoure_checkList()
      },
      deep: true,
      immediate: true
    },
    checkListInfo: {
      handler(val) {
        // 相同类型且没有已选中的商品
        if (
          this.sameSelected &&
          this.check?.length === 0 &&
          val?.length === 1
        ) {
          // 只能选择相同类型
          this.tabList.forEach(item => {
            if (this.currentId !== item.id) {
              item.disabled = true
            }
            if (
              ['2', '8'].includes(this.currentId) &&
              ['2', '8'].includes(item.id)
            ) {
              // 2, 8同为视频类型
              item.disabled = false
            }
          })
        } else if (
          this.sameSelected &&
          this.check?.length === 0 &&
          val?.length === 0
        ) {
          this.tabList.forEach(item => {
            item.disabled = false
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getShelveFlagBgColor(shelveFlag) {
      const colors = { 0: '#E6F7EA', 1: '#FEECEC', 2: '#FFF2E6' }
      return colors[shelveFlag] || '#FFF2E6'
    },
    getShelveFlagClass(shelveFlag) {
      const colors = {
        0: 'el-icon-success',
        1: 'el-icon-error',
        2: 'el-icon-time'
      }
      return colors[shelveFlag] || 'el-icon-time'
    },
    get_packageCoure_checkList() {
      if (this.currentId !== 'A7') return
      // 套餐课判断是否选择了子项的直播课，判断 套餐课的选择状态
      // 根据checkList构建对象
      if (this.checkList.length === 0) {
        this.packageCoure_checkList = {}
        return
      }
      const packageCoure_checkList = {}
      this.checkList.map(v => {
        const arr = v.split('-')
        if (arr.length < 2) return
        if (packageCoure_checkList[arr[0]]) {
          packageCoure_checkList[arr[0]].push(arr[1])
        } else {
          packageCoure_checkList[arr[0]] = [arr[1]]
        }
      })
      this.packageCoure_checkList = packageCoure_checkList
      console.log(this.packageCoure_checkList, 'this.packageCoure_checkList')
    },
    init() {
      this.checkedAll = false
      this.packageCoure_checkList = {}
      this.current = 1
      this.checkList = this.defaultValue
      this.get_packageCoure_checkList()
      this.tableData = []
      this.starSalePrice = undefined
      this.endSalePrice = undefined
      this.search = this.initSearch?.search || ''
      this.searchGoodsId = ''
      this.searchType = 1
      this.courseType = ''
      this.checkListInfo = this.goodsInfo
      this.tearch = {
        lecturerId: this.initSearch?.lecturerId || '',
        lecturerName: this.initSearch?.lecturerName || ''
      }
      console.log(this.checkList, this.checkListInfo, '1111')
      // this.getList()
      if (['8', '9'].includes(this.currentId)) {
        this.getClassList()
      } else {
        this.getList()
      }
    },
    changTab(row) {
      console.log(row, 'row')
      // this.search = ''
      this.currentId = row.name
      this.tableData = []
      this.current = 1
      this.total = 0
      this.checkedAll = false
      // this.getList()
      if (['8', '9'].includes(this.currentId)) {
        this.getClassList()
      } else {
        this.getList()
      }
    },
    handleSlortChage() {
      this.searchFn()
    },
    searchReset() {
      this.init()
    },
    getList() {
      console.log(this.currentId, 'this.currentId')
      if (this.isPlaform) {
        this.getPlatformGoodsList()
      } else if (
        ['0', '1', '2', '3', '4', '5', '10'].includes(this.currentId)
      ) {
        this.getGoodsList()
      } else if (['8', '9'].includes(this.currentId)) {
        this.getMaterialList()
      } else if (['6'].includes(this.currentId)) {
        this.getLiveList()
      } else if (['51'].includes(this.currentId)) {
        this.getOfflineGoodsSpecPage()
      } else if (['7'].includes(this.currentId)) {
        // 套餐课
        this.getPackagePage()
      } else if (['A7'].includes(this.currentId)) {
        this.getMaterialGoodsByType()
      }
    },
    handleCurrentChange(val) {
      this.current = val
      this.tableData = []
      this.getList()
    },
    handleSizeChange(val) {
      this.size = val
      this.current = 1
      this.tableData = []
      this.getList()
    },
    // 获取商品列表
    getGoodsList() {
      this.loading = true
      let onlineFlag = 0
      if (['5'].includes(this.currentId)) {
        onlineFlag = 1
      }
      const params = {
        current: this.current,
        size: this.size,
        contentName: this.searchType === 1 ? this.search : '',
        goodsId: this.searchType === 2 ? this.searchGoodsId : '',
        goodsType: this.currentId === '10' ? '8' : this.currentId,
        onlineFlag,
        singleLecture: this.singleLecture,
        shelveFlag: 0,
        starSalePrice: this.starSalePrice ? this.starSalePrice * 100 : '',
        endSalePrice: this.endSalePrice ? this.endSalePrice * 100 : '',
        ...this.params,
        lecturerId: this.tearch.lecturerId,
        curriculumType: this.initSearch?.curriculumType || undefined,
        sortType: this.slort,
        tagType: this.initSearch?.tagType || undefined
      }
      if (this.filterateHidden) {
        params.notLikeContentName = '私域专享'
        params.shelveHideFlag = 0
        params.saleType = 1
      } else {
        delete params.notLikeContentName
        params.shelveHideFlag = ''
        delete params.saleType
      }
      if (this.tearchSearch) {
        params.lecturerId = this.tearch.lecturerId
      }
      getGoodsList(params)
        .then(res => {
          if (this.packagePrice) {
            res.data.records.map(v => {
              v.packagePrice = v.salePrice / 100
            })
          }
          console.log(res, 'res这是一个商品数据', this.packageChildren)
          res.data.records.map(v => {
            const index = this.packageChildren.findIndex(
              e => e.associateGoodsId === v.goodsId
            )
            index > -1 &&
              (v.packagePrice = this.packageChildren[index].packagePrice / 100)
          })

          this.tableData = res.data.records
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleChange(value) {
      console.log(value, 'value111')
    },
    // 获取素材列表
    getMaterialList() {
      console.log('获取素材列表')
      this.loading = true
      let materialType = ''
      if (this.currentId === '8') {
        materialType = '2'
      } else if (this.currentId === '9') {
        materialType = '1'
      }
      const params = {
        materialType,
        current: this.current,
        size: this.size,
        materialName: this.search,
        dirId: this.form.id,
        sortType: this.slort
      }
      materialPage(params)
        .then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          // this.noMore = this.tableData.length >= this.total
          // this.current = this.current + 1
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取直播专栏列表
    getLiveList() {
      const params = {
        current: this.current,
        size: this.size
      }
      const index = this.tabList.findIndex(v => v.id === '6')
      const api = this.tabList[index].api || '/material/goods/page?goodsType=6'
      getLiveList(params, api)
        .then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取套餐课详情
    getPackagePage() {
      this.loading = true
      const params = {
        current: this.current,
        size: this.size,
        contentName: this.searchType === 1 ? this.search : '',
        goodsId: this.searchType === 2 ? this.searchGoodsId : '',
        goodsType: this.currentId,
        onlineFlag: 0,
        singleLecture: this.singleLecture,
        shelveFlag: 0,
        starSalePrice: this.starSalePrice ? this.starSalePrice * 100 : '',
        endSalePrice: this.endSalePrice ? this.endSalePrice * 100 : '',
        ...this.params,
        lecturerId: this.tearch.lecturerId,
        curriculumType: this.initSearch?.curriculumType || undefined,
        sortType: this.slort,
        tagType: this.initSearch?.tagType || undefined
      }
      if (this.showCourseType) {
        params.courseType = this.courseType
      }
      if (this.tearchSearch) {
        params.lecturerId = this.tearch.lecturerId
      }

      if (this.filterateHidden) {
        params.notLikeContentName = '私域专享'
        params.shelveHideFlag = 0
        params.saleType = 1
      } else {
        delete params.notLikeContentName
        params.shelveHideFlag = ''
        delete params.saleType
      }
      if (this.tearchSearch) {
        params.lecturerId = this.tearch.lecturerId
      }
      getGoodsList(params)
        .then(res => {
          console.log(res, 'res++++++++++++')
          if (this.packagePrice) {
            res.data.records.map(v => {
              v.packagePrice = v.salePrice / 100
            })
          }
          res.data.records.map(v => {
            v.liveCourseNum = 0
            v.childrenOpen = false
            v.children &&
              v.children.map(e => {
                (e.goodsType === 3 || e.goodsType === 4) &&
                  e.productCategory === 1 &&
                  v.liveCourseNum++
                e._goodsId = v.goodsId + '-' + e.goodsId
                return
              })
            const index = this.packageChildren.findIndex(
              e => e.goodsId === v.goodsUd
            )
            index > -1 &&
              (v.packagePrice = this.packageChildren[index.packagePrice] / 100)
          })
          this.tableData = res.data.records
          console.log(this.tableData, 'this.tableData')
          this.total = res.data.total
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
      console.log(params, 'params')
    },
    // 获取套餐课详情(直播用，不分页)
    getMaterialGoodsByType() {
      this.loading = true
      const params = {
        // current: this.current,
        // size: this.size,
        contentName: this.search,
        goodsType: 7,
        onlineFlag: 0,
        singleLecture: this.singleLecture,
        shelveFlag: 0,
        starSalePrice: this.starSalePrice ? this.starSalePrice * 100 : '',
        endSalePrice: this.endSalePrice ? this.endSalePrice * 100 : '',
        ...this.params,
        productCategory: this.courseType,
        lecturerId: this.tearch.lecturerId,
        curriculumType: this.initSearch?.curriculumType || undefined,
        sortType: this.slort,
        tagType: this.initSearch?.tagType || undefined
      }
      if (this.showCourseType) {
        params.courseType = this.courseType
      }
      if (this.tearchSearch) {
        params.lecturerId = this.tearch.lecturerId
      }

      if (this.filterateHidden) {
        params.notLikeContentName = '私域专享'
        params.shelveHideFlag = 0
        params.saleType = 1
      } else {
        delete params.notLikeContentName
        params.shelveHideFlag = ''
        delete params.saleType
      }
      if (this.tearchSearch) {
        params.lecturerId = this.tearch.lecturerId
      }
      getMaterialGoodsByType(params)
        .then(res => {
          if (this.packagePrice) {
            res.data.map(v => {
              v.packagePrice = v.salePrice / 100
            })
          }
          res.data.map(v => {
            v.liveCourseNum = 0
            v.childrenOpen = false
            v.children &&
              v.children.map(e => {
                (e.goodsType === 3 || e.goodsType === 4) &&
                  e.productCategory === 1 &&
                  v.liveCourseNum++
                e._goodsId = v.goodsId + '-' + e.goodsId
                return
              })
          })
          this.tableData = res.data
          this.total = res.data.length
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取线下课【规格】【获客交付】
    getOfflineGoodsSpecPage() {
      this.loading = true
      let onlineFlag = 0
      if (['5'].includes(this.currentId)) {
        onlineFlag = 1
      }
      const params = {
        current: this.current,
        size: this.size,
        goodsName: this.search,
        onlineFlag,
        shelveFlag: 0,
        sortType: this.slort,
        ...this.params,
        tagType: this.initSearch?.tagType || undefined
      }
      if (this.tearchSearch) {
        params.lecturerId = this.tearch.lecturerId
      }
      getOfflineGoodsSpecPage(params)
        .then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    successFn() {
      const selectedData = this.tableData
        .filter(item => {
          const isSelected = (() => {
            if (['51'].includes(this.currentId)) {
              return this.checkList.includes(item.specId)
            } else if (['8', '9'].includes(this.currentId)) {
              return this.checkList.includes(item.materialId)
            } else if (['A7'].includes(this.currentId)) {
              if (this.packageCoure_checkList[item.goodsId]) {
                return this.packageCoure_checkList[item.goodsId].length > 0
              }
              return false
            } else if (['7'].includes(this.currentId)) {
              return this.checkList.includes(item.goodsId)
            } else {
              return this.checkList.includes(item.goodsId)
            }
          })()

          console.log(
            `Item ${
              item.goodsId || item.specId || item.materialId
            }: ${isSelected}`
          )
          return isSelected
        })
        .map(item => {
          if (['A7'].includes(this.currentId) && item.children) {
            // 对于套餐课,只返回已选中的子课程
            return {
              ...item,
              children: item.children.filter(child =>
                this.checkList.includes(child._goodsId)
              )
            }
          }
          return item
        })

      // 选了相同老师课程
      const res = this.success(this.checkListInfo, this.checkList, selectedData)
      if (Object.prototype.toString.call(res) === '[object Promise]') {
        return res.then(() => {
          this.visible = false
        })
      } else if (!res) {
        this.visible = false
      }
    },
    close() {
      this.visible = false
    },
    checkChange(res, item, index) {
      if (this.multiple) {
        // 多选
        if (res) {
          // 添加
          this.checkListInfo.push(item)
        } else {
          // 删除
          console.log('this.currentId', this.currentId)
          const i = this.checkListInfo.findIndex(v => {
            if (
              ['0', '1', '2', '3', '4', '5', '6', '7', '10'].includes(
                this.currentId
              )
            ) {
              return v.goodsId === item.goodsId
            } else if (['51'].includes(this.currentId)) {
              return v.specId === item.specId
            } else {
              return v.materialId === item.materialId
            }
          })
          console.log(i, 'i')
          if (i >= 0) this.checkListInfo.splice(i, 1)
        }
      } else {
        // 单选
        this.checkListInfo = []
        this.checkList = []
        this.checkListInfo.push(item)
        if (['51'].includes(this.currentId)) {
          this.checkList.push(item.specId)
        } else {
          this.checkList.push(item.goodsId)
        }
      }
      console.log(44444444, this.checkListInfo)
      this.loading = false
    },
    // 点击搜索
    searchFn() {
      this.current = 1
      this.tableData = []
      this.getList()
    },
    async getClassList() {
      this.treeLoading = true
      this.form = {
        id: '',
        name: ''
      }
      const res = await store.dispatch('option/getClass')
      if (this.currentId === '9') {
        this.classlist = res.audioClass
        this.listType = 'list'
      } else if (this.currentId === '8') {
        this.classlist = res.videoClass
      }
      this.treeLoading = false
      this.getList()
    },
    treeClick(data, node) {
      console.log('点击触发', data)
      this.form.id = data.id === '-1' ? '' : data.id
      this.form.name = data.dirName
      this.current = 1
      this.getList()
    },
    // 选择讲师触发回调事件
    teacherSelect(val) {
      this.tearch.lecturerId = val.lecturerId
      this.tearch.lecturerName = val.lecturerName
      this.searchFn()
    },
    // 获取默认提示语
    getPlaceholder() {
      const index = this.tabList.findIndex(v => v.id === this.currentId)
      if (index > -1) {
        return this.tabList[index].placeholder
          ? this.tabList[index].placeholder
          : '请输入关键词'
      } else {
        return '请输入关键词'
      }
    },
    // 获取平台课程
    // 获取商品列表
    getPlatformGoodsList() {
      this.loading = true
      let onlineFlag = 0
      if (['5'].includes(this.currentId)) {
        onlineFlag = 1
      }
      const params = {
        current: this.current,
        size: this.size,
        contentName: this.searchType === 1 ? this.search : '',
        goodsId: this.searchType === 2 ? this.searchGoodsId : '',
        goodsType: this.currentId === '10' ? '8' : this.currentId,
        onlineFlag,
        singleLecture: this.singleLecture,
        starSalePrice: this.singleLecture,
        endSalePrice: this.endSalePrice,
        shelveFlag: 0,
        ...this.params,
        lecturerId: this.tearch.lecturerId,
        curriculumType: this.initSearch?.curriculumType || undefined,
        sortType: this.slort
      }
      if (this.filterateHidden) {
        params.notLikeContentName = '私域专享'
        params.shelveHideFlag = 0
        params.saleType = 1
      } else {
        delete params.notLikeContentName
        params.shelveHideFlag = ''
        delete params.saleType
      }
      if (this.tearchSearch) {
        params.lecturerId = this.tearch.lecturerId
      }
      platformGoodsList(params)
        .then(res => {
          res.data.records.map(v => {
            v.childrenOpen = false
          })
          this.tableData = res.data.records
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 套餐课点击触发
    onClickPackageCourse(value, item, index) {
      if (this.loading) return
      console.log(this.loading, this.check, value, this.checkList, value)
      this.loading = true
      if (this.check.includes(item._goodsId) || this.disabledFn(item)) {
        return
      }
      const i = this.checkList.findIndex(v => v === value)
      console.log(i, 'i')
      i > -1 ? this.checkList.splice(i, 1) : this.checkList.push(value)
      this.checkChange(i === -1, item, index)
    },
    // A7套餐课点击触发
    onClickA7PackageCourse(value, c_item, index, item) {
      if (
        !(
          (c_item.goodsType === 3 || c_item.goodsType === 4) &&
          c_item.productCategory === 1
        ) ||
        this.check.includes(c_item._goodsId) ||
        this.disabledFn(c_item)
      ) {
        return
      }
      if (this.changeLoading) return
      this.changeLoading = true
      const i = this.checkList.findIndex(v => v === value)
      const c_index = this.checkListInfo.findIndex(
        v => v.goodsId === item.goodsId
      )

      if (i > -1) {
        // 删除
        this.checkList.splice(i, 1)
        if (
          this.checkListInfo[c_index] &&
          this.checkListInfo[c_index].children
        ) {
          const c_index_chidren = this.checkListInfo[
            c_index
          ].children.findIndex(v => v._goodsId === c_item._goodsId)
          c_index_chidren > -1 &&
            this.checkListInfo[c_index].children.splice(c_index_chidren, 1)
        }
      } else {
        // 添加
        this.checkList.push(value)
        if (c_index > -1) {
          this.checkListInfo[c_index] &&
            this.checkListInfo[c_index].children.push(c_item)
        } else {
          this.checkListInfo.push({
            ...item,
            children: [c_item]
          })
        }
      }

      this.changeLoading = false
      console.log(this.checkListInfo, this.checkList)
      // this.checkChange(value, item, index)
    },
    // 套餐课全选直播课
    onClickPackageA7Course(value, item, index, res) {
      if (item.liveCourseNum === 0 || this.disabledFn(item)) {
        return
      }

      if (!this.multiple) {
        // 单选
        this.checkList = []
        this.checkListInfo = []
      }

      const obj = this.tableData.find(v => v.goodsId === value)
      if (obj && obj.children) {
        const ids = []
        const childrenArr = []
        obj.children.map(v => {
          if (
            (v.goodsType === 3 || v.goodsType === 4) &&
            v.productCategory === 1
          ) {
            ids.push(v._goodsId)
            childrenArr.push(v)
          }
        })
        const index = this.checkListInfo.findIndex(v => v.goodsId === value)
        // 多选
        if (res) {
          // 全选
          this.checkList = [...new Set([...this.checkList, ...ids])]
          index > -1
            ? (this.checkListInfo[index] = childrenArr)
            : this.checkListInfo.push({ ...obj, children: childrenArr })
        } else {
          // 全取消
          this.checkList = this.checkList.filter(
            element => !ids.includes(element)
          )
          index > -1 && this.checkListInfo.splice(index, 1)
        }
      }
    },
    onhandleOpen(item) {
      item.childrenOpen = !item.childrenOpen
      if (item.childrenOpen) {
        this.$nextTick(() => {
          const element = document.getElementById(
            `packageCoure-check-view-group${item.goodsId}`
          )
          element.scrollIntoView({
            behavior: 'smooth' // 平滑滚动效果
          })
        })
      }
    },
    ifCheckAll(item) {
      if (
        Object.getOwnPropertyNames(this.packageCoure_checkList).length === 0
      ) {
        return false
      }
      if (!this.packageCoure_checkList[item.goodsId]) {
        return false
      }
      if (
        this.packageCoure_checkList[item.goodsId] &&
        this.packageCoure_checkList[item.goodsId].length === 0
      ) {
        return false
      }
      if (
        this.packageCoure_checkList[item.goodsId] &&
        this.packageCoure_checkList[item.goodsId].length !== item.liveCourseNum
      ) {
        return false
      }
      return true
    },
    handleCheckAll() {
      if (this.checkedAll) {
        if (
          ['0', '1', '2', '3', '4', '5', '6', '7', '10'].includes(
            this.currentId
          )
        ) {
          const arr = this.tableData.filter(i => !this.check.includes(i.goodsId) && !this.disabledFn(i))
          this.checkList.push(...arr.map(v => v.goodsId))
          this.checkListInfo.push(...arr)
        } else if (['51'].includes(this.currentId)) {
          const arr = this.tableData.filter(i => !this.check.includes(i.specId) && !this.disabledFn(i))
          this.checkList.push(...arr.map(v => v.specId))
          this.checkListInfo.push(...arr)
        } else if (['8', '9'].includes(this.currentId)) {
          const arr = this.tableData.filter(i => !this.check.includes(i.materialId))
          this.checkList.push(...arr.map(v => v.materialId))
          this.checkListInfo.push(...arr)
        }
      } else {
        this.checkList.splice(0, this.checkList.length)
        const item = this.tableData[0]
        const index = this.checkListInfo.findIndex(v => {
          if (
            ['0', '1', '2', '3', '4', '5', '6', '7', '10'].includes(
              this.currentId
            )
          ) {
            return v.goodsId === item.goodsId
          } else if (['51'].includes(this.currentId)) {
            return v.specId === item.specId
          } else {
            return v.materialId === item.materialId
          }
        })
        this.checkList.splice(index, this.tableData.length)
        this.checkListInfo.splice(index, this.tableData.length)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search_btn {
  width: 68px;
  height: 32px;
  border-radius: 4px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  > span {
    font-size: 14px;
  }
}
.search_btn + .search_btn {
  margin-left: 0;
}
.search_paramy {
  background: #0c6fff;
  color: #fff;
}
.choose_resource {
  .window-search {
    position: relative;
    height: 36px;
    line-height: 36px;
    margin: 20px 20px 10px 20px;
    display: flex;
    align-items: center;
    .order-time-box {
      display: flex;
    }
    .input-with-select {
      width: 108px;
      height: 32px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      border-radius: 3px 0px 0px 3px;
    }
    .filter_teacherSelect {
      ::v-deep {
        .el-input__inner {
          border-radius: 0px 3px 3px 0px;
        }
      }
    }
    .input-with-select-chang {
      ::v-deep .el-input__inner {
        border: none;
        border-radius: 3px 0px 0px 3px;
        border: 1px solid #d8dce6;
        border-right: none;
      }
    }
    .text {
      margin-right: 8px;
      color: #333333;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
    }
    .moneyBox {
      display: flex;
      align-items: center;
    }
  }
  .window-tab {
    margin: 0 20px;
    display: flex;
    justify-content: space-between;
    .tab-wrapper {
      display: flex;
      width: 100%;
      height: inherit;
      border-bottom: 1px solid #eeeeee;
      .tab-item {
        // padding: 0 20px;
        // width: 70px;
        width: 100%;
        height: 100%;
        line-height: 40px;
        // position: relative;
        // bottom: -1px;
        // text-align: center;
        // cursor: pointer;
      }
      .tab-active {
        border-bottom: 2px solid #2a75ed;
        color: #2a75ed;
      }
    }
  }
  .window-list {
    width: 100%;
    height: 396px;
    // overflow-y: scroll;
    // padding: 0 20px;
    box-sizing: border-box;
    position: relative;

    &::-webkit-scrollbar {
      width: 8px;
      height: 10px;
      background-color: rgba(0, 0, 0, 0);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 0.2);
      transition: all 0.4s ease;
      -moz-transition: all 0.4s ease;
      -webkit-transition: all 0.4s ease;
      -o-transition: all 0.4s ease;
    }
    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.1);
    }
    ::v-deep {
      .resource-item-wrapper {
        width: 100%;
        padding: 0 20px;
        min-height: 72px;
        display: -webkit-flex;
        display: flex;
        -webkit-align-items: center;
        -moz-align-items: center;
        -ms-align-items: center;
        -o-align-items: center;
        align-items: center;
        .resource-item-wrapper-box {
          padding: 0 20px;
          height: 504px;
          width: 100%;
          box-sizing: border-box;
          overflow: auto;
        }
        .el-checkbox-group {
          width: 100%;
          .el-checkbox {
            width: 100%;
            display: flex;
            align-items: center;
            padding: 15px 0;
            min-height: 72px;
            border-bottom: 1px solid #eeeeee;
            .resource-item-wrapper-box-group {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 1267px;
              .item-wrapper {
                display: flex;
                flex: 1;
                overflow: hidden;
                display: flex;
                align-items: center;
                cursor: pointer;
                line-height: 1;
                text-overflow: ellipsis;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                > img {
                  width: 60px;
                  height: 60px;
                  border-radius: 2px;
                  margin-right: 10px;
                  border: 0;
                  vertical-align: middle;
                }
                > .image-previewer {
                  width: 60px;
                  height: 60px;
                  border-radius: 2px;
                  margin-right: 10px;
                  border: 0;
                  vertical-align: middle;
                  background: rgb(245, 247, 250);
                }
                .item-info {
                  // max-width: 550px;
                  flex: 1;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  min-height: 60px;
                  .item-name {
                    // max-width: 480px;
                    height: 20px;
                    line-height: 20px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-bottom: 6px;
                    color: #353535;
                  }
                  .item-price {
                    height: 24px;
                    line-height: 24px;
                    display: inline-block;
                    color: #fb6161;
                  }
                }
              }
              .packageInputView {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-left: 10px;
                .packageInputViewText {
                  color: #333333;
                  font-family: 'Microsoft YaHei';
                  font-size: 14px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 22px;
                  margin-right: 8px;
                }
                .el-input__inner {
                  text-align: left;
                }
              }
              .item-wrapper-left {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-left: 10px;
                width: 68px;
                height: 32px;
                flex-shrink: 0;
                border-radius: 4px;
                border: 1px solid #dcdfe5;
                background: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                .btn-left {
                  color: #0c6fff;
                  font-family: 'Microsoft YaHei';
                  font-size: 14px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 14px;
                }
              }
            }
          }
        }

        > .ss-material-main-tree {
          width: 100%;
          display: flex;
          height: 504px;
          .ss-material-main-tree-left {
            width: 210px;
            border: 1px solid #ebebeb;
            margin-right: 10px;
          }
          .ss-material-main-tree-right {
            width: calc(100% - 200px);
            height: 504px;
            overflow: auto;
          }
        }
      }
    }
  }

  .resource-item-wrapper-box {
    .item-wrapper {
      display: flex;
      align-items: center;
      > .item-info {
        margin-left: 25px;
      }
      .image-previewer {
        width: 60px;
        height: 60px;
      }
      .item-price {
        color: red;
      }
    }
    .packageCoure-check-view-group {
      width: 100%;
      padding: 15px 0;
      min-height: 72px;
      border-bottom: 1px solid #eeeeee;
      .packageCoure-item-wrapper-box-group {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 1267px;
        .packageCoure-item-wrapper {
          display: flex;
          flex: 1;
          overflow: hidden;
          display: flex;
          align-items: center;
          cursor: pointer;
          line-height: 1;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          > img {
            width: 60px;
            height: 60px;
            border-radius: 2px;
            margin-right: 10px;
            border: 0;
            vertical-align: middle;
          }
          > .image-previewer {
            width: 60px;
            height: 60px;
            border-radius: 2px;
            margin-right: 10px;
            border: 0;
            vertical-align: middle;
            background: rgb(245, 247, 250);
          }
          .packageCoure-item-info {
            // max-width: 550px;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 60px;
            .item-name {
              // max-width: 480px;
              height: 20px;
              line-height: 20px;
              font-weight: 500;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-bottom: 6px;
              color: #353535;
            }
            .item-price {
              height: 24px;
              line-height: 24px;
              display: inline-block;
              color: #fb6161;
            }
            .item-chidren-name {
              display: flex;
              align-items: center;
              .item-name {
                margin-bottom: 0;
                max-width: 1000px;
              }
              .item-chidren-type {
                height: 16px;
                line-height: 16px;
                font-size: 12px;
                padding: 0 7px;
                border-radius: 12px;
                background: #f7e7e6;
                color: #a13a00;
              }
              .item-chidren-type-live {
                background: #e6f7ea;
                color: #00b42a;
              }
              .item-chidren-type-offline {
                background: #ffe7d0;
                color: #8b3a00;
              }
            }
          }
        }
        > .packageCoure-item-wrapper-left {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-left: 10px;
          width: 68px;
          height: 32px;
          flex-shrink: 0;
          border-radius: 4px;
          border: 1px solid #dcdfe5;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          .btn-left {
            color: #0c6fff;
            font-family: 'Microsoft YaHei';
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 14px;
          }
        }
      }
      .packageCoure-item-children {
        max-height: 413px;
        overflow: auto;
      }
    }
  }
}
.size-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
  margin-right: 20px;
}
img {
  object-fit: contain;
  background: #f5f7fa;
}
.dialogFooter {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  box-sizing: border-box;
  .dialogFooterRight {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
.noData {
  width: 100%;
  text-align: center;
  padding: 20px;
}
::v-deep {
  .el-tabs__header {
    margin: 0;
  }
  .el-pagination__jump {
    margin-left: 0;
  }
  // .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  //   padding-left: 20px;
  // }
  .el-tabs__nav-wrap::after {
    height: 0px;
  }
  .noMultiple {
    .el-checkbox__inner {
      border-radius: 50%;
    }
  }
}
.resource-item-wrapper-box-noData {
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  > img {
    width: 405px;
    height: 202px;
    background: #fff;
  }
  > .noDataText {
    margin-top: 10px;
    font-size: 18px;
    font-family: MicrosoftYaHei;
    color: #919293;
    line-height: 26px;
  }
}
.tab-slort {
  display: flex;
  align-items: center;
  > span {
    width: 60px;
  }
}
.check-all {
  margin-left: 20px;
  margin-top: 5px;
  margin-right: 20px;
}
</style>
