<template>
  <div>
    <div class="grid-content bg-purple">
      <i class="el-icon-s-order" /><span>帮助信息</span>
    </div>
    <div class="app-container" style="height: 47rem">
        <el-row>
          <el-col>
            <div class="grid-content bg-purple-dark">帮助文档</div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="bg-condition">
          <el-button type="primary" style="margin-left: 15px; line-height:10px" @click="DownHelpDocument()">点击下载说明文档</el-button>
        </el-row>
    </div>
    <footer>
      <p style="text-align: center">软件信息-中国地震局信息资源管理系统v1.0 Beta</p>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'help',
  data() {
    return {

    }
  },
  methods:{
    //点击下载使用说明文档
    DownHelpDocument() {
      // specification.docx文件存储在public文件夹下
      let a = document.createElement('a')
      a.href = './static/specification.docx'  //下载链接
      a.download = '使用说明.docx'  //下载后文件名
      // a.style.display = 'none'
      document.body.appendChild(a)
      a.click() //点击下载
      a.remove() //下载完成移除元素
    },
  }


}
</script>

<style lang="scss" scoped>
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  padding: 9px;
  box-shadow: 0 0 4px rgb(0 0 0 / 30%);
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-condition {
  line-height: 50px;

  height: 54px;
  margin: 0px !important;
  background: #d3dce6;
}


</style>







