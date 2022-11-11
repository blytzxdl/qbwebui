<template>
  <Overlay
    :onCancel="cancelFSSettings"
    :onConfirm="confirmFSSettings"
    class="overlay"
  >
    <van-cell-group :border="false">
      <template v-for="val in FSSettings">
        <van-field
          v-if="val.type == 'text'"
          :key="val.name"
          class="line"
          v-model="val.value"
          :name="val.name"
          :label="val.name"
          :placeholder="val.placeholder"
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
          :placeholder="val.placeholder"
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
          class="line col"
          v-model="val.value"
          rows="1"
          autosize
          v-if="val.type == 'textarea'"
          type="textarea"
          :placeholder="val.placeholder"
          input-align="left"
        />
        <van-radio-group
          class="line row radio-group"
          v-if="val.type == 'radios'"
          :key="val.name"
          v-model="val.value"
          direction="horizontal"
          icon-size="16px"
        >
          <div :class="val.name">{{val.name}}</div>
          <div class="radios row">
            <van-radio v-for="v in val.radios" :key="v.name" :name="v.name">{{v.name}}</van-radio>
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
      };
  },
  computed: {
    ...mapState(["FSSettings"]),
    settings(){
      let temp={}
      for (const key in this.FSSettings) {
        temp[key] = this.FSSettings[key].value
      }
      return temp
    } ,
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
    // let allType = {
    //   text: ["qbHost", "tempPath", "cert", "key","ffmpegPath","dandanplayPath"],
    //   switch: ["secure", "burnSubtitle", "forceTranscode", "share","autoBitrate"],
    //   radio: ["platform", "encode"],
    //   textarea: ["customInputCommand","customOutputCommand"],
    //   number: ["serverPort", "bitrate"],
    // };
    // for (const name in this.FSSettings) {
    //   let type;
    //   let placeholder;
    //   for (const key in allType) {
    //     if (allType[key].includes(name)) {
    //       type = key;
    //       break;
    //     }
    //   }
    //   let set = {
    //     name,
    //     value: this.FSSettings[name],
    //     type,
    //   };
    //   this.settings.push(set);
    // }
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