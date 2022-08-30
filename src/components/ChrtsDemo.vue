<template>
  <div>
    <section>
      <span class="span" @click="pipeNetworkState()">管网情况统计</span>
      <span class="span" @click="sewageOverflow()">污水井冒溢分析</span>
      <span class="span" @click="traceabilityAnalysis()">雨污混排朔源分析</span>
      <span class="span" @click="outletAnalysis()">沿河排口统计分析</span>
      <span class="span" @click="OMSAnalysis()">排水运维调度分析</span>
      <span class="span" @click="eventSource()">运维事件来源</span>
    </section>
    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
export default {
  name: "chartsDemo",
  data() {
    return {
    }
  },
  methods:{
    formatNumber(num){
      let reg = /(?=(\B)(\d{3})+$)/g;
      return num.toString().replace(reg, ',');
    },
    pipeNetworkState(){
      let data = [{
        name: "破裂",
        value: "220"
      },
        {
          name: "腐蚀",
          value: "120"
        },
        {
          name: "变形",
          value: "200"
        },
        {
          name: "障碍物",
          value: "100"
        },
        {
          name: "结垢",
          value: "152"
        },
        {
          name: "错接",
          value: "50"
        }
      ];
      let chartOption= {
        color: ['#139DEC', '#0248C8', '#842CC5', '#B8E12E','#1B9C9B','#C37329'],
        backgroundColor: '#031c3d',
        title: [],
        series: [{
          type: 'pie',
          radius: ['25%', '35%'],
          center: ['50%', '50%'],
          data: data,
          hoverAnimation: false,
          labelLine: {
            normal: {
              show: false,
            }
          },
          label: {
            normal: {
              formatter: params => {
                return (
                  '{name|' + params.name + '}'
                );
              },
              padding: [0, -30, 0, -30],
              rich: {
                name: {
                  fontSize: '18',
                  fontWeight: 400,
                  padding: [0, 10, 0, 4],
                  color: '#FFFFFF'
                },
              }
            }
          },
        }]
      };

      this.chart = this.$echarts.init(this.$refs.chart);
      this.chart.clear();
      this.chart.setOption(chartOption);
    },
    sewageOverflow(){
      let data = [
        {
          name: '当前冒溢',
          value: 54
        },{
          name: '今日冒溢',
          value: 44
        },{
          name: '本月冒溢',
          value: 35
        }];
      let seriesArr=[];
      data.forEach(function(item, index){
        seriesArr.push(
          {
            name: item.name,
            type: 'pie',
            clockWise: false,
            radius: [60, 70],
            itemStyle:  {
              normal: {
                color: '#01F7B4' ,
                shadowColor: '#01F7B4' ,
                shadowBlur: 0,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
              }
            },
            hoverAnimation: false,
            center: [index * 20 + 10 +'%', '50%'],
            data: [
              {
                value: 100-item.value,
                name: 'invisible',
                itemStyle: {
                  normal: {
                    color: '#3F495D'
                  },
                  emphasis: {
                    color: '#3F495D'
                  }
                }
              },
              {
                value: item.value,
                label: {
                  normal: {
                    formatter: function(params) {
                       return '{a|' + params.value + '%}\n\{x|占比}'
                    },
                    textStyle: {
                      rich: {
                        a: {
                          fontSize: '40',
                          fontWeight: '400',
                          color: '#FFFFFF'
                        },
                        x: {
                          fontSize: 20,
                          fontFamily: 'Microsoft YaHei',
                          color: '#A4ACBF',
                        },
                      },
                    },
                    position: 'center',
                    show: true,
                  }
                },
              },]
          }
        )
      });
      let chartOption = {
        backgroundColor: '#031c3d',
        series: seriesArr
      }
      this.chart = this.$echarts.init(this.$refs.chart);
      this.chart.clear();
      this.chart.setOption(chartOption);
    },
    traceabilityAnalysis(){
      let colors=['#C938FFFF','#04F494FF','#37A2FF'];
      let chartOption = {
        backgroundColor: '#031c3d',
        color:colors,
        legend: {
          data: ['商铺倾倒', '污水冒溢', '其他'],
          textStyle:{
            fontWeight:400,
            color:'#fff',
            fontSize:18,
          },
          selectedMode: false,
          icon:'circle',
        },
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {
        //     type: 'cross',
        //     label: {
        //       backgroundColor: '#6a7985'
        //     }
        //   }
        // },
        xAxis: [
          {
            axisLabel:{
              fontWeight:400,
              color:'#fff',
              fontSize:18,
            },
            axisLine:{
              show: false,
            },
            axisTick:{
              show: false,
            },
            type: 'category',
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月']
          }
        ],
        yAxis: [
          {
            offset:20,
            axisLabel:{
              fontWeight:400,
              color:'#fff',
              fontSize:18,
            },
            axisLine:{
              show: false,
            },
            axisTick:{
              show: false,
            },
            splitLine:{
              show: false,
            },
            type: 'value'
          }
        ],
        series: [
          {
            name: '商铺倾倒',
            type: 'line',
            stack: 'Total',
            //smooth: true,
            lineStyle: {
              width: 4,
              color:colors[0],
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(221,166,243,0.4)'
                },
                {
                  offset: 1,
                  color: 'rgba(240,233,243,0)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [140, 132, 101, 164, 135, 120, 150,123,145,153,167,157]
          },
          {
            name: '污水冒溢',
            type: 'line',
            stack: 'Total',
            //smooth: true,
            lineStyle: {
              width: 4,
              color: colors[1],
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(144,229,194,0.4)'
                },
                {
                  offset: 1,
                  color: 'rgba(191,241,221,0)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 121, 164, 120, 140, 160,125,134,112,156,145]
          },
          {
            name: '其他',
            type: 'line',
            stack: 'Total',
            //smooth: true,
            lineStyle: {
              width: 4,
              color: colors[2],
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(126,190,245,0.4)'
                },
                {
                  offset: 1,
                  color: 'rgba(126,190,245,0)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 111, 134, 150, 130, 120,132,142,125,135,148]
          },
        ]
      };
      this.chart = this.$echarts.init(this.$refs.chart);
      this.chart.clear();
      this.chart.setOption(chartOption);
    },
    outletAnalysis(){
      let chartOption = {
        backgroundColor: '#031c3d',
        xAxis: [
          {
            axisLabel:{
              fontWeight:400,
              color:'#fff',
              fontSize:18,
            },
            axisLine:{
              show: false,
            },
            axisTick:{
              show: false,
            },
            type: 'category',
            boundaryGap: false,
            data: ['点位1', '点位2', '点位3', '点位4', '点位5', '点位6','点位7','点位8']
          }
        ],
        yAxis: [
          {
            offset:20,
            axisLabel:{
              fontWeight:400,
              color:'#fff',
              fontSize:18,
            },
            axisLine:{
              show: false,
            },
            axisTick:{
              show: false,
            },
            splitLine:{
              show: false,
            },
            type: 'value'
          }
        ],
        series: [
          {
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 4,
              color: 'rgba(69,198,203,1)',
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(94,203,211,0.4)'
                },
                {
                  offset: 1,
                  color: 'rgba(94,203,211,0)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [16, 22, 23, 24, 21, 25,22,21,20,22]
          },
        ]
      };
      this.chart = this.$echarts.init(this.$refs.chart);
      this.chart.clear();
      this.chart.setOption(chartOption);
    },
    OMSAnalysis(){
      let data = [{
        name: "管网堵塞",
        value: "220"
      },
        {
          name: "井盖丢失",
          value: "120"
        },
        {
          name: "污水冒溢",
          value: "200"
        },
        {
          name: "泵站检修",
          value: "100"
        },
        {
          name: "排口排污",
          value: "152"
        },
      ];
      let chartOption= {
        color: ['#0E92C7', '#115DA3', '#2534A7', '#16764C','#075A6F'],
        backgroundColor: '#031c3d',
        title: [],
        legend: {
          orient: 'vertical',
          top: 'center',
          right: 150,
          icon:'circle',
          textStyle: {
            align: 'left',
            verticalAlign: 'middle',
            color: 'rgb(255,255,255)',
            fontSize: 18,
          }
        },
        series: [{
          type: 'pie',
          radius: ['25%', '35%'],
          center: ['50%', '50%'],
          data: data,
          hoverAnimation: false,
          labelLine: {
            normal: {
              show: false,
            }
          },
          label: {
            normal: {
              show:false,
              formatter: params => {
                return (
                  '{name|' + params.name + '}'
                );
              },
              padding: [0, -30, 0, -30],
              rich: {
                name: {
                  fontSize: '18',
                  fontWeight: 400,
                  color: '#FFFFFF'
                },
              }
            }
          },
        }]
      };

      this.chart = this.$echarts.init(this.$refs.chart);
      this.chart.clear();
      this.chart.setOption(chartOption);
    },
    eventSource(){
      let colors=['#4E35B9','#009BE4','#01F7B4'];
      let chartOption = {
        backgroundColor: '#031c3d',
        color:colors,
        legend: {
          data: ['排口排污', '12345', '微信公众号'],
          textStyle:{
            fontWeight:400,
            color:'#fff',
            fontSize:18,
          },
          selectedMode: false,
          icon:'circle',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: [
          {
            axisLabel:{
              fontWeight:400,
              color:'#fff',
              fontSize:18,
            },
            axisLine:{
              show: false,
            },
            axisTick:{
              show: false,
            },
            type: 'category',
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月']
          }
        ],
        yAxis: [
          {
            offset:20,
            axisLabel:{
              fontWeight:400,
              color:'#fff',
              fontSize:18,
            },
            axisLine:{
              show: false,
            },
            axisTick:{
              show: false,
            },
            splitLine:{
              show: false,
            },
            type: 'value'
          }
        ],
        series: [
          {
            name: '排口排污',
            type: 'bar',
            barWidth:10,
            stack: 'Total',
            //smooth: true,
            lineStyle: {
              width: 4,
              color:colors[0],
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(221,166,243,0.4)'
                },
                {
                  offset: 1,
                  color: 'rgba(240,233,243,0)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [140, 132, 101, 164, 135, 120, 150,123,145,153,167,157]
          },
          {
            name: '12345',
            type: 'bar',
            barWidth:10,
            stack: 'Total',
            //smooth: true,
            lineStyle: {
              width: 4,
              color: colors[1],
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(144,229,194,0.4)'
                },
                {
                  offset: 1,
                  color: 'rgba(191,241,221,0)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 121, 164, 120, 140, 160,125,134,112,156,145]
          },
          {
            name: '微信公众号',
            type: 'bar',
            barWidth: 10,
            stack: 'Total',
            //smooth: true,
            lineStyle: {
              width: 4,
              color: colors[2],
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(126,190,245,0.4)'
                },
                {
                  offset: 1,
                  color: 'rgba(126,190,245,0)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 111, 134, 150, 130, 120,132,142,125,135,148]
          },
        ]
      };
      this.chart = this.$echarts.init(this.$refs.chart);
      this.chart.clear();
      this.chart.setOption(chartOption);
    },
  },
  mounted() {

  }
}

</script>

<style scoped>
.chart {
  width: 800px;
  margin: auto;
  height: 500px;
}
.span {
  color: #000 !important;
  font-size: 15px;
  font-weight: 400;
  font-family: Source Han Sans CN;
  cursor: pointer;
}
</style>
