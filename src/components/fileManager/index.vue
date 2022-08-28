<template>
  <div class="col base">
    <div class="interface col">
      <div class="navbar row">
        <div class="left" @click="onClickLeft">返回</div>
        <div class="right" @click="$bus.$emit('controlInfo', {to:false})">关闭</div>
      </div>
      <div class="fileCellGroup">
        <div
          class="fileCell center row"
          v-for="(ite, index) in workSpace"
          :key="index"
          @click="onClickCell(ite)"
        >
          <!-- <div class="left"></div> -->
          <div class="content">
            {{ ite.label }}
          </div>
          <div class="right" v-if="ite.children"><van-icon name="arrow" /></div>
        </div>
      </div>
    <van-popup
      class="col center"
      v-model="operate"
      closeable
      position="bottom"
      :style="{ height: '20%' }"
    >
    <div class="operation" @click="operateFile()">播放(未实现)</div>
    <div class="operation">打开(未实现)</div>
    </van-popup>
    </div>

  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name:'FileManager',
  props:[
    'rootPath'
  ],
  data() {
    return {
      workSpace: null,
      backSpace: [],
      workIndex: "",
      operate:false,
      file:null
    };
  },
  methods: {
    onClickLeft() {
      if (this.workSpace.length > 1) {
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
        this.file = ite
        this.file.rootPath=this.rootPath
        this.operate = true
      }
    },
    operateFile(){
      this.operate = false
      // this.$bus.$emit('controlVideo',true)
      this.$store.dispatch("reqTranscode", this.file);
    }
  },
  computed: {
    ...mapState(["files"]),
  },
  mounted() {
    this.workSpace = this.files;
  },
};
</script>

<style lang="less" scoped>
.base {
  height: 100%;
  justify-content: center;
  align-items: center;
  .interface {
    width: 700px;
    height: 100%;
    margin: 102px 0px;
    background-color: #fff;
    overflow: hidden;
    .navbar {
      // height: 80px;
      font-size: 45px;
      padding: 8px 12px;
      justify-content: space-between;
      align-items: center;
      align-content: center;
    }
    .fileCellGroup {
      overflow: scroll;
      padding: 0 20px;
      .fileCell {
        padding: 10px 0;
        font-size: 36px;
        line-height: 54px;
        min-height: 60px;
        justify-content: space-between;
        border-top: 1px solid #e4e7eb;
      }
    }

    .van-popup{
      .operation{
        width: 80%;
        font-size: 52px;
        margin: 10px 0;
        text-align: center;
        border: 1px solid black;
      }
    }
  }
}
</style>