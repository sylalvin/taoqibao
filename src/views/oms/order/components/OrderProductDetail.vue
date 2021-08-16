<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="mchntProductForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="回瓶数量: ">
          <el-input v-model="value.recycle_bottles"></el-input>
      </el-form-item>
      <div v-for="(item, index) in value.product" :key="index">
        <el-form-item label="商品名称: ">
          <el-select v-model="item.product_id" placeholder="请选择商品" @change="handleProductValue(item,index)" :disabled = "item.isDisabled">
            <el-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item.value" >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格: ">
          <el-input v-model="item.product_price" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品数量: ">
          <el-input v-model="item.product_quantity"></el-input>
        </el-form-item>
        <el-form-item>
          <i class="el-icon-delete" @click="handleDeleteProduct(item, index)"></i>
        </el-form-item>
      </div>
      <el-form-item style="text-align: left">
        <el-button type="primary" size="medium" @click="handleAddProduct">增加商品</el-button>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写订单商户信息</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，改价</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
//import {fetchListWithChildren} from '@/api/productCate'
import { deleteOrderProduct } from '@/api/order'
import { getMchnt } from '@/api/mchnt';
import { getActiveProduct, getProductPirce } from '@/api/product'
export default {
  name: "OrderInfoDetail",
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      productOptions: [],
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
      }
    };
  },
  created() {
    this.getProductList();
  },
  computed: {

  },
  watch: {

  },
  methods: {
    handleNext(formName) {
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     this.$emit('nextStep');
      //   } else {
      //     this.$message({
      //       message: '验证失败',
      //       type: 'error',
      //       duration: 1000
      //     });
      //     return false;
      //   }
      // });
        this.$emit('nextStep');
    },
    handlePrev() {
      this.$emit('prevStep')
    },
    handleAddProduct() {
      this.value.product.push({
        product_id: '',
        product_price: '',
        product_quantity: '',
        isDisabled: false
      })
    },
    updateDeleteOrderProduct(deleteStatus, id) {
      let params = new URLSearchParams();
      params.append('product_id', id);
      params.append('order_id', this.$route.query.id);
      params.append('deleteStatus', deleteStatus);
      deleteOrderProduct(params).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: 1000
        });
      });
    },
    handleDeleteProduct(item, index) {
      if (this.isEdit) {
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = [];
          id.push(item.product_id);
          this.updateDeleteOrderProduct(-1, id);
          this.value.product.splice(index, 1);
        });
      } else {
        this.value.product.splice(index, 1)
      }
    },
    getProductList() {
      getActiveProduct().then(response => {
        let list = response.data;
        this.productOptions = [];
        for (let i = 0; i < list.length; i++) {
          this.productOptions.push({ label: list[i].product_name, value: list[i].product_id });
        }
      });
    },
    handleProductValue(item,index){
      let params = new URLSearchParams();
      params.append('product_id', item.product_id);
      params.append('mchnt_id', this.value.mchnt_id);
      getProductPirce(params).then(response => {
        item.product_price = response.data.product_price;
      })
    }
  },
}

</script>
<style scoped>
</style>
