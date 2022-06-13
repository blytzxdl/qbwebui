<template>
    <router-view></router-view>
</template>

<script>
export default {
  name: "App",
  mounted() {
  },
};
</script>

<style>

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
