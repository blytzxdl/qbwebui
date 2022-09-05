<template>
  <div class="col base">
    <div class="interface col">
      <div class="navbar row">
        <div class="left" @click="onClickLeft">返回</div>
        <div class="right" @click="$bus.$emit('controlInfo', { to: false })">
          关闭
        </div>
      </div>
      <div class="fileCellGroup">
        <div
          class="fileCell center row"
          v-for="(ite, index) in workSpace"
          :key="index"
          @click="onClickCell(ite)"
        >
          <!-- <div class="left"></div> -->
          <div class="content">
            {{ ite.label }}
          </div>
          <div class="right" v-if="ite.children"><van-icon name="arrow" /></div>
        </div>
      </div>
      <van-popup
        class="col center"
        v-model="operate"
        closeable
        position="bottom"
      >
        <div class="label">{{ file.label }}</div>
        <div class="label row">
          <div class="info">大小：{{ fileSize }}</div>
          <div class="info">进度：{{ parseInt(file.progress * 100) }}%</div>
        </div>
        <div
          class="label operation"
          v-if="fileType == 'video'"
          @click="operateFile()"
        >
          播放视频(需设备支持)
        </div>
        <div class="label operation" v-if="fileType == 'audio'">
          播放(未实现)
        </div>
        <div
          class="label operation"
          v-if="fileType == 'text' || fileType == 'picture'"
        >
          打开(未实现)
        </div>
        <div class="label operation" v-if="fileType == 'other'">
          下载(未实现)
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import renderSize from "@/utils/renderSize";
export default {
  name: "FileManager",
  props: ["rootPath"],
  data() {
    return {
      workSpace: null,
      backSpace: [],
      workIndex: "",
      operate: false,
      file: { label: "", size: 0, availability: 0 },
      formatList: {
        text: ["txt"],
        video: ["mkv", "mp4", "flv", "ts", "m3u8"],
        picture: ["jpg", "png"],
        audio: ["mp3", "wav", "flac"],
      },
    };
  },
  computed: {
    ...mapState(["files"]),
    fileType() {
      if (this.file.progress == 1) {
        var suffix = this.file.label.split(".").slice(-1)[0];
        for (const key in this.formatList) {
          if (this.formatList[key].includes(suffix)) {
            return key;
          }
        }
        return "other";
      } else {
        return "available";
      }
    },
    fileSize() {
      return renderSize(this.file.size);
    },
  },
  methods: {
    onClickLeft() {
      if (this.workSpace.length > 1) {
        this.workSpace = this.backSpace.pop();
      }
    },
    onClickCell(ite) {
      // console.log(ite.label);
      if (ite.children) {
        this.backSpace.push(this.workSpace);
        this.workIndex = ite.label;
        this.workSpace = ite.children;
      } else {
        this.file = ite;
        this.file.rootPath = this.rootPath;
        this.operate = true;
      }
    },
    operateFile() {
      this.operate = false;
      this.$store.dispatch("tryLocalFile", this.file);
    },
  },
  mounted() {
    this.workSpace = this.files;
  },
};
</script>

<style lang="less" scoped>
.base {
  height: 100%;
  justify-content: center;
  align-items: center;
  .interface {
    width: 700px;
    height: 100%;
    margin: 102px 0px;
    background-color: #fff;
    overflow: hidden;
    .navbar {
      // height: 80px;
      font-size: 45px;
      padding: 8px 12px;
      justify-content: space-between;
      align-items: center;
      align-content: center;
    }
    .fileCellGroup {
      overflow: scroll;
      padding: 0 20px;
      .fileCell {
        padding: 10px 0;
        font-size: 36px;
        line-height: 54px;
        min-height: 60px;
        justify-content: space-between;
        border-top: 1px solid #e4e7eb;
      }
    }

    .van-popup {
      max-height: 50%;
      min-height: 250px;
      display: flex;
      justify-content: space-evenly;
      .label {
        font-size: 32px;
        text-align: center;
        margin: 8px;
        width: 90%;
        flex-grow: 0;
        justify-content: space-evenly;
      }
      .operation {
        width: 80%;
        font-size: 52px;
        margin: 10px 0;
        border: 1px solid black;
      }
    }
  }
}
</style>