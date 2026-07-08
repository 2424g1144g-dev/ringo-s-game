// 「論」から「ノ」へ、つまり右側の文字から順番に表示させるためのJavaScript
const debate = document.getElementById("debate");
const spans = Array.from(debate.children);
const circle = document.getElementById("circleDebate");
let cylinderShift = false;
let crosshairOperate = false;

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
  const ndBulletBody = ndBullet.querySelector(".NDbullet-Body");
  ndBulletBody.textContent = bulletNum[0];
  document.getElementById("nonstopDebateUI").classList.add("show");
  document.getElementById("crosshairContainer").style.opacity = 1;
  cylinderShift = true;
  crosshairOperate = true;
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
  if ((event.code === "ShiftLeft" || event.code === "ShiftRight") && !event.repeat && cylinderShift) {
    
    const ndBullet = document.querySelector(".NDbullet");
    if (ndBullet.classList.contains("bulletChange")) return;
    
    //playSE("reload"); 
    
    // 💡 1. どっちのShiftが押されたかで、インデックスの計算を分岐させる！
    if (event.code === "ShiftRight") {
      // 👉 右Shiftなら：次の弾へ（進む）
      currentBulletIndex++;
      NDcurrentAngle += 60;
      document.getElementById("NDcylinder").style.setProperty('--NDangle', `${NDcurrentAngle}deg`);

      if (currentBulletIndex >= bulletNum.length) {
        currentBulletIndex = 0; // 最後を超えたら最初に戻る
      }
    } else if (event.code === "ShiftLeft") {
      // 👈 左Shiftなら：前の弾へ（戻る）
      currentBulletIndex--;
      NDcurrentAngle -= 60;
      document.getElementById("NDcylinder").style.setProperty('--NDangle', `${NDcurrentAngle}deg`);
      if (currentBulletIndex < 0) {
        currentBulletIndex = bulletNum.length - 1; // 0未満になったら最後の弾に戻る
      }
    }
    
    // 2. 🎬 左にシュッと閉じるアニメーション開始！
    ndBullet.classList.add("bulletChange");
    
    // 3. ちょうど閉じきった150msの瞬間に、判定された次の文字に書き換える
    setTimeout(() => {
      const ndBulletBody = ndBullet.querySelector(".NDbullet-Body");
      ndBulletBody.textContent = bulletNum[currentBulletIndex];
    }, 150);
    
    // 4. アニメーション終了処理（300ms後）
    setTimeout(() => {
      ndBullet.classList.remove("bulletChange");
    }, 300);
  }
});

window.ndIconChange = function (newName){
  const icon = document.getElementById("NDicon");
  const name = document.getElementById("nonstopDebateName");
  const zapping = document.getElementById("NDzapping");
  name.textContent = newName;
  zapping.classList.remove("zappingAnim");
  void zapping.offsetWidth;
  zapping.classList.add("zappingAnim");
  setTimeout(() => {
    if (newName === "ニシモト　タツロウ") {
      icon.src = "assets/icon/iconTaturo.png";
    } else if (newName === "フルイチ　ヒデハル") {
      icon.src = "assets/icon/iconFakeFuruichi.png";
    } else if (newName === "ヤマモト　ケイゾウ") {
      icon.src = "assets/icon/iconKeizo.png";
    } else if (newName === "ササノ　ケント") {
      icon.src = "assets/icon/iconKento.png";
    } else if (newName === "ツカゴエ　ミツヒロ") {
      icon.src = "assets/icon/iconMitsuhiro.png";
    } else if (newName === "コウチョウ"){
      icon.src = "assets/icon/iconPrincipal.png";
    } else if (newName === "シノハラ　リュウジ") {
      icon.src = "assets/icon/iconRyuji.png";
    } else if (newName === "ヤマモト　シゲオ") {
      icon.src = "assets/icon/iconShige.png";
    }
  }, 150)
  if (icon.style.opacity == 0) {
    setTimeout(() => {
      icon.style.opacity = 1;
    },150)
  }
} 

window.serifBehaviors = {
  linearLeft: (element, gameDelta, duration, currentT) => {
    const currentX = parseFloat(element.style.left) || 0;
    const moveStep = (gameDelta / duration) * 10;
    element.style.left = (currentX - moveStep) + "%";
    let opacity = 1;
    if (currentT < 0.2) {
      opacity = currentT / 0.2;
    } else if (currentT > 0.8) {
      opacity = (1 - currentT) / 0.2;
    } else {
      opacity = 1;
    }
    element.style.opacity = opacity;
  },

  linearRight: (element, gameDelta, duration, currentT) => {
    const currentX = parseFloat(element.style.left) || 0;
    const moveStep = (gameDelta / duration) * 10;
    element.style.left = (currentX + moveStep) + "%";
    let opacity = 1;
    if (currentT < 0.2) {
      opacity = currentT / 0.2;
    } else if (currentT > 0.8) {
      opacity = (1 - currentT) / 0.2;
    } else {
      opacity = 1;
    }
    element.style.opacity = opacity;
  },

  bangAndShake: (element, gameDelta, duration, currentT) => {
    // 1. 固定の目標着地点（真ん中に配置する前提なら50%など）
    // もし元々のHTML配置（CSSのleft/top）をそのまま着地点にしたいなら、
    // 最初の1フレーム目だけ座標を記憶するなどの工夫が必要ですが、
    // ここでは基準となる着地スタイルをベースに計算します。
    
    // 2. 進行度（currentT）に応じて「スケール（大きさ）」と「透明度」を計算
    let scale = 1.0;
    let opacity = 1.0;
    let shakeX = 0;
    let shakeY = 0;

    // 着地するタイミングを全体の30%（currentT = 0.3）の時点に設定
    const landTime = 0.10; 

    if (currentT < landTime) {
      // 【着地前：手前から奥へ一気に縮小しながらフェードイン】
      const progress = currentT / landTime; // 0.0 〜 1.0 に正規化
      
      // 最初は3.5倍の大きさ ➔ 着地時に1.0倍になる
      scale = 3.5 - (progress * 2.5); 
      // 最初は透明 ➔ 着地時に不透明度1に
      opacity = progress; 
      
    } else {
      // 【着地後：残りの時間（0.3 〜 1.0）で衝撃の揺れ（余韻）を表現】
      opacity = 1.0;
      scale = 1.0;

      // 着地した瞬間からの経過時間（0.0 〜 0.7）
      const shakeProgress = (currentT - landTime) / (1.0 - landTime); 

      // 揺れの減衰係数（時間が経つほど揺れを小さくする。1.0 から 0.0 へ）
      const fade = Math.max(0, 1.0 - shakeProgress); 

      if (fade > 0) {
        // サイン波を使ってブルブル細かく往復させる（数字を大きくすると激しく早く震えます）
        const shakeSpeed = 60; // 震える速さ
        const shakeAmount = 8; // 最大の揺れ幅（px）
        
        shakeX = Math.sin(currentT * shakeSpeed) * shakeAmount * fade;
        shakeY = Math.cos(currentT * shakeSpeed * 1.2) * shakeAmount * fade;
      }
    }

    // 3. 要素へのスタイル反映
    element.style.opacity = opacity;
    
    // translate(-50%, -50%) で要素の中心を軸にしつつ、拡大縮小と揺れを同時に適応
    element.style.transform = `translate(calc(-50% + ${shakeX}px), calc(-50% + ${shakeY}px)) scale(${scale})`;
  },
};
window.spawnFlexibleSerif = function(htmlContent, leftPercent, topPercent, behaviorFunc, duration = 4000) {
  const screen = document.getElementById("debate-screen");
  if (!screen) return;

  const newSerif = document.createElement("div");
  newSerif.className = "serif-bubble";
  newSerif.innerHTML = htmlContent;
  newSerif.style.left = leftPercent + "%";
  newSerif.style.top = topPercent + "%";
  
  newSerif.style.opacity = "0";
  screen.appendChild(newSerif);

  let lastTime = performance.now();
  let animationProgress = 0;

  function animateSerif(now) {
    // 議論自体が止まったらセリフも即座に消去
    if (debateController && debateController.signal.aborted) {
      newSerif.remove();
      return;
    }

    let realDelta = now - lastTime;
    lastTime = now;
    
    // スローモーション（集中）倍率をここに適用
    let gameDelta = realDelta * gameSpeed;

    animationProgress += gameDelta / duration;
    
    // THREE.MathUtils.clamp の代わり（0.0 〜 1.0 に収める標準の書き方）
    const t = Math.max(0, Math.min(1, animationProgress));

    // 外部から貰った軌道ロジック関数を実行
    if (typeof behaviorFunc === "function") {
      // 引数に「要素」「スロー対応した時間差分」「総時間」「今の全体進捗(0~1)」を渡す
      behaviorFunc(newSerif, gameDelta, duration, t);
    }

    // 終了したら削除
    if (t >= 1) {
      newSerif.remove();
      return;
    }

    requestAnimationFrame(animateSerif);
  }

  requestAnimationFrame(animateSerif);
}


//照準がセリフに重なったときの処理
function checkCollision () {
  const crosshair = document.getElementById("crosshairContainer");
  const bubbles = document.querySelectorAll(".serif-bubble");
  const cRect = crosshair.getBoundingClientRect();
  const cX = cRect.left + cRect.width / 2;
  const cY = cRect.top + cRect.height / 2;
  let isOverlapping = false;
  bubbles.forEach(bubble => {
    const bRect = bubble.getBoundingClientRect();
    if (cX >= bRect.left && cX <= bRect.right && cY >= bRect.top && cY <= bRect.bottom) {
      isOverlapping = true;
    }
  })
  if (isOverlapping) {
    crosshair.classList.add("locked"); // 重なったらクラスを追加
  } else {
    crosshair.classList.remove("locked"); // 外れたら消す
  }
}

function crosshairCollision() {
  checkCollision(); 
  requestAnimationFrame(crosshairCollision);
}

// ゲーム開始時にこのループを1回起動する
crosshairCollision();

