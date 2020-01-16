<template>
  <div class="abnormal">
    <!-- 加载中 -->
    <div class="gi-loading" v-show="loadingGi">
      <a-spin tip="加载中...">
        <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
      </a-spin>
    </div>
    <div class="gi-outer-wrp">
      <!-- 查询条件 -->
      <div class="gi-search-wrp">
        <a-row>
          <a-col :span="20">
            <a-row type="flex" justify="start">
              <a-col>
                <span class="al-name">指标类型</span>
                <a-select
                  placeholder="指标类型"
                  :allow-clear="true"
                  style="width: 120px"
                  v-model="searchs.zhuanye"
                  @change="changeZhuanye"
                >
                  <a-select-option v-for="d in zhuanyeList" :key="d.type">{{d.type_name}}</a-select-option>
                </a-select>
              </a-col>
              <a-col>
                <span class="al-name">预测指标</span>
                <a-select
                  :not-found-content="null"
                  dropdown-class-name="dropdown-auto-width"
                  placeholder="预测指标"
                  style="width: 160px"
                  v-model="searchs.trainIndex"
                  @change="changePritype"
                >
                  <a-select-option
                    v-for="d in trainIndexList"
                    v-bind:data-unit="d.unit ? d.unit : ''"
                    v-bind:data-granularity="d.granularity ? d.granularity : ''"
                    :key="d.trainType"
                  >{{d.trainTypeName}}</a-select-option>
                </a-select>
              </a-col>
              <a-col>
                <!-- <span class="al-name"></span> -->
                <a-auto-complete
                  dropdown-class-name="dropdown-auto-width"
                  style="width: 200px"
                  v-model="searchs.ip"
                  :allow-clear="true"
                  @search="autocompleteSearch"
                  placeholder="实例名称"
                >
                  <template slot="dataSource">
                    <a-select-option
                      v-for="item in autocompleteList"
                      :key="item.service_id"
                    >{{item.service_id}}</a-select-option>
                  </template>
                </a-auto-complete>
              </a-col>
              <a-col>
                <!-- <span class="al-name"></span> -->
                <a-date-picker
                  @change="onChangeDate"
                  :defaultValue="moment(moment(), dateFormat)"
                  :format="dateFormat"
                  :show-today="false"
                  :allow-clear="false"
                ></a-date-picker>
              </a-col>
              <a-col>
                <a-select v-model="searchs.dataType" style="width: 80px" @change="dataTypeChange">
                  <a-select-option value="D">日</a-select-option>
                  <a-select-option value="W">周</a-select-option>
                  <a-select-option value="M">月</a-select-option>
                </a-select>
              </a-col>
              <a-col>
                <a-button type="primary" @click="getCharts" :disabled="isOn">查询</a-button>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="4">
            <a-row type="flex" justify="end">
              <a-col v-show="isSwitchShow" style="margin-right:0;">
                <!--20191205新增自动刷新-->
                <span class="al-name">自动刷新</span>
                <a-switch v-model="isOn" @change="refreshChange" />
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
      <!-- 列表 -->
      <div class="gi-table-wrp">
        <!--新版20190822-->
        <div class="num-div clear-both J_hidden_tongji">
          <div class="tongji-item-new">
            <div class="item-show">
              <div class="name">预测总数</div>
              <div class="num" v-text="resData.totalForecast" v-if="resData"></div>
            </div>
          </div>
          <div class="tongji-item-new">
            <div class="item-show">
              <div class="name">实际总数</div>
              <div class="num" v-text="resData.actualTotal" v-if="resData"></div>
            </div>
          </div>
          <div class="tongji-item-new">
            <div class="item-show">
              <div class="name">超限总数</div>
              <div class="num" v-text="resData.total" v-if="resData"></div>
            </div>
          </div>
          <div class="tongji-item-new">
            <div class="item-show">
              <div class="name">超上限数</div>
              <div class="num" v-text="resData.upperTotal" v-if="resData"></div>
            </div>
          </div>
          <div class="tongji-item-new">
            <div class="item-show">
              <div class="name">超下限数</div>
              <div class="num" v-text="resData.lowerTotal" v-if="resData"></div>
            </div>
          </div>
          <div class="tongji-item-new">
            <div class="item-show">
              <div class="name">超限占比</div>
              <div class="num" v-text="resData.overrunRatio" v-if="resData"></div>
            </div>
          </div>
          <div class="tongji-item-new">
            <div class="item-show">
              <div class="name">孤立异常数</div>
              <div class="num" v-text="resData.isolatedAnomaly" v-if="resData"></div>
            </div>
          </div>
          <div class="tongji-item-new">
            <div class="item-show">
              <div class="name">合并后异常数</div>
              <div class="num num-red" v-text="resData.combinedNumber" v-if="resData"></div>
            </div>
          </div>
          <div class="tongji-item-new">
            <div class="item-show">
              <div class="name">合并后异常数占比</div>
              <div class="num num-red" v-text="resData.proportionAbnormal" v-if="resData"></div>
            </div>
          </div>
        </div>
        <h3 class="ui-moudle-title-custom no-border">
          <span class="ui-moudle-title-custom-name f14" id="tableCellName">{{tableCellName}}</span>
        </h3>
        <div class="tab-content padding-bottom-100">
          <div class="tab-pane fade in active">
            <div class="row redisEcharts-box">
              <div style="width:100%;height:440px;" id="chartsConnects"></div>
              <!--暂无数据-->
              <div class="grid-nodata-box grid-nodata-box-alarm J_noData" v-show="noData">
                <p class="no-data-icon"></p>
                <div
                  class="no-data-msg align_center color-666"
                  style="color:#A2B0C4;padding-left:40px;padding-top:16px"
                >暂无数据&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
              </div>
              <!--由于需求要求展示的图例和echarts自己解析出来的不同 此处自己写死-->
              <div class="echarts-legend-own echarts-legend-alarm" v-show="!noData">
                <ul>
                  <li>
                    <i class="echarts-legend-0"></i>
                    <span>合并结果</span>
                  </li>
                  <li>
                    <i class="echarts-legend-1"></i>
                    <span>预测值</span>
                  </li>
                  <li>
                    <i class="echarts-legend-2"></i>
                    <span>动态阈值</span>
                  </li>
                  <li>
                    <i class="echarts-legend-3"></i>
                    <span>实际值</span>
                  </li>
                  <li>
                    <i class="echarts-legend-4"></i>
                    <span>异常点</span>
                  </li>
                  <li
                    class="cursor J_legendStatic"
                    v-show="J_legendStaticShow"
                    :class="{'off':J_legendStaticOffClass}"
                    @click="legendStaticClk"
                  >
                    <i class="echarts-legend-5"></i>
                    <span>静态阈值</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import {
  getZhuanyes,
  getPriTypes,
  getLenoven,
  getPageDisplay
} from "../request/api";
var dataLevel = []; //级别
const chartsRelate = {
  //连续异常阴影区域的样式
  markAreaItemStyle: {
    normal: {
      color: "#FEEEE7",
      opacity: 0.6,
      //borderWidth: 1, //默认为0 改为0可解决来回滑动有根线存在的bug
      borderColor: "#ffc9b5"
    }
  },
  //grid 间距
  grid: {
    x: "80",
    y: "5%", //上侧的距离
    x2: "80",
    y2: "15%"
  },
  //x轴数据来源和格式
  xAxis: {
    type: "time",
    triggerEvent: true, //触发点击事件
    boundaryGap: false,
    //data: xaxis,//xAixs的type有category改为time后 需要的数据格式发生变化 不再需要声明data
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
    },
    maxInterval: 2 * 3600 * 24 * 1000, //证坐标轴分割刻度最大为两天
    //minInterval: 1,//设置成1保证坐标轴分割刻度显示成整数
    //interval:1*60*1000*60,
    axisLabel: {
      textStyle: {
        fontSize: 12,
        color: "#2D3E53"
      },
      formatter: function(value) {
        //var time = DateFmt.Formate(value, "yyyy-MM-dd HH:mm:ss");
        var time = moment(value).format("YYYY-MM-DD HH:mm:ss");
        return time.replace(" ", "\n");
      }
    }
  }
};
export default {
  name: "abnormal",
  computed: {
    breadcrumb() {
      return this.$route.meta.breadcrumbList;
    }
  },
  data() {
    return {
      searchs: {
        zhuanye: undefined, //专业
        trainType: "anomaly_detection", //根据 页面的切换 而改变值
        trainIndex: undefined, //预测指标
        ip: "", //IP/设备名称
        dataTime: moment().format("YYYY-MM-DD"), //时间(YYYY-MM-DD) 默认当天
        dataType: "D" //日周月 D W M
      },
      dateFormat: "YYYY-MM-DD",
      unit: "", //根据选中的预测指标带出的y轴单位
      granularity: "", //根据选中的预测指标带出的时间粒度
      autocompleteList: [], //模糊下拉
      zhuanyeList: "",
      trainIndexList: [],
      loadingGi: false, //加载中
      isOn: false,
      isSwitchShow: false,
      J_legendStaticShow: false, //控制是否展示静态阈值
      J_legendStaticOffClass: false, //控制静态阈值是否可点击
      myChart: null,
      timerAuto: null,
      refreshTime: 1 * 5 * 1000, //每隔5s钟刷新一次
      noData: true,
      tableCellName: "",
      indicator: ' <a-icon type="loading" style="font-size: 24px" spin />',
      resData: null //200时后台返回的data
    };
  },
  created() {
    this.getListZhuanye();
  },
  methods: {
    //有日期控件时import之后需要再增加methods
    moment,
    //自动刷新开关按钮
    refreshChange(value) {
      var that = this;
      that.isOn = value;
      if (value == true) {
        //开启定时器
        that.timerAuto = setInterval(function() {
          that.getCharts();
        }, that.refreshTime);
      } else {
        clearInterval(that.timerAuto);
        that.timerAuto = null;
      }
    },
    //时间范围选择
    onChangeDate(date, dateString) {
      this.searchs.dataTime = dateString;
    },
    //日期类型选择
    dataTypeChange() {
      if (this.timerAuto) {
        clearInterval(this.timerAuto);
        this.timerAuto = null;
      }
      this.isOn = false;
    },
    tipFormatter(params) {
      var that = this;
      var chartsUnit = that.unit;
      var tooltipStr = "";
      var time = params[0].value[0];
      var curVal =
        (params[0].value[1] == "" && params[1].value[1] == "") ||
        (params[0].value[1] == "" && params[1].value[1] == "NaN") ||
        (params[0].value[1] == "" && params[1].value[1] == "00")
          ? "--"
          : accAdd(params[0].value[1], params[1].value[1]);
      //要求tip提示顺序是时间-预测值2-上限1-下限0-实际值3
      if (params && params.length > 0) {
        var val2 = "",
          val3 = "";
        var val0 =
          params[0].value[1] == "" ||
          params[0].value[1] == null ||
          params[0].value[1] == undefined
            ? "--"
            : params[0].value[1] + chartsUnit;
        if (params[2]) {
          val2 =
            params[2].value[1] == "" ||
            params[2].value[1] == null ||
            params[2].value[1] == undefined
              ? "--"
              : params[2].value[1] + chartsUnit;
        } else {
          val2 = "--";
        }
        if (params[3]) {
          if (
            params[3].value[1] == "" ||
            params[3].value[1] == null ||
            params[3].value[1] == undefined
          ) {
            val3 = "--";
          } else {
            val3 = params[3].value[1] + chartsUnit;
          }
        } else {
          val3 = "--";
        }
        var valShangxian = curVal != "--" ? curVal + chartsUnit : curVal;
        var valLevel = dataLevel[params[0].dataIndex];
        valLevel = valLevel == "" ? "--" : valLevel;
        tooltipStr =
          '<div class="tip of-hidden"><p><span class="tip-left">时间:</span><span class="tip-right">' +
          time +
          "</span></p></div>" +
          '<div class="tip of-hidden"><p><span class="tip-left">预测值:</span><span class="tip-right">' +
          val2 +
          "</span></p></div>" +
          '<div class="tip of-hidden"><p><span class="tip-left">上限:</span><span class="tip-right">' +
          valShangxian +
          "</span></p></div>" +
          '<div class="tip of-hidden"><p><span class="tip-left">下限:</span><span class="tip-right">' +
          val0 +
          "</span></p></div>" +
          '<div class="tip of-hidden"><p><span class="tip-left">实际值:</span><span class="tip-right J_shiji">' +
          val3 +
          "</span></p></div>" +
          '<div class="tip of-hidden"><p><span class="tip-left">级别:</span><span class="tip-right J_shiji">' +
          valLevel +
          "</span></p></div>";
        return tooltipStr;
      }
    },
    //获取列表
    async getCharts() {
      var that = this;
      that.loadingGi = true;
      that.isSwitchShow = true;
      //选择Haproxy指标，如果查询框没有输入实例名称，点击查询时，要提示一下：请输入实例名称
      if (
        that.searchs.trainIndex == "ha_ins_resp_time" &&
        that.searchs.ip == ""
      ) {
        that.$message.error("请输入实例名称", 3);
        return;
      }
      var chartsUnit = that.unit;
      var granularity = that.granularity;
      let requestData = {
        ...that.searchs,
        ip: that.searchs.ip || "", //初始值为undefined 取不过来
        trainIndex: that.searchs.trainIndex || ""
      };
      var result = await getPageDisplay(requestData);
      that.loadingGi = false;

      if (result.status == 200) {
        that.resData = result.data;
        //小标题
        let zhuanyeCur = that.zhuanyeList.filter(
            item => item.type == that.searchs.zhuanye
          ), //指标类型
          trainIndexCur = that.trainIndexList.filter(
            item => item.trainType == that.searchs.trainIndex
          ), //预测指标
          type_name =
            zhuanyeCur.length > 0 ? zhuanyeCur[0].type_name : "指标类型",
          trainTypeName =
            trainIndexCur.length > 0
              ? trainIndexCur[0].trainTypeName
              : "预测指标";
        that.tableCellName =
          type_name + "-" + trainTypeName + "-" + (that.searchs.ip || "");

        var data = result.data.series; //所有值集合 顺序 0预测值-1实际值-2上限值-3下限值-4预测值
        var xaxis =
          result.data.xaxis && result.data.xaxis.data
            ? result.data.xaxis.data
            : []; //横坐标
        var numObj = result.data; //返回的数据

        if (xaxis.length <= 0) {
          that.myChart = that.$echarts.init(
            document.getElementById("chartsConnects")
          );
          that.myChart.clear();
          that.noData = true;
          return;
        } else {
          that.noData = false;
        }
        //isWork (string, optional): 是否展示(“Y”，则默认展示静态阈值；否则如果值为“N”，则默认不展示，如果为“S” 则不显示静态阈值按钮和线) ,
        var legendStaticStatus = false;
        if (numObj.isWork == "S") {
          that.J_legendStaticShow = false;
          //$('.J_legendStatic').addClass('hidden');
        } else if (numObj.isWork == "N") {
          //控制静态阈值图例的样式
          that.J_legendStaticShow = true;
          that.J_legendStaticOffClass = true;
        } else {
          legendStaticStatus = true;
          that.J_legendStaticShow = true;
          that.J_legendStaticOffClass = false;
        }
        var dataMin = data[3].data; //下限
        var dataMax = data[2].data; //上限
        var dataActual = data[1].data; //实际值
        //isWork为S时 后台不返回静态阈值下和上
        var dataStaticMin = numObj.isWork == "S" ? [] : data[7].data; //静态阈值下
        var dataStaticMax = numObj.isWork == "S" ? [] : data[6].data; //静态阈值上
        dataLevel = [];
        dataLevel = data[5].data; //级别
        var dataVirtual = data[0].data; //预测值
        var isNormalData = data[4].data; //正常异常
        //xAixs的type有category改为time后 需要的数据格式发生变化
        var dataMinArr = [],
          dataMaxArr = [],
          dataVirtualArr = [],
          dataActualArr = [],
          dataStaticMinArr = [],
          dataStaticMaxArr = [];
        //真正开始的地方
        var dataActualEmptysMap = []; //折线分段
        var dataActualNotnullIndexs = []; //获取所有不为空的实际值的索引值
        var dataActualNotnullsX = []; //获取所有不为空的实际值的索引值 对应的x轴时间点数据
        for (var h = 0; h < dataActual.length; h++) {
          if (dataActual[h] != "") {
            dataActualNotnullIndexs.push(h);
            dataActualNotnullsX.push(xaxis[h]); //值为""对应的x轴横坐标值
          }
        }
        console.log(dataActualNotnullIndexs);
        console.log(dataActualNotnullsX);
        /*
							 * 陈静锋: 微信2019-08-02
								是指相邻分钟的点要做连线，比如00:01:30、00:01:45、00:02:15、00:02:50这几个点要连接
								陈静锋:
								跨了分钟的点可以不做连接，比如00:01:30、00:01:45、00:03:15、00:03:50这组数据，00:01:45和00:03:15之间中间跨了00:02:00分钟，就不用连接了，@最近的人
								陈静锋:
								也就是当前时间点的数据（假设分钟=A）往前找 分钟=A-1，秒等于00的数据，找到就连，找不到不连
							 */
        for (var p = 0; p < dataActualNotnullsX.length - 1; p++) {
          var datetime1 = dataActualNotnullsX[p].replace(/\n/g, " "); //形如2019-08-03 08:38:30
          var datetime2 = dataActualNotnullsX[p + 1].replace(/\n/g, " ");
          //截取秒之前的字符串 形如2019-08-03 08:38: 把秒都改为00 然后比较差值 >1分钟的标红 即不连线
          var datetimeNow1 = datetime1.substring(0, 17) + "00";
          var datetimeNow2 = datetime2.substring(0, 17) + "00";
          var resultTime = new Date(datetimeNow2).getTime() - new Date(datetimeNow1).getTime();
          //这个要动态获取训练配置的时间粒度（分钟），然后再*2，>时间粒度*2的就不连 by秋焱20190926
          if (resultTime > 2 * granularity * 60 * 1000) {
            var start0 = xaxis[dataActualNotnullIndexs[p]];
            var end0 = xaxis[dataActualNotnullIndexs[p + 1]];
            //type为time时 gt lte使用对应x轴点的时间毫秒时间戳 解决visualmap失效问题
            dataActualEmptysMap.push({
              gt: new Date(start0).getTime(),
              lte: new Date(end0).getTime(),
              color: "transparent"
            });
          }
        }
        console.log(dataActualEmptysMap);
        var startValue = 0,
          xTimeLast = xaxis[xaxis.length - 1],
          startTime = 0;
        //20191209 暂时注释
        /*if(that.searchs.dataType == "D") { //展示近1个小时的数据 默认展示近n*个小时
								startTime = new Date(xTimeLast).getTime()-3*60*60*1000;
								//startValue = DateFmt.Formate(startTime);
								startValue = moment(startTime).format("YYYY-MM-DD HH:mm:ss");
							}*/
        if (that.searchs.dataType == "W") {
          //展示近一天
          startTime = new Date(xTimeLast).getTime() - 24 * 60 * 60 * 1000;
          //startValue = DateFmt.Formate(startTime);
          startValue = moment(startTime).format("YYYY-MM-DD HH:mm:ss");
        }
        if (that.searchs.dataType == "M") {
          //展示近两天
          startTime = new Date(xTimeLast).getTime() - 2 * 24 * 60 * 60 * 1000;
          //startValue = DateFmt.Formate(startTime);
          startValue = moment(startTime).format("YYYY-MM-DD HH:mm:ss");
        }
        var datazoomShow = xaxis.length > 0 ? true : false;
        console.time("拼接数据格式");
        //后台返回的数据格式是[1,31,3,45] 而画图需要的格式是形如[['2019-08-23 00:01:00','10'],['2019-08-23 00:02:00',''],['2019-08-23 00:01:00','23']]
        for (var i = 0; i < xaxis.length; i++) {
          var b =
            dataMax[i] == "" && dataMin[i] == ""
              ? "00"
              : accSub(dataMax[i], dataMin[i]);
          dataMaxArr.push([xaxis[i], b]); //上限  使用了stack堆叠属性 此处需巧妙处理一下
          dataMinArr.push([xaxis[i], dataMin[i]]);
          dataActualArr.push([xaxis[i], dataActual[i]]);
          dataVirtualArr.push([xaxis[i], dataVirtual[i]]);
          dataStaticMinArr.push([xaxis[i], dataStaticMin[i]]);
          dataStaticMaxArr.push([xaxis[i], dataStaticMax[i]]);
        }
        console.timeEnd("拼接数据格式");
        //异常标记红点
        var markPoinData = []; //异常标记
        if (dataActual.length > 0) {
          for (var j = 0; j < dataActual.length; j++) {
            if (isNormalData[j] == "异常") {
              markPoinData.push({
                value: "",
                itemStyle: {
                  normal: {
                    label: {
                      show: false //折点显示数据
                    }
                  }
                },
                xAxis: xaxis[j],
                yAxis: dataActual[j],
                symbol: "react",
                symbolSize: 4
              });
            }
          }
        }
        //连续异常 区间
        var markAreaData = [];
        var markAreaDataHoutai = numObj.dbTimes ? numObj.dbTimes : [];
        if (markAreaDataHoutai && markAreaDataHoutai.length > 0) {
          for (var m in markAreaDataHoutai) {
            markAreaData.push([
              {
                name: "", //区间名称
                xAxis: markAreaDataHoutai[m].start,
                itemStyle: chartsRelate.markAreaItemStyle
              },
              {
                xAxis: markAreaDataHoutai[m].end
              }
            ]);
          }
        }
        var option = {
          tooltip: {
            trigger: "axis",
            formatter: that.tipFormatter
          },
          legend: {
            //data: data.legendData, //data.legendData
            show: false, //隐藏自带图例 使用自定义图例
            data: [
              "下限",
              "上限",
              "预测值",
              "实际值",
              "静态阈值上",
              "静态阈值下"
            ],
            //实现初始某一项默认不选择
            selected: {
              静态阈值上: legendStaticStatus,
              静态阈值下: legendStaticStatus
            },
            icon: "roundRect",
            orient: "horizontal",
            left: "center",
            bottom: "1%",
            textStyle: {
              fontSize: 12,
              color: "#2D3E53"
            }
          },
          grid: chartsRelate.grid,
          xAxis: chartsRelate.xAxis,
          animation: false,
          animationDurationUpdate: 0,
          yAxis: {
            name: "",
            nameTextStyle: {
              color: "#2D3E53"
            },
            color: "#2D3E53",
            type: "value",
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            },
            splitNumber: 5,
            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: "#2D3E53"
              },
              formatter: function(value) {
                var chartsUnitY = chartsUnit ? chartsUnit : "";
                return value + chartsUnitY;
              }
            }
          },
          dataZoom: [
            // 这个dataZoom组件，若未设置xAxisIndex或yAxisIndex，则默认控制x轴。
            {
              type: "slider", //这个 dataZoom 组件是 slider 型 dataZoom 组件（只能拖动 dataZoom 组件导致窗口变化）
              xAxisIndex: 0, //控制x轴
              startValue: startValue,
              endValue: xaxis[xaxis.length - 1],
              show: datazoomShow,
              bottom: "2px",
              showDataShadow: true,
              minValueSpan: 3600 * 3 * 1000,
              labelFormatter: function(value) {
                //var labelTime = DateFmt.Formate(value, "yyyy-MM-dd HH:mm:ss");
                var labelTime = moment(value).format("YYYY-MM-DD HH:mm:ss");
                return labelTime.replace(" ", "\n");
              }
            }
          ],
          visualMap: {
            //是否连接空数据 20190802 巧妙解决折线断裂连接 然后真正断裂的地方使用透明色假性过滤掉（呈现数据不连续的断裂效果）
            seriesIndex: 3, //指定取哪个系列的数据，即哪个系列的 series.data
            show: false,
            showLabel: true,
            dimension: 0, // 1为y轴，0为x轴 type
            type: "piecewise", // 分段型
            pieces: dataActualEmptysMap,
            outOfRange: {
              //定义 在选中范围外 的视觉元素。
              color: "#42BA81"
            }
          },
          series: [
            {
              name: "下限",
              z: 0, //使markArea背景色层级高于上下限区域背景色
              type: "line",
              data: dataMinArr,
              lineStyle: {
                normal: {
                  //opacity: 0,
                  color: "#E1E1E1",
                  width: 1
                }
              },
              areaStyle: {
                normal: {
                  color: "#f00",
                  opacity: 0
                }
              },
              symbol: "none",
              smooth: true,
              showSymbol: false,
              hoverAnimation: false,
              stack: "上下限"
            },
            {
              name: "上限",
              type: "line",
              z: 0, //使markArea背景色层级高于上下限区域背景色 z相比zlevel优先级更低，而且不会创建新的 Canvas
              data: dataMaxArr, //上限值 后台返回后前端处理过的
              lineStyle: {
                normal: {
                  color: "#E1E1E1",
                  width: 1
                }
              },
              areaStyle: {
                normal: {
                  color: "#F9F9F9",
                  opacity: 0.6,
                  width: 1
                }
              },
              symbol: "none",
              smooth: true,
              showSymbol: false,
              hoverAnimation: false,
              stack: "上下限"
            },
            {
              name: "预测值",
              type: "line",
              //connectNulls: true, //是否连接空数据 20190802 巧妙解决折线断裂连接
              data: dataVirtualArr, //预测值
              smooth: true,
              //showSymbol: false, hoverAnimation: false,
              symbol: "react",
              symbolSize: 0.1,
              itemStyle: {
                //折点颜色自定义 解决无连线是折点看不到 误以为此处无值
                normal: {
                  borderColor: "#F6AD34",
                  borderWidth: 1
                }
              },
              lineStyle: {
                normal: {
                  opacity: 1,
                  color: "#F6AD34",
                  width: 1
                }
              }
            },
            {
              name: "实际值",
              //划区域 并自定义颜色 20190704
              markArea: {
                silent: true, //图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
                data: markAreaData
              },
              type: "line",
              connectNulls: true, //是否连接空数据 20190802 巧妙解决折线断裂连接
              data: dataActualArr, //实测值
              markPoint: {
                data: markPoinData,
                symbolSize: 6,
                itemStyle: {
                  normal: {
                    color: "#FB524F" //异常标记点颜色
                  }
                }
              },
              smooth: true,
              //showSymbol: false, hoverAnimation: false,
              symbol: "react",
              symbolSize: 0.1,
              itemStyle: {
                //折点颜色自定义 解决无连线是折点看不到 误以为此处无值
                normal: {
                  borderColor: "#42BA81",
                  borderWidth: 1
                }
              },
              lineStyle: {
                normal: {
                  opacity: 1,
                  //color: '#42BA81',
                  width: 1
                }
              }
            },
            {
              name: "静态阈值上",
              type: "line",
              data: dataStaticMaxArr,
              symbol: "none",
              animation: false,
              smooth: true,
              showSymbol: false,
              hoverAnimation: false,
              lineStyle: {
                normal: {
                  opacity: 1,
                  color: "#FC9191",
                  width: 1,
                  type: "dashed"
                }
              }
            },
            {
              name: "静态阈值下",
              type: "line",
              data: dataStaticMinArr,
              symbol: "none",
              animation: false,
              smooth: true,
              showSymbol: false,
              hoverAnimation: false,
              lineStyle: {
                normal: {
                  opacity: 1,
                  color: "#FC9191 ",
                  width: 1,
                  type: "dashed"
                }
              }
            }
          ]
        };

        that.myChart = that.$echarts.init(
          document.getElementById("chartsConnects")
        );
        that.myChart.clear();
        // 使用刚指定的配置项和数据显示图表。
        that.myChart.setOption(option);
      } else {
        that.$message.error(result.message);
      }
    },
    //静态阈值图例点击事件
    legendStaticClk() {
      var isOff = this.J_legendStaticOffClass; //是否是关闭状态
      if (isOff) {
        this.J_legendStaticOffClass = false;
        //选中图例
        this.myChart.dispatchAction({
          type: "legendSelect",
          name: "静态阈值上"
        });
        this.myChart.dispatchAction({
          type: "legendSelect",
          name: "静态阈值下"
        });
      } else {
        this.J_legendStaticOffClass = true;
        //取消选中图例
        this.myChart.dispatchAction({
          type: "legendUnSelect",
          name: "静态阈值上"
        });
        this.myChart.dispatchAction({
          type: "legendUnSelect",
          name: "静态阈值下"
        });
      }
    },
    //指标类型
    async getListZhuanye() {
      let res = await getZhuanyes();
      this.zhuanyeList = res.status == "200" ? res.data : [];
    },
    //预测指标 根据指标类型联动 默认选中第一个
    async getListPriType(id) {
      if (!id) {
        //点击清除按钮后清除预测指标相关内容
        this.trainIndexList = [];
        this.searchs.trainIndex = undefined;
        this.unit = "";
        this.granularity = "";
        return;
      }
      let res = await getPriTypes({ deviceType: id });
      if (res.status == "200") {
        this.trainIndexList = res.data;
        if (this.trainIndexList.length >= 0) {
          this.unit = this.trainIndexList[0].unit
            ? this.trainIndexList[0].unit
            : "";
          this.granularity = this.trainIndexList[0].granularity
            ? this.trainIndexList[0].granularity
            : "";
          this.searchs.trainIndex = this.trainIndexList[0].trainType; //默认选中第一个
        }
      }
    },
    changePritype(value) {
      //找到数组中某个trainType为value的对象 取出unit和granularity复制给
      let curItem = this.trainIndexList.filter(item => item.trainType == value);
      this.unit = curItem[0].unit ? curItem[0].unit : "";
      this.granularity = curItem[0].granularity ? curItem[0].granularity : "";
    },
    changeZhuanye(value) {
      this.getListPriType(value);
    },
    //模糊下拉-自动完成
    async autocompleteSearch(value) {
      let data = {
        ip: value, // "输入框的id":"后台需要的入参名称" 采集机ip
        trainIndex: this.trainIndex, //20191016 入参type改为trainIndex
        trainType: "anomaly_detection" //20191016 新增入参
      };
      let res = await getLenoven(data);
      this.autocompleteList = res.status == "200" ? res.data : [];
    }
  }
};
// 两个浮点数相减
function accSub(num1, num2) {
  var r1, r2, m, n;
  try {
    r1 = num1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = num2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  n = r1 >= r2 ? r1 : r2;
  return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
}
// 两个浮点数求和
function accAdd(num1, num2) {
  var r1, r2, m;
  try {
    r1 = num1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = num2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return Math.round(num1 * m + num2 * m) / m;
}
</script>

