let debateController = null;
window.updateTimerUI = function(remainingMs) {
  const timerElement = document.getElementById("timeUI");
  if (!timerElement) return;

  // マイナスにならないようにガード
  const msTotal = Math.max(0, remainingMs);

  // 1. 🕒 各単位に分解する計算
  const minutes = Math.floor(msTotal / 60000);          // 分（1分＝60000ms）
  const seconds = Math.floor((msTotal % 60000) / 1000); // 秒（1秒＝1000ms）
  const millis  = Math.floor(msTotal % 1000);           // ミリ秒（0〜999）

  // 2. ✨ 桁数を揃える（ゼロ埋め）
  // padStart(桁数, "0") を使うと、1桁のとき（例: 5）に自動で「05」にしてくれます
  const strMin = String(minutes).padStart(2, "0");
  const strSec = String(seconds).padStart(2, "0");
  
  // 💡 ミリ秒は下3桁にする（画像っぽく下2桁にしたい場合は padStart(2, "0") にして Math.floor(millis / 10) にしてください）
  const strMs  = String(millis).padStart(3, "0");

  // 3. 🖥️ ドッキングして画面に表示！（例: "00:49:523"）
  timerElement.innerText = `${strMin}:${strSec}:${strMs}`;

  // 🚨 残り10秒以下の赤点滅演出（ここはそのまま引き継ぎ）
  if (msTotal <= 10000) {
    timerElement.style.color = "#ff3333";
    timerElement.style.textShadow = "0 0 15px #ff0000, 3px 3px 0px #000";
  } else {
    timerElement.style.color = "#fff";
    timerElement.style.textShadow = "0 0 10px #ff0055, 3px 3px 0px #000";
  }
};

window.nonstopDebate1 = async function () {
  console.log("【デバッグ】nonstopDebate1 が呼び出されました");

  if (debateController) {
    console.log("【デバッグ】過去のコントローラーが存在するため abort します");
    debateController.abort();
  }
  
  debateController = new AbortController();
  const signal = debateController.signal;
  
  // ⏳ 制限時間を本番用の50秒に（whileの外なので周回でリセットされません）
  currentDebateTime = 180000; 
  gameSpeed = 1.0;

  const handleKeyDown = (e) => {
    // Zキー（小文字・大文字両対応）が押されたらスロー（0.3倍速）にする
    if (e.key === "z" || e.key === "Z") {
      gameSpeed = 0.3; // 💡 本家風の絶妙なスロー倍率
    }
  };

  const handleKeyUp = (e) => {
    // Zキーが離されたら元の速度（1.0倍速）に戻す
    if (e.key === "z" || e.key === "Z") {
      gameSpeed = 1.0;
    }
  };

  // イベントリスナーを登録
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  // ーーー 🕒 ここから：タイマー専用の裏ループ ーーー
  let lastTimerTime = performance.now();
  function updateTimerLoop(now) {
    if (signal.aborted) return; // 中断されたらタイマー停止

    let realDelta = now - lastTimerTime;
    lastTimerTime = now;

    let gameDelta = realDelta * gameSpeed; // スロー対応
    currentDebateTime -= gameDelta;        // 時間を減らす

    if (typeof window.updateTimerUI === "function") {
      window.updateTimerUI(currentDebateTime);
    }

    if (currentDebateTime <= 0) {
      currentDebateTime = 0;
      console.log("⏰ タイムアップ！");
      debateController.abort(); // ループを強制ストップ
      return;
    }
    requestAnimationFrame(updateTimerLoop);
  }
  requestAnimationFrame(updateTimerLoop);

  try {
    let loopCount = 1;
    while (!signal.aborted) {
      console.log(`--- 🔄 議論ループ 第 ${loopCount} 周目 ---`);
      await window.moveCameraPromise({to: {toX: -10, toY: 16, toZ: -1},toFov: 45, fovSpeed: 999, speed: 100, yaw: 78, rotSpeed: 5,duration: 500}, signal);

      window.ndIconChange("シノハラ　リュウジ");
      window.spawnFlexibleSerif("退職させられたのは<br>オカモトユウダイ先生...", 55, 20, window.serifBehaviors.linearLeft, 3000);
      window.changeStandInExpression("RYUJI", "assets/three/characters/RYUJI/Ryuji_Think.png")
      await window.moveCameraPromise({to: {toX: -10, toY: 23, toZ: -1},toFov: 45, fovSpeed: 999, speed: 1, yaw: 78, rotSpeed: 0.1,duration: 3000}, signal);
      if (signal.aborted) {
        console.log("⚠️ セクション1の直後で signal.aborted を検知したため break します");
        break;
      }

      await window.moveCameraPromise({to: {toX: -10, toY: 20, toZ: 7},toFov: 30, fovSpeed: 1, speed: 1, yaw: 75, rotSpeed: 0.1,duration: 500}, signal);

      window.spawnFlexibleSerif("現場は<span class='weak-target'>体育館</span>でしたよね？",10, 50, window.serifBehaviors.linearRight, 3000);
      window.changeStandInExpression("RYUJI", "assets/three/characters/RYUJI/Ryuji_Normal.png");
      await window.moveCameraPromise({to: {toX: -10, toY: 25, toZ: 7},toFov: 30, fovSpeed: 999, speed: 1, yaw: 75, rotSpeed: 0.1,duration: 3000}, signal);

      await window.moveCameraPromise({to: {toX: 0, toY: 23, toZ: 0}, toFov: 60, fovSpeed: 1, speed: 100, yaw: 132, rotSpeed: 5, duration: 500}, signal);

      window.ndIconChange("ササノ　ケント");
      window.spawnFlexibleSerif("しかも現場の近くには...", 55, 20, window.serifBehaviors.linearLeft, 3000);
      window.changeStandInExpression("KENTO", "assets/three/characters/KENTO/Kento_Think.png");
      await window.moveCameraPromise({to: {toX: 0, toY: 23, toZ: 0}, toFov: 60, fovSpeed: 1, speed: 100, yaw: 137, rotSpeed: 5, duration: 2500}, signal);

      loopCount++;
    }
    
    console.log("【デバッグ】whileループを正常に抜けました（signal.aborted が true になった等）");

  } catch (error) {
    console.error("🚨 【重大エラー】tryブロック内でエラーが発生し、中断されました:", error);
    console.error("エラーメッセージ:", error.message);
    console.error("スタックトレース:", error.stack);
  }
};