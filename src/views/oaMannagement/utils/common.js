import { getFileType } from '@/utils/index'

//根据row的状态返回对应url
export const handleShowFileUrlByStatus = (row, type) => {
  if (row.sealStatus === 2 || row.employeeSignStatus === 1) {
    //已落章或已签署
    return row.signedContractUrl
  }
  return row.contractTemplateUrl
}

//工龄转换
export const convertWorkExperience = months => {
  if (isNaN(months) || months < 0) {
    return ''
  }
  if (months < 12) {
    return `${months}月`
  } else {
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    if (remainingMonths == 0) {
      return `${years}年`
    } else {
      return `${years}年${remainingMonths}月`
    }
  }
}

export const toFixedTwo = num => {
  return num ? `${num.toFixed(2)}` : ''
}

//预览
export const browse = url => {
  if (!url) {
    return
  }
  if (['txt', 'TXT', 'csv', 'CSV'].includes(getFileType(url).suffix)) {
    const hrefUrl = 'http://view.xdocin.com/xdoc?_xdoc=' + url
    window.open(hrefUrl)
    return
  }
  if (
    ['pdf', 'PDF', 'png', 'PNG', 'jpg', 'JPG'].includes(getFileType(url).suffix)
  ) {
    window.open(url)
    return
  }
  const hrefUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + url
  window.open(hrefUrl)
}
