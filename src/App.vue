<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang='less'>
* {
  margin: 0;
  padding: 0;
}
html {
  font-size: 5.3333vw;
}
.row {
  display: flex;
}
.col {
  display: flex;
  flex-direction: column;
}
.van-toast {
  min-width: 200px !important;
  height: 200px;
  .van-toast__text {
    font-size: 30px;
  }
}
.center {
  justify-content: center;
  align-items: center;
  align-content: center;
}
/* ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  overflow-x: hidden;
}
::-webkit-scrollbar-thumb {
  background-color: #eaecf1;
  border-radius: 3px;
} */
</style>
