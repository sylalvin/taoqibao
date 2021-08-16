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
          <el-form-item label="商户公司名">
            <el-input style="width: 203px" v-model="listQuery.mchnt_company" placeholder="商户公司名"></el-input>
          </el-form-item>
          <el-form-item label="商户称呼">
            <el-input style="width: 203px" v-model="listQuery.mchnt_name" placeholder="商户称呼"></el-input>
          </el-form-item>
          <el-form-item label="商户电话">
            <el-input style="width: 203px" v-model="listQuery.mchnt_mobile" placeholder="商户电话"></el-input>
          </el-form-item>
          <el-form-item label="商户地址">
            <el-input style="width: 203px" v-model="listQuery.mchnt_address" placeholder="商户电话"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" style="float: right;margin-right: 15px" @click="handleAddMchnt()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="mchntTable" :data="list" style="width: 100%" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.mchnt_id}}</template>
        </el-table-column>
        <el-table-column label="商户公司名" width="120" align="center">
          <template slot-scope="scope">{{scope.row.mchnt_company}}</template>
        </el-table-column>
        <el-table-column label="商户称呼" width="120" align="center">
          <template slot-scope="scope">{{scope.row.mchnt_name}}</template>
        </el-table-column>
        <el-table-column label="商户电话" width="120" align="center">
          <template slot-scope="scope">{{scope.row.mchnt_mobile}}</template>
        </el-table-column>
        <el-table-column label="订气频率" width="120" align="center">
          <template slot-scope="scope">{{scope.row.frequency}}</template>
        </el-table-column>
        <el-table-column label="商户地址" align="center">
          <template slot-scope="scope">
            <span v-for="data in scope.row.address">
              <p>{{data.name}}</p>
              <p>{{data.tel}}</p>
              <p>{{data.province}} {{data.city}} {{data.district}} {{data.address}}</p>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="默认价格" width="200" align="center">
          <template slot-scope="scope">
            <span v-for="data in scope.row.product">
              <p>{{data.product.product_name}} 原价：{{data.product.product_price}} 商户专属价：{{data.product_price}}</p>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleUpdateMchnt(scope.$index, scope.row)">编辑
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
} from '@/api/mchnt'
//parameter
const defaultListQuery = {
  mchnt_company: null,
  mchnt_name: null,
  mchnt_mobile: null,
  current_page: 1,
  per_page: 5,
  status: null
};

export default {
  name: "mchntList",
  data() {
    return {
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
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
    handleAddMchnt() {
      this.$router.push({ path: '/mms/addMchnt' });
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
    handleDelete(index, row) {
      this.$confirm('是否要进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = [];
        id.push(row.mchnt_id);
        this.updateDeleteStatus(-1, id);
      });
    },
    handleUpdateMchnt(index, row) {
      this.$router.push({ path: '/mms/updateMchnt', query: { id: row.mchnt_id } });
    },
    updateDeleteStatus(deleteStatus, id) {
      let params = new URLSearchParams();
      params.append('mchnt_id', id);
      params.append('deleteStatus', deleteStatus);
      updateDeleteStatus(params).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: 1000
        });
        this.getList();
      });
    }
  }
}

</script>
<style></style>
