// 组装百度返回的字符串数据
export function assembleBaiduString(data) {
  const list = []
  const dom = new DOMParser().parseFromString(data.data, 'text/html')
  const item = dom.querySelectorAll('.video_list')

  for (let i = 0; i < item.length; i++) {
    list.push({
      vidoeId: item[i].querySelector('.small_img_con').getAttribute('href'),
      title: item[i].querySelector('.video_small_intro')
        ? item[i].querySelector('.video_small_intro .video-title').innerHTML
        : '',
      desc: item[i].querySelector('.video_small_intro .c-font-normal.c-color-text')
        ? item[i].querySelector('.video_small_intro .c-font-normal.c-color-text').innerHTML
        : '',
      coverSrc: item[i].querySelector('.short-video-img img')
        ? item[i].querySelector('.short-video-img img').getAttribute('src')
        : '',
      iframeSrc: item[i].querySelector('.small_img_con').getAttribute('href'),
      publishDate: item[i].querySelector('.video-no-font')
        ? item[i]
          .querySelector('.video-no-font span:last-child')
          .innerHTML.replaceAll('发布时间：', '')
        : '',
      author: item[i].querySelector('.video-no-font .wetSource')
        ? item[i].querySelector('.video-no-font .wetSource').innerHTML.replaceAll('来源：', '')
        : '',
      platform: 1,
      playCount: '',
      zanCount: ''
    })
  }
  return list
}

// 组装百度返回的字符串数据
export function assembleSogouString(data, account) {
  const list = []
  const dom = new DOMParser().parseFromString(data.data, 'text/html')
  const item = dom.querySelectorAll('.short-video-item')
  for (let i = 0; i < item.length; i++) {
    console.log(item[i])
    list.push({
      vidoeId: '',
      title: item[i].querySelector('.sort_lst_tit2')
        ? item[i].querySelector('.sort_lst_tit2 a').innerHTML
        : '',
      desc: '',
      coverSrc: item[i].querySelector('.sort_lst_thumb')
        ? item[i].querySelector('.sort_lst_thumb').getAttribute('data-src')
        : '',
      iframeSrc: 'https://v.sogou.com' + item[i].querySelector('.sort_lst_thumb').getAttribute('href'),
      publishDate: item[i].querySelector('.sort_lst_txt')
        ? item[i]
          .querySelector('.sort_lst_txt_rgt')
          .nextSibling.textContent.replace('\n', '')
          .trim()
        : '',
      author: item[i].querySelector('.sort_lst_txt')
        ? item[i].querySelector('.sort_lst_txt .sort_lst_txt_rgt').innerHTML
        : '',
      platform: 2,
      playCount: '',
      zanCount: '',
      duration: item[i].querySelector('.thumb-duration').innerHTML
    })
  }
  return list
}

export function assembleSogouJSON(data, account) {
  const list = []
  for (let i = 0; i < data.length; i++) {
    list.push({
      vidoeId: data[i].titleEsc,
      title: data[i].titleEsc,
      desc: '',
      coverSrc: data[i].picurl,
      iframeSrc: 'https://v.sogou.com' + data[i].url,
      publishDate: data[i].dateTime,
      platform: 2,
      author: data[i].site,
      playCount: '',
      zanCount: '',
      duration: data[i].duration
    })
  }
  return list
}
