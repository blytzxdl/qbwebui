<template>
  <Overlay
    :onCancel="cancelAdd"
    :onConfirm="confirmAdd"
    class="addTorrents col"
  >
    <div class="cell row">
      <div class="option">种子文件</div>
      <div class="fileField">
        <el-upload
          accept=".torrent"
          :on-change="handleChange"
          action=""
          :auto-upload='false'
          class="fileList col"
          :limit='5'
        >
          <van-button icon="plus" type="primary" class="fileBtn">上传种子</van-button>

        </el-upload>
      </div>
    </div>
    <div class="cell row" v-show="Boolean(!newTorrents.fileList[0])">
      <div class="option">种子链接</div>
      <div class="linkField">
        <van-field
          v-model="newTorrents.urls"
          rows="1"
          autosize
          type="textarea"
          placeholder="请输入链接，换行分隔"
          id="link"
        />
      </div>
    </div>
    <div class="cell row">
      <div class="option">自动管理</div>
      <div class="field">
        <van-switch v-model="newTorrents.autoTMM" size="20" />
      </div>
    </div>
    <div class="cell row">
      <div class="option">分类</div>
      <div class="field">
        <el-select
          v-model="newTorrents.category"
          filterable
          allow-create
          placeholder="输入以新建"
        >
          <el-option
            v-for="cate in categories"
            :key="cate.name"
            :label="cate.name"
            :value="cate.name"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="cell row">
      <div class="option">标签</div>
      <div class="field">
        <el-select
          v-model="newTorrents.tags"
          filterable
          allow-create
          placeholder="输入以新建"
        >
          <el-option
            v-for="tag in tags"
            :key="tag.name"
            :label="tag.name"
            :value="tag.name"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="cell row">
      <div class="option">保存路径</div>
      <div class="field">
        <el-select
          v-model="selectPath"
          filterable
          allow-create
          :disabled="newTorrents.autoTMM"
          placeholder="C:/xxx"
        >
          <el-option
            v-for="cate in categories"
            :key="cate.name"
            :label="cate.name"
            :value="cate.name"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="cell row">
      <div class="option">延迟下载</div>
      <div class="field">
        <van-switch v-model="newTorrents.paused" size="20" />
      </div>
    </div>
  </Overlay>
</template>

<script>
import Overlay from "@/components/overlay";
import { mapState } from "vuex";
import { Toast } from "vant";
export default {
  name: "AddTorrents",
  components: {
    Overlay,
  },
  data() {
    return {
      newTorrents: {
        urls: "",
        autoTMM: true,
        category: null,
        tags: "",
        savepath: "",
        paused: true,
        fileList: [],
      },
    };
  },
  computed: {
    ...mapState(["categories", "tags"]),
    //添加种子保存路径
    selectPath: {
      get: function () {
        if (
          this.newTorrents.category && //已设置新建种子分类
          this.categories.find((item) => {
            return item.name == this.newTorrents.category;
          }) && //该分类已存在
          this.newTorrents.autoTMM //已开启自动管理
        ) {
          return this.categories.find((item) => {
            return item.name == this.newTorrents.category;
          }).savePath;
        } else {
          return "";
        }
      },
      set: function (newVal) {
        this.newTorrents.savepath = newVal;
      },
    },
  },
  methods: {
    //执行添加
    confirmAdd() {
      let result = this.$store.dispatch("addTorrents", this.newTorrents);
      result.then((result) => {
        if (result) {
          this.newTorrents.urls = "";
          this.newTorrents.category = "";
          this.newTorrents.savepath = "";
          this.newTorrents.tags = "";
          this.$store.commit("CONTROLADDTORRENTS", false);
        } else {
          Toast.fail("添加失败");
        }
      });
    },
    //取消添加
    cancelAdd() {
      this.newTorrents.urls = "";
      this.newTorrents.category = "";
      this.newTorrents.tags = "";
      this.newTorrents.savepath = "";
      this.$store.commit("CONTROLADDTORRENTS", false);
    },
    handleChange(file, fileList) {
      // console.log(fileList.indexOf(file));
      this.newTorrents.fileList =fileList
    },
  },
};
</script>

<style lang="less" scoped>
.addTorrents {
  .cell {
    line-height: 1.5;
    justify-content: space-between;
    margin: 20px 20px;
    max-height: 500px;
    min-height: 60px;
    .option {
      font-size: 32px;
      display: flex;
      align-items: center;
    }
    .field {
      flex-grow: 1;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      /deep/.el-input__inner {
        font-size: 28px;
      }
    }
    .linkField {
      // &:extend(.field);
      flex-grow: 1;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      overflow-y: scroll;
      /deep/.van-field__control {
        line-height: 1.5;
        font-size: 28px;
      }
    }
    .fileField{
      overflow: hidden;
      .fileList{
        width: 100%;
        /deep/.el-upload{
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>