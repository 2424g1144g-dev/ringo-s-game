window.nonstopDebate1 = async function () {
  if (debateController) debateController.abort();
  
  debateController = new AbortController();
  const signal = debateController.signal;
  
  currentDebateTime = 10000000; // 50秒
  gameSpeed = 1.0;

  try {
    while (!signal.aborted) {
      
      console.log("セクション１：通常移動＋LookAt");
      // UIの切り替え、キャラの表示更新などをここに挟む
      await moveCameraPromise({
        to: { x: 0, y: 15, z: 50 },
        lookAtPos: { x: 0, y: 15, z: 0 },
        toFov: 45,
        duration: 3000 // このセクションのカメラの所要時間（ミリ秒）
      }, signal);

      if (signal.aborted){
        console.log("breakを起動します");
        break
    }

      console.log("セクション２：自動らせん軌道(spiral)");
      await moveCameraPromise({
        to: { y: 25 }, // 最終的なターゲット高さ
        spiral: {
          cx: 0, cy: 15, cz: 0, // 中心点
          startAngle: 0,
          turnAngle: 180,       // 180度ぐるっと回る
          startRadius: 50,
          endRadius: 30,        // 近づきながら回る
          rotSpeed: 0.03,
          approachSpeed: 0.5
        },
        duration: 4000 // らせん用の所要時間（ミリ秒）
      }, signal);
    }
  } catch (error) {
    if (error.message === "Timeout") {
      console.log("議論終了：タイムアップ");
    } else if (error.message === "Aborted") {
      console.log("議論終了：論破成功、または中断");
    }
  }
};