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
          <el-form-item label="订购公司：">
            <el-input style="width: 203px" v-model="listQuery.mchnt_company" placeholder="订购公司"></el-input>
          </el-form-item>
          <el-form-item label="订购人：">
            <el-input style="width: 203px" v-model="listQuery.mchnt_name" placeholder="订购人"></el-input>
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select v-model="listQuery.confirm_status" placeholder="全部" clearable>
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配送时间：">
            <el-date-picker v-model="listQuery.need_time" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" clearable>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="配送时段：">
            <el-select v-model="listQuery.time_slot" placeholder="选择时段" clearable>
              <el-option v-for="item in timeSlotOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" style="float: right;margin-right: 15px" @click="handleAddOrder()" size="mini">
        添加
      </el-button>
      <el-button class="btn-add" style="float: right;margin-right: 15px" @click="handleDownload()" size="mini">
        导出至Excel
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="salesTable" :data="list" style="width: 100%" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.order_id}}</template>
        </el-table-column>
        <el-table-column label="订购公司" width="120" align="center">
          <template slot-scope="scope">{{scope.row.mchnt.mchnt_company}}</template>
        </el-table-column>
        <el-table-column label="订购客户" width="120" align="center">
          <template slot-scope="scope">{{scope.row.mchnt.mchnt_name}}</template>
        </el-table-column>
        <el-table-column label="订购地址" align="center">
          <template slot-scope="scope">{{scope.row.province}} {{scope.row.city}} {{scope.row.district}} {{scope.row.address}}</template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.confirm_status == 0">待处理</span>
            <span v-if="scope.row.confirm_status == 1">已处理/待支付</span>
            <span v-if="scope.row.confirm_status == 2">已支付/待配送</span>
            <span v-if="scope.row.confirm_status == 3">已配送/待核单</span>
            <span v-if="scope.row.confirm_status == 4">已关闭</span>
            <span v-if="scope.row.confirm_status == 5">已核单</span>
          </template>
        </el-table-column>
        <el-table-column label="订单具体情况" width="400" align="center">
          <template slot-scope="scope">
            <span v-for="data in scope.row.detail">
              <p>商品名称: {{data.product.product_name}} 订单价格: {{data.product_price}} 订单数量: {{data.product_quantity}}</p>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="回瓶数量" width="120" align="center">
          <template slot-scope="scope">{{scope.row.recycle_bottles}}</template>
        </el-table-column>
        <el-table-column label="配送日期" width="120" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.need_time}}</p>
            <p>
              <span v-if="scope.row.time_slot == 1">上午</span>
              <span v-if="scope.row.time_slot == 2">下午</span>
            </p>
          </template>
        </el-table-column>
        <!--         <el-table-column label="配送时段" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.time_slot == 1">上午</span>
            <span v-if="scope.row.time_slot == 2">下午</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleUpdateOrder(scope.$index, scope.row)">编辑
              </el-button>
              <!-- 关闭订单功能不开放 -->
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">关闭
              </el-button>
            </p>
            <p>
              <el-button size="mini" @click="handleDeliver(scope.$index, scope.row)">派送
              </el-button>
              <el-button size="mini" @click="handleConfirm(scope.$index, scope.row)">核单
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
  updateConfirmStatus,
  fetchListForExcel
} from '@/api/order'
import { formatDate } from '@/utils/index';
//parameter
const defaultListQuery = {
  current_page: 1,
  per_page: 5
};

export default {
  name: "orderList",
  data() {
    return {
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx',
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      statusOptions: [{
        value: 0,
        label: '未处理'
      }, {
        value: 1,
        label: '已处理/待支付'
      }, {
        value: 2,
        label: '已支付/待配送'
      }, {
        value: 3,
        label: '已配送/待核单'
      }, {
        value: 4,
        label: '已关闭'
      }, {
        value: 5,
        label: '已核单'
      }],
      timeSlotOptions: [{
        value: 1,
        label: '上午'
      }, {
        value: 2,
        label: '下午'
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
    handleAddOrder() {
      this.$router.push({ path: '/oms/addOrder' });
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
      if (row.confirm_status != 0 && row.confirm_status != 1) {
        this.$message({
          message: '不可更改',
          type: 'warning',
          duration: 1000
        });
      } else {
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = [];
          id.push(row.order_id);
          this.updateConfirmStatus(4, id);
        });
      }
    },
    handleUpdateOrder(index, row) {
      if (row.confirm_status != 0 && row.confirm_status != 1) {
        this.$message({
          message: '不可更改',
          type: 'warning',
          duration: 1000
        });
      } else {
        this.$router.push({ path: '/oms/updateOrder', query: { id: row.order_id } });
      }
    },
    handleDeliver(index, row) {
      if (row.confirm_status != 2) {
        this.$message({
          message: '请确认订单状态',
          type: 'warning',
          duration: 1000
        });
      } else {
        this.$confirm('是否要已经配送?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = [];
          id.push(row.order_id);
          this.updateConfirmStatus(3, id);
        });
      }
    },
    handleConfirm(index, row) {
      if (row.confirm_status != 3) {
        this.$message({
          message: '请确认订单状态',
          type: 'warning',
          duration: 1000
        });
      } else {
        this.$confirm('是否要确认核单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = [];
          id.push(row.order_id);
          this.updateConfirmStatus(5, id);
        });
      }
    },
    updateConfirmStatus(confirmStatus, id) {
      let params = new URLSearchParams();
      params.append('order_id', id);
      params.append('confirm_status', confirmStatus);
      updateConfirmStatus(params).then(response => {
        this.$message({
          message: response.message,
          type: 'success',
          duration: 1000
        });
      });
      this.getList();
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['订单编号', '订购公司', '订购地址', '联系人姓名', '联系人电话', '订单详情', '配送时间', '配送时段']
        const filterVal = ['order_id', 'mchnt_company', 'mchnt_address', 'mchnt_name', 'mchnt_mobile', 'order_detail', 'need_time', 'time_slot']
        fetchListForExcel(this.listQuery).then(response => {
          const excelList = response.data;
          // console.log(response.data);
          // console.log(excelList);
          const data = this.formatJson(filterVal, excelList)
          let date = new Date();
          //          console.log(date);
          this.filename = formatDate(date, 'yyyy-MM-dd hh:mm:ss');
          //          console.log(this.filename);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}

</script>
<style></style>
