<template>
  <div class="caposition">
    <div class="gi-outer-wrp">
      <!-- 查询条件 -->
      <div class="gi-search-wrp">
        <a-row type="flex" justify="start">
          <a-col>
            <span class="al-name">训练分组</span>
            <a-select
              dropdown-class-name="dropdown-auto-width"
              placeholder="训练分组"
              :allow-clear="true"
              style="width: 120px"
              v-model="searchs.domain"
              @change="domainChange"
            >
              <a-select-option v-for="d in domainList" :key="d.domain">{{d.domain_name}}</a-select-option>
            </a-select>
          </a-col>
          <a-col>
            <span class="al-name">主告警对象类型</span>
            <a-select
              placeholder="主告警对象类型"
              :not-found-content="null"
              :allow-clear="true"
              style="width: 140px"
              v-model="searchs.masterDeviceType"
              @change="masterDeviceTypeChange"
            >
              <a-select-option
                v-for="d in masterDeviceTypeList"
                :key="d.master_device_type"
              >{{d.master_device_type}}</a-select-option>
            </a-select>
          </a-col>
          <a-col>
            <span class="al-name">主告警标题</span>
            <a-auto-complete
              dropdown-class-name="dropdown-auto-width"
              style="width: 160px"
              v-model="searchs.masterTitle"
              :allow-clear="true"
              @search="autocompleteSearch"
              placeholder="主告警标题"
            >
              <template slot="dataSource">
                <a-select-option
                  v-for="(item,index) in masterTitleList"
                  :key="'master'+index"
                  :value="item.master_title"
                >{{item.master_title}}</a-select-option>
              </template>
            </a-auto-complete>
          </a-col>
          <a-col>
            <span class="al-name">次告警对象类型</span>
							<a-select :not-found-content="null" placeholder="次告警对象类型" :allow-clear="true" style="width: 140px" v-model="searchs.slaveDeviceType" @change="slaveDeviceTypeChange">
								<a-select-option v-for="d in slaveDeviceTypeList" :key="d.slave_device_type">{{d.slave_device_type}}</a-select-option>
							</a-select>
          </a-col>
          <a-col>
            <span class="al-name">次告警标题</span>
            <a-auto-complete
              dropdown-class-name="dropdown-auto-width"
              style="width: 160px"
              v-model="searchs.slaveTitle"
              :allow-clear="true"
              @search="autocompleteSearchSlave"
              placeholder="主告警标题"
            >
              <template slot="dataSource">
                <a-select-option
                  v-for="(item,index) in slaveTitleList"
                  :key="'slave'+index"
                  :value="item.slave_title"
                >{{item.slave_title}}</a-select-option>
              </template>
            </a-auto-complete>
          </a-col>
          <a-col>
            <a-button type="primary" @click="showVisSearch">查询</a-button>
          </a-col>
        </a-row>
      </div>
      <!-- vis -->
      <div class="vis-network-wrp vis-depend">
        <!--暂无数据-->
        <div class="no-data-wrp" v-if="showNodata">
          <p class="no-data-icon"></p>
          <div
            class="no-data-msg align_center"
            style="color: rgb(162, 176, 196); padding-left: 40px; padding-top: 16px;"
          >暂无数据&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
        </div>
        <div class="vis-min-box">
          <a-icon
            v-show="showMaxBtn"
            class="vis-max-min vis-max"
            title="全屏"
            type="arrows-alt"
            @click="showVisMaxClk"
          />
        </div>
        <div id="mynetwork" class="gi-vis-wrp mynetwork-depend"></div>
      </div>
    </div>
    <!-- 第二屏 查看 -->
    <!--<div class="sec-wrp-outer gi-outer-wrp" id="secondWrp">
			<div class="vis-network-wrp">
				<div class="vis-min-box">
					<a-icon class="vis-max-min vis-max" title="全屏" type="arrows-alt" @click="showVisMaxClk"/>
				</div>
				<div id="mynetwork" class="gi-vis-wrp"></div>
			</div>
    </div>-->
    <!-- vis最大化 -->
    <div class="vis-max-wrp" v-show="showVisMax">
      <div class="vis-min-box">
        <a-icon
          class="vis-max-min vis-min"
          title="关闭"
          type="shrink"
          @click="showVisMax=!showVisMax"
        />
      </div>
      <div id="mynetworkMax"></div>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
const vis = require("vis-network/dist/vis-network.min.js");
require("vis-network/dist/vis-network.min.css");
import {
  getDomains,
  getMasterTypes,
  getSlaveTypes,
  acMasters,
  acSlaves,
  rerulesVis
} from "../request/api";
//vis 配置
const optionsVis = {
  nodes: {
    //节点配置
    //margin: 10,
    widthConstraint: {
      maximum: 130 //设置节点最大宽度，超出换行
    },
    fixed: false, //设置节点固定,如果为真，则节点不会沿X方向移动
    shape: "dot", //默认椭圆 dot为圆形
    size: 25, //节点的大小， 默认25，当列表中每一项中没有设置时，使用这个全局尺寸
    borderWidth: 2, //节点边框的宽度,单位为px
    borderWidthSelected: 2, //节点被选中时边框的宽度， 单位为px
    font: {
      //字体配置
      color: "rgba(0,0,0,0.85)", //颜色
      size: 12, // 大小，单位px
      face: "arial", //字体
      background: "none", //背景
      align: "left" //位置left right center
    },
    color: {
      border: "transparent", //节点边框颜色
      background: "#fff", //节点背景颜色
      highlight: {
        //节点选中时状态颜色
        border: "#55A3FF",
        background: "#fff"
      },
      hover: {
        //节点鼠标滑过时状态颜色
        border: "#2B7CE9",
        background: "none"
      }
    },
    scaling: {
      min: 1,
      max: 15
    }
  },
  edges: {
    length: 300,
    smooth: {
      type: "continuous" //continuous diagonalCross
    },
    color: {
      color: "#BFBFBF", //默认颜色
      highlight: "#55A3FF" //悬停或选中节点时颜色
    },
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.4
        //type: 'circle', //箭头改为圆点
      }
    }, //箭头指向to节点
    label: "",
    font: {
      align: "bottom", //连线上描述的位置 middle  top horizontal bottom
      size: 12 //字体大小
    }
  },
  layout: {
    randomSeed: 1 //配置每次生成的节点位置都一样，参数为数字1、2等
    //			 hierarchical: {
    //				 direction: "LR", //UD:上下 DU:下上 LR:左右 RL:右左
    //				 sortMethod: "directed",
    //				 levelSeparation: 200,//每个层级之间的距离 默认150
    //			 	 nodeSpacing: 150,//每个节点之间的距离 默认100
    //			 }
  },
  interaction: {
    keyboard: true,
    navigationButtons: true, //默认false
    hover: false //默认false
  },
  physics: {
    stabilization: false,
    barnesHut: {
      centralGravity: 0.3, // 默认是0.3，中心重力吸引器将整个网络拉回中心,值越大，节点越近，太大的话，布局会很难稳定下来，当>5的时候，就开始弹动停不下来
      springLength: 80, // 边缘被建模为弹簧。这个弹簧长度是弹簧的剩余长度
      gravitationalConstant: -10000, // 重力吸引。我们喜欢排斥 所以价值是负数。如果你想要排斥力更强，减小值（所以-10000，-50000）。
      avoidOverlap: 1, // 接受范围:[0 .. 1]。当大于0时，会考虑节点的大小。该距离将由重力模型的节点的包围圆的半径计算。值1是最大重叠避免。
      damping: 0.09, //默认是0.09，范围是0~1，阻尼因子，值越大，阻力越大
      springConstant: 0.05 //(默认是0.04，弹性的固性，值越高意味着弹簧越强。测试时，当值>3.1，开始停不下来的弹动)
    },
    //hierarchicalRepulsion:{},
    minVelocity: 30 //改为特别大的值时解决了控制太distance报错问题 一旦达到所有节点的最小速度，我们假设网络已经稳定，仿真停止。//好像只要这个就可以啦huanglp
  }
};
export default {
  name: "caposition",
  data() {
    return {
      searchs: {
        domain: undefined, //训练分组 即资源域
        masterDeviceType: undefined, //主告警对象类型 必须用undefined placeholder才能生效
        slaveDeviceType: undefined, //主告警标题
        masterTitle: undefined, //次告警对象类型
        slaveTitle: undefined //次告警标题
      },
      domainList: [],
      masterDeviceTypeList: [],
      slaveDeviceTypeList: [],
      masterTitleList: [],
      slaveTitleList: [],
      showNodata: true,
      loadingGi: false,
      showMaxBtn: false,
      network1: null,
      network2: null,
      showVisMax: false,
      visData: null
    };
  },
  created() {
    this.getListDomain();
    //this.getList();
  },
  methods: {
    //查询
    showVisSearch(params = {}) {
      var that = this;
      if (!that.searchs.domain) {
        that.$message.error("请选择训练分组!");
        return;
      }
      if (that.searchs.domain) {
        if (
          that.searchs.masterDeviceType == undefined &&
          that.searchs.masterTitle
        ) {
          that.$message.error("请选择主告警对象类型");
          return;
        }
        if (
          that.searchs.masterDeviceType &&
          that.searchs.masterTitle == undefined
        ) {
          that.$message.error("请选择主告警标题");
          return;
        }
        if (
          that.searchs.slaveDeviceType == undefined &&
          that.searchs.slaveTitle
        ) {
          that.$message.error("请选择次告警对象类型");
          return;
        }
        if (
          that.searchs.slaveDeviceType &&
          that.searchs.slaveTitle == undefined
        ) {
          that.$message.error("请选择次告警标题");
          return;
        }
      }
      this.showVis();
    },
    //vis最大化
    showVisMaxClk() {
      this.showVisMax = true;
      var that = this;
      if (that.network2) {
        that.network2.destroy();
      }
      setTimeout(function() {
        let visData = that.visData;
        var nodes = new vis.DataSet(visData.nodes);
        var edges = new vis.DataSet(visData.edges);
        var containerVis = document.getElementById("mynetworkMax");
        var dataVis = {
          nodes: nodes,
          edges: edges
        };
        that.network2 = new vis.Network(containerVis, dataVis, optionsVis);
      }, 500);
    },
    //渲染vis
    async showVis(params = {}) {
      var that = this;
      if (that.network1) {
        that.network1.destroy();
      }
      that.showMaxBtn = false;
      let requestData = {
        ...params,
        ...that.searchs
      };
      that.loadingGi = true;
      let res = await rerulesVis(requestData);
      that.loadingGi = false;
      if (res.status == "407") {
        that.$message.error("告警关系数据过多无法展示，请输入查询条件", 3);
      }
      if (res.status == "200") {
        //渲染vis
        that.visData = res.rows;
        if (res.rows.nodes.length > 0) {
          that.showNodata = false;
        } else {
          that.showNodata = true;
        }
        var nodes = new vis.DataSet(res.rows.nodes);
        var edges = new vis.DataSet(res.rows.edges);
        var containerVis = document.getElementById("mynetwork");
        var dataVis = {
          nodes: nodes,
          edges: edges
        };
        that.network1 = new vis.Network(containerVis, dataVis, optionsVis);
        that.showMaxBtn = true;
        that.dataSec = res.rows.recordList;
      }
      if (res.status == "201") {
        that.$message.error(res.message, 3);
      }
    },
    //资源域  训练分组
    async getListDomain(params = {}) {
      var res = await getDomains();
      this.domainList = res.status == "200" ? res.data : [];
    },
    //主告警对象类型下拉
    async getListMasterType(id) {
      var res = await getMasterTypes({ domain: id });
      this.masterDeviceTypeList = res.status == "200" ? res.data : [];
    },
    //次告警对象类型下拉
    async getListSlaveType(id) {
      var res = await getSlaveTypes({ domain: id });
      this.slaveDeviceTypeList = res.status == "200" ? res.data : [];
    },
    //模糊下拉-自动完成-主告警标题
    async autocompleteSearch(value) {
      //如果训练分组未选择，则主告警标题输入后无下拉选项
      if (!this.searchs.domain) {
        return;
      }
      let requestData = {
        domain: this.searchs.domain, //必填
        masterTitle: value,
        masterDeviceType: this.searchs.masterDeviceType
      };
      let res = await acMasters(requestData);
      this.masterTitleList = res.status == "200" ? res.data : [];
    },
    //模糊下拉-自动完成-次告警标题
    async autocompleteSearchSlave(value) {
      //如果训练分组未选择，则主告警标题输入后无下拉选项
      if (!this.searchs.domain) {
        return;
      }
      let requestData = {
        domain: this.searchs.domain, //必填
        slaveTitle: value,
        slaveDeviceType: this.searchs.slaveDeviceType
      };
      let res = await acSlaves(requestData);
      this.slaveTitleList = res.status == "200" ? res.data : [];
    },
    domainChange(value) {
      //点击清除按钮后清除主告警对象类型 次告警对象类型
      this.masterDeviceTypeList = [];
      this.slaveDeviceTypeList = [];
      this.masterTitleList = [];
      this.slaveTitleList = [];
      this.searchs.masterDeviceType = undefined;
      this.searchs.slaveDeviceType = undefined;
      this.searchs.masterTitle = undefined;
      this.searchs.slaveTitle = undefined;
      if (!value) {
        return;
      }
      this.getListMasterType(value);
      this.getListSlaveType(value);
    },
    masterDeviceTypeChange(value) {
      this.masterTitleList = [];
      this.searchs.masterTitle = undefined;
      //this.autocompleteSearch('');//默认传'' 鼠标放入主告警输入框就就有下拉选择
    },
    slaveDeviceTypeChange(value) {
      this.slaveTitleList = [];
      this.searchs.slaveTitle = undefined;
      //this.autocompleteSlave('');//默认传'' 鼠标放入主告警输入框就就有下拉选择
    }
  }
};
</script>
