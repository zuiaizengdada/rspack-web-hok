export const basicComponents = [
  {
    type: 'input',
    icon: 'icon-input',
    name: '单行文本',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      dataType: '',
      pattern: '',
      placeholder: '',
      disabled: false,
      maxlength: -1,
      showWordLimit: false
    }
  },
  {
    type: 'textarea',
    icon: 'icon-diy-com-textarea',
    name: '多行文本',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      disabled: false,
      pattern: '',
      placeholder: '',
      maxlength: -1,
      showWordLimit: false
    }
  },
  // {
  //   type: 'number',
  //   icon: 'icon-number',
  //   name: '计数器',
  //   options: {
  //     width: '',
  //     required: false,
  //     defaultValue: 0,
  //     min: '',
  //     max: '',
  //     step: 1,
  //     disabled: false,
  //     controlsPosition: ''
  //   }
  // },
  {
    type: 'radio',
    icon: 'icon-radio-active',
    name: '单选框组',
    options: {
      inline: false,
      defaultValue: '',
      showLabel: false,
      options: [
        {
          value: 'Option 1',
          label: 'Option 1'
        },
        {
          value: 'Option 2',
          label: 'Option 2'
        },
        {
          value: 'Option 3',
          label: 'Option 3'
        }
      ],
      required: false,
      width: '',
      remote: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: '',
      disabled: false
    }
  },
  {
    type: 'checkbox',
    icon: 'icon-check-box',
    name: '多选框组',
    options: {
      inline: false,
      defaultValue: [],
      showLabel: false,
      options: [
        {
          value: 'Option 1',
          label: 'Option 1'
        },
        {
          value: 'Option 2',
          label: 'Option 2'
        },
        {
          value: 'Option 3',
          label: 'Option 3'
        }
      ],
      required: false,
      width: '',
      remote: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'value'
      },
      remoteFunc: '',
      disabled: false
    }
  },
  // {
  //   type: 'time',
  //   icon: 'icon-time',
  //   name: '时间选择器',
  //   options: {
  //     defaultValue: '21:19:56',
  //     readonly: false,
  //     disabled: false,
  //     editable: true,
  //     clearable: true,
  //     placeholder: '',
  //     startPlaceholder: '',
  //     endPlaceholder: '',
  //     isRange: false,
  //     arrowControl: true,
  //     format: 'HH:mm:ss',
  //     required: false,
  //     width: ''
  //   }
  // },
  // {
  //   type: 'date',
  //   icon: 'icon-date',
  //   name: '日期选择器',
  //   options: {
  //     defaultValue: '',
  //     readonly: false,
  //     disabled: false,
  //     editable: true,
  //     clearable: true,
  //     placeholder: '',
  //     startPlaceholder: '',
  //     endPlaceholder: '',
  //     type: 'date',
  //     format: 'yyyy-MM-dd',
  //     timestamp: false,
  //     required: false,
  //     width: ''
  //   }
  // },
  // {
  //   type: 'rate',
  //   icon: 'icon-pingfen1',
  //   name: '评分',
  //   options: {
  //     defaultValue: null,
  //     max: 5,
  //     disabled: false,
  //     allowHalf: false,
  //     required: false
  //   }
  // },
  // {
  //   type: 'color',
  //   icon: 'icon-color',
  //   name: '颜色选择器',
  //   options: {
  //     defaultValue: '',
  //     disabled: false,
  //     showAlpha: false,
  //     required: false
  //   }
  // },
  {
    type: 'select',
    icon: 'icon-select',
    name: '下拉选择框',
    options: {
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      showLabel: false,
      width: '',
      options: [
        {
          value: 'Option 1',
          label: 'Option 1'
        },
        {
          value: 'Option 2',
          label: 'Option 2'
        }, {
          value: 'Option 3',
          label: 'Option 3'
        }
      ],
      remote: false,
      filterable: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'value'
      },
      remoteFunc: ''
    }
  }
  // {
  //   type: 'switch',
  //   icon: 'icon-switch',
  //   name: '开关',
  //   options: {
  //     defaultValue: false,
  //     required: false,
  //     disabled: false
  //   }
  // },
  // {
  //   type: 'slider',
  //   icon: 'icon-slider',
  //   name: '滑块',
  //   options: {
  //     defaultValue: 0,
  //     disabled: false,
  //     required: false,
  //     min: 0,
  //     max: 100,
  //     step: 1,
  //     showInput: false,
  //     range: false,
  //     width: ''
  //   }
  // },
  // {
  //   type: 'text',
  //   icon: 'icon-wenzishezhi-',
  //   name: '文字',
  //   options: {
  //     defaultValue: 'This is a text',
  //     customClass: ''
  //   }
  // }
]

export const advanceComponents = [
  {
    type: 'input',
    icon: 'icon-input',
    name: '姓名',
    params: 'studentName',
    options: {
      width: '100%',
      defaultValue: '',
      required: true,
      dataType: '',
      pattern: '',
      placeholder: '',
      disabled: false,
      maxlength: -1,
      showWordLimit: false
    }
  },
  {
    type: 'input',
    icon: 'icon-input',
    name: '公司名称',
    params: 'companyName',
    options: {
      width: '100%',
      defaultValue: '',
      required: true,
      dataType: '',
      pattern: '',
      placeholder: '',
      disabled: false,
      maxlength: -1,
      showWordLimit: false
    }
  },
  {
    type: 'select',
    icon: 'icon-select',
    name: '职位',
    params: 'positionId',
    options: {
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: true,
      showLabel: false,
      width: '',
      options: [],
      remote: false,
      filterable: false,
      remoteOptions: [],
      props: {
        value: 'dictCode',
        label: 'dictLabel'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'input',
    icon: 'icon-input',
    name: '手机号',
    params: 'studentPhone',
    options: {
      width: '100%',
      defaultValue: '',
      required: true,
      dataType: 'number',
      pattern: '',
      placeholder: '',
      disabled: false,
      maxlength: 11,
      showWordLimit: false
    }
  },
  {
    type: 'input',
    icon: 'icon-input',
    name: '公司人数',
    params: 'companyNum',
    options: {
      width: '100%',
      defaultValue: '',
      required: true,
      dataType: 'number',
      pattern: '',
      placeholder: '',
      disabled: false,
      maxlength: -1,
      showWordLimit: false
    }
  },
  {
    type: 'select',
    icon: 'icon-select',
    name: '行业',
    params: 'industryId',
    options: {
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: true,
      showLabel: false,
      width: '',
      options: [],
      remote: false,
      filterable: false,
      remoteOptions: [],
      props: {
        value: 'dictCode',
        label: 'dictLabel'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'select',
    icon: 'icon-select',
    name: '营业额/年产值',
    params: 'turnoverId',
    options: {
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: true,
      showLabel: false,
      width: '',
      options: [],
      remote: false,
      filterable: false,
      remoteOptions: [],
      props: {
        value: 'dictCode',
        label: 'dictLabel'
      },
      remoteFunc: ''
    }
  }
  //   {
  //     type: 'blank',
  //     icon: 'icon-zidingyishuju',
  //     options: {
  //       defaultType: 'String'
  //     }
  //   },
  //   {
  //     type: 'imgupload',
  //     icon: 'icon-tupian',
  //     options: {
  //       defaultValue: [],
  //       size: {
  //         width: 100,
  //         height: 100
  //       },
  //       width: '',
  //       tokenFunc: 'funcGetToken',
  //       token: '',
  //       domain: 'https://tcdn.form.making.link/',
  //       disabled: false,
  //       length: 8,
  //       multiple: false,
  //       isQiniu: false,
  //       isDelete: false,
  //       min: 0,
  //       isEdit: false,
  //       action: 'https://tools-server.making.link/api/transfer'
  //     }
  //   },
  //   {
  //     type: 'editor',
  //     icon: 'icon-fuwenbenkuang',
  //     options: {
  //       defaultValue: '',
  //       width: ''
  //     }
  //   },
  //   {
  //     type: 'cascader',
  //     icon: 'icon-jilianxuanze',
  //     options: {
  //       defaultValue: [],
  //       width: '',
  //       placeholder: '',
  //       disabled: false,
  //       clearable: false,
  //       remote: true,
  //       remoteOptions: [],
  //       props: {
  //         value: 'value',
  //         label: 'label',
  //         children: 'children'
  //       },
  //       remoteFunc: ''
  //     }
  //   }
]

// export const layoutComponents = [
//   {
//     type: 'grid',
//     icon: 'icon-grid-',
//     columns: [
//       {
//         span: 12,
//         list: []
//       },
//       {
//         span: 12,
//         list: []
//       }
//     ],
//     options: {
//       gutter: 0,
//       justify: 'start',
//       align: 'top'
//     }
//   }
// ]
