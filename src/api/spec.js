import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/arshopadmin/spec/fetchlist',
    method: 'get',
    params: params
  })
}

export function updateDeleteStatus(params) {
  return request({
    url: '/arshopadmin/spec/updateDeleteStatus',
    method: 'post',
    params: params
  })
}

export function createSpec(data) {
  return request({
    url: '/arshopadmin/spec/createSpec',
    method: 'post',
    data: data
  })
}

export function updateSpec(data) {
  return request({
    url: '/arshopadmin/spec/updateSpec',
    method: 'post',
    data: data
  })
}

export function getSpec(params) {
  return request({
    url: '/arshopadmin/spec/getSpec',
    method: 'get',
    params: params
  })
}
