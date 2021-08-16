<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" style="float: right;margin-right: 15px" @click="handleAddProduct()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.item_id}}</template>
        </el-table-column>
        <el-table-column label="规格名称" align="center">
          <template slot-scope="scope">{{scope.row.item_name}}</template>
        </el-table-column>
        <el-table-column label="类别" width="120" align="center">
          <template slot-scope="scope"><span v-if="scope.row.group_id == 1">容积</span><span v-if="scope.row.group_id == 2">介质</span></template>
        </el-table-column>
        <el-table-column label="创建时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.created_at}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleUpdateProduct(scope.$index, scope.row)">编辑
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
  updateDeleteStatus,
} from '@/api/spec'


//fetch list parameter
const defaultListQuery = {
  item_id: null,
  item_name: null,
  status: null,
  current_page: 1,
  per_page: 5,
};

export default {
  name: "specList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true
    }
  },
  created() {
    this.getList();
  },
  watch: {},
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
    handleAddProduct() {
      this.$router.push({ path: '/pms/addSpec' });
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
      this.selectProductCateValue = [];
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
        id.push(row.item_id);
        this.updateDeleteStatus(-1, id);
      });
    },
    handleUpdateProduct(index, row) {
      this.$router.push({ path: '/pms/updateSpec', query: { id: row.item_id } });
    },
    updateDeleteStatus(deleteStatus, id) {
      let params = new URLSearchParams();
      params.append('item_id', id);
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
