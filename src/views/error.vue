<template>
  <div class="page-error">
    <div class="errorCss">
      <div>
       <img src="../../public/images/error.svg" width="235" height="120" alt />
      </div>
      <div>
        <p class="errorText">界面打开异常，请联系系统管理员进行处理</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "error",
  created(){
    document.title = "错误页面"
  }
};
</script>
<style lang="less" scoped>
.errorCss {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  height: calc(100vh - 60px);
}

.errorText {
  font-family: MicrosoftYaHei;
  font-size: 14px;
  color: #a2b0c4;
  letter-spacing: 1.05px;
}

.ant-menu-dark
  .leve1-has-children
  .ant-menu-submenu-title
  > .ant-menu-submenu-arrow::before,
.ant-menu-dark
  .leve1-has-children
  .ant-menu-submenu-title
  > .ant-menu-submenu-arrow::after {
  background: #fff !important;
}
</style>


