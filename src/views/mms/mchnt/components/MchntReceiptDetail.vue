<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="mchntReceiptForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="发票类型">
        <el-select v-model="value.invoice_type" placeholder="请选择发票类型">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <div v-if="value.invoice_type !== 0 && value.invoice_type !== null ">
        <el-form-item label="开票公司名">
          <el-input v-model="value.invoice_company"></el-input>
        </el-form-item>
        <el-form-item label="税号">
          <el-input v-model="value.invoice_tin"></el-input>
        </el-form-item>
      </div>
      <div v-if="value.invoice_type === 2">
        <el-form-item label="地址">
          <el-input v-model="value.invoice_address"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="value.invoice_mobile"></el-input>
        </el-form-item>
        <el-form-item label="开户行">
          <el-input v-model="value.invoice_bank"></el-input>
        </el-form-item>
        <el-form-item label="银行账号">
          <el-input v-model="value.invoice_bank_acct"></el-input>
        </el-form-item>
      </div>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写订单商品信息</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getMchnt, deleteMchntProduct } from '@/api/mchnt';
import { getActiveProduct } from '@/api/product';
export default {
  name: "MchntReceiptDetail",
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      typeOptions: [{
        value: 0,
        label: '不设置'
      }, {
        value: 1,
        label: '普票'
      }, {
        value: 2,
        label: '专票'
      }],
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
      }
    };
  },
  created() {
    // this.getProductList();
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
    // handleAddReceipt() {
    //   console.log(this.value.receipt_info);
    //   this.value.receipt_info.push({
    //     id: '',
    //     type: '',
    //     company: '',
    //     tin: '',
    //     address: '',
    //     mobile: '',
    //     bank: '',
    //     bank_acct: ''
    //   })
    // },
    // updateDeleteMchntProduct(deleteStatus, id) {
    //   let params = new URLSearchParams();
    //   params.append('product_id', id);
    //   params.append('mchnt_id', this.$route.query.id);
    //   params.append('deleteStatus', deleteStatus);
    //   deleteMchntProduct(params).then(response => {
    //     this.$message({
    //       message: '删除成功',
    //       type: 'success',
    //       duration: 1000
    //     });
    //   });
    // },
    // handleDeleteProduct(item, index) {
    //   if (this.isEdit) {
    //     this.$confirm('是否要进行删除操作?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       let id = [];
    //       id.push(item.product_id);
    //       this.updateDeleteMchntProduct(-1, id);
    //       this.value.product.splice(index, 1);
    //     });
    //   } else {
    //     this.value.product.splice(index, 1)
    //   }
    // },
  }
}

</script>
<style scoped>
</style>
