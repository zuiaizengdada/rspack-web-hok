const express = require('express')
const router = express.Router()
// const routers = require('./router.js')
const routers2 = require('./router.json')

const AddressBook = [
  {
    id: '0',
    name: '建筑公司',
    number: 1,
    users: [],
    depts: [
      {
        id: '10',
        name: '深圳分公司',
        number: 1,
        users: {
          users: [
            { userId: '100001', userName: '马仔1' },
            { userId: '100002', userName: '马仔2' },
            { userId: '100003', userName: '马仔3' }
          ],
          totalSize: 12
        },
        depts: [
          {
            id: '101',
            name: '财务部',
            number: 1,
            users: [
              { userId: '100001', userName: '马仔1' },
              { userId: '100002', userName: '马仔2' },
              { userId: '100003', userName: '马仔3' }
            ],
            depts: []
          },
          {
            id: '102',
            name: '技术部',
            number: 1,
            users: [
              { userId: '100001', userName: '技术1' },
              { userId: '100002', userName: '技术2' },
              { userId: '100003', userName: '技术3' }
            ],
            depts: []
          }
        ]
      },
      {
        id: '11',
        name: '汕头分公司',
        number: 1,
        users: [],
        depts: [
          {
            id: '111',
            name: '财务部',
            number: 1,
            users: [],
            depts: []
          },
          {
            id: '112',
            name: '技术部',
            number: 1,
            users: [],
            depts: []
          }
        ]
      },
      {
        id: '12',
        name: '武汉分公司',
        number: 1,
        users: [],
        depts: [
          {
            id: '121',
            name: '财务部',
            number: 1,
            users: [],
            depts: []
          },
          {
            id: '122',
            name: '技术部',
            number: 1,
            users: [],
            depts: []
          }
        ]
      }
    ]
  }
]
function getChidlren(id) {
  var hasFound = false // 表示是否有找到id值
  var result = null
  var fn = function (data) {
    if (Array.isArray(data) && !hasFound) { // 判断是否是数组并且没有的情况下，
      data.forEach(item => {
        if (item.id === id) { // 数据循环每个子项，并且判断子项下边是否有id值
          result = item // 返回的结果等于每一项
          hasFound = true // 并且找到id值
        } else if (item.depts) {
          fn(item.depts) // 递归调用下边的子项
        }
      })
    }
  }
  fn(AddressBook) // 调用一下
  return result
}

// api接口   restful api规则
router.get('/', function (req, res, next) {
  res.render('test', {
    test: JSON.stringify({
      ret: true
    })
  })
})
router.get('/getUser', function (req, res, next) {
  res.json({
    ret: true,
    username: 'yyb',
    password: 123
  })
})

router.post('/getOrgTree', function (req, res, next) {
  const { id } = req.body
  console.log('拉拉')
  let dataSource = {}
  if (id === '') {
    dataSource = {
      id: '0',
      name: '建筑公司'
    }
  } else {
    dataSource = getChidlren(id)
  }
  setTimeout(() => {
    const result = {
      data: dataSource,
      success: true,
      code: 1
    }
    return res.json(result)
  }, 1000)
  // res.send({ username, password })
})

router.post('/getUserList', function (req, res, next) {
  // let { username, password } = req.body
  const { orgId } = req.body
  let dataSource = {}
  if (orgId === '') {
    dataSource = []
  } else {
    dataSource = getChidlren(orgId) || []
  }
  setTimeout(() => {
    const result = {
      data: {
        records: dataSource.users
      },
      success: true
    }

    return res.json(result)
  }, 1000)
  // res.send({ username, password })
})

router.post('/addgetOrgTree', function (req, res, next) {
  setTimeout(() => {
    const result = {
      data: [],
      success: true
    }

    return res.json(result)
  }, 1000)
})
router.get('/test', function (req, res, next) {
  res.json({
    ret: true,
    username: 'yyb',
    password: 123
  })
})

router.get('/build', function (req, res, next) {
  res.json(routers2)
})

module.exports = router
