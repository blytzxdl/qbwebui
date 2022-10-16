<template>
  <Overlay class="settings" :onCancel="closeSettings" :onConfirm="closeSettings">
    <div class="line row">
      <div>切回原版UI(刷新生效)</div>
      <van-icon name="guide-o" @click="$store.dispatch('toggleOriginUI')" />
    </div>
    <div class="line">
      <div @click="$store.dispatch('updateLibrary')">更新刮削数据</div>
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
  methods: {
    closeSettings() {
      this.$store.commit("SONTROLSETTINGS", false);
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
  }
}
</style>