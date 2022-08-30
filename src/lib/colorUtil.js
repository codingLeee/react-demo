
define([], function() {
    function ColorUtil() {}

    // 将rgb表示方式转换为hex表示方式("rgb(21,12,150)")或者（[21,12,150])
    ColorUtil.prototype.rgb2hex = function(rgb) {
        var _this = rgb;
        var strHex = "#";
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        if (Object.prototype.toString.call(_this) === '[object Array]') {
            for (var i = 0; i < _this.length; i++) {
                var hex = Number(_this[i]).toString(16);
                hex = hex < 10 ? 0 + '' + hex : hex; // 保证每个rgb的值为2位
                if (hex === "0") {
                    hex += hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = _this;
            }
            return strHex;
        } else if (/^(rgb|RGB)/.test(_this)) {
            var aColor = _this.replace(/(?:(|)|rgb|RGB)*/g, "").split(",");
            strHex = "#";
            for (var i = 0; i < aColor.length; i++) {
                var hex = Number(aColor[i]).toString(16);
                hex = hex < 10 ? 0 + '' + hex : hex; // 保证每个rgb的值为2位
                if (hex === "0") {
                    hex += hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = _this;
            }
            return strHex;
        } else if (reg.test(_this)) {
            var aNum = _this.replace(/#/, "").split("");
            if (aNum.length === 6) {
                return _this;
            } else if (aNum.length === 3) {
                strHex = "#";
                for (var i = 0; i < aNum.length; i += 1) {
                    numHex += (aNum[i] + aNum[i]);
                }
                return numHex;
            }
        } else {
            return _this;
        }
    };

    // 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
    ColorUtil.prototype.hex2rgb = function(hex) {
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        hex = hex.toLowerCase();
        if (hex && reg.test(hex)) {
            if (hex.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += hex.slice(i, i + 1).concat(hex.slice(i, i + 1));
                }
                hex = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + hex.slice(i, i + 2)));
            }
            return sColorChange;
        } else {
            return hex;
        }
    };

    // 获取一组渐变色('#1abc9c','#333fff',5)
    ColorUtil.prototype.getGradientColor = function(startColor, endColor, step) {
        var startRGB = this.hex2rgb(startColor); //转换为rgb数组模式
        var startR = startRGB[0];
        var startG = startRGB[1];
        var startB = startRGB[2];

        var endRGB = this.hex2rgb(endColor);
        var endR = endRGB[0];
        var endG = endRGB[1];
        var endB = endRGB[2];

        var sR = (endR - startR) / step; //总差值
        var sG = (endG - startG) / step;
        var sB = (endB - startB) / step;

        var colorArr = [];
        for (var i = 0; i < step; i++) {
            //计算每一步的hex值
            var hex = this.rgb2hex([parseInt((sR * i + startR)), parseInt((sG * i + startG)), parseInt((sB * i + startB))]);
            colorArr.push(hex);
        }
        return colorArr;
    };
    
    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };
    
    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };
    
    /*
        start 开始颜色
        end 结束颜色
        steps 颜色分解 次数
        gamma 暂时理解为透明一点（伽马）
    */
    ColorUtil.prototype.gradientColors = function(start, end, steps, gamma) {
        var i, j, ms, me, output = [], so = [];
            gamma = gamma || 1;
            var normalize = function (channel) {
                return Math.pow(channel / 255, gamma);
            };
            start = parseColor(start).map(normalize);
            end = parseColor(end).map(normalize);
            for (i = 0; i < steps; i++) {
                ms = i / (steps - 1);
                me = 1 - ms;
                for (j = 0; j < 3; j++) {
                so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
                }
                output.push('#' + so.join(''));
            }
            return output;
    };


    /**  
     * 根据颜色数组进行色带生成(颜色1，颜色2，颜色3)
     * 
     */
    ColorUtil.prototype.transitionalColor = function(colors, array) {
        var result = [];
        var steps = array.length / (colors.length - 1) + 1;
        for (var j = 1; j < colors.length; j++) {
            var color1RGB = this.retrieveRGBComponent(colors[j - 1]);
            var color2RGB = this.retrieveRGBComponent(colors[j]);
            var redDiff = color2RGB[0] - color1RGB[0];
            var greenDiff = color2RGB[1] - color1RGB[1];
            var blueDiff = color2RGB[2] - color1RGB[2];

            for (var i = (j - 1) * steps; i < steps * j; i++) {
                var tmpRGB = [
                    parseInt(color1RGB[0] + redDiff * i / array.length),
                    parseInt(color1RGB[1] + greenDiff * i / array.length),
                    parseInt(color1RGB[2] + blueDiff * i / array.length)
                ];
                //  colors.push( generateFromRGBComponent( tmpRGB ) ); 
                if (i < array.length) {
                    var color = "rgb(" + tmpRGB.join(",") + ")";
                    var rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

                    function hex(x) {
                        return ("0" + parseInt(x).toString(16)).slice(-2);
                    }
                    rgb = "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
                    // alert(rgb);
                    result.push(rgb);
                } else {
                    break;
                }

            }
        }
        return result;
    };


    /**  
     * 输入一个颜色,将它拆成三个部分:  
     * 红色,绿色和蓝色  
     */
    ColorUtil.prototype.retrieveRGBComponent = function(color) {
        var r = color >> 16;
        var g = (color >> 8) & 0xff;
        var b = color & 0xff;
        return [r, g, b];
    };


    /**根据最大值、最小值、颜色进行分等级***/
    ColorUtil.prototype.GetColor = function(colors, array) {
        var result = [];
        var max = 0;
        var min = 0;
        for (var i = 0; i < array.length; i++) {
            var sum = parseFloat(array[i].ZS);
            if (sum > max)
                max = sum;
            if (sum < min)
                min = sum;
        }

        var kd = parseFloat((max - min) / colors.length); //刻度
        for (var j = 0; j < array.length; j++) {
            var sum = parseFloat(array[j].ZS);
            for (var k = 0; k < colors.length; k++) {
                var qjmin = (kd * k);
                var qjmax = kd * (k + 1)
                if (sum >= qjmin && sum <= qjmax) {
                    result.push(colors[colors.length - k - 1]);
                    break;
                }
            }

        }
        return result;
    };

    return new ColorUtil();
});
