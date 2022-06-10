<template>
  <div class="container">
    <div class="infoBox" v-show="showBox">
      <div class="common" v-show="checkedId == 1">
        <div class="progress">
          <div class="text">进度</div>
          <el-progress
            class="line"
            :text-inside="true"
            :stroke-width="18"
            :percentage="itemInfo.progress * 100 || 0"
          ></el-progress>
        </div>
        <div class="transmission">
          <div class="row">
            <div>总大小:{{ itemInfo.total_size }}</div>
            <div>已选择:{{ itemInfo.size }}</div>
            <div>已传输:{{ itemInfo.completed }}</div>
          </div>
          <div class="row">
            <div>已下载:{{ itemInfo.downloaded }}</div>
            <div>下载速度:{{ itemInfo.dlspeed }}</div>
            <div>下载限制:{{ itemInfo.dl_limit }}</div>
          </div>
          <div class="row">
            <div>已上传:{{ itemInfo.uploaded }}</div>
            <div>上传速度:{{ itemInfo.upspeed }}</div>
            <div>上传限制:{{ itemInfo.up_limit }}</div>
          </div>
        </div>
        <div class="information">
          <div class="row">
            <div>创建于:{{ itemInfo.total_size }}</div>
            <div>添加于:{{ itemInfo.size }}</div>
            <div>完成于:{{ itemInfo.completed }}</div>
          </div>
          <div class="row">
            <div>哈希值v1:{{ itemInfo.infohash_v1 }}</div>
            <div>保存路径:{{ itemInfo.save_path }}</div>
          </div>
        </div>
      </div>
      <div class="trackers" v-show="checkedId == 2">
        <el-table :data="trackerData" height="300" border style="width: 100%">
          <el-table-column prop="tier" label="层级" width="50">
          </el-table-column>
          <el-table-column prop="status" label="状态"> </el-table-column>
          <el-table-column prop="url" label="URL"> </el-table-column>
          <el-table-column prop="num_peers" label="用户"> </el-table-column>
          <el-table-column prop="num_peers" label="做种"> </el-table-column>
          <el-table-column prop="num_leeches" label="下载"> </el-table-column>
          <el-table-column prop="num_downloaded" label="完成">
          </el-table-column>
          <el-table-column prop="msg" label="消息"> </el-table-column>
        </el-table>
      </div>
      <div class="users" v-show="checkedId == 3">
        <el-table
          :data="peerData"
          height="auto"
          style="width: 100%; padding: 0;max-height: 300px "
          :border="true"
          :stripe="true"
          :highlight-current-row="true"
        >
          <el-table-column
            v-for="(row, index) in tableRow"
            :key="index"
            :prop="row.prop"
            :label="row.label"
            :width="row.width"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
      </div>
      <div class="httpSource" v-show="checkedId == 4">
        暂无数据
      </div>
      <div class="contents" v-show="checkedId == 5">
        <el-tree
          :data="files"
          :props="defaultProps"
          @node-click="handleNodeClick"
          class="tree"
        ></el-tree>
      </div>
    </div>
    <el-row class="buttomBar">
      <el-col
        :class="{ infoName, focus: infoName.isChecked == 1 }"
        v-for="(infoName, index) in infoList"
        :key="infoName.id"
      >
        <div @click="selectInfo($event, infoName)">
          {{ infoName.name }}
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Info",
  data() {
    return {
      infoList: [
        { name: "普通", isChecked: 1, id: "1" },
        { name: "Tracker", isChecked: 0, id: "2" },
        { name: "用户", isChecked: 0, id: "3" },
        { name: "HTTP源", isChecked: 0, id: "4" },
        { name: "内容", isChecked: 0, id: "5" },
        { name: "速度", isChecked: 0, id: "6" },
      ],
      tableRow: [
        {
          prop: "country",
          label: "国家/地区",
          width: "100",
        },
        {
          prop: "ip",
          label: "IP",
          width: "180",
        },
        {
          prop: "connection",
          label: "连接",
          width: "100",
        },
        {
          prop: "client",
          label: "客户端",
          width: "180",
        },
        {
          prop: "peer_id",
          label: "Peer ID",
          width: "100",
        },
        {
          prop: `progress`,
          label: "进度",
          width: "100",
        },
        {
          prop: `relevance`,
          label: "文件关联",
          width: "100",
        },
        {
          prop: `files`,
          label: "文件",
          width: "300",
        },
      ],
      showBox: false,
      checkedId: "",
      itemInfo: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  computed: {
    ...mapState({
      trackerData: (state) => state.item.trackers,
      peerData: (state) =>state.item.peers,
      files: (state) => state.item.files,
    }),
  },
  methods: {
    selectInfo(eve, tar) {
      this.infoList.forEach((item) => {
        item.isChecked = 0;
      });
      tar.isChecked = 1;
      if (this.showBox && tar.id == this.checkedId) {
        this.showBox = false;
      } else {
        this.showBox = true;
      }
      this.checkedId = tar.id;
    },
    handleNodeClick(data) {
      console.log(data);
    },
  },
  mounted() {
    this.$bus.$on("getItemInfo", (info) => {
      this.itemInfo = info;
      this.$store.dispatch("getTrackers", this.itemInfo.hash);
      this.$store.dispatch("getPeers", this.itemInfo.hash);
      this.$store.dispatch("getFiles", this.itemInfo.hash);
    });
  },
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  .infoBox {
    height: 300px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    .common {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      .progress {
        display: flex;
        // flex-grow: 1;
        height: 20px;
        flex-direction: row;
        text-align: center;
        border: 1px solid #b3c0d1;
        border-style: solid none none none;
        padding: 0 20px;
        .text {
          width: 80px;
        }
        .line {
          flex-grow: 1;
        }
      }
      .transmission,
      .information {
        display: flex;
        flex-grow: 1;
        border: 1px solid #b3c0d1;
        border-style: solid none none none;
        flex-direction: column;

        .row {
          display: flex;
          flex-direction: row;
          flex-grow: 1;
          align-items: center;
          div {
            flex-grow: 1;
          }
        }
      }
      .infoList3 {
        flex-grow: 1;
        // border: 1px solid red;
      }
    }
    .users{
      div{
        height: 100%;

      }
    }
    .contents {
      .tree {
        max-height: 300px;
        overflow: scroll;
      }
    }
  }
  .buttomBar {
    list-style-type: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .infoName {
      width: 100%;
      margin: 0;
      padding: 5px 0;
      border: 1px solid #b3c0d1;
      border-top-style: none;
      border-right-style: solid;
      border-bottom-style: none;
      border-left-style: none;
      border-radius: 0;

      &:hover {
        background-color: #b3c0d1;
      }
      &.focus {
        border-bottom-style: solid;
        border-radius: 3px;
      }
    }
  }
}
</style>