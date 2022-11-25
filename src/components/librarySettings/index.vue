<template>
  <Overlay
    :onCancel="cancelLibrarySettings"
    :onConfirm="confirmLibrarySettings"
    class="overlay"
  >
    <div class="base">
      <div class="line addLibrary">
        <van-button
          type="primary"
          plain
          round
          icon="plus"
          size="large"
          @click="addLibrary()"
          >添加媒体库</van-button
        >
      </div>
      <template v-for="(val, index) in librarySettings.library.cells">
        <div class="line col libraries" :key="index">
          <div class="row library">
            <div class="libraryInfo col">
              <van-field
                class="libraryName"
                v-model="val.name"
                label="名称"
                placeholder="留空则默认为路径文件夹名"
              />
              <van-field
                class="libraryPath"
                v-model="val.value"
                label="路径"
                placeholder="如D:/movie或D:\\movie"
              />
            </div>
            <div class="libraryController col">
              <van-button
                plain
                hairline
                round
                icon="replay"
                type="primary"
                @click="updateLibrary(val)"
                >更新</van-button
              >
              <van-button
                plain
                hairline
                round
                icon="delete-o"
                type="danger"
                @click="deleteLibrary(index)"
                >删除</van-button
              >
            </div>
          </div>
        </div>
      </template>
      <van-cell-group :border="false">
        <div class="line">数据来源,当前版本只可使用弹弹Play</div>
        <template v-for="val in librarySettings.source.cells">
          <van-radio-group
            class="line col radio-group"
            v-if="val.type == 'radios'"
            :key="val.name"
            v-model="val.value"
            direction="horizontal"
            icon-size="16px"
          >
            <div :class="val.name">{{ val.name }}</div>
            <div class="radios row">
              <van-radio
                v-for="v in val.radios"
                :key="v.name"
                :name="v.value"
                :disabled="v.name == 'TMDB' || v.name == '本地'"
                >{{ v.name }}</van-radio
              >
            </div>
          </van-radio-group>
        </template>
      </van-cell-group>
    </div>
  </Overlay>
</template>

<script>
import Overlay from "@/components/overlay";
import { mapState } from "vuex";
import { Toast } from "vant";

export default {
  name: "LibraryController",
  components: {
    Overlay,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["librarySettings"]),
    settings() {
      let temp = { library: {}, source: {} };
      this.librarySettings.source.cells.forEach((v) => {
        temp.source[v.name] = v.value;
      });
      this.librarySettings.library.cells.forEach((v) => {
        temp.library[v.value] = v.name;
      });
      return temp;
    },
  },
  methods: {
    async confirmLibrarySettings() {
      let res = await this.$store.dispatch(
        "updateLibrarySettings",
        this.settings
      );
      console.log(res);
      if (res.success === true) {
        let thank = false;
        for (const key in this.settings.source) {
          if (this.settings.source[key] == "dandan") {
            thank = true;
          }
        }
        if (thank) {
          Toast({ message: "感谢弹弹Play公开数据库" });
        }
      } else if (!res.success) {
        Toast.fail(res.errorMessage);
      }
    },
    cancelLibrarySettings() {
      this.$store.commit("CONTROLLIBRARYSETTINGS", false);
    },
    addLibrary() {
      this.librarySettings.library.cells.push({ name: "", value: "" });
    },
    deleteLibrary(index) {
      this.librarySettings.library.cells.splice(index, 1);
      // console.log(this.librarySettings.library.cells[index]);
    },
    async updateLibrary(val) {
      let res = await this.$store.dispatch("updateLibrary", {
        libraryPath: val.value,
        libraryName: val.name,
      });
      if (res.success === false) {
        Toast.fail(res.errorMessage);
      } else if (res.success === true) {
        Toast({ message: "开始更新" });
      }
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.base {
  overflow-y: scroll;
}
.line {
  //   border: 1px solid #d8d8d8;
  border: none;
  //   border-radius: 12px;
  margin: 20px 20px;
  //   position: relative;
  font-size: 32px;
  line-height: 1.5;
  width: auto;
  padding: 10px 20px;
  /deep/.van-field__label {
    width: auto;
  }
}
.radio-group {
  display: flex;
  .radios {
    height: 1rem;
  }
}
.libraries {
  margin: 10px 20px;
  padding: 0px 20px;
  // font-size: 24px;
  .library {
    justify-content: space-around;
    border: 1px solid #d6d6d6;
    border-radius: 12px;
    margin: 18px 0px;
    .libraryInfo {
      justify-content: space-between;
      .van-field {
        font-size: 32px;
        height: 1.5rem;
        align-items: center;
        margin: 10px 0px;
      }
    }
    .libraryController {
      min-width: 3rem;
      justify-content: space-around;
    }
  }
}
.addLibrary {
  margin: 10px 20px;
  // width: 500px;
}
  .van-button__text{
    font-size: 24px;
  }
</style>