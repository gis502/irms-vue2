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
export function getdataCount(obj) {
  // 将有数组和字符串的对象转为符合JSON格式的对象
  var params = JSON.parse(JSON.stringify(obj))
  // console.log(params)
  // console.log(typeof (params))
  return request({
    params,
    url: '/home/inforesources/getCompreDataCount',
    method: 'get',
    responseType: 'json'
  })
}
export function addEquipment(eq) {
  return request({
    data: eq,
    url: '/home/inforesources/AddEquipment',
    method: 'post',
    responseType: 'json'
  })
}
