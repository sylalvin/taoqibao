import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/arshopadmin/receipt/fetchlist',
    method: 'get',
    params: params
  })
}