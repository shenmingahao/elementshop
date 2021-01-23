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
            <el-button @click="showProductInfo(scope.row.typeId,scope.row.id)" type="text" size="small">属性值维护</el-button>
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

      <!--  维护属性的弹框 -->
      <el-dialog title="属性信息" :visible.sync="productAttrShow">

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

          <el-form-item style="text-align: center">
            <el-button @click="productAttrShow = false">取 消</el-button>
            <el-button type="primary" >确 定</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>

    </div>
</template>

<script>
    export default {
      name: "Product",
      data() {
        return {
          /*  查询部分  */
          productData: [],
          count: 0,
          sizes: [5, 8, 10, 20],
          size: 5,
          param: {},
          /*  修改弹框模块 */
          updateFormFlag: false,
          updateProductData: {
            id: "",
            name: "",
            title: "",
            brandId: "",
            typeId: "",
            productdecs: "",
            price: "",
            stocks: "",
            sortNum: "",
            imgPath: ""
          },
          //品牌的数据
          brand: [],
          //类型的数据
          typeData: [],
          //用于图片回显
          imageUrl: "",
          //属性维护弹框模块
          productAttrShow: false,
          goods2: {},
          attData: [],   //非sku的属性数据
          SKUData: [], //sku属性数据
          typeData: [],
          types: [],
          typeName: "",
          tableShow: false,
          cols: [],//表动态列头
          tableData: []
        }
      },
      created: function () {
        this.queryProductData(1);
        //查询品牌数据
        this.queryBrandData();
        //查询类型数据
        this.queryTypeData();
      },
      methods: {
        queryTypeData: function () {
          //发送请求  获取到类型数据
          this.$axios.get("http://localhost:8080/api/type/getData").then(rs => {
            this.typeData = rs.data.data;
          }).catch(err => console.log(err));
        },
        queryBrandData: function () {
          //发送请求  获取到品牌数据
          this.$axios.post("http://localhost:8080/api/brand/queryBrandData").then(rs => {
            this.brand = rs.data.data;
          }).catch(err => console.log(err));
        },
        queryProductData: function (page) {
          let limit = this.size;
          this.param.page = page;
          this.param.limit = limit;
          let data = this.param;
          this.$axios.post("http://localhost:8080/api/product/queryProduct", this.$qs.stringify(data)).then(rs => {
            this.productData = rs.data.data.data;
            this.count = rs.data.data.count;
          }).catch(err => console.log(err));
        },
        handleCurrentChange: function (page) {
          this.queryProductData(page);
        },
        handleSizeChange: function (size) {
          this.size = size;
          this.queryProductData(1);
        },
        oneLineBrand: function (row) {
          for (let i = 0; i < this.brand.length; i++) {
            if (this.brand[i].id == row.brandId) {
              return this.brand[i].name;
            }
          }
        },
        oneLineType: function (row) {
          for (let i = 0; i < this.typeData.length; i++) {
            if (this.typeData[i].id == row.typeId) {
              return this.typeData[i].name;
            }
          }
        },
        updateForm: function (id) {
          this.updateFormFlag = true;
          let data = {id: id};
          //发送请求  回显
          this.$axios.post("http://localhost:8080/api/product/huixian", this.$qs.stringify(data)).then(rs => {
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
          }).catch(err => console.log(err));
        },
        updateProduct: function () {
          this.updateFormFlag = false;
          let data = this.updateProductData;
          this.$axios.post("http://localhost:8080/api/product/updateProduct", this.$qs.stringify(data)).then(rs => {
            //关闭弹框
            this.updateFormFlag = false;
            //调用查询方法  刷新表格数据
            this.queryProductData(1);
          }).catch(err => console.log(err));
        },
        handleAvatarSuccess: function (res, file) {
          this.updateProductData.imgPath = res.filePath;
          //显示赋值
          this.imageUrl = res.filePath;
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
        deleteProduct: function (id) {
          let data = {id: id};
          //发送请求  删除数据
          this.$axios.post("http://localhost:8080/api/product/deleteProduct", this.$qs.stringify(data)).then(rs => {
            //刷新表格
            this.queryProductData(1);
          }).catch(err => console.log(err));
        },
        showProductInfo: function (typeId, proId) {
          this.SKUData = [];
          this.attData = [];
          this.productAttrShow = true;
          //初始化分类数据
          if (this.types.length == 0){
            this.formaterTypeData();
          }
          //回显分类id
          this.goods2.typeId = typeId;
          //回显属性数据
          this.getAttrData(typeId , proId);
          //回显table
          this.skuChange();
        },
        getAttrData: function (typeId , proId) {
          var dataa = {proId:proId}
          this.$axios.post("http://localhost:8080/api/product/queryProductAttrDatasByProId", this.$qs.stringify(dataa)).then(rs => {
            let datas=rs.data.data;
            var datass = {typeId: typeId};
            //根据 typeId 查数据
            this.$axios.post("http://localhost:8080/api/attribute/queryAttrByTypeId", this.$qs.stringify(datass)).then(rs => {
              //定一个变量  把所有的属性数据都赋给它
              let attrDatas = rs.data.data;
              //判断分类是否有数据   更新 参数和规格
              if (attrDatas.length > 0) {
                //初始化  attData      SKUData
                for (let i = 0; i < attrDatas.length; i++) {
                  //判断是否为sku属性
                  if (attrDatas[i].isSkU == 2) {
                    if (attrDatas[i].type != 3) {
                      if (attrDatas[i].type == 2){
                        if (this.getValeu(attrDatas[i].name , datas) == ""){
                          attrDatas[i].ckValues=[];
                        }
                      }else{
                        attrDatas[i].ckValues=this.getValeu(attrDatas[i].name,datas);
                      }
                      //发起请求 查询此属性对应的选项值
                      var data = {attrId: attrDatas[i].id};
                      this.$axios.post("http://localhost:8080/api/attrValue/queryAttrValue", this.$qs.stringify(data)).then(rs => {
                        attrDatas[i].values = rs.data.data;
                        this.attData.push(attrDatas[i]);
                      }).catch(err => console.log(err));
                    } else {
                      attrDatas[i].ckValues=this.getValeu(attrDatas[i].name,datas);
                      this.attData.push(attrDatas[i]);
                    }
                  } else {
                    if (attrDatas[i].type != 3) {
                      
                      //回显
                      if (attrDatas[i].type == 2) {
                        if (this.getValeu(attrDatas[i].name , datas) == ""){
                          attrDatas[i].ckValues=[];
                        }else {
                          attrDatas[i].ckValues=this.getValeu(attrDatas[i].name,datas);
                        }
                      }else {
                        attrDatas[i].ckValues=this.getValeu(attrDatas[i].name,datas);
                      }

                      //发起请求 查询此属性对应的选项值
                      var data = {attrId: attrDatas[i].id};
                      this.$axios.post("http://localhost:8080/api/attrValue/queryAttrValue", this.$qs.stringify(data)).then(rs => {
                        attrDatas[i].values = rs.data.data;
                        attrDatas[i].ckValues=this.getValeu(attrDatas[i].name,datas);
                        this.SKUData.push(attrDatas[i]);
                      }).catch(err => console.log(err));
                    } else {
                      attrDatas[i].ckValues = [];
                      this.SKUData.push(attrDatas[i]);
                    }
                  }
                }
              } else {
                this.attData = [];
                this.SKUData = [];
              }
            }).catch(err => console.log(err));
          }).catch(err => console.log(err));
        },
        //笛卡尔积计算
        calcDescartes: function (array) {
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
        formaterTypeData: function () {
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
              this.types[i].name = this.typeName.split("/").reverse().join("/").substring(0, this.typeName.length - 1);
            }
          }).catch(err => console.log(err));
        },
        //给我一个节点  得到层级name
        chandleName: function (node) {
          //临界值
          if (node.pid != 0) {
            this.typeName += "/" + node.name;
            //上级节点
            for (let i = 0; i < this.typeData.length; i++) {
              if (node.pid == this.typeData[i].id) {
                this.chandleName(this.typeData[i]);
                break;
              }
            }
          } else {
            this.typeName += "/" + node.name;
          }
        }, getChildrenType: function () {
          //遍历所有的节点数据
          for (let i = 0; i < this.typeData.length; i++) {
            let node = this.typeData[i];
            this.isChildrenNode(node);
          }
        },
        isChildrenNode: function (node) {
          //标识
          let rs = true;
          for (let i = 0; i < this.typeData.length; i++) {
            if (node.id == this.typeData[i].pid) {
              rs = false;
              break;
            }
          }
          if (rs == true) {
            this.types.push(node);
          }
        },
        skuChange: function () {
          //清空动态列头
          this.cols = [];
          this.tableData = [];
          //声明笛卡尔积的参数
          let dikaParams = [];
          //判断是否要生成笛卡尔积
          let flag = true;
          console.log(this.SKUData)
          for (let i = 0; i < this.SKUData.length; i++) {
            //添加动态列头名称
            this.cols.push({"id": this.SKUData[i].id, "nameCH": this.SKUData[i].nameCH, "name": this.SKUData[i].name});
            //添加笛卡尔积参数
            dikaParams.push(this.SKUData[i].ckValues);
            if (this.SKUData[i].ckValues.length == 0) {
              flag = false;
              break;
            }
          }
          if (flag == true) {
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
          this.tableShow = flag;
        },
        getValeu:function(key,data){

          let  arrValue=[];
          //遍历当前商品对应的所有的属性
          for (let i = 0; i <data.length ; i++) {
            //得到当前属性数据的一个 将字符串转为json
            let  objData=JSON.parse(data[i].attrData);
            // 判断当前的属性数据 是否为想要的属性值
            if(objData[key] != null){ //找到对应的值了
              //判断当前属性是否为sku
              if(objData.storcks != null){
                if(arrValue.indexOf(objData[key]) == -1){
                  arrValue.push(objData[key]);
                }
              }else{
                return objData[key];
              }
            }
          }
          return arrValue;
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
