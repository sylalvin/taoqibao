<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="OrderAccountForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="总价: ">
        <el-input v-model="totalPrice"></el-input>
      </el-form-item>
      <el-form-item label="改价: ">
        <el-input v-model="value.amount_receive"> </el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handlePrev">上一步，填写订单内容</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getOrder } from '@/api/order';

export default {
  name: "OrderAccountDetail",
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    };
  },
  created() {

  },
  computed: {
    totalPrice() {
      let total = 0;
      var item;
      for (let i = 0; i < this.value.product.length; i++) {
        total = total + this.value.product[i].product_price * this.value.product[i].product_quantity;
      }
      if(!this.isEdit){
        this.value.amount_receive = total;
      }
      return parseFloat(total).toFixed(2);
    }
  },
  watch: {

  },
  methods: {
    handleFinishCommit() {
      this.$emit('finishCommit', this.isEdit);
    },
    handlePrev() {
      this.$emit('prevStep');
    },
  }
}

</script>
<style scoped>
</style>
