<template>
  <div class="page-noauth">
    <div class="errorCss">
      <div>
        <img src="../../public/images/no-auth.png" width="235" height="120" alt />
      </div>
      <div>
        <p class="errorText">很抱歉，此功能暂未给您开放访问权限，请联系管理员。</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "noauth",
  created() {
    document.title = "无权限";
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
</style>


