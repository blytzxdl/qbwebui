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
          :auto-upload="false"
          class="fileList col"
          :limit="5"
        >
          <van-button icon="plus" type="primary" class="fileBtn" round
            >上传种子</van-button
          >
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
        <van-field
          v-model="newTorrents.category"
          placeholder="输入以新建,点击右侧选择"
          @click-right-icon="showCategories = true"
          right-icon="arrow-down"
        />
        <van-popup v-model="showCategories" round position="bottom">
          <van-picker
            show-toolbar
            :columns="selectableCategories"
            @cancel="showCategories = false"
            @confirm="
              (v) => {
                newTorrents.category = v;
                newTorrents.savepath = categories.find(
                  (val) => val.name == v
                ).savePath;
                showCategories = false;
              }
            "
          />
        </van-popup>
      </div>
    </div>
    <div class="cell row">
      <div class="option">标签</div>
      <div class="field">
        <van-field
          v-model="newTorrents.tags"
          placeholder="输入以新建,点击右侧选择"
          @click-right-icon="showTags = true"
          right-icon="arrow-down"
        />
        <van-popup v-model="showTags" round position="bottom">
          <van-picker
            show-toolbar
            :columns="selectableCategories"
            @cancel="showTags = false"
            @confirm="
              (v) => {
                newTorrents.tags = v;
                showTags = false;
              }
            "
          />
        </van-popup>
      </div>
    </div>
    <div class="cell row">
      <div class="option">保存路径</div>
      <div class="field">
        <van-field
          :disabled="newTorrents.autoTMM"
          v-model="newTorrents.savepath"
          placeholder="关闭自动管理以修改,点击右侧选择"
          @click-right-icon="
            () => {
              if (!newTorrents.autoTMM) showSavepath = true;
            }
          "
          right-icon="arrow-down"
        />
        <van-popup v-model="showSavepath" round position="bottom">
          <van-picker
            show-toolbar
            :columns="selectableSavepath"
            @cancel="showSavepath = false"
            @confirm="
              (v) => {
                newTorrents.savepath = v;
                showSavepath = false;
              }
            "
          />
        </van-popup>
      </div>
    </div>
    <div class="cell row">
      <div class="option">延迟下载</div>
      <div class="field">
        <van-switch v-model="newTorrents.paused" size="20" />
      </div>
    </div>
    <div class="cell row">
      <div class="option">子文件夹</div>
      <div class="field">
        <!-- <van-field
          readonly
          v-model="rootFolder"
          @click="showRootFolder = true"
          right-icon="arrow-down"
          placeholder="默认"
        /> -->
        <div @click="showRootFolder = true" class="rootFolder">
          {{ rootFolder ? rootFolder : "默认" }}<van-icon name="arrow-down" />
        </div>

        <van-popup v-model="showRootFolder" round position="bottom">
          <van-picker
            show-toolbar
            :columns="selectableRootFolders"
            @cancel="showRootFolder = false"
            @confirm="
              (v) => {
                rootFolder = v;
                newTorrents.root_folder = rootFolders.find(
                  (val) => val.name == v
                ).value;
                showRootFolder = false;
              }
            "
          />
        </van-popup>
        <!-- <van-switch v-model="newTorrents.root_folder" size="20" /> -->
      </div>
    </div>
    <div class="cell row">
      <div class="option">跳过校验</div>
      <div class="field">
        <van-switch v-model="newTorrents.skip_checking" size="20" />
      </div>
    </div>
        <div class="cell row">
      <div class="option">顺序下载</div>
      <div class="field">
        <van-switch v-model="newTorrents.sequential" size="20" />
      </div>
    </div>
        <div class="cell row">
      <div class="option">首尾下载</div>
      <div class="field">
        <van-switch v-model="newTorrents.firstLastPiecePrio" size="20" />
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
        paused: false,
        fileList: [],
        root_folder: "",
        skip_checking:false,
        sequential:false,
        firstLastPiecePrio:false
      },
      rootFolders: [
        { name: "默认", value: "" },
        { name: "是", value: true },
        { name: "否", value: false },
      ],
      rootFolder: "",
      showCategories: false,
      showTags: false,
      showSavepath: false,
      showRootFolder: false,
    };
  },
  computed: {
    ...mapState(["categories", "tags"]),
    selectableCategories() {
      return this.categories
        .filter((v) => v.name != "uncategorized")
        .map((v) => v.name);
    },
    selectableTags() {
      return this.tags.filter((v) => v.name != "untagged").map((v) => v.name);
    },
    selectableSavepath() {
      return this.categories
        .filter((v) => v.name != "uncategorized" && v.savePath)
        .map((v) => v.savePath);
    },
    selectableRootFolders() {
      return this.rootFolders.map((v) => v.name);
    },
  },
  methods: {
    //执行添加
    confirmAdd() {
      let result = this.$store.dispatch("addTorrents", this.newTorrents);
      result.then((result) => {
        if (result) {
          (this.newTorrents = {
            urls: "",
            autoTMM: true,
            category: null,
            tags: "",
            savepath: "",
            paused: false,
            fileList: [],
          }),
            this.$store.commit("CONTROLADDTORRENTS", false);
        } else {
          Toast.fail("添加失败");
        }
      });
    },
    //取消添加
    cancelAdd() {
      (this.newTorrents = {
        urls: "",
        autoTMM: true,
        category: null,
        tags: "",
        savepath: "",
        paused: false,
        fileList: [],
      }),
        this.$store.commit("CONTROLADDTORRENTS", false);
    },
    handleChange(file, fileList) {
      // console.log(fileList.indexOf(file));
      this.newTorrents.fileList = fileList;
    },
    onConfirm() {},
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
      width: 4rem;
      display: flex;
      align-items: center;
    }
    .field {
      flex-grow: 1;
      // width: 80%;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .van-field,
      .rootFolder {
        flex-grow: 1;
        font-size: 26px;
        height: 1rem;
      }
      /deep/.van-picker {
        .van-ellipsis {
          font-size: 1rem;
        }
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
    .fileField {
      overflow: hidden;
      .fileList {
        width: 100%;
        /deep/.el-upload {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>