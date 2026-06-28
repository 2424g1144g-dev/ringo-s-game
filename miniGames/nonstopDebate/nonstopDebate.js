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
  await sleep(800); 
  console.log("すべての装填演出が終了しました。議論の文字送りなどを開始できます！");
  bulletList.classList.add("bulletGathering");
  document.getElementById("cylinderParents").style.left = "-800px";
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