<template>
    <div align="center">
      <h1>属性列表</h1>
      <!--<el-button type="primary" round @click="addFormFlag=true" size="small">新增</el-button>-->

      <el-table :data="attrData" border style="width: 100%">

        <el-table-column fixed align="center" prop="id" label="序号"></el-table-column>

        <el-table-column fixed align="center" prop="name" label="英文名称"></el-table-column>

        <el-table-column fixed align="center" prop="nameCH" label="中文名称"></el-table-column>

        <el-table-column fixed align="center" prop="typeId" label="类型" :formatter="onLineType"></el-table-column>

        <el-table-column fixed align="center" prop="isSkU" label="SKU属性" :formatter="onLineSku"></el-table-column>

        <el-table-column fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <!--<el-button @click="updateForm(scope.row.id)" type="text" size="small">修改</el-button>
            <el-button @click="deleteBrand(scope.row.id)" type="text" size="small">删除</el-button>-->
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
        name: "Attr",
      data(){
          return{
            attrData:[],
            count:0,
            sizes:[5,8,10,20],
            size:5,
            param:{},
            typeData:[]
          }
      },
      created:function () {
        this.queryAttrData(1);
        this.queryTypeData();
      },
      methods:{
        queryAttrData:function (page) {
          var limit = this.size;
          var data = this.$qs.stringify(this.param);
          this.$axios.get("http://localhost:8080/api/attribute/queryAttribute?page="+page+"&limit="+page+"&"+data).then(rs=>{
            this.attrData = rs.data.data.data;
            this.count = rs.data.data.count;
          }).catch(err=>console.log(err));
        },
        handleCurrentChange:function (page) {
          this.queryAttrData(page);
        },
        handleSizeChange:function (size) {
          this.size = size;
          this.queryAttrData(1);
        },
        queryTypeData:function(){
          this.$axios.get("http://localhost:8080/api/type/getData").then(rs=>{
            this.typeData=rs.data.data;
          }).catch(err=>console.log(err));
        },
        onLineType:function (row , column) {
          for (let i = 0; i <this.typeData.length ; i++) {
            if (row.typeId == this.typeData[i].id){
              return this.typeData[i].name;
            }
          }
        },
        onLineSku:function (row , column) {
          return row.isSkU==1?"是":row.isSkU==2?"否":"";
        }
      }
    }
</script>

<style scoped>

</style>
