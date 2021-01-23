<template>
    <div align="center">
      <h1>添加商品</h1>
      <el-steps :active="active" align-center finish-status="success">
        <el-step title="填写商品信息" ></el-step>
        <el-step title="填写商品属性" ></el-step>
      </el-steps>




      <br>
      <br>

      <div v-if="active==0">
        <el-form :model="goods" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="goods.name"></el-input>
          </el-form-item>

          <el-form-item label="标题" prop="subTitle">
            <el-input v-model="goods.title"></el-input>
          </el-form-item>

          <el-form-item label="品牌" prop="brandId">
            <el-col :span="8" :offset="6">
              <el-select v-model="goods.brandId" placeholder="请选择">
                <el-option
                  v-for="item in brandDatas"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="简介" prop="productdecs">
            <el-input type="textarea" v-model="goods.productdecs"></el-input>
          </el-form-item>

          <el-form-item label="价格"  prop="price">
            <el-input-number v-model="goods.price" :precision="2" :step="0.1"></el-input-number>
          </el-form-item>

          <el-form-item label="库存"  prop="stocks">
            <template>
              <el-input-number v-model="goods.stocks" :step="10"></el-input-number>
            </template>
          </el-form-item>

          <el-form-item label="排序"  prop="sortNum">
            <template>
              <el-input-number v-model="goods.sortNum" :step="1"></el-input-number>
            </template>
          </el-form-item>

          <!-- 图片插件  -->
          <el-form-item label="主图" prop="imgPath">
            <el-upload
              class="avatar-uploader"
              action="http://localhost:8080/api/brand/uploadFile"
              :show-file-list="false"
              name="img"
              :on-success="handleAvatarSuccess">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item style="text-align: center">
            <el-button type="primary" size="medium" @click="next">下一步，填写商品属性</el-button>
          </el-form-item>
        </el-form>
      </div>


      <div v-if="active==1">
        <el-form :model="goods" label-width="120px" style="width: 600px" class="demo-ruleForm">

          <!-- SKU 部分 -->
          <el-form-item label="分类" prop="typeId">
            <el-col :span="18">
              <el-select v-model="goods.typeId" placeholder="请选择" @change="showAttrDataAndSkuData">
                <el-option
                  v-for="item in typeData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item v-if="SKUData.length>0" label="商品规格" prop="name">

            <el-form-item v-for="a in  SKUData" :key="a.id" :label="a.nameCH">

              <el-checkbox-group v-if="a.type==2" v-model="a.ckValues" @change="skuChange">
                <el-checkbox v-for="b in a.values" :key="b.id" :label="b.nameCH" name="type"></el-checkbox>
              </el-checkbox-group>

            </el-form-item>

          </el-form-item>

          <!--  表格部分 -->
          <el-table
            v-if="tableShow"
            :data="tableData"
            style="width: 100%">

            <el-table-column v-for="c in cols" :key="c.id" :label="c.nameCH" :prop="c.name">

            </el-table-column>

            <el-table-column
              label="价格"
              width="180">

              <template slot-scope="scope">
                <el-input v-model="scope.row.price"/>
              </template>

            </el-table-column>

            <el-table-column
              label="库存"
              width="180">

              <template slot-scope="scope">
                <el-input v-model="scope.row.storcks"/>
              </template>

            </el-table-column>

          </el-table>


          <!-- SPU 部分 -->
          <el-form-item v-if="attrData.length>0" label="商品参数" prop="name">

            <el-form-item v-for="a in  attrData" :key="a.id" :label="a.nameCH">

              <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
              <el-input v-if="a.type==3" v-model="a.ckValues"></el-input>

              <el-select v-if="a.type==0" v-model="a.ckValues" placeholder="请选择">
                <el-option v-for="b in a.values" :key="b.id"  :label="b.nameCH" value="b.id"></el-option>
              </el-select>

              <el-radio-group v-if="a.type==1" v-model="a.ckValues">;
                <el-radio v-for="b in a.values" :key="b.id" :label="b.nameCH"></el-radio>
              </el-radio-group>

              <el-checkbox-group v-if="a.type==2" v-model="a.ckValues">
                <el-checkbox v-for="b in a.values" :key="b.id" :label="b.nameCH" name="type"></el-checkbox>
              </el-checkbox-group>

            </el-form-item>

          </el-form-item>

          <el-button type="primary" @click="active--">上一步</el-button>
          <el-button type="primary" @click="addData">添加</el-button>
        </el-form>
      </div>

    </div>
</template>

<script>
    export default {
        name: "Goods",
      data(){
          return{
            /*  步骤一的相关数据  */
            active:0,//步骤条
            tables:"",
            goods:{
              name:"",
              title:"",
              brandId:"",
              typeId:"",
              productdecs:"",
              price:0,
              stocks:0,
              sortNum:0,
              imgPath:""
            },
            //用于图片赋值回显到框里
            imageUrl:"",


            /*  步骤二的相关数据  */
            brandDatas:[],//品牌数据
            attrData:[],   //非sku的属性数据
            SKUData:[], //sku属性数据
            typeData:[],//分类数据
            tableShow:false,//是否让表格显示
            cols:[],//表动态列头
            tableData:[]//表格数据
          }
      },
      created: async function(){
        //查询品牌数据
        await this.queryBrandData();
      },
      methods: {
        queryBrandData: async function () {
          let rs = await this.$axios.post("http://localhost:8080/api/brand/queryBrandData");
          this.brandDatas = rs.data.data;
        },
        handleAvatarSuccess:function (res, file) {
          this.goods.imgPath=res.filePath;
          //显示赋值
          this.imageUrl=res.filePath;
        },
        //   步骤条  下一步
        next: async function () {
          if (this.active++ > 1) this.active = 0;

          if (this.typeData.length == 0){
            //查询分类数据
            await this.queryTypeData();
          }
        },
        queryTypeData: async function () {
          let rs = await this.$axios.get("http://localhost:8080/api/type/getData");
          this.getChildrenNode(rs.data.data);
        },
        //给子节点赋值
        getChildrenNode:function (datas) {
          //判断当前节点是否为字节点
          for (let i = 0; i < datas.length; i++) {
            //得到一个分类数据
            let node = datas[i];
            //默认当前节点是子节点
            let nodeFlag = true;
            //遍历所有的分类数据
            for (let j = 0; j < datas.length; j++) {
              //判断当前节点是否为子节点    在所有的数据中  是否有pid指向当前节点的id的
              //  有的话就返回 false
              if (node.id == datas[j].pid){
                nodeFlag = false;
                break;
              }
            }
            //判断是否为子节点
            if (nodeFlag == true){
              this.typeData.push(node);
            }
          }
        },
        showAttrDataAndSkuData:function () {
          //获取此分类下的sku数据和attr 数据
          let data = {typeId:this.goods.typeId};
          this.$axios.post("http://localhost:8080/api/attribute/queryAttrDataByTypeId",this.$qs.stringify(data)).then(rs=>{
            //处理sku的数据
            //得到所有的sku的数据
            this.SKUData = rs.data.data.skuDatas;
            //商品规格 设置初始化值 添加一个属性 ckValues  设置初始值[]
            for (let i = 0; i < this.SKUData.length; i++) {
              this.SKUData[i].ckValues = [];
            }
            //处理attr数据
            this.attrData = rs.data.data.attrDatas;
            //商品规格  复选框 设置初始化值 添加一个属性 ckValues  设置初始值[]
            for (let i = 0; i < this.attrData.length; i++) {
              if (this.attrData[i].type == 2){
                this.attrData[i].ckValues = [];
              }
            }
          }).catch(err=>console.log(err));
        },
        skuChange:function () {
          //强制刷新组件
          this.$forceUpdate();
          //笛卡尔积的参数
          let dikaParams = [];
          //清空表格数据
          this.tableData = [];
          //清空动态表头的数据
          this.cols = [];
          //判断是否要生成笛卡尔积
          let flag=true;
          console.log(this.SKUData)
          for (let i = 0; i < this.SKUData.length; i++) {
            //添加动态列头名称
            this.cols.push({"id":this.SKUData[i].id,"nameCH":this.SKUData[i].nameCH , "name":this.SKUData[i].name});
            //添加笛卡尔积参数
            dikaParams.push(this.SKUData[i].ckValues);
            if (this.SKUData[i].ckValues.length == 0){
              flag = false;
              break;
            }
          }
          if (flag == true){
            let res = this.calcDescartes(dikaParams);
            //遍历笛卡尔积的结果集
            for (let i = 0; i < res.length; i++) {
              //笛卡尔积 转为json的对象
              let jsonData = {};
              for (let j = 0; j < res[i].length; j++) {
                //获取数据的key
                let key = this.cols[j].name;
                jsonData[key] = res[i][j];
              }
              this.tableData.push(jsonData);
              console.log(this.tableData);
            }
          }
          this.tableShow=flag;
        },
        //笛卡尔积计算
        calcDescartes:function(array) {
          if (array.length < 2) return array[0] || [];
          return [].reduce.call(array, function (col, set) {
            var res = [];
            col.forEach(function (c) {
              set.forEach(function (s) {
                var t = [].concat(Array.isArray(c) ? c : [c]);
                t.push(s);
                res.push(t);
              })
            });
            return res;
          });
        },
        addData:function(){
          console.log(this.goods);
          //非sku数据
          console.log(this.attrData);
          //sku数据
          console.log(this.tableData);
          //声明后台接参的attr
          let attrs = [];
          for (let i = 0; i < this.attrData.length; i++) {
            let attrData = {};
            attrData[this.attrData[i].name] = this.attrData[i].ckValues;
            attrs.push(attrData);
          }
          //后台接参是string  将数组转为json字符串
          this.goods.attr = JSON.stringify(attrs);
          this.goods.sku = JSON.stringify(this.tableData);
          //发送请求  把数据保存到数据库中
          this.$axios.post("http://localhost:8080/api/product/addProduct",this.$qs.stringify(this.goods)).then(rs=>{
            this.$message.success("添加成功");
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
