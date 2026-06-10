import * as THREE from 'three';
import { MMDLoader } from "three/addons/loaders/MMDLoader.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


let scene, camera, renderer, controls, mmdMesh;

// カメラアニメーションの状態管理オブジェクト
let cameraAnimation = {
  active: false,
  toPos: new THREE.Vector3(),
  speed: 0,
  toRotation: new THREE.Euler(),
  rotSpeed: 0,
  toFov: 45,
  fovSpeed: 1,
  onComplete: null,
  lookAtPos: null,
  isSpiral: false,
  centerX: 0, centerY: 0, centerZ: 0,
  startY: 0,
  currentRadius: 0, targetRadius: 0,
  currentAngle: 0, spiralRotSpeed: 0, spiralApproachSpeed: 0
};

// --- 1. 初期設定 ---
window.initThree = function() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 100, 1000);
  
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(0, 40, 120);
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  const canvas = renderer.domElement;
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "1";
  canvas.style.opacity = "0";
  canvas.style.transition = "opacity 2s ease-out";
  document.body.appendChild(canvas);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);
  
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enabled = false;
  
  // 💡 ここでメインのループ処理を起動する！
  animate();
}

// --- 2. モデル読み込みと色味補正 ---
window.loadCourtroom = function() {
  const loader = new MMDLoader();
  const pmxPath = 'assets/three/trialPlace/trial.pmx';
  loader.load(pmxPath, (mesh) => {
    mmdMesh = mesh;
    mesh.traverse((child) => {
      if (child.isMesh) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          if (mat.emissive && typeof mat.emissive.setHex === 'function') {
            mat.emissive.setHex(0x000000);
          }
          if (mat.map) {
            mat.map.colorSpace = THREE.SRGBColorSpace;
            mat.map.needsUpdate = true;
          }
          if (mat.specular && typeof mat.specular.setHex === 'function') {
            mat.specular.setHex(0x111111);
          }
          mat.transparent = false;
        });
      }
    });
    scene.add(mmdMesh);
    
    // キャラクター配置
    spawnStandIn("assets/three/characters/TATURO/Taturo_Consider.png", {x: 0, y: 16, z: -27}, 0, {x: 1.0, y: 1.0, z: 1.0});
    spawnStandIn("assets/three/characters/FAKEFURUICHI/FakeFuruichi_Normal.png", {x: -20, y: 16, z: -18}, 45, {x: 1.0, y: 1.0, z: 1.0});
    spawnStandIn("assets/three/characters/RYUJI/Ryuji_Normal.png", {x: -28, y: 16, z: 0}, 90, {x: 1.0, y: 1.0, z: 1.0});
    spawnStandIn("assets/three/characters/KENTO/Kento_Normal.png", {x: -20, y: 16, z: 18}, 135, {x: 1.0, y: 1.0, z: 1.0});  
    spawnStandIn("assets/three/characters/SHIGE/Shige_Normal.png", {x: 0, y: 16.7, z: 27}, 180, {x: 1.0, y: 1.0, z: 1.0});
    spawnStandIn("assets/three/characters/KEIZO/Keizo_Normal.png", {x: 20, y: 15.5, z: 18}, 225, {x: 1.0, y: 1.0, z: 1.0});
    spawnStandIn("assets/three/characters/MITSUHIRO/Mitsuhiro_Normal.png", {x: 20, y: 16, z: -19}, -45, {x: 1.0, y: 1.0, z: 1.0});
    
    const canvas = renderer.domElement;
    void canvas.offsetWidth;
    canvas.style.opacity = "1";
    const blackScreen = document.getElementById("blackScreen");
    if (blackScreen) {
      void blackScreen.offsetWidth;
      blackScreen.style.opacity = 0;
      setTimeout(() => {
        blackScreen.style.display = "none";
      }, 2000)
    }
  }, (xhr) => {
    const percent = Math.round(xhr.loaded / xhr.total * 100);
    console.log(`Loading: ${percent}%`);
  }, (err) => {
    console.error("エラー発生:", err);
  });
}

// --- 3. 単一のクリーンな描画ループ（重複を完全除去！） ---
function animate() {
  requestAnimationFrame(animate);

  // カメラアニメーションの処理
  if (cameraAnimation.active) {
    
    // 💡 Aパターン：らせん軌道モード
    if (cameraAnimation.isSpiral) {
      cameraAnimation.currentAngle += cameraAnimation.spiralRotSpeed;
      
      const startR = cameraAnimation.startRadius;
      const endR = cameraAnimation.targetRadius;
      
      if (cameraAnimation.currentRadius > endR) {
        cameraAnimation.currentRadius -= cameraAnimation.spiralApproachSpeed;
      } else {
        cameraAnimation.currentRadius = endR;
      }

      // 高度（Y）を進捗率にシンクロさせる
      if (startR !== endR) {
        const progress = (startR - cameraAnimation.currentRadius) / (startR - endR);
        const startY = cameraAnimation.startY;
        const targetY = cameraAnimation.toPos.y;
        camera.position.y = startY + (targetY - startY) * progress;
      } else {
        camera.position.y = cameraAnimation.toPos.y;
      }

      // XZ座標に数学を適用
      camera.position.x = cameraAnimation.centerX + cameraAnimation.currentRadius * Math.cos(cameraAnimation.currentAngle);
      camera.position.z = cameraAnimation.centerZ + cameraAnimation.currentRadius * Math.sin(cameraAnimation.currentAngle);

      // ターゲットを凝視
      camera.lookAt(new THREE.Vector3(cameraAnimation.centerX, cameraAnimation.centerY, cameraAnimation.centerZ));

      // 終了判定
      const isRadiusEnd = (cameraAnimation.currentRadius <= endR);
      const isAngleEnd = (cameraAnimation.spiralRotSpeed > 0) 
        ? (cameraAnimation.currentAngle >= cameraAnimation.targetAngle)
        : (cameraAnimation.currentAngle <= cameraAnimation.targetAngle);

      if (isRadiusEnd || isAngleEnd) {
        cameraAnimation.active = false;
        camera.position.copy(cameraAnimation.toPos);
        if (typeof cameraAnimation.onComplete === 'function') cameraAnimation.onComplete();
      }

    } 
    // 💡 Bパターン：通常の等速直線移動モード
    else {
      // ① 位置の移動
      const dir = new THREE.Vector3().subVectors(cameraAnimation.toPos, camera.position);
      const dist = dir.length();
      let isPosEnd = false;
      if (dist <= cameraAnimation.speed) {
        camera.position.copy(cameraAnimation.toPos);
        isPosEnd = true;
      } else {
        dir.normalize().multiplyScalar(cameraAnimation.speed);
        camera.position.add(dir);
      }

      // ② 回転の補間
      let isRotEnd = false;
      if (cameraAnimation.lookAtPos) {
        camera.lookAt(cameraAnimation.lookAtPos);
        isRotEnd = true;
      } else {
        camera.rotation.order = 'YXZ';
        const diffX = cameraAnimation.toRotation.x - camera.rotation.x;
        const diffY = cameraAnimation.toRotation.y - camera.rotation.y;
        const diffZ = cameraAnimation.toRotation.z - camera.rotation.z;

        if (Math.abs(diffX) <= cameraAnimation.rotSpeed) camera.rotation.x = cameraAnimation.toRotation.x;
        else camera.rotation.x += Math.sign(diffX) * cameraAnimation.rotSpeed;

        if (Math.abs(diffY) <= cameraAnimation.rotSpeed) camera.rotation.y = cameraAnimation.toRotation.y;
        else camera.rotation.y += Math.sign(diffY) * cameraAnimation.rotSpeed;

        if (Math.abs(diffZ) <= cameraAnimation.rotSpeed) camera.rotation.z = cameraAnimation.toRotation.z;
        else camera.rotation.z += Math.sign(diffZ) * cameraAnimation.rotSpeed;

        if (Math.abs(diffX) < 0.05 && Math.abs(diffY) < 0.05 && Math.abs(diffZ) < 0.05) isRotEnd = true;
      }

      // ③ ズーム（FOV）の変化
      let isFovEnd = false;
      const fovDiff = cameraAnimation.toFov - camera.fov;
      if (Math.abs(fovDiff) <= cameraAnimation.fovSpeed) {
        camera.fov = cameraAnimation.toFov;
        isFovEnd = true;
      } else {
        camera.fov += Math.sign(fovDiff) * cameraAnimation.fovSpeed;
      }
      camera.updateProjectionMatrix();

      // 通常モード終了判定
      if (isPosEnd && isRotEnd && isFovEnd) {
        cameraAnimation.active = false;
        if (typeof cameraAnimation.onComplete === 'function') cameraAnimation.onComplete();
      }
    }
  } else {
    // アニメーション停止中のみOrbitControlsを有効化
    if (controls && controls.enabled) { 
      controls.update();
    }
  }

  // 💡【超重要】カメラが動いていようが止まっていようが、毎フレーム絶対にレンダリングする！
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  if (!renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 4. キャラクター配置用関数 ---
window.spawnStandIn = function(imagePath, position = { x: 0, y: 16, z: 45 }, rotationY = 0, scale = {x: 1, y: 1, z: 1}) {
  const loader = new THREE.TextureLoader();
  loader.load(imagePath, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    const geometry = new THREE.PlaneGeometry(25, 30); 

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.FrontSide,
      alphaTest: 0.5 
    });
    const standIn = new THREE.Mesh(geometry, material);
    
    standIn.position.set(position.x, position.y, position.z);
    standIn.rotation.y = rotationY * (Math.PI / 180);
    standIn.scale.set(scale.x, scale.y, scale.z);
    
    const charName = imagePath.split('/').reverse()[1];
    standIn.name = charName;

    const backMaterial = new THREE.MeshBasicMaterial({ 
      map: texture,
      color: 0x000000,
      transparent: true,
      side: THREE.BackSide,
      alphaTest: 0.5 
    });
    const backPlate = new THREE.Mesh(geometry, backMaterial);
    standIn.add(backPlate); 

    scene.add(standIn);
  });
}

// --- 5. カメラ移動命令を受け取る関数 ---
window.cameraMove = function({
  from = null,
  to = {},
  speed = null,
  toFov = null,
  fovSpeed = null,
  yaw = 0,
  pitch = 0,
  roll = 0,
  rotSpeed = null,
  lookAtPos = null,
  spiral = null
} = {}) {
  return new Promise((resolve) => {
    if (from) {
      camera.position.set(from.x, from.y, from.z);
      camera.rotation.set(0, 0, 0, 'YXZ');
    }
    
    if (spiral) {
      cameraAnimation.isSpiral = true;
      cameraAnimation.startY = from ? from.y : camera.position.y;
      cameraAnimation.centerX = spiral.cx !== undefined ? spiral.cx : 0;
      cameraAnimation.centerY = spiral.cy !== undefined ? spiral.cy : 20;
      cameraAnimation.centerZ = spiral.cz !== undefined ? spiral.cz : 0;
      cameraAnimation.currentRadius = spiral.startRadius || 100;
      cameraAnimation.targetRadius = spiral.endRadius || 100;
      cameraAnimation.currentAngle = spiral.startAngle || 0;
      
      const turnRad = (spiral.turnAngle !== undefined) ? spiral.turnAngle * (Math.PI / 180) : Math.PI * 2;
      cameraAnimation.targetAngle = cameraAnimation.currentAngle + turnRad;

      cameraAnimation.spiralRotSpeed = spiral.rotSpeed || 0.03;
      cameraAnimation.spiralApproachSpeed = (spiral.startRadius === spiral.endRadius) ? 0 : (spiral.approachSpeed || 0.5);
      
      cameraAnimation.speed = speed || 0.5;
      cameraAnimation.toPos.set(to.x !== undefined ? to.x : 0, to.y !== undefined ? to.y : 20, to.z !== undefined ? to.z : 0);
    } else {
      cameraAnimation.isSpiral = false;
      const targetX = to.toX !== undefined ? to.toX : (to.x !== undefined ? to.x : camera.position.x);
      const targetY = to.toY !== undefined ? to.toY : (to.y !== undefined ? to.y : camera.position.y);
      const targetZ = to.toZ !== undefined ? to.toZ : (to.z !== undefined ? to.z : camera.position.z);
      cameraAnimation.toPos.set(targetX, targetY, targetZ);
    
      cameraAnimation.speed = (speed !== null) ? speed : 0.8;
    
      if (lookAtPos) {
        cameraAnimation.lookAtPos = new THREE.Vector3(lookAtPos.x, lookAtPos.y, lookAtPos.z);
      } else {
        cameraAnimation.lookAtPos = null;
      }

      if (lookAtPos) {
        const tempCamera = camera.clone();
        tempCamera.position.set(targetX, targetY, targetZ);
        tempCamera.lookAt(cameraAnimation.lookAtPos);
        cameraAnimation.toRotation.copy(tempCamera.rotation);
        cameraAnimation.rotSpeed = (rotSpeed !== null) ? rotSpeed: 0.05;
      } else {
        cameraAnimation.toRotation.set(
          pitch * (Math.PI / 180),
          yaw * (Math.PI / 180),
          roll * (Math.PI / 180),
          'YXZ'
        );
        cameraAnimation.rotSpeed = (rotSpeed !== null) ? rotSpeed : 0.05;
      }

      const targetFov = (toFov && toFov !== 0) ? toFov : camera.fov;
      cameraAnimation.toFov = targetFov;

      if (fovSpeed === null || fovSpeed === undefined) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
        cameraAnimation.fovSpeed = 999;
      } else {
        cameraAnimation.fovSpeed = fovSpeed;
      }
    }
    
    cameraAnimation.onComplete = () => { resolve(); };
    if (controls) controls.enabled = false;
    cameraAnimation.active = true;
  });
};

// --- 6. 表情（テクスチャ）切り替え関数 ---
window.changeStandInExpression = function(charName, newImagePath) {
  const targetMesh = scene.getObjectByName(charName);
  if (!targetMesh) {
    console.warn(`【警告】${charName} というキャラクターが見つかりません。`);
    return;
  }

  const loader = new THREE.TextureLoader();
  loader.load(newImagePath, (newTexture) => {
    newTexture.colorSpace = THREE.SRGBColorSpace;
    targetMesh.material.map = newTexture;
    targetMesh.material.needsUpdate = true;

    if (targetMesh.children.length > 0) {
      const backPlate = targetMesh.children[0];
      if (backPlate.material && backPlate.material.map) {
        backPlate.material.map = newTexture;
        backPlate.material.needsUpdate = true;
      }
    }
  }, undefined, (err) => {
    console.error("テクスチャの切り替えに失敗しました:", err);
  });
};