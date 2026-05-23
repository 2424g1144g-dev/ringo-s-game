
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
// --- カメラ移動の状態を管理するオブジェクト ---
let cameraAnimation = {
  active: false,
  toPos: new THREE.Vector3(),
  speed: 0,
  toRotation: new THREE.Euler(),
  rotSpeed: 0,
  onComplete: null // イベント発火用のコールバック関数
};

/**
 * カメラを指定した位置・角度へ移動させる関数
 * @param {Object} from - 開始位置 {x, y, z} (null の場合は現在位置からスタート)
 * @param {Object} to - 目標位置 {toX, toY, toZ}
 * @param {number} speed - 移動速度（毎フレーム近づく割合 0.0〜1.0。基本は 0.05 など）
 * @param {number} yaw - 左右回転（度数法：deg）
 * @param {number} pitch - 上下回転（度数法：deg）
 * @param {number} roll - 画面回転（度数法：deg）
 * @param {number} rotSpeed - 回転速度（毎フレーム近づく割合 0.0〜1.0）
 * @param {Function} onComplete - 目標位置に到達したときに発火するイベント（コールバック）
 */
window.cameraMove = function(
  from, 
  { toX, toY, toZ }, 
  speed,
  toFov = 45,
  fovSpeed = null, 
  yaw = 0, 
  pitch = 0, 
  roll = 0, 
  rotSpeed = 0.05,
  onComplete = null
) {
  // 1. 開始位置（from）が指定されていれば、カメラをそこにワープさせる
  if (from) {
    camera.position.set(from.x, from.y, from.z);
  }
  // 2. 目標の位置と速度を設定
  cameraAnimation.toPos.set(toX, toY, toZ);
  cameraAnimation.speed = speed;
  // 3. 目標の回転を設定（度数法からラジアンに変換。カメラに適した'YXZ'順）
  cameraAnimation.toRotation.set(
    pitch * (Math.PI / 180), // X軸（上下）
    yaw * (Math.PI / 180),   // Y軸（左右）
    roll * (Math.PI / 180),  // Z軸（画面回転）
    'YXZ'
  );
  if (fovSpeed === null) {
    camera.fov = toFov;
    camera.updateProjectionMatrix();
    cameraAnimation.fovSpeed = 1;
  } else {
    cameraAnimation.fovSpeed = fovSpeed;
  }
  cameraAnimation.onComplete = onComplete;
  if (controls) controls.enabled = false;
  cameraAnimation.active = true;
  cameraAnimation.rotSpeed = rotSpeed;
  // 4. 到着時のイベントを登録
  cameraAnimation.onComplete = onComplete;
  // 移動中は手動操作（OrbitControls）を無効化して衝突を防ぐ
  if (controls) controls.enabled = false;
  // アニメーションフラグをON
  cameraAnimation.active = true;
};

// --- 3. ループ（既存の関数を書き換え） ---
window.animate = function() {
  requestAnimationFrame(animate);
  // カメラのアニメーションがアクティブな場合
  if (cameraAnimation.active) {
    // ① 位置の補間 (Lerpによる自動ease-out)
    camera.position.lerp(cameraAnimation.toPos, cameraAnimation.speed);
    // ② 回転の補間 (Slerpによる滑らかな回転補間)
    const targetQuaternion = new THREE.Quaternion().setFromEuler(cameraAnimation.toRotation);
    camera.quaternion.slerp(targetQuaternion, cameraAnimation.rotSpeed);
    // ③ 到着判定 (目標座標との距離が極めて小さくなったら到着とみなす)
    const distance = camera.position.distanceTo(cameraAnimation.toPos);
    if (distance < 0.01) {
      // 完全に目標値に固定
      camera.position.copy(cameraAnimation.toPos);
      camera.quaternion.setFromEuler(cameraAnimation.toRotation);
      // アニメーションを終了
      cameraAnimation.active = false;
      // 💡イベント発火！(設定された関数を実行)
      if (typeof cameraAnimation.onComplete === 'function') {
        cameraAnimation.onComplete();
      }
    }
  } else {
    // アニメーション中でない場合のみ、手動操作のアップデートを行う
    if (controls && controls.enabled) {
      controls.update();
    }
  }
  renderer.render(scene, camera);
}