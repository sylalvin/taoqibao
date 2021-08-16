<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="mchntInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="商户公司名称：" prop="mchnt_company">
        <el-input v-model="value.mchnt_company"></el-input>
      </el-form-item>
      <el-form-item label="商户称呼：" prop="mchnt_name">
        <el-input v-model="value.mchnt_name"></el-input>
      </el-form-item>
      <el-form-item label="商户电话：" prop="mchnt_mobile">
        <el-input v-model="value.mchnt_mobile"></el-input>
      </el-form-item>
      <el-form-item label="订气频率 " prop="frequency">
        <el-input v-model="value.frequency"></el-input>
      </el-form-item>
      <el-form-item label="负责销售" prop = "sales_id">
        <el-select v-model="value.sales_id" placeholder="请选择负责销售">
          <el-option v-for="item in salesOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('mchntInfoForm')">下一步，填写商户地址</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getMchnt } from '@/api/mchnt';
import {getActiveSales } from '@/api/sales';

export default {
  name: "MchntInfoDetail",
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      salesOptions: [],
      rules: {
        mchnt_company: [
          { required: true, message: '请输入商户公司名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        mchnt_name: [
          { required: true, message: '请输入商户所有人名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        mchnt_mobile: [
          { required: true, message: '请输入商户电话', trigger: 'blur' }
        ],
        frequency: [
          { required: true, message: '请输入订气频率', trigger: 'blur' }
        ],
        sales_id: [
          { required: true, message: '请输入负责销售ID', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getSalesList();
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
    getSalesList() {
      getActiveSales().then(response => {
        let list = response.data;
        this.salesOptions = [];
        for (let i = 0; i < list.length; i++) {
          this.salesOptions.push({ label: list[i].sales_name, value: list[i].sales_id });
        }
      });
    },
  }
}

</script>
<style scoped>
</style>
