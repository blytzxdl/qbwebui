<template>
  <div class="globalInfo col">
    <div class="infoBox speed" ref="speed"></div>
    <div class="infoBox" @click="set"></div>
    <div class="infoBox"></div>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  DataZoomComponent,
  LegendComponent,
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LineChart,
  DataZoomComponent,
  LegendComponent,
]);
import renderSize from "@/utils/renderSize";
import { mapState } from "vuex";
export default {
  name: "Global",
  data() {
    return {
      speedChart: null,
    };
  },
  computed: {
    ...mapState({
      globalHistory: (state) => state.data.globalHistory,
    }),
    option() {
      return {
        title: {
          text: "速度统计",
        },
        legend: {},
        grid: {
          left: "30",
          right: "10",
          bottom: "65",
          top: "30",
        },
        dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            xAxisIndex: [0],
            filterMode: "filter",
            start: 70,
            end: 100,
          },
        ],
        xAxis: {
          type: "time",
          axisLabel: {
            interval: 4,
            formatter: "{m}:{s}",
          },
        },
        yAxis: {
          type: "value",
          axisTick: {
            length: 12,
          },
          axisLabel: {
            formatter: (value, index) => {
              value = renderSize(value, "formatter");
              return value.size + value.unit;
            },
            align: "center",
          },
        },
        dataset: {
          sourceHeader: false,
          dimensions: [
            { name: "now", type: "time" },
            "dl_info_speed",
            "up_info_speed",
          ],
          source: this.globalHistory,
        },
        series: [
          {
            name: "下载",
            type: "line",
            encode: { x: "now", y: "dl_info_speed" },
            showSymbol: false,
          },
          {
            name: "上传",
            type: "line",
            encode: { x: "now", y: "up_info_speed" },
            showSymbol: false,
          },
        ],
      };
    },
  },
  methods: {
    set() {
      this.speedChart.setOption(this.option);
    },
  },
  mounted() {
    this.speedChart = echarts.init(this.$refs.speed);
    this.speedChart.setOption(this.option);
    let update = setInterval(() => {
      this.speedChart.setOption(this.option);
    }, 2000);
  },
};
</script>

<style lang="less" scoped>
.globalInfo {
  background-color: #fff;
  height: calc(100vh - 103px);
  .infoBox {
    height: 33%;
    margin: 10px;
    border: 1px solid black;
  }
}
</style>