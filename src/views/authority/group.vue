<!--writen by fht-->
<template>
  <div class="infobody">
    <div class="grid-content bg-purple"><i class="el-icon-s-order" /><span>系统信息管理</span></div>
    <div class="app-container">
      <div>
        <div class="show">
          <el-row>
            <el-col :span="24">
              <div class="grid-content bg-purple-dark">角色权限组列表</div>
            </el-col>
          </el-row>
          <div v-show="mainStatus">
            <el-row
              :gutter="10"
              class="bg-condition">
              <el-col
                :xs="2"
                :sm="2"
                :md="2"
                :lg="2"
                :xl="2"
              >
                <el-button type="primary" size="large" @click="addDialog = true" icon="el-icon-plus">添加角色</el-button>
              </el-col>
            </el-row>
            <el-table
              :header-cell-style="headStyle"
              :cell-style="headStyle"
              :data="tableData"
              style="width: 100%">
              <el-table-column
                prop="name"
                label="角色名称"
                width='350'>
              </el-table-column>
              <el-table-column
                prep="isdel"
                label="状态"
                width="350">
                <template slot-scope="scope">
                  <el-tag
                    style="font-size: 16px;"
                    :type="scope.row.isdel === '0' ? 'success' : 'danger'"
                    disable-transitions>{{scope.row.isdel === '0' ? '激活' : '冻结'}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="设置权限">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    @click="setPermission(scope.$index, scope.row)">设置菜单权限</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
          <div v-show="!mainStatus">
            <el-table
              :header-cell-style="headStyle"
              :cell-style="headStyle"
              :data="tableDatas"
              :span-method="objectSpanMethod"
              border
              style="width: 100%; margin-top: 20px">
              <el-table-column
                prop="menuname"
                label="功能模块组"
                width="500">
              </el-table-column>
              <el-table-column
                prop="itemname"
                label="功能模块">
              </el-table-column>
              <el-table-column
                prop="ischeck"
                label="权限"
                width="500">
                <template slot-scope="scope">
                  <el-checkbox v-model=scope.row.ischeck></el-checkbox>
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align: center;margin-top: 2rem;">
              <el-button type="primary" @click="upAuthority">更新</el-button>
              <el-button type="primary" @click="mainStatus = true">返回</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="添加角色"
      :visible.sync="addDialog"
      width="30%">
      <el-form :model="addForm" label-width="80px">
        <el-form-item label="角色名称" >
          <el-input v-model="addForm.name"  autocomplete="off" style="width:45%"></el-input>
        </el-form-item>
        <el-form-item label="用户状态" >
          <el-select v-model="addForm.status" placeholder="请选择">
            <el-option label="激活" value="0"></el-option>
            <el-option label="冻结" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addAuthor">新 增</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="删除角色"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>请确认要删除这条记录吗?</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handdelAuthor">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="编辑"
      :visible.sync="editdialogVisible"
      width="30%">
      <el-form ref="form" :model="editform" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="editform.uname"  style="width:45%"></el-input>
        </el-form-item>
        <el-form-item label="角色状态">
          <el-select v-model="editform.uisdel" placeholder="选择用户状态">
            <el-option label="激活" value="激活"></el-option>
            <el-option label="冻结" value="冻结"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取消编辑</el-button>
    <el-button type="primary" @click="saveEditchart">保存编辑</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {addAithor, delAuthor, editAuthor, getAuthorData, getAuthority, updateAuthority} from "@/api/Sys_info_manage";
import {getAutherCount} from "@/api/Sys_info_manage";
import {getPostByPage} from "@/api/baseparameter";

export default {
  name: 'Dashboard',
  data(){
    return {
      characterId:'',
      mainStatus:true,
      addDialog:false,
      centerDialogVisible:false,
      editdialogVisible: false,
      formLabelWidth: '120px',
      total: 0,
      currentPage: 0,
      limit:10,
      addForm:{
        name: '',
        status:''
      },
      editform:{
        uid:'',
        uname: '',
        uisdel:'',
      },
      delform:{},
      tableData: [],
      tableDatas: []
    }
  },
  mounted() {
    this.datainit()
  },
  methods:{
    // 数据初始化
    datainit(){
      getAutherCount().then((res) => {
        this.total = res.data
      })
      var data = {
        start: this.currentPage,
        limit: this.limit
      }
      getAuthorData(data).then((res)=> {
        this.tableData = res.data.items
      })
    },
    // 表格样式
    headStyle(){
      return "text-align:center;font-size:16px;color:black"
    },
    //新增角色
    addAuthor() {
      this.addDialog = false
      const data = this.addForm
      addAithor(data).then((res) => {
        console.log(res)
        if (res.code == 20000) {
          this.$message({
            type:'success',
            message:"新增成功"
          })
        }else {
          this.$message({
            type:'error',
            message:'新增失败'
          })
        }
      })
    },
    // 编辑角色
    handleEdit(index, row) {
      this.editdialogVisible = true
      this.editform.uname = row.name
      this.editform.uid = row.id
      this.editform.uisdel = row.isdel === '0' ? '激活' : '冻结'
    },
    // 角色编辑  提交
    saveEditchart() {
      this.editdialogVisible = false
      const data = this.editform
      data.uisdel = this.editform.uisdel === '激活' ? '0' : '1'
      var that = this
      editAuthor(data).then((res) =>{
        if(res.code === 20000) {
          this.$message({
            type:'success',
            message:'修改成功'
          })
          that.datainit()
        }else{
          this.$message({
            type:'error',
            message:'修改失败'
          })
        }
      })
    },
    // 删除角色 确认弹窗
    handleDelete(index, row) {
      this.delform = row
      this.centerDialogVisible = true
    },
    // 删除角色 提交
    handdelAuthor(){
      this.centerDialogVisible = false
      const data = {id:this.delform.id}
      delAuthor(data).then((res) => {
        if(res.code === 20000) {
          this.$message({
            type:'success',
            message:'删除成功'
          })
          this.datainit()
        }
      })
    },
    // 获取 设置菜单权限
    setPermission(index,row) {
      this.mainStatus = false
      this.characterId = row.id
      const data = {id:row.id}
      getAuthority(data).then((res) => {
        this.tableDatas = res.data.items
        console.log(this.tableDatas)
      })
    },
    // 表格合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan:7,
            colspan: 1
          }
        } else if (rowIndex === 7) {
          return {
            rowspan: 4,
            colspan: 1
          }
        } else if (rowIndex === 11) { //  合并第10行到第14行，从第10行开始，共5行
          return {
            rowspan: 5,
            colspan: 1
          }
        }else if (rowIndex === 16 ) { //  合并第10行到第14行，从第10行开始，共5行
          return {
            rowspan: 7,
            colspan: 1
          }
        } else  if (rowIndex === 23 ){ // 其余被合并的行，诸如1、2、3、5、6、7、8、10、11、12、13全都设为0
          return {
            rowspan: 1,
            colspan: 1
          }
        } else  if (rowIndex === 24 ){ // 其余被合并的行，诸如1、2、3、5、6、7、8、10、11、12、13全都设为0
          return {
            rowspan: 1,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 1
          }
        }
      }
  },
    //
    upAuthority(){
      console.log(this.tableDatas)
      const checkList = []
      for(var i = 0;i < this.tableDatas.length;i++){
        if (this.tableDatas[i].ischeck === true){
          checkList.push(this.tableDatas[i].itemid)
        }
      }
      const data = {}
      data.agroupid = this.characterId
      data.authoritycheck = checkList
      this.mainStatus = true
      updateAuthority(data).then((res) => {
        if (res.code === 20000) {
          this.$message({
            type:'success',
            message:'权限更新成功'
          })
        }
      })
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.limit=val
      // this.fetchData()
    },
    handleCurrentChange(val) {
      const params = {
        dataName: this.initdata,
        dataValue: this.inputValue,
        start: val-1,
        limit: 10
      }
      getPostByPage(params).then((response) => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
  }
}
</script>

<style lang="scss" scoped>
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
