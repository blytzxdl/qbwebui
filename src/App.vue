<template>
  <div>
    <router-view></router-view>
    <van-dialog
      v-model="confirmDelete"
      :showCancelButton="true"
      overlay-class="overlay"
        @confirm="deleteTorrent"
        @cancel="cancelDelete"
      ><div>确定删除{{ deleteName }}?</div>
      <van-checkbox
        v-model="deleteFiles"
        shape="square"
        class="checkDelete"
        >同时删除文件</van-checkbox
      >
    </van-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "App",
  data() {
    return {
      deleteFiles: false,
      confirmDelete: false,
    };
  },
  computed: {
    ...mapState({
      deleteName: (state) => state.item.deleteName,
    }),
  },
  methods: {
    deleteTorrent() {
      this.$store.dispatch("deleteTorrent", this.deleteFiles);
    },
    cancelDelete() {
      this.confirmDelete=false
    },
  },
  mounted() {
    this.$bus.$on("queryDelete", () => {
      this.confirmDelete = true;
    });
  },
};
</script>

<style lang='less'>
* {
  margin: 0;
  padding: 0;
}
html {
  font-size: 5.3333vw;
}
.row {
  display: flex;
}
.col {
  display: flex;
  flex-direction: column;
}
.van-dialog {
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  border-radius: 0;
  width: 600px;
  height: 400px;
  .van-dialog__content {
    flex-grow: 4;
    font-size: 36px;
    line-height: 1.5;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    text-align: center;
    .checkDelete {
      height: 40px;
      .van-checkbox__icon {
        font-size: inherit;
      }
    }
  }
  .van-dialog__footer {
    flex-grow: 1;
    align-items: center;
    border-top: 1px solid black;
    button {
      height: 100%;
      font-size: 36px;
      &:nth-child(1) {
        border-right: 1px solid black;
      }
    }
  }
}
.overlay {
  background-color: rgba(255, 255, 255, 0.5);
}
/* ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  overflow-x: hidden;
}
::-webkit-scrollbar-thumb {
  background-color: #eaecf1;
  border-radius: 3px;
} */
</style>
