const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: i, // 编号
      taskName: '@cword', // 任务名称
      coCompany: '@cword', // 性别
      workPlace: '@city', // 1空闲 2派遣中 3忙绿
      startTime: '@datetime',
      workHours: '@integer(1,24)', // /^1[34578]d{9}$/
      reqPersonNum: '@integer(1,100)', // 其他联系方式
      'taskStatus|1': ['1', '2', '3', '4'],
      reqAge: '@integer(20, 100)', // 年龄 number
      'reqGender|1': ['男', '女'], // 技能 float
      specialReq: '@csentence(0, 6)', // 评价
      marks: '@csentence(0, 6)', // 备注
      predictPrice: '@integer(100,1000)',
      actualPrice: '@integer(100,1000)',
      creteTime: '@datetime',
    })
  )
}

//
module.exports = [
  {
    url: '/vue-element-admin/task/list',
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
    url: '/vue-element-admin/task/add',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        data: 'success',
      }
    },
  },
  {
    url: '/vue-element-admin/task/edit',
    type: 'post',
    response: (config) => {
      return {
        code: 20000,
        data: 'success',
      }
    },
  },
  {
    url: '/vue-element-admin/task/delete',
    type: 'delete',
    response: (_) => {
      return {
        code: 20000,
        data: 'success',
      }
    },
  },
]
