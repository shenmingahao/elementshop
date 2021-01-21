<template>
    <div align="center">
      <h1>属性列表</h1>
      <el-button type="primary" round @click="addFormFlag=true" size="small">新增</el-button>

      <el-table :data="attrData" border style="width: 100%">

        <el-table-column fixed align="center" prop="id" label="序号"></el-table-column>

        <el-table-column fixed align="center" prop="name" label="英文名称"></el-table-column>

        <el-table-column fixed align="center" prop="nameCH" label="中文名称"></el-table-column>

        <el-table-column fixed align="center" prop="typeId" label="分类" :formatter="onLineTypeId"></el-table-column>

        <el-table-column fixed align="center" prop="type" label="类型" :formatter="onLineType"></el-table-column>

        <el-table-column fixed align="center" prop="isSkU" label="SKU属性" :formatter="onLineSku"></el-table-column>

        <el-table-column fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="updateForm(scope.row.id)" type="text" size="small">修改</el-button>
            <el-button @click="deleteAttr(scope.row.id)" type="text" size="small">删除</el-button>
            <el-button v-if="scope.row.type!=3" @click="attrValue(scope.row)" type="text" size="small">属性值维护</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--  分页   -->
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="sizes"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
      </el-pagination>

      <!--  新增弹框 -->
      <el-dialog title="新增属性信息" :visible.sync="addFormFlag">

        <el-form :model="data" ref="addAttrForm"   label-width="80px">

          <el-form-item label="英文名称" prop="name">
            <el-col :span="8" :offset="6">
              <el-input v-model="data.name" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="中文名称" prop="name">
            <el-col :span="8" :offset="6">
              <el-input v-model="data.nameCH" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="分类" prop="typeId">
            <el-col :span="8" :offset="6">
              <el-select v-model="data.typeId" placeholder="请选择">
                <el-option
                  v-for="item in types"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="类型" prop="type">
            <el-col :span="20" :offset="2">
              <el-radio-group v-model="data.type">
                <el-radio label="0" name="type">下拉框</el-radio>
                <el-radio label="1" name="type">单选框</el-radio>
                <el-radio label="2" name="type">复选框</el-radio>
                <el-radio label="3" name="type">输入框</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>

          <el-form-item label="SKU属性" prop="isSkU">
            <el-col :span="12" :offset="5">
              <el-radio-group v-model="data.isSkU">
                <el-radio label="1" name="type">是</el-radio>
                <el-radio label="2" name="type">否</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="addFormFlag=false">取 消</el-button>
          <el-button type="primary" @click="addAttrForm">确 定</el-button>
        </div>
      </el-dialog>

      <!--  修改弹框 -->
      <el-dialog title="新增属性信息" :visible.sync="updateFormFlag">

        <el-form :model="updateAttr" ref="addAttrForm"   label-width="80px">

          <el-form-item label="英文名称" prop="name">
            <el-col :span="8" :offset="6">
              <el-input v-model="updateAttr.name" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="中文名称" prop="nameCH">
            <el-col :span="8" :offset="6">
              <el-input v-model="updateAttr.nameCH" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="分类" prop="typeId">
            <el-col :span="8" :offset="6">
              <el-select v-model="updateAttr.typeId" placeholder="请选择">
                <el-option
                  v-for="item in types"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="类型" prop="type">
            <el-col :span="20" :offset="2">
              <el-radio-group v-model="updateAttr.type">
                <el-radio :label="0" name="type">下拉框</el-radio>
                <el-radio :label="1" name="type">单选框</el-radio>
                <el-radio :label="2" name="type">复选框</el-radio>
                <el-radio :label="3" name="type">输入框</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>

          <el-form-item label="SKU属性" prop="isSkU">
            <el-col :span="12" :offset="5">
              <el-radio-group v-model="updateAttr.isSkU">
                <el-radio :label="1" name="type">是</el-radio>
                <el-radio :label="2" name="type">否</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="addFormFlag=false">取 消</el-button>
          <el-button type="primary" @click="updateAttrForm">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 属性值表格 -->
      <el-dialog :title="ValueTitle" :visible.sync="ShowValueTable">

        <el-button type="primary" round @click="addAttrValueFormFlag=true" size="small">新增</el-button>

        <el-table :data="attrValueData" border style="width: 100%">

          <el-table-column fixed align="center" prop="id" label="序号"></el-table-column>

          <el-table-column fixed align="center" prop="attrName" label="属性名称"></el-table-column>

          <el-table-column fixed align="center" prop="name" label="英文名称"></el-table-column>

          <el-table-column fixed align="center" prop="nameCH" label="中文名称"></el-table-column>

          <el-table-column fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button @click="updateAttrValueForm(scope.row.id)" type="text" size="small">修改</el-button>
              <el-button @click="deleteAttrValueForm(scope.row.id)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <!--  新增属性值弹框 -->
      <el-dialog title="新增属性值信息" :visible.sync="addAttrValueFormFlag">

        <el-form :model="valueData" :rules="rules" ref="addAttrValueForm"   label-width="80px">

          <el-form-item label="英文名称" prop="name">
            <el-col :span="8" :offset="6">
              <el-input v-model="valueData.name" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="中文名称" prop="nameCH">
            <el-col :span="8" :offset="6">
              <el-input v-model="valueData.nameCH" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="addAttrValueFormFlag=false">取 消</el-button>
          <el-button type="primary" @click="addAttrValue('addAttrValueForm')">确 定</el-button>
        </div>
      </el-dialog>

      <!--  修改属性值弹框 -->
      <el-dialog title="修改属性值信息" :visible.sync="updateAttrValueFormFlag">

        <el-form :model="updateAttrValueData" :rules="rules" ref="updateAttrValueForm"   label-width="80px">

          <el-form-item label="英文名称" prop="name">
            <el-col :span="8" :offset="6">
              <el-input v-model="updateAttrValueData.name" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="中文名称" prop="nameCH">
            <el-col :span="8" :offset="6">
              <el-input v-model="updateAttrValueData.nameCH" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="updateAttrValueFormFlag=false">取 消</el-button>
          <el-button type="primary" @click="updateAttrValue('updateAttrValueForm')">确 定</el-button>
        </div>
      </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Attr",
      data(){
          return{
            //验证规则
            rules:{
              name: [
                { required: true, message: '请输入英文名称', trigger: 'blur' }
              ],
              nameCH: [
                { required: true, message: '请输入中文名称', trigger: 'blur' }
              ]
            },
            attrData:[],
            count:0,
            sizes:[5,8,10,20],
            size:5,
            param:{},
            typeData:[],
            addFormFlag:false,
            data:{},
            updateFormFlag:false,
            updateAttr:{
              id:"",
              name:"",
              nameCH:"",
              typeId:"",
              type:"",
              isSkU:""
            },
            attrValueData:[],
            ShowValueTable:false,
            atrId:"",
            addAttrValueFormFlag:false,
            valueData:{
              attrId:""
            },
            updateAttrValueFormFlag:false,
            updateAttrValueData:{
              id:"",
              name:"",
              nameCH:"",
              isDel:""
            },
            ValueTitle:"",
            types:[],
            typeName:""
          }
      },
      created:function () {
        this.queryAttrData(1);
        this.queryTypeData();
      },
      methods: {
        queryAttrData: function (page) {
          var limit = this.size;
          var data = this.$qs.stringify(this.param);
          this.$axios.get("http://localhost:8080/api/attribute/queryAttribute?page=" + page + "&limit=" + page + "&" + data).then(rs => {
            this.attrData = rs.data.data.data;
            this.count = rs.data.data.count;
          }).catch(err => console.log(err));
        },
        handleCurrentChange: function (page) {
          this.queryAttrData(page);
        },
        handleSizeChange: function (size) {
          this.size = size;
          this.queryAttrData(1);
        },
        queryTypeData: function () {
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
        },
        getChildrenType:function(){
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
        },
        onLineTypeId: function (row, column) {
          for (let i = 0; i < this.typeData.length; i++) {
            if (row.typeId == this.typeData[i].id) {
              return this.typeData[i].name;
            }
          }
        },
        onLineType: function (row, column) {
          return row.type==0?"下拉框":row.type==1?"单选框":row.type==2?"复选框":row.type==3?"输入框":"";
        },
        onLineSku: function (row, column) {
          return row.isSkU == 1 ? "是" : row.isSkU == 2 ? "否" : "";
        },
        addAttrForm: function () {
          this.$axios.post("http://localhost:8080/api/attribute/addAttribute", this.$qs.stringify(this.data)).then(rs => {
            //关闭弹窗
            this.addFormFlag = false;
            //调用查询方法  刷新表格数据
            this.queryAttrData(1);
          }).catch(err => console.log(err));
        },
        updateForm: function (id) {
          this.updateFormFlag = true;
          var data = {id: id};
          this.$axios.post("http://localhost:8080/api/attribute/huixian", this.$qs.stringify(data)).then(rs => {
            this.updateAttr.id = rs.data.data.id;
            this.updateAttr.name = rs.data.data.name;
            this.updateAttr.nameCH = rs.data.data.nameCH;
            this.updateAttr.typeId = rs.data.data.typeId;
            this.updateAttr.type = rs.data.data.type;
            this.updateAttr.isSkU = rs.data.data.isSkU;
          }).catch(err => console.log(err));
        },
        updateAttrForm: function () {
          this.$axios.post("http://localhost:8080/api/attribute/updateAttribute", this.$qs.stringify(this.updateAttr)).then(rs => {
            //关闭弹窗
            this.updateFormFlag = false;
            //调用查询方法  刷新表格数据
            this.queryAttrData(1);
          }).catch(err => console.log(err));
        },
        deleteAttr: function (id) {
          var data = {id: id};
          this.$axios.post("http://localhost:8080/api/attribute/deleteAttribute", this.$qs.stringify(data)).then(rs => {
            //调用查询方法  刷新表格数据
            this.queryAttrData(1);
          }).catch(err => console.log(err));
        },
        attrValue:function (row) {
          this.ShowValueTable = true;
          this.ValueTitle = row.nameCH+"的选项信息";
          this.atrId = row;
          var data = {attrId:this.atrId.id};
          this.$axios.post("http://localhost:8080/api/attrValue/queryAttrValue" , this.$qs.stringify(data)).then(rs=>{
            this.attrValueData = rs.data.data;
          }).catch(err=>console.log(err));
        },
        addAttrValue:function (formName) {
          this.$refs[formName].validate((vilid)=>{
            if (vilid) {
              this.valueData.attrId = this.atrId.id;
              let data = this.valueData;
              this.$axios.post("http://localhost:8080/api/attrValue/addAttrValue" , this.$qs.stringify(data)).then(rs=>{
                //关闭弹框
                this.addAttrValueFormFlag=false;
                //刷新表格
                this.attrValue(this.atrId);
              }).catch(err=>console.log(err));
            } else {
              this.$message.error("请填写数据");
              return false;
            }
          });
        },
        updateAttrValueForm:function (id) {
          this.updateAttrValueFormFlag = true;
          var data = {id:id};
          this.$axios.post("http://localhost:8080/api/attrValue/huixian" , this.$qs.stringify(data)).then(rs=>{
            this.updateAttrValueData.id = rs.data.data.id;
            this.updateAttrValueData.name = rs.data.data.name;
            this.updateAttrValueData.nameCH = rs.data.data.nameCH;
            this.updateAttrValueData.isDel = rs.data.data.isDel;
          }).catch(err=>console.log(err));
        },
        updateAttrValue:function (formName) {
          this.$refs[formName].validate((vilid)=>{
            if (vilid) {
              this.$axios.post("http://localhost:8080/api/attrValue/updateAttrValue" , this.$qs.stringify(this.updateAttrValueData)).then(rs=>{
                //关闭弹窗
                this.updateAttrValueFormFlag = false;
                //刷新表格
                this.attrValue(this.atrId);
              }).catch(err=>console.log(err));
            } else {
              this.$message.error("请填写数据");
              return false;
            }
          });
        },
        deleteAttrValueForm:function (id) {
          var data = {id:id};
          this.$axios.post("http://localhost:8080/api/attrValue/deleteAttrValue" , this.$qs.stringify(data)).then(rs=>{
            //刷新表格
            this.attrValue(this.atrId);
          }).catch(err=>console.log(err));
        }
      }
    }
</script>

<style scoped>

</style>
