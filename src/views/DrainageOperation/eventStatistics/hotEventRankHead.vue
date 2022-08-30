<template>
    <div class="hot_event_rank">
        <ul class="hot_event_rank_head" v-show="checkNotNull(hotspotEventList)">
            <li>排名</li>
            <li>事件位置</li>
            <li>报警次数</li>
            <li>事件百分比</li>
        </ul>
        <ul v-show="checkNotNull(hotspotEventList)" 
          class="hot_event_rank_body" 
          v-for="(item,index) in hotspotEventList" 
          :key="item.pointCode"
        >
            <li>
              <span class="rank_num">
                {{index+1}}
              </span>
            </li>
            <li class="textOmit" :title="item['pointName']">{{item["pointName"]}}</li>
            <li>{{item["num"]}}</li>
            <li>
              <div class="event_percent">
                <div class="event_percent_content" :style="`width: ${item.per * 100}%`"></div>
              </div>
            </li>
        </ul>
        <no-data v-show="!checkNotNull(hotspotEventList)"></no-data>
    </div>
</template>

<script>
import { getHotspotEvent } from "@/api/drainageOperation";
import { awaitWrap, checkNotNull } from "@/lib";

export default {
  name: "hotEventRankHead",
  data() {
    return {
      hotspotEventList: []
    };
  },
  props: {
    formData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    formData: {
      deep: true,
      // immediate: true,
      handler(val) {
        this.renderHotspotEvent();
      }
    }
  },
  methods: {
    checkNotNull(val){
      return checkNotNull(val);
    },
    async renderHotspotEvent() {
      const _this = this;
      let hotspotEventData = (await awaitWrap(
        getHotspotEvent(_this.formData)
      ))[1];

      if (
        checkNotNull(hotspotEventData) &&
        checkNotNull(hotspotEventData["data"])
      ) {
        _this.hotspotEventList = hotspotEventData["data"];
      } else {
        _this.hotspotEventList = [];
      }
    }
  },
  mounted() {
    const _this = this;
    _this.$nextTick(() => {});
  }
};
</script>

<style lang="scss" scoped>
.hot_event_rank {
  font-size: 14px;
  color: #95dcfd;
  line-height: 42px;
  height: 42px;
  height: calc(100% - 40px);
  padding: 13px 30px;
  box-sizing: border-box;

  ul {
    display: flex;
    align-items: center;

    li {
      padding: 0 10px;
      box-sizing: border-box;

      &:nth-child(1) {
        width: 80px;
        text-align: center;
      }
      &:nth-child(2) {
        width: 25%;
      }
      &:nth-child(3) {
        width: 20%;
        text-align: right;
      }
      &:nth-child(4) {
        width: calc(55% - 80px);
      }
    }
  }

  .hot_event_rank_body {
    // 序号
    .rank_num {
      display: inline-block;
      vertical-align: middle;
      color: #fff;
      width: 18px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      background: #139cd2;
      border-radius: 4px 4px 4px 4px;
    }

    // 百分比
    .event_percent {
      height: 11px;
      background-color: #0d378b;
      border-radius: 8px 8px 8px 8px;
    }
    .event_percent_content {
      @extend .event_percent;
      background-color: #139cd2;
    }

    &:nth-child(2) {
      .event_percent_content,
      .rank_num {
        background-color: #ef7a27;
      }
    }

    &:nth-child(3) {
      .event_percent_content,
      .rank_num {
        background-color: #e0ba25;
      }
    }

    &:nth-child(4) {
      .event_percent_content,
      .rank_num {
        background-color: #13c159;
      }
    }
  }
}
</style>

