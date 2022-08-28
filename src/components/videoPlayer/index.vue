<template>
  <div class="base col center" @click="$bus.$emit('controlPlayer', false)">
    <video ref="player" class="video-js"></video>
    <div class="btn" @click="playVideo()">play</div>
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
    ...mapState([]),
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
  },
  methods: {
    playVideo() {
      this.player.src({
        src: 'http://localhost:9000/api/transcode/index.m3u8',
        type: "application/x-mpegURL",
      });
    },
  },
  mounted() {
    this.player = videojs(this.playerTag, this.playerOptions, (res) =>
      console.log(res)
    );
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
  },
};
</script>

<style lang="less" scoped>
.base {
  height: 100%;
  width: auto;
  background-color: transparent;
}
</style>