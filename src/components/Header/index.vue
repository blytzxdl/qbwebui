<template>
  <div>
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
      <el-menu-item index="3">添加</el-menu-item>
    </el-menu>
    <el-dialog
      title="添加种子"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="form">
        <!--  -->
        <el-form-item label="链接(一行一个)">
          <el-input
            v-model="form.urls"
            type="textarea"
            autosize
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>

        <el-form-item label="自动管理">
          <el-switch v-model="form.autoTMM"></el-switch>
        </el-form-item>

        <el-form-item label="分类">
          <el-select v-model="form.category" filterable allow-create>
            <el-option
              v-for="(cate, index) in allCategory"
              :key="index"
              :label="cate.name"
              :value="cate.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="保存路径">
          <el-select
            :disabled="form.autoTMM"
            v-model="form.savepath"
            filterable
            allow-create
          >
            <el-option
              v-for="(path, index) in allPath"
              :key="index"
              :label="path"
              :value="path"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="延迟下载">
          <el-switch v-model="form.paused"></el-switch>
        </el-form-item>
        <!--  -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Notification } from "element-ui";
export default {
  name: "Header",
  data() {
    return {
      activeIndex2: "1",
      dialogFormVisible: false,
      form: {
        urls: "",
        autoTMM: true,
        category: '',
        savepath: "",
        paused: true,
      },
      allPath: [],
      formLabelWidth: "120px",
    };
  },
  computed: {
    ...mapState({
      allCategory: (state) => state.aside.categories,
    }),
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
      if (key == 1) {
        this.$store.dispatch("setResume");
        this.$bus.$emit("clearSelection");
      } else if (key == 2) {
        this.$store.dispatch("setPause");
        this.$bus.$emit("clearSelection");
      } else if (key == 3) {
        this.dialogFormVisible = true;
      }
    },
    submitForm() {
      this.form.savepath = 'C:/caches/tor'
      let result = this.$store.dispatch("addTorrents", this.form);
      result.then((result) => {
        if (result) {
          this.dialogFormVisible = false;
          this.form.urls=''
          this.form.category=''
          this.form.path=''
        } else {
          Notification.error({
            title: "添加失败",
            message: "请检查输入项",
            duration: 3000,
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>