<template>
  <div class="dashboard-container">
    <panel-group-today @handleRefresh="handleRefresh" />
    <panel-group @handleSetBarChartData="handleSetBarChartData" />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <!--  <line-chart :chart-data="lineChartData" /> -->
      <bar-chart :chart-data="barChartData" />
    </el-row>
  </div>
</template>
<script>
//import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import PanelGroupToday from './components/PanelGroupToday'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import { newMchntsSevenDay } from '@/api/mchnt'
import { amountNewOrderSevenDay } from '@/api/order'
import { newMchntBySalesSevenDay } from '@/api/sales'


export default {
  name: 'Dashboard',
  components: {
    PanelGroupToday,
    PanelGroup,
    LineChart,
    BarChart
  },
  barChartData: {
    xAxis: [{
      type: '',
      data: [],
      axisTick: {
        alignWithLabel: true
      }
    }],
    yAxis: [{
      type: '',
      axisTick: {
        show: false
      }
    }],
    series: [{
      name: '',
      type: '',
      stack: '',
      barWidth: '60%',
      data: [],
      //animationDuration
    }]
  },
  data() {
    return {
      //lineChartData: lineChartData.newVisitis,
      barChartData: null,
      xAxisData: [],
      seriesData: []
    }
  },
  created() {
    this.handleSetBarChartData('newMchntSevenDay');
    this.handleRefresh();
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    handleSetBarChartData(type) {
      if (type == 'newMchntSevenDay') {
        newMchntsSevenDay().then(response => {
          this.xAxisData = response.data.date;
          this.seriesData = response.data.count;
          this.barChartData = {
            xAxis: [{
              type: 'category',
              data: this.xAxisData,
              axisTick: {
                alignWithLabel: true
              }
            }],
            yAxis: [{
              type: 'value',
              axisTick: {
                show: false
              }
            }],
            series: [{
              name: 'pageA',
              type: 'bar',
              stack: 'vistors',
              barWidth: '60%',
              data: this.seriesData,
              //animationDuration
            }]
          }
        });
      } else if (type == 'amountNewOrderSevenDay') {
        amountNewOrderSevenDay().then(response => {
          this.xAxisData = response.data.date;
          this.seriesData = response.data.amount;
          this.barChartData = {
            grid: {
              left: 10,
              right: 10,
              bottom: 20,
              top: 30,
              containLabel: true
            },
            xAxis: [{
              type: 'category',
              data: this.xAxisData,
              axisTick: {
                alignWithLabel: true
              }
            }],
            yAxis: [{
              type: 'value',
              axisTick: {
                show: false
              }
            }],
            series: [{
              name: 'pageA',
              type: 'bar',
              stack: 'vistors',
              barWidth: '60%',
              data: this.seriesData,
              //animationDuration
            }]
          }
        });
      } else if (type == 'newMchntBySalesSevenDay') {
        newMchntBySalesSevenDay().then(response => {
          this.xAxisData = response.data.sales_name;
          this.seriesData = response.data.count;
          this.barChartData = {
            xAxis: [{
              type: 'category',
              data: this.xAxisData,
              axisTick: {
                alignWithLabel: true
              }
            }],
            yAxis: [{
              type: 'value',
              axisTick: {
                show: false
              }
            }],
            series: [{
              name: 'pageA',
              type: 'bar',
              stack: 'vistors',
              barWidth: '60%',
              data: this.seriesData,
              //animationDuration
            }]
          }
        });
      }
    },
    handleRefresh(){

    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

</style>
