<template>
  <div class="gi-header">
    <div class="left-logo">
      <a href="javascript:;">
        <img src="../../public/images/logo.svg" height="27" width="152" />
      </a>
    </div>
    <div class="center-menu">
      <a-menu
        @click="handleClick"
        :selectedKeys="[$route.path]"
        style="width: 100%"
        mode="horizontal"
        theme="dark"
      >
        <a-sub-menu class="leve1-has-children" v-for="item in headerMenus" :key="item.menuId">
          <span slot="title">{{item.menuName}}</span>
          <!--  v-if="item.children.length>0" -->
          <template v-for="level2 in item.children">
            <a-menu-item v-show="!level2.children" :key="level2.menuUrl">
              <router-link :to="{path:level2.menuUrl}">{{level2.menuName}}</router-link>
            </a-menu-item>
            <a-sub-menu
              class="submenu-level2"
              :key="level2.menuId"
              v-show="level2.children"
              :title="level2.menuName"
            >
              <a-menu-item v-for="level3 in level2.children" :key="level3.menuUrl">
                <router-link :to="{path:level3.menuUrl}">{{level3.menuName}}</router-link>|
              </a-menu-item>
            </a-sub-menu>
          </template>
        </a-sub-menu>
      </a-menu>
    </div>
    <!-- 右侧个人中心 -->
    <div class="right-user">
      <a-dropdown placement="bottomRight" :trigger="['click']">
        <a class="ant-dropdown-link" href="javascript:;">
          <a-avatar :size="32" :src="require('../../public/images/pass_user.jpg')" />
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
// @import "../../public/less/giop-default";
</style>
<script>
import { getMenus, pLogout } from "../request/api";
export default {
  name: "TheHeader",
  data() {
    return {
      headerMenus: [],
      openKeys: []
    };
  },
  created() {
    this.loadMenus();
  },
  // watch: {
  //     openKeys(val) {
  //       this.openKeys = val;
  //       console.log('openKeys', val);
  //     },
  //   },
  methods: {
    getCookie(name) {
      var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
      else return null;
    },
    handleClick() {
      //this.current = e.key;
    },
    //获取菜单
    async loadMenus() {
      let res = await getMenus();
      if (res.status == "200") {
        var allDatas = res.data.treeNodeList;
        let treeMenu = this.composeTree(allDatas);
        this.headerMenus = treeMenu;
      }
    },
    //退出登录
    async logout() {
      var res = await pLogout();
      if (res.status == "200") {
        //跳转到登录页面
        window.location.href = process.env.VUE_APP_giopLoginURL;
      }
      if (res.status == "201") {
        this.$message.error(res.message);
        return;
      }
    },
    //转成children
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
    }
  }
};
</script>