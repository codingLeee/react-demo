<template>
    <div class="login_content">
        <h2 class="system_title">智慧水务统一应用整合平台</h2>
        <div class="login_info">
            <div class="login_name">登录</div>
            <el-input class="username" v-model="loginFrom.username" placeholder="请输入账号" clearable></el-input>
            <el-input class="password" type="password" v-model="loginFrom.password" placeholder="请输入密码" clearable></el-input>
            <el-checkbox class="remember_password" v-model="checked">记住密码</el-checkbox>
            <el-button type="primary" @click="handleLogin">登录</el-button>
        </div>
    </div>
</template>

<script>
import { sysLogin } from "@/api/system";
import { checkNotNull,setStorage } from "@/lib";
import CryptoJS from "crypto-js"; //账号加密

export default {
  data() {
    return {
      loginFrom: {
        username: "",
        password: "",
        clientType: "web",
        userType: "001"
      },
      checked: false,
      saveKey: ""
    };
  },
  methods: {
    handleLogin() {
      let _this = this;
      if (
        checkNotNull(_this.loginFrom.username) &&
        checkNotNull(_this.loginFrom.password)
      ) {
        sysLogin({ ..._this.loginFrom }).then(res => {
          if (res.code == 200) {
            if (_this.checked == true) {
              _this.setCookie(
                _this.loginFrom.username,
                _this.loginFrom.password,
                30
              );
            } else {
              _this.clearCookie();
            }
            setStorage("checked", _this.checked);
            setStorage("userName", res.data.user.username);
            _this.$store.commit("SET_TOKEN", res.data.token);

            _this.$router.push('/portal');
          }
        });
      } else {
        _this.$message.warning("得写了用户名和密码才能登陆吧");
      }
    },
    setCookie(portId, psw, exdays) {
      // Encrypt，加密账号密码
      var cipherPortId = CryptoJS.AES.encrypt(
        portId + "",
        "secretkey+creactkey"
      ).toString();
      var cipherPsw = CryptoJS.AES.encrypt(
        psw + "",
        "secretkey+creactkey"
      ).toString();
      var exdate = new Date(); //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
      //字符串拼接cookie，这里用了==，因为加密后的字符串也有个=号，影响下面getcookie的字符串切割。
      window.document.cookie =
        "currentPortId" +
        "==" +
        cipherPortId +
        ";path=/;expires=" +
        exdate.toGMTString();
      window.document.cookie =
        "password" +
        "==" +
        cipherPsw +
        ";path=/;expires=" +
        exdate.toGMTString();
    },
    //读取cookie
    getCookie: function() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; "); //这里显示的格式根据自己的代码更改
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split("=="); //根据==切割
          //判断查找相对应的值
          if (arr2[0] == "currentPortId") {
            // Decrypt，将解密后的内容赋值给账号
            var bytes = CryptoJS.AES.decrypt(arr2[1], "secretkey+creactkey");
            this.params.username = bytes.toString(CryptoJS.enc.Utf8);
          } else if (arr2[0] == "password") {
            // Decrypt，将解密后的内容赋值给密码
            var bytes1 = CryptoJS.AES.decrypt(arr2[1], "secretkey+creactkey");
            this.params.password = bytes1.toString(CryptoJS.enc.Utf8);
          }
        }
      }
    },
    //清除cookie
    clearCookie: function() {
      this.setCookie("", "", -1);
    }
  },
  created() {
    let _this = this;
    if (localStorage.getItem("checked") == "true") {
      _this.checked = true;
      _this.getCookie();
    }
  }
};
</script>


<style lang="scss" scoped>
.login_content {
  width: 100%;
  height: 100%;
  background: url(~static/Portal/img/login_bg.png) no-repeat center center;
  background-size: 100% 100%;
  position: relative;

  .system_title {
    height: 53px;
    line-height: 53px;
    font-size: 48px;
    color: #ededed;
    letter-spacing: 5px;
    text-align: center;
    background-image: linear-gradient(to right, #011225, #1a659f, #011225);
  }

  .login_info {
    width: 472px;
    height: 512px;
    background: url(~static/Portal/img/login_bg_1.png) no-repeat center center;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 55px 46px;
    box-sizing: border-box;

    .login_name {
      margin-bottom: 20px;
      font-size: 30px;
      font-weight: bold;
      color: #26a5ff;
      text-align: center;
    }

    // 输入框
    /deep/ .el-input {
      width: 100% !important;
      height: 80px;

      .el-input__inner {
        width: 100% !important;
        height: 100%;
        background-color: transparent !important;
        border: 0 !important;
        border-bottom: 1px solid #26a5ff !important;
        border-radius: 0;
        padding-left: 40px;
        color: #26a5ff !important;
        font-size: 20px;
        &::placeholder {
          color: #26a5ff !important;
        }
        background: url(~static/Portal/img/username_icon.png) no-repeat center
          left 2px;
      }

      &.password {
        .el-input__inner {
          background: url(~static/Portal/img/password_icon.png) no-repeat center
            left 2px;
        }
      }

      .el-input__suffix {
        .el-input__icon {
          &::after,
          &::before {
            content: "";
          }
          background: url(~static/Portal/img/login_info_delete.png) no-repeat
            center center;
          background-size: 18px 18px;
        }
      }
    }

    // 记住密码
    /deep/ .remember_password {
      width: 100%;
      margin: 37px 0 74px;
      .el-checkbox__label {
        font-size: 16px;
        font-weight: 400;
        color: #fff;
      }
      .el-checkbox__inner {
        background-color: rgba(6, 135, 205, 0.3);
        border-color: #0687cd;
        width: 20px;
        height: 20px;
        &::after {
          width: 6px;
          height: 12px;
          border-color: #0687cd;
          left: 6px;
        }
      }
    }

    /deep/ .el-button {
      width: 100%;
      height: 60px;
      line-height: 60px;
      font-size: 24px;
      font-weight: 400;
      color: #f6f6f6;
      background-color: rgba(38, 165, 255, 1);
      border-radius: 0;
    }
  }
}
</style>
