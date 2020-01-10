<template>
  <div class="caposition">
    <div class="gi-outer-wrp">
				<!-- 查询条件 -->
				<div class="gi-search-wrp">
					<a-row>
						<a-col :span="20">
							<a-row type="flex" justify="start">
								<a-col>
									<span class="al-name">训练分组</span>
									<a-select dropdown-class-name="dropdown-auto-width" placeholder="训练分组" :allow-clear="true" style="width: 120px" v-model="searchs.domain" @change="domainChange">
										<a-select-option v-for="d in domainList" :key="d.domain">{{d.domain_name}}</a-select-option>
									</a-select>
								</a-col>
								<!-- 告警对象类型  可输入下拉框 -->
								<a-col>
									<span class="al-name">告警对象类型</span>
									<!--<a-select placeholder="告警对象类型" :not-found-content="null" :show-search="true" :allow-clear="true" style="width: 160px" v-model="searchs.alarmObjType" @search="findSearch">
							<a-select-option v-for="d in alarmObjTypeList" :key="d.alarmObjType">{{d.alarmObjType}}</a-select-option>
						</a-select>-->
									<a-auto-complete dropdown-class-name="dropdown-auto-width" style="width: 160px" v-model="searchs.alarmObjType" :allow-clear="true" @search="findSearch" placeholder="告警对象类型">
										<template slot="dataSource">
											<a-select-option v-for="(item,index) in alarmObjTypeList" :key="'alarmObjType'+index" :value="item.alarmObjType">{{item.alarmObjType}}</a-select-option>
										</template>
									</a-auto-complete>
								</a-col>
								<a-col>
									<span class="al-name">定位结果</span>
									<a-select style="width: 100px" :not-found-content="null" v-model="searchs.isRoot">
										<a-select-option value=''>全部</a-select-option>
										<a-select-option value="0">无根因</a-select-option>
										<a-select-option value="1">有根因</a-select-option>
									</a-select>
								</a-col>
								<a-col>
									<a-range-picker @change="onChangeDate"  :placeholder="['开始时间', '结束时间']" format="YYYY-MM-DD" style="width:220px;">
									</a-range-picker>
								</a-col>
								<a-col>
									<!-- <span class="al-name">主告警标题</span> -->
									<a-input placeholder="告警标题/告警对象名称/告警描述" v-model.trim="searchs.text" style="width:260px;" />
								</a-col>
								<a-col>
									<a-button type="primary" @click="getListSearch" :disabled="isOn">查询</a-button>
								</a-col>
							</a-row>
						</a-col>
						<a-col :span="4">
							<a-row type="flex" justify="end">
								<a-col v-show="isSwitchShow" style="margin-right:0;">
									<!--20190105新增自动刷新-->
									<span class="al-name">自动刷新</span>
									<a-switch v-model="isOn" @change="refreshChange" />
								</a-col>
							</a-row>
						</a-col>
					</a-row>
				</div>
				<!-- 列表 -->
				<div class="gi-table-wrp">
					<a-table :scroll='{x:1200}'  bordered :columns="columns" :data-source="data" :pagination="pagination" @change="handleTableChange" :loading="loading">
						<!--tooltip提示-->
						<span v-for="(item,index) in columns" :key="index" :slot="item.dataIndex" slot-scope="text,record">
							<a-tooltip>
						        <template slot="title">
						         	{{text}}
						        </template>
						        <span>{{text}}</span>
							</a-tooltip>
						</span>
						<!--告警描述鼠标经过提示框错位 增加placement-->
						<span slot="alarmDesc" slot-scope="text,record">
							<a-tooltip placement="left">
						        <template slot="title">
						         	{{text}}
						        </template>
						        <span>{{text}}</span>
							</a-tooltip>
						</span>

						<span slot="isRoot" slot-scope="isRoot">
							<!--婷和领导确认霞说最好吧有根因的改成红色，无根因的用蓝色20190105-->
							<a-tag v-if="isRoot==0" class="tag-default">无根因</a-tag>
							<a-tag v-if="isRoot==1" color="red">有根因</a-tag>
						</span>
						<span slot="action" slot-scope="text, record">
							<a href="javascript:;" :disabled="record.isRoot==0" @click="scrollToSec(record)">根因</a>
						</span>
					</a-table>
				</div>
			</div>
      <!-- 第二屏 查看 -->
			<div v-show="showSecPage" class="sec-wrp-outer gi-outer-wrp" id="secondWrp">
				<div class="close-wrp detail-hd-box">
					<span class="title">告警根因拓扑图</span>
					<a-button class="detail-close-btn" title="关闭" @click="showSecPage=!showSecPage" shape="circle" icon="close" />
				</div>
				<div class="vis-network-wrp">
					<div class="vis-min-box">
						<a-icon class="vis-max-min vis-max" title="全屏" type="arrows-alt" @click="showVisMaxClk" />
					</div>
					<div id="mynetwork" class="gi-vis-wrp"></div>
				</div>
				<div class="close-wrp detail-hd-box">
					<span class="title">告警根因Top</span>
				</div>
				<!--<div class="close-wrp">
				<span class="title">告警根因Top</span>
			</div>-->
				<div class="sec-table-wrp">
					<a-table :scroll='{x:1200}' bordered :columns="columnsSec" :data-source="dataSec" :pagination="false" :loading="loading">
						<!--tooltip 提示-->
						<span v-for="(item,index) in columnsSec" :key="index" :slot="item.dataIndex" slot-scope="text,record">
							<a-tooltip>
						        <template slot="title">
						         	{{text}}
						        </template>
						        <span>{{text}}</span>
							</a-tooltip>
						</span>
						<!--告警描述鼠标经过提示框错位 增加placement-->
						<span slot="rcAlarmDesc" slot-scope="text,record">
							<a-tooltip placement="left">
						        <template slot="title">
						         	{{text}}
						        </template>
						        <span>{{text}}</span>
							</a-tooltip>
						</span>
						<span slot="rcAlarmType" slot-scope="rcAlarmType">
						<span v-if="rcAlarmType=='R'">
							根因告警
						</span>
						<span v-if="rcAlarmType!='R'">
							{{rcAlarmType}}
						</span>
						</span>
					</a-table>
				</div>
			</div>
			<!-- vis最大化 -->
			<div class="vis-max-wrp" v-show="showVisMax">
				<div class="vis-min-box">
					<a-icon class="vis-max-min vis-min" title="关闭" type="shrink" @click="showVisMax=!showVisMax" />
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
  getDomainsCause,
  getMasterTypesCause,
  tbCaposition,
  capositionVis
} from "../request/api";
//vis 配置
	const optionsVis = {
		nodes: { //节点配置
			margin: 10,
			widthConstraint: {
				maximum: 150 //设置节点最大宽度，超出换行
			},
			//fixed:false, //设置节点固定,如果为真，则节点不会沿X方向移动
			shape: 'dot', //默认椭圆 dot为圆形
			borderWidth: 2, //节点边框的宽度,单位为px
			borderWidthSelected: 2, //节点被选中时边框的宽度， 单位为px
			font: { //字体配置
				color: 'rgba(0,0,0,0.85)', //颜色
				size: 12, // 大小，单位px
				face: 'arial', //字体
				background: 'none', //背景
				align: 'left', //位置left right center
			},
			color: {
				border: 'transparent', //节点边框颜色
				background: '#fff', //节点背景颜色
				highlight: { //节点选中时状态颜色
					border: '#55A3FF',
					background: '#fff'
				},
				hover: { //节点鼠标滑过时状态颜色
					border: '#2B7CE9',
					background: 'none'
				}
			},
			scaling: {
				min: 1,
				max: 15
			}
		},
		edges: {
			length:240,
			smooth: {
				type: 'continuous' //continuous diagonalCross
			},
			color:{
				color: '#BFBFBF',//默认颜色
				highlight:'#55A3FF'//悬停或选中节点时颜色
			},
			arrows: {
				to: {
					enabled: true,
					scaleFactor: 0.4,
					//type: 'circle', //箭头改为圆点
				},
			}, //箭头指向to节点
			label: '',
			font: {
				align: 'bottom', //连线上描述的位置 middle  top horizontal bottom
				size: 12 //字体大小
			}
		},
		layout: {
			 randomSeed: 1, //配置每次生成的节点位置都一样，参数为数字1、2等
			 hierarchical: {
				 direction: "LR", //UD:上下 DU:下上 LR:左右 RL:右左
				 sortMethod: "directed",
				 levelSeparation: 200,//每个层级之间的距离 默认150
			 	 nodeSpacing: 150//每个节点之间的距离 默认100
			 }
		},
		interaction: {
			keyboard: true,
			navigationButtons: true
		}
  };
//列表第一屏
	const columns = [{
		title: '告警级别',
		dataIndex: 'alarmLevel',
		key: 'alarmLevel',
		width:100,
		sorter: true,
		scopedSlots: { customRender: 'alarmLevel' }
	}, {
		title: '告警流水号',
		dataIndex: 'seqNo',
		key: 'seqNo',
		width:110,
		sorter: true,
		scopedSlots: { customRender: 'seqNo' }
	}, 
//	{
//		title: '告警ID',
//		dataIndex: 'alarmId',
//		key: 'alarmId',
//		width:100,
//		width:0,//设置为0 隐藏
//		sorter: false,
//		scopedSlots: { customRender: 'alarmId' }
//	}, 
	{
		title: '告警标题',
		dataIndex: 'alarmIndex',
		key: 'alarmIndex',
		width:175,
		sorter: true,
		scopedSlots: { customRender: 'alarmIndex' }
	}, {
		title: '告警对象类型',
		dataIndex: 'alarmObjType',
		key: 'alarmObjType',
		width:100,
		sorter: true,
		scopedSlots: { customRender: 'alarmObjType' }
	}, {
		title: '告警对象名称',
		dataIndex: 'alarmObj',
		key: 'alarmObj',
		width:100,
		sorter: true,
		scopedSlots: { customRender: 'alarmObj' }
	}, {
		title: '告警描述',
		dataIndex: 'alarmDesc',
		key: 'alarmDesc',
		width:175,
		sorter: true,
		scopedSlots: { customRender: 'alarmDesc' }
	}, {
		title: '发生时间',
		dataIndex: 'alarmHappenTime',
		key: 'alarmHappenTime',
		width:160,
		sorter: true,
		scopedSlots: { customRender: 'alarmHappenTime' }
	}, {
		title: '定位结果',
		dataIndex: 'isRoot',
		key: 'isRoot',
		width:100,
		sorter: true,
		scopedSlots: { customRender: 'isRoot' },
	}, {
		title: '收敛次数',
		dataIndex: 'convergenceCount',
		key: 'convergenceCount',
		width:80,
		sorter: false,
		scopedSlots: { customRender: 'convergenceCount' }
	}, {
		title: '操作',
		key: 'action',
		width:80,
		scopedSlots: {
			customRender: 'action'
		},
	}];
	//列表第二屏-告警根因Top
	const columnsSec = [{
		title: '告警类型',
		dataIndex: 'rcAlarmType',
		key: 'rcAlarmType',
		width:80,
		sorter: false,
		scopedSlots: {customRender: 'rcAlarmType'}
	},{
		title: '置信度',
		dataIndex: 'rcConfidence',
		key: 'rcConfidence',
		width:80,
		sorter: false,
		scopedSlots: { customRender: 'rcConfidence' }
	},  {
		title: '告警级别',
		dataIndex: 'rcAlarmLevel',
		key: 'rcAlarmLevel',
		width:80,
		sorter: false,
		scopedSlots: { customRender: 'rcAlarmLevel' }
	}, {
		title: '告警流水号',
		dataIndex: 'rcSeqNo',
		key: 'rcSeqNo',
		width:100,
		sorter: false,
		scopedSlots: { customRender: 'rcSeqNo' }
	}, 
//	{
//		title: '告警ID',
//		dataIndex: 'rcAlarmId',
//		key: 'rcAlarmId',
//		width:80,
//		sorter: false,
//		scopedSlots: { customRender: 'rcAlarmId' }
//	},
	{
		title: '告警标题',
		dataIndex: 'rcAlarmIndex',
		key: 'rcAlarmIndex',
		width:180,
		sorter: false,
		scopedSlots: { customRender: 'rcAlarmIndex' }
	}, {
		title: '告警对象类型',
		dataIndex: 'rcAlarmObjType',
		key: 'rcAlarmObjType',
		width:120,
		sorter: false,
		scopedSlots: { customRender: 'rcAlarmObjType' }
	}, {
		title: '告警对象名称',
		dataIndex: 'rcAlarmObj',
		key: 'rcAlarmObj',
		width:120,
		sorter: false,
		scopedSlots: { customRender: 'rcAlarmObj' }
	}, {
		title: '告警描述',
		dataIndex: 'rcAlarmDesc',
		key: 'rcAlarmDesc',
		width:190,
		sorter: false,
		scopedSlots: { customRender: 'rcAlarmDesc' }
	}, {
		title: '告警发生时间',
		dataIndex: 'rcAlarmHappenTime',
		key: 'rcAlarmHappenTime',
		width:130,
		sorter: false,
		scopedSlots: { customRender: 'rcAlarmHappenTime' }
	}];
export default {
  name: "caposition",
  data() {
    return {
      searchs: {
					"domain": undefined, //训练分组 即资源域
					"isRoot":'',
					"alarmObjType": undefined, //告警对象类型 必须用undefined placeholder才能生效
					"startTime": undefined, //开始时间
					"endTime": undefined, //结束时间
					"text":''
				},
				"domainList": [],
				"alarmObjTypeList": [],
				loading: false,
				showSecPage: false,//是否展示第二屏
				maxFlag:false,
				network1:null,
				network2:null,
				showVisMax:false,
				visData:null,
				isOn:false,//自动刷新
				isSwitchShow:false,
				timerAuto:null,
				refreshTime: 1*3*1000,//每隔3s钟刷新一次
				data: [],
				columns: columns,
				dataSec: [],
				columnsSec:columnsSec,
				pagination: {
					total:0,
					rows: 10, //每页条数
					current:1,
					showTotal: total => `共 ${total} 条`,
					showSizeChanger: false,
					pageSizeOptions: ['10', '15', '20'],
					onShowSizeChange: (current, pageSize) => this.pageSize = pageSize
        }
    };
  },
  created() {
    this.getListDomain();
    //this.getList();
  },
  methods: {
    //自动刷新开关按钮
			refreshChange(value){
				var that = this;
				that.isOn = value;
				if(value==true){//开启定时器
					that.timerAuto = setInterval(function() {
						that.getListSearch();
					}, that.refreshTime);
				}else{
					clearInterval(that.timerAuto);
					that.timerAuto = null;
				}
			},
			//查询
			getListSearch(params = {}){
				this.pagination.current=1;
				this.getList({
					rows: 10,
					page: 1
        });
        //需修改
				//$('.ant-table-column-sorter-up').removeClass('on').removeClass('off');
				//关闭并清空第二屏
				this.showSecPage = false;
				this.visData = null;
				this.dataSec = [];
			},
			//排序
			handleTableChange(pagination, filters, sorter) {
				this.pagination = pagination;
				var sort = undefined;//'' 改为undefined 不排序时不给后台传sort字段20190105
				if(sorter.order=="ascend"){sort="asc"}
				if(sorter.order=="descend"){sort="desc"}
				this.getList({
					rows: pagination.pageSize,
					page: pagination.current,
					sidx: sorter.columnKey,
					sord: sort,
					...filters,
				});
			},
			//获取列表
			async getList(params = {}) {
				if(!this.searchs.domain){
					this.$message.error('请选择训练分组!');return;
				}
				this.loading = true;
        this.isSwitchShow = true;//开启自动刷新
        let requestData = {
          	rows: 10,
						page: 1,
						...this.searchs,
						...params
        };
        let res = await tbCaposition(requestData);
        this.loading = false;
        this.data = res.rows;
        this.pagination.total= res.records;
        if (res.status == "200") {
          this.data = res.rows;
        }
        if (res.status == "201") {
          this.$message.error(res.message);
        }
      },
      //资源域  训练分组
			async getListDomain(params = {}) {
        var that = this;
        let res = await getDomainsCause();
        this.domainList = res.status == "200" ? res.data : [];
			},
			domainChange(value) {
				//点击清除按钮后清除告警对象类型
				if (!value) {
					this.alarmObjTypeList = [];
					this.searchs.alarmObjType = undefined;
					return;
				}
			},
			findSearch(value){
				this.getListMasterType(value)
			},
			//告警对象类型（可输入下拉框）
			async getListMasterType(value) {
        var res = await getMasterTypesCause({"domain": this.searchs.domain,"alarmObjType":value});
        this.alarmObjTypeList = res.status == "200" ? res.data : [];
			},
			//跳转到第二屏
			scrollToSec(record) {
				this.showSecPage = true;
				setTimeout(function(){
					var scrollTop = document.getElementById('secondWrp').offsetTop;
					window.scrollTo(0,scrollTop);
				},500)
				this.showVis(record);
			},
			//vis最大化
			showVisMaxClk(){
				this.showVisMax = true;
				var that = this;
				if(that.network2){
					that.network2.destroy();
				}
				setTimeout(function(){
          let visData = that.visData;
          let nodesNew = that.returnNewnodes(visData.nodes);
					var nodes = new vis.DataSet(nodesNew);
					var edges = new vis.DataSet(visData.edges);
					var containerVis = document.getElementById("mynetworkMax");
					var dataVis = {
						nodes: nodes,
						edges: edges
					};
					that.network2 = new vis.Network(containerVis, dataVis, optionsVis);
				},500)
				
			},
			//渲染vis
			async showVis(record){
				//若存在先销毁
				if(this.network1){
					this.network1.destroy();
				}
       let requestData = {
            "domain":record.domain,
						"seqNo":record.seqNo,
						"alarmIndex":record.alarmIndex,//20190105新增 告警标题
						"alarmObj":record.alarmObj,//20190105新增 告警对象类型
            "alarmObjType":record.alarmObjType//20190105新增 告警对象名称
        };
       let res = await capositionVis(requestData);
       if (res.status == "200") {
							//渲染vis
              this.visData = res.rows;
              let nodesNew = this.returnNewnodes(res.rows.nodes);
							var nodes = new vis.DataSet(nodesNew);
							var edges = new vis.DataSet(res.rows.edges);
							var containerVis = document.getElementById("mynetwork");
							var dataVis = {
								nodes: nodes,
								edges: edges
							};
							this.network1 = new vis.Network(containerVis, dataVis, optionsVis);
							this.dataSec = res.rows.recordList;
						}
        if (res.status == "201") {
          this.$message.error(res.message, 3);
        }
      },
      //修改后台返回的图片路径
    returnNewnodes(nodes){
      let nodesNew = nodes.map(item => {
          return {
            id: item.id,
            shape: item.shape,
            image: (item.image).replace('/public', ''),
            label: item.label,
            level:item.level
          };
      });
      return nodesNew;
    },
			//时间范围选择
			onChangeDate(date, dateString) {
				this.searchs.startTime = dateString[0]=="" ? undefined:dateString[0];
				this.searchs.endTime = dateString[1]=="" ? undefined:dateString[1];
			}
  }
};
</script>
