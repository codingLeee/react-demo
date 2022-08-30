<template>
    <div class="base_info_contatiner">
        <div class="base_info_left">
            <div class="panel_title_second_level">{{title}}</div>
            <div class="base_info_total">{{String(total).replace(/(\d)(?=(\d{3})+$)/g, "$1,")}}</div>
        </div>
        <div class="base_info_right" :style="'width:'+rightWidth+'%'">
            <div class="base_info_right_content">
                <div class="base_info_right_title">{{firstTitle}}</div>
                <div class="base_info_progress_content">
                    <div class="base_info_progress"><div :style="'width:'+((firstNum/firstTotal)*100)+'%'"></div></div>
                    <div class="base_info_num">{{firstNum}}/{{firstTotal}}</div>
                </div>
            </div>
            <div class="base_info_right_content">
                <div class="base_info_right_title">{{secondTitle}}</div>
                <div class="base_info_progress_content">
                    <div class="base_info_progress"><div :style="'width:'+((secondNum/secondTotal)*100)+'%'"></div></div>
                    <div class="base_info_num">{{secondNum}}/{{secondTotal}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "BaseInfoContatiner",
  props: {
    title: {
      default: "排水户",
      required: true,
      type: String
    },
    total: {
      default: 0,
      required: true,
      type: Number
    },
    rightWidth: {
      default: 0,
      required: true,
      type: Number
    },
    firstTitle: {
      default: "重点/住宅类",
      required: true,
      type: String
    },
    firstNum: {
      default: 0,
      required: true,
      type: Number
    },
    firstTotal: {
      default: 0,
      required: true,
      type: Number
    },
    secondTitle: {
      default: "商铺/非住宅",
      required: true,
      type: String
    },
    secondNum: {
      default: 0,
      required: true,
      type: Number
    },
    secondTotal: {
      default: 0,
      required: true,
      type: Number
    }
  }
};
</script>


<style lang="scss" scoped>
.base_info_contatiner {
  display: flex;
  justify-content: space-between;
  color: #fff;

  .panel_title_second_level {
    flex: 1;
  }

  .base_info_total {
    font-family: GothicThirteenStd;
    font-size: 55px;
    line-height: 67px;
  }

  .base_info_right {
    padding-top: 15px;

    .base_info_right_content {
      margin-top: 5px;
      font-size: 15px;

      .base_info_right_title {
        line-height: 13px;
        color: #d3d9d9;
      }
      .base_info_progress_content {
        display: flex;
        align-items: center;
        line-height: 23px;

        .base_info_progress {
          width: 100%;
          height: 5px;
          background-color: rgba(255, 255, 255, 0.2);
          margin-right: 3px;

          > div {
            height: 100%;
          }
        }
      }

      &:nth-child(1) {
        .base_info_progress {
          > div {
            background-color: #45c6cb;
          }
        }
      }

      &:nth-child(2) {
        .base_info_progress {
          > div {
            background-color: #01f7b4;
          }
        }
      }
    }
  }
}
</style>
