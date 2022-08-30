<template>
    <el-empty class="no_data" :image-size="275" :image="image"></el-empty>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      default: "/static/Common/img/null_icon.png"
    }
  }
};
</script>

<style lang="scss" scoped>
//空内容占位
.no_data {
  height: 100%;
  width: 100%;
}
</style>
