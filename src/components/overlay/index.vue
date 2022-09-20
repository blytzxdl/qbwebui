<template>
    <div class="base col center">
      <div class="container col">
        <div class="content">
            <slot></slot>
        </div>
        <div class="switch row center">
          <div class="cancel center" v-if="cancelBtn" @click="cancel()">
            取消
          </div>
          <div class="split" v-if="cancelBtn && confirmBtn"></div>
          <div class="confirm center" v-if="confirmBtn" @click="confirm()">
            确认
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props: [ "showCancel", "showConfirm",'onCancel','onConfirm'],
  data() {
    return {
    };
  },
  computed: {
    cancelBtn() {
      if (this.showCancel === false) {
        return false;
      } else {
        return true;
      }
    },
    confirmBtn() {
      if (this.showConfirm === false) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    cancel() {
        console.log('can');
        if (this.onCancel) {
            this.onCancel()
        }
    },
    confirm() {
        console.log('con');
        if (this.onConfirm) {
            this.onConfirm()
        }
    },
  },
};
</script>

<style lang="less" scoped>
.base {
  width: 100%;
  height: 100%;
  .container {
    width: 700px;
    min-height: 300px;
    background-color: #fff;
    border-radius: 12px;
    .content {
      flex-grow: 1;
      border-radius: 12px 12px 0 0;
    }
    .switch {
      border-top: 1px solid #d8d8d8;
      .cancel,
      .confirm {
        display: flex;
        height: 100px;
        flex-grow: 1;
      }
      .split {
        width: 1px;
        height: 80px;
        background-color: #d8d8d8;
      }
    }
  }
}
</style>