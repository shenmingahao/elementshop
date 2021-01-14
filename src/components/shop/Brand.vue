<template>
    <div align="center">
        <h1>条件筛选</h1>
        <el-form :model="param" ref="addBrandForm"   label-width="90px">

            <el-form-item label="品牌名称" prop="name">
              <el-col :span="4">
                <el-input v-model="param.name" autocomplete="off" ></el-input>
                <el-button type="primary" @click="queryBrandData(1)">搜索</el-button>
              </el-col>
            </el-form-item>

        </el-form>

      <h1>品牌管理</h1>
     <el-button type="primary" round @click="addFormFlag=true" size="small">新增</el-button>

      <el-table :data="brandData" border style="width: 100%">

        <el-table-column fixed align="center" prop="id" label="序号"></el-table-column>

        <el-table-column fixed align="center" prop="name" label="品牌名称"></el-table-column>

        <el-table-column fixed align="center" prop="bandE" label="品牌首字母"></el-table-column>

        <el-table-column fixed align="center" prop="imgPath" label="图片log">
          <template slot-scope="scope">
            <img width="50px" :src="scope.row.imgPath"/>
          </template>
        </el-table-column>

        <el-table-column fixed align="center" prop="bandDesc" label="品牌介绍"></el-table-column>

        <el-table-column fixed align="center" prop="ord" label="排序字段"></el-table-column>

        <el-table-column fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="updateForm(scope.row.id)" type="text" size="small">修改</el-button>
            <el-button @click="deleteBrand(scope.row.id)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--  分页 -->
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="sizes"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
      </el-pagination>

      <!-- 新增模板 -->
      <el-dialog title="新增品牌信息" :visible.sync="addFormFlag">

        <el-form :model="brand" ref="addBrandForm"   label-width="90px">

          <el-form-item label="品牌名称" prop="name">
            <el-col :span="8" :offset="6">
              <el-input v-model="brand.name" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="品牌首字母" prop="bandE">
            <el-col :span="4" :offset="8">
              <el-input v-model="brand.bandE"></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="图片">
            <el-col :span="8" :offset="6">
              <el-upload
                class="upload-demo"
                action="http://localhost:8080/api/brand/uploadFile"
                :on-success="imgCallBack"
                name="img"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip"></div>
              </el-upload>
            </el-col>
          </el-form-item>

          <el-form-item label="品牌介绍">
            <el-input type="textarea" maxlength="50" show-word-limit v-model="brand.bandDesc"></el-input>
          </el-form-item>

          <el-form-item label="排序字段" prop="ord">
            <el-col :span="4" :offset="8">
              <el-input-number v-model="brand.ord" controls-position="center"  :min="0" :max="10"></el-input-number>
            </el-col>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="addFormFlag = false">取 消</el-button>
          <el-button type="primary" @click="addBrand">确 定</el-button>
        </div>

      </el-dialog>

      <!-- 修改模板 -->
      <el-dialog title="修改品牌信息" :visible.sync="updateFormFlag">

        <el-form :model="brand" ref="updateBrandForm"   label-width="90px">

          <el-form-item label="品牌名称" prop="name">
            <el-col :span="8" :offset="6">
              <el-input v-model="brand.name" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="品牌首字母" prop="bandE">
            <el-col :span="4" :offset="8">
              <el-input v-model="brand.bandE"></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="图片">
            <el-col :span="8" :offset="6">
              <el-upload
                class="upload-demo"
                action="http://localhost:8080/api/brand/uploadFile"
                :on-success="imgCallBack"
                name="img"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip"></div>
              </el-upload>
            </el-col>
          </el-form-item>

          <el-form-item label="品牌介绍">
            <el-input type="textarea" placeholder="请输入内容" maxlength="50" show-word-limit v-model="brand.bandDesc"></el-input>
          </el-form-item>

          <el-form-item label="排序字段" prop="ord">
            <el-col :span="4" :offset="8">
              <el-input-number v-model="brand.ord" controls-position="center"  :min="0" :max="10"></el-input-number>
            </el-col>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="updateFormFlag = false">取 消</el-button>
          <el-button type="primary" @click="updateBrand">确 定</el-button>
        </div>

      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Brand",
      data(){
          return{
            brandData:[],
            count:0,
            sizes:[5,8,10,20],
            size:5,
            param:{},
            addFormFlag:false,
            updateFormFlag:false,
            brand:{
              id:"",
              name:"",
              bandE:"",
              imgPath:"",
              bandDesc:"",
              ord:""
            }
          }
      },
      created:function () {
        this.queryBrandData(1);
      },
      methods:{
        queryBrandData:function (page) {
          var limit = this.size;
          this.param.page = page;
          this.param.limit = limit;
          var data = this.param;
          this.$axios.post("http://localhost:8080/api/brand/queryBrand",this.$qs.stringify(data)).then(rs=>{
            this.brandData = rs.data.data.data;
            this.count = rs.data.data.count;
          }).catch(err=>console.log(err));
        },
        handleCurrentChange:function (page) {
          this.queryBrandData(page);
        },
        handleSizeChange:function (size) {
          this.size = size;
          this.queryBrandData(1);
        },
        imgCallBack:function(response, file, fileList){
          this.brand.imgPath = response.filePath;
        },
        addBrand:function () {
          this.$axios.post("http://localhost:8080/api/brand/addBrand",this.$qs.stringify(this.brand)).then(rs=>{
            //关闭弹窗
            this.addFormFlag = false;
            //调用查询方法  刷新表格数据
            this.queryBrandData(1);
          }).catch(err=>console.log(err));
        },
        updateForm:function (id) {
          this.updateFormFlag = true;
          var data = {id:id};
          this.$axios.post("http://localhost:8080/api/brand/huixian",this.$qs.stringify(data)).then(rs=>{
            this.brand.id = rs.data.data.id;
            this.brand.name = rs.data.data.name;
            this.brand.bandE = rs.data.data.bandE;
            this.brand.imgPath = rs.data.data.imgPath;
            this.brand.bandDesc = rs.data.data.bandDesc;
            this.brand.ord = rs.data.data.ord;
          }).catch(err=>console.log(err));
        },
        updateBrand:function () {
          this.$axios.post("http://localhost:8080/api/brand/updateBrand",this.$qs.stringify(this.brand)).then(rs=>{
            //关闭弹框
            this.updateFormFlag = false;
            //调用查询方法  刷新表格数据
            this.queryBrandData(1);
          }).catch(err=>console.log(err));
        },
        deleteBrand:function (id) {
          var data = {id:id};
          this.$axios.post("http://localhost:8080/api/brand/deleteBrand",this.$qs.stringify(data)).then(rs=>{
            //调用查询方法  刷新表格数据
            this.queryBrandData(1);
          }).catch(err=>console.log(err));
        }
      }
    }
</script>

<style scoped>

</style>
