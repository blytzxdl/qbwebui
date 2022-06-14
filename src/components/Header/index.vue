<template>
  <el-menu
    :default-active="activeIndex2"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="1">开始</el-menu-item>
    <el-menu-item index="2">暂停</el-menu-item>

  </el-menu>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      activeIndex2: "1",
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
      if (key == 1) {
        this.$store.dispatch("setResume");
        this.$bus.$emit('clearSelection')
      } else if (key == 2) {
        this.$store.dispatch("setPause");
        this.$bus.$emit('clearSelection')
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>