<template>
  <div class="login">
    <el-form
      :model="userInfo"
      status-icon
      ref="userInfo"
      label-width="60px"
      class="form"
    >
      <div class="logo">
        <img src="../assets/favicon-32x32.png" />
        <div>qBittorrent</div>
      </div>
      <div class="box1">
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="userInfo.userName"
            autocomplete="off"
            class="input"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="userInfo.password"
            autocomplete="off"
            type="password"
            class="input"
          ></el-input>
        </el-form-item>
      </div>
      <div class="box2">
        <van-button @click="login()">提交</van-button>
      </div>
    </el-form>
    <el-alert title="登录失败" type="error" class="err" v-show="showError">
    </el-alert>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "login",
  data() {
    return {
      userInfo: {
        userName: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      this.$store.dispatch("login", this.userInfo);
    },
  },
  mounted() {},
  computed: {
    ...mapState({
      showError: (state) => state.login.showError,
    }),
  },
};
</script>

<style lang="less" scoped>
.login {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .logo {
    text-align: center;
    font-family: Roboto, sans-serif;
    color: rgba(0, 0, 0, 0.87);
    margin: 20px;
    display: flex;
  }
  .form {
    width: 700px;
    height: 400px;
    text-align: center;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .box1 {
      width: 450px;
      flex-grow: 2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .input {
        width: 260px;
      }
    }
    .box2 {
      flex-grow: 1;
    }
  }
  .err {
    width: 500px;
  }
}
</style>
