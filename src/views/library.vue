<template>
  <div class="col base">
    <div class="interface col">
      <div class="navbar row">
        <div class="left" @click="onClickLeft">
          <van-icon name="arrow-left" />
        </div>
        <div :class="`FS`" @click="openFSSettings">
          <van-icon name="desktop-o" />
        </div>
      </div>
      <van-list
        :class="`fileCellGroup ${
          workSpace[0].children ? 'seasons' : 'epsoids'
        }`"
        v-model="loading"
        :finished="finished"
        @load="onLoad"
        :immediate-check="false"
      >
        <template v-for="(ite, index) in workSpace">
          <div
            v-if="index < showNum"
            :class="`fileCell center ${ite.children ? 'season' : 'epsoid'}`"
            :key="ite.label"
            @click="onClickCell(ite)"
          >
            <div class="poster" v-if="ite.poster">
              <!-- <img :v-lazy="ite.mediaInfo.poster"> -->
              <img
                v-if="ite.poster"
                :src="`/api/localFile/img.jpg?type=picture&path=${encodeURIComponent(
                  ite.poster
                )}`"
              />
            </div>
            <div class="title col center">
              <div class="content">
                {{ ite.title ? ite.title : ite.label }}
              </div>
              <div class="content originalTitle" v-if="ite.children">
                {{ ite.label }}
              </div>
            </div>
          </div>
        </template>
      </van-list>
      <!-- 底部导航 -->
      <div class="bottom row" size="100%">
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
  </div>
</template>

<script>
import { Toast } from "vant";
import { mapState } from "vuex";
import renderSize from "@/utils/renderSize";
import VideoPlayer from "../components/videoPlayer";
import FileServerController from "@/components/fileServerController";
import Settings from "@/components/settings";

export default {
  name: "library",
  components: {
    VideoPlayer,
    FileServerController,
    Settings,
  },
  data() {
    return {
      files: {},
      rootPath: "",
      loading: false,
      finished: false,
      showNum: 10,
      workSpace: [{label:"本功能需要先更新刮削数据",children:{}}],
      backSpace: [],
      searchSpace: [],
      workIndex: "",
      operate: false,
      loadingToast: null,
      file: { label: "" },
      search: "",
    };
  },
  computed: {
    ...mapState(["playVideo", "library", "showFSSettings", "showSettings"]),
    fileSize() {
      return renderSize(this.file.size);
    },
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
        duration: 0,
      });
      let res = await this.$store.dispatch("tryLocalFile", {
        fileName: this.file,
        met,
      });
      Toast.clear();
      if (met == "path") {
        this.$copyText(res);
        Toast(`已复制到剪贴板`);
      }
    },
    openFSSettings() {
      if (this.workSpace[0]) {
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
      if (this.searchSpace.length > 0) {
        this.workSpace = this.searchSpace.pop();
      }
      let searchParams = input.split(" ");
      // console.log(searchParams);
      let temp = [];
      searchParams.forEach((v) => {
        if (v.length > 0) {
          temp.push(v);
        }
      });
      searchParams = temp;
      if (searchParams) {
        temp = [];
        this.workSpace.forEach((item) => {
          searchParams.forEach((val) => {
            let reg = new RegExp(val, "gim");
            if (reg.test(item.label) || reg.test(item.title)) {
              if (!temp.includes(item)) {
                temp.push(item);
              }
            }
          });
        });
        this.searchSpace.push(this.workSpace);
        if (temp.length > 0) {
          this.workSpace = temp;
        } else this.workSpace = [{}];
      }
    },
    //取消搜索
    onCancel() {
      // console.log('can');
      this.workSpace = this.searchSpace.pop();
    },
  },
  mounted() {
    this.$store
      .dispatch("getLibrary")
      .then((result) => {
        if (this.library) {
            this.workSpace = this.library;
            while (this.workSpace.length == 1) {
              this.workSpace = this.workSpace[0].children;
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
      .season {
        width: 40%;
        min-height: 80px;
      }
      .epsoid {
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
        .poster {
          img {
            width: 100%;
            border-radius: 12px 12px 0px 0px;
          }
        }
        .title {
          padding: 10px;
          .content {
            flex-grow: 1;
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