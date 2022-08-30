<template>
  <!--指标报警统计分析-->
  <div class="indexStatistics-container system-container" :class="{'fullScreenContainer': isFullScreen}">
    <div class="indexSta-footer system-footer">
      <systemPanel title="报警数量"  :class="{'fullScreenBox': alarmNumsBoxConCode.indexOf('3') != -1}" class="alarmNumsBox card-box" v-show="!isFullScreen || (isFullScreen && alarmNumsBoxConCode.indexOf('3') != -1)">
        <!-- 关联地图 -->
        <!-- <span class="icon_1" :class="{'active': alarmNumsBoxRelationCode == '1'}" @click="alarmNumsBoxRelationCodeFun('1')"></span> -->
        <ul class="card_box_contorl">
          <li class="icon_1" v-show="alarmNumsBoxConCode.indexOf('4') == -1" :class="{'active': alarmNumsBoxConCode.indexOf('1') != -1}" @click="contorlFun('alarmNumsBox','1')"></li>
          <!-- 地图下钻 -->
          <li class="icon_2" v-show="alarmNumsBoxConCode.indexOf('4') == -1" :class="{'active': alarmNumsBoxConCode.indexOf('2') != -1}" @click="contorlFun('alarmNumsBox','2')"></li>
          <!-- 放大 -->
          <li class="icon_3" :class="{'active': alarmNumsBoxConCode.indexOf('3') != -1}" @click="contorlFun('alarmNumsBox','3')"></li>
          <!-- 切换列表 -->
          <li class="icon_4" :class="{'active': alarmNumsBoxConCode.indexOf('4') != -1}" @click="contorlFun('alarmNumsBox','4')"></li>
          <!-- 下载导出 -->
          <li class="icon_5" v-if="alarmNumsBoxConCode.indexOf('4') != -1" :class="{'active': alarmNumsBoxConCode.indexOf('5') != -1}" @click="contorlFun('alarmNumsBox','5')"></li>
        </ul>
        <div class="box-content">
            <div v-show="alarmNumsBoxConCode.indexOf('4') == -1" class="alarmNumsBox_map">
              <Map
                :conCodeList="alarmNumsBoxConCode"
                :streetData="streetData"
                @func="getStreetName"
                :mapColorCardinality="mapColorCardinality"
              ></Map>
              <div class="alarm_num_legend_content">
                <p>报警数量</p>
                <p class="alarm_num_legend">
                  <span>0</span>
                  <span>{{mapColorCardinality == 0 ? 100 : mapColorCardinality*4}}</span>
                </p>
            </div>
            </div>
            <div v-show="alarmNumsBoxConCode.indexOf('4') != -1">
              <el-table
                id="alarmTable"
                class="statistical_analysis_table"
                :data="streetData"
                height="calc(100% - 40px)"
                :row-style="{ height: '33px' }"
                :header-row-style="{ height: '33px' }"
                :cell-style="{ padding: '0px', color: '#C5D0D4' }"
                :header-cell-style="{ padding: '0px', color: '#C5D0D4', backgroundColor: 'rgba(28,178,255,.2) !important' }"
              >
                <el-table-column
                  type="index"
                  width="60"
                  label="序号"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="areaName"
                  label="街道名称"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="alramNum"
                  label="报警数量"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </div>
        </div>
      </systemPanel>
      <systemPanel title="当前时刻统计数据" v-show="!isFullScreen || (isFullScreen && curTimeBoxConCode.indexOf('3') != -1)" class="curTimeBox card-box" :class="{'fullScreenBox': curTimeBoxConCode.indexOf('3') != -1}">
        <ul class="card_box_contorl">
          <li class="icon_3" :class="{'active': curTimeBoxConCode.indexOf('3') != -1}" @click="contorlFun('curTimeBox','3')"></li>
          <li class="icon_5" :class="{'active': curTimeBoxConCode.indexOf('5') != -1}" @click="contorlFun('curTimeBox','5')"></li>
        </ul>
        <div class="box-content">
          <div class="curTimeBox_content_1"  v-if="activeTabName == 'ws'">
            <div class="monitor_point">
              <div class="monitor_point_num">{{ curTimeInfo.siteNum }}</div>
              <div class="monitor_point_title">监测站点</div>
            </div>
            
            <div class="monitor_point_alarm">
              <div @click="initCurTime('2')">报警数量: <span>{{ curTimeInfo.alarmNum }}</span></div>
              <div @click="initCurTime('1')">预警数量: <span>{{ curTimeInfo.warnNum }}</span></div>
            </div>
            
            <div class="monitor_point_alarm_right">
              <ul>
                <li>
                <div class="monitor_point_alarm_right_icon"></div>
                <div>
                  <div>待处理</div>
                  <div>{{curTimeInfo.pendingAlarm || 0}}</div>
                </div>
                </li>
                <li>                  
                <div class="monitor_point_alarm_right_icon"></div>
                <div>
                  <div>处理中</div>
                  <div>{{curTimeInfo.processingAlarm || 0}}</div>
                </div>
                </li>
                <li>
                <div class="monitor_point_alarm_right_icon"></div>
                <div>
                  <div>已处理</div>
                  <div>{{curTimeInfo.processedAlarm || 0}}</div>
                </div>
                </li>
              </ul>
              <ul>
                <li>
                <div class="monitor_point_alarm_right_icon"></div>
                <div>
                  <div>待处理</div>
                  <div>{{curTimeInfo.pendingWarn || 0}}</div>
                </div>
                </li>
                <li>
                <div class="monitor_point_alarm_right_icon"></div>
                <div>
                  <div>处理中</div>
                  <div>{{curTimeInfo.processingWarn|| 0}}</div>
                </div>
                </li>
                <li>
                <div class="monitor_point_alarm_right_icon"></div>
                <div>
                  <div>已处理</div>
                  <div>{{curTimeInfo.processedWarn || 0}}</div>
                </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="curTimeBox_content_2" v-if="activeTabName == 'ys'">
            <div class="stationsNums">
              <div class="curTimeBox_content_monitorAlarm_total">{{ curTimeInfo.siteNum }}</div>
              <div class="curTimeBox_content_monitorAlarm_name">监测站点数量</div>
            </div>
            <div class="curTimeBox_content_monitorAlarm_bg">
              <img src="/static/ManageSystem/img/ind_alarm_total_icon.png" alt="">
            </div>
            <div class="stationsNums stationsNums1">
              <div class="stationsNums1_content">报警数量</div>
              <div><span>{{ curTimeInfo.alarmNum  || 0}}</span>次</div>
            </div>
            <div class="curTimeBox_content_monitorAlarm_icon">
              <img src="/static/ManageSystem/img/ind_alarm_total_pend_icon.png" alt="">
            </div>
            <div class="stationsNums stationsNums2">
              <div>{{ curTimeInfo.pendingAlarm || 0}}</div>
              <div>待处理</div>
            </div>
            <div class="curTimeBox_content_monitorAlarm_icon">
              <img src="/static/ManageSystem/img/ind_alarm_total_end_icon.png" alt="">
            </div>
            <div class="stationsNums stationsNums2">
              <div>{{ curTimeInfo.processingAlarm || 0}}</div>
              <div>处理中</div>
            </div>
            <div class="curTimeBox_content_monitorAlarm_icon">
              <img src="/static/ManageSystem/img/ind_alarm_total_in_icon.png" alt="">
            </div>
            <div class="stationsNums stationsNums2">
              <div>{{ curTimeInfo.processedAlarm || 0}}</div>
              <div>已处理</div>
            </div>
          </div>

          <div class="curTimeBox_table_content">
            <el-table
              class="statistical_analysis_table"
              id="curTimeTable"
              :data="curTimeTableData"
              :header-row-style="{ height: '33px' }"
              :row-style="{ height: '33px' }"
              :cell-style="{ padding: '0px', color: '#C5D0D4' }"
              :header-cell-style="{ padding: '0px', color: '#C5D0D4', backgroundColor: 'rgba(28,178,255,.2) !important' }"
            >
              <el-table-column
                type="index"
                width="60"
                label="序号"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="subdistrict"
                label="所属街道"
                align="center"
                width="140px;"
              >
              </el-table-column>
              <el-table-column
                prop="pshType"
                label="排水户类型"
                align="center"
                width="120px;"
                :formatter="pshTypeFomatter"
              >
              </el-table-column>
              <el-table-column prop="pshName" label="排水户名称" min-width="140px;" show-overflow-tooltip="" align="center">
              </el-table-column>
              <el-table-column prop="pointName" label="点位名称" min-width="140px;" show-overflow-tooltip="" align="center">
              </el-table-column>
              <el-table-column
                prop="testTime"
                label="报警时间"
                align="center"
                min-width="140px;" show-overflow-tooltip="" 
              >
              </el-table-column>
              <el-table-column
                prop="levelValue"
                label="液位"
                align="center"
                width="100px;"
                v-if="activeTabName == 'ws'"
              >
              </el-table-column>
              <el-table-column
                prop="alarmReason"
                label="告警原因"
                align="center"
                width="120px;"
                v-if="activeTabName == 'ws'"
              >
              </el-table-column>
              <el-table-column
                prop="levelValue"
                label="液位"
                align="center"
                width="100px;"
                v-if="activeTabName == 'ys'"
                
              >
              </el-table-column>
              <el-table-column
                prop="phValue"
                key="pH"
                label="PH"
                align="center"
                width="100px;"
                v-if="activeTabName == 'ys'"
              >
              </el-table-column>
              <el-table-column
                prop="usValue"
                key="uS"
                label="电导率"
                align="center"
                width="100px;"
                v-if="activeTabName == 'ys'"
        
              >
              </el-table-column>

              <el-table-column
                prop="alarmStatus"
                label="报警状态"
                align="center"
                width="100px;"
              >
              </el-table-column>
              <el-table-column
                prop="eventState"
                width="120px;"
                label="处理状态"
                align="center"
              >
              </el-table-column>
            </el-table>
            <div class="paginationContent">
              <el-pagination
                layout="total,prev, pager, next"
                :page-size="pageSize"
                :current-page="currentPage"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </systemPanel>
      <systemPanel v-show="!isFullScreen || (isFullScreen && pieChartBoxConCode.indexOf('3') != -1)" :title="curStreetName+'当月报警统计'" class="pieChartBox card-box">
        <div class="pieChartBox-content box-content">
          <div class="pieChar_content_1">
            <p>{{currMonthAlarmData["number"]}}</p>
            <span>个</span>
          </div>
          <ul class="pieChar_content_2">
            <li>
                <div class="line"></div>
                <div>              
                <p>预警</p>
                <p><span>{{filterCurrAlarm("alarmNum","预警")["per"] || 0}}</span>%</p>
                </div>
            </li>
            <li>
                <div class="line"></div>    
                <div>              
                          
                <p>告警</p>
                <p><span>{{filterCurrAlarm("alarmNum","告警")["per"] || 0}}</span>%</p>
                </div>           
            </li>
            <li>
                <div class="line"></div>       
                <div>              
                       
                <p>正常</p>
                <p><span>{{filterCurrAlarm("alarmNum","正常")["per"] || 0}}</span>%</p>
            </div>
            </li>
            <li>
                <div class="line"></div>            
                <div>              
                  
                <p>异常</p>
                <p><span>{{filterCurrAlarm("alarmNum","异常")["per"] || 0}}</span>%</p>
            </div>
            </li>
          </ul>
          <ul class="pieChar_content_3">
            <li>预警 {{filterCurrAlarm("alarmNum","预警")["value"] || 0}} <span>已处理 {{filterCurrAlarm("alarmEvent","预警")["value"] || 0}}</span></li>
            <li>告警 {{filterCurrAlarm("alarmNum","告警")["value"] || 0}} <span>已处理 {{filterCurrAlarm("alarmEvent","报警")["value"] || 0}}</span></li>
            <li>异常 {{filterCurrAlarm("alarmNum","异常")["value"] || 0}} <span>已处理 {{filterCurrAlarm("alarmEvent","异常")["value"] || 0}}</span></li>
            <li>正常 {{filterCurrAlarm("alarmNum","正常")["value"] || 0}}</li>
          </ul>
        </div>
      </systemPanel>
      <systemPanel  :class="{'fullScreenBox': barChartBoxConCode.indexOf('3') != -1}" v-show="!isFullScreen || (isFullScreen && barChartBoxConCode.indexOf('3') != -1)" :title="curStreet == '' ? '街道报警次数排名' : '排水户报警次数排名'" class="barChartBox card-box">
        <ul class="card_box_contorl">
          <li class="icon_3" :class="{'active': barChartBoxConCode.indexOf('3') != -1}" @click="contorlFun('barChartBox','3')"></li>
          <li class="icon_4" :class="{'active': barChartBoxConCode.indexOf('4') != -1}" @click="contorlFun('barChartBox','4')"></li>
          <li class="icon_5" :class="{'active': barChartBoxConCode.indexOf('5') != -1}" @click="contorlFun('barChartBox','5')"></li>
        </ul>
        <div v-show="barChartBoxConCode.indexOf('4') == -1" class="box-content">
          <div v-show="checkNotNull(rankData)" id="rankChart"></div>
          <no-data v-show="!checkNotNull(rankData)"></no-data>
        </div>
        <div v-show="barChartBoxConCode.indexOf('4') != -1" class="box-content">
          <el-table
              id="rankTable"
              class="statistical_analysis_table"
              :data="rankData"
              height="calc(100% - 40px)"
              :header-row-style="{ height: '33px' }"
              :row-style="{ height: '33px' }"
              :cell-style="{ padding: '0px', color: '#C5D0D4' }"
              :header-cell-style="{ padding: '0px', color: '#C5D0D4', backgroundColor: 'rgba(28,178,255,.2) !important' }"
            >
              <el-table-column
                  type="index"
                  width="60"
                  label="序号"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="名称"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="value"
                  label="报警数量"
                  align="center"
                >
                </el-table-column>
          </el-table>
        </div>
      </systemPanel>
      <systemPanel :class="{'fullScreenBox': lineChartBoxConCode.indexOf('3') != -1}" v-show="!isFullScreen || (isFullScreen && lineChartBoxConCode.indexOf('3') != -1)" title="报警时段统计分析" class="lineChartBox card-box">
        <ul class="card_box_contorl">
          <li class="icon_3" :class="{'active': lineChartBoxConCode.indexOf('3') != -1}" @click="contorlFun('lineChartBox','3')"></li>
          <li class="icon_4" :class="{'active': lineChartBoxConCode.indexOf('4') != -1}" @click="contorlFun('lineChartBox','4')"></li>
          <li class="icon_5" :class="{'active': lineChartBoxConCode.indexOf('5') != -1}" @click="contorlFun('lineChartBox','5')"></li>
        </ul>
        <div class="box-content">
           <el-radio-group class="statistical_analysis_radio" v-model="lineChartActive" size="small">
            <el-radio label="YYYY-MM-DD" border>日</el-radio>
            <el-radio label="YYYY-MM" border>月</el-radio>
            <el-radio label="YYYY" border>年</el-radio>
          </el-radio-group>
          <div v-show="lineChartBoxConCode.indexOf('4') == -1" id="lineChart"></div>
          <el-table
              id="lineTable"
              v-show="lineChartBoxConCode.indexOf('4') != -1"
              class="statistical_analysis_table"
              :data="lineTableData"
              height="85%"
              :header-row-style="{ height: '33px' }"
              :row-style="{ height: '33px' }"
              :cell-style="{ padding: '0px', color: '#C5D0D4' }"
              :header-cell-style="{ padding: '0px', color: '#C5D0D4', backgroundColor: 'rgba(28,178,255,.2) !important' }"
            >
              <el-table-column
                  type="index"
                  width="60"
                  label="序号"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="timeinterval"
                  label="时间"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="num"
                  label="报警数量"
                  align="center"
                >
                </el-table-column>
          </el-table>
        </div>
      </systemPanel>
      <systemPanel 
        v-show="!isFullScreen || (isFullScreen && calendarBoxConCode == 3)" 
        :title="top5Flag ? '报警点位top5日排名' : '当月报警日历'" 
        class="calendarBox card-box"
      >
        <div v-show="top5Flag" class="return_calendar">
          <img @click="top5Flag = false" src="/static/ManageSystem/img/return_icon.png" alt="" srcset="">
        </div>
        <div class="box-content">
          <el-calendar v-show="!top5Flag" v-model="calendarValue" class="calendarBoxCalendar" :first-day-of-week="7">
            <template slot="dateCell" slot-scope="{data}">
              <template v-if="filterCalendarInfo(data.day)">
                <el-popover
                  popper-class="calendar_popover"
                  placement="top-start"
                  trigger="hover"
                  :content="'报警数:'+filterCalendarInfo(data.day)['total']"
                >
                  <div 
                    slot="reference" 
                    @click="getAlarmPointTop5Data(data.day)" 
                    :style="'cursor: pointer;color:'+filterCalendarInfo(data.day)['color']"
                  >
                    {{data.day.split('-').slice(2).join('-')}}
                  </div>
                </el-popover>
              </template>
              <template v-else>
                <div slot="reference">
                  {{data.day.split('-').slice(2).join('-')}}
                </div>
              </template>
            </template>
          </el-calendar>
          <div v-show="top5Flag" id="top5Container"></div>
          <div class="calendarBox_content_bt" v-show="!top5Flag">
            <div class="calendarBox_content_bt_1">报警次数较上月同比</div>
            <div class="calendarBox_content_bt_2">{{yearOnYearInfo}}</div>
            <div class="calendarBox_content_bt_3 alarm_num_legend_content">
                <p>报警数量</p>
                <p class="alarm_num_legend">
                  <span>0</span>
                  <span>{{colorCardinality*4}}</span>
                </p>
            </div>
          </div>
        </div>
      </systemPanel>
    </div>
  </div>
</template>
<script>
import Map from "./map.vue";
import {
  getNowTimeData,
  getMonthAlarm,
  getSubPsh,
  getAlarmTimeInterval,
  getAlarmCal,
  getStreetAlarmNum,
  getAlarmPointTop5
} from "@/api/IntelSupervision";
import { mapState } from "vuex";
import {
  checkNotNull,
  downloadChart,
  exportToExcel,
  exportMethods,
  chartFontSize,
    eventStateFomatter,
    pshTypeFomatter
} from "@/lib";

export default {
  data() {
    return {
      curTimeExportUrl: "/intelSupervisonApi/indexAlarmStats/getNowTimeExport",
      colorCardinality: 0,
      mapColorCardinality: 0,
      calendarInfo: [],
      yearOnYearInfo: "无变化",
      isFullScreen: false,
      fullScreenBoxName: "",
      contorlCode: "",
      boxName: "",
      curTimeTableData: [],
      curTimeInfo: {},
      rankList1: [],
      rankTotal1: 0,
      rankList2: [],
      rankTotal2: 0,
      lineChartActive: "YYYY-MM-DD",
      streetData: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      curStreet: "", //当前街道
      curStreetName: "金牛区",
      top5Flag: false,
      alarmNumFlag: false,
      curTimeBoxConCode: [],
      alarmNumsBoxConCode: [],
      calendarBoxConCode: [],
      lineChartBoxConCode: [],
      barChartBoxConCode: [],
      pieChartBoxConCode: [],
      alarmNumsBoxRelationCode: "",
      rankOption: {
        grid: {
          containLabel: true,
          top: "10%",
          left: "10%",
          bottom: "10%",
          right: "10%"
        },
        dataZoom: [
          {
            type: "inside",
            yAxisIndex: 0,
            filterMode: "none"
          }
        ],
        // dataZoom: [
        //   {
        //     type: "inside",
        //     start: 0,
        //     end: 5
        //   }
        // ],
        // backgroundColor:"#101F70",
        xAxis: {
          type: "value",
          axisLabel: {
            color: "#fff",
            fontSize: chartFontSize(16)
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "rgba(206,244,255,.2)"
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: "category",
          data: [],
          axisLine: {
            lineStyle: {
              type: "dashed",
              color: "rgba(206,244,255,.2)"
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            inside: true
          }
        },
        series: [
          {
            name: "",
            type: "bar",
            barWidth: 6,
            itemStyle: {
              color: "#1b345d"
            },
            label: {
              show: true,
              position: ["100%", "-400%"],
              textStyle: {
                align: "right",
                color: "#fff",
                fontSize: chartFontSize(18)
              },
              formatter: "{b}"
            },
            barGap: "-100%",
            data: []
          },
          {
            name: "",
            type: "bar",
            // showBackground: true,
            // backgroundStyle: {
            //   // color: "#1b345d"
            //   color: "red"
            // },
            label: {
              show: true,
              position: ["0", "-300%"],
              textStyle: {
                color: "#B5E7FF",
                fontSize: chartFontSize(14)
              },
              formatter: "{b}"
            },
            barWidth: chartFontSize(6),
            data: [],
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#08B1FF" },
                { offset: 1, color: "#6BFFF3" }
              ])
            }
          }
        ],
        saveAsImage: {
          backgroundColor: "#101F70"
        }
      },
      rankChart: {},
      rankData: [],
      lineChart: {},
      lineOption: {
        color: ["#00D7E9"],
        grid: {
          containLabel: true,
          top: "5%",
          left: "8%",
          bottom: "5%",
          right: "8%"
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          data: [], //xData,
          axisLine: {
            lineStyle: {
              color: "#999"
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#fff",
            fontSize: chartFontSize(16),
            margin: chartFontSize(20)
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#fff",
              fontSize: chartFontSize(16)
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: "rgba(153, 153, 153, .3)",
              type: "dashed"
            }
          }
        },
        series: [
          {
            data: [], //yData,
            type: "line",
            // symbolSize: 10,
            symbol: "circle",
            smooth: true,
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(0, 215, 233, 0.4)"
                },
                {
                  offset: 1,
                  color: "rgba(14, 27, 83, 0.4)"
                }
              ])
            }
          }
        ]
      },
      top5ContChart: {},
      top5ContOption: {
        color: ["#00D7E9"],
        grid: {
          containLabel: true,
          top: "20%",
          left: "8%",
          bottom: "5%",
          right: "8%"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          right: "8%",
          top: "5%",
          itemGap: chartFontSize(20),
          textStyle: {
            color: "#fff",
            fontSize: chartFontSize(16)
          },
          data: ["液位", "PH", "电导率"]
        },
        xAxis: {
          type: "category",
          data: [], //xData,
          axisLine: {
            lineStyle: {
              color: "#999"
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#fff",
            fontSize: chartFontSize(16),
            margin: chartFontSize(20)
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#fff",
              fontSize: chartFontSize(16)
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: "rgba(153, 153, 153, .3)",
              type: "dashed"
            }
          }
        },
        series: [
          {
            name: "液位",
            data: [],
            type: "bar",
            barWidth: chartFontSize(20),
            stack: "1",
            symbol: "circle",
            itemStyle: {
              borderWidth: 1,
              borderColor: "#3681FF",
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#101F70"
                },
                {
                  offset: 1,
                  color: "#00A8FF"
                }
              ])
            }
          },
          {
            name: "PH",
            data: [],
            type: "bar",
            stack: "1",
            barWidth: chartFontSize(20),
            symbol: "circle",
            itemStyle: {
              borderWidth: 1,
              borderColor: "#FFD200",
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#2d2603"
                },
                {
                  offset: 1,
                  color: "#ffb637"
                }
              ])
            }
          },
          {
            name: "电导率",
            data: [],
            type: "bar",
            stack: "1",
            barWidth: chartFontSize(20),
            symbol: "circle",
            itemStyle: {
              borderWidth: 1,
              borderColor: "#15D8D1",
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#064442"
                },
                {
                  offset: 1,
                  color: "#15d8d1"
                }
              ])
            }
          }
        ]
      },
      lineTableData: [],
      currMonthAlarmData: {},
      calendarValue: new Date()
    };
  },
  components: {
    Map
  },
  mounted() {
    // 初始化加载
    //this.mapChart();
  },
  methods: {
      eventStateFomatter,
    pshTypeFomatter,
    checkNotNull(val) {
      return checkNotNull(val);
    },
    fullScreenBox(boxname) {
      this.isFullScreen = !this.isFullScreen;
      if (this.isFullScreen) {
        this.fullScreenBoxName = boxname;
      } else {
        this.fullScreenBoxName = "";
      }
    },
    cellStyle() {},
    initPage() {
      this.initCurTime();

      this.$nextTick(() => {
        //this.initMap();
        this.initPieChart();
        this.initBarChart();
        this.initLineChart();
        this.initCalendarChart();
        if (checkNotNull(this.currTime) && this.top5Flag) {
          this.getAlarmPointTop5Data(this.currTime);
        }
      });
    },
    //地图
    async initMap() {
      let params = {
        deviceType: this.activeTabName,
        sub: this.curStreet
      };
      const res = await getStreetAlarmNum(params);
      this.streetData = res.data || [];
      let maxValue = 0;
      this.streetData.forEach(m => {
        maxValue = Math.max(maxValue, m["alramNum"]);
      });
      this.mapColorCardinality = Math.ceil(maxValue / 4);
    },

    //当前时刻
    async initCurTime(alarmType) {
      let params = {
        deviceType: this.activeTabName,
        sub: this.curStreet,
        current: this.currentPage,
        pageSize: 5
      };
      if (alarmType) {
        params.alarmType = alarmType;
      }
      const res = await getNowTimeData(params);
      this.curTimeTableData = res.data.alarmInfo.records;
      this.curTimeInfo.alarmHLevel = res.data.alarmHLevel; //告警高液位
      this.curTimeInfo.alarmLLevel = res.data.alarmLLevel; //告警低液位
      this.curTimeInfo.warnHLevel = res.data.warnHLevel; //预警高液位
      this.curTimeInfo.warnLLevel = res.data.warnLLevel; //预警低液位
      this.curTimeInfo.warnNum = res.data.warnNum; //预警数量
      this.curTimeInfo.alarmNum = res.data.alarmNum; //告警数量
      this.curTimeInfo.siteNum = res.data.siteNum; //监测站点数量
      this.curTimeInfo.alarmEvent = res.data.alarmEvent || [];
      this.curTimeInfo.warnEvent = res.data.warnEvent || [];
      this.curTimeInfo.alarmEvent.forEach(ele => {
        if (parseInt(ele.eventState) == 2) {
          this.curTimeInfo.pendingAlarm = ele.eventnum;
        } else if (parseInt(ele.eventState) == 3) {
          this.curTimeInfo.processingAlarm = ele.eventnum;
        } else if (parseInt(ele.eventState) == 4) {
          this.curTimeInfo.processedAlarm = ele.eventnum;
        }
      });

      this.curTimeInfo.warnEvent.forEach(ele => {
        if (parseInt(ele.eventState) == 2) {
          this.curTimeInfo.pendingWarn = ele.eventnum;
        } else if (parseInt(ele.eventState) == 3) {
          this.curTimeInfo.processingWarn = ele.eventnum;
        } else if (parseInt(ele.eventState) == 4) {
          this.curTimeInfo.processedWarn = ele.eventnum;
        }
      });

      this.total = res.data.alarmInfo.total;
    },
    //当月报警统计
    initPieChart() {
      this.getMonthAlarmData();
      //this.drawPieChart()
    },
    async getMonthAlarmData() {
      let params = {
        deviceType: this.activeTabName,
        sub: this.curStreet
      };
      const res = await getMonthAlarm(params);
      this.currMonthAlarmData = res.data || {};
    },
    filterCurrAlarm(name, code) {
      let currFilterData = this.currMonthAlarmData[name] || [];
      currFilterData = currFilterData.filter(m => m["name"] == code);
      let currAlarmData = {};
      if (checkNotNull(currFilterData)) {
        currAlarmData = currFilterData[0];
      }

      return currAlarmData;
    },
    //画折线图
    drawLineChart(xData, yData) {
      this.lineOption.xAxis["data"] = xData;
      this.lineOption.series[0]["data"] = yData;
      this.lineChart.setOption(this.lineOption, true);
    },
    //次数排名
    async initBarChart() {
      const _this = this;
      let params = {
        deviceType: _this.activeTabName,
        sub: _this.curStreet
      };
      const res = await getSubPsh(params);
      _this.rankData = [];
      if (checkNotNull(res) && checkNotNull(res["data"])) {
        _this.rankData = res["data"] || [];
      }

      let maxVal = 0,
        yAxisData = [];
      _this.rankData.forEach(m => {
        m["name"] = m["pshname"] || m["areaName"];
        m["value"] = m["alramNum"] || m["num"];
        yAxisData.push(m["name"]);
        maxVal = Math.max(maxVal, m["value"]);
      });

      maxVal = maxVal + 50;
      _this.rankOption.xAxis.max = maxVal;
      _this.rankOption.yAxis.data = yAxisData;
      _this.rankOption.series[0].data = new Array(_this.rankData.length).fill(
        maxVal
      );
      _this.rankOption.series[0].label.formatter = function(params) {
        return _this.rankData[params.dataIndex]["value"];
      };
      _this.rankOption.series[1].data = _this.rankData;

      _this.rankChart.setOption(_this.rankOption, true);
      _this.resizeCharts();
    },
    getBarChartData() {},
    //时段分析
    async initLineChart() {
      let params = {
        deviceType: this.activeTabName,
        timeType: this.lineChartActive,
        sub: this.curStreet,
        alarmType: 2 //传2是指标 传1是设备
      };
      const res = await getAlarmTimeInterval(params);
      let xData = [],
        yData = [];
      this.lineTableData = res.data || [];
      this.lineTableData.forEach(ele => {
        xData.push(ele.timeinterval);
        yData.push(ele.num);
      });

      this.drawLineChart(xData, yData);
    },

    //定义一个calendar函数
    calendar() {
      var nowdays = new Date(); //获取标准时间
      var days = nowdays.getDate(); //获取当天
      var month = nowdays.getMonth() + 1; //获取当月
      var year = nowdays.getFullYear(); //获取当年
      var day = new Date(year, month, 0).getDate(); //获取当前月有多少天

      let current_month_num = day;
      let current_month = [];
      for (let i = 1; i <= current_month_num; i++) {
        let d = this.formatDate(nowdays.setDate(i));
        current_month.push(d);
      }
      return current_month;
    },
    formatDate(date) {
      date = new Date(date);
      let myyear = date.getFullYear();
      let mymonth = date.getMonth() + 1;
      let myweekday = date.getDate();
      mymonth < 10 ? (mymonth = "0" + mymonth) : mymonth;
      myweekday < 10 ? (myweekday = "0" + myweekday) : myweekday;
      return `${myyear}-${mymonth}-${myweekday}`;
    },
    //报警日历
    async initCalendarChart() {
      let params = {
        deviceType: this.activeTabName,
        sub: this.curStreet,
        alarmType: 2 //传2是指标 传1是设备
      };
      const res = await getAlarmCal(params);
      let calArr = [],
        lastMonth = 0;
      if (checkNotNull(res) && checkNotNull(res["data"])) {
        calArr = res["data"]["dataInfo"] || [];
        lastMonth = res["data"]["lastMonth"] || 0;
      }

      this.calendarInfo = calArr;
      let currMonthTotal = 0,
        maxValue = 0;
      calArr.forEach(m => {
        currMonthTotal += m["total"];
        maxValue = Math.max(maxValue, m["total"]);
      });

      if (currMonthTotal > lastMonth) {
        this.yearOnYearInfo = "上升";
      } else if (lastMonth > currMonthTotal) {
        this.yearOnYearInfo = "下降";
      } else {
        this.yearOnYearInfo = "无变化";
      }

      this.colorCardinality = Math.ceil(maxValue / 4);
    },
    filterCalendarInfo(date) {
      let currInfo = this.calendarInfo.filter(m => m["testDay"] == date);

      if (checkNotNull(currInfo)) {
        currInfo = currInfo[0];
        currInfo["color"] = "rgba(255,255,255,0.6)";
        if (
          currInfo["total"] > 0 &&
          this.colorCardinality > currInfo["total"]
        ) {
          currInfo["color"] = "#18C3FF";
        }
        if (
          currInfo["total"] >= this.colorCardinality &&
          this.colorCardinality * 2 > currInfo["total"]
        ) {
          currInfo["color"] = "#D3CB40";
        }
        if (
          currInfo["total"] >= this.colorCardinality * 2 &&
          this.colorCardinality * 3 > currInfo["total"]
        ) {
          currInfo["color"] = "#FF8C1B";
        }
        if (currInfo["total"] >= this.colorCardinality * 3) {
          currInfo["color"] = "#D30717";
        }
        return currInfo;
      } else {
        return "";
      }
    },
    // 日历下钻
    // calendarDrillchart(date) {
    //   this.getAlarmPointTop5Data(date);
    // },
    //当日top5
    async getAlarmPointTop5Data(time) {
      this.currTime = time;
      this.top5Flag = true;
      let params = {
        deviceType: this.activeTabName,
        sub: this.curStreet,
        testTime: time
      };
      const res = await getAlarmPointTop5(params);
      let top5Data = [];
      if (checkNotNull(res) && checkNotNull(res["data"])) {
        top5Data = res["data"] || [];
      }

      let xData = [],
        yData1 = [],
        yData2 = [],
        yData3 = [];
      top5Data.forEach(item => {
        xData.push(item.pointName);
        yData1.push(item["level"] || 0);
        yData2.push(item["ph"] || 0);
        yData3.push(item["us"] || 0);
      });

      let legendData = [];
      if (this.activeTabName == "ys") {
        legendData = ["液位", "PH", "电导率"];
      }

      this.top5ContOption.xAxis["data"] = xData;
      this.top5ContOption.series[0]["data"] = yData1;
      this.top5ContOption.series[1]["data"] = yData2;
      this.top5ContOption.series[2]["data"] = yData3;
        this.top5ContOption.legend["data"] = legendData;
      this.top5ContChart.setOption(this.top5ContOption, true);
      this.resizeCharts();
    },

    //切换当前页的容量
    handleSizeChange(val) {
      this.pageSize = val;
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;

      this.initCurTime();
    },

    getStreetName(city, code) {
      this.curStreetName = city;
      this.curStreet = code;
      this.initPage();
    },

    // // 地图关联
    // alarmNumsBoxRelationCodeFun(code){
    //   if(this.alarmNumsBoxRelationCode == code){
    //     this.alarmNumsBoxRelationCode = "";
    //   }else{
    //     this.alarmNumsBoxRelationCode = code;
    //     if(this.alarmNumsBoxConCode != 2){
    //       this.alarmNumsBoxConCode = "";
    //     }
    //   }
    // },

    contorlFun(boxname, concode) {
      if (boxname == "alarmNumsBox" && concode != 2) {
        this.alarmNumsBoxRelationCode = "";
      }

      let codeIndex = this[boxname + "ConCode"].indexOf(concode);
      if (codeIndex == -1) {
        if (concode != 5) {
          this[boxname + "ConCode"].push(concode);
        }
        this.boxName = boxname;
        // 街道报警次数排名/排水户报警次数排名
        if (boxname == "barChartBox") {
          this.barChartBoxContorlFun(concode);
        } else if (boxname == "alarmNumsBox") {
          // 报警数量
          this.alarmNumsBoxContorlFun(concode);
        } else if (boxname == "lineChartBox") {
          // 报警时段统计分析
          this.lineChartBoxContorlFun(concode);
        } else if (boxname == "curTimeBox") {
          // 当前时刻统计数据
          this.curTimeBoxContorlFun(concode);
        }
      } else {
        this[boxname + "ConCode"].splice(codeIndex, 1);
      }

      if (concode == 3) {
        // 全屏
        this.fullScreenBox(boxname);
      }
      this.resizeCharts();
    },
    curTimeBoxContorlFun(concode) {
      // 导出
      if (concode == 5) {
        exportMethods(this.curTimeExportUrl, {
          deviceType: this.activeTabName,
          sub: this.curStreet,
          alarmType: 2 //传2是指标 传1是设备
        });
      }
    },
    alarmNumsBoxContorlFun(concode) {
      // 切换为表格
      if (concode == 4) {
        // 取消 关联和下钻
        let index1 = this.alarmNumsBoxConCode.indexOf("1");
        if (index1 != -1) {
          this.alarmNumsBoxConCode.splice(index1, 1);
        }
        let index2 = this.alarmNumsBoxConCode.indexOf("2");
        if (index1 != -1) {
          this.alarmNumsBoxConCode.splice(index2, 1);
        }
      }

      // 导出
      if (concode == 5) {
        exportToExcel("报警数量统计", "alarmTable");
      }
    },
    barChartBoxContorlFun(concode) {
      const _this = this;
      // 导出
      if (concode == 5) {
        // 图表
        if (
          this.barChartBoxConCode.indexOf("4") == -1 &&
          checkNotNull(_this.rankData)
        ) {
          downloadChart(
            _this.$echarts,
            "rankChart",
            _this.curStreet == "" ? "街道报警次数排名" : "排水户报警次数排名"
          );
        } else {
          // 表格
          exportToExcel("街道报警次数排名", "rankTable");
        }
      }
    },
    lineChartBoxContorlFun(concode) {
      const _this = this;
      // 导出
      if (concode == 5) {
        // 图表
        if (this.lineChartBoxConCode.indexOf("4") == -1) {
          downloadChart(_this.$echarts, "lineChart", "报警时段统计分析");
        } else {
          // 表格
          exportToExcel("报警时段统计分析", "lineTable");
        }
      }
    },
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        if (checkNotNull(_this.rankChart)) {
          _this.rankChart.resize();
        }
        if (checkNotNull(_this.lineChart)) {
          _this.lineChart.resize();
        }
        if (checkNotNull(_this.top5ContChart)) {
          _this.top5ContChart.resize();
        }
      });
    }
  },
  mounted() {
    const _this = this;
    _this.$nextTick(function() {
      // 初始化地图
      _this.rankChart = _this.$echarts.init(
        document.getElementById("rankChart")
      );
      _this.lineChart = _this.$echarts.init(
        document.getElementById("lineChart")
      );
      _this.top5ContChart = _this.$echarts.init(
        document.getElementById("top5Container")
      );
      window.addEventListener("resize", _this.resizeCharts);
    });

    if (_this.activeTabName) {
      _this.initMap();
      _this.initPage();
    }
  },
  computed: {
    ...mapState({
      activeTabName: state => state.IntelSupervison.activeTabName
    })
  },
  watch: {
    lineChartActive() {
      this.initLineChart();
    },
    activeTabName(val) {
      if (val) {
        this.initMap();
        this.initPage();
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
  }
};
</script>
<style lang="scss" scoped>
.indexStatistics-container {
  display: flex;
  flex-wrap: wrap;
  color: #fff;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 30px;

  &.fullScreenContainer {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .fullScreenBox {
      width: 100% !important;
      height: calc(100% - 45px) !important;
    }
  }

  .tabsBox {
    width: 100%;
    height: 30px;
    // padding-bottom: 20px;
    .tab {
      width: 150px;
      height: 30px;
      border-radius: 4px;
      border: 1px solid;
      text-align: center;
      line-height: 30px;
      display: inline-block;
      cursor: pointer;
    }
    .active {
      background-color: #02a7f0;
    }
  }
  .card-box {
    margin-bottom: 15px;
    height: calc(100% - 40px);
    position: relative;
    .box-header {
      padding: 10px;
      font-size: 16px;
    }

    .card-box-contorl {
      display: flex;
      position: absolute;
      top: 15px;
      right: 0;

      li {
        margin-right: 20px;
        line-height: 20px;
        cursor: pointer;
      }
    }
  }
  .indexSta-footer {
    overflow-y: auto;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .alarmNumsBox {
      width: 40%;
      height: 527px;
      .alarm_num_legend_content {
        margin-right: 25px;
      }

      .alarmNumsBox_map {
        width: 100%;
        height: 100%;
      }

      #alarmTable {
        width: 80%;
        margin: 20px auto;
      }
    }
    .curTimeBox {
      width: 59%;
      height: 527px;
      .curTimeBox_table_content {
        margin: 0 28px;
        height: 260px;
        overflow-y: scroll;
        #curTimeTable {
          width: 100%;
        }
      }
      .curTimeBox_content_1 {
        padding: 17px 0 0 0;
        justify-content: center;
        display: flex;
        font-size: 14px;
      }

      .curTimeBox_content_2 {
        display: flex;
        font-size: 16px;
        padding-bottom: 40px;
        justify-content: center;

        .stationsNums {
          font-size: 14px;
          > div {
            &:nth-child(1) {
              font-size: 22px;
              color: #ff9b30;
            }

            &.curTimeBox_content_monitorAlarm_total {
              width: 272px;
              height: 150px;
              background: url(/static/ManageSystem/img/indicators_alarm_bg_2.png)
                no-repeat center bottom;
              background-size: 100% 93px;
              text-align: center;
              font-size: 68px !important;
              color: #18fff7 !important;
            }

            &.curTimeBox_content_monitorAlarm_name {
              width: 272px;
              text-align: center;
              color: #fefefe;
            }
          }

          &:nth-child(3) {
            > div {
              &:nth-child(1) {
                font-size: 14px;
                color: #fff;
              }
            }
          }
          &:nth-child(7) {
            > div {
              &:nth-child(1) {
                color: #3fc2ff;
              }
            }
          }
          &:nth-child(9) {
            > div {
              &:nth-child(1) {
                color: #1ec689;
              }
            }
          }
        }

        .curTimeBox_content_monitorAlarm_bg {
          width: 92px;
          height: 72px;
          margin-left: 4%;
          margin-top: 64px;
          margin-right: 20px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .curTimeBox_content_monitorAlarm_icon {
          width: 60px;
          height: 60px;
          margin: 0 1% 0 2.5%;
          margin-top: 70px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .stationsNums1 {
          margin-top: 64px;
          font-size: 14px;
          .stationsNums1_content {
            line-height: 30px;
          }
          span {
            font-size: 26px;
            color: #fd2f1a;
          }
        }

        .stationsNums2 {
          margin-top: 70px;
        }
      }

      .monitor_point {
        width: 109px;
        text-align: center;
        margin-right: 19px;
        margin-top: 25px;
      }

      .monitor_point_num {
        font-size: 26px;
        color: #34edfd;
        width: 100%;
        height: 104px;
        line-height: 104px;
        background: url(/static/ManageSystem/img/indicators_monitor_point_bg.png)
          no-repeat center center;
        background-size: 100% 100%;
      }

      .monitor_point_title {
        font-size: 18px;
        color: #d7e5e6;
        padding: 7px 0;
        background: url(/static/ManageSystem/img/indicators_monitor_point_icon.png)
          no-repeat center bottom;
      }

      .monitor_point_alarm {
        margin-top: 25px;
        background: url(/static/ManageSystem/img/indicators_monitor_point_bg_2.png)
          no-repeat center center;
        background-size: 100% 100%;
        height: 135px;

        > div {
          line-height: 60px;
          padding: 0 25px;
          font-size: 18px;
          color: #e6f1f1;
          > span {
            font-size: 26px;
            padding-left: 17px;
          }
          &:nth-child(1) {
            > span {
              color: #ff2727;
            }
          }
          &:nth-child(2) {
            > span {
              color: #ff8a00;
            }
          }
          // background:
        }
      }

      .monitor_point_alarm_right {
        ul {
          margin-bottom: 20px;
          display: flex;
          margin-left: 40px;
          li {
            display: flex;
            margin-right: 35px;
            > div {
              &:nth-child(1) {
                background: url(/static/ManageSystem/img/indicators_pending_icon.png)
                  center center;
                background-size: 100% 100%;
              }
              &:nth-child(2) {
                > div {
                  &:nth-child(1) {
                    margin-top: 20px;
                  }

                  &:nth-child(2) {
                    font-size: 24px;
                    color: #3fc2ff;
                  }
                }
              }
            }

            &:nth-child(2) {
              > div {
                &:nth-child(1) {
                  background: url(/static/ManageSystem/img/indicators_inprocess_icon.png)
                    center center;
                  background-size: 100% 100%;
                }
              }
            }
            &:nth-child(3) {
              > div {
                &:nth-child(1) {
                  background: url(/static/ManageSystem/img/indicators_completed_icon.png)
                    center center;
                  background-size: 100% 100%;
                }
              }
            }
          }
        }

        .monitor_point_alarm_right_icon {
          width: 80px;
          height: 80px;
          margin-right: 18px;
        }
      }
    }
    .pieChartBox {
      width: 49%;
      height: 372px;

      .pieChartBox-content {
        display: flex;
        position: relative;
        padding: 50px 60px;
        box-sizing: border-box;

        .pieChar_content_1 {
          width: 190px;
          height: 190px;
          background: url(/static/ManageSystem/img/ind_alarm_stat_icon.png)
            no-repeat center center;
          background-size: 100% 100%;
          text-align: center;
          padding-top: 70px;
          box-sizing: border-box;
          font-size: 30px;

          > span {
            font-size: 16px;
            margin-top: -30px;
            display: inline-block;
            vertical-align: middle;
          }
        }

        .pieChar_content_2 {
          width: 360px;
          padding-left: 30px;
          padding-top: 20px;
          box-sizing: border-box;
          font-size: 16px;
          display: flex;
          flex-wrap: wrap;

          li {
            display: flex;
            width: 50%;

            .line {
              display: inline-block;
              vertical-align: middle;
              height: 50px;
              width: 1px;
              background-color: #00deff;
              position: relative;
              margin-right: 18px;
              margin-top: 5px;

              &::after {
                content: "";
                position: absolute;
                width: 9px;
                height: 9px;
                background-color: #00deff;
                top: 0;
                left: -4.5px;
              }
            }

            span {
              font-size: 28px;
            }

            p {
              &:nth-child(2) {
                color: #00deff;
              }
            }

            &:nth-child(2) {
              p {
                &:nth-child(2) {
                  color: #ffd200;
                }
              }

              .line {
                background-color: #ffd200;
                &::after {
                  background-color: #ffd200;
                }
              }
            }

            &:nth-child(3) {
              p {
                &:nth-child(2) {
                  color: #00d7cc;
                }
              }

              .line {
                background-color: #00d7cc;
                &::after {
                  background-color: #00d7cc;
                }
              }
            }

            &:nth-child(4) {
              p {
                &:nth-child(2) {
                  color: #b6c2fb;
                }
              }

              .line {
                background-color: #b6c2fb;
                &::after {
                  background-color: #b6c2fb;
                }
              }
            }
          }
        }

        .pieChar_content_3 {
          li {
            height: 30%;
            border-left: 2px dotted rgba(255, 255, 255, 0.2);
            padding-left: 32px;
            box-sizing: border-box;
            position: relative;

            font-size: 14px;
            &:nth-last-child(1) {
              height: auto;
            }

            span {
              display: inline-block;
              vertical-align: middle;
              margin-left: 10px;
            }

            &::after {
              content: "";
              position: absolute;
              width: 21px;
              height: 21px;
              background-color: rgba(84, 179, 255, 0.3);
              top: 0;
              left: -12px;
              border-radius: 50%;
            }

            &::before {
              content: "";
              position: absolute;
              width: 9px;
              height: 9px;
              background-color: #39a7ff;
              top: 6px;
              left: -6px;
              border-radius: 50%;
            }

            &:nth-child(2) {
              &::after {
                background-color: rgba(255, 182, 55, 0.3);
              }
              &::before {
                background-color: #ffb637;
              }
            }

            &:nth-child(3) {
              &::after {
                background-color: rgba(187, 199, 255, 0.3);
              }
              &::before {
                background-color: rgba(187, 199, 255, 1);
              }
            }

            &:nth-child(4) {
              &::after {
                background-color: rgba(21, 216, 209, 0.3);
              }
              &::before {
                background-color: rgba(21, 216, 209, 1);
              }
            }
          }
        }
      }
    }
    .barChartBox {
      width: 50%;
      height: 372px;

      #rankChart {
        width: 100%;
        height: 100%;
      }

      #rankTable {
        width: 80%;
        margin: 20px auto;
      }
    }
    .lineChartBox {
      width: 59%;
      height: 452px;
      .box-content {
        padding-top: 60px;
        box-sizing: border-box;
      }

      .statistical_analysis_radio {
        position: absolute;
        right: 50px;
        top: 60px;
      }

      #lineChart {
        width: 100%;
        height: 100%;
      }

      #lineTable {
        width: 88%;
        margin: 20px auto;
      }
    }
    .calendarBox {
      width: 40%;
      height: 452px;
    }
  }
  .box-content {
    width: 100%;
    height: 100%;
  }
  .overflow_drainage_rank_content {
    li {
      margin-top: 12px;
      &:nth-child(3),
      &:nth-child(4) {
        .rank_progress {
          > div {
            background: #45c6cb;
          }
        }
      }
      &:nth-child(5) {
        .rank_progress {
          > div {
            background: #fff;
          }
        }
      }
    }
    .rank_title {
      font-size: 14px;
      color: #d6e9f2;
      line-height: 12px;
      width: 10%;
    }
    .rank_content {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 23px;
      font-size: 18px;
      .rank_progress {
        width: 70%;
        height: 5px;
        margin-right: 5px;
        > div {
          height: 100%;
          background: #01f792;
        }
      }
    }
  }
  .el-tabs {
    margin-top: 5px;
    .el-tabs__nav-wrap {
      &::after {
        display: none;
      }
    }
    .el-tabs__item {
      color: #d3dfeb;
      font-size: 14px;
      height: 35px;
      line-height: 40px;
      padding: 0 20px;
      &.is-active {
        color: #45c6cb;
      }
    }
    .el-tabs__header {
      width: 80%;
      margin: 0 auto;
    }
    .el-tabs__active-bar {
      height: 4px;
      background-color: #45c6cb;
      border-radius: 3px;
    }
  }
  .card_box_contorl {
    display: flex;
    position: absolute;
    top: 12px;
    right: 0;

    li {
      width: 22px;
      height: 22px;
      margin-right: 12px;
      cursor: pointer;

      @for $i from 1 through 6 {
        &.icon_#{$i} {
          background: url(/static/ManageSystem/img/monitoringIndicators_con_icon_#{$i}.png)
            no-repeat
            center
            center;
          background-size: contain;
          &.active {
            background: url(/static/ManageSystem/img/monitoringIndicators_con_active_icon_#{$i}.png)
              no-repeat
              center
              center;
            background-size: contain;
          }
        }
      }
    }
  }
}
</style>