<template>
  <div class="infobody">
    <div class="grid-content bg-purple">
      <i class="el-icon-s-order" /><span>信息管理</span>
    </div>
    <div class="app-container">
      <div class="table_end">
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">数据报表制作</div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="bg-condition">
          <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
            <span>查询条件：</span>
          </el-col>
          <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
            <el-select
              v-model="DataName"
              placeholder="详细字段查询"
              multiple
              size="medium"
            >
              <el-option
                v-for="(item, index) in dataname"
                :key="index"
                :label="item.label"
                :value="item.value"
                class="searchInput"
              />
            </el-select>
          </el-col>
          <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
            <el-input size="medium" v-model="inputValue" placeholder="输入查询内容" clearable />
          </el-col>
          <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="medium"
              clearable="true"
              @click="get_data2()"
            >搜索</el-button>
          </el-col>
          <el-col :xs="1" :sm="2" :md="2" :lg="2" :xl="2">
            <el-button type="primary" size="medium" icon="el-icon-download" @click="exportEscel(0)">总表导出</el-button>
          </el-col>
          <el-col :xs="1" :sm="2" :md="2" :lg="2" :xl="2">
            <el-button type="primary" size="medium" icon="el-icon-download" @click="exportEscel(1)">详表导出</el-button>
          </el-col>
          <el-col :xs="1" :sm="2" :md="2" :lg="2" :xl="2">
            <el-button type="primary" size="medium" icon="el-icon-download" @click="exportEscel(2)">统计表导出</el-button>
          </el-col>
        </el-row>

        <div class="grid-content form_table_class" >
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe
            height="70vh"
            :row-style="{height:'6.26vh'}"
            :cell-style="{padding:'0px'}"
            border
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
            @select-all="selectAllFun"
            @selection-change="handleSelectionChange"
          >
            <el-table-column label="" width="40" type="selection" />
            <el-table-column
              v-for="(item, index) in dataname"
              :key="index"
              :prop="item.value"
              :label="item.label"
              :formatter="item.formatter"
              header-align="center"
              align="center"
              style="width: 100%"
              show-overflow-tooltip
              :width="flexColumnWidth(item.value, item.label)"
            />
          </el-table>
          <el-alert v-if="isflag" title="正在努力加载中..." type="success" center :closable="false" show-icon></el-alert>
          <el-alert v-if="isMore" title="没有更多数据" type="warning" center show-icon></el-alert>
          <!-- <div class="tabListPage" style="text-align: center">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="pageSizes"
              :page-size="PageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
            >
            </el-pagination>
          </div> -->
          <el-dialog
            title="详表导出模式选择"
            :visible.sync="centerDialogVisible"
            width="30%"
            center
          >
            <div style="width:100%;text-align: center;">
              <span>
                <span class="radio_class">
                  <el-radio v-model="select_teble_radio" label="1">单独导出每条数据</el-radio>
                  <el-radio v-model="select_teble_radio" label="2">多条数据存放在一个文件中导出</el-radio>
                </span>
                <span v-if="select_teble_radio==2">
                  <el-radio-group v-model="select_teble_type">
                    <el-radio :label="2">2条</el-radio>
                    <el-radio :label="8">8条</el-radio>
                    <el-radio :label="10">10条</el-radio>
                    <el-radio :label="-2">全部</el-radio>
                    <el-radio :label="-3">自定义</el-radio>
                  </el-radio-group>
                  <span v-if="select_teble_type == -3" class="radio_class">
                    <el-input v-model="select_teble_type2" placeholder="输入数量" style="width: 24rem;" />
                  </span>
                </span>
              </span>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button style="height: 2.8rem;" @click="centerDialogVisible = false">取 消</el-button>
              <el-button type="primary" style="height: 2.8rem;" @click="getExcel2">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <div class="tabListPage" style="text-align: center">
          <h3>
            共{{totalCount}}条数据
          </h3>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { getExcelDemo1, getExcelDemo2, getExcelDemo3 } from '@/api/get_excel'
import { getStatisticsData } from '@/api/table'
import { getList, getdataCount } from '@/api/table'
import Progress from "@/components/progress"
export default {
  data() {
    return {
      // 总数据
      tableData: [],
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [5, 8, 10, 12, 15],
      // 默认每页显示的条数（可修改）
      PageSize: 12,
      // 上一次的筛选参数
      par_str: '',
      selectData: [],
      centerDialogVisible: false,
      select_teble_radio: -1,
      select_teble_type: -1,
      select_teble_type2: '',
      inputValue: '',
      initname: ['123'],
      radio: -1,
      basic_info_id: '',
      dataname: [
        {
          value: 'num',
          label: '#'
        },{
          value: 'basicInfoId',
          label: '设备编号'
        },
        {
          value: 'postName',
          label: '所属单位'
        },
        {
          value: 'departmentName',
          label: '所属部门'
        },
        {
          value: 'equipmentName',
          label: '设备名'
        },
        {
          value: 'brandName',
          label: '设备品牌'
        },
        {
          value: 'equipmentTypeName',
          label: '设备类型'
        },
        {
          value: 'businessSystemName',
          label: '业务系统'
        },
        {
          value: 'machineRoomName',
          label: '安装位置'
        },
        {
          value: 'cabinetName',
          label: '机柜编号'
        },
        {
          value: 'onlineTime',
          label: '上线时间',
          formatter:function (row) {
            var time=row.onlineTime
            if(!time){
              return time
            }
            //时间格式化函数，此处仅针对yyyy-MM-dd hh:mm:ss 的格式进行格式化
            var date=new Date(time);
            var year=date.getFullYear();
            /* 在日期格式中，月份是从0开始的，因此要加0
             * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
             * */
            var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
            var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
            var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
            var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
            var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
            // 拼接
            // return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
            return year+"-"+month+"-"+day;
          }
        },
        {
          value: 'offlineTime',
          label: '下线时间',
          formatter:function (row) {
            var time=row.offlineTime
            if(!time){
              return time
            }
            //时间格式化函数，此处仅针对yyyy-MM-dd hh:mm:ss 的格式进行格式化
            var date=new Date(time);
            var year=date.getFullYear();
            /* 在日期格式中，月份是从0开始的，因此要加0
             * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
             * */
            var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
            var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
            var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
            var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
            var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
            // 拼接
            // return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
            return year+"-"+month+"-"+day;
          }
        },
        {
          value: 'hostName',
          label: '主机名'
        },
        {
          value: 'equipmentAdminName',
          label: '设备管理员'
        },
        {
          value: 'equipmentAdminPhone',
          label: '设备管理员电话'
        },
        {
          value: 'appAdminName',
          label: '应用管理员'
        },
        {
          value: 'appAdminPhone',
          label: '应用管理员电话'
        },
        {
          value: 'brandModelName',
          label: '型号'
        },
        {
          value: 'serialNumber',
          label: '序列号'
        },
        {
          value: 'guaranteePeriod',
          label: '保修期'
        }
      ],
      uploadData: {
        //懒加载节点信息
        tree: null,
        treeNode: null,
        resolve: null
      },
      isflag: false,
      isMore: false,
      DataName: 'all',
      ClientHeight:0,
      // 统计数据
      StatisticsData: [],
      // 全选事件
      is_select_all:false
    }
  },
  components:{
    Progress
  },
  computed: {
    ...mapGetters(['name', 'roles']),
  },

  mounted() {
    this.get_data()
    document.getElementsByClassName('el-table__body-wrapper')[0].addEventListener('scroll',this.load)
  },
  destroyed() {
    document.removeEventListener('scroll',this.load)
  },
  watch:{
    'ClientHeight':function(curVal,oldVal){
      console.log(curVal,oldVal,'----------------------')
      console.log(this.tableData.length , this.totalCount)
      if (this.DataName === 'all' || this.DataName.length === 0) {
        console.log(this.DataName)
        this.initname = ['111']
      } else {
        this.initname = JSON.parse(JSON.stringify(this.DataName))
      }
      const params = {
        dataName: this.initname,
        dataValue: this.inputValue,
        start: this.tableData.length ? this.tableData.length : 0,
        limit: this.totalCount < this.tableData.length + 15 ? this.totalCount - this.tableData.length : 15,
        status: ''
      }
      if(this.tableData.length < this.totalCount){
        console.log("提交请求",params)
        getList(params).then((response) => {
          this.isflag = false
          console.log(response)
          if(this.tableData.length < this.totalCount){
            let num = this.tableData.length + 1
            for(let i of response.data.items){
              i["num"] = num
              num++
            }
            this.tableData = this.tableData.concat(response.data.items)
            }
        })
      }

    }
  },
  methods: {
    get_data() {
      if (this.DataName === 'all' || this.DataName.length === 0) {
        console.log(this.DataName)
        this.initname = ['111']
      } else {
        this.initname = JSON.parse(JSON.stringify(this.DataName))
      }
      const params = {
        dataName: this.initname,
        dataValue: this.inputValue,
        start: this.tableData.length ? this.tableData.length : 0,
        limit: 15,
        status: ''
      }
      const numparams = {
        dataName: this.initname,
        dataValue: this.inputValue,
        status: ''
      }
      getdataCount(numparams).then((response) => {
        this.totalCount = response.data.total
      })
      console.log("提交请求",params)

      getList(params).then((response) => {
        console.log(response)
        let num = this.tableData.length + 1
        for(let i of response.data.items){
          i["num"] = num
          num++
        }
        this.tableData = this.tableData.concat(response.data.items)
      })

    },
    get_data2() {
      this.tableData = []
      if (this.DataName === 'all' || this.DataName.length === 0) {
        console.log(this.DataName)
        this.initname = ['111']
      } else {
        this.initname = JSON.parse(JSON.stringify(this.DataName))
      }

      const numparams = {
        dataName: this.initname,
        dataValue: this.inputValue,
        status: ''
      }
      const params = {
        dataName: this.initname,
        dataValue: this.inputValue,
        start: this.tableData.length ? this.tableData.length : 0,
        limit: 15,
        status: ''
      }
      getdataCount(numparams).then((response) => {
        this.totalCount = response.data.total
      })
      getList(params).then((response) => {
        console.log(response)
        let num = this.tableData.length + 1
        for(let i of response.data.items){
          i["num"] = num
          num++
        }
        this.tableData = this.tableData.concat(response.data.items)
      })

    },
    load (e) {
      if(e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight) <= 40){
        console.log("滚动到底了",this.tableData.length , this.totalCount,e.target.scrollHeight)
        if(this.ClientHeight == e.target.scrollHeight){
          this.isMore = true
          setTimeout(()=>{
            this.isMore = false
          },1000)
        }
        this.ClientHeight = e.target.scrollHeight
      }
    },
    getStatisticsExcel() {
      const item_list = [
        'getEquipmentCount',
        '../baseparameter/getEquipmentTypeCount',
        'getGuaranteePeriodCount',
        'getSystemWareCount',
        'getApplicationUserCount?qapp_user=all',
        'getEquipmentUserCount?qequipment_user=all'
      ]
      const trigger_fun = (data) => {
        this.StatisticsData.push(data)
        if (this.StatisticsData.length > 5) {
          console.log('ok')
          getExcelDemo3(this.StatisticsData)
        }
      }
      for (const i of item_list) {
        getStatisticsData(i).then((res) => {
          // console.log(res,i)
          // StatisticsData.push(res)
          if (typeof res === 'object') {
            trigger_fun(res.data)
          } else {
            trigger_fun(res)
          }
        }).catch(err=>{ // 如果接口失效则添加零
          console.log(err)
          trigger_fun(0)
        })
      }
    },
    handleSelectionChange(val) {
      this.selectData = val
    },
    selectAllFun(val){
      if(val.length!=0){
        this.is_select_all = true;
      }else {
        this.is_select_all = false;
      }
      console.log(this.is_select_all)
    },
    async exportEscel(model) {
      if (model === 0) {
        if (this.DataName === 'all' || this.DataName.length === 0) {
          console.log(this.DataName)
          this.initname = ['111']
        } else {
          this.initname = JSON.parse(JSON.stringify(this.DataName))
        }
        const numparams = {
          dataName: this.initname,
          dataValue: this.inputValue,
          status: ''
        }
        let item_count = (await getdataCount(numparams)).data.total
        const params = {
          dataName: this.initname,
          dataValue: this.inputValue,
          start: 0,
          limit: item_count,
          status: ''
        }
        getList(params).then((response) => {
          getExcelDemo1(response.data.items)
        })
      } else if (model === 1) {
        // 选择怎么导出数据 1.单独导出每条数据 2.多条数据存放在一个文件中导出
        // 设置弹窗导出
        if (this.selectData.length > 1) {
          this.centerDialogVisible = true
        } else if (this.selectData.length === 1) {
          getExcelDemo2(this.selectData)
          // 取消表格选择
          this.$refs.multipleTable.clearSelection();
          // console.log('this')
        } else {
          this.$message.error('请选择需要导出的信息')
        }
      } else if (model === 2) {
        this.getStatisticsExcel()
      }
    },
    async getExcel2() {
      // eslint-disable-next-line eqeqeq
      let data_num = 0
      if (this.select_teble_radio != -1 || this.select_teble_type != -1 || this.select_teble_type2 != '') {
        if (this.select_teble_radio == 1) {
          data_num = 1
        } else if (this.select_teble_type != -3) {
          data_num = this.select_teble_type
        } else {
          const item_num = parseInt(this.select_teble_type2)
          if (item_num > 0 && item_num < this.selectData.length) {
            data_num = item_num
          } else if (item_num >= this.selectData.length) {
            data_num = -2
          } else {
            this.$message.error('请选择填入合理的数字')
            data_num = 0
          }
        }
        if (data_num !== 0) {
          let item = this.selectData
          if(this.is_select_all){ // 表格全选
            if (this.DataName === 'all' || this.DataName.length === 0) {
              this.initname = ['111']
            } else {
              this.initname = JSON.parse(JSON.stringify(this.DataName))
            }
            const numparams = {
              dataName: this.initname,
              dataValue: this.inputValue,
              status: ''
            }
            let item_count = (await getdataCount(numparams)).data.total
            const params = {
              dataName: this.initname,
              dataValue: this.inputValue,
              start: 0,
              limit: item_count,
              status: ''
            }
            item = (await getList(params)).data.items
          }
          this.is_select_all = false
          const h = this.$createElement
          let notify = this.$notify({
              title: '正在导出',
              dangerouslyUseHTMLString: true,
              message: h('Progress',{
              style:{
                  width:"15rem"
              }
              }),
              type: 'success',
              offset: 100,  // 向下偏移100
              duration: 0  // 设置不会自动关闭
          })
          // console.log("退出弹窗")
          this.centerDialogVisible = false
          this.select_teble_radio = -1
          this.select_teble_type = -1
          this.select_teble_type2 = ''
          // 取消表格选择
          this.$refs.multipleTable.clearSelection();
          getExcelDemo2(item, data_num == -2 ? item.length : data_num > item.length ? item.length : data_num ).then((res=>{
            setTimeout(()=>{
              notify.close()
            },2000)
          }))
        }

      }
    },
    /**
     * el-table-column 自适应列宽
     * @param prop_label: 表名
     * @param table_data: 表格数据
     */
    flexColumnWidth(label, prop) {
      // console.log('label', label)
      // console.log('prop', prop)
      // 1.获取该列的所有数据
      const arr = this.tableData.map((x) => x[prop])
      // arr.push(label) // 把每列的表头也加进去算
      arr.push(prop) // 把每列的表头也加进去算
      // console.log(arr)
      // // 2.计算每列内容最大的宽度 + 表格的内间距（依据实际情况而定）
      return this.getMaxLength(arr)*1.7 + 40 + 'px'
    },

    /**
     * 遍历列的所有内容，获取最宽一列的宽度
     * @param arr
     */
    getMaxLength(arr) {
      return arr.reduce((acc, item) => {
        if (item) {
          const calcLen = this.getTextWidth(item)
          if (acc < calcLen) {
            acc = calcLen
          }
        }
        return acc
      }, 0)
    },

    /**
     * 使用span标签包裹内容，然后计算span的宽度 width： px
     * @param valArr
     */
    getTextWidth(str) {
      let width = 0
      const html = document.createElement('span')
      html.innerText = str
      html.className = 'getTextWidth'
      document.querySelector('body').appendChild(html)
      width = document.querySelector('.getTextWidth').offsetWidth
      document.querySelector('.getTextWidth').remove()
      return width
    },
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.PageSize = val
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      // this.currentPage = 1;
      // this.getData_plus(0, this.currentPage * this.PageSize, this.par_str);
      // console.log(val);
    }
    // 显示第几页
    // handleCurrentChange(val) {
    //   // 改变默认的页数
    //   this.currentPage = val
    //   // 取消选中
    //   this.basic_info_id = ''
    //   this.radio = -1

    //   this.getData_plus(
    //     this.PageSize * (this.currentPage - 1),
    //     this.PageSize * this.currentPage
    //     // this.par_str
    //   )
    //   // console.log(val);
    // }
  }
}
</script>

<style lang="less" scoped>
//*{
//  font-size: 18px;
//}

.searchInput {
  height: 40px;
  text-align: center;
  color: #0b0c10;
  background-color: #deecff;
}
// .el-scrollbar {
//   overflow: hidden;
//   position: relative;
// }

.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-condition {
  line-height: 50px;
  text-align: center;
  height: 54px;
  margin: 0px !important;
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
// .form_table_class{
//   // overflow-y: scroll;
//   // height: 50rem;
// }
.tabListPage h3 {
    padding-top: 0.1rem;
    padding-bottom: 0.5rem;
    margin: 0.1rem;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.app-container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.grid-content {
  padding: 9px;
  box-shadow: 0 0 4px rgb(0 0 0 / 30%);
}
.font {
  font-size: 18px;
}
.el-cascader .el-input {
  width: 130px;
}
.el-pagination > * {
  font-size: 18px;
}
.block {
  text-align: center;
}
</style>
<style  lang="less">
/* //需要覆盖的组件样式 */
// .el-scrollbar /deep/
.el-select-dropdown__item {
  height: 30px;
  flex: 1 0 25%;
  margin: 10px;
}

// 必须给子元素一个上层class名才不会影响到其他页面同名组件
.el-select-dropdown__list {
  margin-right: 20px;
  margin-left: 5px;
  margin-top: 5px;
  height: auto;
  width: 600px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  align-items: stretch;
}
.el-scrollbar {
  height: 380px;
  overflow: hidden;
  position: relative;
}
.el-scrollbar .el-scrollbar__wrap {
  overflow: auto;
  height: 100%;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
  color: #1d1e1f;
  background-color: #d2d2d2;
}
.el-scrollbar__bar.is-vertical > div {
  width: 0;
}

.el-button--primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
.myel_row {
  margin-bottom: 2px !important;
  background-color: #d3dce6;
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.radio_class{
  display:inline-block;
  height:2rem;
  width:100%;
}
.el-button--primary {
    height: 40px;
}
</style>
