<template>
  <el-row type="flex" class="row-bg">
    <el-col :span="4"><div class="grid-content small bg-purple"><i class="el-icon-link"></i>{{transferInfo.connection_status}}</div></el-col>
    <el-col :span="4"><div class="grid-content small bg-purple-light">DHT:{{transferInfo.dht_nodes}}节点</div></el-col>
    <el-col :span="8"><div class="grid-content big bg-purple"><i class="el-icon-download"></i>下载{{transferInfo.dl_info_speed}}/s[{{transferInfo.dl_rate_limit}}/s]({{transferInfo.dl_info_data}})</div></el-col>
    <el-col :span="8"><div class="grid-content big bg-purple-light"><i class="el-icon-upload2"></i>上传{{transferInfo.up_info_speed}}/s[{{transferInfo.up_rate_limit}}/s]({{transferInfo.up_info_data}})</div></el-col>
  </el-row>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: "Footer",
  data(){
    return{
      
      }
  },
  computed:{
    ...mapGetters([
      'transferInfo'
    ])
    },
  methods: {
    // getTransferInfo() {
    //   this.$store.dispatch("getTransferInfo");
    // },
  },
  mounted() {
    // // setInterval(() => {
    //   this.getTransferInfo();
    // // }, 2000);
  },
};
</script>

<style lang="less" scoped>
  .el-row {
    padding: 0;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  // .bg-purple-dark {
  //   background: #99a9bf;
  // }
  // .bg-purple {
  //   background: #d3dce6;
  // }
  // .bg-purple-light {
  //   background: #e5e9f2;
  // }
  .grid-content {
    min-height: 36px;
    height: 100%;
  }

</style>