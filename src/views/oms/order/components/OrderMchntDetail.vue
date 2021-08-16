<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="OrderMchntForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="订购公司名称: ">
        <el-select v-model="value.mchnt_id" placeholder="请选择订购公司" v-bind:disabled="isEdit==false?false:true">
          <el-option v-for="item in mchntCompanyOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订购地址: ">
        <el-select v-model="addressValue" placeholder="请选择订购地址">
          <el-option v-for="item in mchntAddressOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="配送时间: ">
        <el-date-picker v-model="value.need_time" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions1">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="配送时段: ">
        <el-select v-model="value.time_slot" placeholder="选择时段">
          <el-option v-for="item in timeSlotOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('OrderMchntForm')">下一步，填写订单内容</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getOrder } from '@/api/order';
import { getAllMchnt, getMchntAddress, getAddressDetail, getMchnt, getMchntAddressId } from '@/api/mchnt';

export default {
  name: "OrderMchntDetail",
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
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      hasEditCreated: false,
      mchntAddressOptions: [],
      mchntCompanyOptions: [],
      addressValue: '',
      timeSlotOptions: [{
        value: 1,
        label: '上午'
      }, {
        value: 2,
        label: '下午'
      }]
    };
  },
  created() {
    this.getCompanyList();
  },
  computed: {
    mchnt_id() {
      return this.value.mchnt_id;
    },
  },
  watch: {
    //if mchnt_id changed, get the according address options
    mchnt_id: function(newValue, oldValue) {
      //if oldValue == null, then first time change, do not need to change the value
//      console.log(newValue);
  //    console.log(oldValue);
      if (oldValue == null) {
//        console.log("enter if");
        if (this.isEdit) {
          let params = new URLSearchParams();
          params.append('mchnt_id', this.value.mchnt_id);
          params.append('province', this.value.province);
          params.append('city', this.value.city);
          params.append('district', this.value.district);
          params.append('address', this.value.address);
          getMchntAddressId(params).then(response => {
            this.addressValue = response.data;
//            console.log(this.addressValue);
          });
        } else {
          this.addressValue = null;
        }
      } else {
        this.mchntAddressOptions = [];
        this.addressValue = null;
        this.value.province = null;
        this.value.city = null;
        this.value.district = null;
        this.value.address = null;
      }
      //console.log(newValue);
      getMchntAddress(newValue).then(response => {
        let list = response.data;
        this.mchntAddressOptions = [];
        for (let i = 0; i < list.length; i++) {
          const label = list[i].province + list[i].city + list[i].district + list[i].address;
          this.mchntAddressOptions.push({ label: label, value: list[i].id });
        }
        if (this.addressValue == 0) {
          const label = this.value.province + this.value.city + this.value.district + this.value.address;
          this.mchntAddressOptions.push({ label: label, value: 0 });
        }
      });
    },
  },
  methods: {
    setAddressValue() {
      let params = new URLSearchParams();
      params.append('id', this.addressValue);
      getAddressDetail(params).then(response => {
//        console.log("enter");
        this.value.province = response.data.province;
        this.value.city = response.data.city;
        this.value.district = response.data.district;
        this.value.address = response.data.address;
      });
    },
    handleNext(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            //order product data gather from parent
          } else {
            //gather mchnt deafualt price
            let params = new URLSearchParams();
            params.append('mchnt_id', this.value.mchnt_id);
            getMchnt(params).then(response => {
              this.value.product = response.data.product;
              this.value.sales_id = response.data.sales_id;
            });
          }
          this.setAddressValue();
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
    getCompanyList() {
      getAllMchnt().then(response => {
        let list = response.data;
        this.mchntCompanyOptions = [];
        for (let i = 0; i < list.length; i++) {
          this.mchntCompanyOptions.push({ label: list[i].mchnt_company, value: list[i].mchnt_id });
        }
      });
    },
  }
}

</script>
<style scoped>
</style>
