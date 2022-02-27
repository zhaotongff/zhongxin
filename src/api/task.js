import request from '@/utils/request'
// 获取任务列表
export function getTaskList(query) {
  return request({
    url: '/vue-element-admin/task/list',
    method: 'get',
    params: query
  })
}
// 添加任务
export function addTask(data) {
  return request({
    url: '/vue-element-admin/task/add',
    method: 'post',
    data: data
  })
}
// 更改任务
export function editTask(data) {
  return request({
    url: '/vue-element-admin/task/edit',
    method: 'post',
    data: data
  })
}

// 删除任务
export function deleteTask(id) {
  return request({
    url: `/vue-element-admin/task/delete/${id}`,
    method: 'delete'
  })
}
