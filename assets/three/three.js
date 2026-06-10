
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
        standIn.scale.set(scale.x, scale.y, scale.z);
        const charName = imagePath.split('/').reverse()[1]; // 後ろから2番目のフォルダ名を取得
        standIn.name = charName;
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
  onComplete: null,
  lookAtPos: null,
  isSpiral: false,
  centerX: 0, centerY: 0, centerZ: 0,
  currentRadius: 0, targetRadius: 0,
  currentAngle: 0, spiralRotSpeed: 0, spiralApproachSpeed: 0
};

window.cameraMove = function({
  from = null,
  to = {},
  speed = null,
  toFov = null,       // nullなら現在のカメラの画角を引き継ぐ
  fovSpeed = null,
  yaw = 0,
  pitch = 0,
  roll = 0,
  rotSpeed = null,
  lookAtPos = null,
  spiral = null
} = {}) {
  // async/await で待機できるように Promise を返す
  return new Promise((resolve) => {
    
    // 1. 開始位置（from）のワープ処理
    if (from) {
      camera.position.set(from.x, from.y, from.z);
      camera.rotation.set(0, 0, 0, 'YXZ');
    }
    if (spiral) {
      cameraAnimation.isSpiral = true;
      cameraAnimation.centerX = spiral.cx || 0;
      cameraAnimation.centerY = spiral.cy || 20;
      cameraAnimation.centerZ = spiral.cz || 0;
      cameraAnimation.currentRadius = spiral.startRadius || 100;
      cameraAnimation.targetRadius = spiral.endRadius || 100; // startと同じならキープされる
      cameraAnimation.currentAngle = spiral.startAngle || 0;
      
      // 💡【追加】何ラジアン分まわるかのゴールを計算（例：2π = 360度分まわる）
      // spiral.turnAngle に 360 などを指定できるようにする（未指定なら1回転分）
      const turnRad = (spiral.turnAngle !== undefined) ? spiral.turnAngle * (Math.PI / 180) : Math.PI * 2;
      cameraAnimation.targetAngle = cameraAnimation.currentAngle + turnRad;

      cameraAnimation.spiralRotSpeed = spiral.rotSpeed || 0.03;
      
      // 💡 半径が同じなら、近づく速度（approachSpeed）は自動的に「0」にするセーフティ
      cameraAnimation.spiralApproachSpeed = (spiral.startRadius === spiral.endRadius) ? 0 : (spiral.approachSpeed || 0.5);
      
      cameraAnimation.speed = speed || 0.5;
      cameraAnimation.toPos.set(to.x || 0, to.y || 20, to.z || 0);
    } else {
      cameraAnimation.isSpiral = false; // 通常モード
      // 2. 目的地の安全な読み込み（zでもtoZでも、未指定なら現在地を維持）
      const targetX = to.toX !== undefined ? to.toX : (to.x !== undefined ? to.x : camera.position.x);
      const targetY = to.toY !== undefined ? to.toY : (to.y !== undefined ? to.y : camera.position.y);
      const targetZ = to.toZ !== undefined ? to.toZ : (to.z !== undefined ? to.z : camera.position.z);
      cameraAnimation.toPos.set(targetX, targetY, targetZ);
    
      // nullが混入したときのセーフティガード
      cameraAnimation.speed = (speed !== null) ? speed : 0.8;
    
      if (lookAtPos) {
        cameraAnimation.lookAtPos = new THREE.Vector3(lookAtPos.x, lookAtPos.y, lookAtPos.z);
      } else {
        cameraAnimation.lookAtPos = null;
      }

      // 3. 目標の回転を設定
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

      // 4. ズーム（FOV）の安全処理（0やnullなら今の設定をキープ）
      const targetFov = (toFov && toFov !== 0) ? toFov : camera.fov;
      cameraAnimation.toFov = targetFov;

      if (fovSpeed === null || fovSpeed === undefined) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
        cameraAnimation.fovSpeed = 999; // 一瞬
      } else {
        cameraAnimation.fovSpeed = fovSpeed;
      }
    }
    // 5. 終了時に Promise の完了（resolve）を呼ぶように仕込む
    cameraAnimation.onComplete = () => { resolve(); };

    if (controls) controls.enabled = false;
    cameraAnimation.active = true;
  });
};

// --- ループ関数（直線移動・手動回転・lookAt・さらに自動らせん軌道まで完全共存！） ---
window.animate = function() {
  requestAnimationFrame(animate);

  if (cameraAnimation.active) {
    
    // 💡 Aパターン：データ側から「らせん軌道（spiral）」の指定がある場合
    if (cameraAnimation.isSpiral) {
      // 毎フレーム、角度を少しずつ変化させる
      cameraAnimation.currentAngle += cameraAnimation.spiralRotSpeed;
      
      // 半径も少しずつ縮める（これで外側から中心へ吸い込まれる「らせん」になる）
      if (cameraAnimation.currentRadius > cameraAnimation.targetRadius) {
        cameraAnimation.currentRadius -= cameraAnimation.spiralApproachSpeed;
      } else {
        cameraAnimation.currentRadius = cameraAnimation.targetRadius;
      }

      // 高度（Y軸）も少しずつ下げる
      if (Math.abs(camera.position.y - cameraAnimation.toPos.y) > 0.5) {
        camera.position.y += Math.sign(cameraAnimation.toPos.y - camera.position.y) * cameraAnimation.speed;
      }

      // ★数学の魔法：角度と半径から、次の瞬間のXYZ座標を自動計算してカメラを動かす！
      camera.position.x = cameraAnimation.centerX + cameraAnimation.currentRadius * Math.cos(cameraAnimation.currentAngle);
      camera.position.z = cameraAnimation.centerZ + cameraAnimation.currentRadius * Math.sin(cameraAnimation.currentAngle);

      // 視線は常に中心（証言台）を強制ロックオン！
      camera.lookAt(new THREE.Vector3(cameraAnimation.centerX, cameraAnimation.centerY, cameraAnimation.centerZ));

      // 到着判定：半径と高度が目的地に達したら終了
      const isAngleEnd = (cameraAnimation.spiralRotSpeed > 0) 
        ? (cameraAnimation.currentAngle >= cameraAnimation.targetAngle)
        : (cameraAnimation.currentAngle <= cameraAnimation.targetAngle);
      const isHeightEnd = (Math.abs(camera.position.y - cameraAnimation.toPos.y) <= 0.5);
      
      if (isAngleEnd && isHeightEnd) {
        cameraAnimation.active = false;
        if (typeof cameraAnimation.onComplete === 'function') cameraAnimation.onComplete();
      }

    } 
    // 💡 Bパターン：これまでの通常移動（等速直線移動 ＋ 手動回転 or lookAt）
    else {
      // ① 位置の等速移動（今までのコードそのまま）
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

      // ② 回転の等速補間（今までのコードそのまま）
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

      // ③ ズーム（FOV）の等速変化
      let isFovEnd = false;
      const fovDiff = cameraAnimation.toFov - camera.fov;
      if (Math.abs(fovDiff) <= cameraAnimation.fovSpeed) {
        camera.fov = cameraAnimation.toFov;
        isFovEnd = true;
      } else {
        camera.fov += Math.sign(fovDiff) * cameraAnimation.fovSpeed;
      }
      camera.updateProjectionMatrix();

      // ④ 終了判定
      if (isPosEnd && isRotEnd && isFovEnd) {
        cameraAnimation.active = false;
        if (typeof cameraAnimation.onComplete === 'function') cameraAnimation.onComplete();
      }
    }
  } else {
    if (controls && controls.enabled) { 
      controls.update();
    }
  }
  renderer.render(scene, camera);
};

/**
 * 立ち絵（テクスチャ）を瞬時に切り替える関数
 * @param {string} charName - キャラクターの名前（例: "RYUJI"）
 * @param {string} newImagePath - 新しい表情の画像パス
 */
window.changeStandInExpression = function(charName, newImagePath) {
  // 1. シーン内から、指定した名前のキャラクター（Mesh）を探し出す
  const targetMesh = scene.getObjectByName(charName);
  
  if (!targetMesh) {
    console.warn(`【警告】${charName} というキャラクターが見つかりません。`);
    return;
  }

  // 2. 新しいテクスチャをロードする
  const loader = new THREE.TextureLoader();
  loader.load(newImagePath, (newTexture) => {
    newTexture.colorSpace = THREE.SRGBColorSpace; // 色空間を合わせる

    // 3. 表面（マテリアル）のテクスチャを差し替える
    targetMesh.material.map = newTexture;
    targetMesh.material.needsUpdate = true; // Three.jsに更新を通知

    // 4. 裏面（影用の黒板）のテクスチャも一緒に差し替える
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