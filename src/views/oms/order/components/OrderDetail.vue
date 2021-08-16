<template> 
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写订购商户"></el-step>
      <el-step title="填写订单内容"></el-step>
      <el-step title="改价"></el-step>
    </el-steps>
    <order-mchnt-detail v-show="showStatus[0]" v-model="orderParam" :is-edit="isEdit" @nextStep="nextStep">
    </order-mchnt-detail>
    <order-product-detail v-show="showStatus[1]" v-model="orderParam" :is-edit="isEdit" @prevStep="prevStep" @nextStep="nextStep">
    </order-product-detail>
    <order-account-detail v-show="showStatus[2]" v-model="orderParam" :is-edit="isEdit" @prevStep="prevStep" @finishCommit="finishCommit">
    </order-account-detail>
  </el-card>
</template>
<script>
import OrderMchntDetail from './OrderMchntDetail';
import OrderProductDetail from './OrderProductDetail';
import OrderAccountDetail from './OrderAccountDetail';
import { createOrder, getOrder, updateOrder } from '@/api/order';

const defaultOrderParam = {
  mchnt_id: null,
  sales_id: null,
  code: null,
  province: null,
  city: null,
  district: null,
  address: null,
  amount_receive: null,
  product: [],
};
export default {
  name: 'OrderDetail',
  components: { OrderMchntDetail, OrderProductDetail, OrderAccountDetail },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: 0,
      orderParam: Object.assign({}, defaultOrderParam),
      showStatus: [true, false, false, false]
    }
  },
  created() {
    if (this.isEdit) {
      let params = new URLSearchParams();
      params.append('order_id', this.$route.query.id);
      getOrder(params).then(response => {
        this.orderParam = response.data;
      });
    }
  },
  methods: {
    hideAll() {
      for (let i = 0; i < this.showStatus.length; i++) {
        this.showStatus[i] = false;
      }
    },
    prevStep() {
      if (this.active > 0 && this.active < this.showStatus.length) {
        this.active--;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    nextStep() {
      if (this.active < this.showStatus.length - 1) {
        this.active++;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    finishCommit(isEdit) {
      this.$confirm('是否要创建', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (isEdit) {
          updateOrder(this.$route.query.id, this.orderParam).then(response => {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000
            });
            this.$router.back();
          });
        } else {
          createOrder(this.orderParam).then(response => {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000
            });
            this.$router.back();
          });
        }
      })
    }
  }
}

</script>
<style>
.form-container {
  width: 800px;
}

</style>
