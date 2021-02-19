<template>
  <div class="login">
    <div class="slideShadow" v-show="showSlide">
      <div class="slideSty">
        <slide-verify
          @success="onSuccess"
          @fail="onFail"
          :sliderText="text"
          :w="350"
          :h="175"
          ref="slideDiv"
        ></slide-verify>
        <div class="iconBtn">
          <i class="el-icon-circle-close" @click="showSlide = false"></i>
          <i class="el-icon-refresh" @click="refresh"></i>
        </div>
      </div>
    </div>
    <div class="loginBox">
      <!-- <h2 class="loginH2"><strong></strong></h2> -->
      <div class="loginCon">
        <div class="titleDiv">
          <h3>登录云驻停车</h3>
          <!-- <p>请输入你的账号密码:</p> -->
          <img class="logo" :src="logo" alt />
        </div>
        <el-form ref="loginForm" :rules="rules" :model="ruleForm">
          <el-form-item prop="user">
            <el-input
              placeholder="请输入账号"
              prefix-icon="el-icon-user"
              v-model="ruleForm.user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              v-model="ruleForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-button
            type="primary"
            class="loginBtn"
            @click="loginYz('loginForm')"
            >登录</el-button
          >
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import SlideVerify from "@/components/SlideVerify";
import { Message } from "element-ui";
import { login } from "@/api/login";
export default {
  data() {
    return {
      logo: require("@/assets/img/logo.png"),
      notifyObj: null,
      text: "向右滑动",
      showSlide: false,
      ruleForm: {
        user: "13800138000",
        password: "123456",
      },
      rules: {
        user: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位手机号", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  mounted() {
    // this.shopTip()
  },
  methods: {
    onSuccess() {
      this.showSlide = false;
      this._login();
    },
    onFail() {
      this.$message.error("验证失败");
    },
    refresh() {
      this.$refs.slideDiv.reset();
    },
    loginYz(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.showSlide = true;
        } else {
          return;
        }
      });
    },
    _login() {
      let { user, password } = this.ruleForm;
      let user_phone = user;
      let user_password = password;
      this.$store.dispatch("user/_login", { user_phone, user_password }).then(
        (res) => {
          this.refresh();
          if (this.$route.query.redirect) {
            this.$router.push(this.$route.query.redirect);
          } else {
            this.$router.push({ path: "/" });
          }
          // this.$store.dispatch("user/_getUserMenu").then((res) => {
          //   try {

          //   }catch(err){
          //     console.log(err);
          //   }
          // });
        },
        (err) => {
          this.refresh();
        }
      );
    },
    shopTip() {
      this.notifyObj = this.$notify({
        title: "提示",
        message:
          "目前有两个登陆角色，管理员和普通用户，账号分别为：admin、user,密码都为：123456",
        duration: 0,
        iconClass: "el-icon-s-opportunity",
      });
    },
  },
  components: {
    SlideVerify,
  },
};
</script>
<style scoped lang="scss">
.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.login {
  height: 100%;
  width: 100%;
  background: #f0f2f5;
  background: url("https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg");
  // background-size: 100% 100%;
  overflow: hidden;
}
.loginBox {
  height: 455px;
  width: 550px;
  margin: 0 auto;
  position: relative;
  top: 50%;
  margin-top: -287px;
}
.loginH2 {
  font-size: 38px;
  color: #fff;
  text-align: center;
}
.loginCon {
  margin-top: 30px;
  background: #eee;
  border-radius: 4px;
  .titleDiv {
    padding: 0 28px;
    background: #eee;
    position: relative;
    height: 120px;
    border-radius: 4px 4px 0 0;
    h3 {
      font-size: 22px;
      color: #555;
      font-weight: initial;
      padding-top: 23px;
    }
    p {
      font-size: 16px;
      color: #888;
      padding-top: 12px;
    }
    i {
      font-size: 65px;
      color: #ddd;
      position: absolute;
      right: 27px;
      top: 29px;
    }
    img {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .el-form {
    padding: 25px 25px 30px 25px;
    background: #eee;
    border-radius: 0 0 4px 4px;
  }
}
.loginBtn {
  width: 100%;
  background: #19b9e7;
}
.slideShadow {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}
.slideSty {
  position: absolute;
  width: 380px;
  height: 311px;
  background: #e8e8e8;
  border: 1px solid #dcdcdc;
  left: 50%;
  top: 50%;
  margin-left: -188px;
  margin-top: -176px;
  z-index: 99;
  border-radius: 5px;
}
.iconBtn {
  padding: 9px 0 0 19px;
  color: #5f5f5f;
  border-top: 1px solid #d8d8d8;
  margin-top: 17px;
  i {
    font-size: 22px;
    cursor: pointer;
  }
  i:last-child {
    margin-left: 7px;
  }
}
</style>
<style>
.slideSty .slide-verify {
  margin: 13px auto 0 auto;
  width: 350px !important;
}
.slideSty .slide-verify-slider {
  width: 100% !important;
}
.slideSty .slide-verify-refresh-icon {
  display: none;
}
</style>
