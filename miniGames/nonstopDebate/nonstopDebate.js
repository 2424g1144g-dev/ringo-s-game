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
    // 呼び出された時点で中断されていれば即終了
    if (signal.aborted) return reject(new Error("Aborted"));

    // 1. PDFにある元のカメラ設定関数を呼び出し、安全にすべての目標値をセットさせる
    window.cameraMove(config); 
    
    // 2. 元のコールバック関数を退避させ、このPromiseのresolveと同期させる
    const originalOnComplete = cameraAnimation.onComplete;
    cameraAnimation.onComplete = null; 
    cameraAnimation.active = false; // 一旦メインの window.animate 側での自動等速移動を止める

    let lastTime = performance.now();
    let animationProgress = 0; // 0.0 〜 1.0 の進捗管理

    // 通常モード用の初期状態をバックアップ（線形補間 LERP 用）
    const startPosition = camera.position.clone();
    const startRotation = camera.rotation.clone();
    const startFov = camera.fov;

    // らせんモード用の追加初期化
    if (cameraAnimation.isSpiral) {
      // PDFの初期化によって camera.position が既にらせん開始位置にワープしているので、それを開始地点とする
      startPosition.copy(camera.position);
      // 最初のlookAtを強制適用
      camera.lookAt(new THREE.Vector3(cameraAnimation.centerX, cameraAnimation.centerY, cameraAnimation.centerZ));
      startRotation.copy(camera.rotation);
    }

    function animate(now) {
      // 毎フレームの中断チェック
      if (signal.aborted) {
        cameraAnimation.active = false;
        return reject(new Error("Aborted"));
      }

      let realDelta = now - lastTime;
      lastTime = now;

      // 🔥 ゲームスピード（スロー）を適用した時間差分
      let gameDelta = realDelta * gameSpeed;

      // ⏰ 制限時間の減算
      currentDebateTime -= gameDelta;
      if (typeof updateTimerUI === "function") updateTimerUI(currentDebateTime);

      if (currentDebateTime <= 0) {
        if (typeof onDebateTimeout === "function") onDebateTimeout();
        cameraAnimation.active = false;
        return reject(new Error("Timeout"));
      }

      // 🎥 指定時間(duration)に対する進捗率(t)を計算
      animationProgress += gameDelta / (config.duration || 3000);
      const t = THREE.MathUtils.clamp(animationProgress, 0, 1);

      // 共通の FOV（ズーム）補間
      camera.fov = THREE.MathUtils.lerp(startFov, cameraAnimation.toFov, t);
      camera.updateProjectionMatrix();

      // --- モード別のカメラ座標・角度計算 ---
      if (cameraAnimation.isSpiral) {
        // 🌀 Aパターン: らせん軌道の時間補間 (PDFの計算式を gameSpeed/duration に完全同期)
        // 開始時の角度から、turnAngle（目標の回転総量）まで t に応じて進める
        const startAngle = (config.spiral.startAngle || 0) * (Math.PI / 180);
        const turnRad = (config.spiral.turnAngle || 0) * (Math.PI / 180);
        const targetAngle = startAngle + turnRad;
        
        const currentAngle = THREE.MathUtils.lerp(startAngle, targetAngle, t);
        const currentRadius = THREE.MathUtils.lerp(cameraAnimation.startRadius, cameraAnimation.targetRadius, t);
        
        camera.position.y = THREE.MathUtils.lerp(startPosition.y, cameraAnimation.targetY, t);
        camera.position.x = cameraAnimation.centerX + currentRadius * Math.cos(currentAngle);
        camera.position.z = cameraAnimation.centerZ + currentRadius * Math.sin(currentAngle);
        
        // 常に中心をロックオン
        camera.lookAt(new THREE.Vector3(cameraAnimation.centerX, cameraAnimation.centerY, cameraAnimation.centerZ));

      } else {
        // 🏃 Bパターン: 通常移動の時間補間
        // 位置のLERP
        camera.position.lerpVectors(startPosition, cameraAnimation.toPos, t);

        // 回転のLERP
        if (cameraAnimation.lookAtPos) {
          camera.lookAt(cameraAnimation.lookAtPos);
        } else {
          camera.rotation.x = THREE.MathUtils.lerp(startRotation.x, cameraAnimation.toRotation.x, t);
          camera.rotation.y = THREE.MathUtils.lerp(startRotation.y, cameraAnimation.toRotation.y, t);
          camera.rotation.z = THREE.MathUtils.lerp(startRotation.z, cameraAnimation.toRotation.z, t);
        }
      }

      // --- 🏁 終了判定 ---
      if (t >= 1) {
        // 最終フレームの座標を完全にターゲット値にカチッと固定する
        if (cameraAnimation.isSpiral) {
          const startAngle = (config.spiral.startAngle || 0) * (Math.PI / 180);
          const turnRad = (config.spiral.turnAngle || 0) * (Math.PI / 180);
          camera.position.set(
            cameraAnimation.centerX + cameraAnimation.targetRadius * Math.cos(startAngle + turnRad),
            cameraAnimation.targetY,
            cameraAnimation.centerZ + cameraAnimation.targetRadius * Math.sin(startAngle + turnRad)
          );
          camera.lookAt(new THREE.Vector3(cameraAnimation.centerX, cameraAnimation.centerY, cameraAnimation.centerZ));
        } else {
          camera.position.copy(cameraAnimation.toPos);
          if (cameraAnimation.lookAtPos) {
            camera.lookAt(cameraAnimation.lookAtPos);
          } else {
            camera.rotation.copy(cameraAnimation.toRotation);
          }
        }
        camera.fov = cameraAnimation.toFov;
        camera.updateProjectionMatrix();

        // 既存のコールバックがあれば一応実行して安全に解決
        if (typeof originalOnComplete === 'function') originalOnComplete();
        
        resolve(); // 🌟 ここで無事に次のセクションへ移行します！
        return;    // requestAnimationFrame を止める
      }

      // ループ継続
      requestAnimationFrame(animate);
    }

    // ループスタート
    requestAnimationFrame(animate);
  });
}