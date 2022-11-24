<template>
  <div class="col base">
    <div class="interface col">
      <div class="navbar row">
        <div class="left" @click="onClickLeft">
          <van-icon name="arrow-left" />
        </div>
        <div
          class="middle row center"
          v-if="workSpace.result == 'season' || workSpace.result == 'tvshow'"
        >
          <van-icon name="replay" @click="updateDir()" />
          <div class="little">更新当前目录</div>
        </div>
        <div :class="`FS`" @click="openFSSettings">
          <van-icon name="desktop-o" />
        </div>
      </div>
      <van-list
        :class="`fileCellGroup ${
          workSpace.result == 'episodedetails' ? 'epsoids' : 'seasons'
        }`"
        v-model="loading"
        :finished="finished"
        @load="onLoad"
        :immediate-check="false"
      >
        <template v-for="(ite, index) in workSpace.children">
          <div
            v-if="index < showNum"
            :class="`fileCell col ${
              ite.result == 'episodedetails' ? 'epsoid' : 'season'
            } ${!ite.result || !ite.poster ? 'normal' : ''}`"
            :key="ite.path"
            @click="onClickCell(ite)"
          >
            <div class="poster col center" v-if="ite.poster">
              <!-- <img :v-lazy="ite.mediaInfo.poster"> -->
              <!-- <img
                :src="`/api/localFile/getFile/img.jpg?type=picture&path=${encodeURI(
                  ite.poster
                )}`"
              /> -->
              <van-image
                class="posterImage"
                fit="contain"
                lazy-load
                :src="`/api/localFile/getFile/img.jpg?type=picture&path=${encodeURIComponent(
                  ite.poster
                )}`"
              />
            </div>
            <div class="title col center">
              <div class="content van-multi-ellipsis--l2">
                {{ ite.title ? ite.title : ite.label }}
              </div>
              <div
                class="content originalTitle van-ellipsis"
                v-if="
                  ite.result != 'episodedetails' &&
                  ite.title &&
                  ite.title != ite.label
                "
              >
                {{ ite.label }}
              </div>
            </div>
          </div>
        </template>
      </van-list>
      <!-- 底部导航 -->
      <div class="bottom row" size="100%">
        <van-icon
          name="plus"
          @click="$store.commit('CONTROLLIBRARYSETTINGS', true)"
        />
        <van-search
          v-model="search"
          show-action
          placeholder="空格分隔(当前目录搜索译名、原名)"
          input-align="center"
          @search="onSearch"
          @cancel="onCancel"
          class="search"
        />
        <van-icon
          name="setting-o"
          class="setting"
          @click="$store.commit('SONTROLSETTINGS', true)"
        />
      </div>
      <van-popup
        class="col center"
        v-model="operate"
        closeable
        position="bottom"
      >
        <div class="label">{{ file.label }}</div>
        <div class="label operation" @click="operateFile('play')">播放视频</div>
        <div class="label operation" @click="operateFile('path')">
          获取串流地址
        </div>
      </van-popup>
    </div>
    <!-- 视频播放弹窗 -->
    <van-overlay :show="playVideo" :lock-scroll="false">
      <VideoPlayer v-if="playVideo" />
    </van-overlay>
    <!-- FileServer控制弹窗 -->
    <van-overlay :show="showFSSettings" :lock-scroll="false">
      <FileServerController v-if="showFSSettings" />
    </van-overlay>
    <van-overlay :show="showSettings">
      <Settings v-if="showSettings"></Settings>
    </van-overlay>
    <van-overlay :show="showLibrarySettings">
      <LibrarySettings v-if="showLibrarySettings"></LibrarySettings>
    </van-overlay>
  </div>
</template>

<script>
import { Toast } from "vant";
import { mapState } from "vuex";
import renderSize from "@/utils/renderSize";
import VideoPlayer from "../components/videoPlayer";
import FileServerController from "@/components/fileServerController";
import Settings from "@/components/settings";
import LibrarySettings from "@/components/librarySettings";
// import path from 'path';
export default {
  name: "library",
  components: {
    VideoPlayer,
    FileServerController,
    Settings,
    LibrarySettings,
  },
  data() {
    return {
      files: {},
      rootPath: "",
      loading: false,
      finished: false,
      showNum: 10,
      workSpace: {
        children: [{ label: "本功能需要先建立媒体库", children: {} }],
      },
      backSpace: [],
      // backSpace: [],
      workIndex: "",
      operate: false,
      loadingToast: null,
      file: { label: "" },
      search: "",
      // scoll:''
    };
  },
  computed: {
    ...mapState([
      "playVideo",
      "library",
      "showFSSettings",
      "showSettings",
      "showLibrarySettings",
    ]),
    fileSize() {
      return renderSize(this.file.size);
    },
    // rootPath(){
    //   return path.resolve()
    // }
  },
  methods: {
    //无限滚动判定
    onLoad() {
      setTimeout(() => {
        this.showNum += 20;
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        if (this.showNum >= this.workSpace.length) {
          this.finished = true;
        }
      }, 300);
    },
    onClickLeft() {
      if (this.backSpace.length > 0) {
        this.workSpace = this.backSpace.pop();
      }
    },
    onClickCell(ite) {
      if (ite.children) {
        if (ite.children.length > 0) {
          this.backSpace.push(this.workSpace);
          this.rootPath = ite.path;
          this.workIndex = ite.label;
          this.workSpace = ite;
          if (
            this.workSpace.result == "tvshow" ||
            this.workSpace.result == "season"
          ) {
            this.workSpace.children.sort((a, b) =>
              a.episode && b.episode
                ? a.episode - b.episode
                : !a.episode
                ? 1
                : !b.episode
                ? -1
                : 1
            );
          }
        }
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
    openFSSettings() {
      if (this.workSpace) {
        this.$store
          .dispatch("checkFileServer")
          .then((result) => {
            this.$store.commit("CONTROLFSSETTINGS", true);
          })
          .catch((err) => {});
      }
    },
    //搜索参数处理
    onSearch(input) {
      if (this.workSpace.children.length > 0) {
        this.backSpace.push(this.workSpace);
        let searchParams = input.split(" ").filter((v) => v.length > 0);
        if (searchParams.length > 0) {
          this.workSpace = {
            label: "",
            children: this.workSpace.children.filter((item) => {
              for (let index = 0; index < searchParams.length; index++) {
                const val = searchParams[index];
                let reg = new RegExp(val, "gim");
                if (reg.test(item.label) || reg.test(item.title)) {
                  return true;
                }
              }
            }),
          };
        }
      }
      if (this.workSpace.children.length == 0) {
        this.workSpace.children = [{ label: "无结果" }];
      }
    },
    //取消搜索
    onCancel() {
      if (this.backSpace.length > 0) {
        this.workSpace = this.backSpace.pop();
      }
    },
    updateDir() {
      this.$store.dispatch("updateDir", { dirPath: this.rootPath });
    },
  },
  mounted() {
    this.$store.dispatch("getLibrarySettings");
    this.$store
      .dispatch("getLibrary")
      .then((result) => {
        if (this.library) {
          this.workSpace = this.library;
          while (this.workSpace.children.length == 1) {
            this.workSpace = this.workSpace.children[0];
            if (this.workSpace.path) {
              this.rootPath = this.workSpace.path;
            }
          }
        }
      })
      .catch((err) => {});
  },
};
</script>

<style lang="less" scoped>
.base {
  height: 100%;
  justify-content: center;
  align-items: center;
  .interface {
    width: 100vw;
    height: 100vh;
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
      background-color: #fff;
      .little {
        font-size: 24px;
      }
    }
    .seasons {
      flex-direction: row;
      flex-wrap: wrap;
    }
    .epsoids {
      flex-direction: column;
    }
    .fileCellGroup {
      overflow-y: scroll;
      //   padding: 0 10px;
      display: flex;
      word-break: break-all;
      height: 100%;
      align-content: flex-start;
      .season {
        width: 45%;
        height: 640px;
        .title {
          height: 3rem;
        }
      }
      .epsoid {
        width: 45%;
        height: 280px;
        .title {
          height: 2rem;
          .content {
            font-size: 28px;
          }
        }
      }
      .fileCell {
        background-color: #fff;
        flex-grow: 1;
        margin: 5px;
        // padding: 10px 10px;
        font-size: 30px;
        line-height: 1.5;
        justify-content: space-between;
        border: 1px solid #ebebeb;
        border-radius: 12px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        overflow: hidden;
        .poster {
          width: 100%;
          // height: 76%;
          overflow: hidden;
        }
        .title {
          // height: 160px;
          padding: 10px;
          .content {
            // flex-grow: 1;
            color: #222222;
          }
          .originalTitle {
            font-size: 18px;
            word-break: break-all;
            color: #666666;
          }
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
      /deep/.van-list__loading {
        width: 100%;
      }
    }
    .fileCell.normal {
      width: 100%;
      height: 3rem;
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
    .bottom {
      border-top: 1px solid #949494;
      border-radius: 12px 12px 0 0;
      min-height: 100px;
      padding: 0 10px;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      .setting {
        font-size: 52px;
        padding: 0 5px;
        color: #505050;
      }
      .search {
        width: 650px;
        height: 60px;
        padding: 0;
        border: 1px solid #d8d8d8;
        border-radius: 12px;
        .van-search__content {
          padding: 0;
          background-color: #fff;
          border: none;
          .van-field {
            font-size: 26px;
          }
        }
      }
    }
  }
}
</style>