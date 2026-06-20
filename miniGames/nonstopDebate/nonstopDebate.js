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

let bulletNum = ["ツカゴエのポケットに入っていたゴミ","１００年前の西大寺高校のビジョン","黒幕の罠"];
function loadAllBullets() {
  bulletNum.forEach((text, i) => {
    setTimeout(() => {
      window.addBullet(text);
      // playLoadingSound();
    }, i * 400);
  });
}
loadAllBullets();