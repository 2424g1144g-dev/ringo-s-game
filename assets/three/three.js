
import * as THREE from 'three';
import { MMDLoader } from "three/addons/loaders/MMDLoader.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls, mmdMesh;
let isStarted = false;

// --- 1. 初期設定 ---

window.initThree = function() {
  scene = new THREE.Scene();
  // 霧（Fog）を追加して奥行きと雰囲気を出す
  scene.fog = new THREE.Fog(0x000000, 100, 1000);
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(0, 40, 120);
  renderer = new THREE.WebGLRenderer({ antialias: true }); // バッテリー優先ならfalse
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 重要：色空間の設定（白っぽさを防ぐ）

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // バッテリー対策：解像度を制限
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const canvas = renderer.domElement;
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "1";
  canvas.style.opacity = "0";
  canvas.style.transition = "opacity 2s ease-out";
  document.body.appendChild(canvas);
  // ライト設定（MMDモデル向けに強めに設定）
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);
  // 操作設定
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 滑らかな動き
  controls.enabled = false;
  // バッテリー対策：変化がある時だけ描画（アニメーションさせない場合）
  // controls.addEventListener('change', () => renderer.render(scene, camera));
}

// --- 2. モデル読み込みと色味補正 ---
window.loadCourtroom = function() {
  const loader = new MMDLoader();
  const pmxPath = 'assets/three/trialPlace/trial.pmx'; // あなたのファイル名
  loader.load(pmxPath, (mesh) => {
    mmdMesh = mesh;
    mesh.traverse((child) => {
    if (child.isMesh) {
      // マテリアルが配列（複数）の場合と単体の場合の両方に対応させる
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((mat) => {
        // 1. emissiveが存在するかチェックしてから実行
        if (mat.emissive && typeof mat.emissive.setHex === 'function') {
          mat.emissive.setHex(0x000000);
        }
        // 2. テクスチャの色空間設定
        if (mat.map) {
          mat.map.colorSpace = THREE.SRGBColorSpace;
          mat.map.needsUpdate = true; // 反映を確実にする
        }
        // 3. 白っぽさを抑えるための「鏡面反射」リセット
        if (mat.specular && typeof mat.specular.setHex === 'function') {
          mat.specular.setHex(0x111111); // ギラつきを抑える暗いグレー
        }
        mat.transparent = false;
      });
    }
  });
  scene.add(mmdMesh);
  spawnStandIn("assets/three/characters/TATURO/Taturo_Consider.png", {x: 0, y: 16, z: -27}, 0, {x: 1.0, y: 1.0, z: 1.0});
  spawnStandIn("assets/three/characters/FAKEFURUICHI/FakeFuruichi_Normal.png", {x: -20, y: 16, z: -18}, 45, {x: 1.0, y: 1.0, z: 1.0});
  spawnStandIn("assets/three/characters/RYUJI/Ryuji_Normal.png", {x: -28, y: 16, z: 0}, 90, {x: 1.0, y: 1.0, z: 1.0});
  spawnStandIn("assets/three/characters/KENTO/Kento_Normal.png", {x: -20, y: 16, z: 18}, 135, {x: 1.0, y: 1.0, z: 1.0});  
  spawnStandIn("assets/three/characters/SHIGE/Shige_Normal.png", {x: 0, y: 16.7, z: 27}, 180, {x: 1.0, y: 1.0, z: 1.0}); // ここで呼び出す！
  spawnStandIn("assets/three/characters/KEIZO/Keizo_Normal.png", {x: 20, y: 15.5, z: 18}, 225, {x: 1.0, y: 1.0, z: 1.0});
  spawnStandIn("assets/three/characters/MITSUHIRO/Mitsuhiro_Normal.png", {x: 20, y: 16, z: -19}, -45, {x: 1.0, y: 1.0, z: 1.0});
  const canvas = renderer.domElement;
  void canvas.offsetWidth;
  canvas.style.opacity = "1";
  const blackScreen = document.getElementById("blackScreen");
  if (blackScreen) {
    void blackScreen.offsetWidth; // 念のためブラウザに強制描画させる
    blackScreen.style.opacity = 0; // じわーっと消す
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

// --- 3. ループ ---
window.animate = function() {
  requestAnimationFrame(animate);
  controls.update(); // Dampingを有効にするため
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  if (!renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/**

* 4. テスト用身代わりキャラクターを配置

*/

window.spawnStandIn = function(imagePath, position = { x: 0, y: 16, z: 45 }, rotationY = 0, scale = {x: 1, y: 1, z: 1}) {
    const loader = new THREE.TextureLoader();
    
    loader.load(imagePath, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const geometry = new THREE.PlaneGeometry(25, 30); 

        // 表面
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.FrontSide,
            alphaTest: 0.5 
        });
        const standIn = new THREE.Mesh(geometry, material);
        
        // --- 位置と角度を設定 ---
        standIn.position.set(position.x, position.y, position.z);
        standIn.rotation.y = rotationY * (Math.PI / 180);
        standIn.scale.set(scale.x, scale.y, scale.z)
        // 背面（裏側）
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



//camera関数
let cameraAnimation = {
  active: false,
  toPos: new THREE.Vector3(),
  speed: 0,
  toRotation: new THREE.Euler(),
  rotSpeed: 0,
  toFov: 45,
  fovSpeed: 1,
  onComplete: null 
};

/**
 * カメラを指定した位置・角度へ移動させる関数（Promise ＆ オブジェクト引数版）
 */
window.cameraMove = function({
  from = null,
  to = {},
  speed = null,
  toFov = null,       // nullなら現在のカメラの画角を引き継ぐ
  fovSpeed = null,
  yaw = null,         // ⭕ 初期値 null
  pitch = null,       // ⭕ 初期値 null
  roll = null,        // ⭕ 初期値 null
  rotSpeed = null,
} = {}) {
  // async/await で待機できるように Promise を返す
  return new Promise((resolve) => {
    
    // 1. 開始位置（from）のワープ処理
    if (from) {
      camera.position.set(from.x, from.y, from.z);
    }

    // 2. 目的地の安全な読み込み
    const targetX = to.toX !== undefined ? to.toX : (to.x !== undefined ? to.x : camera.position.x);
    const targetY = to.toY !== undefined ? to.toY : (to.y !== undefined ? to.y : camera.position.y);
    const targetZ = to.toZ !== undefined ? to.toZ : (to.z !== undefined ? to.z : camera.position.z);
    cameraAnimation.toPos.set(targetX, targetY, targetZ);
    
    // speed の判定用変数を事前に作っておく
    const finalSpeed = (speed !== null) ? speed : 0.8;
    cameraAnimation.speed = finalSpeed;

    // 3. ⭕ 目標の回転を設定（未指定なら現在のカメラの角度をキープ）
    camera.rotation.order = 'YXZ';
    const targetPitch = (pitch !== null && pitch !== undefined) ? pitch * (Math.PI / 180) : camera.rotation.x;
    const targetYaw   = (yaw !== null && yaw !== undefined)     ? yaw * (Math.PI / 180)   : camera.rotation.y;
    const targetRoll  = (roll !== null && roll !== undefined)   ? roll * (Math.PI / 180)  : camera.rotation.z;

    cameraAnimation.toRotation.set(targetPitch, targetYaw, targetRoll, 'YXZ');
    
    const finalRotSpeed = (rotSpeed !== null) ? rotSpeed : 0.05;
    cameraAnimation.rotSpeed = finalRotSpeed;

    // 4. ズーム（FOV）の安全処理
    const targetFov = (toFov && toFov !== 0) ? toFov : camera.fov;
    cameraAnimation.toFov = targetFov;

    if (fovSpeed === null || fovSpeed === undefined) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
      cameraAnimation.fovSpeed = 999;
    } else {
      cameraAnimation.fovSpeed = fovSpeed;
    }

    // 5. 終了時に Promise の完了（resolve）を呼ぶように仕込む
    cameraAnimation.onComplete = () => {
      resolve(); 
    };

    if (controls) controls.enabled = false;

    // 💡【ここが本当の解決策】
    // スピードが999（一瞬で移動）の場合、変なフライング関数を呼ばず、
    // 「ただちに値を同期して、速攻で resolve() を直接実行して終了」させます。
    // これなら Promise の仕組みを1ミリも壊さず、await が確実に機能します！！
    if (finalSpeed >= 999 || finalRotSpeed >= 999 || cameraAnimation.fovSpeed >= 999) {
      camera.position.copy(cameraAnimation.toPos);
      camera.rotation.copy(cameraAnimation.toRotation);
      camera.fov = cameraAnimation.toFov;
      camera.updateProjectionMatrix();
      
      cameraAnimation.active = false;
      resolve(); // ⭕ 迷子にさせず、その場で直接 await を解除する！
      return;
    }

    cameraAnimation.active = true;
  });
};

// --- ループ関数 ---
window.animate = function() {
  requestAnimationFrame(animate);

  if (cameraAnimation.active) {
    // ① 位置の等速移動
    const dir = new THREE.Vector3().subVectors(cameraAnimation.toPos, camera.position);
    const dist = dir.length();

    if (dist <= cameraAnimation.speed) {
      camera.position.copy(cameraAnimation.toPos);
    } else {
      dir.normalize().multiplyScalar(cameraAnimation.speed);
      camera.position.add(dir);
    }

    // ② 回転の等速補間
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

    // ③ ズーム（FOV）の等速変化
    const fovDiff = cameraAnimation.toFov - camera.fov;
    if (Math.abs(fovDiff) <= cameraAnimation.fovSpeed) {
      camera.fov = cameraAnimation.toFov;
    } else {
      camera.fov += Math.sign(fovDiff) * cameraAnimation.fovSpeed;
    }
    camera.updateProjectionMatrix();

    // ④ 到着判定（位置の完全一致のバグを回避するため、距離チェックに変更）
    const isPosEnd = camera.position.distanceTo(cameraAnimation.toPos) < 0.01;
    const isRotEnd = (Math.abs(camera.rotation.x - cameraAnimation.toRotation.x) < 0.01) &&
                     (Math.abs(camera.rotation.y - cameraAnimation.toRotation.y) < 0.01) &&
                     (Math.abs(camera.rotation.z - cameraAnimation.toRotation.z) < 0.01);
    const isFovEnd = (Math.abs(camera.fov - cameraAnimation.toFov) < 0.01);

    if (isPosEnd && isRotEnd && isFovEnd) {
      cameraAnimation.active = false;
      // 最後に値を完全に同期
      camera.position.copy(cameraAnimation.toPos);
      camera.rotation.copy(cameraAnimation.toRotation);
      camera.fov = cameraAnimation.toFov;
      
      if (typeof cameraAnimation.onComplete === 'function') {
        cameraAnimation.onComplete(); // 次の await へ
      }
    }
  } else {
    if (controls && controls.enabled) {
      controls.update();
    }
  }
  renderer.render(scene, camera);
};