import request from '@/utils/request'
export function writeLog(params) {
  return request({
    url: '/arshopadmin/log/writeLog',
    method: 'post',
    params: params
  })
}