<template> 
  <el-card class="form-container" shadow="never">
    <span>商品信息</span>
    <template>
      <div style="margin-top: 50px">
        <el-form :model="productParam" :rules="rules" ref="productForm" label-width="120px" style="width: 600px" size="small">
          <el-form-item label="商品名称：" prop="product_name">
            <el-input v-model="productParam.product_name"></el-input>
          </el-form-item>
          <el-form-item label="商品介绍：" prop="product_content">
            <el-input :autoSize="true" v-model="productParam.product_content" type="textarea" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="商品售价：" prop="product_price">
            <el-input v-model="productParam.product_price"></el-input>
          </el-form-item>
          <el-form-item label="指导价：" prop="guiding_price">
            <el-input v-model="productParam.guiding_price"></el-input>
          </el-form-item>
          <el-form-item label="商品图片：">
            <el-upload class="upload-pic" ref="upload" action :http-request="uploadSectionFile" :show-file-list="true" list-type="picture-card" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="1" :on-exceed="handleExceed" :file-list="fileList" :auto_upload="true">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,且不超过2M</div>
            </el-upload>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" size="medium" @click="handleCommit('productForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </el-card>
</template>
<script>
import { createProduct, getProduct, updateProduct, uploadPic } from '@/api/product';
const defaultProductParam = {
  product_name: '',
  product_price: '',
  guiding_price: '',
  product_content: '',
  product_pic: ''
};
export default {
  name: "ProductDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      productParam: Object.assign({}, defaultProductParam),
      hasEditCreated: false,
      fileList: [],
      rules: {
        product_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        product_content: [{ required: true, message: '请输入商品介绍', trigger: 'blur' }],
        product_price: [{ required: true, message: '请输入商品默认价格', trigger: 'blur' }],
        guiding_price: [{ required: true, message: '请输入商品指导价', trigger: 'blur' }],
        requiredProp: [{ required: true, message: '该项为必填项', trigger: 'blur' }]
      }
    };
  },
  created() {
    if (this.isEdit) {
      let params = new URLSearchParams();
      params.append('product_id', this.$route.query.id);
      getProduct(params).then(response => {
        this.productParam = response.data;
        this.fileList = [{url: $this.productParam.product_pic}];
      });
    }
  },
  computed: {

  },
  watch: {},
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
      this.$confirm('是否要提交该产品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (isEdit) {
          updateProduct(this.productParam)
            .then(response => {
              this.$message({
                type: 'success',
                message: '提交成功',
                duration: 1000
              });
              this.$router.back();
            });
        } else {
          createProduct(this.productParam).then(response => {
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
    handlePreview(file) {
      this.previewPath = file.response.url;
      this.previewVisible = true;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleRemove(file, fileList) {
//      console.log(file, fileList);
    },
    uploadSectionFile(params) {
      const file = params.file;
      const fileType = file.type;
      const isImage = fileType.indexOf("image") != -1;
      const isLt2M = file.size / 1024 / 1024 < 2;
      // 这里常规检验，看项目需求而定
      if (!isImage) {
        this.$message.error("只能上传图片格式png、jpg、gif!");
        return;
      }
      if (!isLt2M) {
        this.$message.error("只能上传图片大小小于2M");
        return;
      }
      // 根据后台需求数据格式
      const form = new FormData();
      // 文件对象
      form.append("product_pic", file);
      // 本例子主要要在请求时添加特定属性，所以要用自己方法覆盖默认的action
      uploadPic(form).then(response => {
        this.$message({
          type: 'success',
          message: '提交成功',
          duration: 1000
        });
        this.productParam.product_pic = response.data.product_pic;
      });
    },
  }
}

</script>
<style>
.form-container {
  width: 800px;
}

</style>
