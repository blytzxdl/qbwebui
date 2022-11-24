<template>
  <div class="col base">
    <div class="interface col">
      <div class="navbar row">
        <div class="left" @click="onClickLeft">
          <van-icon name="arrow-left" />
        </div>
        <div class="right" @click="$bus.$emit('controlInfo', { to: false })">
          <van-icon name="cross" />
        </div>
      </div>
      <div class="fileCellGroup">
        <div
          v-for="(ite, index) in workSpace"
          :class="'fileCell center ' + itemStyle(ite)"
          :key="index"
          @click="onClickCell(ite)"
        >
          <div class="left" v-if="!ite.children && !ite.mediaInfo">
            {{ ite.label.split(".").reverse()[0] }}
          </div>
          <div class="poster" v-if="ite.mediaInfo || isSeason(ite)">
            <!-- <img :v-lazy="ite.mediaInfo.poster"> -->
            <img
              v-if="ite.mediaInfo && ite.mediaInfo.poster"
              :src="ite.mediaInfo.poster"
            />
          </div>
          <div class="content">
            {{
              ite.mediaInfo && ite.mediaInfo.title
                ? ite.mediaInfo.title
                : ite.label
            }}
          </div>
          <div
            class="content seasonTitle"
            v-if="ite.mediaInfo && ite.mediaInfo.title && ite.mediaInfo.season"
          >
            {{ ite.label }}
          </div>
          <div class="right" v-if="ite.children && !ite.mediaInfo">
            <van-icon name="arrow" />
          </div>
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
          @click="operateFile('play')"
        >
          播放视频(需设备支持)
        </div>
        <div
          class="label operation"
          v-if="fileType == 'video'"
          @click="operateFile('path')"
        >
          获取串流地址
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
import { Toast } from "vant";
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
      loadingToast: null,
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
      if (this.backSpace.length >= 1) {
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
    async operateFile(met) {
      this.operate = false;
      Toast.loading({
        message: "生成中...",
        forbidClick: true,
        duration: 5000,
      });
      let res = await this.$store.dispatch("tryLocalFile", {
        fileInfo: this.file,
        met,
      });
      Toast.clear();
      if (met == "path") {
        this.$copyText(`window.location.origin${res.src}`);
        Toast(`已复制到剪贴板`);
      }
    },
    itemStyle(ite) {
      if (ite.mediaInfo) {
        return "col";
      } else return "row";
    },
    isSeason(ite) {
      if (ite.children) {
        let mediaInfo;
        let title = {};
        let poster = {};
        ite.children.forEach((v, i) => {
          if (v.mediaInfo && v.mediaInfo.seasonTitle) {
            if (title[v.mediaInfo.seasonTitle]) {
              title[v.mediaInfo.seasonTitle]++;
            } else {
              title[v.mediaInfo.seasonTitle] = 1;
            }
          }
          if (v.mediaInfo && v.mediaInfo.seasonPoster) {
            if (poster[v.mediaInfo.seasonPoster]) {
              poster[v.mediaInfo.seasonPoster]++;
            } else {
              poster[v.mediaInfo.seasonPoster] = 1;
            }
          }
        });
        title = Object.keys(title).sort((a, b) => title[b] - title[a])[0];
        poster = Object.keys(poster).sort((a, b) => poster[ab] - poster[a])[0];
        mediaInfo = {
          title,
          poster,
          season: true,
        };
        return mediaInfo;
      } else return false;
    },
  },
  mounted() {
    this.files.forEach((v) => {
      v.mediaInfo = this.isSeason(v);
      // console.log(v);
    });
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
    border-radius: 12px;
    .navbar {
      // height: 80px;
      font-size: 45px;
      padding: 8px 12px;
      justify-content: space-between;
      align-items: center;
      align-content: center;
      border-radius: 12px;
      border-bottom: 1px solid #d8d8d8;
    }
    .fileCellGroup {
      overflow-y: scroll;
      padding: 0 10px;
      .fileCell {
        min-height: 80px;
        padding: 10px 10px;
        font-size: 30px;
        line-height: 1.5;
        justify-content: space-between;
        border-bottom: 1px solid #d8d8d8;
        .poster {
          img {
            width: 100%;
            border-radius: 12px;
          }
        }
        .content {
          flex-grow: 1;
          color: #222222;
        }
        .seasonTitle {
          font-size: 18px;
          word-break: break-all;
          color: #666666;
        }
        .left {
          @length: 50px;
          min-width: @length;
          min-height: @length;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d8d8d8;
          border-radius: 12px;
          margin-right: 10px;
          color: #666666;
        }
      }
    }

    .van-popup {
      max-height: 50%;
      min-height: 250px;
      display: flex;
      justify-content: space-evenly;
      border-radius: 12px 12px 0 0;

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
        font-size: 36px;
        line-height: 1.5;
        margin: 10px 0;
        border: 1px solid #666666;
        border-radius: 12px;
      }
    }
  }
}
</style>