<template>
  <transition name="dialog-fade">
    <div v-show="visible" class="message-wrapper">
      <div class="message-box">
        <div class="message-main" @click.stop="onNoClick">
          <div class="header-box">
            <div class="header-l">任务中心</div>
            <div class="header-r" @click.stop="onClickClear">
              <svg-icon icon-class="t_clear" />
              <span>清除已完成任务</span>
            </div>
          </div>
          <ul class="menu-box">
            <li v-for="item in configMenu" :key="item.id" class="menu-box-child" :class="[item.active?'menu-box-child-active':'']" @click.stop="onClickMenu(item.id)">
              {{ item.title }} <span v-if="item.num">({{ item.num }})</span>
            </li>
          </ul>
          <div class="task-info">
            <SrcrollPane style="height: 410px" @load="rollEnd">
              <div v-show="menuKey === 1">
                <upload-item
                  v-for="(item,index) in visionTask"
                  :key="item.id"
                  :index="index"
                  :info="item"
                  :config-init="configHS"
                  @success="hsSuccess"
                  @fail="hsFail"
                  @pause="hsPause"
                  @reload="hsReload"
                  @again="hsAgain"
                  @cancel="hsCancel"
                  @fairing="getFairing"
                />
                <div v-if="!visionTask.length" class="task-no-data">
                  <div class="task-no-data-icon-box">
                    <svg-icon icon-class="t_nodata" class="task-no-data-icon" />
                  </div>
                  <div>暂无内容</div>
                </div>
              </div>
              <div v-show="menuKey === 2">
                <div v-if="clipTask.length">
                  <div
                    v-for="item in clipTask"
                    :key="item.id"
                  >
                    <div class="task-child-clip">
                      <div class="task-child-clip-l">
                        <svg-icon icon-class="t_creation_video" class="task-child-clip-l-icon" />
                        <!-- <div v-if="item.id === 2" class="task-child-clip-l-stop">
                            <svg-icon icon-class="t_suspend" class="task-child-clip-l-icon-stop" />
                        </div> -->
                      </div>
                      <div class="task-child-clip-r">
                        <div class="task-child-clip-r-title">{{ item.projectName }}： {{ item.name }}</div>
                        <!-- <div v-if="item.status === 3" class="task-child-clip-r-progress">
                          <el-progress :stroke-width="6" :percentage="item.percentage" :format="progressFormat" />
                        </div> -->
                        <div class="task-child-clip-r-status">
                          <div>
                            <span v-if="item.status === 1" class="task-color-green">生成成功</span>
                            <span v-else-if="item.status === 2" class="task-color-red">生成失败</span>
                            <!-- <span v-else-if="item.status === 3">生成中 {{ item.percentage }}%</span> -->
                            <span v-else-if="item.status === 3">生成中</span>
                          </div>
                          <div
                            v-if="item.status !== 3"
                            class="task-child-clip-r-status-del"
                            @click.stop="delClip(item.id)"
                          >删除</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="task-no-data">
                  <div class="task-no-data-icon-box">
                    <svg-icon icon-class="t_nodata" class="task-no-data-icon" />
                  </div>
                  <div>暂无内容</div>
                </div>
              </div>
            </SrcrollPane>
          </div>
        </div>
        <div v-if="fairingStatus" class="fairing-box" @click.stop="onNoClick" />
      </div>
    </div>
  </transition>
</template>

<script>
import { getClipList, getUploadConfig, delClip, delAllSuccessClip } from '@/api/task/index'
import eventBus from '@/utils/eventBus'
import SrcrollPane from './ScrollPane'
import UploadItem from './UploadItem'
export default {
  name: 'TaskCenter',
  components: {
    SrcrollPane,
    UploadItem
  },
  props: {
    beforeUpload: {
      type: Function,
      default: () => {
        return () => {}
      }
    },
    title: {
      type: String,
      default: '选择'
    },
    success: {
      type: Function,
      default: () => {
        return () => {}
      }
    }
  },
  data() {
    return {
      visible: false,
      configMenu: [ // 任务目录配置
        {
          id: 1,
          title: '文件传输',
          num: 0,
          show: true,
          active: true
        },
        {
          id: 2,
          title: '视频生成',
          num: 0,
          show: true,
          active: false
        }
      ],
      visionTask: [], // 渲染上传任务数据
      uploadTask: [], // 上传中任务数据
      waitTask: [], // 等待任务数据 包含等待、失败 暂停
      clipTask: [], // 剪辑任务
      clipPageIndex: 1, // 剪辑页数
      clipPageSize: 10, // 剪辑分页数量
      menuKey: 1, // 目录
      clipTimeout: null, // 剪辑视频进度
      userId: '', // 用户id
      configHS: { // 火山商户基础信息
        userId: '',
        appId: '',
        spaceName: '',
        AccessKeyID: '',
        SecretAccessKey: '',
        SessionToken: '',
        ExpiredTime: '',
        CurrentTime: ''
      },
      fairingStatus: false
    }
  },
  watch: {
    visible(val, oldVal) {
      val ? this.clipTimeout ? this.clearClipTimeout() : '' : '' // 清楚定时器
    },
    visionTask(val, oldVal) {
      this.configMenu[0].num = val.length
    }
  },
  mounted() {
    // var that = this
    // window.onbeforeunload = function (e) {
    //   if (that.uploadTask.length) {
    //     var message = 'some word'
    //     e = e || window.event
    //     if (e) {
    //       e.returnValue = message
    //     }
    //     return '浏览器关闭!'
    //   } else {
    //     // window.onbeforeunload = null
    //   }
    // }
    // this.getUploadConfig()
    // eventBus.$on('sendTaskMessage', (msg) => {
    //   const that = this
    //   if (msg.length) {
    //     msg.map(v => {
    //       getExistsSuccess({ videoGroupId: v.originId }).then((res) => {
    //         console.log(res.data)
    //         if (res.data < 51) {
    //         // 打开任务中心
    //           // 创建任务
    //           if (v.type === 'file_video' || v.type === 'file_all') {
    //             // 任务创建数据
    //             const task = {
    //               id: that.getUuiD(20),
    //               filename: v.file.name,
    //               origin: v.origin,
    //               originId: v.originId,
    //               md5: '',
    //               size: that.getFileSize(v.file.size),
    //               file: v.file,
    //               status: 'wait',
    //               progress: 0,
    //               callbackArgs: [],
    //               fileKey: '',
    //               ranking: 3,
    //               type: v.type,
    //               optional: v.optional !== undefined ? v.optional : ''
    //             }
    //             that.onClickMenu(1)
    //             that.scheduling(5, task)
    //           } else {
    //             console.log('剪辑任务')
    //           }
    //         }
    //       })
    //     })
    //   }
    // })
    // eventBus.$on('visibleTaks', (msg) => {
    //   if (msg) {
    //     this.clearSessionStorageTimer()
    //     if (this.menuKey === 2) {
    //       this.setClipTimeout()
    //     }
    //   } else {
    //     window.clearInterval(this.clipTimeout)
    //   }
    //   this.visible = msg
    // })
  },
  destroyed() {
    // window.onbeforeunload = null
    eventBus.$off('sendTaskMessage')
    eventBus.$off('visibleTaks')
  },
  methods: {
    clearSessionStorageTimer() {
      console.log('调用')
      const clearTimer = sessionStorage.getItem('clearTimer')
      if (clearTimer) {
        const timeFnEnd = this.timeFn(clearTimer)
        if (timeFnEnd < 3) {
          this.clearlocalStorageTimerFun()
        }
      } else {
        this.clearlocalStorageTimerFun()
      }
    },
    clearlocalStorageTimerFun() { // 清除存储
      const that = this
      const clearEndTime = Date.now()// 获取当前时间
      sessionStorage.setItem('clearTimer', clearEndTime)
      // 取localStorage中的所有的键(Key)
      for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).length > 20) {
          const str = localStorage.getItem(localStorage.key(i))
          if (str.indexOf('{') !== -1 && str.indexOf('}') !== -1) {
            const file_obj = JSON.parse(str)

            if (file_obj.stageEndTime !== undefined) {
              const timeFnEnd = that.timeFn(file_obj.stageEndTime)
              if (timeFnEnd === 1) {
                console.log(`%c 检测结果删除成功： %c 本地服务 %c`,
                  'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
                  'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
                  'background:transparent', localStorage.key(i))
                that.visionTask.map(v => {
                  v.filename === file_obj.fileName ? console.log('存在不做处理') : localStorage.removeItem(localStorage.key(i))
                })
              } else {
                console.log(`%c 检测结果不删除： %c 本地服务 %c`,
                  'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
                  'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
                  'background:transparent', localStorage.key(i))
                // console.log('不需要删除缓存校验结果：', timeFnEnd)
              }
            }
          }
        }
      }
    },
    timeFn(dateBegin) {
      const sTime = dateBegin // 开始时间
      const eTime = new Date()// 获取当前时间
      // 作为除数的数字
      // const divNumSecond = 1000
      // const divNumMinute = 1000 * 60
      const divNumHour = 1000 * 3600
      const divNumDay = 1000 * 3600 * 24

      const day = parseInt((eTime - sTime) / parseInt(divNumDay))
      const hour = parseInt(((eTime - sTime) % parseInt(divNumDay)) / parseInt(divNumHour))
      // const minute = parseInt((parseInt(((eTime - sTime) % parseInt(divNumDay)) % parseInt(divNumHour))) / parseInt(divNumMinute))
      // const second = ((parseInt(((eTime - sTime) % parseInt(divNumDay)) % parseInt(divNumHour))) % parseInt(divNumMinute)) / parseInt(divNumSecond)
      // let str = day + '天' + hour + '小时' + minute + '分' + second + '秒'
      let str = ''
      if (day > 0) {
        str = 1
      } else if (day === 0 && hour > 0) {
        str = 2
      } else {
        str = 3
      }
      return str
    },
    getUploadConfig () {
      getUploadConfig({ tenantId: 1000 })
        .then((res) => {
          this.configHS.userId = String(res.data.userId)
          this.configHS.appId = Number(res.data.appId)
          this.configHS.spaceName = String(res.data.spaceName)
        })
        .catch(() => {
        })
    },
    onNoClick() {
      // console.log('无效')
    },
    // 获取视频组当前视频数量
    // getExistsSuccess(e) {
    //   console.log(e)
    //   getExistsSuccess(e)
    //     .then((res) => {
    //       console.log('获取视频组当前视频数量', res)
    //     })
    // },
    getUuiD(randomLength) {
      return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36) + Math.floor(Math.random() * 10) + 1
    },
    // 清理内容
    onClickClear() {
      if (this.menuKey === 1) {
        for (let i = this.visionTask.length - 1; i >= 0; i--) {
          if (this.visionTask[i].status === 'success') {
            this.visionTask.splice(i, 1)
          }
        }
      } else {
        this.delAllSuccessClip()
      }
      // 单击，可清除文件传输+剪辑生成所有已完成的任务清单。 1、移除记录。2、更新Tab的显示数量。
      // 循环列表 删除成功状态  包含剪辑视频及上传任务
    },
    // 外部调用失败回调
    failTaks(data) {
      eventBus.$emit('failTaks', data)
    },
    // 外部调用成功回调
    successTaks(data) {
      eventBus.$emit('successTaks', data)
    },
    // 切换列表
    onClickMenu(id) {
      this.configMenu.map(v => {
        id === v.id ? v.active = true : v.active = false
      })
      console.log('id', id)
      this.menuKey = id
      this.menuKey === 2 ? this.setClipTimeout() : this.clearClipTimeout()
    },
    // 监听滚动条到底
    rollEnd() {
      console.log('到底', this.menuKey)
      this.menuKey === 2 ? this.getClipList(false) : ''
    },
    // 指定进度条文字内容
    progressFormat(percentage) {
      return ''
    },
    // 清除轮询
    clearClipTimeout() {
      clearInterval(this.clipTimeout)
      this.clipTimeout = null
    },
    // 获取文件大小
    getFileSize(size) {
      if (size < 0.1 * 1024 * 1024) {
        // 小于0.1MB，则转化成KB
        size = (size / 1024).toFixed(2) + 'KB'
      } else if (size < 1 * 1024 * 1024 * 1024) {
        // 小于1GB，则转化成MB
        size = (size / (1024 * 1024)).toFixed(2) + 'MB'
      } else {
        // 其他转化成GB
        size = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
      }
      // 转成字符串
      const sizeStr = size + ''
      // 获取小数点处的索引
      const index = sizeStr.indexOf('.')
      // 获取小数点后两位的值
      const dou = sizeStr.substr(index + 1, 2)

      // 判断后两位是否为00，如果是则删除00
      if (dou === '00') return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
      return size
    },
    // 回调更新任务队列
    async scheduling(key, obj) {
      const that = this
      const uploadMaxNum = 3
      switch (key) {
        case 0:
          await (function() {
            return new Promise(function(res, rej) {
              that.uploadTask.map((v, i) => {
                v.id === obj.id ? that.uploadTask.splice(i, 1) : ''
              })
              res()
            })
          }())
          await (function() {
            return new Promise(function(res, rej) {
              if (that.uploadTask.length < uploadMaxNum) {
                if (that.waitTask.length) {
                  that.waitTask[0].status = 'parsing'
                  that.waitTask[0].ranking = 1
                  that.uploadTask.push(that.waitTask[0])
                  that.visionTask.map(v => {
                    if (v.id === obj.id) {
                      if (obj.progress === 100) {
                        v.status = 'success'
                        v.ranking = 6
                      } else {
                        v.status = 'parsing'
                        v.ranking = 1
                      }
                    }
                  })
                }
              }
              res()
            })
          }())
          await (function() {
            return new Promise(function(res, rej) {
              that.waitTask.length ? that.waitTask.splice(0, 1) : ''
              res()
            })
          }())
          break
        case 1:
          await (function() {
            return new Promise(function(res, rej) {
              that.uploadTask.map((v, i) => {
                v.id === obj.id ? that.uploadTask.splice(i, 1) : ''
              })
              // that.visionTask.map(v => {
              //   if (v.id === obj.id) {
              //     v.status = 'fail'
              //     v.ranking = 6
              //   }
              // })
              // that.waitTask.map(v => {
              //   if (v.id === obj.id) {
              //     v.status = 'fail'
              //     v.ranking = 6
              //   }
              // })
              res()
            })
          }())
          if (that.uploadTask.length < uploadMaxNum) {
            await (function() {
              return new Promise(function(res, rej) {
                if (that.waitTask.length) {
                  that.waitTask.map((v, i) => {
                    if (v.id === obj.id) {
                      if (obj.progress > 0) {
                        v.status = 'uploading'
                      } else {
                        v.status = 'parsing'
                      }
                      that.uploadTask.push(v)
                    }
                  })
                  that.visionTask.map(v => {
                    if (v.id === obj.id) {
                      if (v.id === obj.id) {
                        if (obj.progress > 0) {
                          v.status = 'uploading'
                          v.ranking = 2
                        } else {
                          v.status = 'parsing'
                          v.ranking = 1
                        }
                      }
                    }
                  })
                } else {
                  obj.status = 'fail'
                  obj.ranking = 5
                  that.waitTask.push(obj)
                  that.visionTask.map(v => {
                    if (v.id === obj.id) {
                      v.status = 'fail'
                      v.ranking = 6
                    }
                  })
                }
                res()
              })
            }())
          } else {
            await (function() {
              return new Promise(function(res, rej) {
                obj.status = 'fail'
                obj.ranking = 5
                that.waitTask.push(obj)
                that.visionTask.map(v => {
                  if (v.id === obj.id) {
                    v.status = 'fail'
                    v.ranking = 5
                  }
                })
                res()
              })
            }())
          }
          break
        case 2:
          await (function() {
            return new Promise(function(res, rej) {
              // 删除上传中
              const uploadTask_key = that.uploadTask.findIndex(item => item.id === obj.id)
              if (uploadTask_key > -1) {
                that.uploadTask.splice(uploadTask_key, 1)
              }
              // const waitTask_key = that.waitTask.findIndex(item => item.id === obj.id)
              // if (waitTask_key > -1) {
              //   that.waitTask.splice(waitTask_key, 1)
              // }

              // 修改上传中为等待中
              that.visionTask.map(v => {
                if (v.id === obj.id) {
                  v.status = 'pause'
                  v.ranking = 4
                }
              })

              // 查看是否有等待 存在推送到上传列
              if (that.waitTask.length) {
                if (that.uploadTask.length < uploadMaxNum) {
                  let waitTaskStatus = true
                  that.waitTask.map((v, i) => {
                    if (v.status === 'wait' && waitTaskStatus) {
                      waitTaskStatus = false
                      if (that.waitTask[i].progress > 0) {
                        that.waitTask[i].status = 'uploading'
                        that.uploadTask.push(that.waitTask[i])
                        that.visionTask.map(v => {
                          if (v.id === that.waitTask[i].id) {
                            v.status = 'uploading'
                            v.ranking = 2
                          }
                        })
                      } else {
                        that.uploadTask.push(that.waitTask[i])
                        that.visionTask.map(v => {
                          if (v.id === that.waitTask[i].id) {
                            v.status = 'parsing'
                            v.ranking = 1
                          }
                        })
                      }
                    }
                  })
                }
              }
              res()
            })
          }())
          await (function() {
            return new Promise(function(res, rej) {
              that.waitTask.length ? that.waitTask.splice(0, 1) : ''
              res()
            })
          }())
          await (function() {
            return new Promise(function(res, rej) {
              obj.status = 'pause'
              obj.ranking = 4
              that.waitTask.push(obj)
              res()
            })
          }())
          break
        case 3:
          if (that.uploadTask.length < uploadMaxNum) {
            await (function() {
              return new Promise(function(res, rej) {
                if (that.waitTask.length) {
                  that.waitTask.map((v, i) => {
                    if (v.id === obj.id) {
                      if (obj.progress > 0) {
                        v.status = 'uploading'
                      } else {
                        v.status = 'parsing'
                      }
                      that.uploadTask.push(v)
                    }
                  })
                  that.visionTask.map(v => {
                    if (v.id === obj.id) {
                      if (v.id === obj.id) {
                        if (obj.progress > 0) {
                          v.status = 'uploading'
                          v.ranking = 2
                        } else {
                          v.status = 'parsing'
                          v.ranking = 1
                        }
                      }
                    }
                  })
                }
                res()
              })
            }())
            await (function() {
              return new Promise(function(res, rej) {
                if (that.waitTask.length) {
                  const waitTask_key = that.waitTask.findIndex(item => item.id === obj.id)
                  if (waitTask_key > -1) {
                    that.waitTask.splice(waitTask_key, 1)
                  }
                }
                res()
              })
            }())
          } else {
            await (function() {
              return new Promise(function(res, rej) {
                that.waitTask.map(v => {
                  if (v.id === obj.id) {
                    v.status = 'wait'
                    v.ranking = 3
                  }
                })
                that.visionTask.map(v => {
                  if (v.id === obj.id) {
                    v.status = 'wait'
                    v.ranking = 3
                  }
                })
                res()
              })
            }())
          }
          break
        case 4:
          if (that.uploadTask.length < uploadMaxNum) {
            await (function() {
              return new Promise(function(res, rej) {
                if (that.waitTask.length) {
                  if (that.waitTask[0].progress > 0) {
                    that.waitTask[0].status = 'uploading'
                    that.uploadTask.push(that.waitTask[0])
                    that.visionTask.map(v => {
                      if (v.id === that.waitTask[0].id) {
                        v.status = 'uploading'
                        v.ranking = 2
                      }
                    })
                  } else {
                    that.waitTask[0].status = 'parsing'
                    that.uploadTask.push(that.waitTask[0])
                    that.visionTask.map(v => {
                      if (v.id === that.waitTask[0].id) {
                        v.status = 'parsing'
                        v.ranking = 1
                      }
                    })
                  }

                  // that.waitTask[0].status = 'parsing'
                  // that.waitTask[0].ranking = 1
                  // that.uploadTask.push(that.waitTask[0])
                  // that.visionTask.map(v => {
                  //   if (v.id === obj.id) {
                  //     v.status = 'parsing'
                  //     v.ranking = 1
                  //   }
                  // })
                }
                res()
              })
            }())
            await (function() {
              return new Promise(function(res, rej) {
                that.waitTask.length ? that.waitTask.splice(0, 1) : ''
                res()
              })
            }())
          }
          break
        case 5:
          if (that.uploadTask.length < uploadMaxNum) {
            await (function() {
              return new Promise(function(res, rej) {
                obj.status = 'parsing'
                obj.ranking = 1
                that.uploadTask.push(obj)
                that.visionTask.push(obj)
                res()
              })
            }())
          } else {
            await (function() {
              return new Promise(function(res, rej) {
                obj.status = 'wait'
                obj.ranking = 3
                that.waitTask.push(obj)
                that.visionTask.push(obj)
                res()
              })
            }())
          }
          break
      }
      this.visionTask.sort((a, b) => { return a.ranking - b.ranking })
    },
    //  火山上传回调逻辑
    hsSuccess(res) {
      this.visionTask.map((v, i) => {
        if (v.id === res.id) {
          v.status = 'success'
          v.ranking = 6
        }
      })
      this.scheduling(0, res)
      this.successTaks(res)
      console.log('成功回调', res)
    },
    hsFail(res) {
      this.scheduling(1, res)
      console.log('失败回调', res)
      this.failTaks(res)
    },
    hsPause(e) {
      this.scheduling(2, e)
      console.log('暂停回调', e)
    },
    hsReload(res) {
      this.scheduling(3, res)
      console.log('重新回调啦', res)
      console.log('重新回调啦this.waitTask', this.waitTask)
    },
    hsAgain(res) {
      const id = res.id
      const task = res.task
      const uploadTask_key = this.uploadTask.findIndex(item => item.id === id)
      if (uploadTask_key > -1) {
        this.uploadTask.splice(uploadTask_key, 1)
      }
      const visionTask_key = this.visionTask.findIndex(item => item.id === id)
      if (visionTask_key > -1) {
        this.visionTask.splice(visionTask_key, 1)
      }
      console.log('删除重新上环', res)
      this.scheduling(5, task)
    },
    async hsCancel(e) {
      console.log('删除回调', e)
      const that = this
      await (function() {
        return new Promise(function(res, rej) {
          that.visionTask.splice(e.index, 1)
          if (e.data.status === 'parsing' || e.data.status === 'parsing-wait' || e.data.status === 'uploading') {
            const uploadTask_key = that.uploadTask.findIndex(item => item.id === e.data.id)
            if (uploadTask_key > -1) {
              that.uploadTask.splice(uploadTask_key, 1)
            }
          }
          if (e.data.status === 'wait' || e.data.status === 'pause' || e.data.status === 'fail') {
            const waitTask_key = that.waitTask.findIndex(item => item.id === e.data.id)
            if (waitTask_key > -1) {
              that.waitTask.splice(waitTask_key, 1)
            }
          }
          res()
        })
      }())
      that.scheduling(4, e.data)
    },
    getFairing(e) {
      this.fairingStatus = e
      setTimeout(() => {
        this.fairingStatus = false
      }, 1000)
    },
    // 剪辑任务
    // 获取生成视频列表
    // 轮询
    setClipTimeout() {
      this.getClipList(true)
      this.clipTimeout = window.setInterval(() => {
        setTimeout(() => {
          this.getClipList(true)
        }, 0)
      }, 30000)
    },
    // 获取两个数组对象中不相同的值
    getArrDifSameValue(arr1, arr2) {
      const result = []
      for (let i = 0; i < arr1.length; i++) {
        let isExist = false
        for (let j = 0; j < arr2.length; j++) {
          if (arr1[i].id === arr2[j].id) {
            isExist = true
            break
          }
        }
        if (!isExist) {
          result.push(arr1[i])
        }
      }
      console.log('result', result)
      return result
    },
    getClipList(type) {
      const that = this
      const params = {
        pageIndex: type ? 1 : this.clipPageIndex,
        pageSize: type ? this.clipPageSize * this.clipPageIndex : this.clipPageSize
      }
      getClipList(params)
      // 数据到底也要清空定时器
        .then((res) => {
          console.log('res.data', res.data)
          if (res.code === 1 && res.data.items.length) {
            res.data.items.map(v => {
              that.clipTask.map(e => {
                if (e.id === v.id) {
                  v.percentage > e.percentage ? '' : v.percentage = e.percentage
                }
              })
            })
            if (type) {
              this.clipTask = res.data.items
            } else {
              if (that.clipPageIndex === 1) {
                that.clipTask = res.data.items
              } else {
                if (res.data.items.length === 10) {
                  res.data.items.map(v => {
                    that.clipTask.push(v)
                  })
                  that.clipTask = [...new Set(that.clipTask)]
                } else {
                  if (res.data.items.length < 10) {
                    const passData = that.getArrDifSameValue(res.data.items, that.clipTask)
                    passData.map(v => {
                      that.clipTask.push(v)
                    })
                    that.clipTask = [...new Set(that.clipTask)]
                  }
                }
              }
              if (res.data.items.length === 10) {
                that.clipPageIndex++
                if (that.clipPageIndex > res.data.totalPages) {
                  that.clipPageIndex = 1
                }
              }
            }
          }
          this.configMenu[1].num = res.data.total
        })
        .catch(() => {
        })
    },
    // 删除生成视频列表的视频
    delClip(id) {
      const that = this
      const params = { id }
      this.clearClipTimeout()
      delClip(params)
        .then((res) => {
          if (res.code === 1) {
            const clipTask_key = that.clipTask.findIndex(item => item.id === id)
            if (clipTask_key > -1) {
              that.clipTask.splice(clipTask_key, 1)
            }
            that.setClipTimeout()
          } else {
            that.setClipTimeout()
          }
        })
        .catch(() => {
        })
    },
    delAllSuccessClip() {
      delAllSuccessClip()
        .then((res) => {
          console.log('res.data', res.data)
          for (let i = this.clipTask.length - 1; i >= 0; i--) {
            if (this.clipTask[i].status === 1) {
              this.clipTask.splice(i, 1)
            }
          }
          this.getClipList(true)
        })
        .catch(() => {
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.message-wrapper {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 2001;
    cursor: default;
}
.message-box {
    position: relative;
    .message-main {
        position: absolute;
        top: 55px!important;
        right: 190px;
        z-index: 2001;
        width: 478px;
        height: 529px;
        background: #FFFFFF;
        box-shadow: 0px 4px 12px 0px rgba(22,22,22,0.25);
        border-radius: 12px;
        padding: 22px 0;
        &:after{
            position: absolute;
            content: " ";
            top: -16px;
            right: 35px;
            display: block;
            width: 0;
            height: 0;
            border: 8px solid #FFFFFF;;
            border-color: transparent transparent #FFFFFF;;
        }
        .header-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0;
            margin: 0;
            line-height: normal;
            padding:0 22px;
            .header-l {
                font-size: 16px;
                font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                font-weight: bold;
                color: #333333;
            }
            .header-r {
                font-size: 14px;
                font-family: MicrosoftYaHei;
                cursor: pointer;
                span {
                    display: inline-block;
                    margin-left: 4px;
                }
            }
        }
        .menu-box {
            display: flex;
            margin-top: 20px;
            padding: 0 22px;
            border-bottom: 1px solid #EFF2F6;
            .menu-box-child {
                font-size: 16px;
                font-family: MicrosoftYaHei;
                color: #777777;
                margin-right: 32px;
                line-height: normal;
                padding-bottom: 9px;
                cursor: pointer;
            }
            .menu-box-child-active {
                color: #0C6FFF;
                border-bottom: 2px solid #0C6FFF;
            }
        }
        .task-info {
            padding: 0 22px;
            .task-child-clip {
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #EFF2F6;
                display: flex;
                line-height: normal;
                margin-top: 16px;
                width: 100%;
                .task-child-clip-l {
                    margin-right: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 52px;
                    min-width: 52px;
                    height: 52px;
                    background: #ECF5FE;
                    border-radius: 4px;
                    position: relative;
                    .task-child-clip-l-icon {
                        font-size: 38px;
                    }
                    .task-child-clip-l-stop {
                        position: absolute;
                        left: 0;
                        right: 0;
                        top: 0;
                        bottom: 0;
                        font-size: 38px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(71,160,251,0.4);
                        border-radius: 4px;
                        backdrop-filter: blur(1px);
                    }
                }
                .task-child-clip-r {
                    flex: 1;
                    width: 0;
                    .task-child-clip-r-title {
                        font-size: 14px;
                        font-family: MicrosoftYaHei;
                        color: #333333;
                        display:-webkit-box;
                        text-overflow:ellipsis;
                        overflow:hidden;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient:vertical;
                    }
                    .task-child-clip-r-progress {
                        margin-top: 8px;
                    }
                    .task-child-clip-r-status {
                        margin-top: 8px;
                        font-size: 14px;
                        font-family: MicrosoftYaHei;
                        color: #777777;
                        display: flex;
                        justify-content: space-between;
                        .task-child-clip-r-status-del {
                            font-size: 14px;
                            font-family: MicrosoftYaHei;
                            color: #F53F3F;
                            cursor: pointer;
                        }
                    }
                }
            }
            .task-no-data {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                line-height: normal;
                font-size: 18px;
                font-family: MicrosoftYaHei;
                margin-top: 76px;
                color: #919293;
                .task-no-data-icon-box {
                    height: 148px;
                    overflow: hidden;
                    .task-no-data-icon {
                        font-size: 175px
                    }
                }

            }
        }
    }
    .fairing-box {
      position: absolute;
      top: 48px;
      right: 190px;
      z-index: 2001;
      width: 478px;
      height: 529px;
      background: #c71515;
      opacity: 0;
      box-shadow: 0px 4px 12px 0px rgba(22,22,22,0.25);
      border-radius: 12px;
      padding: 22px 0;
    }

}

.task-color-green {
    color: #00B42A;
}
.task-color-red {
    color: #F53F3F;
}
::v-deep .el-progress-bar {
    padding: 0 !important;
}
// 进入动画
.dialog-fade-enter-active {
  animation: dialog-fade-in 0.4s;
}
// 离开动画
.dialog-fade-leave-active {
  animation: dialog-fade-out 0.15s;
}

@keyframes dialog-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}

  </style>

