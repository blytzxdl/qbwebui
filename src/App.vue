<template>
    <router-view></router-view>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>

* {
  margin: 0;
  padding: 0;
}
html{
  font-size: 5.3333vw;
}
.row{
  display: flex;
}
.col{
  display: flex;
  flex-direction: column;
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
