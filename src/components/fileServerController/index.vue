<template>
  <Overlay
    :onCancel="cancelFSSettings"
    :onConfirm="confirmFSSettings"
    class="overlay"
  >
    <van-cell-group :border="false">
      <template v-for="val in settings">
        <van-field
          v-if="val.type == 'text'"
          :key="val.name"
          class="line"
          v-model="val.value"
          :name="val.name"
          :label="val.name"
          :placeholder="FSSettings[val.name].toString()"
          input-align="right"
        >
        </van-field>
        <van-field
          v-if="val.type == 'number'"
          type="number"
          :key="val.name"
          class="line"
          v-model="val.value"
          :name="val.name"
          :label="val.name"
          :placeholder="FSSettings[val.name].toString()"
          input-align="right"
        >
        </van-field>
        <van-field
          v-if="val.type == 'switch'"
          :key="val.name"
          class="line"
          :name="val.name"
          :label="val.name"
          input-align="right"
        >
          <template #input>
            <van-switch v-model="val.value" size="20" />
          </template>
        </van-field>
        <van-field
          :key="val.name"
          :name="val.name"
          :label="val.name"
          class="line customCommand col"
          v-model="val.value"
          rows="1"
          autosize
          v-if="val.type == 'textarea'"
          type="textarea"
          :placeholder="`指令设定请参考readme文档，勿轻易修改`"
          id="link"
          input-align="left"
        />
        <van-radio-group
          class="line row radio-group"
          v-if="val.name == 'platform'"
          :key="val.name"
          v-model="val.value"
          direction="horizontal"
          icon-size="16px"
        >
          <div class="platform">platform</div>
          <div class="radios row">
            <van-radio name="nvidia">nvidia</van-radio>
            <van-radio name="intel">intel</van-radio>
            <van-radio name="amd">amd</van-radio>
            <van-radio name="other">other</van-radio>
          </div>
        </van-radio-group>
        <van-radio-group
          :key="val.name"
          v-if="val.name == 'encode'"
          class="line row radio-group"
          v-model="val.value"
          direction="horizontal"
          icon-size="16px"
        >
          <div class="encode">encode</div>
          <div class="radios row">
            <van-radio name="h265">h265</van-radio>
            <van-radio name="h264">h264</van-radio>
          </div>
        </van-radio-group>
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
      text: ["qbHost", "tempPath", "cert", "key","ffmpegPath","dandanplayPath"],
      switch: ["secure", "burnSubtitle", "forceTranscode", "share","autoBitrate"],
      radio: ["platform", "encode"],
      textarea: ["customInputCommand","customOutputCommand"],
      number: ["serverPort", "bitrate"],
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
  padding: 10px 20px;
  /deep/.van-field__label {
    width: auto;
  }
}
.radio-group {
  display: flex;
  .radios {
    flex-grow: 1;
    justify-content: space-evenly;
  }
  .encode,
  .platform {
    color: #646566;
  }
}
</style>