<template>
    <div align="center">
      <h1>条件筛选</h1>
      <el-form :model="param"  label-width="90px">

        <el-form-item label="商品名称" prop="name">
          <el-col :span="4">
            <el-input v-model="param.name" autocomplete="off" ></el-input>
            <el-button type="primary" @click="queryProductData(1)">搜索</el-button>
          </el-col>
        </el-form-item>

      </el-form>


      <h1>商品列表</h1>

      <router-link to="/goods"><el-button type="primary" round size="small">新增</el-button></router-link>

      <!-- 属性值表格 -->
      <el-table :data="productData" border style="width: 100%">

        <el-table-column fixed align="center" prop="id" label="序号"></el-table-column>

        <el-table-column fixed align="center" prop="name" label="商品名称"></el-table-column>

        <el-table-column fixed align="center" prop="title" label="标题"></el-table-column>

        <el-table-column fixed align="center" prop="brandId" label="品牌" :formatter="oneLineBrand"></el-table-column>

        <el-table-column fixed align="center" prop="typeId" label="类型" :formatter="oneLineType"></el-table-column>

        <el-table-column fixed align="center" prop="productdecs" label="简介"></el-table-column>

        <el-table-column fixed align="center" prop="price" label="价格"></el-table-column>

        <el-table-column fixed align="center" prop="stocks" label="库存"></el-table-column>

        <el-table-column fixed align="center" prop="sortNum" label="排序"></el-table-column>

        <el-table-column fixed align="center" prop="imgPath" label="图片log">
          <template slot-scope="scope">
            <img width="50px" :src="scope.row.imgPath"/>
          </template>
        </el-table-column>

        <el-table-column fixed="right" align="center" label="操作" width="180px">
          <template slot-scope="scope">
            <el-button @click="updateForm(scope.row.id)" type="text" size="small">修改</el-button>
            <el-button @click="deleteProduct(scope.row.id)" type="text" size="small">删除</el-button>
            <el-button @click="ddd(scope.row.id)" type="text" size="small">属性值维护</el-button>
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


      <!-- 修改的模板 -->
      <el-dialog title="修改商品信息" :visible.sync="updateFormFlag">

        <el-form :model="updateProductData" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="updateProductData.name"></el-input>
          </el-form-item>

          <el-form-item label="标题" prop="title">
            <el-input v-model="updateProductData.title"></el-input>
          </el-form-item>

          <el-form-item label="品牌" prop="brandId">
            <el-col :span="8" :offset="6">
              <el-select v-model="updateProductData.brandId" placeholder="请选择">
                <el-option
                  v-for="item in brand"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="简介" prop="productdecs">
            <el-input type="textarea" v-model="updateProductData.productdecs"></el-input>
          </el-form-item>

          <el-form-item label="价格"  prop="price">
            <el-input-number v-model="updateProductData.price" :precision="2" :step="0.1"></el-input-number>
          </el-form-item>

          <el-form-item label="库存"  prop="stocks">
            <template>
              <el-input-number v-model="updateProductData.stocks" :step="10"></el-input-number>
            </template>
          </el-form-item>

          <el-form-item label="排序"  prop="sortNum">
            <template>
              <el-input-number v-model="updateProductData.sortNum" :step="1"></el-input-number>
            </template>
          </el-form-item>

          <!-- 图片插件  -->
          <el-form-item label="主图" prop="imgPath">
            <div><img :src="updateProductData.imgPath" width="80px"/></div>
            <el-upload
              class="avatar-uploader"
              action="http://localhost:8080/api/brand/uploadFile"
              :show-file-list="false"
              name="img"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item style="text-align: center">
            <el-button @click="updateFormFlag = false">取 消</el-button>
            <el-button type="primary" @click="updateProduct">确 定</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>



    </div>
</template>

<script>
    export default {
        name: "Product",
      data(){
          return{
            /*  查询部分  */
            productData:[],
            count:0,
            sizes:[5,8,10,20],
            size:5,
            param:{},
            /*  修改弹框模块 */
            updateFormFlag:false,
            updateProductData:{
              id:"",
              name:"",
              title:"",
              brandId:"",
              typeId:"",
              productdecs:"",
              price:"",
              stocks:"",
              sortNum:"",
              imgPath:""
            },
            //品牌的数据
            brand:[],
            //类型的数据
            typeData:[],
            //用于图片回显
            imageUrl:""
          }
      },
      created:function () {
        this.queryProductData(1);
        //查询品牌数据
        this.queryBrandData();
        //查询类型数据
        this.queryTypeData();
      },
      methods:{
        queryTypeData:function(){
          //发送请求  获取到类型数据
          this.$axios.get("http://localhost:8080/api/type/getData").then(rs=>{
            this.typeData = rs.data.data;
          }).catch(err=>console.log(err));
        },
        queryBrandData:function(){
          //发送请求  获取到品牌数据
          this.$axios.post("http://localhost:8080/api/brand/queryBrandData").then(rs=>{
            this.brand = rs.data.data;
          }).catch(err=>console.log(err));
        },
        queryProductData:function(page){
          let limit = this.size;
          this.param.page = page;
          this.param.limit = limit;
          let data = this.param;
          this.$axios.post("http://localhost:8080/api/product/queryProduct" , this.$qs.stringify(data)).then(rs=>{
            this.productData = rs.data.data.data;
            this.count = rs.data.data.count;
          }).catch(err=>console.log(err));
        },
        handleCurrentChange:function (page) {
          this.queryProductData(page);
        },
        handleSizeChange:function (size) {
          this.size = size;
          this.queryProductData(1);
        },
        oneLineBrand:function(row){
          for (let i = 0; i < this.brand.length; i++) {
            if (this.brand[i].id == row.brandId){
              return this.brand[i].name;
            }
          }
        },
        oneLineType:function(row){
          for (let i = 0; i < this.typeData.length; i++) {
            if (this.typeData[i].id == row.typeId){
              return this.typeData[i].name;
            }
          }
        },
        updateForm:function (id) {
          this.updateFormFlag = true;
          let data = {id:id};
          //发送请求  回显
          this.$axios.post("http://localhost:8080/api/product/huixian" , this.$qs.stringify(data)).then(rs=>{
            console.log(rs);
            this.updateProductData.id = rs.data.data.id;
            this.updateProductData.name = rs.data.data.name;
            this.updateProductData.title = rs.data.data.title;
            this.updateProductData.brandId = rs.data.data.brandId;
            this.updateProductData.typeId = rs.data.data.typeId;
            this.updateProductData.productdecs = rs.data.data.productdecs;
            this.updateProductData.price = rs.data.data.price;
            this.updateProductData.stocks = rs.data.data.stocks;
            this.updateProductData.sortNum = rs.data.data.sortNum;
            this.updateProductData.imgPath = rs.data.data.imgPath;
          }).catch(err=>console.log(err));
        },
        updateProduct:function(){
          this.updateFormFlag = false;
          let data = this.updateProductData;
          this.$axios.post("http://localhost:8080/api/product/updateProduct" , this.$qs.stringify(data)).then(rs=>{
            //关闭弹框
            this.updateFormFlag = false;
            //调用查询方法  刷新表格数据
            this.queryProductData(1);
          }).catch(err=>console.log(err));
        },
        handleAvatarSuccess:function (res, file) {
          this.updateProductData.imgPath=res.filePath;
          //显示赋值
          this.imageUrl=res.filePath;
        },
        beforeAvatarUpload(file) {
          //限制类型    name  来限制
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 4;

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
        },
        deleteProduct:function (id) {
          let data = {id:id};
          //发送请求  删除数据
          this.$axios.post("http://localhost:8080/api/product/deleteProduct" , this.$qs.stringify(data)).then(rs=>{
            //刷新表格
            this.queryProductData(1);
          }).catch(err=>console.log(err));
        }
      }

    }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
