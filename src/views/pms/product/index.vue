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
          <el-form-item label="产品名称：">
            <el-input style="width: 203px" v-model="listQuery.product_name" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="产品状态：">
            <el-select v-model="listQuery.status" placeholder="上架" clearable>
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
      <el-button class="btn-add" style="float: right;margin-right: 15px" @click="handleAddProduct()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.product_id}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.product_pic"></template>
        </el-table-column>
        <el-table-column label="商品名称" width="200" align="center">
          <template slot-scope="scope">{{scope.row.product_name}}</template>
        </el-table-column>
        <el-table-column label="价格" width="120" align="center">
          <template slot-scope="scope">价格：￥{{scope.row.product_price}}</template>
        </el-table-column>
        <el-table-column label="指导价" width="120" align="center">
          <template slot-scope="scope">指导价：￥{{scope.row.guiding_price}}</template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">{{scope.row.product_content}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
            <p>
              <el-button size="mini" @click="handleProductRelation(scope.$index, scope.row)">绑定关系/标签
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
} from '@/api/product'


//fetch list parameter
const defaultListQuery = {
  product_id: null,
  product_name: null,
  status: null,
  current_page: 1,
  per_page: 5,
};

export default {
  name: "productList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      statusOptions: [{
        value: 0,
        label: '上架'
      }, {
        value: -1,
        label: '下架'
      }]
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
      this.$router.push({ path: '/pms/addProduct' });
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
        id.push(row.product_id);
        this.updateDeleteStatus(-1, id);
      });
    },
    handleUpdateProduct(index, row) {
      this.$router.push({ path: '/pms/updateProduct', query: { id: row.product_id } });
    },
    updateDeleteStatus(deleteStatus, id) {
      let params = new URLSearchParams();
      params.append('product_id', id);
      params.append('deleteStatus', deleteStatus);
      updateDeleteStatus(params).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: 1000
        });
        this.getList();
      });
    },
    handleProductRelation(index,row){
      this.$router.push({ path: '/pms/editRelation', query: { id: row.product_id } });
    }
  }
}

</script>
<style></style>
