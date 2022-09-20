<template>
  <div class="base col center">
    <div class="player">
      <!-- <van-icon name="cross" class="closeIcon" v-show="true" ref="closeIcon" size="50px"/> -->
      <video
        ref="player"
        class="video-js vjs-big-play-centered vjs-control-bar"
      ></video>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import video_zhCN from "video.js/dist/lang/zh-CN.json";
videojs.addLanguage("zh-CN", video_zhCN);

export default {
  name: "VideoPlayer",
  data() {
    return {
      player: null,
      closeBtn: null,
      titleBar: null,
      videoPause: false,
    };
  },
  computed: {
    ...mapState(["fileName"]),
    playerTag() {
      return this.$refs.player;
    },
    playerOptions() {
      return {
        autoplay: true,
        controls: true,
        preload: "auto",
        fluid: true,
        language: "zh-CN",
        inactivityTimeout: 2000,
        controlBar: {
          children: [
            { name: "playToggle" },
            { name: "currentTimeDisplay" }, // 已播放时间
            { name: "progressControl" }, // 进度条
            { name: "durationDisplay" }, // 总时间
            // 倍数
            {
              name: "playbackRateMenuButton",
              playbackRates: [0.5, 1, 1.5, 2, 2.5],
            },
            {
              name: "volumePanel", // 音量
              inline: false, // 垂直
            },
            { name: "FullscreenToggle" }, // 全屏
          ],
        },
        html5: {
          vhs: {
            withCredentials: false,
          },
        },
      };
    },
    cookie() {
      return this.$cookies.get("file");
    },
  },
  methods: {
    playVideo() {
      this.$store
        .dispatch("getVideoSrc")
        .then((res) => {
          this.player.src({
            src: res,
            type: "application/x-mpegURL",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showControl() {
      console.log("show");
      this.closeBtn.removeClass("vjs-user-inactive");
      this.titleBar.removeClass("vjs-user-inactive");
    },
    hideControl() {
      console.log("hide");
      this.closeBtn.addClass("vjs-user-inactive");
      this.titleBar.addClass("vjs-user-inactive");
    },
  },
  mounted() {
    let _this = this;
    this.player = videojs(this.playerTag, this.playerOptions, () => {
      this.playVideo();
    });
    const Component = videojs.getComponent("Component");
    class TitleBar extends Component {
      constructor(player, options = {}) {
        super(player, options);
        if (options.text) {
          this.updateTextContent(options.text);
        }
      }
      createEl() {
        return videojs.dom.createEl("div", {
          className: "vjs-title-bar",
        });
      }
      updateTextContent(text) {
        if (typeof text !== "string") {
          text = "Title Unknown";
        }
        videojs.dom.emptyEl(this.el());
        videojs.dom.appendContent(this.el(), _this.fileName);
      }
    }
    class CloseBtn extends Component {
      constructor(player, options = {}) {
        super(player, options);
        this.on("click", this.click);
      }
      createEl() {
        return videojs.dom.createEl("div", {
          className: "vjs-closeBtn",
          innerHTML: '<i class="van-icon van-icon-cross closeIcon"></i>',
        });
      }
      click() {
        console.log("close");
        _this.$store.commit("CONTROLVIDEO", false);
      }
    }
    // var CloseButtn = videojs.getComponent('CloseButtn')
    // var closeButtn = new CloseButtn(this.player)
    // this.player.addChild(closeButtn)
    videojs.registerComponent("TitleBar", TitleBar);
    videojs.registerComponent("CloseBtn", CloseBtn);
    this.player.addChild("titleBar", { text: "The Title of The Video!" });
    this.player.addChild("CloseBtn");
    this.titleBar = this.player.getChild("titleBar");
    this.closeBtn = this.player.getChild("CloseBtn");
    this.player.on(
      [
        "loadstart",
        "play",
        "playing",
        "firstplay",
        "pause",
        "ended",
        "adplay",
        "adplaying",
        "adfirstplay",
        "adpause",
        "adended",
        "contentplay",
        "contentplaying",
        "contentfirstplay",
        "contentpause",
        "contentended",
        "contentupdate",
        "useractive",
        "userinactive",
      ],
      function (e) {
        //        console.warn('VIDEOJS player event: ', e.type);
        if (e.type == "play") {
          // console.log("开始播放");
          _this.videoPause = false;
          _this.showControl();
        } else if (e.type == "playing") {
          // console.log("正在播放...");
        } else if (e.type == "pause") {
          // console.log("暂停播放");
          _this.videoPause = true;
          _this.showControl();
        } else if (e.type == "firstplay") {
          // console.log("初次播放");
        } else if (e.type == "useractive") {
          // console.log("活动");
          _this.showControl();
        } else if (e.type == "userinactive") {
          // console.log("静默");
          if (_this.videoPause == false) {
            _this.hideControl();
          }
        } else {
          // console.log(e.type);
        }
      }
    );
  },
  beforeDestroy() {
    this.player.dispose();
  },
};
</script>

<style lang="less" scoped>
.base {
  height: 100%;
  width: auto;
  background-color: transparent;
  .btn {
    width: 100%;
    height: 200px;
    background-color: #fff;
  }
  .player {
    width: 100%;
    /deep/.video-js {
      width: 100%;
      .vjs-title-bar {
        background: rgba(0, 0, 0, 0.5);
        color: white;
        padding: 8px;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 32px;
        overflow: hidden;
      }
      .vjs-closeBtn {
        width: 32px;
        height: 32px;
        // background-color: #fff;
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
        align-items: center;
      }
      .vjs-user-inactive {
        visibility: hidden;
        opacity: 0;
        -webkit-transition: visibility 1.5s, opacity 1.5s;
        -moz-transition: visibility 1.5s, opacity 1.5s;
        -ms-transition: visibility 1.5s, opacity 1.5s;
        -o-transition: visibility 1.5s, opacity 1.5s;
        transition: visibility 1.5s, opacity 1.5s;
      }
      .vjs-big-play-button .vjs-paused.vjs-has-started .vjs-title-bar,
      .vjs-user-active.vjs-has-started .vjs-title-bar {
        display: block;
      }
    }
    //  .closeIcon{
    //     position: relative;
    //     top:100px;
    //     left: 100px;
    //     z-index: 99;
    //   }
  }
}
</style>