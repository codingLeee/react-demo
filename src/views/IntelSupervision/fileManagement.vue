<!-- 档案管理 -->
<template>
  <div class="file-container system-container">
    <div class="left-search" v-if="showFile">
      <el-menu
        class="el-menu-vertical-demo"
        @select="selectNav"
        :default-openeds="openeds"
        :default-active="activeMenu"
        :active-text-color="activeColor"
        @close="getAllFile()"
      >
        <el-submenu index="1-1">
          <template slot="title">
            <i class="el-icon-folder-opened"></i>
            <span>我的文件</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1"><i class="el-icon-document"></i>文档</el-menu-item>
            <el-menu-item index="2"><i class="el-icon-picture-outline"></i>图片</el-menu-item>
            <el-menu-item index="3"><i class="el-icon-video-play"></i>视频</el-menu-item>
            <el-menu-item index="4"><i class="el-icon-warning-outline"></i>其他</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <div class="middle-content" v-if="showFile">
      <div class="middle-btn" v-if="multipleSelection.length > 0">
          <!-- <div v-if="!activeMenu">上传</div> -->
          <div @click="downLoadFile()">下载</div>
          <div @click="moveFile()">移动</div>
          <div @click="resetName()">重命名</div>
          <div @click="deleteFile()">删除</div>
          <div @click="analysisFile()">解析</div>
      </div>
      <div v-if="multipleSelection.length == 0" class="not-multip-btn">
        <el-upload
          class="upload-demo"
          :on-change="handleFileChange"
          multiple
          :auto-upload="false"
          action=""
          :show-file-list="false"
          :file-list="fileList">
          <el-button v-if="!activeMenu">上传</el-button>
        </el-upload>
        <el-button @click="btnCreateFile()" v-if="!activeMenu">新建文件夹</el-button>
        <el-button @click="showAnalysis()">解析记录</el-button>
      </div>
      <div class="right-search">
        <el-input placeholder="搜索你的文件" v-model="input" class="input-with-select" size="mini">
          <span slot="append" @click="search()">搜索</span>
        </el-input>
      </div>
      <div class="middle-flex">
        <div :class="toggle ? 'expand' : 'putAway'">
          <div class="middle-path">
            <div v-if="roadName.length > 0" @click="returnFile(roadName[roadName.length - 2])"><span>返回上一级</span>&nbsp;&nbsp;|&nbsp;&nbsp;</div>
            <div @click="getAllFile()"><span>全部文件</span><span v-if="roadName.length > 0">&nbsp;&nbsp;>&nbsp;&nbsp;</span></div>
            <div v-for="(t,i) in roadName" :key="i" @click="getIntoFile(t,'currentFile')"><span>{{t}}</span><span v-if="i+1 !== roadName.length">&nbsp;&nbsp;>&nbsp;&nbsp;</span></div>
          </div>
          <div class="middle-table">
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              :default-sort = "{prop: 'date', order: 'descending'}"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="objectName"
                label="文件名"
                width="500"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-if="!scope.row.modifyType" class="file-name">
                      <img :src="`./../../../static/Common/img/file.png`" v-if="scope.row.isDir == 'true'"/>
                      <img :src="getImgSrc(scope.row.contentType,'small')" v-if="scope.row.isDir == 'false'"/>
                      <span :style="{'cursor':'pointer'}" @click="getIntoFile(scope.row.objectName)" v-if="scope.row.isDir == 'true'">{{ scope.row.objectName }}</span>
                      <span :style="{'cursor':'pointer'}" v-if="scope.row.isDir == 'false'">{{ scope.row.objectName }}</span>
                    </div>
                    <div v-if="scope.row.modifyType" class="file-name">
                      <img :src="`./../../../static/Common/img/file.png`" v-if="scope.row.isDir == 'true'"/>
                      <img :src="getImgSrc(scope.row.contentType,'small')" v-if="scope.row.isDir == 'false'"/>
                      <el-input
                        v-model="resetFileName"
                        autocomplete="off"
                        placeholder="请输入"
                        size="mini"
                      ></el-input>
                      <img :src="`./../../../static/Common/img/sure.png`" @click="resetFileAsny(scope.row)" :style="{'cursor':'pointer'}"/>
                      <img :src="`./../../../static/Common/img/fault.png`" @click="cancelResetFile()" :style="{'cursor':'pointer'}"/>
                    </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="time"
                label="修改时间"
                sortable>
              </el-table-column>
              <el-table-column
                prop="size"
                label="大小"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ getSize(scope.row.size) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div v-if="toggle" class="file-detail">
          <div class="file-detail-title">
            <span>{{multipleSelection.length > 1 ? `共选中${multipleSelection.length}个文件` : '文件详情'}}</span>
            <div @click="toggleTo()" :style="{'cursor':'pointer'}">
              <i class="el-icon-arrow-right"></i>
              <span>收起</span>
            </div>
          </div>
          <div class="default-detail" v-if="multipleSelection.length == 0">
            <div>
              <img :src="`./../../../static/Common/img/file-mr.png`"/>
              <p class="default-des">选中文件/文件夹查看详情</p>
            </div>
          </div>
          <div class="multiple-detail" v-if="multipleSelection.length > 1">
            <div>
              <img :src="`./../../../static/Common/img/file-big.png`"/>
            </div>
          </div>
          <div class="radio-detail" v-if="multipleSelection.length == 1 && this.multipleSelection[0]['isDir']  == 'true'">
            <div>
              <img :src="`./../../../static/Common/img/file-2x.png`"/>
              <span>{{multipleSelection[0]['objectName']}}</span>
            </div>
            <div>
              <div v-for="(t,i) in fileDetailList" :key="i">
                <img :src="`./../../../static/Common/img/file.png`"/>
                <span>{{t.objectName}}</span>
              </div>
            </div>
          </div>
          <div class="file-sigle-detail" v-if="multipleSelection.length == 1 && this.multipleSelection[0]['isDir']  == 'false'">
            <div v-if="fileSigleDetail.contentType">
              <img :src="getImgSrc(fileSigleDetail.contentType,'big')"/>
            </div>
            <div class="file-sigle-con" v-if="fileSigleDetail.contentType">
              <div class="title">{{fileSigleDetail.objectName || '--'}}</div>
              <p>修改时间：{{fileSigleDetail.time || '--'}}</p>
              <p>文件格式：{{fileSigleDetail.contentType || '--'}}</p>
              <p>所在目录：{{fileSigleDetail.prefix || '--'}}</p>
              <p>文件解析状态：未解析</p>
            </div>
          </div>
        </div>
        <div v-if="!toggle" class="file-toggle">
          <div class="file-detail-title">
            <div @click="toggleTo()">
              <i class="el-icon-arrow-left"></i>
              <span>展开</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="jx-table system-container" v-if="!showFile">
      <div class="query-header">
        <div class="queryBox">
          <div class="box">
            <span class="">排水户名称：</span>
            <el-input
              v-model="pshName"
              autocomplete="off"
              placeholder="请输入"
            ></el-input>
          </div>
          <div class="box">
            <span class="">文件类型：</span>
            <el-select v-model="fileType" placeholder="请选择" clearable>
              <el-option
                :label="t.name"
                :value="t.code"
                v-for="(t,i) in fileTypeList"
                :key="i"
              >
              </el-option>
            </el-select>
          </div>
          <div class="box">
            <span class="">解析状态：</span>
            <el-select v-model="state" placeholder="请选择" clearable>
              <el-option
                label="正在解析"
                value="1"
              >
              </el-option>
              <el-option
                label="已完成"
                value="2"
              >
              </el-option>
            </el-select>
          </div>
          <div class="box">
            <el-button type="primary" @click="searchFileList()">搜索</el-button>
          </div>
        </div>
        <el-button type="primary" round size="mini" @click="showFile = !showFile">返回</el-button>
      </div>
      <el-table :data="analysisList">
        <el-table-column type="index" label="序号" align="center" fixed="left" width="60">
        </el-table-column>
        <!-- <el-table-column
          prop="startTime"
          label="解析开始时间"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column> -->
        <el-table-column label="解析开始时间" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{getTime(scope.row.startTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operator"
          label="操作用户"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="pshName"
          label="排水户名称"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="fileType"
          label="文件类型"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="uploadWay"
          label="上传形式"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="fileName"
          label="文件名称"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="state"
          label="解析状态"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
    </el-table>
    <div class="paginationContent" v-if="!showFile">
      <el-pagination
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
      <span>共{{ total }}条</span>
    </div>
    </div>
    <el-dialog
      :visible.sync="visible"
      v-if="visible"
      width="400px"
      :destroy-on-close="true"
      title="新建文件夹"
      v-dialogDrag
      @close="closeCreateFile()"
    >
      <div class="box">
        <span class="">文件夹名称：</span>
        <el-input
          v-model="newFileName"
          autocomplete="off"
          placeholder="请输入"
        ></el-input>
      </div>
      <div class="creat-btn">
        <el-button type="primary" size="mini" @click="createFile()">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="moveVisible"
      v-if="moveVisible"
      width="40%"
      :destroy-on-close="true"
      title="移动到"
      v-dialogDrag
      @close="moveCloseFile()"
    >
      <div class="middle-path move-router">
        <div v-if="moveRoadName.length > 0" @click="returnMoveFile(moveRoadName[moveRoadName.length - 2])"><span>返回上一级</span>&nbsp;&nbsp;|&nbsp;&nbsp;</div>
        <div @click="getAllMoveFile()"><span>全部文件</span><span v-if="moveRoadName.length > 0">&nbsp;&nbsp;>&nbsp;&nbsp;</span></div>
        <div v-for="(t,i) in moveRoadName" :key="i" @click="getIntoMoveFile(t,'currentFile')"><span>{{t}}</span><span v-if="i+1 !== moveRoadName.length">&nbsp;&nbsp;>&nbsp;&nbsp;</span></div>
      </div>
      <div class="move-file-scroll">
        
          <div v-for="(t,i) in fileMoveDetailList" :key="i" @click="getIntoMoveFile(t.objectName)">
            <template v-if="t.objectName !== multipleSelection[0]['objectName']">
              <img :src="`./../../../static/Common/img/file-2x.png`"/>
              <span>{{t.objectName}}</span>
            </template>
          </div>
        
      </div>
      <div class="move-btn">
        <el-button size="mini" @click="moveCloseFile()">取消</el-button>
        <el-button type="primary" size="mini" @click="moveObjectData()">移动到此</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { awaitWrap, checkNotNull,transformTimestamp } from "@/lib";
import { 
createDir,
detailObject,
getAllObjectsByPrefix,
getAllObjectsByType,
moveObject,
removeObjects,
renameObject,
searchObjects,
uploadObjects,
analysis,
analysisLogPage
} from "@/api/IntelSupervision";
import {
  getDataByType
} from "@/api";
export default {
  components: {},
  data() {
    return {
      fileUrl: require('./../../../static/Common/img/file.png'),
      ortherUrl: require('./../../../static/Common/img/orther.png'),
      pdfUrl: require('./../../../static/Common/img/pdf.png'),
      picUrl: require('./../../../static/Common/img/pic.png'),
      txtUrl: require('./../../../static/Common/img/txt.png'),
      vedioUrl: require('./../../../static/Common/img/vedio.png'),
      wordUrl: require('./../../../static/Common/img/word.png'),
      pptUrl: require('./../../../static/Common/img/ppt.png'),
      excelUrl: require('./../../../static/Common/img/excel.png'),
      ortherBigUrl: require('./../../../static/Common/img/other-big.png'),
      pdfBigUrl: require('./../../../static/Common/img/pdf-big.png'),
      picBigUrl: require('./../../../static/Common/img/pic-big.png'),
      txtBigUrl: require('./../../../static/Common/img/txt-big.png'),
      vedioBigUrl: require('./../../../static/Common/img/vedio-big.png'),
      wordBigUrl: require('./../../../static/Common/img/word-big.png'),
      pptBigUrl: require('./../../../static/Common/img/ppt-big.png'),
      excelBigUrl: require('./../../../static/Common/img/excel-big.png'),
      activeMenu:'',
      activeColor:'#409EFF',
      newFileName:'',
      visible:false,
      resetFileName:'',
      openeds:['1-1'],
      toggle:true,
      showFile:true,
      roadName:[],
      input:'',
      multipleSelection:[],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pages: 0,
      fileList:[],
      tableData: [],
      moveVisible:false,
      moveRoadName:[],
      fileSigleDetail:{},
      fileMoveDetailList:[],
      fileDetailList:[],
      fileTypeList:[],
      fileType:'',
      pshName:'',
      state:'',
      analysisList:[]
    };
  },
  methods: {
    getImgSrc(type,size){
      let h = type.split('/')[1]
      if(h == 'ppt' || h == 'pptx'){
        if(size == 'big'){
          return this.pptBigUrl
        }else{
          return this.pptUrl
        }
      }else if(h == 'png' || h == 'jpg' || h == 'jpeg' || h == 'gif') {
        if(size == 'big'){
          return this.picBigUrl
        }else{
          return this.picUrl
        }
      }else if(['avi','mpg','mlv','mpe','mpeg','dat','mp4'].includes(h)) {
        if(size == 'big'){
          return this.vedioBigUrl
        }else{
          return this.vedioUrl
        }
      }else if(h == 'word') {
        if(size == 'big'){
          return this.wordBigUrl
        }else{
          return this.wordUrl
        }
      }else if(h == 'txt') {
        if(size == 'big'){
          return this.txtBigUrl
        }else{
          return this.txtUrl
        }
      }else if(h == 'pdf') {
        if(size == 'big'){
          return this.pdfBigUrl
        }else{
          return this.pdfUrl
        }
      }else if(h == 'xls' || h == 'xlsx' || h == 'excel') {
        if(size == 'big'){
          return this.excelBigUrl
        }else{
          return this.excelUrl
        }
      }else {
        if(size == 'big'){
          return this.ortherBigUrl
        }else{
          return this.ortherUrl
        }
      }
    },
     handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      toggleTo(){
        this.toggle = !this.toggle;
      },
      getSize(limit){
        if(limit == 0) return '0M'
        let size = "";
        if(limit < 0.1 * 1024){                           
            size = limit.toFixed(2) + "B"
        }else if(limit < 0.1 * 1024 * 1024){           
            size = (limit/1024).toFixed(2) + "KB"
        }else if(limit < 0.1 * 1024 * 1024 * 1024){       
            size = (limit/(1024 * 1024)).toFixed(2) + "MB"
        }else{                                            
            size = (limit/(1024 * 1024 * 1024)).toFixed(2) + "GB"
        }
    
        let sizeStr = size + "";                      
        let index = sizeStr.indexOf(".");                    
        let dou = sizeStr.substr(index + 1 ,2)            
        if(dou == "00"){                                         
            return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
        }
        return size;
      },
      // 获取当前路径
      getCurrentRoad(){
        return this.roadName.length > 0 ? this.roadName.join('/') : '/'
      },
      // 移动文件获取当前路径
      getCurrentMoveRoad(){
        return this.moveRoadName.length > 0 ? this.moveRoadName.join('/') : '/'
      },
      // 更新当前路径下的文件
      getCurrentRoadList(){
        this.getAllObjectsByPrefixData();
      },
      selectNav(v){
        this.activeMenu = v;
        this.roadName = [];
        this.activeColor = '#409EFF';
        this.getAllObjectsByTypeData(v)
      },
      // 上传
      async handleFileChange(file, fileList){
        console.log(file)
        if (file.status !== 'ready') return;
        let formData = new FormData()
        let fileA = file.raw
        formData.append('bucketName', 'base-bucket')
        formData.append('multipartFiles', fileA)
        formData.append('prefix', this.getCurrentRoad())
        // let params = {
        //   bucketName:'base-bucket',
        //   multipartFiles: [fileA],
        //   prefix:this.getCurrentRoad()
        // }
        let t = (await awaitWrap(uploadObjects(formData)))[1] || {};
        if (checkNotNull(t) && checkNotNull(t["data"])) {
          this.getCurrentRoadList()
        }
      },
      // 下载
      async downLoadFile(){
        const _this = this;
        let objectNames = [];
        let prefix;
        _this.multipleSelection.map((r) => {
          if(r.contentType !== 'dir'){
            objectNames.push(r.objectName)
            prefix = r.prefix
          }
        })
        if(objectNames.length == 0){
          _this.$message({
            message: '不能下载文件夹，请选择文件！',
            type: 'warning'
          });
          return false;
        }else{
          window.open(`http://192.168.18.240:19011/archivesManage/downloadObjects?bucketName=base-bucket&objectNames=${objectNames.join(',')}&prefix=${prefix}`);
        }
      },
      // 删除
      async deleteFile(){
        if(this.multipleSelection.length == 0) {
          this.$message({
            message: '请选择文件或文件夹进行删除！',
            type: 'warning'
          });
        }else{
          let r = []
          this.multipleSelection.map((t) => {
            r.push(t.objectName);
          })
          let param = {
            bucketName:'base-bucket',
            objectNames:r.join(','),
            prefix:this.multipleSelection[0]['prefix']
          }
          let t = (await awaitWrap(removeObjects(param)))[1] || {};
          if (checkNotNull(t) && checkNotNull(t["data"])) {
            if(this.activeMenu){
              this.getAllObjectsByTypeData(this.activeMenu)
            }else{  
              this.getCurrentRoadList()
            }
          }
        }
      },
      // 移动打开弹窗
      moveFile(){
        if(this.multipleSelection.length !== 1){
          this.$message({
            message: '请选择一个文件进行移动！',
            type: 'warning'
          });
        }else{
          this.moveVisible = true;
          this.getAllMoveFile();
        }
      },
      // 移动关闭弹出
      moveCloseFile(){
        this.fileMoveDetailList = [];
        this.moveRoadName = [];
        this.moveVisible = false;
      },
      closeMoveFile(){
        this.visible = false;
        this.newFileName = '';
      },
      closeCreateFile(){
        this.visible = false;
        this.newFileName = '';
      },
      btnCreateFile(){
        this.visible = true;
      },
      // 新建文件夹
      async createFile(){
        let param = {
          bucketName:'',
          objectName:this.roadName.join('/') + '/' + this.newFileName
        }
        let t = (await awaitWrap(createDir(param)))[1] || {};
        if (checkNotNull(t) && checkNotNull(t["data"])) {
          this.newFileName = '';
          this.visible = false;
          this.getCurrentRoadList()
        }
      },
      // 点击重命名按钮
      resetName(){
        if(this.multipleSelection.length !== 1) {
          this.$message({
            message: '请选择一个文件或文件夹进行重命名！',
            type: 'warning'
          });
        }else{
          let r = []
          this.tableData.map((t) => {
            if(t.objectName == this.multipleSelection[0]['objectName']){
              t.modifyType = true;
              this.resetFileName = this.multipleSelection[0]['objectName'];
            }
            r.push(t);
          })
          this.tableData = r;
        }
      },
      // 重命名发起请求
      async resetFileAsny(row){
        let param = {
          bucketName:'base-bucket',
          prefix:row.prefix,
          objectName:row.objectName,
          srcObjectName:this.resetFileName
        }
        let t = (await awaitWrap(renameObject(param)))[1] || {};
        if(this.activeMenu){
          this.getAllObjectsByTypeData(this.activeMenu)
        }else{  
          this.getCurrentRoadList()
        }
      },
      // 取消重命名
      cancelResetFile(){
        if(this.activeMenu){
          this.getAllObjectsByTypeData(this.activeMenu)
        }else{  
          this.getCurrentRoadList()
        }
      },
      // 文件夹返回上一级
      returnFile(name){
        this.roadName.pop();
        this.getAllObjectsByPrefixData();
      },
      // 查询全部文件
      getAllFile(){
        this.activeColor = '#fff';
        this.roadName = [];
        this.activeMenu = '';
        this.getAllObjectsByPrefixData();
      },
      // 查询当前文件夹下级文件
      getIntoFile(name,type){
        if(type){
          let roadName = this.roadName.slice(0,this.roadName.findIndex(item => item == name) + 1);
          this.roadName = roadName;
        }else{
          this.roadName.push(name);
        }
        this.getAllObjectsByPrefixData();
      },
      // 文件前置查询
      async getAllObjectsByPrefixData(){
        let param = {
          bucketName:'',
          prefix:this.getCurrentRoad()
        }
        let t = (await awaitWrap(getAllObjectsByPrefix(param)))[1] || {};
          if (checkNotNull(t) && checkNotNull(t["data"])) {
            t = t["data"];
          } else {
            t = [];
        }
        this.tableData = t;
      },
      // 移动文件夹返回上一级
      returnMoveFile(name){
        this.moveRoadName.pop();
        this.getAllMoveObjectsByPrefixData(name);
      },
      // 查询全部移动文件
      getAllMoveFile(){
        this.moveRoadName = [];
        this.getAllMoveObjectsByPrefixData();
      },
      // 移动时查询当前文件夹下级文件
      getIntoMoveFile(name,type){
        if(type){
          let moveRoadName = this.moveRoadName.slice(0,this.moveRoadName.findIndex(item => item == name) + 1);
          this.moveRoadName = moveRoadName;
        }else{
          this.moveRoadName.push(name);
        }
         this.getAllMoveObjectsByPrefixData(name);
      },
      // 移动文件夹查询
      async getAllMoveObjectsByPrefixData(name){
        let param = {
          bucketName:'',
          prefix:this.getCurrentMoveRoad()
        }
        let t = (await awaitWrap(getAllObjectsByPrefix(param)))[1] || {};
          if (checkNotNull(t) && checkNotNull(t["data"])) {
            t = t["data"];
          } else {
            t = [];
        }
        let r = t.filter((b) => {
          return b.isDir == 'true'
        })
        this.fileMoveDetailList = r;
      },
      // 文件根据类型查询
      async getAllObjectsByTypeData(type){
        let param = {
          bucketName:'',
          objectType:type
        }
        let t = (await awaitWrap(getAllObjectsByType(param)))[1] || {};
          if (checkNotNull(t) && checkNotNull(t["data"])) {
            t = t["data"];
          } else {
            t = [];
        }
        this.tableData = t;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        if(this.multipleSelection.length == 1 && this.multipleSelection[0]['isDir'] == 'true'){
          this.getFilDetailData(this.multipleSelection[0]['objectName'])
        }else if(this.multipleSelection.length == 1 && this.multipleSelection[0]['isDir'] == 'false'){
          this.getDetailObjectData(this.multipleSelection[0]['objectName'],this.multipleSelection[0]['prefix'])
        }
      },
      // 文件详情：选中一个文件夹查询下级文件
      async getFilDetailData(name){
        let param = {
          bucketName:'',
          prefix:this.getCurrentRoad() + '/' + name
        }
        let t = (await awaitWrap(getAllObjectsByPrefix(param)))[1] || {};
        if (checkNotNull(t) && checkNotNull(t["data"])) {
          t = t["data"];
        } else {
          t = [];
        }
        let r = t.filter((b) => {
          return b.isDir == 'true'
        })
        this.fileDetailList = r;
      },
      // 文件详情信息
      async getDetailObjectData(name,src){
        let param = {
          bucketName:'base-bucket',
          prefix:src,
          objectName:name
        }
        let t = (await awaitWrap(detailObject(param)))[1] || {};
        if (checkNotNull(t) && checkNotNull(t["data"])) {
          t = t["data"];
        } else {
          t = {};
        }
        this.fileSigleDetail = t;
      },
      // 文件移动请求
      async moveObjectData(){
        let param = {
          bucketName:'base-bucket',
          srcBucketName:'base-bucket',
          srcObjectName:this.getCurrentMoveRoad(),
          prefix:this.multipleSelection[0]['prefix'],
          objectName:this.multipleSelection[0]['objectName']
        }
        let t = (await awaitWrap(moveObject(param)))[1] || {};
        if (checkNotNull(t) && checkNotNull(t["data"])) {
          this.$message({
            message: '移动成功！',
            type: 'success'
          });
          this.getAllObjectsByPrefixData();
          this.moveVisible = false;
          this.activeColor = '#fff';
          this.roadName = [];
          this.activeMenu = '';
        }
      },
      // 搜索
      async search(){
        if(!this.input){
          if(this.activeMenu){
            this.getAllObjectsByTypeData(this.activeMenu)
          }else{  
            this.getCurrentRoadList()
          }
          return false;
        }
        let param = {
          bucketName:'base-bucket',
          objectName:this.input,
          prefix:this.getCurrentRoad()
        }
        let t = (await awaitWrap(searchObjects(param)))[1] || {};
        if (checkNotNull(t) && checkNotNull(t["data"])) {
          t = t['data']
        }else{
          t = []
        }
        this.tableData = t
      },
      //解析
      async analysisFile(){
        const _this = this;
        if(_this.multipleSelection.length !== 1){
          _this.$message({
            message: '一次只能解析一个文件！',
            type: 'warning'
          });
          return false
        }
        if(_this.multipleSelection[0]['isDir'] == 'true'){
          _this.$message({
            message: '请选择文件进行解析！',
            type: 'warning'
          });
          return false
        }
        if(!['ppt','pptx','word','txt','pdf','xls','xlsx','excel'].includes(_this.multipleSelection[0]['contentType'].split('/')[1])){
          _this.$message({
            message: '该文件类型不支持解析！',
            type: 'warning'
          });
          return false
        }
        let param = {
          fileName:_this.multipleSelection[0]['objectName'],
          prefix:_this.multipleSelection[0]['prefix']
        }
        _this.$message({
          message: `正在对文件(${_this.multipleSelection[0]['objectName']})进行解析！`,
          type: 'info'
        });
        let t = (await awaitWrap(analysis(param)))[1] || {};
        if (checkNotNull(t) && checkNotNull(t["data"])) {
          if(typeof t["data"] == 'string'){
            setTimeout(() => {
              _this.$message({
                message: t["data"],
                type: 'error'
              });
            },3000)
          }else{
            _this.$message({
              message: `文件(${_this.multipleSelection[0]['objectName']})解析已完成!`,
              type: 'success'
            });
          }
        }else{
          _this.$message({
            message: `文件(${_this.multipleSelection[0]['objectName']})解析失败！`,
            type: 'error'
          });
        }
      },
      // 文件类型获取
      async getFileTypeList(){
        let t = (await awaitWrap(
          getDataByType({ type: "file_type" })
        ))[1];
        if (checkNotNull(t) && checkNotNull(t["data"])) {
          this.fileTypeList = t.data
        }else{
          this.fileTypeList = []
        }
      },
      //翻页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.analysisLogPageData();
      },
      // 解析记录
      async analysisLogPageData(){
        let params = {
          fileType:this.fileType,
          pageCurrent:this.currentPage,
          pageSize:this.pageSize,
          pshName:this.pshName,
          state:this.state
        }
        let t = (await awaitWrap(
          analysisLogPage(params)
        ))[1];
        this.analysisList = t.data.records;
        this.total = t.data.total;
      },
      showAnalysis(){
        this.showFile = !this.showFile;
        if(!this.showFile){
          this.analysisLogPageData();
        }
      },
      getTime(t){
        return transformTimestamp(t)
      },
      searchFileList(){
        this.currentPage = 1;
        this.analysisLogPageData();
      }
  },
  created() {
    this.getAllFile();
    this.getFileTypeList();
    // 设备类型
    // let fileTypeList = (await awaitWrap(
    //   getDataByType({ type: "file_type" })
    // ))[1];
    // console.log(fileTypeList)
  },
  computed: {},
  watch: {}
};
</script>
<style lang="scss" scoped>
.file-container {
  height: 100%;
  position: relative;
  overflow-y: hidden;
  overflow-x: hidden;
  > .left-search {
    float: left;
    height: 100%;
    width: 200px;
    border-right: 1px solid #394688;
    box-sizing: border-box;
    .el-submenu__title i{
      color: #fff;
    }
    .el-menu-item i{
      color: #fff;
    }
    .el-submenu .is-active i {
      color:#409EFF;
    }
  }
  > .middle-content {
    float: left;
    height: 100%;
    width: calc(100% - 200px);
    box-sizing: border-box;
    padding-left: 20px;
    overflow-y: hidden;
    color: #fff;
    >.middle-flex{
      overflow: hidden;
      width: 100%;
      height: calc(100% - 40px);
      >div{
        float: left;
        height: 100%;
      }
      >div:nth-child(1){
        border-right: 1px solid #212F7A;
        box-sizing: border-box;
      }
      >.expand{
        width: calc(100% - 220px);
      }
      >.putAway{
        width: calc(100% - 60px);
      }
      >.file-detail{
        width: 200px;
        padding-left: 20px;
      }
      >.file-toggle{
        width: 60px;
        >div{
          cursor: pointer;
        }
      }
    }
  }
  >.jx-table{
    height: 100%;
    width: 100%;
  }
}
.file-detail-title{
  overflow: hidden;
  margin-top: 20px;
  >div{
    float: right;
    color: #96BEF9;
  }
}
/deep/ .el-menu{
  background-color: inherit;
  border-right: none;
  
}
/deep/ .el-submenu__title,.el-menu-item{
  color: #fff;
}
/deep/ .is-active{
  color: #409EFF;
}
/deep/ .el-submenu__title:hover{
  background-color: #192681;
}
/deep/ .el-menu-item:focus,/deep/ .el-menu-item:hover{
  background-color: #192681;
}
.middle-content /deep/ .el-table{
  border: none !important;
}
.middle-content /deep/ .el-table th{
  background-color: #101F70 !important;
}
/deep/ .right-search{
  float: right;
  .el-input--mini {
    border-radius: 50px;
    overflow: hidden;
    background: #152585;
    border: 1px solid #2F4FD6;
  }
  .el-input__inner{
    border: none !important;
  }
  .el-input-group__append{
    background: #152585;
    margin: 0;
    border: none;
    color: #fff;
    cursor: pointer;
  }
}
.middle-btn {
  float: left;
  overflow: hidden;
  border: 1px solid #2F4FD6;
  width: fit-content;
  border-radius: 50px;
  padding: 4px 0;
  >div{
    float: left;
    padding: 0px 20px;
    border-right: 1px solid #2F4FD6;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
  }
  >div:hover{
    color: #409EFF;
  }
  >div:last-child{
    border: none;
  }
}
.not-multip-btn{
  float: left;
  overflow: hidden;
  // button{
  //   height: 30px;
  //   line-height: 30px;
  // }
}
.middle-path{
  overflow: hidden;
  font-size: 14px;
  color:#fff;
  margin: 20px 0;
  >div{
    float: left;
    color: #96BEF9;
    >span{
      cursor: pointer;
    }
  }
  >div:last-child{
    >span{
      color:#fff;
    }
  }
}
.middle-table{
  height: calc(100% - 100px);
  overflow-y: scroll;
}

.default-detail{
  height: calc(100% - 40px);
  display: flex;
  align-items: center;
  justify-content: center;
  >div{
    width: fit-content;
  }
  .default-des{
    color: #8D9AB0;
    opacity: 0.5;
  }
}
.multiple-detail{
  height: calc(100% - 40px);
  >div{
    width: 140px;
    height: 140px;
    margin: 40px auto;
    img{
      height: 100%;
      width: 100%;
    }
  }
}
.radio-detail{
  height: calc(100% - 40px);
  >div:nth-child(1){
    height: 60px;
    font-size: 16px;
    line-height: 60px;
    margin-bottom: 20px;
    border-bottom: 1px solid #394688;
    >img{
      vertical-align: middle;
    }
    >span{
      vertical-align: middle;
      font-weight: 600;
    }
  }
  >div:nth-child(2){
    height: calc(100% - 80px);
    overflow-y: scroll;
    margin-left: 20px;
    color: #96BEF9;
    >div{
      margin-bottom: 10px;
      font-size: 14px;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
    }
  }
}
.upload-demo{
  float: left;
  overflow: hidden;
  margin-right: 14px;
}
.file-name img{
  vertical-align: middle;
}
.creat-btn{
  margin: 40px auto 0 auto;
  width: fit-content;
}
.file-sigle-detail{
  .file-sigle-con{
    width: 180px;
    margin: 0 auto;
  }
  img{
    display: block;
    margin: 20px auto;
    width: 180px;
    height: 200px;
  }
  .title{
    font-size: 16px;
    color: #fff;
    font-weight: 600;
    word-break:break-all;
  }
  p{
    color: #96BEF9;
    font-size: 14px;
    margin-top: 10px;
    word-break:break-all;
  }
}
.move-btn{
  width: fit-content;
  float: right;
}
.move-router{
  margin-top: 0;
}
.move-file-scroll{
  max-height: 400px;
  min-height: 200px;
  overflow-y: scroll;
  font-size: 16px;
  margin-left: 20px;
  img{
    vertical-align: middle;
    cursor: pointer;
  }
  span{
    vertical-align: middle;
    cursor: pointer;
  }
  span:hover{
    color: #409EFF;
  }
  >div{
    margin-bottom: 14px;
  }
}
.el-table tr .el-input, .el-table tr .el-input__inner, .el-table td .el-input, .el-table td .el-input__inner{
  width: auto !important;
}
</style>
