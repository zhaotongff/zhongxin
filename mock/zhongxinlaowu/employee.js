const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: i, // 编号
      name: '@cname', // mi ng c
      'gender|1': ['男', '女'], // 性别
      status: '1', // 1空闲 2派遣中 3忙绿
      address: '@county(true)',
      phoneNum: '@phone', // /^1[34578]d{9}$/
      identifyID: '@integer(18)',
      otheContactInfo: '@phone', // 其他联系方式
      forecast: '@float(0, 100, 2, 2)',
      age: '@integer(1, 3)', // 年龄 number
      technology: '@csentence(0, 6)', // 技能 float
      evaluate: '@float(0, 100, 2, 2)', // 评价
      daySalary: '200/天',
      marks: '@csentence(0, 6)', // 备注
      'isAcceptHour|1': ['是', '否'], // 接受小时工
      creteTime: '@datetime',
    })
  )
}

//
module.exports = [
  {
    url: '/vue-element-admin/employee/list',
    type: 'get',
    response: (config) => {
      const { page = 1, limit = 20, sort } = config.query

      let mockList = List

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList,
        },
      }
    },
  },

  {
    url: '/vue-element-admin/employee/add',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        data: 'success',
      }
    },
  },
  {
    url: '/vue-element-admin/employee/edit',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        data: 'success',
      }
    },
  },
  {
    url: '/vue-element-admin/employee/delete',
    type: 'delete',
    response: (_) => {
      return {
        code: 20000,
        data: 'success',
      }
    },
  },
]
