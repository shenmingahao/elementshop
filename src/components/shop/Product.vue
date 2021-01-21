<template>
    <div align="center">
      <h1>商品列表</h1>

      <!-- 属性值表格 -->
      <el-table :data="productData" border style="width: 100%">

        <el-table-column fixed align="center" prop="id" label="序号"></el-table-column>

        <el-table-column fixed align="center" prop="name" label="商品名称"></el-table-column>

        <el-table-column fixed align="center" prop="title" label="标题"></el-table-column>

        <el-table-column fixed align="center" prop="brandId" label="品牌"></el-table-column>

        <el-table-column fixed align="center" prop="productdecs" label="简介"></el-table-column>

        <el-table-column fixed align="center" prop="price" label="价格"></el-table-column>

        <el-table-column fixed align="center" prop="stocks" label="库存"></el-table-column>

        <el-table-column fixed align="center" prop="sortNum" label="排序"></el-table-column>

        <el-table-column fixed align="center" prop="imgPath" label="图片log">
          <template slot-scope="scope">
            <img width="50px" :src="scope.row.imgPath"/>
          </template>
        </el-table-column>

        <el-table-column fixed="right" align="center" label="操作">
          <template slot-scope="scope">

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
          }
      },
      created:function () {
        this.queryProductData(1);
      },
      methods:{
        queryProductData:function(page){
          let limit = this.size;
          this.param.page = page;
          this.param.limit = limit;
          let data = this.param;
          this.$axios.post("http://localhost:8080/api/product/queryProduct" , this.$qs.stringify(data)).then(rs=>{
            console.log(rs);
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
        }
      }

    }
</script>

<style scoped>

</style>
