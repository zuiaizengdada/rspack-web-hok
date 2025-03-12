import request from '@/utils/request2'

// 修改-新增自定义快捷键
export function updateShortcutKey(data) {
  return request({
    url: '/cloud/product/operateClips/updateShortcutKey',
    method: 'post',
    data
  })
}

// 查询快捷键
export function qryShortcutKey(query) {
  return request({
    url: '/cloud/product/operateClips/qryShortcutKey',
    method: 'get',
    params: query
  })
}

// 删除自定义快捷键
export function delShortcutKey(data) {
  return request({
    url: '/cloud/product/operateClips/delShortcutKey',
    method: 'post',
    data
  })
}

