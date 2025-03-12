import axios from 'axios'
// import { Notification } from 'element-ui'
// import Vue from 'vue'
// const h = new Vue().$createElement
const isNewVersion = () => {
  const url = `//${window.location.host}/version.json?t=${new Date().getTime()}`
  // console.log(url, 'url')
  axios.get(url).then(res => {
    if (res.status === 200) {
      const vueVersion = res.data.version || ''
      const vueVerdes = res.data.verdes || ''
      console.log(vueVersion, 'vueVersion')
      const localVueVersion = localStorage.getItem('vueVersion')
      if (localVueVersion && localVueVersion !== vueVersion) {
        localStorage.setItem('vueVersion', vueVersion)
        console.log('版本更新，提示用户手动更新')
        window.location.reload()
        // Notification({
        //   title: '提示',
        //   message: h(
        //     'p',
        //     {
        //       style: 'width: 250px;display: flex;justify-content: space-between;'
        //     },
        //     [
        //       h('span', null, '系统有更新，请点击更新'),
        //       h(
        //         'a',
        //         {
        //           style: 'color: #409EFF;cursor: pointer;',
        //           on: {
        //             click: () => {
        //               localStorage.clear()
        //               localStorage.setItem('vueVersion', vueVersion)
        //               localStorage.setItem('verdes', vueVerdes)
        //               window.location.reload()
        //             }
        //           }
        //         },
        //         '更新'
        //       )
        //     ]
        //   ),
        //   duration: 0
        // })
        return
      } else {
        localStorage.setItem('vueVersion', vueVersion)
        localStorage.setItem('verdes', vueVerdes)
      }
    }
  })
}

export default {
  isNewVersion
}
