<template>
  <div class="infobody">
    <div class="grid-content bg-purple"><i class="el-icon-s-order" /><span>基础信息管理</span></div>
    <div class="app-container">
      <div
        v-show="ifUpdate === '0'"
        class="show"
      >
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">
              <span style="color: #ffffff">机房管理</span>
            </div>
          </el-col>
        </el-row>
        <el-row
          :gutter="10"
          class="bg-condition"
        >
          <el-col
            :xs="2"
            :sm="2"
            :md="2"
            :lg="2"
            :xl="2"
          >
            <span>查询条件：</span>
          </el-col>
          <el-col
            :xs="3"
            :sm="3"
            :md="3"
            :lg="3"
            :xl="3"
          >
            <el-select
              v-model="dataName"
              placeholder="详细字段查询"
              multiple
              size="medium"
            >
              <el-option
                v-for="(item,index) in basicvalue"
                :key="index"
                :label="item.label"
                :value="item.value"
                class="searchInput"
              />
            </el-select>
          </el-col>
          <el-col
            :xs="4"
            :sm="4"
            :md="4"
            :lg="4"
            :xl="4"
          >
            <el-input
              v-model="inputValue"
              placeholder="输入查询内容"
              clearable
              size="medium"
            />
          </el-col>
          <el-col
            :xs="2"
            :sm="2"
            :md="2"
            :lg="2"
            :xl="2"
          >
            <el-button
              size="medium"
              type="primary"
              icon="el-icon-search"
              clearable="true"
              @click="fetchData()"
            >搜索</el-button>
          </el-col>
          <el-col
            :xs="1"
            :sm="1"
            :md="1"
            :lg="1"
            :xl="1"
          >
            <el-button
              size="medium"
              type="info"
              @click="addMachine()"
            >添加机房</el-button>
          </el-col>
        </el-row>
        <el-dialog title="新增机房" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="机房名称" :label-width="formLabelWidth">
              <el-input v-model="form.MachineRoomName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="postId" :label-width="formLabelWidth">
              <!-- <el-select v-model="value" placeholder="请选择单位" @change="changeSelect">
                <el-option
                  v-for="item in options"
                  :key="item.postId"
                  :lable="item.name"
                  :value="item.postId">
                </el-option>
              </el-select> -->
              <el-select v-model="form.postId" placeholder="请选择">
                <el-option
                  v-for="item in postAll"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="ceateMachineRoom()">确 定</el-button>
          </div>
        </el-dialog>
        <el-table
          height="70vh"
          :row-style="{height:'6.26vh'}"
          :cell-style="{padding:'0px'}"
          v-loading="listLoading"
          :disable="true"
          :data="list"
          element-loading-text="Loading"
          border
          highlight-current-row
          stripe
        >
          <el-table-column align="center" type="index" />
          <el-table-column
            v-for="(item,index) in basicvalue"
            :key="index"
            :label="item.label"
            :prop="item.value"
            :formatter="item.formatter"
            align="center"
          >
          </el-table-column>
          <el-table-column align="center" label="操作" width="250px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleDetail(scope.$index, scope.row)"
              >详情</el-button>
<!--              <el-button-->
<!--                size="mini"-->
<!--                @click="handleEdit(scope.$index, scope.row)"-->
<!--              >编辑</el-button>-->
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <!-- <div v-if="ifUpdate === '1'">
        <addMachineRoom @changeDiv="changeDiv" />
      </div>
      <div v-if="ifUpdate === '2' || ifUpdate === '3'">
        <updateMachineRoom :row="row" :current-show="ifUpdate" @changeDiv="changeDiv" />
      </div> -->
      <el-drawer
        direction="ttb"
        :visible.sync="drawer"
        :with-header="false">
        <div>
          <!-- <h3 style="text-align:center">机柜号</h3> -->
          <!-- <el-divider></el-divider> -->
          <el-table
          v-loading="cabinetLoading"
          :data="[{tag:0}]"
          element-loading-text="Loading"
          border
        >
        <el-table-column
          label="机柜号"
            align="center"
          >
            <template>
            <el-input placeholder="请输入内容" v-for="(item,index) in cabinetAll" :key="index" v-model="cabinetAll[index].cabinetName" v-loading="listLoading">
              <template slot="append">
                <template>
                  <el-popconfirm
                    confirm-button-text='确认'
                    cancel-button-text='算了'
                    icon="el-icon-info"
                    icon-color="red"
                    title="是否永久删除该机房"
                    @confirm="deleteU(cabinetAll[index].cabinetId)"
                  >
                    <el-button slot="reference" type="danger">删除</el-button>
                  </el-popconfirm>
                </template>
              </template>
            </el-input>
            </template>
          </el-table-column>
          </el-table>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import {delMachineRoom,getMachineRoomByPage,getMachineRoomTotal,delCabinet,addMachineRoom} from '@/api/baseparameter'
import updateMachineRoom from '@/components/Baseparameter/machineRoom/updateMachineRoom'
import { getCabinet,getPost } from '@/api/select'

export default {
  components: {
    addMachineRoom,
    updateMachineRoom
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      postAll:[],
      form: {
        MachineRoomName:"",
        postId: "",
        status: ""
      },
      formLabelWidth: '120px',
      dialogFormVisible:false,
      cabinetId:"",
      cabinetLoading:true,
      cabinetAll:[],
      drawer: false,
      list: null,
      total: 0,
      currentPage: 0,
      limit:10,
      initName:'',
      inputValue: '',
      dataName: 'all',
      ifUpdate: '0',
      listLoading: true,
      basicvalue: [
        {
          value: 'machineRoomName',
          label: '机房名称'
        },
        {
          value: 'postName',
          label: '所属单位'
        }
        // ,
        // {
        //   value: 'status',
        //   label: '机房状态',
        //   formatter:function (row) {
        //     var status= row.status
        //     switch (status){
        //       case "0":
        //         status="正常"
        //         break
        //       case "1":
        //         status="维修中"
        //         break
        //     }
        //     console.log(status)
        //     return status;
        //   }
        // }
      ],
      value: '',
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 综合数据管理展示与查询--lry
    fetchData() {
      // console.log(this.basicValue)
      // 判断处理---解决空值与后台逻辑不符合问题----时间紧待优化
      this.listLoading = true
      // console.log(this.basicValue)
      // 判断处理---解决空值与后台逻辑不符合问题----时间紧待优化
      if (this.dataName === 'all' || this.dataName.length === 0) {
        console.log(this.dataName)
        this.initName = ['111']
      } else {
        // console.log(JSON.parse(JSON.stringify(this.dataName)))
        this.initName = JSON.parse(JSON.stringify(this.dataName))
      }
      const params = {
        dataName: this.initName,
        dataValue: this.inputValue,
        status:"",
        start: this.currentPage,
        limit: this.limit
      }
      const numparams = {
        dataName: this.initName,
        dataValue: this.inputValue,
        status: ""
      }
      getMachineRoomTotal(numparams).then((response) => {
        this.total = response.data
      })
      // console.log(this.initName)
      getMachineRoomByPage(params).then((response) => {
        this.list = response.data.items
        this.listLoading = false
      })
    },

    addMachine() {
      // this.ifUpdate ='1'
      this.dialogFormVisible = true
      getPost().then(response => {
        console.log(response.data.items)
        this.postAll = response.data.items
        console.log(this.postAll);
        console.log(this.options);
      })
    },

    ceateMachineRoom(){
      addMachineRoom(this.form).then(response => {
        console.log(response)
        this.$alert("新增成功", '提示', {
          confirmButtonText: '确定',
          type: 'info',
          showClose: false
        }).then(() => {
          this.dataName="all"
          this.dialogFormVisible = false
          this.fetchData()
        })
      })
    },

    handleDetail(index, row) {
      // this.ifUpdate ='2'
      // this.row = row
      this.drawer = true
      this.fetchCabinet(row)
    },
    handleEdit(index, row) {
      this.ifUpdate ='3'
      this.row = row
    },
    handleDelete(index, row) {
      this.$alert("是否永久删除该机房", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        callback: (action, instance) => {
          if (action === 'confirm') {
            delMachineRoom(row.machineRoomId).then((response) => {
              this.$alert(response.data, '提示', {
                confirmButtonText: '确定',
                type: 'info',
                showClose: false
              }).then(() => {
                this.dataName="all"
                this.fetchData()
              })
            })
          }
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.limit=val
      this.fetchData()
    },
    handleCurrentChange(val) {
      const params = {
        dataName: this.initName,
        dataValue: this.inputValue,
        status:"",
        start: val-1,
        limit: 10
      }
      getMachineRoomByPage(params).then((response) => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    changeDiv(value) {
      this.ifUpdate = value
      this.fetchData()
    },
    deleteU(val){
      // alert(val);
      // this.cabinetId = val;
      delCabinet(val).then((response) => {
        this.$alert(response.data, '提示', {
          confirmButtonText: '确定',
          type: 'info',
          showClose: false
        }).then(() => {
          this.dataName="all"
          this.drawer = false
        })
      })
    },
    confirm(){
      alert(this.cabinetId)

    },
    fetchCabinet(val) {
      this.cabinetLoading = true
      getCabinet(val.machineRoomId).then(response => {
        this.cabinetAll = response.data.items
        this.cabinetLoading = false;
      })
    },
    changeSelect() {
      console.log("============");
        this.$forceUpdate();
      },
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
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #304156;
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
.el-pagination > *{
  font-size: 18px;
}
.block{
  text-align: center;
}
</style>
<style  lang="less">
//覆盖样式
.el-select-dropdown__item {
  height: 30px;
  flex: 1 0 25%;
  margin: 10px;
}
.el-select-dropdown__list {
  margin: 5px 20px 20px 5px;
  height: auto;
  width: 600px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  align-items: stretch;
}
.el-select-dropdown__wrap{
  max-height: none;
}
.el-scrollbar {
  height: 100%;
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
.el-input-group{
  width: 10%;
  margin: 0px 0px 25px 100px;
}
.el-drawer.ttb{
  height: auto !important;
}
</style>
