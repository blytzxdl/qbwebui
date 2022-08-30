<template>
  <div class="base col center">
    <video ref="player" class="video-js"></video>
    <div class="btn" @click="playVideo()">play</div>
    <div class="btn" @click="$store.commit('CONTROLVIDEO', false)">close</div>
  </div>
</template>

<script>
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { mapState } from "vuex";
export default {
  name: "VideoPlayer",
  data() {
    return {
      player: null,
    };
  },
  computed: {
    ...mapState(["fileServer"]),
    playerTag() {
      return this.$refs.player;
    },
    playerOptions() {
      return {
        controls: true,
        preload: "auto",
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
      this.player.src({
        src: `${this.fileServer}/api/localFile/output/index.m3u8`,
        type: "application/x-mpegURL",
      });
    },
  },
  mounted() {
    this.player = videojs(this.playerTag, this.playerOptions, (res) =>
      console.log(res)
    );
    this.playVideo()
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
      ],
      function (e) {
        //        console.warn('VIDEOJS player event: ', e.type);
        if (e.type == "play") {
          console.log("开始播放");
        } else if (e.type == "playing") {
          console.log("正在播放...");
        } else if (e.type == "pause") {
          console.log("暂停视频播放");
        } else if (e.type == "firstplay") {
          console.log("firstplay播放");
        } else {
          console.log("1111111111111");
        }
      }
    );
  },
  beforeDestroy() {
    this.player.dispose()
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
  .video-js {
    width: 100%;
  }
}
</style>