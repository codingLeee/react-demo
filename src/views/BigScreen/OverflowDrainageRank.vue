<!--冒溢排水户统计排名(当月）-->
<template>
    <div class="overflow_drainage_rank toggle_content toggle_right_4">
        <el-carousel :interval="5000">
            <el-carousel-item>
                <div class="panel_title">冒溢排水户统计排名(当月）</div>
                <ul class="overflow_drainage_rank_content">
                    <li v-for="(item,index) in rankList1" :key="index">
                        <div class="rank_title">{{item.name}}</div>
                        <div class="rank_content">
                            <div class="rank_progress"><div :style="'width:'+(((item.val)/rankTotal1)*100)+'%'"></div></div>
                            <div class="rank_num">{{item.val}}</div>
                        </div>
                    </li>
                </ul>
            </el-carousel-item>
            <el-carousel-item>
                <div class="panel_title">雨污混排排水户排名(当月）</div>
                <ul class="overflow_drainage_rank_content">
                    <li v-for="(item,index) in rankList2" :key="index">
                        <div class="rank_title">{{item.name}}</div>
                        <div class="rank_content">
                            <div class="rank_progress"><div :style="'width:'+(((item.val)/rankTotal2)*100)+'%'"></div></div>
                            <div class="rank_num">{{item.val}}</div>
                        </div>
                    </li>
                </ul>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
export default {
  name: "OverflowDrainageRank",
  data() {
    return {
      rankList1: [
        {
          val: 34562,
          name: "营策巷25号"
        },
        {
          val: 24500,
          name: "晓晴巷66号"
        },
        {
          val: 14400,
          name: "鹿角巷162号"
        },
        {
          val: 3500,
          name: "营策巷80号"
        },
        {
          val: 2500,
          name: "东四巷93号"
        }
      ],
      rankList2: [
        {
          val: 34562,
          name: "营策巷25号"
        },
        {
          val: 24500,
          name: "晓晴巷66号"
        },
        {
          val: 14400,
          name: "鹿角巷162号"
        },
        {
          val: 3500,
          name: "营策巷80号"
        },
        {
          val: 2500,
          name: "东四巷93号"
        }
      ],
      rankTotal1: 0,
      rankTotal2: 0
    };
  },
  mounted() {
    this.rankList1.forEach(m => {
      this.rankTotal1 = this.rankTotal1 + m["val"];
    });
    this.rankList2.forEach(m => {
      this.rankTotal2 = this.rankTotal2 + m["val"];
    });
  }
};
</script>

<style lang="scss" scoped>
.overflow_drainage_rank {
  height: 36.17%;

  /deep/ .el-carousel {
    height: 95%;

    .el-carousel__container {
      height: 100%;
    }

    .el-carousel__indicator {
      &.is-active {
        button {
          background: #009be4;
        }
      }
      button {
        height: 3px;
        background: #009be4;
        width: 14px;
      }
    }
  }

  .overflow_drainage_rank_content {
    li {
      margin-top: 12px;

      &:nth-child(3),
      &:nth-child(4) {
        .rank_progress {
          > div {
            background: #45c6cb;
          }
        }
      }

      &:nth-child(5) {
        .rank_progress {
          > div {
            background: #fff;
          }
        }
      }
    }

    .rank_title {
      font-size: 14px;
      color: #d6e9f2;
      line-height: 12px;
    }

    .rank_content {
      display: flex;
      align-items: center;
      line-height: 23px;
      font-size: 18px;

      .rank_progress {
        width: 100%;
        height: 5px;
        margin-right: 5px;

        > div {
          height: 100%;
          background: #01f792;
        }
      }
    }
  }
}
</style>
