<template> 
  <el-card class="form-container" shadow="never">
    <span>规格信息</span>
    <template>
      <div style="margin-top: 50px">
        <el-form :model="specParam" :rules="rules" ref="specForm" label-width="120px" style="width: 600px" size="small">
          <el-form-item label="规格名称：" prop="item_name">
            <el-input v-model="specParam.item_name"></el-input>
          </el-form-item>
          <el-form-item label="规格种类：" prop="group_id">
            <el-select v-model="specParam.group_id" placeholder="请选择种类">
                <el-option v-for="item in options"
                :label="item.text"
                :key="item.value"
                :value="item.value"
                >
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" size="medium" @click="handleCommit('specForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </el-card>
</template>
<script>
import { createSpec, getSpec, updateSpec} from '@/api/spec';
const defaultSpecParam = {
  item_name: '',
  group_id: '',
};
export default {
  name: "SpecDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      specParam: Object.assign({}, defaultSpecParam),
      options:[{value:1,text:"容积"},{value:2,text:"介质"}],
      hasEditCreated: false,
      rules: {
        item_name: [
          { required: true, message: '请输入规格名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        group_id: [{ required: true, message: '请选择规格类别', trigger: 'blur' }]
      }
    };
  },
  created() {
    if (this.isEdit) {
      let params = new URLSearchParams();
      params.append('item_id', this.$route.query.id);
      getSpec(params).then(response => {
        this.specParam = response.data;
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
      this.$confirm('是否要提交该规格', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (isEdit) {
          updateSpec(this.specParam)
            .then(response => {
              this.$message({
                type: 'success',
                message: '提交成功',
                duration: 1000
              });
              this.$router.back();
            });
        } else {
          createSpec(this.specParam).then(response => {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000
            });
          this.$router.back();
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
