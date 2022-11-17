import request from '@/utils/request'

export function getDepartmentAllCountData() {
  // 将有数组和字符串的对象转为符合JSON格式的对象
  // var params = JSON.parse(JSON.stringify(obj))
  let params = ''

  return request({
    params,
    url: '/home/inforesources/getDepartmentAllCountData',
    method: 'get',
    responseType: 'json'
  })
}

export function getEquipmentAllCountData(obj) {
  // 将有数组和字符串的对象转为符合JSON格式的对象
  var params = JSON.parse(JSON.stringify(obj))
  console.log(params)
  // console.log(typeof (params))
  return request({
    params,
    url: '/home/inforesources/getEquipmentAllCountData',
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
