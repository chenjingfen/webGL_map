var log = console.log.bind(console);

var globeObj = (function() {
    'use strict';

    // 判断浏览器是否支持webgl
    if(!Detector.webgl) Detector.addGetWebGLMessage();

    var container, stats;
    var camera, scene, renderer;
    var group;
    var mouseX = 0, mouseY = 0;
    var winWth = window.innerWidth, winHgt = window.innerHeight;

    // 获取position
    function getPosition(lng, lat, alt) {
        var phi = (90-lat)*(Math.PI/180),
            theta = (lng+180)*(Math.PI/180),
            radius = alt+200,
            x = -(radius * Math.sin(phi) * Math.cos(theta)),
            z = (radius * Math.sin(phi) * Math.sin(theta)),
            y = (radius * Math.cos(phi));
        return {x: x, y: y, z: z};
    }


    // 地球
    function globe() {
        var globeTextureLoader = new THREE.TextureLoader();
        globeTextureLoader.load('map.jpg', function (texture) {
            var globeGgeometry = new THREE.SphereGeometry(200, 100, 100);
            var globeMaterial = new THREE.MeshStandardMaterial({map: texture});
            var globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial);
            group.add(globeMesh);
            group.rotation.x = THREE.Math.degToRad(35);
            group.rotation.y = THREE.Math.degToRad(170);
        });
    }

    // 星点
    function stars() {
        var starsGeometry = new THREE.Geometry();
        for (var i = 0; i < 2000; i ++) {
            var starVector = new THREE.Vector3(
                THREE.Math.randFloatSpread(2000),
                THREE.Math.randFloatSpread(2000),
                THREE.Math.randFloatSpread(2000)
            );
            starsGeometry.vertices.push(starVector);
        }
        var starsMaterial = new THREE.PointsMaterial({color: 0x888888})
        var starsPoint = new THREE.Points(starsGeometry, starsMaterial);
        group.add(starsPoint);
    }

    // 光
    function lights() {
        var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 2);
        hemisphereLight.position.x = 0;
        hemisphereLight.position.y = 0;
        hemisphereLight.position.z = -200;
        group.add(hemisphereLight);
    }

    // 初始化
    function init() {
        container = document.getElementById('map');

        scene = new THREE.Scene();
       /* var bgTexture = new THREE.TextureLoader().load("bg.jpg");
        scene.background = bgTexture;*/

        camera = new THREE.PerspectiveCamera(50, winWth/winHgt, 1, 2000);
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 400;
        camera.lookAt(0,0,0);

        group = new THREE.Group();
        scene.add(group);

        // 地球    
        globe();


        // 星点
        stars();

        // 半球光
        lights();

        // 渲染器
        renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(winWth, winHgt);
        container.appendChild(renderer.domElement);

        // 盘旋控制
        var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControl.minDistrance = 20;
        orbitControl.maxDistrance = 50;
        orbitControl.maxPolarAngle = Math.PI/2;

        // 性能测试
        stats = new Stats();
        container.appendChild(stats.dom);

        // resize事件
        window.addEventListener('resize', onWindowResize, false);
    }

    // 窗口大小改变
    function onWindowResize() {
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // 渲染
    function render() {
        group.rotation.y -= 0.0005;
        renderer.render(scene, camera);
    }

    // 动画
    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    init();
    animate();
})();