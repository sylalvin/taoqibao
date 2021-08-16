import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/arshopadmin/sales/fetchlist',
    method: 'get',
    params: params
  })
}

export function createSales(data){
  return request({
    url: '/arshopadmin/sales/createSales',
    method: 'post',
    data: data
  })
}

export function getSales(params){
  return request({
    url: '/arshopadmin/sales/getSales',
    method: 'get',
    params: params
  })
}

export function updateSales(data){
  return request({
    url: '/arshopadmin/sales/updateSales',
    method: 'post',
    data: data
  })
}

export function updateDeleteStatus(params){
  return request({
    url: '/arshopadmin/sales/updateDeleteStatus',
    method: 'post',
    params: params
  })
}

export function newMchntBySalesSevenDay() {
  return request({
    url: '/arshopadmin/sales/getNewMchntBySalesSevenDay',
    method: 'get',
  })
}

export function getActiveSales(){
  return request({
    url: '/arshopadmin/sales/getAvailableSales',
    method: 'get',
  })
}