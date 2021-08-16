<template> 
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商户信息"></el-step>
      <el-step title="填写商户地址"></el-step>
      <el-step title="填写商户专属价格"></el-step>
      <el-step title="填写商户开票信息"></el-step>
    </el-steps>
    <mchnt-info-detail v-show="showStatus[0]" v-model="mchntParam" :is-edit="isEdit" @nextStep="nextStep">
    </mchnt-info-detail>
    <mchnt-address-detail v-show="showStatus[1]" v-model="mchntParam" :is-edit="isEdit" @nextStep="nextStep" @prevStep="prevStep">
    </mchnt-address-detail>
    <mchnt-product-detail v-show="showStatus[2]" v-model="mchntParam" :is-edit="isEdit" @nextStep="nextStep" @prevStep="prevStep">
    </mchnt-product-detail>
    <mchnt-receipt-detail v-show="showStatus[3]" v-model="mchntParam" :is-edit="isEdit" @prevStep="prevStep" @finishCommit="finishCommit">
    </mchnt-receipt-detail>
  </el-card>
</template>
<script>
import MchntInfoDetail from './MchntInfoDetail';
import MchntAddressDetail from './MchntAddressDetail';
import MchntProductDetail from './MchntProductDetail';
import MchntReceiptDetail from './MchntReceiptDetail';
import { createMchnt, getMchnt, updateMchnt } from '@/api/mchnt';

const defaultMchntParam = {
  mchnt_name: null,
  mchnt_company: null,
  mchnt_mobile: null,
  frequency: null,
  sales_id: null,
  invoice_type : null,
};

export default {
  name: 'MchntDetail',
  components: { MchntInfoDetail, MchntAddressDetail, MchntProductDetail, MchntReceiptDetail },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: 0,
      mchntParam: Object.assign({}, defaultMchntParam, { address: [] }, { product: [] }),
      showStatus: [true, false, false, false]
    }
  },
  created() {
    if (this.isEdit) {
      let params = new URLSearchParams();
      params.append('mchnt_id', this.$route.query.id);
      getMchnt(params).then(response => {
        this.mchntParam = response.data;
      });
    }
//    console.log(this.mchntParam);
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
//      console.log(defaultMchntParam);
    },
    nextStep() {
      if (this.active < this.showStatus.length - 1) {
        this.active++;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
//      console.log(defaultMchntParam);
    },
    finishCommit(isEdit) {
      this.$confirm('是否要创建', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (isEdit) {
          updateMchnt(this.mchntParam).then(response => {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000
            });
            this.$router.back();
          });
        } else {
          createMchnt(this.mchntParam).then(response => {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000
            });
//            console.log(defaultMchntParam);
            this.$router.back();
  //          console.log(defaultMchntParam);
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
