/** 内容管理 */
import request from '@/utils/request'
import request2 from '@/utils/request2'
/** 素材管理 */

/** 获取目录列表 */
export function getMaterialList() {
  return request({
    url: '/material/dir/ls',
    method: 'get'
  })
}

/** 新增目录 */
export function addMaterial(data) {
  return request({
    url: '/material/dir/mk',
    method: 'POST',
    data
  })
}

/** 删除目录 */
export function delMaterial(params) {
  return request({
    url: `/material/dir/rm?dirId=${params}`,
    method: 'DELETE'
  })
}

/** 快捷修改商品名称 */
export function updateContentName(data) {
  return request({
    url: `/material/column/update`,
    method: 'POST',
    data
  })
}

/** 修改目录 */
export function editMaterial(data) {
  return request({
    url: '/material/dir/alter',
    method: 'PUT',
    data
  })
}

/** 获取关联详情 */
export function getTeacherDirInfo(params) {
  return request({
    url: `/material/dir/sub/relate/teacher?dirId=${params}`,
    method: 'get'
  })
}

/** 目录关联老师 */
export function relationOff(data) {
  return request({
    url: '/material/dir/relate/teacher',
    method: 'PUT',
    data
  })
}

/** 目录取消关联老师 */
export function relationOn(params) {
  return request({
    url: `/material/dir/cancel/relate/teacher?dirId=${params}`,
    method: 'get'
  })
}

/** 上传素材 */
export function material(data) {
  return request({
    url: '/material',
    method: 'POST',
    data
  })
}

/** 删除素材 */
export function deleteBatch(data) {
  return request({
    url: '/material/delete/batch',
    method: 'post',
    data
  })
}

/** 查询 */
export function materialList(params) {
  return request({
    url: '/material/list',
    method: 'get',
    params
  })
}

/** 分页查询 */
export function materialPage(params) {
  return request({
    url: '/material/page',
    method: 'get',
    params
  })
}

/** 修改/移动素材 */
export function materialUpdate(data) {
  return request({
    url: '/material/update',
    method: 'post',
    data
  })
}

/** 批量移动素材 */
export function materialupdateBatch(data) {
  return request({
    url: '/material/update/batch',
    method: 'post',
    data
  })
}

/** 上传图片base64 */
export function imgBase64(data) {
  return request({
    url: '/upload/img/base64',
    method: 'post',
    data
  })
}

/** 商品接口 */

/** 分页查询列表 */
export function getGoodsList(params) {
  return request({
    url: '/material/goods/page',
    method: 'get',
    params
  })
}

/** 商品接口 */

/** 分页查询列表 */
export function getShowGoodsList(params) {
  return request({
    url: '/material/goods/show/page',
    method: 'get',
    params
  })
}

/** 详情 */
export function getGoodsDetail(params) {
  return request({
    url: `/material/goods/detail/${params}`,
    method: 'get'
  })
}

/** 批量删除图文视频音频专栏大专栏 */
export function delGoodsBatch(data) {
  return request({
    url: '/material/goods/delete/batch',
    method: 'post',
    data
  })
}

/** 修改图文音频视频专栏大专栏 */
export function editGoods(data) {
  return request({
    url: '/material/goods',
    method: 'PUT',
    data
  })
}

/** 新建图文视频音频专栏大专栏 */
export function addGoods(data) {
  return request({
    url: '/material/goods',
    method: 'POST',
    data
  })
}

/** 新建线下课程 */
export function addGoodsOoffline(data) {
  return request({
    url: '/material/goods/offline',
    method: 'POST',
    data
  })
}

/** 批量上下架图文视频音频专栏大专栏 */
export function shelfGoods(data) {
  return request({
    url: '/material/goods/shelf/batch',
    method: 'POST',
    data
  })
}

/** 大专栏或小专栏详情分页查询接口 */
export function columPage(params) {
  return request({
    url: '/material/column/page',
    method: 'get',
    params
  })
}

/** 批量添加小专栏或者视频音频图文 */
export function columnBatch(data) {
  return request({
    url: '/material/column/batch',
    method: 'post',
    data
  })
}

/** 批量取消关联 */
export function disassociateBatch(data) {
  return request({
    url: '/material/column/disassociate/batch',
    method: 'post',
    data
  })
}

// 推荐商品
// 分页
export function recommendPage(params) {
  return request({
    url: '/goods/recommend/page',
    method: 'get',
    params
  })
}
// 批量添加
export function recommendAddBatch(data) {
  return request({
    url: '/goods/recommend/batch',
    method: 'post',
    data
  })
}
// 批量取消关联
export function recommendDisassociateBatch(data) {
  return request({
    url: '/goods/recommend/disassociate/batch',
    method: 'post',
    data
  })
}

// 排序
export function recommendSort(data) {
  return request({
    url: '/goods/recommend/sort',
    method: 'post',
    data
  })
}

// 练习
// 根据商品编号查询对应的练习
export function getPracticeByGoodsId(goodsId) {
  return request({
    url: `/practice/goods/${goodsId}`,
    method: 'get'
  })
}
// 编辑练习题
export function editPractice(data) {
  return request({
    url: '/practice',
    method: 'post',
    data
  })
}

// 查询学员练习
export function getUserPractice(data) {
  return request({
    url: '/practice/user-answer/page',
    method: 'POST',
    data
  })
}

// 编辑学员练习
export function editUserPractice(data) {
  return request({
    url: '/practice/user-answer',
    method: 'PUT',
    data
  })
}

// 用户评价
export function goodsCommentPage(params) {
  return request({
    url: '/goods/comment/page',
    method: 'get',
    params
  })
}

// 用户评价详情
export function getCommentDetail(id) {
  return request({
    url: `/goods/comment/detail/${id}`,
    method: 'get'
  })
}

// 批量审核
export function commentApproveBatch(data) {
  return request({
    url: '/goods/comment/approve/batch',
    method: 'put',
    data
  })
}

// 批量删除
export function commentDeleteBatch(data) {
  return request({
    url: '/goods/comment/delete/batch',
    method: 'DELETE',
    data
  })
}

// 推荐/常规
export function goodsCommentBatch(data) {
  return request({
    url: '/goods/comment/comment/batch',
    method: 'put',
    data
  })
}

// 内容管理--排序
export function materialColumnSort(data) {
  return request({
    url: '/material/column/sort',
    method: 'post',
    data
  })
}

// 批量添加抖店快手关联商品
export function addGoodsThirdBatch(data) {
  return request({
    url: '/goods/third/batch',
    method: 'POST',
    data
  })
}
// 批量删除关联
export function delGoodsThirdBatch(data) {
  return request({
    url: '/goods/third/disassociate/batch',
    method: 'POST',
    data
  })
}
// 分页查询
export function getGoodsThirdPage(params) {
  return request({
    url: '/goods/third/page',
    method: 'get',
    params
  })
}

// 根据商品id查询该商品下面那些素材/商品被选择了
export function getMaterialGoodsList(params) {
  return request({
    url: '/material/column/goods/list',
    method: 'get',
    params
  })
}

// 直播专栏: 根据商品id查询该期数商品下面那些素材/商品被选择了
export function getMaterialGoodsLiveList(params) {
  return request({
    url: '/material/column/goods/live',
    method: 'get',
    params
  })
}

// 查询期数列表
export function getPeriodList(params) {
  return request({
    url: '/live/period/list',
    method: 'get',
    params
  })
}

// 添加期数
export function addPeriod(data) {
  return request({
    url: '/live/period',
    method: 'post',
    data
  })
}

// 编辑期数
export function editPeriod(data) {
  return request({
    url: '/live/period',
    method: 'PUT',
    data
  })
}

// 批量自动分配
export function periodAuto(data) {
  return request({
    url: '/live/period/auto/batch',
    method: 'POST',
    data
  })
}

// 复制期数
export function periodCopy(data) {
  return request({
    url: '/live/period/copy',
    method: 'POST',
    data
  })
}

// 删除期数
export function delectPeriod(id) {
  return request({
    url: `/live/period/${id}`,
    method: 'DELETE'
  })
}

// 分页查询班主任
export function getHeadTeacherPage(params) {
  return request({
    url: '/head-teacher/page',
    method: 'GET',
    params
  })
}
// 添加班主任
export function addHeadTeacher(data) {
  return request({
    url: '/head-teacher/add',
    method: 'post',
    data
  })
}

// 批量添加班主任
export function addHeadTeacherBatch(data) {
  return request({
    url: '/head-teacher/add/batch',
    method: 'POST',
    data
  })
}

// 删除班主任
export function delHeadTeacher(id) {
  return request({
    url: `/head-teacher/${id}`,
    method: 'DELETE'
  })
}

// 批量删除班主任
export function delHeadTeacherBatch(data) {
  return request({
    url: '/head-teacher/batch',
    method: 'DELETE',
    data
  })
}

// 学员分析
export function analysisUser(params) {
  return request({
    url: '/user/order/live/analysis',
    method: 'GET',
    params
  })
}

// 按专栏进行查询(企微SOP)
export function periodPageContent(params) {
  return request({
    url: '/live/period/page/content',
    method: 'GET',
    params
  })
}

// 获取班主任列表
export function getTeacherPage(params) {
  return request({
    url: '/corp-user',
    method: 'GET',
    params
  })
}

// 分页查询线下课数据【规格】
export function getOfflineGoodsSpecPage(params) {
  return request({
    url: '/material/goods/offline/goods/spec/page',
    method: 'GET',
    params
  })
}

// 【线下课】新增内容管理视频
export function addOfflineContent(data) {
  return request({
    url: '/material/goods/addContent',
    method: 'POST',
    data
  })
}

// 【线下课】批量删除内容管理管理视频
export function delOfflineContent(data) {
  return request({
    url: '/material/goods/delContent',
    method: 'POST',
    data
  })
}

// 【线下课】查询内容管理视频
export function getOfflineContent(params) {
  return request({
    url: '/material/goods/qryContent',
    method: 'get',
    params
  })
}

// 批量排序
export function columnBatchSort(data) {
  return request({
    url: '/material/column/batch/sort',
    method: 'post',
    data
  })
}

// 获取短链接
export function getShortUrl(data) {
  return request2({
    url: '/cloud/delivery/schedule/getShortUrl',
    method: 'post',
    data
  })
}

// 规则库列表
export function getWarehouse(params) {
  return request2({
    url: '/cloud/delivery/assistant/warehouse/page',
    method: 'get',
    params
  })
}
// 新增库列表
export function addWarehouse(data) {
  return request2({
    url: '/cloud/delivery/assistant/warehouse/add',
    method: 'post',
    data
  })
}
// 规则库助教分页列表
export function addWarehouseStaff(params) {
  return request2({
    url: '/cloud/delivery/assistant/warehouse/staff/page',
    method: 'GET',
    params
  })
}
// 规则库助教分配状态修改
export function autoDistribute(data) {
  return request2({
    url: '/cloud/delivery/assistant/warehouse/staff/modify/autoDistribute',
    method: 'PUT',
    data
  })
}
// 规则库新增助教
export function addTeachingStaff(data) {
  return request2({
    url: '/cloud/delivery/assistant/warehouse/staff/add',
    method: 'post',
    data
  })
}

// 规则库助教删除
export function deleteTeachingStaff(data) {
  return request2({
    url: '/cloud/delivery/assistant/warehouse/staff/delete',
    method: 'DELETE',
    data
  })
}
// 根据规则库新增助教
export function addByWarehouse(data) {
  return request2({
    url: '/cloud/delivery/assistant/add/byWarehouse',
    method: 'post',
    data
  })
}

// 分页查询线下课程类型
export function coursePage(params) {
  return request({
    url: '/course/type/page',
    method: 'get',
    params
  })
}

// 排序线下课程类型
export function courseSort(data) {
  return request({
    url: '/course/type/sort',
    method: 'post',
    data
  })
}

// 新增线下课程类型
export function courseCreate(data) {
  return request({
    url: '/course/type/create',
    method: 'post',
    data
  })
}

// 编辑线下课程类型
export function courseEdit(data) {
  return request({
    url: '/course/type/edit',
    method: 'post',
    data
  })
}

// 停用-启用线下课程类型
export function courseStop(data) {
  return request({
    url: '/course/type/stop',
    method: 'post',
    data
  })
}

// 删除线下课程类型
export function courseDelete(data) {
  return request({
    url: '/course/type/delete',
    method: 'post',
    data
  })
}

// 查询线下课程所有课程类型
export function courseList(params) {
  return request({
    url: '/course/type/list',
    method: 'get',
    params
  })
}

// 查询线下课程所有课程类型
export function courseListWithDisable(params) {
  return request({
    url: '/course/type/list/withDisable',
    method: 'get',
    params
  })
}

// 平台级分类查询
export function getPlatformCatalogueList(params) {
  return request({
    url: '/pf-catalogue-do/select/list',
    method: 'get',
    params
  })
}

/** 平台平台平台  分页查询列表 */
export function platformGoodsList(data) {
  return request2({
    url: '/cloud/admin/platform/goods/page',
    method: 'post',
    data
  })
}

/** 平台平台平台   课程详情 */
export function platformGoodsDetail(params) {
  return request({
    url: `/material/goods/pf/detail/${params}`,
    method: 'get'
  })
}
// 分页查询生成链接日志
export function goodsLogPage(params) {
  return request({
    url: `/goods/mount/log/page`,
    method: 'get',
    params
  })
}

// 添加生成链接日志
export function goodsMountAdd(data) {
  return request({
    url: `/goods/mount/add`,
    method: 'post',
    data
  })
}

// 套餐课列表-不分页
export function getGoodsPackageAll(data) {
  return request({
    url: '/goodsPackage/all',
    method: 'POST',
    data
  })
}

// 分页查询小程序挂载商品
export function goodsMountPage(params) {
  return request({
    url: `/goods/mount/page`,
    method: 'get',
    params
  })
}

// 获取套餐课（直播用）
export function getMaterialGoodsByType(params) {
  return request({
    url: '/material/goods/list/byType',
    method: 'get',
    params
  })
}

// 套餐课 套餐课程 商品 列表（详情页面Tab1）
export function getPackageGoodsList(params) {
  return request2({
    url: '/cloud/admin/goodsPackage/selectPageGoodsPackage',
    method: 'post',
    data: params
  })
}

// 套餐课 商品详情 修改商品套餐课价格
export function updatePackageGoodsPrice(data) {
  return request2({
    url: `/cloud/admin/goodsPackage/updateGoodsPackage`,
    method: 'POST',
    data
  })
}
// 套餐课 商品详情 移除套餐课 商品
export function removePackageGoods(data) {
  return request2({
    url: '/cloud/admin/goodsPackage/deleteGoodsPackage',
    method: 'post',
    data
  })
}

// 套餐课 商品详情 添加商品
export function addPakcageGoods(data) {
  return request2({
    url: '/cloud/admin/goodsPackage/insertGoodsPackage',
    method: 'post',
    data
  })
}

// 套餐课 详情 交付配置 获取
export function getPackageDeliveryConfig(params) {
  return request2({
    url: '/cloud/delivery/delivery/goods/config/info',
    method: 'get',
    params
  })
}

// 套餐课 详情 交付配置 获取
export function savePackageDeliveryConfig(params) {
  return request2({
    url: '/cloud/delivery/delivery/goods/config/modify',
    method: 'post',
    data: params
  })
}
// 套餐课 详情 抖音小程序 商品列表
export function getPakcageDouyinGoods(params) {
  return request2({
    url: '/cloud/admin/goodsPackageMaterial/page',
    method: 'post',
    data: params
  })
}

// 套餐课 详情 抖音小程序 商品列表 修改商品名称
export function updatePackageGoodsName(data) {
  return request2({
    url: `/cloud/admin/goodsPackageMaterial/modify/name`,
    method: 'POST',
    data
  })
}

// 套餐课 详情 抖音小程序 商品列表 添加商品
export function addPakcageDouyinGoods(data) {
  return request2({
    url: '/cloud/admin/goodsPackageMaterial/insert',
    method: 'post',
    data
  })
}

// 套餐课 套餐课程 商品 ID列表 全量
export function getPackageGoodsIds(params) {
  return request2({
    url: `/cloud/admin/goodsPackage/idsByGoods/${params}`,
    method: 'get'
  })
}

// 套餐课 套餐课程 抖音小程序商品 ID列表 全量
export function getPackageDouyinGoodsIds(params) {
  return request2({
    url: `/cloud/admin/goodsPackageMaterial/idsByGoods/${params}`,
    method: 'get'
  })
}

// 套餐课 套餐课程 抖音小程序商品 批量移除
export function removePackageDouyinGoods(data) {
  return request2({
    url: '/cloud/admin/goodsPackageMaterial/delete',
    method: 'post',
    data
  })
}

/** 商品接口 */

/** 为创建线下扫码录单收款码查询商品 */
export function getQrcodeGoodsList(params) {
  return request({
    url: '/material/goods/offline-qrcode/list',
    method: 'get',
    params
  })
}

// 设置或取消常用商品
export function commonUseGoods(data) {
  return request2({
    url: '/cloud/edata-order/common-use-goods/add-or-cancel',
    method: 'post',
    data
  })
}
/** 查询商品规格 */
export function findGoodsIdByList(params) {
  return request({
    url: '/material/spec/findGoodsIdByList',
    method: 'get',
    params
  })
}

/** 标签 */
export function tagPage(params) {
  return request({
    url: '/material/tag/page',
    method: 'get',
    params
  })
}
// 新增标签
export function insertTag(data) {
  return request({
    url: '/material/tag/insertTag',
    method: 'post',
    data
  })
}
// 修改商品标签状态
export function updateMaterialTag(data) {
  return request({
    url: '/material/tag/updateMaterialTag',
    method: 'post',
    data
  })
}
// 删除标签
export function deleteMaterialTag(tagId) {
  return request({
    url: `/material/tag/delete/${tagId}`,
    method: 'DELETE'
  })
}

// 商品标签列表
export function materialTagList(tagId) {
  return request({
    url: `/material/tag/list`,
    method: 'get'
  })
}
