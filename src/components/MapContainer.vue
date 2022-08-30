<!-- mapbox -->
<template>
  <div id="map"></div>
</template>
 
<script>
import jinniubuildinggeojson from "@/data/jinniubuilding.geo.json";

export default {
  data() {
    return {
      camera:{}
    };
  },
  components: {},
  created() {},
  mounted() {
    this.initmap();
  },
  computed: {},
  methods: {
    initmap() {
      const _this = this;

      var tdtVec = {
        //类型为栅格瓦片
        type: "raster",
        tiles: [
          "http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=94c8fdaa0318f9fa88cbbaf2145186e5"
        ],
        //分辨率
        tileSize: 256
      };
      var tdtCva = {
        type: "raster",
        tiles: [
          "http://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=ebf64362215c081f8317203220f133eb"
        ],
        tileSize: 256
      };

      _this.$mapboxgl.accessToken =
        "pk.eyJ1IjoiYWlpZGNtYXBib3giLCJhIjoiY2t5MmwxNTkzMGx6cjJ3cnNlbmkxejJ3dyJ9.uOjkh9kNooS-mqvSo3wS_A";

      _this.map = window.map = new _this.$mapboxgl.Map({
        container: "map",
        // style: "mapbox://styles/mapbox/light-v10",
        zoom: 17,
        center: [104.0515816071207, 30.702937112155528],
        pitch: 60,
        style: {
          version: 8,
          sources: {
            tdtVec: tdtVec,
            tdtCva: tdtCva
          },
          layers: [
            {
              //图层id，要保证唯一性
              id: "tdtVec",
              //图层类型
              type: "raster",
              //数据源
              source: "tdtVec",
              //图层最小缩放级数
              minzoom: 0,
              //图层最大缩放级数
              maxzoom: 18
            },
            {
              id: "tdtCva",
              type: "raster",
              source: "tdtCva",
              minzoom: 0,
              maxzoom: 18
            }
          ]
        }
      });

      _this.renderThree3D();
      _this.map.on("style.load", function(e) {
        // _this.renderGeojson3D();
      });

      // _this.map.on('mousemove', (event) => {
      //   mouse.x = ( event.point.x / window.innerWidth ) * 2 - 1;
      //   mouse.y = - ( event.point.y / window.innerHeight ) * 2 + 1;
      // });

      _this.map.on("click", function(e) {
        
        // console.log(_this.map.getFreeCameraOptions())
        console.log(_this.map.getCenter())
        console.log(_this.map.getZoom())
        console.log(_this.map.getBearing())
        console.log(_this.map.getPitch())
        
        map.flyTo({
          center: [104.06694278302507, 30.687975568272762],
          zoom: 14.998362701899726,
          bearing: -41.52581431618245,
          pitch: 70.00197153484704,
          speed: 0.2
        });
        // var coordinates = e.lngLat;

        // //  将经纬度坐标转换成web墨卡托坐标
        // var point = _this.$mapboxgl.MercatorCoordinate.fromLngLat(
        //   { lng: 104.0515816071207, lat: 30.702937112155528 },
        //   0
        // );
      });
    },
    renderGeojson3D() {
      const _this = this;
      //     var point = _this.$mapboxgl.MercatorCoordinate.fromLngLat(
      //     { lng: 104.0515816071207, lat: 30.702937112155528 },
      //     0
      //   ).meterInMercatorCoordinateUnits();
      // console.log(point);
      // let datalngLat = mecatorcoord.toAltitude();
      // jinniubuildinggeojson.features.forEach(m => {
      //   if (m.geometry.type == "MultiPolygon") {
      //   } else if (m.geometry.type == "Polygon") {
      //     m.geometry.coordinates[0].forEach(n => {
      //       console.log(n);
      //       // let mecatorcoord = new _this.$mapboxgl.MercatorCoordinate(n[0],n[1],0);
      //       // let datalngLat = mecatorcoord.toLngLat();
      //       // console.log(datalngLat);
      //     });
      //   }
      // });

      if (_this.map.getLayer("entity_layer")) {
        _this.map.removeLayer("entity_layer");
      }
      if (_this.map.getLayer("entity_borders")) {
        _this.map.removeLayer("entity_borders");
      }

      jinniubuildinggeojson.features.forEach(item => {
        let he; //默认建筑物高度
        if (item.properties.height === "") {
          he = "5";
        } else {
          he = item.properties.height;
        }
        //模拟数据
        //item.properties.pkid = parseInt(item.properties.xh)
        item.properties.height = parseInt(he);
        item.properties.base_height = parseInt(0);
      });

      if (_this.map.getSource("states")) {
        _this.map.getSource("states").setData(jinniubuildinggeojson);
      } else {
        _this.map.addSource("states", {
          type: "geojson",
          data: jinniubuildinggeojson
        });
      }

      // 建筑加载图层
      _this.map.addLayer({
        id: "entity_layer",
        source: "states",
        type: "fill-extrusion",
        layout: {},
        minzoom: 10,
        paint: {
          // "fill-extrusion-color": "#0166b6",
          "fill-extrusion-color": "#123984",
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            14,
            0,
            14.05,
            ["get", "height"]
          ],
          "fill-extrusion-base": [
            "interpolate",
            ["linear"],
            ["zoom"],
            14,
            0,
            14.05,
            ["get", "base_height"]
          ],
          // "fill-extrusion-opacity": 1,
          "fill-extrusion-opacity": 0.8,
          // "fill-extrusion-pattern": "catcat"
        }
      });

      // _this.map.addLayer({
      //   id: "entity_layer_top",
      //   type: "fill-extrusion",
      //   source: "states",
      //   minzoom: 5,
      //   "source-layer": "entity_layer",
      //   paint: {
      //     "fill-extrusion-color": "#32373b",
      //     "fill-extrusion-height": [
      //       "interpolate",
      //       ["linear"],
      //       ["zoom"],
      //       14,
      //       0,
      //       14.05,
      //       ["get", "height"]
      //     ],
      //     "fill-extrusion-base": [
      //       "interpolate",
      //       ["linear"],
      //       ["zoom"],
      //       14,
      //       0,
      //       14.05,
      //       ["get", "height"]
      //     ],
      //     "fill-extrusion-opacity": 1
      //   }
      // });

      // 建筑拾取图层
      _this.map.addLayer({
        id: "entity_layer_Highlight",
        source: "states",
        type: "fill-extrusion",
        layout: {},
        minzoom: 17,
        paint: {
          // "fill-extrusion-color": "#0166b6",
          "fill-extrusion-color": "#0ff",
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            14,
            0,
            14.05,
            ["get", "height"]
          ],
          "fill-extrusion-base": 0,
          "fill-extrusion-opacity": 0.8
        },
        "filter": ["in", "id", ""]
      });

      // 添加图层点击事件
      _this.map.on("click", "entity_layer", function(e) {
        console.log(e.features);
        let feature = e.features[0];
        _this.map.setFilter('entity_layer_Highlight', ['in', 'id', feature.properties.id]);
        // var coordinates = e.features[0].geometry.coordinates.slice();
        // var description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        // }

        // new mapboxgl.Popup()
        //   .setLngLat(coordinates)
        //   .setHTML(description)
        //   .addTo(map);
      });

      // 添加贴图
      // _this.map.loadImage(gaopng, function(error, image) {
      //   _this.map.addImage("catcat", image);
      // });
    },
    renderThree3D() {
      const _this = this;
      // parameters to ensure the model is georeferenced correctly on the map
      var modelOrigin = [104.0515816071207, 30.702937112155528];
      //   x: 0.7890321711308907
      //   y: 0.41031245982869613

      var modelAltitude = 0;
      var modelRotate = [Math.PI / 2, 0, 0];
      // 这里影响了 白膜的位置和大小
      var modelScale = 2.49843220338983e-8;
      // var modelScale = 2.9053690330260436e-8;

      var modelAsMercatorCoordinate = _this.$mapboxgl.MercatorCoordinate.fromLngLat(
        modelOrigin,
        modelAltitude
      );

      // transformation parameters to position, rotate and scale the 3D model onto the map
      var modelTransform = {
        translateX: modelAsMercatorCoordinate.x,
        translateY: modelAsMercatorCoordinate.y,
        translateZ: modelAsMercatorCoordinate.z,
        rotateX: modelRotate[0],
        rotateY: modelRotate[1],
        rotateZ: modelRotate[2],
        scale: modelScale // modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
      };

      var THREE = window.THREE;
      _this.camera = new THREE.Camera();
      _this.scene = new THREE.Scene();
      const mouse = new THREE.Vector4(-1000, -1000, 1, 1);

      // configuration of the custom layer for a 3D model per the CustomLayerInterface
      var customLayer = {
        id: "3d-model",
        type: "custom",
        renderingMode: "3d",
        onAdd: function(map, gl) {
          // 两条光线
          // var directionalLight = new THREE.DirectionalLight(0xffffff);
          // directionalLight.position.set(0, -70, 100).normalize();
          // _this.scene.add(directionalLight);

          // var directionalLight2 = new THREE.DirectionalLight(0xffffff);
          // directionalLight2.position.set(0, 70, 100).normalize();
          // _this.scene.add(directionalLight2);

          var light = new THREE.HemisphereLight(0xffffff,0x000000,3);
          _this.scene.add(light);

          // gltf加载器
          var loader = new THREE.GLTFLoader();
          
          let textureLoader = new THREE.TextureLoader();
          var textureNormal = textureLoader.load('./static/BigScreen/img/gao1.png');
          
          loader.load(
            "./static/data/jinniubuilding.gltf",
            function(obj) {
              // let textureLoader = new THREE.TextureLoader();
              // var mesh = gltf.scene.children[0];
              // var textureNormal = textureLoader.load('./static/BigScreen/img/gao.png');

              // var matcapMaterial = new THREE.MeshMatcapMaterial({ skinning: true ,normalMap: textureNormal })

              // var obj = _this.scene.add( mesh );

              //   obj.traverse((o) => {
              //     if (o.isMesh) o.material = matcapMaterial;
              //   });
              //   var mixer = new THREE.AnimationMixer( mesh );
                
              //   gltf.animations.forEach( ( clip ) => {
                  
              //       mixer.clipAction( clip ).play();
                  
              //   } );
              // console.log(textureNormal)
              obj.scene.traverse(function (gltf){
                // console.log(gltf.isMesh);
                if(gltf.isMesh){
                  // console.log(gltf);
                  // gltf.material.emissive;
                  gltf.material.map = textureNormal;
                }

                // if(gltf.type === 'Mesh'){
                //   gltf.material = new THREE.MeshPhongMaterial({
                //     // color: 0xcccccc,
                //     map: textureNormal,
                //     normalScale: modelScale,
                //     // normalScale: new THREE.Vector2(1, 2),
                //   })
                // }
              })
              _this.scene.add(obj.scene);


            }.bind(_this)
          );
          map = map;

          var mainCanvas = _this.map.getCanvas();
          // use the Mapbox GL JS map canvas for three.js
          _this.renderer = new THREE.WebGLRenderer({
            canvas: mainCanvas,
            context: gl
          });

          _this.renderer.setClearColor(0x000000, 0.0); //设置渲染器背景颜色
          _this.renderer.setSize(
            mainCanvas.offsetWidth,
            mainCanvas.offsetHeight
          );

          _this.renderer.autoClear = false;
          // _this.raycaster = new THREE.Raycaster();

          // // 在渲染是添加click事件
          // _this.renderer.domElement.addEventListener("click", event => {
          //   event.preventDefault();
          //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          //   // 通过摄像机和鼠标位置更新射线
          //   // this.raycaster.setFromCamera(mouse, this.camera);
          //   // 计算物体和射线的焦点
          //   const intersects = _this.raycaster.intersectObjects(_this.scene.children, true);
          //   console.log(intersects);
          //   if (intersects.length > 0) {
          //     that.$emit('openBuild')
          //   }
          // });

          // var mouse = new THREE.Vector2();
          // _this.renderer.domElement.addEventListener("click", event => {
          // console.log(event);
          // const raycaster = new THREE.Raycaster();
          // event.preventDefault();
          // //console.log(mainCanvas.offsetWidth+"+"+mainCanvas.offsetHeight);
          // mouse.x =
          //   (event.clientX - mainCanvas.getBoundingClientRect().left) /
          //     mainCanvas.offsetWidth *
          //     2 -
          //   1;
          // mouse.y =
          //   -(
          //     (event.clientY - mainCanvas.getBoundingClientRect().top) /
          //     mainCanvas.offsetHeight
          //   ) *
          //     2 +
          //   1;

          // raycaster.setFromCamera(mouse, _this.camera);
          // var intersects = raycaster.intersectObjects(
          //   _this.scene.children,
          //   true
          // );
          // console.log(intersects);
          // });

          _this.raycaster = new THREE.Raycaster();
          _this.renderer.domElement.addEventListener("click", event => {
            event.preventDefault();
            mouse.x = event.clientX / window.innerWidth * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            // 通过摄像机和鼠标位置更新射线
            // _this.raycaster.setFromCamera(mouse, _this.camera);
            // 计算物体和射线的焦点
            const intersects = _this.raycaster.intersectObjects(
              _this.scene.children,
              true
            );
            // if (intersects.length > 0) {
            console.log(intersects);
            // that.$emit('openBuild')
            // }
          });
        },
        render: function(gl, matrix) {
          var rotationX = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(1, 0, 0),
            modelTransform.rotateX
          );
          var rotationY = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 1, 0),
            modelTransform.rotateY
          );
          var rotationZ = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 0, 1),
            modelTransform.rotateZ
          );

          var m = new THREE.Matrix4().fromArray(matrix);
          var l = new THREE.Matrix4()
            .makeTranslation(
              modelTransform.translateX,
              modelTransform.translateY,
              modelTransform.translateZ
            )
            .scale(
              new THREE.Vector3(
                modelTransform.scale,
                -modelTransform.scale,
                modelTransform.scale
              )
            )
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ);

          _this.camera.projectionMatrix.elements = matrix;
          _this.camera.projectionMatrix = m.multiply(l);
          _this.camera.matrixWorldInverse = new THREE.Matrix4();
          _this.renderer.state.reset();
          // _this.renderer.resetState();

          // const freeCamera = _this.map.getFreeCameraOptions();
          // let cameraPosition = new THREE.Vector4(freeCamera.position.x, freeCamera.position.y, freeCamera.position.z, 1);
          // console.log(l);
          // cameraPosition.applyMatrix4(l.invert());
          // let direction = mouse.clone().applyMatrix4(_this.camera.projectionMatrix.clone().invert());
          // direction.divideScalar(direction.w);
          // _this.raycaster.set(cameraPosition, direction.sub(cameraPosition).normalize());

          // const intersects = this.raycaster.intersectObjects( this.scene.children, true);
          // console.log(mouse, 'Intersection count:', intersects.length)

          _this.renderer.render(_this.scene, _this.camera);
          _this.map.triggerRepaint();
        }
      };

      _this.map.on("style.load", function(e) {
        _this.map.addLayer(customLayer);
      });
    }
  }
};
</script>
 
<style >
#map {
  height: 100%;
}
</style>