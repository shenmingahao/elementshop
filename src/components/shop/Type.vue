<template>
    <div>
      <h1>商品分类管理</h1>
      <br>
      <el-tree
        :data="data"
        :props="defaultProps"
        accordion
        show-checkbox
        :render-content="renderContent"
      >
      </el-tree>

      <!--  新增弹框 -->
      <el-dialog title="新增节点信息" :visible.sync="addFormFlag">

        <el-form :model="typeData" ref="addCarForm"   label-width="80px">

          <el-form-item label="名称" prop="name">
            <el-col :span="8" :offset="6">
              <el-input v-model="typeData.name" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="addFormFlag=false">取 消</el-button>
          <el-button type="primary" @click="addShopForm">确 定</el-button>
        </div>
      </el-dialog>

      <!--  修改弹框 -->
      <el-dialog title="修改节点信息" :visible.sync="updateFormFlag">

        <el-form :model="typeUpdateData" ref="addCarForm"   label-width="80px">

          <el-form-item label="名称" prop="name">
            <el-col :span="8" :offset="6">
              <el-input v-model="typeUpdateData.name" autocomplete="off" ></el-input>
            </el-col>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="updateFormFlag=false">取 消</el-button>
          <el-button type="primary" @click="updateShopForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Type",
      data(){
          return{
            data:[],
            ajaxData:[],
            jsonStr:"",
            defaultProps:{},
            addFormFlag:false,
            typeData:{
              name:"",
              pid:""
            },
            updateFormFlag:false,
            typeUpdateData:{
              id:"",
              name:""
            }
          }
      },
      created:function () {
        //远程请求查询的数据
        this.$axios.get("http://localhost:8080/api/type/getData").then(rs=>{
          this.ajaxData = rs.data.data;
          this.chandleData();
        }).catch(err=>console.log(err));
      },
      methods:{
        chandleData:function () {
          //找到顶层节点的数据
          for (let i = 0; i <this.ajaxData.length ; i++) {
            if (this.ajaxData[i].pid == 0){
              this.diguiNode(this.ajaxData[i]);
              break;
            }
          }
          //将字符串转为json对象
          this.data.push(JSON.parse(this.jsonStr));
        },
        diguiNode:function (node) {
          //判断是否为父节点
          var bf = this.isParent(node);
          if (bf == true){
            //拼接数据
            this.jsonStr += '{"id":'+node.id+',"label":"'+node.name+'","children":[';
            //拼接子节点的数据
            //查询此节点的子节点
            let count = 0;
            for (let i = 0; i < this.ajaxData.length; i++) {
              //判断是否为此节点的子节点
              if (node.id == this.ajaxData[i].pid){
                count++;
                this.diguiNode(this.ajaxData[i]);
                this.jsonStr += ",";
              }
            }
            //处理多余的 ，号
            if (count != 0){
              this.jsonStr = this.jsonStr.substr(0 , this.jsonStr.length-1);
            }
            //拼接完整
            this.jsonStr += ']}';
          }else {
            this.jsonStr += '{"id":'+node.id+',"label":"'+node.name+'"}';
          }
        },
        isParent:function (node) {
          //判断是否为父节点  看pid又没有指向当前的id
          for (let i = 0; i <this.ajaxData.length ; i++) {
            if (node.id == this.ajaxData[i].pid){
              return true;
            }
          }
          return false;
        },
        renderContent(h , {node , data , store}){
          return (
            <span class="custom-tree-node">
              <span>{node.label}</span>
              <span>
                <el-button size="mini" type="text" circle on-click={ () => this.addShop(data) }>新增</el-button>
                <el-button size="mini" type="text" circle on-click={ () => this.updateShop(data) }>修改</el-button>
                <el-button size="mini" type="text" circle on-click={ () => this.deleteShop(data) }>删除</el-button>
              </span>
            </span>
          );
        },
        addShop:function (data) {
          this.addFormFlag=true;
          this.typeData.pid=data.id;
        },
        addShopForm:function(){
          this.$axios.post("http://localhost:8080/api/type/add",this.$qs.stringify(this.typeData)).then(rs=>{
            //关闭弹框
            this.addFormFlag=false;
            location.reload();
          }).catch(err=>console.log(err));
        },
        updateShop:function (data) {
          this.updateFormFlag=true;
          this.typeUpdateData.id = data.id;
          this.typeUpdateData.name = data.label;
        },
        updateShopForm:function () {
          this.$axios.post("http://localhost:8080/api/type/update",this.$qs.stringify(this.typeUpdateData)).then(rs=>{
            //关闭弹框
            this.updateFormFlag=false;
            location.reload();
          }).catch(err=>console.log(err));
        },
        deleteShop:function (data) {
          var data = {id:data.id , isDel:1};
          this.$axios.post("http://localhost:8080/api/type/update",this.$qs.stringify(data)).then(rs=>{
            location.reload();
          }).catch(err=>console.log(err));
        }

      }
    }
</script>

<style scoped>

</style>
