<template>
  <div class="gi-header">
    <div class="left-logo">
      <a href="javascript:;">
        <img src="../../public/images/logo.svg" height="27" width="152" />
      </a>
    </div>
    <div class="center-menu">
      <a-menu @click="handleClick" style="width: 100%" mode="horizontal" theme="dark">
        <a-sub-menu class="leve1-has-children" v-for="item in headerMenus" :key="item.menuId">
          <span slot="title">{{item.menuName}}</span>
          <template v-if="item.children.length>0" v-for="level2 in item.children">
            <a-menu-item v-if="!level2.children" :key="level2.menuId">
              <router-link :to="level2.menuUrl">{{level2.menuName}}</router-link>|
              <!-- <a :href="level2.menuUrl" rel="noopener noreferrer">{{level2.menuName}}</a> -->
            </a-menu-item>
            <a-sub-menu
              class="submenu-level2"
              v-if="level2.children"
              :key="level2.menuId"
              :title="level2.menuName"
            >
              <a-menu-item v-for="level3 in level2.children" :key="level3.menuId">
                <!-- <a :href="level3.menuUrl" rel="noopener noreferrer">{{level3.menuName}}</a> -->
                <router-link :to="level3.menuUrl">{{level3.menuName}}</router-link>|
              </a-menu-item>
            </a-sub-menu>
          </template>
        </a-sub-menu>
      </a-menu>
    </div>
    <div class="right-user">
      <a-dropdown placement="bottomRight" :trigger="['click']">
        <a class="ant-dropdown-link" href="javascript:;">
          <a-avatar :size="32" src="../../public/images/pass_user.jpg" />
          <a-icon style="font-size:14px;color:rgba(255,255,255,0.65)" type="caret-down" />
        </a>
        <a-menu slot="overlay" class="dropdown-user-overlay" @click="logout">
          <a-menu-item>
            <a href="javascript:;">
              <a-icon type="logout" />退出
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>
<style lang="less" scoped>
@import "../../public/less/reset";
@import "../../public/less/giop";
</style>
<script>
export default {
  name: "TheHeader",
  data() {
    return {
      headerMenus: [],
      current: ["mail"]
    };
  },
  created() {
    var that = this;
    this.$axios({
      method: "get",
      url: "/json/header.json",
      //url:'/api/security/getMenuInfo',
      data: {}
    })
      .then(res => {
        //  that.headerMenus = res.data.data
        var allDatas = res.data.data.treeNodeList;
        let treeMenu = that.composeTree(allDatas);
        that.headerMenus = treeMenu;
        // alert( res)         //这里使用了ES6的语法
        //console.log(response)       //请求成功返回的数据
      })
      .catch(() => {
        // alert(error)
        // console.log(error)       //请求失败返回的数据
      });
  },
  methods: {
    handleClick(e) {
      console.log("click", e);
    },
    composeTree(list = []) {
      const data = JSON.parse(JSON.stringify(list)); // 浅拷贝不改变源数据
      const result = [];
      if (!Array.isArray(data)) {
        return result;
      }
      data.forEach(item => {
        delete item.children;
      });
      const map = {};
      data.forEach(item => {
        map[item.menuId] = item;
      });
      data.forEach(item => {
        const parent = map[item.parentMenuId];
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          result.push(item);
        }
      });
      return result;
    },
    //退出登录
    logout() {
      var that = this;
      this.$axios({
        method: "get",
        url: "/api/security/out",
        data: {}
      })
        .then(res => {
          if (res.data.status == "200") {
            //跳转到登录页面
            window.location.href = $.giopLoginURL;
          }
          if (res.data.status == "201") {
            that.$message.error(res.data.message);
            return;
          }
        })
        .catch(() => {});
    }
  }
};
</script>