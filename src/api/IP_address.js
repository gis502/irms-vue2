import request from '@/utils/request'
// 综合数据管理展示与查询--lry
export function getList(obj) {
  // 将有数组和字符串的对象转为符合JSON格式的对象
  var params = JSON.parse(JSON.stringify(obj))
  // console.log(params)
  // console.log(typeof (params))
  return request({
    params,
    url: '/home/inforesources/getCompreDataAll',
    method: 'get',
    responseType: 'json'
  })
}
//IP 地址数据获取
export function getNetWorkList(obj) {
  // 将有数组和字符串的对象转为符合JSON格式的对象
  var params = JSON.parse(JSON.stringify(obj))
  console.log(params)
  // console.log(typeof (params))
  return request({
    params,
    url: '/home/IPaddress/getBasicInfoNetworkByPage1',
    method: 'get',
    responseType: 'json'
  })
}
//IP 地址数据获取
export function updateBasicInfoNetwork(obj) {
  // 将有数组和字符串的对象转为符合JSON格式的对象
  var params = JSON.parse(JSON.stringify(obj))
  console.log(params)
  // console.log(typeof (params))
  return request({
    params,
    url: '/home/IPaddress/updateIPaddressAction',
    method: 'post',
    responseType: 'json'
  })
}
export function getdataCount(obj) {
  // 将有数组和字符串的对象转为符合JSON格式的对象
  var params = JSON.parse(JSON.stringify(obj))
  // console.log(params)
  // console.log(typeof (params))
  return request({
    params,
    url: '/home/IPaddress/getBasicInfoNetworkCount1',
    method: 'get',
    responseType: 'json'
  })
}
// 获取统计数据
export function getStatisticsData(par) {
  return request({
    url: '/home/inforesources/' + par,
    method: 'get',
    responseType: 'json'
  })
}
export function addEquipment(eq) {
  console.log(eq)
  return request({

    data: eq,
    url: '/home/inforesources/AddEquipment',
    method: 'post',
    responseType: 'json'
  })
}
export function delEquipment(equipmentId) {
  console.log(typeof (equipmentId))
  return request({

    params: { equipmentId: equipmentId },
    url: '/home/inforesources/DelEquipment',
    method: 'post',
    responseType: 'json'
  })
}
export function getbasic(equipmentId) {
  console.log(equipmentId)
  return request({
    params: { equipmentId: equipmentId },
    url: '/home/inforesources/getBasicInfoById',
    method: 'post',
    responseType: 'json'
  })
}
export function changeStatus(eq) {
  var params = JSON.parse(JSON.stringify(eq))
  return request({
    params,
    url: '/home/inforesources/changeEquipStatus',
    method: 'post',
    responseType: 'json'
  })
}

export function getQComSelect(model) {
  return request({
    url: 'home/authority/' + model,
    method: 'post',
    responseType: 'json'
  })
}

