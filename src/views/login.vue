<template>
  <div class="login">
    <div class="login-content">
      <div class="login-left"></div>
      <div class="login-right">
        <div class="right-logo"></div>
        <div class="right-main">
          <h4>登录</h4>
          <div class="right-form">
            <a-form :form="form" @submit="handleSubmit">
              <a-form-item>
                <a-input
                  placeholder="用户名"
                  aria-autocomplete="off"
                  v-decorator="['username', { rules: [{ required: true, message: '请输入用户名' }] }]"
                />
              </a-form-item>
              <a-form-item>
                <a-input
                  placeholder="密 码"
                  type="password"
                  v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }] }]"
                />
              </a-form-item>
              <a-form-item class="captcha-box">
                <a-input
                  autocomplete="off"
                  placeholder="验证码"
                  v-decorator="['captcha', { rules: [{ required: true, message: '请输入验证码' }] }]"
                />
                <img
                  :src="captchaSrc"
                  @click="changeCaptcha"
                  alt="验证码"
                  id="loginCaptcha"
                  title="点击换一张"
                />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" block>登录</a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
      <footer>© 亚信全域智能运维</footer>
    </div>
  </div>
</template>
<style lang="less" scoped>
@import "../../public/less/reset";
@import "../../public/less/giop";
body,
html {
  height: 100%;
  background: #0d2036;
}
//error提示
.has-error .ant-form-explain,
.has-error .ant-form-split {
  color: #f56c6c;
  font-size: 12px;
}
.login {
  background-image: linear-gradient(180deg, #0a1f37 0%, #0a1f37 100%);
  width: 100%;
  height: 100%;
  footer {
    background-color: #14222e;
    height: 42px;
    line-height: 42px;
    border: 0;
    position: fixed;
    bottom: 0;
    left: 0;
    font-size: 12px;
    color: #6e777e;
    text-align: center;
    width: 100%;
  }
}
.login-content {
  width: 1200px;
  height: 400px;
  margin: 0 auto;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -200px 0 0 -600px;
  .login-left {
    width: 710px;
    height: 400px;
    background: url(../../public/images/login-left.svg) no-repeat 50%;
    background-size: 710px 400px;
    float: left;
  }
  .login-right {
    float: left;
    width: 370px;
    .right-logo {
      width: 100%;
      height: 80px;
      background: url(../../public/images/logo-login.svg) no-repeat center;
    }
    .right-main {
      height: 320px;
      width: 370px;
      background: #1c2f44;
      border: 1px solid #435468;
      border-radius: 4px;
      h4 {
        width: 318px;
        margin: 0 auto;
        font-weight: 400;
        font-size: 18px;
        color: #fbfdff;
        letter-spacing: 5px;
        padding: 20px 0 18px;
      }
      .right-form {
        width: 318px;
        margin: 0 auto;
        input {
          background: #2f4053;
          //border: none;
          border-radius: 4px;
          height: 40px !important;
          font-size: 16px;
          color: #efefef;
          padding: 10px 16px;
        }
        button {
          height: 40px;
          line-height: 40px;
          font-size: 16px;
        }
        .captcha-box {
          input {
            width: 200px;
            float: left;
          }
          img {
            float: right;
            border-radius: 4px;
            height: 38px;
            display: block;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
<script>
export default {
  name: "login",
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
      captchaSrc: "/api/security/captcha?_=" + Math.random(),
      errorMsg: "",
      username: "",
      password: "",
      captcha: ""
    };
  },
  created() {
    document.title = "登录";
  },
  methods: {
    //点击切换验证码
    changeCaptcha() {
      this.captchaSrc = "/api/security/captcha?_=" + Math.random();
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
      });
    }
  }
};
</script>