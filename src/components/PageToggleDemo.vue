<template>
    <div class="PageToggleDemo">
        <div :class="['left', {'showB' : toggleFlag, 'showA' : !toggleFlag}]" @mouseover="stopToggle" @mouseleave="startToggle">
            <div class="float_div left_1">1</div>
            <div class="float_div_a">
              <div class="float_div left_2">2</div>
              <div class="float_div left_3">3</div>
            </div>
            <div class="float_div left_4">4</div>
            <div class="float_div left_5">5</div>
            <div class="float_div left_6">6</div>
            <div class="float_div left_7">7</div>
        </div>
        <div :class="['right', {'showB' : toggleFlag, 'showA' : !toggleFlag}]" @mouseover="stopToggle" @mouseleave="startToggle">
            <div class="float_div right_1">1</div>
            <div class="float_div right_2">2</div>
            <div class="float_div right_3">3</div>
            <div class="float_div right_4">4</div>
            <div class="float_div right_5">5</div>
            <div class="float_div right_6">6</div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      toggleFlag: true
    };
  },
  methods: {
    stopToggle() {
      // 停止切换
      console.log("停止切换");
      clearInterval(this.togglePageTimer);
    },
    startToggle() {
      const _this = this;
      console.log("开始切换");
      _this.togglePageTimer = setInterval(() => {
        _this.toggleFlag = !_this.toggleFlag;
      }, 8000);
    }
  },
  mounted() {
    this.startToggle();
  }
};
</script>


<style lang="scss" scoped>
.PageToggleDemo {
  position: relative;
  width: 100%;
  height: 100%;

  .left,
  .right {
    width: 20%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    display: flex;
    text-align: center;
    font-size: 30px;
    color: #fff;
  }

  .left {
    left: 0;
    top: 0;
    flex-direction: column;
    flex-wrap: wrap-reverse;

    .float_div {
      width: 100%;
      box-sizing: border-box;
      border: 10px solid #fff;
      background-color: red;
      position: relative;
    }

    .left_1 {
      height: 20%;
    }

    .float_div_a {
      height: 60%;

      .left_2,
      .left_3 {
        height: 50%;
      }
    }

    .left_4 {
      height: 20%;
    }

    .left_5 {
      height: 40%;
      background-color: green;
    }

    .left_6 {
      height: 30%;
      background-color: green;
    }

    .left_7 {
      height: 30%;
      background-color: green;
    }
  }

  .right {
    top: 0;
    right: 0;
    flex-direction: column;
    flex-wrap: wrap;

    > div {
      width: 100%;
      box-sizing: border-box;
      border: 10px solid #fff;
      background-color: green;
      position: relative;
    }

    .right_4 {
      height: 20%;
      background-color: red;
    }

    .right_5 {
      height: 40%;
      background-color: red;
    }

    .right_6 {
      height: 40%;
      background-color: red;
    }

    .right_1 {
      height: 40%;
    }

    .right_2 {
      height: 30%;
    }

    .right_3 {
      height: 30%;
    }
  }

  // 隐藏A面 显示B面 动画
  .showB {
    .left_1 {
      animation: showBanimatBA 2s linear;
      animation-fill-mode: forwards;
    }

    .left_2 {
      animation: showBanimatBA 2s linear 0.7s;
      animation-fill-mode: forwards;
    }

    .left_3 {
      animation: showBanimatBA 2s linear 1.4s;
      animation-fill-mode: forwards;
    }

    .left_4 {
      animation: showBanimatBA 2s linear 2s;
      animation-fill-mode: forwards;
    }

    @keyframes showBanimatBA {
      from {
        left: 0%;
        opacity: 1;
      }

      to {
        left: -100%;
        opacity: 0;
      }
    }

    .left_5 {
      animation: showBanimatBB 2s linear 0.7s;
      animation-fill-mode: forwards;
    }

    .left_6 {
      animation: showBanimatBB 2s linear 1.4s;
      animation-fill-mode: forwards;
    }

    .left_7 {
      animation: showBanimatBB 2s linear 2s;
      animation-fill-mode: forwards;
    }

    @keyframes showBanimatBB {
      from {
        left: 0%;
        opacity: 0;
      }

      to {
        left: 100%;
        opacity: 1;
      }
    }

    .right_1 {
      animation: showRightBanimatBA 2s linear;
      animation-fill-mode: forwards;
    }

    .right_2 {
      animation: showRightBanimatBA 2s linear 1s;
      animation-fill-mode: forwards;
    }

    .right_3 {
      animation: showRightBanimatBA 2s linear 2s;
      animation-fill-mode: forwards;
    }

    @keyframes showRightBanimatBA {
      from {
        right: 0%;
        opacity: 1;
      }

      to {
        right: -100%;
        opacity: 0;
      }
    }

    .right_4 {
      animation: showRightBanimatBB 2s linear 0.7s;
      animation-fill-mode: forwards;
    }

    .right_5 {
      animation: showRightBanimatBB 2s linear 1.4s;
      animation-fill-mode: forwards;
    }

    .right_6 {
      animation: showRightBanimatBB 2s linear 2s;
      animation-fill-mode: forwards;
    }

    @keyframes showRightBanimatBB {
      from {
        right: 0%;
        opacity: 0;
      }

      to {
        right: 100%;
        opacity: 1;
      }
    }
  }

  // 隐藏B面 显示A面 动画
  .showA {
    .left_1 {
      left: -100%;
      opacity: 0;
      animation: showBanimatAA 2s linear 0.5s;
      animation-fill-mode: forwards;
    }

    .left_2 {
      left: -100%;
      opacity: 0;
      animation: showBanimatAA 2s linear 1s;
      animation-fill-mode: forwards;
    }

    .left_3 {
      left: -100%;
      opacity: 0;
      animation: showBanimatAA 2s linear 1.5s;
      animation-fill-mode: forwards;
    }

    .left_4 {
      left: -100%;
      opacity: 0;
      animation: showBanimatAA 2s linear 2s;
      animation-fill-mode: forwards;
    }

    @keyframes showBanimatAA {
      from {
        left: -100%;
        opacity: 0;
      }

      to {
        left: 0%;
        opacity: 1;
      }
    }

    .left_5 {
      left: 100%;
      opacity: 1;
      animation: showBanimatAB 2s linear;
      animation-fill-mode: forwards;
    }

    .left_6 {
      left: 100%;
      opacity: 1;
      animation: showBanimatAB 2s linear 1s;
      animation-fill-mode: forwards;
    }

    .left_7 {
      left: 100%;
      opacity: 1;
      animation: showBanimatAB 2s linear 2s;
      animation-fill-mode: forwards;
    }

    @keyframes showBanimatAB {
      from {
        left: 100%;
        opacity: 1;
      }

      to {
        left: 0%;
        opacity: 0;
      }
    }

    .right_1 {
      right: -100%;
      opacity: 0;
      animation: showRightBanimatAA 2s linear 0.7s;
      animation-fill-mode: forwards;
    }

    .right_2 {
      right: -100%;
      opacity: 0;
      animation: showRightBanimatAA 2s linear 1.4s;
      animation-fill-mode: forwards;
    }

    .right_3 {
      right: -100%;
      opacity: 0;
      animation: showRightBanimatAA 2s linear 2s;
      animation-fill-mode: forwards;
    }

    @keyframes showRightBanimatAA {
      from {
        right: -100%;
        opacity: 0;
      }

      to {
        right: 0%;
        opacity: 1;
      }
    }

    .right_4 {
      right: 100%;
      opacity: 1;
      animation: showRightBanimatAB 2s linear;
      animation-fill-mode: forwards;
    }

    .right_5 {
      right: 100%;
      opacity: 1;
      animation: showRightBanimatAB 2s linear 1s;
      animation-fill-mode: forwards;
    }

    .right_6 {
      right: 100%;
      opacity: 1;
      animation: showRightBanimatAB 2s linear 2s;
      animation-fill-mode: forwards;
    }

    @keyframes showRightBanimatAB {
      from {
        right: 100%;
        opacity: 1;
      }

      to {
        right: 0%;
        opacity: 0;
      }
    }
  }
}
</style>
