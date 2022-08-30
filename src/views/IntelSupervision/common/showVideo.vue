<template>
    <div class="video_dialog" v-if="showVideoVisible">
            <span class="video_dialog_close" @click="closeDialog">
                <i class="el-icon-close"></i>
            </span>
            <video controls autoplay :src="videoUrl"></video>
        </div>
</template>

<script>
export default {
  props: {
    videoUrl: {
      type: String
    },
    showVideoVisible: {
      type: Boolean
    }
  },
  methods: {
    closeDialog() {
      this.$emit("update:showVideoVisible", false);
    }
  }
};
</script>


<style lang="scss" scoped>
.video_dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  video {
    width: 100%;
    height: 100%;
  }

  .video_dialog_close {
    position: absolute;
    top: 40px;
    right: 40px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 24px;
    color: #fff;
    background-color: #606266;
    cursor: pointer;
    border-radius: 50%;
    z-index: 1;
  }
}
</style>
