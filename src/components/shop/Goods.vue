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
                  <el-option v-for="b in a.name" :key="b.id"  :label="b.nameCH" value="b.id"></el-option>
                </el-select>

                <el-radio-group v-if="a.type==1">
                  <el-radio v-for="b in a.name" :key="b.id" :label="b.nameCH"></el-radio>
                </el-radio-group>

                <el-checkbox-group v-if="a.type==2" v-model="a.ckValues" @change="skuChange">
                  <el-checkbox v-for="b in a.name" :key="b.id" :label="b.nameCH" name="type"></el-checkbox>
                </el-checkbox-group>

            </el-form-item>

          </el-form-item>

          <table v-if="tableShow">
            <tr>
              <td>价格</td>
              <td>库存</td>
            </tr>
          </table>

          <el-form-item v-if="attData.length>0" label="商品参数" prop="name">

            <el-form-item v-for="a in  attData" :key="a.id" :label="a.nameCH">

              <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
              <el-input v-if="a.type==3"></el-input>

              <el-select v-if="a.type==0"  placeholder="请选择">
                <el-option v-for="b in a.name" :key="b.id"  :label="b.nameCH" value="b.id"></el-option>
              </el-select>

              <el-radio-group v-if="a.type==1">
                <el-radio v-for="b in a.name" :key="b.id" :label="b.nameCH"></el-radio>
              </el-radio-group>

              <el-checkbox-group v-if="a.type==2">
                <el-checkbox v-for="b in a.name" :key="b.id" :label="b.nameCH" name="type"></el-checkbox>
              </el-checkbox-group>

            </el-form-item>

          </el-form-item>

          <el-button type="primary" @click="active--">上一步</el-button>
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
            ck:[],
            goods:{
              name:"",
              title:"",
              bandId:"",
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
            tableShow:false
          }
      },
      created:function(){
        this.queryBrand();
      },
      methods:{
        discarts:function() {
          //笛卡尔积
          var twodDscartes = function (a, b) {
            var ret = [];
            for (var i = 0; i < a.length; i++) {
              for (var j = 0; j < b.length; j++) {
                ret.push(ft(a[i], b[j]));
              }
            }
            return ret;
          }
          var ft = function (a, b) {
            if (!(a instanceof Array))
              a = [a];
            var ret = a.slice(0);
            ret.push(b);
            return ret;
          }
          //多个一起做笛卡尔积
          return (function (data) {
            var len = data.length;
            if (len == 0)
              return [];
            else if (len == 1)
              return data[0];
            else {
              var r = data[0];
              for (var i = 1; i < len; i++) {
                r = twodDscartes(r, data[i]);
              }
              return r;
            }
          })(arguments.length > 1 ? arguments : arguments[0]);
        },
        skuChange:function(){
          console.log(this.SKUData);
          //判断是否要生成笛卡尔积
          let flag=true;
          for (let i = 0; i < this.SKUData.length; i++) {
            if (this.SKUData[i].ckValues.length == 0){
              flag = false;
              break;
            }
          }
          if (flag == true){
            alert("生成笛卡尔积");
          }
          this.tableShow=flag;
        },
        next:function () {
          this.formaterTypeData();
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
          this.attData=[];
          this.SKUData=[];
          var data = {typeId:typeId};
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
                    //发起请求 查询此属性对应的选项值
                    var data = {attrId:attrDatas[i].id};
                    this.$axios.post("http://localhost:8080/api/attrValue/queryAttrValue",this.$qs.stringify(data)).then(rs=>{
                      attrDatas[i].name = rs.data.data;
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
                      attrDatas[i].name = rs.data.data;
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
          console.log(this.attData);
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
