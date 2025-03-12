// 组装百度返回的字符串数据
export function assembleBaiduString(data, account) {
  const list = []
  const dom = new DOMParser().parseFromString(data, 'text/html')
  const item = dom.querySelectorAll('.c-container.result')
  for (let i = 0; i < item.length; i++) {
    list.push({
      title: item[i].querySelector('.c-title a') ? item[i].querySelector('.c-title a').innerHTML : '',
      desc: item[i].querySelector('.content-right_8Zs40')
        ? item[i].querySelector('.content-right_8Zs40').innerHTML
        : '',
      coverSrc: item[i].querySelector('.c-img img') ? item[i].querySelector('.c-img img').getAttribute('src') : '',
      link: item[i].getAttribute('mu'),
      releasTime: item[i].querySelector('.c-color-gray2') ? item[i].querySelector('.c-color-gray2').innerHTML : '',
      author: '',
      account
    })
  }
  return list
}

