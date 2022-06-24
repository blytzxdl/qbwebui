<template>
  <el-table
    :data="tableData"
    height="auto"
    style="width: 100%; padding: 0"
    :row-class-name="tableRowClassName"
    :border="true"
    :stripe="true"
    :highlight-current-row="true"
    :row-key="(row) => row.hash"
    @current-change="handleCurrentChange"
    @select="selectItem"
    @select-all='selectItem'
    ref="itemTable"
  >
    <el-table-column type="selection" width="35" :reserve-selection="true">
    </el-table-column>
    <el-table-column
      v-for="(row, index) in tableRow"
      :key="row.hash"
      :prop="row.prop"
      :label="row.label"
      :width="row.width"
      :show-overflow-tooltip="true"
    ></el-table-column>
  </el-table>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Item",
  data() {
    return {
      tableRow: [
        {
          prop: "name",
          label: "名称",
          width: "360",
        },
        {
          prop: "state",
          label: "状态",
          width: "100",
        },
        {
          prop: "completion_on",
          label: "完成日期",
          width: "100",
        },
        {
          prop: "content_path",
          label: "内容地址",
          width: "180",
        },
        {
          prop: "magnet_uri",
          label: "链接",
          width: "280",
        },
        {
          prop: "save_path",
          label: "存储路径",
          width: "280",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      tableData: (state) => state.item.itemInfo,
    }),
  },
  methods: {
    // toggleSelection(rows) {
    //   if (rows) {
    //     rows.forEach((row) => {
    //       this.$refs.multipleTable.toggleRowSelection(row);
    //     });
    //   } else {
    //     this.$refs.multipleTable.clearSelection();
    //   }
    // },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.$bus.$emit("getItemInfo", currentRow || oldCurrentRow);
    },
    selectItem(selection, row) {
      this.$store.dispatch("setSelection", selection);
    },
    getRowKey(row) {
      return row.hash;
    },
    getData() {},
    mainActive(){
      this.mainTimer = setInterval(() => {
      this.$store.dispatch("getMaindata");
    }, 2000);
    },
    clearMain() {
      clearInterval(this.mainTimer);
    },
  },
  mounted() {
    this.$store.dispatch("getMaindata");
    this.mainActive()
    this.$bus.$on('clearMain',()=>{this.clearMain()})
    this.$bus.$on('reMain',()=>{this.mainActive()})
    this.$bus.$on("clearSelection", () => {
      this.$refs.itemTable.clearSelection();
    });
  },
};
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>