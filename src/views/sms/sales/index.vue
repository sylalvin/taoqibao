<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="handleSearchList()" type="primary" size="small">
          查询结果
        </el-button>
        <el-button style="float: right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="销售姓名：">
            <el-input style="width: 203px" v-model="listQuery.sales_name" placeholder="销售姓名"></el-input>
          </el-form-item>
          <el-form-item label="销售电话：">
            <el-input style="width: 203px" v-model="listQuery.sales_mobile" placeholder="销售电话"></el-input>
          </el-form-item>
          <el-form-item label="销售状态：">
            <el-select v-model="listQuery.status" placeholder="在职" clearable>
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" style="float: right;margin-right: 15px" @click="handleAddSales()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="salesTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sales_id}}</template>
        </el-table-column>
        <el-table-column label="销售姓名" width="120" align="center">
          <template slot-scope="scope">{{scope.row.sales_name}}</template>
        </el-table-column>
        <el-table-column label="手机号码" width="200" align="center">
          <template slot-scope="scope">{{scope.row.sales_mobile}}</template>
        </el-table-column>
        <el-table-column label="已有客户" width="200" align="center">
          <template slot-scope="scope">{{scope.row.mchnt_num}}</template>
        </el-table-column>
        <el-table-column label="已有订单" width="200" align="center">
          <template slot-scope="scope">{{scope.row.order_num}}</template>
        </el-table-column>
        <el-table-column label="总收入" width="200" align="center">
          <template slot-scope="scope">{{scope.row.amount_received}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleUpdateSales(scope.$index, scope.row)">编辑
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.per_page" :page-sizes="[5,10,15]" :current-page.sync="listQuery.current_page" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {
  fetchList,
  updateDeleteStatus
} from '@/api/sales'
//parameter
const defaultListQuery = {
  name: null,
  current_page: 1,
  per_page: 5,
  status: null
};

export default {
  name: "salesList",
  data() {
    return {
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      statusOptions: [{
        value: 0,
        label: '在职'
      }, {
        value: -1,
        label: '离职'
      }]
    }
  },
  created() {
    this.getList();
  },
  watch: {

  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.data;
        this.total = response.data.total;
      });
    },
    handleSearchList() {
      this.listQuery.current_page = 1;
      this.getList();
    },
    handleAddSales() {
      this.$router.push({ path: '/sms/addSales' });
    },
    handleSizeChange(val) {
      this.listQuery.current_page = 1;
      this.listQuery.per_page = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.current_page = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.getList();
    },
    handleDelete(index, row) {
      this.$confirm('是否要进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = [];
        id.push(row.sales_id);
        this.updateDeleteStatus(-1, id);
      });
    },
    handleUpdateSales(index, row) {
      this.$router.push({ path: '/sms/updateSales', query: { id: row.sales_id } });
    },
    updateDeleteStatus(deleteStatus, id) {
      let params = new URLSearchParams();
      params.append('sales_id', id);
      params.append('deleteStatus', deleteStatus);
      updateDeleteStatus(params).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: 1000
        });
      });
      this.getList();
    }
  }
}

</script>
<style></style>
