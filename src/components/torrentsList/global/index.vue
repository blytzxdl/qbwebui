<template>
  <div class="globalInfo col">
    <div class="infoBox speed" ref="speed"></div>
    <div class="infoBox" ref="categories"></div>
    <div class="infoBox" ref="tags"></div>
  </div>
</template>

<script>
  // 引入echarts
import * as echarts from "echarts/core";
import { LineChart, PieChart } from "echarts/charts";
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
  PieChart,
]);
// 
import renderSize from "@/utils/renderSize";
import { mapState } from "vuex";
export default {
  name: "Global",
  data() {
    return {
      speedChart: null,
      //速度图更新
      speedUpdate: setInterval(() => {
        this.speedChart.setOption({ dataset: { source: this.globalHistory } });
      }, 2000),
      categoriesChart: null,
      tagsChart: null,
    };
  },
  computed: {
    ...mapState( ["globalHistory", "categories", "tags"]),
    speedOption() {
      return {
        title: {
          text: "速度",
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
    categoriesOption() {
      return {
        title: {
          text: "分类",
          // subtext: "点击以筛选",
          textAlign: "left",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "horizontal",
          bottom: "0",
        },
        series: [
          {
            name: "categories",
            type: "pie",
            radius: "50%",
            data: this.categories,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
    },
    tagsOption() {
      return {
        title: {
          text: "标签",
          // subtext: "点击以筛选",
          textAlign: "left",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "horizontal",
          bottom: "0",
        },
        series: [
          {
            name: "tags",
            type: "pie",
            radius: "50%",
            data: this.tags,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
    },
  },
  methods: {
  },
  mounted() {
    this.speedChart = echarts.init(this.$refs.speed);
    this.categoriesChart = echarts.init(this.$refs.categories);
    this.tagsChart = echarts.init(this.$refs.tags);
    this.speedChart.setOption(this.speedOption);
    this.categoriesChart.setOption(this.categoriesOption);
    this.tagsChart.setOption(this.tagsOption);
  },
  beforeDestroy() {
    clearInterval(this.speedUpdate);
  },
};
</script>

<style lang="less" scoped>
.globalInfo {
  background-color: #fff;
  height: calc(100vh - 103px);
  .infoBox {
    height: 33%;
    margin: 10px 10px 0 10px;
    border: 1px solid black;
    &:last-child {
      margin: 10px;
    }
  }
}
</style>