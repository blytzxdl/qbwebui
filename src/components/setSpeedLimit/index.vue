<template>
  <Overlay
    :onCancel="cancelSetSpeedLimit"
    :onConfirm="confirmSetSpeedLimit"
    class="col"
  >
    <div class="col speedLimit">
      <div class="row alt">
        <div>切换备用</div>
        <van-switch v-model="speedLimit.alternativeSpeedLimit" />
      </div>
      <div class="row manualSet">
        <div class="speedType">上传</div>
        <van-field
          v-model="speedLimit.upload"
          type="number"
          :formatter="formatter"
          class="manualInput"
          :border="false"
        />
        <div>KiB/s</div>
      </div>
      <van-slider v-model="speedLimit.upload" max="10000" />
      <div class="row manualSet">
        <div class="speedType">下载</div>
        <van-field
          v-model="speedLimit.download"
          type="number"
          :formatter="formatter"
          class="manualInput"
          :border="false"
        />
        <div>KiB/s</div>
      </div>
      <van-slider v-model="speedLimit.download" max="10000" />
    </div>
  </Overlay>
</template>

<script>
import Overlay from "@/components/overlay";
import { mapState } from "vuex";
export default {
  name: "SetSpeedLimit",
  components: {
    Overlay,
  },
  data() {
    return {
      speedLimit: {
        alternativeSpeedLimit: true,
        upload: 0,
        download: 0,
      },
    };
  },
  computed: {
    ...mapState(["globalInfo"]),
  },
  methods: {
    //确认设置限速
    confirmSetSpeedLimit() {
      this.$store.dispatch("setSpeedLimit", this.speedLimit);
    },
    //取消设置限速
    cancelSetSpeedLimit() {
      this.$store.commit("CONTROLSETSPEEDLIMIT", false);
    },
    //限速输入框格式化
    formatter(val) {
      // console.log(val);
      return Number(val);
    },
  },
  mounted() {
    //初始化速度限制
    this.speedLimit.alternativeSpeedLimit =
      this.globalInfo.use_alt_speed_limits;
    this.speedLimit.upload = parseInt(this.globalInfo.up_rate_limit / 1024);
    this.speedLimit.download = parseInt(this.globalInfo.dl_rate_limit / 1024);
  },
};
</script>

<style lang="less" scoped>
.speedLimit {
  //   width: 500px;
  margin: 20px;
  height: 250px;
  display: flex;
  justify-content: space-evenly;
  max-width: 100%;
  overflow: hidden;
  .alt {
    justify-content: space-between;
    align-items: center;
  }
  .manualSet {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .speedType {
      width: 120px;
      text-align: left;
    }
    .manualInput {
      width: 150px;
      font-size: 36px;
      .van-field__control {
        text-align: center;
      }
    }
  }
}
</style>