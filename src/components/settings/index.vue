<template>
  <Overlay
    class="settings"
    :onCancel="closeSettings"
    :onConfirm="closeSettings"
    :showConfirm="false"
  >
    <!-- <div class="line row">
      <div>切回原版UI(刷新生效)</div>
      <div class="btn center" @click="$store.dispatch('toggleOriginUI')">
        执行
      </div>
    </div> -->
    <div class="line row">
      <div>刮削数据</div>
      <van-checkbox
        name="fullUpdate"
        v-model="fullUpdate"
        shape="square"
        icon-size="1rem"
        >完全</van-checkbox
      >
      <van-checkbox
        name="overwrite"
        v-model="overwrite"
        shape="square"
        icon-size="1rem"
      >
        <div style="color: red">覆盖</div>
      </van-checkbox>
      <div
        :class="`btn ${warn}`"
        @click="$store.dispatch('updateLibrary', { fullUpdate, overwrite })"
      >
        更新
      </div>
    </div>
    <!-- <div class="line" @click="$store.dispatch('stopTranscode')">停止转码</div> -->
    <div class="line row">
      <div>停止转码并清理缓存</div>
      <div class="btn" @click="$store.dispatch('clearVideoTemp')">执行</div>
    </div>
    <div class="line row">
      <div>切换至</div>
      <div class="btn" @click="$store.dispatch('login', { to: 'torrents' })">
        <van-icon name="guide-o" />
        种子管理
      </div>
      <div class="btn" @click="$store.dispatch('login', { to: 'library' })">
        <van-icon name="guide-o" />媒体库
      </div>
    </div>
  </Overlay>
</template>

<script>
import Overlay from "@/components/overlay";
import { mapState } from "vuex";
export default {
  name: "Settings",
  components: {
    Overlay,
  },
  data() {
    return {
      fullUpdate: false,
      overwrite: false,
    };
  },
  computed: {
    warn() {
      if (this.overwrite) {
        return "warn";
      } else return "";
    },
  },
  methods: {
    closeSettings() {
      this.$store.commit("SONTROLSETTINGS", false)
    },
  },
};
</script>

<style lang="less" scoped>
.settings {
  align-items: center;
  .line {
    line-height: 1.5;
    flex-grow: 1;
    padding: 20px;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    .btn {
      padding: 5px 20px;
      border: 1px solid #d6d6d6;
      border-radius: 12px;
    }
    .van-checkbox {
      height: 1rem;
    }
    .warn {
      color: red;
    }
  }
}
</style>