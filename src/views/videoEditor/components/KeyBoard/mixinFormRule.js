export const mixinFormRule = {
  data() {
    const validCommon = (rule, value, callback) => {
      const list = Object.values(this.formCopy)
      if (value === '') {
        callback()
      } else if (list.includes(value)) {
        callback(new Error('快捷键已占用,请重新设置'))
      } else {
        // this.$refs.form.resetFields()

        callback()
      }
    }
    const validContentMark = (rule, value, callback) => {
      if (this.isValidContentMark) {
        validCommon(rule, value, callback)
      }
      this.isValidContentMark = true
    }
    const validVideoCut = (rule, value, callback) => {
      if (this.isValidVideoCut) {
        validCommon(rule, value, callback)
      }
      this.isValidVideoCut = true
    }
    const validTrackSmall = (rule, value, callback) => {
      if (this.isValidTrackSmall) {
        validCommon(rule, value, callback)
      }
      this.isValidTrackSmall = true
    }

    const validTrackLarge = (rule, value, callback) => {
      if (this.isValidTrackLarge) {
        validCommon(rule, value, callback)
      }
      this.isValidTrackLarge = true
    }

    const validMultiplyPlay = (rule, value, callback) => {
      if (this.isValidMultiplyPlay) {
        validCommon(rule, value, callback)
      }
      this.isValidMultiplyPlay = true
    }

    const validAdsorbent = (rule, value, callback) => {
      if (this.isValidAdsorbent) {
        validCommon(rule, value, callback)
      }
      this.isValidAdsorbent = true
    }

    const validPreview = (rule, value, callback) => {
      if (this.isValidPreview) {
        validCommon(rule, value, callback)
      }
      this.isValidPreview = true
    }

    const validVideoExport = (rule, value, callback) => {
      if (this.isvalidVideoExport) {
        validCommon(rule, value, callback)
      }
      this.isvalidVideoExport = true
    }

    return {
      keyupKeyboardList: [],
      systemDefaultKeyboard: ['Escape', 'Backspace', 'Process', 'Meta', 'ContextMenu', 'NumLock', 'CapsLock'],
      keyupTime: '',
      rules: {
        contentMark: [{ validator: validContentMark }],
        videoCut: [{ validator: validVideoCut }],
        trackSmall: [{ validator: validTrackSmall }],
        trackLarge: [{ validator: validTrackLarge }],
        multiplyPlay: [{ validator: validMultiplyPlay }],
        adsorbent: [{ validator: validAdsorbent }],
        preview: [{ validator: validPreview }],
        videoExport: [{ validator: validVideoExport }]
      },
      formCopy: {},
      changeForm: [],
      isValidContentMark: false,
      isValidVideoCut: false,
      isValidTrackSmall: false,
      isValidTrackLarge: false,
      isValidMultiplyPlay: false,
      isValidAdsorbent: false,
      isValidPreview: false,
      isvalidVideoExport: false
    }
  },
  methods: {
    keyupInput(e, name) {
      const groupKeyboard = ['Ctrl', 'Shift', 'Alt']
      e.preventDefault()
      let key = e.key.slice(0, 1).toUpperCase() + e.key.slice(1)
      if (this.systemDefaultKeyboard.includes(key)) { return false }
      if (key === 'Control') { key = 'Ctrl' }
      if (groupKeyboard.includes(key)) return false
      const currentKeyupTime = new Date().getTime()
      this.keyupKeyboardList.push(key)
      this.keyupTime = currentKeyupTime
      this.formCopy = JSON.parse(JSON.stringify(this.form))
      this.form[name] = this.keyupKeyboardList.join(' + ')
      this.keyupKeyboardList = []
      console.log(name, this.changeForm, 555555)
      if (!this.changeForm.includes(name)) {
        this.changeForm.push(name)
      }
    },
    keydownInput(e, name) {
      e.preventDefault()
      let key = e.key.slice(0, 1).toUpperCase() + e.key.slice(1)
      if (key === 'Control') { key = 'Ctrl' }
      const groupKeyboard = ['Ctrl', 'Shift', 'Alt']
      if (groupKeyboard.includes(key)) {
        if (!this.keyupKeyboardList.length) {
          this.keyupKeyboardList.push(key)
        }
      }
    },
    validSubmit() {
      let isValid = true
      let valArray = Object.values(this.form)
      valArray = valArray.filter(v => {
        return v && v.trim()
      })

      const nameArray = Object.keys(this.form)
      const repeatArray = valArray.filter((e, i) => valArray.indexOf(e) !== valArray.lastIndexOf(e) && valArray.indexOf(e) === i)

      if (repeatArray.length) {
        repeatArray.forEach((value) => {
          nameArray.forEach((name) => {
            if (this.form[name] === value) {
              this.$refs.form.validateField(name)
              isValid = false
            }
          })
        })
      }
      return isValid
    }
  }
}
