<template>
    <canvas id="canvas" style="backgroundColor:#000"></canvas>
</template>

<script>
import { chartFontSize } from "@/lib";

export default {
  mounted() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    canvas.width = chartFontSize(148);
    canvas.height = chartFontSize(148);
    console.log(canvas.width);
    var radius1 = chartFontSize(20);
    var radius2 = chartFontSize(20);
    var radius3 = chartFontSize(20);

    function drawCircle(radius, color) {
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.width / 2, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = color; //"rgba(255, 0, 0, 1)";
      ctx.stroke();
    }

    function render(radius, color) {
      var prev = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "destination-in";
      ctx.globalAlpha = 0.9;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = prev;

      drawCircle(radius, color);
    }

    // setInterval(function() {
    //   setTimeout(function() {
    //     // 红色
    //     render(radius1, "rgba(255, 0, 0, 1)");

    //     radius1 += 1.5;
    //     if (radius1 > canvas.width/2) {
    //       radius1 = 0;
    //     }
    //   }, 20);

    //   setTimeout(function() {
    //     // 蓝色
    //     render(radius2, "rgba(255, 0, 0, 1)");
    //     // render(radius2, "rgba(0,0,255, 1)");

    //     radius2 += 1.5;
    //     if (radius2 > canvas.width/2) {
    //       radius2 = 0;
    //     }
    //   }, 800);

    //   setTimeout(function() {
    //     // 绿色
    //     render(radius3, "rgba(255, 0, 0, 1)");
    //     // render(radius3, "rgba(0,128,0, 1)");

    //     radius3 += 1.5;
    //     if (radius3 > canvas.width/2) {
    //       radius3 = 0;
    //     }
    //   }, 1400);

    // }, 40);

    function initCanvas() {
      // 红色
      render(radius1, "rgba(255, 0, 0, 1)");

      radius1 += 1;
      if (radius1 > canvas.width / 2) {
        radius1 = 0;
      }

      setTimeout(function() {
        // 蓝色
        // render(radius2, "rgba(255, 0, 0, 1)");
        render(radius2, "rgba(0,0,255, 1)");

        radius2 += 1;
        if (radius2 > canvas.width / 2) {
          radius2 = 0;
        }
      }, 300);

      setTimeout(function() {
        // 绿色
        // render(radius3, "rgba(255, 0, 0, 1)");
        render(radius3, "rgba(0,128,0, 1)");

        radius3 += 1;
        if (radius3 > canvas.width / 2) {
          radius3 = 0;
        }
      }, 800);

      requestAnimationFrame(initCanvas);
    }

    initCanvas();
  }
};
</script>
