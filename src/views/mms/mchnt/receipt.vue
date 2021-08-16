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
          <el-form-item label="订购公司名称: ">
            <el-select v-model="listQuery.mchnt_id" filterable placeholder="请选择订购公司">
              <el-option v-for="item in mchntCompanyOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开票状态: ">
            <el-select v-model="listQuery.receipt_status" placeholder="未开票">
              <el-option v-for="item in receiptOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="mchntTable" :data="list" style="width: 100%" v-loading="listLoading" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="发票编号" width="100" align="center">
          <template slot-scope="scope" v-if="scope.row.invoice_id != null">{{scope.row.invoice_id}}</template>
          <template slot-scope="scope" v-else>NA</template>
        </el-table-column>
        <!-- <el-table-column label="商户编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.mchnt_id}}</template>
        </el-table-column> -->
        <el-table-column label="订单编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.order_id}}</template>
        </el-table-column>
        <el-table-column label="商户名" width="120" align="center">
          <template slot-scope="scope">{{scope.row.mchnt_company}}</template>
        </el-table-column>
       <!--  <el-table-column label="发票类型" width="120" align="center">
          <template slot-scope="scope" v-if="scope.row.invoice_type == 0">不开票</template>
          <template slot-scope="scope" v-if="scope.row.invoice_type == 1">普票</template>
          <template slot-scope="scope" v-if="scope.row.invoice_type == 2">专票</template>
        </el-table-column> -->
        <!-- <el-table-column label="发票抬头" width="120" align="center">
          <template slot-scope="scope" v-if="scope.row.invoice_type == 0">{{scope.row.invoice_title}}</template>
          <template slot-scope="scope" v-if="scope.row.invoice_type == 1">
            <p>
              名称：{{scope.row.invoice_title}}
            </p>
            <p>
              纳税人识别号：{{scope.row.invoice_tin}}
            </p>
          </template>
          <template slot-scope="scope" v-if="scope.row.invoice_type == 2">
            <p>
              名称：{{scope.row.invoice_title}}
            </p>
            <p>
              纳税人识别号：{{scope.row.invoice_tin}}
            </p>
            <p>地址,电话：{{scope.row.invoice_address}} {{scope.row.invoice_mobile}}
            </p>
            <p>
              开户行及账号：{{scope.row.invoice_bank}} {{scope.row.invoice_bank_acct}}
            </p>
          </template>
        </el-table-column> -->
        <el-table-column label="开票金额" width="120" align="center">
          <template slot-scope="scope">{{scope.row.invoice_amount}}</template>
        </el-table-column>
        <!-- <el-table-column label="订单编号" width="120" align="center">
          <template slot-scope="scope">{{scope.row.mchnt_name}}</template>
        </el-table-column>
        <el-table-column label="订单详情" width="120" align="center">
          <template slot-scope="scope">{{scope.row.mchnt_mobile}}</template>
        </el-table-column> -->
        <el-table-column label="是否开票" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.receipt_status == 0">未开票</span>
            <span v-else>已开票</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleCreateReceipt(scope.$index, scope.row)">开票
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量操作">
        <el-option v-for="item in operates" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left: 20px" class="search-button" @click="handleBatchOperate()" type="primary" size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.per_page" :page-sizes="[5,10,15]" :current-page.sync="listQuery.current_page" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {
  updateDeleteStatus,
  getAllMchnt
} from '@/api/mchnt'
import { fetchListReceipt, createReceipt } from '@/api/order'
//parameter
const defaultListQuery = {
  mchnt_id: null,
  current_page: 1,
  per_page: 5,
  status: null,
  receipt_status: 0,
};

export default {
  name: "receiptList",
  data() {
    return {
      operates: [{
        label: "开票",
        value: "createReceipt"
      }, ],
      operateType: null,
      mchntCompanyOptions: [],
      receiptOptions: [{
        value: 0,
        label: '未开票'
      }, {
        value: 1,
        label: '已开票'
      }],
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      multipleSelection: [],
    }
  },
  created() {
    //this.getList();
    this.getCompanyList();
  },
  watch: {

  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchListReceipt(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.data;
        this.total = response.data.total;
      });
    },
    handleSearchList() {
      this.listQuery.current_page = 1;
      this.getList();
    },
    // handleAddMchnt() {
    //   this.$router.push({ path: '/mms/addMchnt' });
    // },
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
    handleCreateReceipt(index, row) {
      this.$confirm('是否要进行开票操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let order_id = [];
        order_id.push(row.order_id);
        let mchnt_id = [];
        mchnt_id.push(row.mchnt_id);
        this.createReceipt(order_id, mchnt_id);
      });
    },
    createReceipt(order_id, mchnt_id) {
      let params = new URLSearchParams();
      params.append('order_id', order_id);
      params.append('mchnt_id', mchnt_id);
      createReceipt(params).then(response => {
        this.$message({
          message: '开票成功',
          type: 'success',
          duration: 1000
        });
        this.getList();
      });
    },
    getCompanyList() {
      getAllMchnt().then(response => {
        let list = response.data;
        this.mchntCompanyOptions = [];
        for (let i = 0; i < list.length; i++) {
          this.mchntCompanyOptions.push({ label: list[i].mchnt_company, value: list[i].mchnt_id });
        }
      });
    },
    handleBatchOperate() {
      if (this.operateType == null) {
        this.$message({
          message: '请选择操作类型',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: '请选择要操作的商品',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      this.$confirm('是否要进行该批量操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let order_ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          order_ids.push(this.multipleSelection[i].order_id);
        }
        let mchnt_id = [];
        mchnt_id.push(this.multipleSelection[0].mchnt_id);
        switch (this.operateType) {
          case this.operates[0].value:
            this.createReceipt(order_ids, mchnt_id);
            break;
          default:
            break;
        }
        this.getList();
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  }
}

</script>
<style></style>
