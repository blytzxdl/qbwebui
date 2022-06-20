<template>
  <el-menu
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    background-color="#545c64"
    active-text-color="#ffd04b"
    text-color="#fff"
    :collapse="isCollapse"
  >
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-connection"></i>
        <span>状态</span>
      </template>
      <el-menu-item-group name="filter">
        <el-menu-item
          v-for="(state, index) in filter"
          :key="index"
          @click="setQuery($event, state)"
        >
          {{ filterName[index] }}
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-tickets"></i>
        <span>分类</span>
      </template>
      <el-menu-item-group name="category">
        <el-menu-item @click="setQuery($event, '')"> 全部 </el-menu-item>
        <el-menu-item
          v-for="(cate, index) in categories"
          :key="index"
          @click="setQuery($event, cate.name)"
          >{{ cate.name }}</el-menu-item
        >
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-collection-tag"></i>
        <span>标签</span>
      </template>
      <el-menu-item-group name="tag">
        <el-menu-item
          v-for="(tag, index) in tags"
          :key="index"
          @click="setQuery($event, tag)"
          >{{ tag }}</el-menu-item
        >
      </el-menu-item-group>
    </el-submenu>
    <el-button
      type="primary"
      icon="el-icon-refresh-right"
      class="clear"
      @click="clearQuery"
      v-show="!isCollapse"
    >
      清除筛选
    </el-button>
    <el-button
      type="primary"
      icon="el-icon-refresh-right"
      class="clear"
      @click="clearQuery"
      v-show="isCollapse"
    ></el-button>
    <!-- <div class="bottomNav">
            <div class="clear bottomItem">...</div> -->

    <el-button
      type="primary"
      icon="el-icon-d-arrow-right"
      class="clear unfold bottomItem"
      v-show="isCollapse"
      @click="foldNav(false)"
    ></el-button>
    <el-button
      type="primary"
      icon="el-icon-d-arrow-left"
      class="clear fold bottomItem"
      v-show="!isCollapse"
      @click="foldNav(true)"
      >折叠</el-button
    >
    <!-- </div> -->
  </el-menu>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Aside",
  data() {
    return {
      fold: false,
      filter: [
        "all",
        "downloading",
        "seeding",
        "completed",
        "paused",
        "resumed",
        "errored",
      ],
      filterName: ["全部", "下载", "做种", "完成", "暂停", "检查", "错误"],
    };
  },

  computed: {
    ...mapState({
      categories: (state) => state.aside.categories,
      tags: (state) => state.aside.tags,
      // trackers:state=>state.aside.trackers
    }),
    isCollapse() {
      return this.fold;
    },
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    foldNav(val) {
      this.fold = val;
    },
    getAside() {
      this.$store.dispatch("getCategories");
      this.$store.dispatch("getTags");
      // this.$store.dispatch('getTrackers')
    },
    clearQuery() {
      this.$store.dispatch("clearQuery");
      this.clearFil()
      this.$store.dispatch("getMaindata")
      this.$bus.$emit('reMain')
    },
    setQuery(eve, parVal) {
      // console.log(parVal);
      this.clearFil()
      let par = { parName: eve.$parent.$attrs.name, parVal };
      this.$store.dispatch("setQuery", par);
      this.filActive()
    },
    filActive() {
      this.$bus.$emit('clearMain')
      this.$store.dispatch("getFil");
      this.filTimer = setInterval(() => {
        this.$store.dispatch("getFil");
      }, 2000);
    },
    clearFil(){
      clearInterval(this.filTimer)
    }
  },
  mounted() {
    this.getAside();
  },
};
</script>

<style lang="less" scoped>
.el-menu {
  height: 100vh;
  border: none;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.clear {
  margin: 0;
  padding: 0;
  border-radius: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0);
  border: hidden;
  height: 56px;
  &:hover {
    background-color: rgb(64, 74, 80);
  }
}
.el-button:active {
  background: rgb(64, 74, 80);
}
// .bottomNav {
//   display: flex;
//   flex-direction:column;
//   height:auto;
//   &.bottomItem{
//     flex-grow: 1;
//   }
// }
</style>