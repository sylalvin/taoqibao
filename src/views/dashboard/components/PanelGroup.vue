<template>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetBarChartData('newMchntSevenDay')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              近七日新增商户
            </div>
            <count-to :start-val="0" :end-val="numOfNewMchntSevenDay" :duration="2000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetBarChartData('amountNewOrderSevenDay')">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              近七日新增订单<br />(销售额)
            </div>
            <count-to :start-val="0" :end-val="amountNewOrderSevenDay" :duration="2000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetBarChartData('newMchntBySalesSevenDay')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              近七日销售表现 <br />(新增客户数)
            </div>
            <count-to :start-val="0" :end-val="numOfNewMchntSevenDay" :duration="2000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
</template>
<script>
import CountTo from 'vue-count-to'
import { totalMchntSevenDay } from '@/api/mchnt'
import { totalAmountOrderSevenDay } from '@/api/order'
export default {
  components: {
    CountTo
  },
  created() {
    this.handleSetEndVal('newMchntSevenDay');
    this.handleSetEndVal('amountNewOrderSevenDay');
  },
  data() {
    return {
      //lineChartData: lineChartData.newVisitis,
      numOfNewMchntSevenDay: 0,
      amountNewOrderSevenDay: 0.00,
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    handleSetBarChartData(type) {
      this.$emit('handleSetBarChartData', type)
    },
    handleSetEndVal(type) {
      if (type == 'newMchntSevenDay') {
        totalMchntSevenDay().then(response => {
          this.numOfNewMchntSevenDay = response.data;
        });
      } else if (type == 'amountNewOrderSevenDay') {
//        console.log("else if ");
        totalAmountOrderSevenDay().then(response => {
          this.amountNewOrderSevenDay = parseFloat(response.data);
         // console.log(response.data);
        });
      } else {
        totalMchntSevenDay().then(response => {
          this.numOfNewMchntSevenDay = response.data;
        });
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-top: 18px;
    margin-bottom: 18px;
    margin-left: 18px;
    margin-right: 18px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}

</style>
