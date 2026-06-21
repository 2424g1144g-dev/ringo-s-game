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

let bulletNum = [];
let currentAngle = 0;
// 💡 Pythonの time.sleep() と同じ機能を持つおやすみ関数（ミリ秒指定）
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
// 💡 「async」をつけて、中で時間を止められる特別な関数にする
window.loadAllBullets = async function(bullet) {
  bulletNum = bullet;
  // 💡 1発ずつ順番に「時間を止めながら」ループさせるため for...of を使います
  for (const text of bulletNum) { 
    // 1. まず弾丸テキストを画面（UI）に追加！
    window.addBullet(text); 
    // 2. 弾が画面に出てからシリンダーが回りだすまでの「タメ」を作る（180ms待機）
    await sleep(180);
    // 3. シリンダーを回転させ、SEを鳴らす！
    currentAngle += 60;
    playSE("addBullet");
    document.getElementById("cylinder").style.setProperty('--angle', `${currentAngle}deg`);
    // 4. 💡 【ここが重要！】
    // 回転演出が終わってから、次の弾丸の装填に移るまでの「余韻」として、しっかり待つ！
    //（220ms 待つことで、1発あたり合計400msの小気味いい等間隔テンポになります）
    await sleep(220);
  }
  // 💡 5. 【臨機応変ポイント】
  // 弾丸のループが「すべて終わったこの場所」で、さらに最後の余韻を待つ！
  await sleep(800); 
  console.log("すべての装填演出が終了しました。議論の文字送りなどを開始できます！");
  // ここに「議論開始関数」などを書けば、何発あっても完璧なタイミングでゲームが進行します！
}