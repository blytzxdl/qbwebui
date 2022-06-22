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
      <el-menu-item index="4">删除</el-menu-item>
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
            placeholder="支持http://, https://,magnet:和bc://bt/"
          ></el-input>
        </el-form-item>

        <el-form-item label="自动管理">
          <el-switch v-model="form.autoTMM"></el-switch>
        </el-form-item>

        <el-form-item label="分类">
          <el-select
            v-model="form.category"
            filterable
            allow-create
            placeholder="输入以新建"
          >
            <el-option
              v-for="(cate, index) in allCategory"
              :key="index"
              :label="cate.name"
              :value="cate.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标签">
          <el-select
            v-model="form.tags"
            filterable
            allow-create
            placeholder="输入以新建"
          >
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
            placeholder="C:/xxx"
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
import { MessageBox } from 'element-ui';
export default {
  name: "Header",
  data() {
    return {
      activeIndex2: "1",
      dialogFormVisible: false,
      form: {
        urls: "",
        autoTMM: true,
        category: "",
        tags: "",
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
      } else if (key == 4) {
        this.deleteWarn()
      }
    },
    deleteWarn() {
      MessageBox.confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("setDelete");
          this.$bus.$emit("clearSelection");
        })
        .catch(() => {
        });
    },
    submitForm() {
      this.form.savepath = "C:/caches/bit";
      let result = this.$store.dispatch("addTorrents", this.form);
      result.then((result) => {
        if (result) {
          this.dialogFormVisible = false;
          this.form.urls = "";
          this.form.category = "";
          this.form.path = "";
          this.$store.dispatch("getCategories");
          this.$store.dispatch("getTags");
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