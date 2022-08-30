<!--门户-->
<template>
  <div class="container">
    <div class="header">
      <p class="title">智慧水务统一应用整合平台</p>
    </div>
    <div>
      <div class="center">
        <div class="center_content">
          <p style="color: #00f9f0; font-size: 60px">金牛区</p>
          <!-- <p style="font-size: 32px">农业和水务局</p> -->
        </div>
        <div class="nav-container">
          <div
            id="nav"
            v-if="showNav"
            :class="subArr.length > 2 ? 'nav_6' : 'nav_1'"
            style="height: 100%; padding: 10px 10px"
          >
            <div class="nav-title">{{ navTitle }}</div>
            <div class="nav">
              <div class="navDiv" v-for="(subItem, i) in subArr" :key="i">
                <div
                  style="width: 72px; height: 66px; position: relative"
                  @click="navClick(subItem)"
    
                >
                  <img
                    :src="`../../../static/Portal/img/${subItem.icon}.png`"
                    style="position: absolute; bottom: 0"
                  />
                </div>
                <div style="font-size: 14px; height: 42px; line-height: 42px">
                  {{ subItem.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="out_circle">

      <!-- <div class="nav_circle r1" :style="{ animationPlayState: animationstate}" @click="openNav('智慧水务')"  @mouseover="pause" @mouseout="run">
        <img src="../../../static/Portal/img/智慧水务.png" />
        <div>智慧水务</div>
      </div>
      <div class="nav_circle r2" @click="openNav('智慧排水')" :style="{ animationPlayState: animationstate}" @mouseover="pause" @mouseout="run">
        <img src="../../../static/Portal/img/智慧排水.png" />
        <div>智慧排水</div>
      </div>
      <div class="nav_circle r3" @click="openNav('水利水保')" :style="{ animationPlayState: animationstate}" @mouseover="pause" @mouseout="run">
        <img src="../../../static/Portal/img/水利水保.png" />
        <div>水利水保</div>
      </div>
      <div class="nav_circle r4" @click="openNav('防汛减灾')" :style="{ animationPlayState: animationstate}" @mouseover="pause" @mouseout="run">
        <img src="../../../static/Portal/img/防汛减灾.png" />
        <div>防汛减灾</div>
      </div>
      <div class="nav_circle r5" @click="openNav('数据管理')" :style="{ animationPlayState: animationstate}" @mouseover="pause" @mouseout="run">
        <img src="../../../static/Portal/img/数据管理.png" />
        <div>数据管理</div>
      </div>
      <div class="nav_circle r6" @click="openNav('河长制')" :style="{ animationPlayState: animationstate}" @mouseover="pause" @mouseout="run">
        <img src="../../../static/Portal/img/河长制.png" />
        <div>河长制</div>
      </div>
      <div class="nav_circle r7" @click="openNav('态势感知')" :style="{ animationPlayState: animationstate}" @mouseover="pause" @mouseout="run">
        <img src="../../../static/Portal/img/态势感知.png" />
        <div>态势感知</div> 
      </div>-->
    </div> 
  </div>
</template>
<script>
export default {
  data() {
    return {
      subArr: [],
      showNav: false,
      navTitle: "",
      animationstate:'running'
    };
  },
  methods: {
    openNav(title) {
      this.navTitle = title;
      
      if (title == "智慧水务") {
        this.subArr = [];
        this.showNav=false;
        this.$router.push({ path: '/' });
      } else if (title == "智慧排水") {
        this.showNav = true;
        this.subArr = [
          {
            icon: "psh_icon",
            index: "/intelSupervision/realTimeMonitorMap",
            title: "排水户",
          },
          {
            icon: "ywbz_icon",
            index: "",
            title: "雨污泵站",
          },
          {
            icon: "yhpk_icon",
            index: "",
            title: "沿河排口",
          },
          {
            icon: "psyw_icon",
            index: "/drainageOperation/eventConfirm",
            title: "排水运维",
          },
          {
            icon: "jcgl_icon",
            index: "",
            title: "基础管理",
          },
          {
            icon: "xtgl_icon",
            index: "",
            title: "系统管理",
          },
        ];
      } else if (title == "河长制") {
        this.showNav = true;
        this.subArr = [
          {
            icon: "cdmz_icon",
            index: "",
            title: "成德眉资",
          },
        ];
      } else if (title == "水利水保") {
          this.showNav = true;
        this.subArr = [
          {
            icon: "slaq_icon",
            index: "",
            title: "水利安全",
          },
        ];
      } else if (title == "防汛减灾") {
          this.showNav = true;
        this.subArr = [
          {
            icon: "zwfx_icon",
            index: "",
            title: "政务防汛",
          },
          {
            icon: "hlfx_icon",
            index: "",
            title: "互联防汛",
          },
        ];
      } else if (title == "态势感知") {
          this.showNav = true;
        this.subArr = [
          {
            icon: "tsgz_icon",
            index: "",
            title: "态势感知",
          },
          {
            icon: "spjk_icon",
            index: "",
            title: "视频监控",
          },
        ];
      } else if (title == "数据管理") {
          this.showNav = true;
        this.subArr = [
          {
            icon: "sjzy_icon",
            index: "",
            title: "数据资源",
          },
          {
            icon: "sjgx_icon",
            index: "",
            title: "数据共享",
          },
        ];
      }
    },

    //跳转路由
    navClick(data) {
      this.$router.push({ path: data.index });
    },

    //暂停动画
    pause(){
        this.animationstate = 'paused';
    },

    //继续动画
    run(){
        if(this.showNav == false){
            this.animationstate = 'running';
        }
        
    }
  },
  created() {},
  mounted() { 

      //点击外部区域，菜单收起
      document.addEventListener("mouseup", (e) => {
        var nav = document.getElementById("nav");
        if (this.showNav) {
          if (!nav.contains(e.target)) {
            this.showNav = false;
            this.animationstate = 'running';
          }
        }
      });


  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background: url(~static/Portal/img/bg.png) no-repeat 0px -15px;
  background-size: 100%;
}
.header {
  width: 100%;
  height: 53px;
  background: url(~static/Portal/img/header.png) no-repeat;
  background-size: 100%;
  .title {
    text-align: center;
    line-height: 53px;
    font-size: 45px;
    font-family: Regular;
  }
}
.center {
  width: 549px;
  height: 518px;
  background: url(~static/Portal/img/center.png) no-repeat;
  background-size: 100%;
  position: absolute;
  top: 0;
  bottom: 175px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 10000;

  .center_content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-left: 8px;
  }
  .nav-container {
    height: 194px;
    width: 660px;
    position: absolute;
    bottom: -18%;
    display: flex;
    justify-content: center;
    align-items: center;
    left: -6%;
  }

  .nav-title {
    width: 64px;
    height: 16px;
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #22f3e2;
    line-height: 42px;
    height: 46px;
    padding-left: 20px;
  }

  .nav {
    display: flex;
    justify-content: center;
    background-size: 100%;
    //height: 100%;
    margin-left: -15px;
    //position: absolute;

    .navDiv {
      width: 100px;
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }

  .nav_6 {
    width: 660px;
    background: url(~static/Portal/img/nav_6.png) no-repeat;
  }
  .nav_1 {
    width: 270px;
    background: url(~static/Portal/img/nav_1.png) no-repeat;
  }
}

.out_circle {
  position: absolute;
  top: 36%;
  left: 11%;
}

.nav_circle {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  position: absolute;
  color: #fff;
  font-size: 22px;
  background: url(~static/Portal/img/2.png) no-repeat;
  background-size: 100%;
  div {
    position: absolute;
    bottom: 10%;
    left: 25%;
    width: 50%;
    text-align: center;
  }
}
.nav_circle img {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 18%;
  left: 39%;
}

@keyframes animX {
  0% {
    left: 0px;
  }
  100% {
    left: 1200px;
  }
}
@keyframes animY {
  0% {
    top: 0px;
  }
  100% {
    top: 350px;
  }
}
@keyframes scale {
  0% {
    transform: scale(0.6);
    opacity: 0.6;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.6);
    opacity: 0.6;
  }
}

.r1 {
  animation: animX 10s cubic-bezier(0.36, 0.2, 0.62, 0.9) -5s infinite alternate,
    animY 10s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate,
    scale 20s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate;
}

.r2 {
  animation: animX 10s cubic-bezier(0.36, 0, 0.64, 1) -7.45s infinite alternate,
    animY 10s cubic-bezier(0.36, 0, 0.64, 1) -2.45s infinite alternate,
    scale 20s cubic-bezier(0.36, 0, 0.64, 1) -2.45s infinite alternate;
}

.r3 {
  animation: animX 10s cubic-bezier(0.36, 0, 0.64, 1) -9.9s infinite alternate,
    animY 10s cubic-bezier(0.36, 0, 0.64, 1) -4.9s infinite alternate,
    scale 20s cubic-bezier(0.36, 0, 0.64, 1) -4.9s infinite alternate;
}

.r4 {
  animation: animX 10s cubic-bezier(0.36, 0, 0.64, 1) -12.35s infinite alternate,
    animY 10s cubic-bezier(0.36, 0, 0.64, 1) -7.35s infinite alternate,
    scale 20s cubic-bezier(0.36, 0, 0.64, 1) -7.35s infinite alternate;
}

.r5 {
  animation: animX 10s cubic-bezier(0.36, 0, 0.64, 1) -14.8s infinite alternate,
    animY 10s cubic-bezier(0.36, 0, 0.64, 1) -9.8s infinite alternate,
    scale 20s cubic-bezier(0.36, 0, 0.64, 1) -9.8s infinite alternate;
}

.r6 {
  animation: animX 10s cubic-bezier(0.36, 0, 0.64, 1) -17.25s infinite alternate,
    animY 10s cubic-bezier(0.36, 0, 0.64, 1) -12.25s infinite alternate,
    scale 20s cubic-bezier(0.36, 0, 0.64, 1) -12.25s infinite alternate;
}

.r7 {
  animation: animX 10s cubic-bezier(0.36, 0, 0.64, 1) -19.7s infinite alternate,
    animY 10s cubic-bezier(0.36, 0, 0.64, 1) -14.7s infinite alternate,
    scale 20s cubic-bezier(0.36, 0, 0.64, 1) -14.7s infinite alternate;
}

.r8 {
  animation: animX 10s cubic-bezier(0.36, 0, 0.64, 1) -22.15s infinite alternate,
    animY 10s cubic-bezier(0.36, 0, 0.64, 1) -17.15s infinite alternate,
    scale 20s cubic-bezier(0.36, 0, 0.64, 1) -17.15s infinite alternate;
}

.slide {
  width: 900px;
  height: 400px;
  border: 2px solid #999;
  border-radius: 50%;
  position: absolute;
  left: 50px;
  top: 100px;
}
</style>




