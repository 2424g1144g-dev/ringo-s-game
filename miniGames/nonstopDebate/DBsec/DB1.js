window.nonstopDebate1 = async function () {
  console.log("【デバッグ】nonstopDebate1 が呼び出されました");

  if (debateController) {
    console.log("【デバッグ】過去のコントローラーが存在するため abort します");
    debateController.abort();
  }
  
  debateController = new AbortController();
  const signal = debateController.signal;
  
  currentDebateTime = 10000000; // 十分に長い時間
  gameSpeed = 1.0;

  try {
    let loopCount = 1;
    while (!signal.aborted) {
      console.log(`--- 🔄 議論ループ 第 ${loopCount} 周目 ---`);
      
      console.log("👉 セクション１：開始（通常移動＋LookAt）");
      
      // セクション1のカメラ移動を待つ
      await moveCameraPromise({
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
      
      await moveCameraPromise({
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
    // 💡 もしエラーで止まっていた場合、ここに原因が赤文字などで表示されます
    console.error("🚨 【重大エラー】tryブロック内でエラーが発生し、中断されました:", error);
    console.error("エラーメッセージ:", error.message);
    console.error("スタックトレース:", error.stack);
  }
};