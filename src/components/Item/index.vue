<template>
  <el-table
    :data="tableData"
    height="auto"
    style="width: 100%; padding: 0"
    :row-class-name="tableRowClassName"
    :border="true"
    :stripe="true"
    :highlight-current-row="true"
    @current-change="handleCurrentChange"
    @select="selectItem"
  >
    <el-table-column type="selection" width="55" row-key="hash">
    </el-table-column>
    <el-table-column
      v-for="(row, index) in tableRow"
      :key="index"
      :prop="row.prop"
      :label="row.label"
      :width="row.width"
      :show-overflow-tooltip="true"
      row-key="hash"
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
          label: "姓名",
          width: "360",
        },
        {
          prop: "state",
          label: "状态",
          width: "100",
        },
        {
          prop: "completion_on",
          label: "日期",
          width: "100",
        },
        {
          prop: "content_path",
          label: "地址",
          width: "180",
        },
        {
          prop: "magnet_uri",
          label: "链接",
          width: "280",
        },
        {
          prop: "save_path",
          label: "存储",
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
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
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
    getItem() {
      this.$store.dispatch("getItem");
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.$bus.$emit("getItemInfo", currentRow || oldCurrentRow);
    },
    selectItem(selection, row) {
      console.log(row);
      this.$store.dispatch("setSelection", selection);
    },
  },

  mounted() {
      this.getItem();

    setInterval(() => {
      this.getItem();
    }, 2000);
  },
  beforeUpdate() {},
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