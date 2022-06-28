<template>
  <div class="login">
    <div class="logo">
      <img src="../assets/favicon-32x32.png" />
      <div>qBittorrent</div>
    </div>
    <div class="box1">
      <van-form @submit="onSubmit">
        <van-field
          v-model="userName"
          name="userName"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "login",
  data() {
    return {

        userName: "",
        password: "",

    };
  },
  methods: {
    onSubmit(values) {
      this.$store.dispatch("login", values);
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
