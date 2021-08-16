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
          <el-form-item label="开票记录编号: ">
            <el-input style="width: 203px" v-model="listQuery.id" placeholder="开票记录编号"></el-input>
          </el-form-item>
          <el-form-item label="公司抬头: ">
            <el-input style="width: 203px" v-model="listQuery.invoice_company" placeholder="公司抬头"></el-input>
          </el-form-item>
          <el-form-item label="经办人: ">
            <el-select v-model="listQuery.operator_id" placeholder="请选择经办人">
              <el-option v-for="item in operatorOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期：">
            <el-date-picker v-model="listQuery.created_at" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" clearable>
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="mchntTable" :data="list" style="width: 100%" v-loading="listLoading" border>
        开票记录编号、公司抬头、税号、金额、经办人、经办日期。
        <el-table-column label="发票编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="公司抬头" width="100" align="center">
          <template slot-scope="scope">{{scope.row.mchnt.invoice_company}}</template>
        </el-table-column>
        <el-table-column label="税号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.mchnt.invoice_tin}}</template>
        </el-table-column>
        <el-table-column label="经办人" width="120" align="center">
          <template slot-scope="scope">{{scope.row.operator_name}}</template>
        </el-table-column>
        <el-table-column label="经办日期" width="120" align="center">
          <template slot-scope="scope">{{scope.row.created_at}}</template>
        </el-table-column>
        <el-table-column label="开票金额" width="120" align="center">
          <template slot-scope="scope">{{scope.row.invoice_amount}}</template>
        </el-table-column>
        <el-table-column label="关联订单" width="120" align="center">
          <template slot-scope="scope">{{scope.row.invoice_order}}</template>
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
  fetchList
} from '@/api/receipt'
import { getUserList } from '@/api/permission'
//parameter
const defaultListQuery = {
  current_page: 1,
  per_page: 5,
  id: null,
  invoice_company: null,
  operator_id: null,
  created_at: null,
};

export default {
  name: "receiptList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      operatorOptions: [],
    }
  },
  created() {
    this.getList();
    this.getOperatorList();
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
    handleSizeChange(val) {
      this.listQuery.current_page = 1;
      this.listQuery.per_page = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.current_page = val;
      this.getList();
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.getList();
    },
    getOperatorList() {
      getUserList().then(response => {
        let list = response.data;
        this.operatorOptions = [];
        for (let i = 0; i < list.length; i++) {
          this.operatorOptions.push({ label: list[i].admin_name, value: list[i].id });
//          console.log(list[i].admin_name);
 //         console.log(list[i].id);
        }
      });
    },
  }
}

</script>
<style></style>
