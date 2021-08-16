import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/arshopadmin/mchnt/fetchlist',
    method: 'get',
    params: params
  })
}

export function createMchnt(data) {
  return request({
    url: '/arshopadmin/mchnt/createMchnt',
    method: 'post',
    data: data
  })
}

export function getMchnt(params) {
  return request({
    url: '/arshopadmin/mchnt/getMchnt',
    method: 'get',
    params: params
  })
}

export function getAllMchnt() {
  return request({
    url: '/arshopadmin/mchnt/getAllMchnt',
    method: 'get',
  })
}

export function getMchntAddress(id) {
  return request({
    url: '/arshopadmin/mchnt/getMchntAddress',
    method: 'get',
    params: { 'id': id }
  })
}

export function getMchntAddressId(params) {
  return request({
    url: '/arshopadmin/mchnt/getMchntAddressId',
    method: 'get',
    params: params
  })
}

export function getAddressDetail(params) {
  return request({
    url: '/arshopadmin/mchnt/getAddressDetail',
    method: 'get',
    params: params
  })
}


export function updateMchnt(data) {
  return request({
    url: '/arshopadmin/mchnt/updateMchnt',
    method: 'post',
    data: data
  })
}

export function deleteMchntProduct(params) {
  return request({
    url: '/arshopadmin/mchnt/deleteMchntProduct',
    method: 'post',
    params: params
  })
}

export function deleteMchntAddress(params) {
  return request({
    url: '/arshopadmin/mchnt/deleteMchntAddress',
    method: 'post',
    params: params
  })
}

export function updateDeleteStatus(params) {
  return request({
    url: '/arshopadmin/mchnt/deleteMchnt',
    method: 'post',
    params: params
  })
}

export function newMchntsSevenDay() {
  return request({
    url: '/arshopadmin/mchnt/getNewMchntSevenDay',
    method: 'get',
  })
}

export function totalMchntSevenDay() {
  return request({
    url: '/arshopadmin/mchnt/totalMchntSevenDay',
    method: 'get',
  })
}
