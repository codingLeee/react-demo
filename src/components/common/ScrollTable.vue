<template>
    <section class="scrollList">
        <div class="scrollList_tit_content">
            <ul class="scrollList_tit">
                <li v-if="isNumber">序号</li>
                <li :style="`width:${tableWidth}`" v-for="item in columnData" :key="item.field">{{ item.name }}</li>
            </ul>
        </div>
        
        <section ref="scrollList" id="scrollList_body" class="scrollList_body" @mouseover="removeRoll(true)" @mouseout="setRoll(true)">
            <ul ref="initialUl" id="scrollList_content" class="scrollList_content">
                <template v-if="listData.length == 0">
                    <li class="scrollList_content_tr">
                        <div class="scrollList_content_td" style="width:100%;">暂无相关数据</div>
                    </li>
                </template>
                <template v-else>
                    <li v-for="(item,i) in listData" :key="i" class="scrollList_content_tr" @click="rowClick(item)">
                        <div v-if="isNumber" class="scrollList_content_td"><span>{{i+1}}</span></div>
                        <div v-for="item2 in columnData" :key="item2.field+'_td'" :style="`width:${tableWidth}`" class="scrollList_content_td textOmit">
                            <template v-if="item2.scroll">
                                <p class="overproofMessage">
                                    <span class="scroll_start">{{item[item2.field]}}</span>
                                    <span class="scroll_end"></span>
                                </p>
                            </template>
                            <span v-else :title="item[item2.field]">
                                <template v-if="item2.field == 'pollutionLevel'">
                                    {{item[item2.field] | pollutionLevel}}
                                </template>
                                <template v-else>
                                    {{item[item2.field]}}
                                </template>
                            </span>
                        </div>
                    </li>
                </template>
            </ul>
            <ul ref="copyUl" id="scrollList_content_copy" class="scrollList_content"></ul>
        </section>
    </section>
</template>

<script>
import { checkNotNull } from "@/lib";

export default {
  name: "scrollList",
  data() {
    return {
      timer: {},
      copyUl: {},
      scrollList: {},
      initialUl: {},
      scrollTimer: [],
      overproofMessage: [],
      scrollStart: [],
      scrollEnd: []
    };
  },
  props: {
    columnData: {
      default: () => [
        {
          name: "名称",
          code: ""
        }
      ],
      required: true,
      type: Array
    },
    listData: {
      default: () => [],
      required: true,
      type: Array
    },
    height: {
      default: "100%",
      type: String
    },
    isNumber: {
      default: false,
      type: Boolean
    }
  },
  watch: {
    listData() {
      var $this = this;
      $this.$nextTick(function() {
        $this.removeRoll(false);
        $this.setRoll(true);
        $this.removeRollX();
        $this.setRollX();
      });
    }
  },
  computed: {
    tableWidth() {
      if (this.isNumber) {
        return 100 / (this.columnData.length + 1) + "%";
      } else {
        return 100 / this.columnData.length + "%";
      }
    }
  },
  methods: {
    rowClick(data) {
      this.$emit("rowClick", data);
    },
    rollStart() {
      var $this = this;
      if ($this.initialUl.clientHeight > $this.scrollList.clientHeight) {
        $this.copyUl.innerHTML = $this.initialUl.innerHTML;
        // 这里有个行点击问题
        // console.log($this.copyUl.querySelector("li").onclick=)
        if ($this.scrollList.scrollTop >= $this.initialUl.scrollHeight) {
          $this.scrollList.scrollTop = 0;
        } else {
          $this.scrollList.scrollTop++;
        }
      } else {
        $this.copyUl.innerHTML = "";
      }
    },
    removeRoll(flag) {
      clearInterval(this.timer);
      if (flag) {
        this.setScrollBodyStyle("auto");
      }
    },
    removeRollX() {
      for (var i = 0; i < this.scrollTimer.length; i++) {
        clearInterval(this.scrollTimer[i]);
      }
    },
    setScrollBodyStyle(code) {
      if (checkNotNull(this.scrollList)) {
        this.scrollList.style.overflow = code; //"hidden"; // auto
      }
    },
    setRoll(flag) {
      var $this = this;
      $this.timer = setInterval($this.rollStart, 100);

      if (flag) {
        $this.setScrollBodyStyle("hidden");
      }
    },
    setRollX() {
      var $this = this;
      // 污染物左右滚动
      $this.scrollStart = document.getElementsByClassName("scroll_start");
      $this.overproofMessage = document.getElementsByClassName(
        "overproofMessage"
      );
      $this.scrollEnd = document.getElementsByClassName("scroll_end");

      for (var i = 0; i < $this.overproofMessage.length; i++) {
        (function(m) {
          checkNotNull($this.scrollTimer[m])
            ? clearInterval($this.scrollTimer[m])
            : "";
          $this.overproofMessage[m].scrollLeft = 0;
          $this.scrollTimer[m] = setInterval(function() {
            $this.leftRollStart(m);
          }, 100);
        })(i);
      }
    },
    leftRollStart(num) {
      var $this = this;
      var newScrollStart = checkNotNull($this.scrollStart[num])
        ? $this.scrollStart[num].clientWidth
        : 0;
      var nrewOverproofMessage = checkNotNull($this.overproofMessage[num])
        ? $this.overproofMessage[num].clientWidth
        : 0;
      if (newScrollStart > nrewOverproofMessage) {
        $this.scrollEnd[num].innerHTML = $this.scrollStart[num].innerHTML;
        if (
          $this.overproofMessage[num].scrollLeft >=
          $this.scrollStart[num].scrollWidth
        ) {
          $this.overproofMessage[num].scrollLeft = 0;
        } else {
          $this.overproofMessage[num].scrollLeft++;
        }
      } else {
        if (checkNotNull($this.scrollEnd[num])) {
          $this.scrollEnd[num].innerHTML = "";
        }
      }
    }
  },
  mounted() {
    var $this = this;
    this.$nextTick().then(function() {
      $this.initialUl = $this.$refs.initialUl;
      $this.scrollList = $this.$refs.scrollList;
      $this.copyUl = $this.$refs.copyUl;

      $this.scrollList.scrollTop = 0;

      // list上下滚动
      //document.getElementById('scrollList_body')

      // clearInterval($this.timer);
      // $this.scrollList.scrollTop = 0;
      // $this.timer = setInterval($this.rollStart, 100);
      // $this.setRollX()
    });
  },
  beforeDestroy() {
    if (this.timer) {
      this.removeRoll();
    }
    if (this.scrollTimer) {
      this.removeRollX();
    }
  }
};
</script>

<style lang="scss" scoped>
.scrollList {
  height: 100%;
}

.scrollList_tit_content {
  background-color: rgba(11, 43, 71, 0.8);

  .scrollList_tit {
    display: flex;
    li {
      padding: 10px;
      font-size: 14px;
      color: #d3d9d9;
    }
  }
}

.scrollList_body {
  height: calc(100% - 40px);
  overflow: hidden;

  .scrollList_content_tr {
    display: flex;

    .scrollList_content_td {
      padding: 10px;

      font-size: 14px;
      color: #d3d9d9;
    }

    &:nth-child(2n) {
      background-color: rgba(11, 43, 71, 0.8);
    }
  }
}

.overproofMessage {
  color: #ed4014;
  white-space: nowrap;
  overflow: hidden;

  span {
    display: inline-block;
  }
}
</style>
