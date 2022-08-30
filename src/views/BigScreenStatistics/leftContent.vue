<template>
    <div class="left_content">
        <el-carousel height="100%">
            <el-carousel-item key="A">
                <householdLeftA></householdLeftA>
                <!-- <streetLeftA></streetLeftA> -->
            </el-carousel-item>
            <el-carousel-item key="B">
                <householdLeftB></householdLeftB>
                <!-- <streetLeftB></streetLeftB> -->
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
import householdLeftA from "./household/householdLeftA.vue";
import householdLeftB from "./household/householdLeftB.vue";
import streetLeftA from "./street/streetLeftA.vue";
import streetLeftB from "./street/streetLeftB.vue";

export default {
  components: { householdLeftA, householdLeftB, streetLeftA, streetLeftB }
};
</script>

<style lang="scss" scoped>
@import "static/BigScreenStatistics/style/index.scss";
.right_content {
}
</style>
