import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/arshopadmin/permission/fetchlist',
    method: 'get',
    params: params
  })
}

export function createAdmin(params) {
  return request({
    url: '/arshopadmin/permission/createAdmin',
    method: 'post',
    params: params
  })
}

export function allocRole(params) {
  return request({
    url: '/arshopadmin/permission/allocRole',
    method: 'post',
    params: params
  })
}

export function updateAdmin(params) {
  return request({
    url: '/arshopadmin/permission/updateAdmin',
    method: 'post',
    params: params
  })
}

export function deleteAdmin(params){
  return request({
    url: '/arshopadmin/permission/deleteAdmin',
    method: 'post',
    params: params
  })  
}

export function getUserList() {
    return request({
    url: '/arshopadmin/permission/getUserList',
    method: 'get',
  })  
}
