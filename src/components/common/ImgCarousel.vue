<template>
    <div class="img_carousel">
        <el-carousel v-if="checkNotNull(imgList)" class="img_carousel_content" trigger="click" height="127px" indicator-position="outside">
            <el-carousel-item v-for="item in Math.ceil(imgList.length/3)" :key="item">
                <el-row  class="img_carousel_row" :gutter="20">
                    <el-col :span="8">
                        <el-image :src="imgList[(item-1)*3]" :preview-src-list="imgList"></el-image>
                    </el-col>
                    <el-col :span="8" v-if="checkNotNull(imgList[(item-1)*3+1])">
                        <el-image :src="imgList[(item-1)*3+1]" :preview-src-list="imgList"></el-image>
                    </el-col>
                    <el-col :span="8" v-if="checkNotNull(imgList[(item-1)*3+2])">
                        <el-image :src="imgList[(item-1)*3+2]" :preview-src-list="imgList"></el-image>
                    </el-col>
                </el-row>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
import { checkNotNull } from "@/lib";

export default {
  props: {
    img: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      imgList: []
    };
  },
  watch: {
    img: {
      deep: true,
      immediate: true,
      handler(val) {
        if (checkNotNull(val)) {
          this.imgList = val.split(",");
          this.imgList = this.imgList.filter(function(s) {
            return s && s.trim();
          });
        }
      }
    }
  },
  methods: {
    checkNotNull(val) {
      return checkNotNull(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.img_carousel {
  width: 100%;

  /deep/ .el-carousel {
    width: 100%;

    .el-image,
    .el-col,
    .el-row {
      height: 100%;
    }

    .el-carousel__arrow {
      background-color: rgba(88, 103, 240, 0.8);
      color: #8be5ff;
      font-size: 16px;
    }

    .el-carousel__indicators {
      li {
        .el-carousel__button {
          background-color: #5867f0;
        }
      }
    }
  }
}
</style>
