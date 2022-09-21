<template>
  <div class="login">
    <van-form @submit="onSubmit" class="form">
      <div class="logo">qBittorrent</div>
      <div class="row line">
        <van-icon name="user-circle-o" />
        <van-field
          class="field"
          v-model="userName"
          name="userName"
          label="用户名"
        />
      </div>
      <div class="row line">
        <van-icon name="closed-eye" />
        <van-field
          class="field"
          v-model="password"
          type="password"
          name="password"
          label="密码"
        />
      </div>

      <van-button plain block native-type="submit" class="submit"
        >登录</van-button
      >
    </van-form>
  </div>
</template>

<script>
import { Toast } from "vant";
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
      let result = this.$store.dispatch("login", values);
      result.then((res) => {
        if (res == false) {
          Toast.fail("登录失败");
        }
      });
    },
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
  background-color: #fff;
  .form {
    // border: 1px solid black;
    border-radius: 48px;
    box-shadow: 2px 4px 12px 2px rgba(0, 0, 0, 0.1);
    border: 1px solid #cccccc;
    width: 650px;
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    .logo {
      text-align: center;
      font-family: Roboto, sans-serif;
      color: rgba(0, 0, 0, 0.87);
      margin: 20px;
      font-size: 72px;
    }
    .line{
      align-items: center;
      i{
        margin-right: 20px;
      }
    }
    .field {
      width: 450px;
      height: 80px;
      border: 1px solid #d8d8d8;
      border-radius: 12px;

      /deep/.van-field__control {
        font-size: 36px;
        height: 60px;
      }
      /deep/.van-field__label {
        font-size: 26px;
        width: 80px;
        display: flex;
        align-items: center;
      }
    }
    .submit {
      width: 200px;
      height: 80px;
      border: 1px solid #d8d8d8;
      border-radius: 48px;
      font-size: 36px;
    }
  }
  // .form {
  //   width: 700px;
  //   height: 400px;
  //   text-align: center;
  //   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  //   align-items: center;
  //   .box1 {
  //     width: 450px;
  //     flex-grow: 2;
  //     display: flex;
  //     flex-direction: column;
  //     justify-content: center;
  //     align-items: center;
  //     .input {
  //       width: 260px;
  //     }
  //   }
  //   .box2 {
  //     flex-grow: 1;
  //   }
  // }
  // .err {
  //   width: 500px;
  // }
}
</style>
