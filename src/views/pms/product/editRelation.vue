<template>
  <div style="margin-top: 50px; margin-left: 50px">
    <el-form :model="value" ref="productRelationForm" label-width="120px" style="width: 680px" size="small" :inline="true">
      <el-form-item label="关联产品：">
        <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入专题名称" v-model="selectProduct" :titles="subjectTitles" :data="productList">
        </el-transfer>
      </el-form-item>
      <div v-for="(item, index) in specInfo">
        <el-form-item :label="item.type">
          <el-select v-model="item.spec" filterable allow-create :placeholder="item.type" value-key="group_id">
            <el-option v-for="item in item.specOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getActiveProduct, updateRelationAndLabel, getRelation, getSpec } from '@/api/product';

export default {
  name: "ProductRelation",
  props: {
    value: Object,
  },
  data() {
    return {
      //所有专题列表
      productList: [],
      productRelationList: [],
      //专题左右标题
      subjectTitles: ['待选择', '已选择'],
      specInfo: [],
      specData: [],
    };
  },
  created() {
    this.getProductList();
    this.getRelationList();
    this.getSpec();
  },
  computed: {
    //选中的专题
    selectProduct: {
      get: function() {
        //        console.log("called");
        let products = [];
        if (this.productRelationList == null || this.productRelationList.length <= 0) {
          return products;
        }
        for (let i = 0; i < this.productRelationList.length; i++) {
          //         console.log("pushed in products");
          if(!isNaN(this.productRelationList[i])) {
            products.push(parseInt(this.productRelationList[i]));
          }
        }
        //        console.log(products);
        return products;
      },
      set: function(newValue) {
        console.log(newValue);
        //       console.log("setter called");
        this.productRelationList = [];
        for (let i = 0; i < newValue.length; i++) {
          if(!isNaN(newValue[i])) {
            this.productRelationList.push(newValue[i]);
          }
        }
      }
    },
  },
  methods: {
    filterMethod(query, item) {
      return item.label.indexOf(query) > -1;
    },
    getProductList() {
      getActiveProduct().then(response => {
        let list = response.data;
        console.log(list)
        for (let i = 0; i < list.length; i++) {
          this.productList.push({
            label: list[i].product_name,
            key: list[i].product_id
          });
        }
      });
    },
    getRelationList() {
      let params = new URLSearchParams();
      params.append('product_id', this.$route.query.id);
      getRelation(params).then(response => {
        let list = response.data;
        if(list.length >0 ) {
          for (let i = 0; i < list.length; i++) {
            if(!isNaN(list[i])) {
              this.productRelationList.push(list[i]);
            }
          }
        }
      });
    },
    getSpec() {
      let params = new URLSearchParams();
      params.append('product_id', this.$route.query.id);
      getSpec(params).then(response => {
        let list = response.data;
        this.specInfo = list;
      });
    },
    handleFinishCommit() {
      console.log("click");
      console.log(this.productRelationList);
      let params = new URLSearchParams();
      params.append('product_id', this.$route.query.id);
      params.append('related_product', this.productRelationList);
      let obj = this.specInfo;
      let arr = Object.keys(obj).map(key => {
        //console.log(key); //为每个键名
        console.log(obj);
        return { 'group_id': obj[key]['group_id'], 'spec': obj[key]['spec'] }; //把每个对象返回出去生成一个新的数组中相当于0:{id:1}
      });

      params.append('specInfo', JSON.stringify(arr));
      // console.log(this.productRelationList);
      updateRelationAndLabel(params).then(response => {
        this.$message({
          message: '提交成功',
          type: 'success',
          duration: 1000
        });
        this.$router.back();
      });
    }
  }
}

</script>
<style scoped>
</style>
