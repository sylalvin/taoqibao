<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="mchntAddressForm" label-width="120px" style="width: 600px" size="small">
      <div v-for="(item, index) in value.address" :key="index">
        <!--         <el-form-item label="地址id">
          <el-input v-model="item.id" :disabled="true"></el-input>
        </el-form-item> -->
        <el-form-item label="联系人姓名：">
          <el-input v-model="item.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话：">
          <el-input v-model="item.tel"></el-input>
        </el-form-item>
        <!--         <el-form-item label="省市：" prop="province">
          <el-input v-model="item.province"></el-input>
        </el-form-item>
        <el-form-item label="城市 " prop="city">
          <el-input v-model="item.city"></el-input>
        </el-form-item>
        <el-form-item label="区县 " prop="district">
          <el-input v-model="item.district"></el-input>
        </el-form-item>
        <el-form-item label="地址 " prop="address">
          <el-input v-model="item.address"></el-input>
        </el-form-item> -->
        <el-form-item label="省市：">
          <el-select v-model="item.province" clearable filterable placeholder="请选择省份" value-key="id" @change="handleCityList">
            <el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市: " v-show="item.province ? 1 : 0">
          <el-select v-model="item.city" clearable filterable placeholder="请选择市/区" @change="handleDistrictList">
            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区县: " v-show="item.city ? 1 : 0">
          <el-select v-model="item.district" clearable filterable placeholder="请选择县/区/街道">
            <el-option v-for="item in districtList" :key="item.id" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址: " v-show="item.district ? 1 : 0">
          <el-input v-model="item.address" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item>
          <i class="el-icon-delete" @click="handleDeleteAddress(item, index)"></i>
        </el-form-item>
      </div>
      <el-form-item style="text-align: left">
        <el-button type="primary" size="medium" @click="handleAddAddress">增加地址</el-button>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商户地址信息</el-button>
        <el-button type="primary" size="medium" @click="handleNext('mchntAddressForm')">下一步，填写商户地址</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
//import {fetchListWithChildren} from '@/api/productCate'
// import {fetchList as fetchBrandList} from '@/api/brand'
import { getMchnt, deleteMchntAddress } from '@/api/mchnt';
import { GetAddress } from '@/utils/address';

export default {
  name: "MchntAddressDetail",
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        requiredProp: [{ required: true, message: '该项为必填项', trigger: 'blur' }]
      },
      provinceList: [],
      cityList: [],
      districtList: [],
    };
  },
  created() {
    this.getAddressOptions();
  },
  computed: {},
  watch: {},
  methods: {
    getAddressOptions() {
      this.provinceList = GetAddress();
    },
    handlePrev() {
      this.$emit('prevStep')
    },
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
    handleAddAddress() {
      this.value.address.push({
        name: '',
        tel: '',
        province: '',
        city: '',
        district: '',
        address: '',
      })
    },
    updateDeleteMchntAddress(deleteStatus, id) {
      let params = new URLSearchParams();
      params.append('id', id);
      params.append('deleteStatus', deleteStatus);
      deleteMchntAddress(params).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: 1000
        });
      });
    },
    handleDeleteAddress(item, index) {
      if (this.isEdit) {
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = [];
          id.push(item.id);
          this.updateDeleteMchntAddress(-1, id);
          this.value.address.splice(index, 1);
        });
      } else {
        this.value.address.splice(index, 1)
      }
    },
    handleCityList(val) {
      let obj = this.provinceList.find((i) => {
        return i.name === val;
      });
      this.cityList = obj.children;
    },
    handleDistrictList(val) {
      let obj = this.cityList.find((i) => {
        return i.name === val;
      });
      this.districtList = obj.children2;
    }
  }
}

</script>
<style scoped>
</style>
