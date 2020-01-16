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
                  autocomplete="off"
                  v-decorator="['username',{rules: validateRules.username}]"
                />
              </a-form-item>
              <a-form-item>
                <a-input
                  placeholder="密 码"
                  autocomplete="off"
                  type="password"
                  v-decorator="['password',{rules: validateRules.password}]"
                />
              </a-form-item>
              <a-form-item class="captcha-box">
                <a-input
                  autocomplete="off"
                  placeholder="验证码"
                  v-decorator="['captcha',{rules: validateRules.captcha}]"
                />
                <img
                  :src="captchaSrc"
                  @click="changeCaptcha"
                  alt="验证码"
                  id="loginCaptcha"
                  title="点击换一张"
                />
              </a-form-item>
              <a-form-item class="btn-item">
                <a-button type="primary" html-type="submit" block>登录</a-button>
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
// @import "../../public/less/giop-default";
body,
html {
  height: 100%;
  background: #0d2036;
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
        .btn-item {
          margin-top: 3px;
        }
        input {
          background: #2f4053;
          //border: none;
          border-radius: 4px;
          height: 40px !important;
          font-size: 16px;
          color: #efefef;
          padding: 10px 16px;
          border-color: #435468;
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
import { encrypt } from "../utils/encrypt";
import { pLogin } from "../request/api";
export default {
  name: "login",
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "loginForm" }),
      captchaSrc:
        process.env.VUE_APP_urlPrefix + "/security/captcha?_=" + Math.random(),
      validateRules: {
        username: [{ required: true, message: "请输入用户名" }],
        password: [{ required: true, message: "请输入密码" }],
        captcha: [{ required: true, message: "请输入验证码" }]
      }
    };
  },
  created(){
    document.title = "登录";
  },
  methods: {
    //点击切换验证码
    changeCaptcha() {
      this.captchaSrc =
        process.env.VUE_APP_urlPrefix + "/security/captcha?_=" + Math.random();
    },
    //登录
    async loginFun(formData) {
      let res = await pLogin(formData);
      if (res.status == "200") {
        var callUrl = window.location.href.split("?")[1];
        callUrl = callUrl ? decodeURIComponent(callUrl.substr(5)) : ""; //截取goto=后面的url并跳转 decodeURIComponent vue下url乱码解码
        var sucUrl = callUrl ? callUrl : process.env.VUE_APP_forward;
        window.location.href = sucUrl;
      }
      if (res.status == "201") {
        this.$message.error(res.message);
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      var that = this;
      this.form.validateFields((err, values) => {
        if (!err) {
          //校验通过
          let username = encrypt(values.username);
          let password = encrypt(values.password);
          let formData = {
            username: username,
            password: password,
            captcha: values.captcha
          };
          that.loginFun(formData);
        }
      });
    }
  }
};
</script>