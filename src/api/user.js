import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/arshopadmin/user',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/arshopadmin/user/getInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/arshopadmin/user/logout',
    method: 'post'
  })
}
