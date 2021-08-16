<template> 
  <el-card class="form-container" shadow="never">
    <span>筛选搜索</span>
    <template>
      <div style="margin-top: 50px">
        <el-form :model="salesParam" :rules="rules" ref="salesForm" label-width="120px" style="width: 600px" size="small">
          <el-form-item label="销售姓名：" prop="sales_name">
            <el-input v-model="salesParam.sales_name"></el-input>
          </el-form-item>
          <el-form-item label="销售电话：" prop="sales_mobile">
            <el-input v-model="salesParam.sales_mobile"></el-input>
          </el-form-item>
          <el-form-item label="销售等级: " prop="sales_level">
            <el-select v-model="salesParam.is_leader" placeholder="选择销售等级">
              <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" size="medium" @click="handleCommit('salesForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </el-card>
</template>
<script>
import { createSales, getSales, updateSales } from '@/api/sales';
const defaultSalesParam = {
  sales_id: '',
  sales_name: '',
  sales_mobile: '',
  is_leader: '',
};
export default {
  name: "SalesDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      salesParam: Object.assign({}, defaultSalesParam),
      hasEditCreated: false,
      levelOptions: [{value: 0,
                      label: '普通销售'},{
                      value: 1,
                      label: '高级销售'  
                      }],
      rules: {
        sales_name: [
          { required: true, message: '请输入销售名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        sales_mobile: [{ required: true, message: '请输入销售手机', trigger: 'blur' }],
        is_leader: [{ required: true, message: '请选择销售等级', trigger: 'blur' }],
        requiredProp: [{ required: true, message: '该项为必填项', trigger: 'blur' }]
      }
    };
  },
  created() {
    if (this.isEdit) {
      let params = new URLSearchParams();
      params.append('sales_id', this.$route.query.id);
      getSales(params).then(response => {
        this.salesParam = response.data;
      });
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    handleCommit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handlePost(this.isEdit);
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
    handlePost(isEdit) {
      this.$confirm('是否要提交该销售信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (isEdit) {
          updateSales(this.salesParam)
            .then(response => {
              this.$message({
                type: 'success',
                message: '提交成功',
                duration: 1000
              });
              this.$router.back();
            });
        } else {
          createSales(this.salesParam).then(response => {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000
            });
            this.$router.back();
          });
        }
      })
    },
  }
}

</script>
<style>
.form-container {
  width: 800px;
}

</style>
