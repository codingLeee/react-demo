<!--基本情况一览表-->
<template>
    <div class="basic_info toggle_content toggle_left_1">
        <div class="panel_title">基本情况一览表</div>
        <BaseInfoContatiner 
            title="排水户" 
            :total="drainageHouseholdData['totalNum']" 
            :rightWidth="56.32"
            firstTitle="重点/住宅类"
            :firstNum="drainageHouseholdData['keySupervisionNum']"
            :firstTotal="drainageHouseholdData['residentialNum']"
            secondTitle="商铺/非住宅"
            :secondNum="drainageHouseholdData['shopNum']"
            :secondTotal="drainageHouseholdData['notResidentialNum']"
        ></BaseInfoContatiner>
    </div>
</template>

<script>
import BaseInfoContatiner from "./components/BaseInfoContatiner";
import {getDrainageHouseholdInfo} from "@/api";
import { awaitWrap, checkNotNull } from "@/lib";

export default {
  name: "BasicInfo",
  components: { BaseInfoContatiner },
  data() {
    return {
      drainageHouseholdData:{}
    };
  },
  methods:{
    async getDrainageHouseholdInfo() {
      const _this = this;
      let drainageHouseholdInfo = (await awaitWrap(getDrainageHouseholdInfo()))[1];

      if (
        checkNotNull(drainageHouseholdInfo) &&
        checkNotNull(drainageHouseholdInfo["data"])
      ) {
        _this.drainageHouseholdData = drainageHouseholdInfo["data"];
      } else {
        _this.drainageHouseholdData = {};
      }
    }
  },
  mounted(){
    this.getDrainageHouseholdInfo();
  }
};
</script>

<style lang="scss" scoped>
.basic_info {
  height: 17.05%;
}
</style>
