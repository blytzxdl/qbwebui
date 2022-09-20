<template>
  <Overlay
    :onCancel="cancelFSSettings"
    :onConfirm="confirmFSSettings"
    class="overlay"
  >
    <van-cell-group :border='false'>
      <template v-for="val in settings">
        <van-field
          v-if="val.type == 'text'"
          :key="val.name"
          class="line"
          v-model="val.value"
          :name="val.name"
          :label="val.name"
          :placeholder="FSSettings[val.name].toString()"
        >
        </van-field>
        <van-field
          v-if="val.type == 'switch'"
          :key="val.name"
          class="line"
          :name="val.name"
          :label="val.name"
        >
          <template #input>
            <van-switch v-model="val.value" size="20" />
          </template>
        </van-field>
      </template>
    </van-cell-group>
  </Overlay>
</template>

<script>
import Overlay from "@/components/overlay";
import { mapState } from "vuex";

export default {
  name: "FileServerController",
  components: {
    Overlay,
  },
  data() {
    return {
      settings: [],
    };
  },
  computed: {
    ...mapState(["FSSettings"]),
  },
  methods: {
    confirmFSSettings() {
      this.$store.dispatch("changeFSSettings", this.settings);
    },
    cancelFSSettings() {
      this.$store.commit("CONTROLFSSETTINGS", false);
    },
  },
  mounted() {
    let allType = {
      text: ["qbHost", "serverPort", "tempPath", "cert", "key", "encoder"],
      switch: ["secure", "burnSubtitle", "forceTranscode", "share"],
    };
    for (const name in this.FSSettings) {
      let type;
      let placeholder;
      for (const key in allType) {
        if (allType[key].includes(name)) {
          type = key;
          break;
        }
      }
      let set = {
        name,
        value: this.FSSettings[name],
        type,
      };
      this.settings.push(set);
    }
  },
};
</script>

<style lang="less" scoped>
.line {
//   border: 1px solid #d8d8d8;
border: none;
//   border-radius: 12px;
  margin: 20px 20px;
//   position: relative;
font-size: 32px;
  line-height: 1.5;
  width: auto;
  /deep/.van-field__label {
    width: auto;
  }
  /deep/.van-field__control {
    justify-content: flex-end;
    text-align: right;
  }
  //   .key {
  //     // display: ;
  //     position: absolute;
  //     top: -16px;
  //     left: 20px;
  //     font-size: 16px;
  //     line-height: 1;
  //     color: #555555;
  //     background-color: #fff;
  //   }
}
</style>