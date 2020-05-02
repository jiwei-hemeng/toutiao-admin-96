<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>粉丝管理</span>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="粉丝列表" name="first">
        <el-table
        class="fans-table"
        :data="tableData"
        stripe
        style="width: 100%">
          <el-table-column
            prop="date"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址">
          </el-table-column>
        </el-table>
        <!-- 列表分页 -->
        <el-pagination
          layout="prev, pager, next"
          background
          :total="totalCount"
          :page-size="pageSize"
          :disabled="loading"
          :current-page.sync="page"
          @current-change="onCurrentChange">
        </el-pagination>
      <!-- /列表分页 -->
      </el-tab-pane>
      <el-tab-pane label="粉丝画像" name="second">粉丝画像</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  name: 'FansIndex',
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      activeName: 'first',
      page: 1,
      loading: false,
      pageSize: 10,
      totalCount: 400
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    onCurrentChange () {
    }
  }
}
</script>

<style scoped lang="less">
.fans-table {
    margin-bottom: 10px;
}
</style>
