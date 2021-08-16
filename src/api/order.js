import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/arshopadmin/order/fetchlist',
    method: 'get',
    params: params
  })
}

export function createOrder(data) {
  return request({
    url: '/arshopadmin/order/createOrder',
    method: 'post',
    data: data
  })
}

export function getOrder(params) {
  return request({
    url: '/arshopadmin/order/getOrder',
    method: 'get',
    params: params
  })
}

export function updateOrder(id, data) {
  return request({
    url: '/arshopadmin/order/updateOrder?id=' + id,
    method: 'post',
    data: data
  })
}

export function updateConfirmStatus(params) {
  return request({
    url: '/arshopadmin/order/updateConfirmStatus',
    method: 'post',
    params: params
  })
}

export function deleteOrderProduct(params) {
  return request({
    url: '/arshopadmin/order/deleteOrderProduct',
    method: 'post',
    params: params
  })
}

export function amountNewOrderSevenDay() {
  return request({
    url: '/arshopadmin/order/getAmountNewOrderSevenDay',
    method: 'get',
  })
}

export function totalAmountOrderSevenDay() {
  return request({
    url: '/arshopadmin/order/totalAmountOrderSevenDay',
    method: 'get',
  })
}

export function getTodayNewOrder() {
  return request({
    url: '/arshopadmin/order/getTodayNewOrder',
    method: 'get',
  })
}

export function getTodayToBeDelivered() {
  return request({
    url: '/arshopadmin/order/getTodayToBeDelivered',
    method: 'get',
  })
}

export function getTodayDelivered() {
  return request({
    url: '/arshopadmin/order/getTodayDelivered',
    method: 'get',
  })
}

export function fetchListReceipt(params) {
  return request({
    url: '/arshopadmin/order/fetchListReceipt',
    method: 'get',
    params: params
  })
}

export function createReceipt(params) {
  return request({
    url: '/arshopadmin/order/createReceipt',
    method: 'post',
    params: params
  })
}

export function fetchListForExcel(params) {
  return request({
    url: '/arshopadmin/order/fetchListForExcel',
    method: 'post',
    params: params
  })
}

export function fetchListForRefund(params) {
  return request({
    url: '/arshopadmin/order/fetchListForRefund',
    method: 'post',
    params: params
  })
}

export function updateApproveStatus(params){
  return request({
    url: '/arshopadmin/order/updateApproveStatus',
    method: 'post',
    params: params
  })
}
