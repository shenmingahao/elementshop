<template>
    <div align="center">
      <h1>添加商品</h1>
      <el-steps :active="active" align-center finish-status="success">
        <el-step title="填写商品信息" ></el-step>
        <el-step title="填写商品属性" ></el-step>
        <el-step title="商品图片"></el-step>
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
                  v-for="item in brand"
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
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
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
        <el-form :model="goods2" label-width="120px" style="width: 600px" class="demo-ruleForm">
          <el-form-item label="分类" prop="typeId">
            <el-col :span="18">
              <el-select v-model="goods2.typeId" placeholder="请选择" @change="getAttrData">
                <el-option
                  v-for="item in types"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item v-if="SKUData.length>0" label="商品规格" prop="name">

            <el-form-item v-for="a in  SKUData" :key="a.id" :label="a.nameCH">

              <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
                <el-input v-if="a.type==3"></el-input>

                <el-select v-if="a.type==0"  placeholder="请选择">
                  <el-option v-for="b in a.values" :key="b.id"  :label="b.nameCH" value="b.id"></el-option>
                </el-select>

                <el-radio-group v-if="a.type==1">
                  <el-radio v-for="b in a.values" :key="b.id" :label="b.nameCH"></el-radio>
                </el-radio-group>

                <el-checkbox-group v-if="a.type==2" v-model="a.ckValues" @change="skuChange">
                  <el-checkbox v-for="b in a.values" :key="b.id" :label="b.nameCH" name="type"></el-checkbox>
                </el-checkbox-group>

            </el-form-item>

          </el-form-item>

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

          <el-form-item v-if="attData.length>0" label="商品参数" prop="name">

            <el-form-item v-for="a in  attData" :key="a.id" :label="a.nameCH">

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
            active:0,
            tables:"",
            goods:{
              name:"",
              title:"",
              brandId:"",
              productdecs:"",
              price:0,
              stocks:0,
              sortNum:0,
              imgPath:""
            },
            goods2:{},
            imageUrl:"",
            brand:[],
            attData:[],   //非sku的属性数据
            SKUData:[], //sku属性数据
            typeData:[],
            types:[],
            typeName:"",
            tableShow:false,
            cols:[],//表动态列头
            tableData:[],
            price:"",
            storcks:""
          }
      },
      created:function(){
        this.queryBrand();
      },
      methods:{
          addData:function(){
            //商品类型的id
            this.goods.typeId = this.goods2.typeId;
            console.log(this.goods);
            //非sku数据
            console.log(this.attData);
            //sku数据
            console.log(this.tableData);
            //声明后台接参的attr
            let attrs = [];
            for (let i = 0; i < this.attData.length; i++) {
              let attData = {};
              attData[this.attData[i].name] = this.attData[i].ckValues;
              attrs.push(attData);
            }
            //后台接参是string  将数组转为json字符串
            this.goods.attr = JSON.stringify(attrs);
            this.goods.sku = JSON.stringify(this.tableData);
            //发送请求  把数据保存到数据库中
            this.$axios.post("http://localhost:8080/api/product/addProduct",this.$qs.stringify(this.goods)).then(rs=>{
              this.$message.success("添加成功");
            }).catch(err=>console.log(err));
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
        skuChange:function(){
          //清空动态列头
          this.cols=[];
          this.tableData=[];
          //声明笛卡尔积的参数
          let dikaParams=[];
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
        next:function () {
            debugger
          if (this.types.length == 0){
            this.formaterTypeData();
          }
          if (this.active++ > 1) this.active=0;
        },
        queryBrand:function () {
          this.$axios.post("http://localhost:8080/api/brand/queryBrandData").then(rs=>{
            this.brand = rs.data.data;
          }).catch(err=>console.log(err));
        },
        handleAvatarSuccess:function (res, file) {
          console.log(res);
          this.goods.imgPath=res.filePath;
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
        getAttrData:function (typeId) {
          this.tableShow = false;
          //清空数据
          this.attData=[];
          this.SKUData=[];
          var data = {typeId:typeId};
          //根据 typeId 查数据
          this.$axios.post("http://localhost:8080/api/attribute/queryAttrByTypeId",this.$qs.stringify(data)).then(rs=>{
            //定一个变量  把所有的属性数据都赋给它
            let attrDatas = rs.data.data;
            //判断分类是否有数据   更新 参数和规格
            if (attrDatas.length >0 ){
              //初始化  attData      SKUData
              for (let i = 0; i < attrDatas.length; i++) {
                //判断是否为sku属性
                if (attrDatas[i].isSkU == 2){
                  if (attrDatas[i].type != 3){
                    attrDatas[i].ckValues = [];
                    //发起请求 查询此属性对应的选项值
                    var data = {attrId:attrDatas[i].id};
                    this.$axios.post("http://localhost:8080/api/attrValue/queryAttrValue",this.$qs.stringify(data)).then(rs=>{
                      attrDatas[i].values = rs.data.data;
                      this.attData.push(attrDatas[i]);
                    }).catch(err=>console.log(err));
                  }else {
                    this.attData.push(attrDatas[i]);
                  }
                }else {
                  if (attrDatas[i].type != 3){
                    //发起请求 查询此属性对应的选项值
                    var data = {attrId:attrDatas[i].id};
                    this.$axios.post("http://localhost:8080/api/attrValue/queryAttrValue",this.$qs.stringify(data)).then(rs=>{
                      attrDatas[i].values = rs.data.data;
                      attrDatas[i].ckValues = [];
                      this.SKUData.push(attrDatas[i]);
                    }).catch(err=>console.log(err));
                  }else {
                    attrDatas[i].ckValues = [];
                    this.SKUData.push(attrDatas[i]);
                  }
                }
              }
            }else {
              this.attData=[];
              this.SKUData=[];
            }
          }).catch(err=>console.log(err));
        },
        formaterTypeData:function () {
          this.$axios.get("http://localhost:8080/api/type/getData").then(rs => {
            this.typeData = rs.data.data;
            //先找到子节点的数据
            this.getChildrenType();
            //遍历所有的子节点
            for (let i = 0; i < this.types.length; i++) {
              // 全局变量   临时存 层级名称
              this.typeName = "";
              //处理子节点的name属性
              this.chandleName(this.types[i]);
              //给name重新赋值
              this.types[i].name = this.typeName.split("/").reverse().join("/").substring(0,this.typeName.length-1);
            }
          }).catch(err => console.log(err));
        },
        //给我一个节点  得到层级name
        chandleName:function(node){
          //临界值
          if (node.pid != 0){
            this.typeName += "/"+node.name;
            //上级节点
            for (let i = 0; i <this.typeData.length; i++) {
              if (node.pid == this.typeData[i].id){
                this.chandleName(this.typeData[i]);
                break;
              }
            }
          }else {
            this.typeName += "/"+node.name;
          }
        },getChildrenType:function(){
          //遍历所有的节点数据
          for (let i = 0; i <this.typeData.length; i++) {
            let node = this.typeData[i];
            this.isChildrenNode(node);
          }
        },
        isChildrenNode:function(node){
          //标识
          let rs = true;
          for (let i = 0; i < this.typeData.length; i++) {
            if (node.id == this.typeData[i].pid){
              rs = false;
              break;
            }
          }
          if (rs == true){
            this.types.push(node);
          }
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
