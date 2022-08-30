<!--  事件分发  -->
<template>
  <div id="eventDispatchMap" :class="['eventDispatch-container system-container',{'map_expand':expandMap,'table_expand':expandTable }]">
    <div class="content_left">
      <div>
        <div class="expand_table_button" @click="expandTable = !expandTable"></div>
      </div>
      <el-table ref="multipleTable" :data="tableData" height="80%" v-if="activeTabName=='distribute'">
        <el-table-column type="index" width="60" label="序号" align="center" fixed="left">
        </el-table-column>
        <el-table-column prop="id" width="100" label="事件编码" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="alarmType" label="报警类型" width="100" align="center" :formatter="alarmTypeFormat" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="pointName" label="报警点位名称" min-width="180" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="addr" label="事件位置" min-width="180" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="testTime" label="报警时间" min-width="180" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="alarmInfo" label="事件内容" min-width="180" show-overflow-tooltip align="center">
          <!--  :formatter="alarmInfoFormat"-->
          <template slot-scope="scope">
            <span v-if="scope.row.alarmType == 2">
              <span v-for="(item, index) in JSON.parse(scope.row.alarmInfo)" :key="index">
                <span v-if="item.factorStatus > 0" :class="myClass(item.factorStatus)">
                  <span>{{ item.factorName }}</span>
                  <span>{{ item.factorValue }}</span>
                  <span>(</span><span>{{ item.factorThreshold }}</span><span>);</span>
                </span>
              </span>
            </span>
            <span v-if="scope.row.alarmType == 1">
              <span v-for="(item, index) in JSON.parse(scope.row.alarmInfo)" :key="index">
                <span style="color:red">{{ item.deviceAlarmInfoTs }}</span>
              </span>
            </span>
            <span v-if="scope.row.alarmType == 4 || scope.row.alarmType == 5">
              <span>{{ scope.row.alarmInfo }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="eventState" label="任务状态" width="140" align="center" :formatter="eventStateFomatter" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="pshName" label="所属排水户" min-width="160" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="pshType" label="排水户类型" align="center" width="160" :formatter="pshTypeFomatter">
        </el-table-column>
        <el-table-column prop="street" width="160" label="所属街道" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table ref="multipleTable" :data="tableData" height="80%" v-if="activeTabName=='back'">
        <el-table-column type="index" width="60" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="id" width="100" label="事件编码" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="alarmType" label="报警类型" width="100" align="center" :formatter="alarmTypeFormat" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="pointName" label="报警点位名称" min-width="180" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="addr" label="事件位置" min-width="180" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="testTime" label="报警时间" min-width="180" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="alarmInfo" label="事件内容" min-width="180" show-overflow-tooltip align="center">
          <!--  :formatter="alarmInfoFormat"-->
          <template slot-scope="scope">
            <span v-if="scope.row.alarmType == 2">
              <span v-for="(item, index) in JSON.parse(scope.row.alarmInfo)" :key="index">
                <span>{{ item.factorName }}</span>
                <span>{{ item.factorValue }}</span>
                <span>(</span><span>{{ item.factorThreshold }}</span><span>);</span>
              </span>
            </span>
            <span v-if="scope.row.alarmType == 1">
              <span v-for="(item, index) in JSON.parse(scope.row.alarmInfo)" :key="index">
                <span>{{ item.deviceAlarmInfo }}</span>
                <span>{{ item.deviceAlarmLevel }}</span>
              </span>
            </span>
            <span v-if="scope.row.alarmType == 4 || scope.row.alarmType == 5">
              <span>{{ scope.row.alarmInfo }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="eventState" label="任务状态" width="140" align="center" :formatter="eventStateFomatter">
        </el-table-column>

        <el-table-column prop="pshName" label="所属排水户" width="160" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="pshType" label="排水户类型" align="center" width="160" :formatter="pshTypeFomatter">
        </el-table-column>
        <el-table-column prop="street" width="160" label="所属街道" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="paginationContent">
        <el-pagination layout="total,prev, pager, next" :page-size="pageSize" :current-page="currentPage" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
    <!-- 地图展开 -->
    <div class="expand_map_button" @click="expandMap = !expandMap"></div>
    <!-- 运维人员选择 -->
    <ul class="personnelSelect">
      <li 
        v-for="item in personnelTypeList" 
        :key="item['code']" 
        @click="personnelSelect(item['code'])"
        :class="{'active': activePerson == item['code']}"
      >{{item['name']}}</li>
    </ul>
    <!-- 运维人员状态图例 -->
    <div class="operationStatus_legend">
      <div>空闲</div>
      <div>运维</div>
    </div>
    <!-- 地图上查询条件 -->
    <el-form ref="mapFormData" :inline="true" :model="mapFormData" class="mapFormData dialog_form" label-width="160px">
      <el-form-item label="所属街道：">
        <el-cascader v-model="mapFormData.sub" :options="streesOptions" :props="streesProps"></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="查看详情" :visible.sync="dialogDetailsVisible" :style="`--height:${browserHeight}px`">
      <div class="event_detail">
        <div class="event_detail_base_info">
          <!-- 事件信息 -->
          <div class="event_info_content">
            <!-- 运维上报 -->
            <template v-if="baseInfo.alarmType == 4">
              <!-- <template v-if="activeTabName == 'distribute'"> -->
              <el-row>
                <el-col :span="12"><span>事件编码: </span>{{baseInfo.id}}</el-col>
                <el-col :span="12"><span>上报时间: </span>{{baseInfo.testTime}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><span>是否短信提醒: </span>{{baseInfo.isPushMsg}}</el-col>
                <el-col :span="12"><span>上报人: </span>{{baseInfo.reportPerson}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><span>事件类型: </span>{{baseInfo.eventState}}</el-col>
                <el-col :span="12"><span>事件位置: </span>{{baseInfo.addr}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="24"><span>事件内容: </span>{{baseInfo.alarmInfo}}</el-col>
              </el-row>
              <!-- </template> -->
            </template>
            <!-- 其他 -->
            <template v-else>
              <el-row>
                <el-col :span="12"><span>事件编码: </span>{{baseInfo.id}}</el-col>
                <el-col :span="12"><span>报警类型: </span>{{baseInfo.eventState}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><span>报警点位名称: </span>{{baseInfo.pointName}}</el-col>
                <el-col :span="12"><span>报警时间: </span>{{baseInfo.testTime}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><span>所属排水户: </span>{{baseInfo.pshName}}</el-col>
                <el-col :span="12"><span>排水户类型: </span>{{pshTypeFomatter(baseInfo)}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><span>所属街道: </span>{{baseInfo.street}}</el-col>
                <el-col :span="12"><span>事件位置: </span>{{baseInfo.addr}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="24"><span>事件内容: </span>{{baseInfo.alarmInfo}}</el-col>
              </el-row>
            </template>
            <!-- 图片 运维上报、视频-->
            <template v-if="baseInfo.alarmType == 4 || baseInfo.alarmType == 3">
              <el-row>
                <el-col :span="24"><span>照片: </span></el-col>
              </el-row>
              <imgCarousel :img="baseInfo.alarmImgUrl"></imgCarousel>
            </template>
          </div>

          <!-- 处理信息 -->
          <div class="process_info_content" v-if="activeTabName == 'back'">
            <el-row>
              <el-col :span="12"><span>处理人: </span>{{processInfo.fromPerson}}</el-col>
              <el-col :span="12"><span>联系方式: </span>{{processInfo.fromPersonTel}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="12"><span>处理时间: </span>{{processInfo.createTime}}</el-col>
              <el-col :span="12"><span>处理状态: </span>已退回</el-col>
            </el-row>
            <el-row>
              <el-col :span="24"><span>处理结果: </span>{{processInfo.handlerResult}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="24"><span>照片: </span></el-col>
            </el-row>
            <imgCarousel :img="processInfo.handlerImgStr"></imgCarousel>
          </div>
        </div>

        <!-- 事件日志 -->
        <div class="event_log_content">
          <p class="event_log_content_tit">事件日志</p>
          <el-timeline class="event_log">
            <el-timeline-item v-for="(info, index) in logoInfo" :key="index" placement="top">
              <div class="event_log_time">{{info.createTime.split(" ")[0]}} <br /> {{info.createTime.split(" ")[1]}}</div>
              <div class="event_log_info">
                <p>上报人：{{ info.fromPerson }}</p>
                <p>{{ eventStateFomatter(info.eventState) }}</p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>

      <!-- 分发 -->
      <el-dialog title="分发" :visible.sync="innerVisible" append-to-body width="600px">
        <el-form ref="form" class="dialog_form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属部门：">
                <el-select v-model="unitValue" placeholder="请选择" clearable @change="changeset">
                  <el-option v-for="(item, index) in unitOptions" :key="index" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="运维人员：">
                <el-select v-model="personValue" placeholder="请选择" clearable :disabled="disabled">
                  <el-option v-for="item in personOptions" :key="item.id" :label="item.personName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="是否发送短信：" style="width:100%">
            <el-radio v-model="isPushMsg" label="1">是</el-radio>
            <el-radio v-model="isPushMsg" label="0">否</el-radio>
          </el-form-item>
          <el-form-item v-if="isPushMsg == 1" label="" style="width:100%">
            <el-input type="textarea" placeholder="请输入内容" v-model="msg">
            </el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" placeholder="请输入内容" v-model="remarks">
            </el-input>
          </el-form-item>
        </el-form>

        <div slot="footer">
          <el-button @click="innerVisible = false">取消</el-button>
          <el-button type="primary" @click="dispatchComfirm">确认</el-button>
        </div>
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailsVisible = false">取 消</el-button>
        <el-button type="primary" @click="openInnerBox">分发</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getDispatchTable,
  getDispatchDetailInfo,
  getDispatchDetailInfoLog,
  getAllDept,
  getByUnit,
  dispatchAlarm,
  getReturnTable,
  getDispatchBackDetailInfo,
  getDispatcBackProcessInfo,
  getDispatcBackDetailInfoLog
} from "@/api/drainageOperation";
import { getAreaBySub } from "@/api/IntelSupervision";
import { mapState } from "vuex";
import {
  checkNotNull,
  alarmTypeFormat,
  alarmStatusFormat,
  pshTypeFomatter,
  alarmInfoFormat,
  eventStateFomatter,
  myClass,
  awaitWrap
} from "@/lib";

import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style, Text } from "ol/style";

export default {
  data() {
    return {
      formLabelWidth: "100px",
      tableData: [],
      dialogDetailsVisible: false,
      innerVisible: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pages: 0,
      baseInfo: {},
      processInfo: {},
      logoInfo: [], //时间线
      unitOptions: [],
      unitValue: "",
      personOptions: [],
      personValue: "",
      disabled: true,
      remarks: "", //备注
      isPushMsg: "0",
      msg: "",
      alarmId: "",
      browserHeight: 0,
      expandMap: false,
      expandTable: false,
      personnelTypeList: [
        { name: "维", code: "1" },
        { name: "街", code: "2" },
        { name: "区", code: "3" }
      ],
      activePerson: 1,
      streesOptions: [],
      streesProps: {
        value: "areaCode",
        label: "areaName",
        emitPath: false,
        checkStrictly: true
      },
      mapFormData: {
        sub: ""
      }
    };
  },
  methods: {
    alarmTypeFormat,
    alarmStatusFormat,
    pshTypeFomatter,
    alarmInfoFormat,
    eventStateFomatter,
    myClass,
    changeset() {
      if (this.unitValue != "") {
        this.getByUnitData();
        this.disabled = false;
      }
      this.personValue = "";
    },
    personnelSelect(code) {
      this.activePerson = code;
    },
    //获取弹窗信息
    async getBaseInfo(id) {
      const _this = this;
      _this.baseInfo = {};
      _this.logoInfo = {};
      let eventData, logData, processData;
      // 待分发
      if (_this.activeTabName == "distribute") {
        eventData = await getDispatchDetailInfo({ alarmId: id });
        logData = await getDispatchDetailInfoLog({ alarmId: id });
      } else if (_this.activeTabName == "back") {
        // 退回
        eventData = await getDispatchBackDetailInfo({ alarmId: id });
        logData = await getDispatcBackDetailInfoLog({ alarmId: id });
        processData = await getDispatcBackProcessInfo({ alarmId: id });
      }

      // 事件信息
      if (checkNotNull(eventData) && checkNotNull(eventData["data"])) {
        _this.baseInfo = eventData.data;
        _this.baseInfo.alarmInfo = this.alarmInfoFormat(eventData.data);
      }

      // 日志信息
      if (checkNotNull(logData) && checkNotNull(logData["data"])) {
        _this.logoInfo = logData.data;
      }
      if (checkNotNull(processData) && checkNotNull(processData["data"])) {
        _this.processInfo = processData.data;
      }

      _this.dialogDetailsVisible = true;
    },

    //打开内嵌弹窗
    openInnerBox() {
      this.getAllDeptData();

      this.innerVisible = true;
    },
    //单位
    async getAllDeptData() {
      const res = await getAllDept();
      this.unitOptions = res.data;
    },
    //单位运维人员
    async getByUnitData() {
      let params = {
        unit: this.unitValue
      };
      const res = await getByUnit(params);
      this.personOptions = res.data;
    },
    //获取表格数据
    async getTableData() {
      let params = {
        pageCurrent: this.currentPage,
        pageSize: this.pageSize
      };
      let res;
      if (this.activeTabName == "distribute") {
        res = await getDispatchTable(params);
      } else if (this.activeTabName == "back") {
        res = await getReturnTable(params);
      }

      this.tableData = res.data.records;
      this.total = res.data.total;
      this.pages = res.data.pages;
    },

    //查看详情
    handleClick(val) {
      this.alarmId = val.id;
      this.getBaseInfo(val.id);
    },

    //切换当前页的容量
    handleSizeChange(val) {
      this.pageSize = val;
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },
    //弹框内确认 分发
    async dispatchComfirm() {
      let toPersonArr = this.personOptions.map(v => {
        return v.id == this.personValue ? v.personName : "";
      });
      let params = {
        alarmId: this.alarmId,
        handlerRemark: this.remarks,
        isPushMsg: this.isPushMsg,
        msg: this.msg,
        toPerson: toPersonArr[0],
        toPersonId: this.personValue,
        toPersonUnit: this.unitValue
      };
      const res = await dispatchAlarm(params);

      if (res.code == 0) {
        this.$message({
          message: "事件分发成功！",
          type: "success"
        });
        this.innerVisible = false;
        this.dialogDetailsVisible = false;
        this.getTableData();
      } else {
        this.innerVisible = false;
        this.$message.error("事件分发失败");
      }
    },

    //查询事件
    queryEvent() {
      this.getTableData();
    },
    //继续派单
    dispatchContinue() {},
    // 区、街道
    async getAreaBySub() {
      const _this = this;
      let streeList = (await awaitWrap(getAreaBySub()))[1] || [];

      if (checkNotNull(streeList) && checkNotNull(streeList["data"])) {
        streeList = streeList["data"] || [];
      }

      _this.streesOptions = streeList || [];
    },
    // 初始化地图
    initMap() {
      var _this = this;
      _this.mapObj = new Map({
        target: "eventDispatchMap",
        layers: [
          new TileLayer({
            source: new XYZ({
              url:
                "http://t2.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=94c8fdaa0318f9fa88cbbaf2145186e5"
            })
          }),
          new TileLayer({
            source: new XYZ({
              url:
                "http://t2.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=94c8fdaa0318f9fa88cbbaf2145186e5"
            })
          })
        ],
        view: new View({
          center: [114.885702, 25.753308],
          zoom: 12.5,
          maxZoom: 16,
          minZoom: 6,
          projection: "EPSG:4326"
        })
      });

      // 添加鼠标悬浮样式
      _this.mapObj.on("pointermove", function(e) {
        var pixel = _this.mapObj.getEventPixel(e.originalEvent);
        var feature = _this.mapObj.forEachFeatureAtPixel(pixel, function(
          feature
        ) {
          return feature;
        });

        if (
          checkNotNull(feature) &&
          checkNotNull(feature.getProperties().featureType)
        ) {
          _this.mapObj.getTargetElement().style.cursor = "pointer";
        } else {
          _this.mapObj.getTargetElement().style.cursor = "auto";
        }
      });
    }
  },
  mounted() {
    const _this = this;
    _this.getAreaBySub();
    if (this.activeTabName) {
      this.getTableData();
    }

    // 弹框高度
    this.browserHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    this.browserHeight = this.browserHeight * 0.7;

    _this.$nextTick(() => {
      _this.initMap();
    });
  },
  computed: {
    ...mapState({
      activeTabName: state => state.IntelSupervison.activeTabName
    })
  },
  watch: {
    activeTabName(val) {
      if (val) {
        this.getTableData();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.eventDispatch-container {
  height: 92%;
  padding: 0;
  border: 1px solid #2f4fd6;
  position: relative;

  /deep/ .el-dialog__body {
    max-height: var(--height);
  }

  // 地图展开
  &.map_expand {
    .content_left {
      width: 0;
      visibility: hidden;
    }
    .expand_map_button {
      transform: rotate(180deg);
      left: 15px;
    }
  }

  // 表格展开
  &.table_expand {
    border: 0;
    .content_left {
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      .expand_table_button {
        transform: rotate(0deg);
      }
    }
  }

  // 左侧
  .content_left {
    width: 50%;
    // margin: 10px;
    height: calc(100% - 20px);
    background-color: #101f70;
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 3;

    .expand_table_button {
      width: 20px;
      height: 40px;
      background: url(~static/ManageSystem/img/expand_table_button_icon.png)
        no-repeat center center;
      background-size: 100% 100%;
      margin: 10px 10px 10px 0;
      float: right;
      cursor: pointer;
      transform: rotate(180deg);
    }
  }

  .expand_map_button {
    width: 41px;
    height: 47px;
    background: url(~static/ManageSystem/img/expand_map_button_icon.png)
      no-repeat center center;
    background-size: 100% 100%;
    margin: 10px 0;
    cursor: pointer;
    position: absolute;
    bottom: 15px;
    left: calc(50% + 25px);
    z-index: 1;
  }

  // 运维人员选择
  .personnelSelect {
    position: absolute;
    right: 0;
    z-index: 1;
    bottom: 15px;
    display: flex;
    li {
      text-align: center;
      width: 50px;
      height: 54px;
      line-height: 54px;
      margin-right: 15px;
      background: url(~static/ManageSystem/img/personnelSelect_bg.png) no-repeat
        center center;
      background-size: 100% auto;
      color: #89a5ff;
      font-size: 24px;
      cursor: pointer;

      &.active {
        background: url(~static/ManageSystem/img/personnelSelect_active_bg.png)
          no-repeat center center;
        background-size: 100% auto;
        color: #daff00;
      }
    }
  }

  // 运维人员状态图例
  .operationStatus_legend {
    position: absolute;
    z-index: 1;
    bottom: 15px;
    right: 240px;

    display: flex;
    > div {
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      color: #89a5ff;
      padding-left: 42px;
      background: url(~static/ManageSystem/img/operationStatus_icon_1.png)
        no-repeat center left;
      background-size: 33px 30px;
      margin-right: 35px;

      &:nth-child(1) {
        background: url(~static/ManageSystem/img/operationStatus_icon_0.png)
          no-repeat center left;
        background-size: 33px 30px;
      }
    }
  }

  // 查询条件
  .mapFormData {
    position: absolute;
    z-index: 1;
    right: 20px;
    top: 20px;

    /deep/ .el-form-item__label {
      color: #fff;
    }
  }
}
</style>