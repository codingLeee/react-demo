<!--门户-->
<template>
  <div class="container">
    <div class="header">
      <p class="title">智慧水务统一应用整合平台</p>
    </div>
    <div>
      <div class="center">
        <div class="center_content">
          <p style="color: #00f9f0; font-size: 60px;user-select: none">金牛区</p>
          <!-- <p style="font-size: 32px">农业和水务局</p> -->
        </div>
        <div class="nav-container" v-if="subArr.length > 0">
            <div
              id="nav"
              v-if="showNav"
              :class="subArr.length > 2 ? 'nav_6' : 'nav_1'"
              style=" height: 100%; padding: 10px 10px"
            >
              <div class="nav-title" style="user-select: none">{{ navTitle }}</div>
              <div class="nav">
                <div class="navDiv" style="cursor: pointer" v-for="subItem in subArr" :key="subItem.icon" > 
                  <div style="width: 72px;height: 66px;position: relative;" @click="navClick(subItem)">
                      <img :src="`../../../static/Portal/img/${subItem.icon}_icon.png`"  style="position: absolute;bottom: 0;"/>
                  </div>
                  <div style="font-size: 14px;height: 42px;line-height: 42px;user-select: none">{{ subItem.title }}</div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
    <div class="out_circle">
      <div 
        :ref="'r'+(index+1)"
        v-for="(item,index) in navList" 
        :class="['nav_circle','r'+(index+1)]" 
        :style="{ animationPlayState: animationstate}"
        :key="item.icon" 
        @click="openNav(item,'r'+(index+1))"
        @mouseover="pause" 
        @mouseout="run"
      >
        <img :src="`../../../static/Portal/img/${item.icon}_icon.png`" />
        <div style="user-select: none">{{item["title"]}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { checkNotNull } from "@/lib";
export default {
  data() {
    let locationHostname = location.hostname == "10.1.227.235" ? "10.1.227.235" : "171.221.172.25";
    return {
      subArr: [],
      showNav: false,
      navTitle: "",
      navList: [
        {
          title: "智慧水务",
          router: "BigScreenContainer",
          icon: "BigScreenContainer",
          // url: "http://"+locationHostname+":19320/bigscreen"
          children: [
            {
              title: "一张图",
              router: "",
              icon: "yzt2",
              url: "http://"+locationHostname+":19320/bigscreen"
            },
            {
              title: "展示平台",
              router: "",
              icon: "zspt2",
              url:"http://10.1.213.207:8080/#/"
            }
          ]
        },
        {
          title: "智慧排水",
          router: "zhps",
          icon: "zhps",
          children: [
            {
              title: "排水户",
              router: "intelSupervision",
              icon: "intelSupervision"
            },
            {
              title: "排水运维",
              router: "drainageOperation",
              icon: "drainageOperation"
            },
            {
              title: "沿河排口",
              router: "alongRiverOutlet",
              icon: "yhpk"
            }
          ]
        },
        {
          title: "防汛减灾",
          router: "fxjz",
          icon: "fxjz",
          children: [
            {
              title: "内涝预警",
              icon: "slaq",
              router: "floodControl",
              url: ""
            },
            {
              title: "政务防汛",
              icon: "zwfx",
              router: "",
              url: "http://10.1.228.132:9993"
            },
            {
              title: "互联防汛",
              router: "",
              icon: "hlfx",
              url: "http://221.237.107.122:29022/login"
            }
          ]
        },
        {
          title: "数据管理",
          router: "sjgl",
          icon: "sjgl",
          children: [
            {
              title: "数据中心",
              router: "",
              icon: "zhsj",
              url: "http://"+locationHostname+":19320/dataCenter"
            }
          ]
        },
        {
          title: "河长制",
          router: "hzz",
          icon: "hzz",
          children: [
            {
              title: "成德眉资",
              icon: "cdmz",
              router: "",
              url: "http://www.cdhzz.net/#/home"
            }
          ]
        },
        {
          title: "态势感知",
          router: "stgz",
          icon: "stgz",
          children: [
            {
              title: "基础管理",
              router: "",
              icon: "jcgl",
              url: "http://"+locationHostname+":19320/baseInfo"
            }
            // {
            //   title: "系统管理",
            //   router: "",
            //   icon: "xtgl",
            //   url: "http://"+locationHostname+":19320/system"
            // }
          ]
        },
        {
          title: "水利水保",
          router: "slsb",
          icon: "slsb",
          children: [
            {
              title: "水利安全",
              router: "",
              icon: "slaq",
              url:
                "http://jdiasp.mwr.cn/cas/login?service=http%3A%2F%2Fjdyw.mwr.cn%2Fpprty%2Flogin.do"
            }
          ]
        }
      ],
      subNavData: [],
      animationstate: "running"
    };
  },
  // computed: {
  //   ...mapState({
  //     menus: state => state.addRouter.menus
  //   })
  // },
  methods: {
    openNav(navData, className) {
      this.navTitle = navData["title"];
      this.subNavData = navData;
      this.subArr = navData["children"] || [];
      if (!checkNotNull(navData["children"])) {
        if (checkNotNull(navData.router)) {
          this.$router.push({ name: navData.router });
        } else if (checkNotNull(navData.url)) {
          window.open(navData.url,"_blank"); 
        }
      } else {
        this.showNav = true;
      }

      console.log(this.$refs[className][0].style)
    },
    //跳转路由
    navClick(data) {
      if (checkNotNull( data.router)) {
        this.$router.push({ name: data.router });
      } else if (checkNotNull(data.url)) {
        window.open(data.url,"_blank"); 
      }
    },
    cancelNavs(e) {
      var nav = document.getElementById("nav");
      if (this.showNav) {
        if (!nav.contains(e.target)) {
          this.showNav = false;
          this.animationstate = "running";
        }
      }
    },
    pause() {
      this.animationstate = "paused";
    },
    run() {
      if (this.showNav == false) {
        this.animationstate = "running";
      }
    }
  },
  created() {},
  mounted() {
    //点击外部区域，菜单收起
    document.addEventListener("mouseup", this.cancelNavs);
  },
  destroyed() {
    document.removeEventListener("mouseup", this.cancelNavs);
  }
};
</script>
<style lang="scss" scoped>
.container {
  color: #fff;
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
/*.nav_circle .img {
  background: url(~static/Portal/img/1.png) no-repeat;
  background-size: 100%;
  width: 226px;
  height: 263px;
  position: relative;
  img {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 0px;
    bottom: 54%;
    left: 0;
    right: 0;
    margin: auto;
  }
  a {
    position: absolute;
    bottom: 27%;
    left: 0;
    right: 0;
    margin: auto;
    display: block;
    height: 21px;
    line-height: 21px;
    font-size: 22px;
    text-align: center;
    text-decoration: none;
  }
}*/
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
  cursor: pointer;
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
/*.nav_circle:hover~.r1,.r2,.r3,.r4,.r5,.r6,.r7{
    animation-play-state: paused; 
}*/
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
  animation: animX 10s cubic-bezier(0.36, 0, 0.64, 1) -5s infinite alternate,
    animY 10s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate,
    scale 20s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate;
}

.r2 {
  animation: animX 10s cubic-bezier(0.36, 0, 0.64, 1) -7.857s infinite alternate,
    animY 10s cubic-bezier(0.36, 0, 0.64, 1) -2.857s infinite alternate,
    scale 20s cubic-bezier(0.36, 0, 0.64, 1) -2.857s infinite alternate;
}

.r3 {
  animation: animX 10s cubic-bezier(0.36, 0, 0.64, 1) -10.714s infinite alternate,
    animY 10s cubic-bezier(0.36, 0, 0.64, 1) -5.714s infinite alternate,
    scale 20s cubic-bezier(0.36, 0, 0.64, 1) -5.714s infinite alternate;
}

.r4 {
  animation: animX 10s cubic-bezier(0.36, 0, 0.64, 1) -13.571s infinite alternate,
    animY 10s cubic-bezier(0.36, 0, 0.64, 1) -8.571s infinite alternate,
    scale 20s cubic-bezier(0.36, 0, 0.64, 1) -8.571s infinite alternate;
}

.r5 {
  animation: animX 10s cubic-bezier(0.36, 0, 0.64, 1) -16.428s infinite alternate,
    animY 10s cubic-bezier(0.36, 0, 0.64, 1) -11.428s infinite alternate,
    scale 20s cubic-bezier(0.36, 0, 0.64, 1) -11.428s infinite alternate;
}

.r6 {
  animation: animX 10s cubic-bezier(0.36, 0, 0.64, 1) -19.285s infinite alternate,
    animY 10s cubic-bezier(0.36, 0, 0.64, 1) -14.285s infinite alternate,
    scale 20s cubic-bezier(0.36, 0, 0.64, 1) -14.285s infinite alternate;
}

.r7 {
  animation: animX 10s cubic-bezier(0.36, 0, 0.64, 1) -22.142s infinite alternate,
    animY 10s cubic-bezier(0.36, 0, 0.64, 1) -17.142s infinite alternate,
    scale 20s cubic-bezier(0.36, 0, 0.64, 1) -17.142s infinite alternate;
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




