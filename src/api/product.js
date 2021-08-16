import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/arshopadmin/product/fetchlist',
    method: 'get',
    params: params
  })
}

export function getProduct(params) {
  return request({
    url: '/arshopadmin/product/getProduct',
    method: 'get',
    params: params
  })
}

export function createProduct(data) {
  return request({
    url: '/arshopadmin/product/createProduct',
    method: 'post',
    data: data
  })
}

export function updateProduct(data) {
  return request({
    url: '/arshopadmin/product/updateProduct',
    method: 'post',
    data: data
  })
}

export function uploadPic(data) {
  return request({
    url: '/arshopadmin/product/uploadPic',
    method: 'post',
    data: data
  })
}

export function updateDeleteStatus(params) {
  return request({
    url: '/arshopadmin/product/updateDeleteStatus',
    method: 'post',
    params: params
  })
}

export function getActiveProduct() {
  return request({
    url: '/arshopadmin/product/getAllActiveProduct',
    method: 'get',
  })
}

export function updateRelationAndLabel(params) {
  return request({
    url: '/arshopadmin/product/updateRelationAndLabel',
    method: 'post',
    params: params
  })
}

export function getRelation(params) {
  return request({
    url: '/arshopadmin/product/getRelation',
    method: 'get',
    params: params
  })
}

export function getProductPirce(params) {
  return request({
    url: '/arshopadmin/product/getProductPirce',
    method: 'get',
    params: params
  })
}

export function getSpec(params) {
  return request({
    url: '/arshopadmin/product/getSpec',
    method: 'get',
    params: params
  })
}
