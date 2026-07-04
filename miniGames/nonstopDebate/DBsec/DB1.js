let debateController = null;
window.nonstopDebate1 = async function () {
  console.log("【デバッグ】nonstopDebate1 が呼び出されました");

  if (debateController) {
    console.log("【デバッグ】過去のコントローラーが存在するため abort します");
    debateController.abort();
  }
  
  debateController = new AbortController();
  const signal = debateController.signal;
  
  // ⏳ 制限時間を本番用の50秒に（whileの外なので周回でリセットされません）
  currentDebateTime = 50000; 
  gameSpeed = 1.0;

  // ーーー 🕒 ここから：タイマー専用の裏ループ ーーー
  let lastTimerTime = performance.now();
  function updateTimerLoop(now) {
    if (signal.aborted) return; // 中断されたらタイマー停止

    let realDelta = now - lastTimerTime;
    lastTimerTime = now;

    let gameDelta = realDelta * gameSpeed; // スロー対応
    currentDebateTime -= gameDelta;        // 時間を減らす

    if (currentDebateTime <= 0) {
      currentDebateTime = 0;
      console.log("⏰ タイムアップ！");
      debateController.abort(); // ループを強制ストップ
      return;
    }
    requestAnimationFrame(updateTimerLoop);
  }
  requestAnimationFrame(updateTimerLoop); // タイマースタート
  // ーーー 🕒 ここまで：追加したのはこれだけです ーーー


  try {
    let loopCount = 1;
    while (!signal.aborted) {
      console.log(`--- 🔄 議論ループ 第 ${loopCount} 周目 ---`);
      
      // 🌟 セクション1のセリフ発射（「html: 」ではなくそのまま文字列を入れるだけで大丈夫です）
      window.spawnFlexibleSerif(
        "退職させられたのは<br>オカモトユウダイ先生...",
        30,
        window.serifBehaviors.linearLeft,
        3000
      );

      // セクション1のカメラ移動を待つ
      await window.moveCameraPromise({
        to: { x: 0, y: 15, z: 50 },
        lookAtPos: { x: 0, y: 15, z: 0 },
        toFov: 45,
        duration: 3000 
      }, signal);

      console.log("✅ セクション１：無事に完了しました！");

      if (signal.aborted) {
        console.log("⚠️ セクション1の直後で signal.aborted を検知したため break します");
        break;
      }

      console.log("👉 セクション２：開始（自動らせん軌道）");
      
      // 🌟 セクション2のセリフ発射（もし2つ目のセリフを出すならここに同じように書けます）
      // window.spawnFlexibleSerif("次のセリフ...", 50, window.serifBehaviors.linearLeft, 4000);

      await window.moveCameraPromise({
        to: { y: 25 }, 
        spiral: {
          cx: 0, cy: 15, cz: 0, 
          startAngle: 0,
          turnAngle: 180,       
          startRadius: 50,
          endRadius: 30,        
          rotSpeed: 0.03,
          approachSpeed: 0.5
        },
        duration: 4000 
      }, signal);

      console.log("✅ セクション２：無事に完了しました！");
      
      loopCount++;
    }
    
    console.log("【デバッグ】whileループを正常に抜けました（signal.aborted が true になった等）");

  } catch (error) {
    console.error("🚨 【重大エラー】tryブロック内でエラーが発生し、中断されました:", error);
    console.error("エラーメッセージ:", error.message);
    console.error("スタックトレース:", error.stack);
  }
};