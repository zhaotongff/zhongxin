import request from '@/utils/request'
// 获取劳务人员列表
export function getEmployeeList(query) {
  return request({
    url: '/vue-element-admin/employee/list',
    method: 'get',
    params: query
  })
}
// 添加劳务人员
export function addEmployee(data) {
  return request({
    url: '/vue-element-admin/employee/add',
    method: 'post',
    data: data
  })
}
// 更改劳务人员
export function editEmployee(data) {
  return request({
    url: '/vue-element-admin/employee/edit',
    method: 'post',
    data: data
  })
}

// 删除人员
export function deleteEmployee(id) {
  return request({
    url: `/vue-element-admin/employee/delete/${id}`,
    method: 'delete'
  })
}
