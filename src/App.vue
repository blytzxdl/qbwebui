<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.clearfix::before,
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
* {
  margin: 0;
  padding: 0;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  overflow-x: hidden;
}
::-webkit-scrollbar-thumb {
  background-color: #eaecf1;
  border-radius: 3px;
}
</style>
