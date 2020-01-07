<template>
  <div class="rerules">
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
            <a-select
              :not-found-content="null"
              placeholder="次告警对象类型"
              :allow-clear="true"
              style="width: 140px"
              v-model="searchs.slaveDeviceType"
              @change="slaveDeviceTypeChange"
            >
              <a-select-option
                v-for="d in masterDeviceTypeList"
                :key="d.master_device_type"
              >{{d.master_device_type}}</a-select-option>
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
            <a-button type="primary" @click="getListSearch">查询</a-button>
          </a-col>
        </a-row>
      </div>
      <!-- 列表 -->
      <div class="gi-table-wrp">
        <a-table
          :scroll="{x:1200}"
          :locale="{emptyText:'暂无数据'}"
          bordered
          :columns="columns"
          :data-source="data"
          :pagination="pagination"
          @change="handleTableChange"
          :loading="loading"
        >
          <span
            v-for="(item,index) in columns"
            :key="index"
            :slot="item.dataIndex"
            slot-scope="text"
          >
            <a-tooltip>
              <template slot="title">{{text}}</template>
              <span>{{text}}</span>
            </a-tooltip>
          </span>
          <span slot="action" slot-scope="text, record">
            <a href="javascript:;" @click="scrollToSec(record)">查看</a>
          </span>
        </a-table>
      </div>
    </div>
    <!-- 第二屏 查看 -->
    <div v-if="showSecPage" class="sec-wrp-outer gi-outer-wrp" id="secondWrp">
      <div class="close-wrp detail-hd-box">
        <span class="title">详细信息</span>
        <a-button
          class="detail-close-btn"
          title="关闭"
          @click="showSecPage=!showSecPage"
          shape="circle"
          icon="close"
        />
      </div>
      <div class="detail-box">
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">训练分组</a-col>
          <a-col :span="20">{{detailRecord.domain}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">主次告警是否同网元</a-col>
          <a-col :span="20">{{detailRecord.sameFlag}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">主告警对象类型</a-col>
          <a-col :span="20">{{detailRecord.masterDeviceType}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">主告警厂家</a-col>
          <a-col :span="20">{{detailRecord.masterVendor}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">主告警标题</a-col>
          <a-col :span="20">{{detailRecord.masterTitle}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">主告警专业</a-col>
          <a-col :span="20">{{detailRecord.masterSpecialty}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">主告警ID</a-col>
          <a-col :span="20">{{detailRecord.masterId}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">次告警对象类型</a-col>
          <a-col :span="20">{{detailRecord.slaveDeviceType}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">次告警厂家</a-col>
          <a-col :span="20">{{detailRecord.slaveVendor}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">次告警标题</a-col>
          <a-col>{{detailRecord.slaveTitle}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">次告警专业</a-col>
          <a-col :span="20">{{detailRecord.slaveSpecialty}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">次告警ID</a-col>
          <a-col :span="20">{{detailRecord.slaveId}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">主告警发生频次</a-col>
          <a-col :span="20">{{detailRecord.masterFreq}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">次告警发生频次</a-col>
          <a-col :span="20">{{detailRecord.slaveFreq}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">告警数据训练数</a-col>
          <a-col :span="20">{{detailRecord.totalItemsets}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">支持度</a-col>
          <a-col :span="20">{{detailRecord.support}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">置信度</a-col>
          <a-col :span="20">{{detailRecord.confidence}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">提升度</a-col>
          <a-col :span="20">{{detailRecord.lift}}</a-col>
        </a-row>
        <a-row type="flex" class="detail-row" justify="start">
          <a-col class="left-title" :span="4">更新时间</a-col>
          <a-col :span="20">{{detailRecord.updateTime}}</a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {getDomains,getMasterTypes,getSlaveTypes,acMasters,acSlaves,tbRerules} from "../request/api"
const columns = [{
		title: '主告警对象类型',
		dataIndex: 'masterDeviceType',
		key: 'master_device_type',
		width:130,
		sorter: true,
		scopedSlots: {
			customRender: 'masterDeviceType'
		}
	}, {
		title: '主告警标题',
		dataIndex: 'masterTitle',
		key: 'master_title',
		width:170,
		sorter: true,
		scopedSlots: {
			customRender: 'masterTitle'
		}
	}, {
		title: '主告警ID',
		dataIndex: 'masterId',
		key: 'master_id',
		width:130,
		sorter: false,
		scopedSlots: {
			customRender: 'masterId'
		}
	}, {
		title: '次告警对象类型',
		dataIndex: 'slaveDeviceType',
		key: 'slave_device_type',
		width:140,
		sorter: true,
		scopedSlots: {
			customRender: 'slaveDeviceType'
		}
	}, {
		title: '次告警标题',
		dataIndex: 'slaveTitle',
		key: 'slave_title',
		width:160,
		sorter: true,
		scopedSlots: {
			customRender: 'slaveTitle'
		}
	}, {
		title: '次告警ID',
		dataIndex: 'slaveId',
		key: 'slave_id',
		width:120,
		sorter: false,
		scopedSlots: {
			customRender: 'slaveId'
		}
	}, {
		title: '置信度',
		dataIndex: 'confidence',
		key: 'confidence',
		width:120,
		sorter: true,
		scopedSlots: {
			customRender: 'confidence'
		}
	}, {
		title: '更新时间',
		dataIndex: 'updateTime',
		key: 'update_time',
		width:140,
		sorter: true,
		scopedSlots: {
			customRender: 'updateTime'
		}
	}, {
		title: '操作',
		key: 'action',
		width:80,
		scopedSlots: {
			customRender: 'action'
		}
	}];
export default {
  name: "rerules",
  data() {
			return {
				searchs: {
					"domain": undefined, //训练分组 即资源域
					"masterDeviceType": undefined, //主告警对象类型 必须用undefined placeholder才能生效
					"slaveDeviceType": undefined, //主告警标题
					"masterTitle": undefined, //次告警对象类型
					"slaveTitle": undefined, //次告警标题
				},
				"domainList": [],
				"masterDeviceTypeList": [],
				"slaveDeviceTypeList": [],
				"masterTitleList": [],
				"slaveTitleList": [],
				"detailRecord":null,//第二屏详情
				showSecPage:false,
				loading: false,
				data: [],
				columns: columns,
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
			//跳转到第二屏
			scrollToSec(record){
				this.detailRecord = record;
				this.showSecPage = true;
				setTimeout(function(){
					var scrollTop = document.getElementById('secondWrp').offsetTop;
					window.scrollTo(0,scrollTop);
				},500)
				console.log(record)
			},
			//查询
			getListSearch(params = {}){
				this.pagination.current=1;
				this.getList({
					rows: 10,
					page: 1
				});
				//关闭并清空第二屏
				this.showSecPage = false;
				this.detailRecord = null;
			},
			//排序
			handleTableChange(pagination, filters, sorter) {
				//console.log(pagination);
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
        let requestData = {
          rows: 10,
						page: 1,
						...params,
						...this.searchs
        };
        var res = await tbRerules(requestData);
         this.loading = false;
        this.pagination.total= res.records;
        if(res.status == "200") {
            this.data = res.rows;
          }
          if (res.status == "201") {
            this.$message.error(res.message, 3);
          }
       
			},
			//资源域  训练分组
			async getListDomain(params = {}) {
        var res = await getDomains();
        this.domainList = res.status == "200" ? res.data : [];
			},
			//主告警对象类型下拉
			async getListMasterType(id) {
         var res = await getMasterTypes({"domain": id});
         this.masterDeviceTypeList = res.status == "200" ? res.data : [];
			},
			//次告警对象类型下拉
			async getListSlaveType(id) {
         var res = await getSlaveTypes({"domain": id});
         this.slaveDeviceTypeList = res.status == "200" ? res.data : [];
      },
      //模糊下拉-自动完成-主告警标题
			async autocompleteSearch(value){
        //如果训练分组未选择，则主告警标题输入后无下拉选项
				if(!this.searchs.domain){return;}
        let requestData = {
          	"domain": this.searchs.domain,//必填
						"masterTitle":value, 
						"masterDeviceType":this.searchs.masterDeviceType
        }
        let res = await acMasters(requestData);
        this.masterTitleList = res.status == "200" ? res.data : [];
      },
       //模糊下拉-自动完成-次告警标题
			async autocompleteSearchSlave(value){
        //如果训练分组未选择，则主告警标题输入后无下拉选项
				if(!this.searchs.domain){return;}
        let requestData = {
          	"domain": this.searchs.domain,//必填
						"slaveTitle":value, 
						"slaveDeviceType":this.searchs.slaveDeviceType
        }
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
			masterDeviceTypeChange(value){
				this.masterTitleList = [];
				this.searchs.masterTitle = undefined;
				//this.autocompleteSearch('');//默认传'' 鼠标放入主告警输入框就就有下拉选择
			},
			slaveDeviceTypeChange(value){
				this.slaveTitleList = [];
				this.searchs.slaveTitle = undefined;
				//this.autocompleteSlave('');//默认传'' 鼠标放入主告警输入框就就有下拉选择
			}
		}
};
</script>
