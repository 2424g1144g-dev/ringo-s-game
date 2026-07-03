// 「論」から「ノ」へ、つまり右側の文字から順番に表示させるためのJavaScript
const debate = document.getElementById("debate");
const spans = Array.from(debate.children);
const circle = document.getElementById("circleDebate");

// 配列を逆順（論、議、プ、ッ...）にする
const reverseSpans = spans.reverse();

window.nonstopDebateStart = function() {
  playSE("nonstopDebateStart");
  setTimeout (() => {
    debate.classList.add("runAway");
    circle.classList.add("zoomDisappear");
    document.getElementById("startDebate").classList.add("startAnim");
  }, 1500)
  reverseSpans.forEach((span, i) => {
    setTimeout(() => {
      span.classList.add("appear");
    }, i * 100); 
    // 最後の文字「ノ」が出るのが 7文字×150ms = 1050ms（約1秒後）
  });
}

window.addBullet = function(bulletText) {
  const bulletList = document.getElementById("bulletList");

  // 1. まずは中身が空っぽの「弾丸の器（div）」を1つ作る
  const bulletEl = document.createElement("div");
  bulletEl.className = "bullet"; // 基本クラスを付与

  // 2. その器の中に、Foot / Body / Head の中身を流し込む
  bulletEl.innerHTML = `
    <div class="bullet-Foot"></div>
    <div class="bullet-Body">${bulletText}</div>
    <div class="bullet-Head"></div>
  `;

  // 3. 親コンテナに追加する
  bulletList.appendChild(bulletEl);

  // 4. 💡 追加された「この1発」だけに、登場アニメーションクラスを付与！
  // わずかな時間差（リフロー待ち）を作ることで、確実にアニメーションを発動させます
  requestAnimationFrame(() => {
    bulletEl.classList.add("shoot-in");
  });
}

const bulletList = document.getElementById("bulletList");
let bulletNum = [];
let currentAngle = 0;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
window.loadAllBullets = async function(bullet) {
  bulletNum = bullet;
  for (const text of bulletNum) { 
    window.addBullet(text); 
    await sleep(180);
    currentAngle += 60;
    playSE("addBullet");
    document.getElementById("cylinder").style.setProperty('--angle', `${currentAngle}deg`);
    await sleep(220);
  }
  await sleep(2000); 
  console.log("すべての装填演出が終了しました。議論の文字送りなどを開始できます！");
  bulletList.classList.add("bulletGathering");
  document.getElementById("cylinderParents").style.left = "-800px";
  await sleep(800);
  document.getElementById("nonstopDebateUI").classList.add("show");
  await sleep(1200);
  window.nonstopDebate1();
}

window.showNDUI = function() {
  const UI = document.getElementById("nonstopDebateUI");
  UI.classList.add("show");
  setTimeout(() => {},)
}

const ndBullet = document.querySelector(".NDbullet");
const ndBulletBody = ndBullet.querySelector(".NDbullet-Body");
let currentBulletIndex = 0;
let NDcurrentAngle = 0;

// 💡 弾丸の配列（あなたのデータをここにセット）
const bulletNumi = ["ツカゴエの証言", "落ちていた紙コップ","ツカゴエのポケットに入っていたゴミ","消えた体育館のハンマー","西大寺高校の罠"];

// 💡 キーボードの入力を監視するイベントリスナー
window.addEventListener("keydown", (event) => {
  
  // 💡 event.key ではなく、左右を識別できる event.code を使います！
  if ((event.code === "ShiftLeft" || event.code === "ShiftRight") && !event.repeat) {
    
    const ndBullet = document.querySelector(".NDbullet");
    if (ndBullet.classList.contains("bulletChange")) return;
    
    //playSE("reload"); 
    
    // 💡 1. どっちのShiftが押されたかで、インデックスの計算を分岐させる！
    if (event.code === "ShiftRight") {
      // 👉 右Shiftなら：次の弾へ（進む）
      currentBulletIndex++;
      NDcurrentAngle += 60;
      document.getElementById("NDcylinder").style.setProperty('--NDangle', `${NDcurrentAngle}deg`);

      if (currentBulletIndex >= bulletNumi.length) {
        currentBulletIndex = 0; // 最後を超えたら最初に戻る
      }
    } else if (event.code === "ShiftLeft") {
      // 👈 左Shiftなら：前の弾へ（戻る）
      currentBulletIndex--;
      NDcurrentAngle -= 60;
      document.getElementById("NDcylinder").style.setProperty('--NDangle', `${NDcurrentAngle}deg`);
      if (currentBulletIndex < 0) {
        currentBulletIndex = bulletNumi.length - 1; // 0未満になったら最後の弾に戻る
      }
    }
    
    // 2. 🎬 左にシュッと閉じるアニメーション開始！
    ndBullet.classList.add("bulletChange");
    
    // 3. ちょうど閉じきった150msの瞬間に、判定された次の文字に書き換える
    setTimeout(() => {
      const ndBulletBody = ndBullet.querySelector(".NDbullet-Body");
      ndBulletBody.textContent = bulletNumi[currentBulletIndex];
    }, 150);
    
    // 4. アニメーション終了処理（300ms後）
    setTimeout(() => {
      ndBullet.classList.remove("bulletChange");
    }, 300);
  }
});


// --- 共通のゲームスピードとコントローラー（前回の設計をそのまま流用） ---
let debateController = null;
let currentDebateTime = 30000;
let gameSpeed = 1.0; // 通常1.0、スロー時0.3など

function moveCameraPromise(config, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new Error("Aborted"));

    let lastTime = performance.now();
    let animationProgress = 0; // 0.0 〜 1.0

    // --- 🏁 開始時のカメラ状態を完全に記憶 ---
    const startPosition = camera.position.clone();
    const startRotation = camera.rotation.clone();
    const startFov = camera.fov;

    // --- 🎯 目的地の FOV 設定 ---
    const targetFov = (config.toFov && config.toFov !== 0) ? config.toFov : camera.fov;

    // --- 🌀 らせん軌道（Spiral）用の初期化処理 ---
    const isSpiralMode = !!config.spiral;
    let spiralConfig = {};

    if (isSpiralMode) {
      const s = config.spiral;
      // PDFの初期化ロジックを忠実に再現 [cite: 56, 58, 61, 63, 67, 70, 71, 72]
      spiralConfig = {
        centerX: s.cx || 0,
        centerY: s.cy || 20,
        centerZ: s.cz || 0,
        startAngle: (s.startAngle || 0) * (Math.PI / 180),
        turnAngle: (s.turnAngle || 0) * (Math.PI / 180),
        startRadius: s.startRadius !== undefined ? s.startRadius : 100,
        endRadius: s.endRadius !== undefined ? s.endRadius : (s.startRadius || 100),
        targetY: (config.to && config.to.y !== undefined) ? config.to.y : camera.position.y
      };
      
      // らせんのスタート位置にカチッとワープさせる（PDFの78〜84行目の再現） [cite: 78, 81, 84]
      camera.position.x = spiralConfig.centerX + spiralConfig.startRadius * Math.cos(spiralConfig.startAngle);
      camera.position.z = spiralConfig.centerZ + spiralConfig.startRadius * Math.sin(spiralConfig.startAngle);
      camera.position.y = startPosition.y;
      camera.lookAt(new THREE.Vector3(spiralConfig.centerX, spiralConfig.centerY, spiralConfig.centerZ));
      
      // ワープ後の状態をあらためて開始位置として記憶
      startPosition.copy(camera.position);
      startRotation.copy(camera.rotation);
    } 
    // --- 🏃 通常移動用の初期化処理 ---
    else {
      // 目的地の座標を安全に取得（PDFの39〜43行目の仕様を再現） [cite: 39, 41, 43]
      const to = config.to || {};
      spiralConfig.targetX = to.toX !== undefined ? to.toX : (to.x !== undefined ? to.x : camera.position.x);
      spiralConfig.targetY = to.toY !== undefined ? to.toY : (to.y !== undefined ? to.y : camera.position.y);
      spiralConfig.targetZ = to.toZ !== undefined ? to.toZ : (to.z !== undefined ? to.z : camera.position.z);

      // 目標回転の設定（lookAtPos があればそれをクローンして計算、なければ yaw/pitch/roll）
      if (config.lookAtPos) {
        const tempCamera = camera.clone();
        tempCamera.position.set(spiralConfig.targetX, spiralConfig.targetY, spiralConfig.targetZ);
        tempCamera.lookAt(new THREE.Vector3(config.lookAtPos.x, config.lookAtPos.y, config.lookAtPos.z));
        spiralConfig.targetRotation = tempCamera.rotation.clone();
      } else {
        spiralConfig.targetRotation = new THREE.Euler(
          (config.pitch || 0) * (Math.PI / 180),
          (config.yaw || 0) * (Math.PI / 180),
          (config.roll || 0) * (Math.PI / 180),
          'YXZ'
        );
      }
    }

    // --- 🔄 毎フレームのループアニメーション ---
    function animate(now) {
      if (signal.aborted) return reject(new Error("Aborted"));

      let realDelta = now - lastTime;
      lastTime = now;

      // 🔥 ゲームスピード（スロー）対応の経過時間
      let gameDelta = realDelta * gameSpeed;

      // ⏰ 制限時間の減算
      currentDebateTime -= gameDelta;
      if (typeof updateTimerUI === "function") updateTimerUI(currentDebateTime);

      if (currentDebateTime <= 0) {
        if (typeof onDebateTimeout === "function") onDebateTimeout();
        return reject(new Error("Timeout"));
      }

      // 🎥 全体時間の進捗率（0.0 〜 1.0）
      animationProgress += gameDelta / (config.duration || 3000);
      const t = THREE.MathUtils.clamp(animationProgress, 0, 1);

      // 画角（FOV）の共通線形補間
      camera.fov = THREE.MathUtils.lerp(startFov, targetFov, t);
      camera.updateProjectionMatrix();

      if (isSpiralMode) {
        // --- 🌀 Aパターン: らせん軌道の時間同期 LERP 計算 ---
        // 進捗 t (0〜1) に応じて、角度、半径、高さを綺麗に一本道で計算します
        const currentAngle = THREE.MathUtils.lerp(spiralConfig.startAngle, spiralConfig.startAngle + spiralConfig.turnAngle, t);
        const currentRadius = THREE.MathUtils.lerp(spiralConfig.startRadius, spiralConfig.endRadius, t);
        
        camera.position.y = THREE.MathUtils.lerp(startPosition.y, spiralConfig.targetY, t);
        camera.position.x = spiralConfig.centerX + currentRadius * Math.cos(currentAngle);
        camera.position.z = spiralConfig.centerZ + currentRadius * Math.sin(currentAngle);
        
        // 視線は常に中心をロック
        camera.lookAt(new THREE.Vector3(spiralConfig.centerX, spiralConfig.centerY, spiralConfig.centerZ));
      } else {
        // --- 🏃 Bパターン: 通常移動の時間同期 LERP 計算 ---
        // 位置の補間
        camera.position.lerpVectors(startPosition, new THREE.Vector3(spiralConfig.targetX, spiralConfig.targetY, spiralConfig.targetZ), t);

        // 回転の補間
        if (config.lookAtPos) {
          camera.lookAt(new THREE.Vector3(config.lookAtPos.x, config.lookAtPos.y, config.lookAtPos.z));
        } else {
          camera.rotation.x = THREE.MathUtils.lerp(startRotation.x, spiralConfig.targetRotation.x, t);
          camera.rotation.y = THREE.MathUtils.lerp(startRotation.y, spiralConfig.targetRotation.y, t);
          camera.rotation.z = THREE.MathUtils.lerp(startRotation.z, spiralConfig.targetRotation.z, t);
        }
      }

      // 終了判定
      if (t >= 1) {
        resolve(); // 完全に処理を終了して次のセクションへ！
        return;
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  });
}