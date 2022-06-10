<template>
  <el-container style="display: flex; flex-direction: row">
    <el-aside style="width: auto;height:100vh"><Aside /></el-aside>
    <el-container style="display: flex; flex-direction: column ;height:100vh">
      <el-header>
        <Header />
      </el-header>
      <el-main >
        <Item class="items"/>
        <Info class="info" />
      </el-main>
      <el-footer style="height:auto"> <Footer/> </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import Header from "../components/Header";
import Aside from "../components/Aside";
import Footer from "../components/Footer";
import Item from "../components/Item";
import Info from "../components/Info";
import { reqCategories } from "../api";
export default {
  name: "Home",
  components: {
    Header,
    Aside,
    Footer,
    Item,
    Info,
  },
  mounted() {
    reqCategories();
  },
};
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  padding: 0;
}

.el-aside {
  background-color: rgb(84, 92, 100);
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.el-footer {
  /* background-color: #b3c0d1;
  color: #333; */
  text-align: center;
  padding: 0;
}

</style>