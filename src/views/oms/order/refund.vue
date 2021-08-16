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
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="salesTable" :data="list" style="width: 100%" v-loading="listLoading" border>
        <el-table-column label="订单编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.order_id}}</template>
        </el-table-column>
        <el-table-column label="订购公司" width="120" align="center">
          <template slot-scope="scope">{{scope.row.mchnt_company}}</template>
        </el-table-column>
        <el-table-column label="退款类型" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.refundment == 0">原路退回</span>
            <span v-if="scope.row.refundment == 1">手动处理</span>
          </template>
        </el-table-column>
        <el-table-column label="申请原因" align="center">
          <template slot-scope="scope">{{scope.row.refund_reason}}</template>
        </el-table-column>
        <el-table-column label="退款金额" width="120" align="center">
          <template slot-scope="scope">{{scope.row.price}}
          </template>
        </el-table-column>
        <el-table-column label="退款说明" width="120" align="center">
          <template slot-scope="scope">{{scope.row.refund_summary}}
          </template>
        </el-table-column>
        <el-table-column label="退款进度" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">待内勤审核</span>
            <span v-if="scope.row.status == 1">待销售审核</span>
            <span v-if="scope.row.status == 2">待销售组长审核</span>
            <!--<span v-if="scope.row.status == 3">已完成</span>
            <span v-if="scope.row.status == 5">已关闭</span>
            <span v-if="scope.row.status == 4">{{scope.row.confirm_status}}</span>-->
            <span v-if="scope.row.status == 3">{{scope.row.confirm_status}}</span>
            <span v-if="scope.row.status == 4">{{scope.row.confirm_status}}</span>
            <span v-if="scope.row.status == 5">已关闭</span>
          </template>
        </el-table-column>
        <el-table-column label="退款时间" width="120" align="center">
          <template slot-scope="scope">{{scope.row.created_at}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleApprove(scope.$index, scope.row)">审批
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
    <el-dialog title="审批" :visible.sync="dialogVisible" width="30%">
      <el-form :model="approve" :rules="rules" ref="approveForm" label-width="150px" size="small">
        <el-form-item label="是否批准退款：" prop="is_approved">
          <el-radio-group v-model="approve.is_approved">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="approve.remark"></el-input>
        </el-form-item>
        <el-form-item label="拒绝原因" v-if="approve.is_approved==0" prop = "refuse_reason">
          <el-input v-model="approve.refuse_reason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchListForRefund,
  updateApproveStatus,
} from '@/api/order'
import { formatDate } from '@/utils/index';
//parameter
const defaultListQuery = {
  current_page: 1,
  per_page: 5
};
const defaultApprove = {
  id: null,
  order_id: null,
  is_approved: null,
  remark: null,
};
export default {
  name: "orderList",
  data() {
    return {
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      dialogVisible: false,
      refund_order_id: null,
      approve: Object.assign({}, defaultApprove),
      rules: {
        is_approved: [
          { required: true, message: '请确认是否批准', trigger: 'blur' },
        ],
        remark: [
          { required: true, message: '请填写备注', trigger: 'blur' },
        ],
        refuse_reason: [
          { required: true, message: '请填写拒绝原因', trigger: 'blur' },
        ]
      },
      statusOptions: [{
        value: 0,
        label: '待内勤审核'
      }, {
        value: 1,
        label: '待销售审核'
      }, {
        value: 2,
        label: '待销售组长审核'
      }, {
        value: 3,
        label: '已完成'
      }, {
        value: 4,
        label: '已拒绝'
      }, {
        value: 5,
        label: '已关闭'
      }],
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
      fetchListForRefund(this.listQuery).then(response => {
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
    handleApprove(index, row) {
      this.approve.refund_order_id = row.id;
      this.approve.order_id = row.order_id;
      this.dialogVisible = true;
    },
    handleDialogConfirm() {
      this.$refs['approveForm'].validate((valid) => {
        if (valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = new URLSearchParams();
            params.append('id', this.approve.refund_order_id);
            params.append('order_id', this.approve.order_id);
            params.append('is_approved', this.approve.is_approved);
            params.append('remark', this.approve.remark);
            updateApproveStatus(params).then(response => {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.dialogVisible = false;
              this.getList();
            })
          })
        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000
          });
          return false;
        }
      });
    },
  },
}

</script>
<style></style>
