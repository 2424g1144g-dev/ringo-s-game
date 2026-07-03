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
  await sleep(800);
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

    // 1. 既存のカメラ設定関数(window.cameraMove)を呼び出して、目標値やらせんの初期位置を設定させる
    // ただし、既存の window.cameraMove 内の「cameraAnimation.active = true」や「resolve()」の
    // タイミングをこちらの promise で制御するため、一部処理をフックします。
    window.cameraMove(config); 
    
    // cameraMoveがセットしたコールバックを無効化し、こちらでコントロールする
    cameraAnimation.onComplete = null; 
    cameraAnimation.active = false; // 既存の animate() ループ側では動かさないようにする

    let lastTime = performance.now();
    let animationProgress = 0; // アニメーション全体の進行度 (0〜1)

    // 通常移動の場合の初期位置・角度を退避（線形補間のため）
    const startPosition = camera.position.clone();
    const startRotation = camera.rotation.clone();
    const startFov = camera.fov;

    function animate(now) {
      if (signal.aborted) {
        cameraAnimation.active = false; // カメラ動作を完全に停止
        return reject(new Error("Aborted"));
      }

      let realDelta = now - lastTime;
      lastTime = now;

      // 🔥 ゲーム内時間（スロー対応）
      let gameDelta = realDelta * gameSpeed;

      // ⏰ 制限時間の減算
      currentDebateTime -= gameDelta;
      if (typeof updateTimerUI === "function") updateTimerUI(currentDebateTime);

      if (currentDebateTime <= 0) {
        if (typeof onDebateTimeout === "function") onDebateTimeout();
        cameraAnimation.active = false;
        return reject(new Error("Timeout"));
      }

      // 🎥 既存の「window.animate」内の計算ロジックを、gameDeltaベースでここに移植・実行する
      if (cameraAnimation.isSpiral) {
        // --- 🌀 Aパターン: らせん軌道の処理（gameSpeed同期版） ---
        // 1. 角度を進める（gameSpeedを乗算）
        cameraAnimation.currentAngle += cameraAnimation.spiralRotSpeed * (gameDelta / 16.66); // 60fps換算の係数調整
        
        // 2. 半径の補間
        const rDiff = cameraAnimation.targetRadius - cameraAnimation.currentRadius;
        const radiusStep = cameraAnimation.spiralApproachSpeed * (gameDelta / 16.66);
        if (Math.abs(rDiff) <= radiusStep) {
          cameraAnimation.currentRadius = cameraAnimation.targetRadius;
        } else {
          cameraAnimation.currentRadius += Math.sign(rDiff) * radiusStep;
        }

        // 3. 進捗率（高さ用）の計算
        let progress = 0;
        if (cameraAnimation.startRadius !== cameraAnimation.targetRadius) {
          progress = (cameraAnimation.startRadius - cameraAnimation.currentRadius) / (cameraAnimation.startRadius - cameraAnimation.targetRadius);
        } else {
          const currentDiff = Math.abs(cameraAnimation.targetAngle - cameraAnimation.currentAngle);
          const totalDiff = Math.abs(cameraAnimation.targetAngle - (cameraAnimation.targetAngle - cameraAnimation.currentAngle)) || 1;
          progress = 1 - (currentDiff / totalDiff);
        }
        progress = THREE.MathUtils.clamp(progress, 0, 1);

        // 高さとXYZ座標の適用
        camera.position.y = cameraAnimation.startY + (cameraAnimation.targetY - cameraAnimation.startY) * progress;
        camera.position.x = cameraAnimation.centerX + cameraAnimation.currentRadius * Math.cos(cameraAnimation.currentAngle);
        camera.position.z = cameraAnimation.centerZ + cameraAnimation.currentRadius * Math.sin(cameraAnimation.currentAngle);
        camera.lookAt(new THREE.Vector3(cameraAnimation.centerX, cameraAnimation.centerY, cameraAnimation.centerZ));

        // 終了判定（角度と半径がターゲットに達したか）
        const isAngleEnd = (cameraAnimation.spiralRotSpeed > 0) 
          ? (cameraAnimation.currentAngle >= cameraAnimation.targetAngle)
          : (cameraAnimation.currentAngle <= cameraAnimation.targetAngle);
        const isRadiusEnd = cameraAnimation.currentRadius === cameraAnimation.targetRadius;

        if (isAngleEnd && isRadiusEnd) {
          // カチッと最終座標に合わせる
          camera.position.set(
            cameraAnimation.centerX + cameraAnimation.targetRadius * Math.cos(cameraAnimation.targetAngle),
            cameraAnimation.targetY,
            cameraAnimation.centerZ + cameraAnimation.targetRadius * Math.sin(cameraAnimation.targetAngle)
          );
          camera.lookAt(new THREE.Vector3(cameraAnimation.centerX, cameraAnimation.centerY, cameraAnimation.centerZ));
          resolve(); 
          return;
        }

      } else {
        // --- 🏃 Bパターン: 通常移動の処理（gameSpeed同期版） ---
        // animationProgressをベースに、config.durationに対してどれだけ進んだかで等速・線形補間(LERP)します
        animationProgress += gameDelta / (config.duration || 3000);
        const t = THREE.MathUtils.clamp(animationProgress, 0, 1);

        // ① 位置の補間
        camera.position.lerpVectors(startPosition, cameraAnimation.toPos, t);

        // ② 回転の補間
        if (cameraAnimation.lookAtPos) {
          camera.lookAt(cameraAnimation.lookAtPos);
        } else {
          camera.rotation.x = THREE.MathUtils.lerp(startRotation.x, cameraAnimation.toRotation.x, t);
          camera.rotation.y = THREE.MathUtils.lerp(startRotation.y, cameraAnimation.toRotation.y, t);
          camera.rotation.z = THREE.MathUtils.lerp(startRotation.z, cameraAnimation.toRotation.z, t);
        }

        // ③ FOVの補間
        camera.fov = THREE.MathUtils.lerp(startFov, cameraAnimation.toFov, t);
        camera.updateProjectionMatrix();

        if (t >= 1) {
          resolve(); // 目的地に到着！次のセクションへ
          return;
        }
      }

      // ループ継続
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  });
}