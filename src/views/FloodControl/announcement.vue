<!--  事件分发  -->
<template>
  <div class="eventDispatch-container system-container">
    <div class='announ-btn'><el-button type="primary" @click="addContent()">新增</el-button></div>
    <el-table ref="multipleTable" :data="tableData">
      <el-table-column type="index" width="60" label="序号" align="center" fixed="left"></el-table-column>
      <el-table-column prop="noticeType" label="公告类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{getNoticeType(scope.row.noticeType)}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="noticeContent" label="公告内容" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="noticeUrgency" label="紧急度" show-overflow-tooltip align="center">
          <template slot-scope="scope">
              <span>{{getNoticeUrgency(scope.row.noticeUrgency)}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="createBy" label="创建人" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="80">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="paginationContent">
      <el-pagination
        layout="total,prev, pager, next"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <el-dialog :title="isDisabled ? '公告详情' : '公告发布'" :visible.sync="dialogDetailsVisible" width="30%">
      <div class="event_detail">
        <el-form ref="form" :inline="true" :model="baseForm">
          <!-- <el-form-item label="创建人：">
            <el-input type="input" placeholder="请输入" v-model="baseForm.createBy" :disabled="isDisabled"></el-input>
          </el-form-item> -->
          <el-form-item label="公告类型">
            <el-select placeholder="请选择" clearable v-model="baseForm.noticeType" :disabled="isDisabled">
              <el-option v-for="(t,i) in bulletinTypeOptions" :value="t.code" :label="t.name" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="阅读人：">
            <!-- <el-select placeholder="请选择" clearable v-model="value1" v-if="!isDisabled" multiple>
              <el-option v-for="(t,i) in personList" :label="t.personName" :value="t.id" :key="i"></el-option>
            </el-select> -->
            <el-cascader
              :options="options"
              :props="props"
              v-model="ydValue"
              collapse-tags
              v-if="!isDisabled"
              emitPath
              clearable>
            </el-cascader>
            <el-input type="input" placeholder="请输入" v-model="baseForm.readerBy" v-if="isDisabled" :disabled="isDisabled"></el-input>
          </el-form-item>
          <el-form-item label="公告紧急度：">
            <el-select placeholder="请选择" clearable v-model="baseForm.noticeUrgency" :disabled="isDisabled">
              <el-option v-for="(t,i) in bulletinUrgencyOptions" :value="t.code" :label="t.name" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公告内容：">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="baseForm.noticeContent" :disabled="isDisabled"></el-input>
          </el-form-item>
          <el-form-item label="短信提醒：">
            <el-radio v-model="baseForm.isMsg" label="0" :disabled="isDisabled">是</el-radio>
            <el-radio v-model="baseForm.isMsg" label="1" :disabled="isDisabled">否</el-radio>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailsVisible = false">{{isDisabled ? '关闭' : '取消'}}</el-button>
        <el-button type="primary" @click="summit()" v-if="!isDisabled">发 布</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getFloodPreNotice,
  saveFloodPreNotice,
  getOperationUser
} from "@/api/drainageOperation";
import { awaitWrap, checkNotNull } from "@/lib";
export default {
  data() {
    return {
      tableData: [],
      isDisabled: true,
      dialogDetailsVisible: false,
      currentPage: 1,
      pageSize: 10,
      props: { multiple: true },
      options: [],
      ydValue:[],
      total: 0,
      pages: 0,
      radio: 1,
      bulletinTypeOptions:[],
      bulletinUrgencyOptions:[],
      value1:[],
      baseForm: {
        noticeType: "",
        readerBy: "",
        noticeUrgency: "",
        noticeContent: "",
        isMsg: "0"
      },
      personList:[]
    };
  },
  methods: {
    //获取表格数据
    async getTableData() {
      let params = {
        current:this.currentPage,
        pageSize:10
      }
      let res = await getFloodPreNotice(params);
      this.tableData = res.data.records;
      this.total = res.data.total;
      this.pages = res.data.pages;
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },
    handleClick(row) {
      this.isDisabled = true;
      this.dialogDetailsVisible = true;
      this.baseForm = {
        noticeType: row.noticeType,
        readerBy: row.readerBy,
        noticeUrgency: row.noticeUrgency,
        noticeContent: row.noticeContent,
        isMsg: row.isMsg
      }
    },
    getNoticeType(type){
      let typeAr = this.bulletinTypeOptions.filter((t) => {
        return t.code == type
      })
      if(typeAr.length > 0){
        return typeAr[0]['name']
      }else{
        return type
      }
    },
    getNoticeUrgency(type){
      let typeAr = this.bulletinUrgencyOptions.filter((t) => {
        return t.code == type
      })
      if(typeAr.length > 0){
        return typeAr[0]['name']
      }else{
        return type
      }
    },
    addContent(){
      this.isDisabled = false;
      this.dialogDetailsVisible = true;
      this.baseForm = {
        noticeType: "",
        readerBy: "",
        noticeUrgency: "",
        noticeContent: "",
        isMsg: "0"
      }
    },
    async summit(){
      const _this = this;
      let readerById = [];
      let readerBy = [];
      this.ydValue.map((t) =>{
        readerById.push(t[1]);
        this.childrenOptions.map((g) => {
          if(g.value == t[1]){
            readerBy.push(g.label)
          }
        })
      })
      let params = {
        ...this.baseForm,
        readerById:readerById.join(','),
        readerBy:readerBy.join(',')
      }
      let res = await saveFloodPreNotice(params);
      if(!res.errorMessage){
        this.$message({
          message: "新增成功！",
          type: "success"
        });
        this.dialogDetailsVisible = false;
        this.getTableData()
      }else{
        this.$message({
          message: res.errorMessage,
          type: "error"
        });
      }
    },
    async getPerson(){
      let list = (await awaitWrap(getOperationUser()))[1] || {};
      if (checkNotNull(list) && checkNotNull(list["data"])) {
        let t = [];
        let y = [];
        for(let key in list["data"]){
          let r = [];
          list["data"][key].map((t) => {
            r.push({
              value: t.id, 
              label: t.username
            })
            y.push({
              value: t.id, 
              label: t.username
            })
          })
          t.push({
            value: key, 
            label: key,
            children:r
          })
        }
        this.options = t;
        this.childrenOptions = y;
      } else {
        this.options = []
      }
    }
  },
  mounted(){
    this.bulletinTypeOptions = this.$store.state.IntelSupervison.bulletinTypeOptions;
    this.bulletinUrgencyOptions = this.$store.state.IntelSupervison.bulletinUrgencyOptions;
    this.getPerson();
    this.getTableData();
  }
};
</script>
<style lang="scss" scoped>
.eventDispatch-container {
  height: 100%;

  /deep/ .el-dialog__body {
    max-height: var(--height);
  }
}
.event_detail .el-form-item {
  width: 100%;
}
/deep/.event_detail .el-form-item__label{
    width: 200px;
  }
.announ-btn{
  float: right;
  margin-bottom: 20px;
}
// .el-select-dropdown__list{
//   .el-select-dropdown__item{
//     background: red !important;
//   }
// }
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected{
  background: none !important;
}
</style>