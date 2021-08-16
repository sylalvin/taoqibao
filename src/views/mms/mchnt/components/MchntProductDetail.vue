<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="mchntProductForm" label-width="120px" style="width: 600px" size="small">
      <div v-for="(item, index) in value.product" :key="index">
        <el-form-item label="商品名称">
          <el-select v-model="item.product_id" placeholder="请选择商品">
            <el-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="item.product_price"></el-input>
        </el-form-item>
        <el-form-item>
          <i class="el-icon-delete" @click="handleDeleteProduct(item, index)"></i>
        </el-form-item>
      </div>
      <el-form-item style="text-align: left">
        <el-button size="medium" @click="handleAddProduct">添加</el-button>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写订单商品信息</el-button>
        <el-button type="primary" size="medium" @click="handleNext('mchntProductForm')">下一步，填写开票信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getMchnt, deleteMchntProduct } from '@/api/mchnt';
import { getActiveProduct } from '@/api/product';
export default {
  name: "MchntProductDetail",
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultPrice: '',
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
  computed: {},
  watch: {},
  methods: {
    handleNext(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('nextStep');
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
    handlePrev() {
      this.$emit('prevStep')
    },
    handleFinishCommit() {
      this.$emit('finishCommit', this.isEdit);
    },
    handleAddProduct() {
      this.value.product.push({
        product_id: '',
        product_price: ''
      })
    },
    updateDeleteMchntProduct(deleteStatus, id) {
      let params = new URLSearchParams();
      params.append('product_id', id);
      params.append('mchnt_id', this.$route.query.id);
      params.append('deleteStatus', deleteStatus);
      deleteMchntProduct(params).then(response => {
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
          this.updateDeleteMchntProduct(-1, id);
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
  }
}

</script>
<style scoped>
</style>
