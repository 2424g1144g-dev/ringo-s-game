
// 「論」から「ノ」へ、つまり右側の文字から順番に表示させるためのJavaScript
const debate = document.getElementById("debate");
const spans = Array.from(debate.children);
const circle = document.getElementById("circleDebate");
let cylinderShift = false;

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
  zPush = true;
  bulletEnter = true;
  window.updatePosition(); 
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
    
    playSE("bulletChange");
    
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
    let scale = 1.0;
    let opacity = 1.0;
    let shakeX = 0;
    let shakeY = 0;

    // 着地するタイミング（全体の15%の時点）
    const landTime = 0.15; 

    if (currentT < landTime) {
      // 【着地前：手前から奥へ一気に縮小しながらフェードイン】
      const progress = currentT / landTime;
      scale = 3.5 - (progress * 2.5); 
      opacity = progress; 
      
    } else {
      // 【着地後：衝撃の揺れ（余韻）を表現】
      scale = 1.0;

      // 着地した瞬間からの経過時間
      const shakeProgress = (currentT - landTime) / (1.0 - landTime); 
      const fade = Math.max(0, 1.0 - shakeProgress); 

      if (fade > 0) {
        const shakeSpeed = 200; 
        const shakeAmount = 8; 
        shakeX = Math.sin(currentT * shakeSpeed) * shakeAmount * fade;
        shakeY = Math.cos(currentT * shakeSpeed * 1.2) * shakeAmount * fade;
      }

      // 【★追加：消え際のフェードアウト処理★】
      // linearと同じく、進行度が80%（0.8）を超えたら徐々に透明にする
      if (currentT > 0.8) {
        opacity = (1 - currentT) / 0.2;
      } else {
        opacity = 1.0;
      }
    }

    // 3. 要素へのスタイル反映
    element.style.opacity = opacity;
    element.style.transform = `translate(calc(-50% + ${shakeX}px), calc(-50% + ${shakeY}px)) scale(${scale})`;
  },

  letterByLetterPop: (element, gameDelta, duration, currentT) => {
    // 1. 最初の一フレーム目だけ、文字列を一文字ずつの <span> に分解する準備
    // すでに分解済み（子どもにspanがある状態）ならスキップする
    if (element.children.length === 0 && element.textContent.trim() !== "") {
      const text = element.textContent;
      element.innerHTML = ""; // 一旦空にする
      
      // 一文字ずつ span で囲んで再配置
      for (let char of text) {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.display = "inline-block";
        span.style.position = "relative"; // 下から浮かび上がらせるため
        element.appendChild(span);
      }
    }

    // 2. 全体としてのフェードアウト判定（linearと同じく全体の80%以降で消える）
    let globalOpacity = 1.0;
    if (currentT > 0.8) {
      globalOpacity = (1 - currentT) / 0.2;
    }

    // 親要素全体の透明度を適用（消え際用）
    element.style.opacity = globalOpacity;

    // 3. 子要素（各文字のspan）をループして、それぞれの出現タイミングを計算
    const spans = element.children;
    const totalLetters = spans.length;
    if (totalLetters === 0) return;

    // 文字同士がどれくらいズレて出てくるかの間隔（0.3 = 全体の30%の時間を使って全文字が出揃う）
    // 文字数に応じて調整できるようにしています
    const staggerRange = 0.3; 

    for (let i = 0; i < totalLetters; i++) {
      const span = spans[i];

      // この文字がスタートするべきタイミング（0.0 〜 staggerRange の間）
      const startDelay = (i / totalLetters) * staggerRange;
      
      // この文字が「下からふわっ」と出終わるまでの期間（例：0.15秒相当の割合）
      const popDuration = 0.15; 

      // 現在の全体進行度（currentT）から、この文字専用の進行度を切り出す
      if (currentT < startDelay) {
        // まだ自分の出番が来ていない時：透明で、少し下に隠しておく
        span.style.opacity = 0;
        span.style.transform = "translateY(20px)";
      } else {
        // 自分の出番が来た、または過ぎている時
        const letterProgress = Math.min(1.0, (currentT - startDelay) / popDuration);
        
        // 0.0 から 1.0 に向けて「ふわっ」と変化させる
        const opacity = letterProgress;
        const yOffset = 20 - (letterProgress * 20); // 20px下から0px（元の位置）へ

        span.style.opacity = opacity;
        span.style.transform = `translateY(${yOffset}px)`;
      }
    }
  },
};
window.spawnFlexibleSerif = function(htmlContent, leftPercent, topPercent, behaviorFunc, correctKotodama, failDialogId, duration = 4000) {
  const screen = document.getElementById("debate-screen");
  if (!screen) return;

  const newSerif = document.createElement("div");
  newSerif.className = "serif-bubble";
  newSerif.innerHTML = htmlContent;
  newSerif.style.left = leftPercent + "%";
  newSerif.style.top = topPercent + "%";
  newSerif.dataset.correctKotodama = correctKotodama || "";
  newSerif.dataset.failDialogId = failDialogId || "";
  
  newSerif.style.opacity = "0";
  screen.appendChild(newSerif);

  let lastTime = performance.now();
  let animationProgress = 0;

  function animateSerif(now) {
    // 議論自体が止まったらセリフも即座に消去
    if (debateController && debateController.signal.aborted) {
      if (bubble.dataset.isShuttered === "true") {
        return; 
      }
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
    let shakeTimer = parseFloat(newSerif.dataset.shakeTimer) || 0;
    if (shakeTimer > 0) {
      shakeTimer -= gameDelta;
      newSerif.dataset.shakeTimer = Math.max(0, shakeTimer).toString();
      const fade = shakeTimer / 300; 
      const shakeX = Math.sin(now * 0.1) * 15 * fade;
      const shakeY = Math.cos(now * 0.12) * 8 * fade;
      const currentTransform = newSerif.style.transform || "";
      newSerif.style.transform = currentTransform + ` translate(${shakeX}px, ${shakeY}px)`;
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
let isOverlapping = false;
let isweak = false;
let isagree = false;
let currentOverlappingBubble = null;
function checkCollision () {
  const crosshair = document.getElementById("crosshairContainer");
  const bubbles = document.querySelectorAll(".serif-bubble");
  const weaks = document.querySelectorAll(".weak-target");
  const cRect = crosshair.getBoundingClientRect();
  const cX = cRect.left + cRect.width / 2;
  const cY = cRect.top + cRect.height / 2;
  isOverlapping = false;
  currentOverlappingBubble = null;
  bubbles.forEach(bubble => {
    const bRect = bubble.getBoundingClientRect();
    if (cX >= bRect.left && cX <= bRect.right && cY >= bRect.top && cY <= bRect.bottom) {
      isOverlapping = true;
      currentOverlappingBubble = bubble;
    } else {
      isOverlapping = false;
    }
  })
  weaks.forEach(weak => {
    const wRect = weak.getBoundingClientRect();
    if (cX >= wRect.left && cX <= wRect.right && cY >= wRect.top && cY <= wRect.bottom) {
      isweak = true;
    } else {
      isweak = false;
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


let bulletEnter = false;
window.addEventListener("keydown", (e) => {
  if (e.code === "Enter" && !e.repeat && bulletEnter) {
    bulletEnter = false;
    crosshairOperate = false;
    rough = false;
    cylinderShift = false;
    const firedKotodama = bulletNum[currentBulletIndex];
    playSE("shot");
    setTimeout(() => {
      playSE("bulletFalling");
    }, 800)
    const bullet = document.querySelector(".NDbullet");
    const ndCylinder = document.getElementById("NDcylinderContainer");
    const text = document.querySelector(".shotText");
    const container = document.getElementById("shotTextContainer");
    ndCylinder.classList.remove("bulletLaunch");
    void ndCylinder.offsetWidth;
    ndCylinder.classList.add("bulletLaunch");
    bullet.classList.add("launch");
    text.textContent = bulletNum[currentBulletIndex];
    const crosshair = document.getElementById("crosshairContainer");
    const cRect = crosshair.getBoundingClientRect();
    const cX = cRect.left + cRect.width / 2 + 35;
    const cY = cRect.top + cRect.height / 2 - 35;
    container.style.setProperty('--landX', `${cX}px`);
    container.style.setProperty('--landY', `${cY}px`);
    setTimeout(() => {
      text.classList.add("flyShot");
      setTimeout(() => {
        if (!isOverlapping) {
          setTimeout (()=> {
            console.log("あたってない");
            bullet.style.opacity = 0;
            bullet.classList.remove("launch");
            void bullet.offsetWidth;
            bullet.classList.add("bulletChange");
            container.classList.add("shotDisappear");
            setTimeout(() => {
              bullet.style.opacity = 1;
              bulletEnter = true;
              crosshairOperate = true;
              rough = true;
              cylinderShift = true;
              window.updatePosition(); 
              bullet.classList.remove("bulletChange");
              container.classList.remove("shotDisappear");
              text.classList.remove("flyShot");
            }, 800)
          }, 0)
        } else {
          if (isweak) {
            debateController.abort();
            const correct = currentOverlappingBubble.dataset.correctKotodama;
            const failDialogId = currentOverlappingBubble.dataset.failDialogId;
            if (firedKotodama === correct) {
              console.log("それは違うよ！");
              setTimeout(() => {
                cameraMove({
                  to: {toX: 0, toY: 26, toZ: 0},
                  speed: 0.8,         // 💡 0.01だと遅すぎるので、一気に近づく強さに（0.5〜1.0あたりがベスト）
                  toFov: 15,          // 💡 FOV 5 は引き締まりすぎるので、25〜35くらいが本家っぽいです
                  fovSpeed: 0.7,      // 💡 位置の速さに負けないようにズームもキビキビ動かす
                  yaw: 135, 
                  rotSpeed: 0.005// 💡 角度も一瞬で 30度傾けたいので、速度を大幅にアップ！
                });
              }, 100)
              setTimeout(() => {
                cameraMove({
                  to: {toX: 0, toY: 26, toZ: 0},
                  speed: 0.8,
                  toFov: 50,
                  fovSpeed: 0.08,
                  yaw: 135,
                  roll: -15,
                  rotSpeed: 0.001,
                })
              },400)
              // 💥【rAF完全同期・文字爆破ロジック】
              const originalText = currentOverlappingBubble.innerText; 
              currentOverlappingBubble.innerHTML = ""; 
              currentOverlappingBubble.classList.add("is-broken");

              // 1文字ずつの物理データを格納する配列
              const shards = [];

              [...originalText].forEach((char) => {
                if (char.trim() === "") {
                  currentOverlappingBubble.appendChild(document.createTextNode(char));
                  return;
                }

                const span = document.createElement("span");
                span.className = "broken-char";
                span.textContent = char;
                currentOverlappingBubble.appendChild(span);

                // 360度ランダムな方向への初速を計算
                const angle = Math.random() * Math.PI * 2;
                const speed = 4 + Math.random() * 6; // 飛び散る勢い

                // この文字固有の物理ステータスを記憶
                shards.push({
                  element: span,
                  x: 0,        // 現在のXズレ
                  y: 0,        // 現在のYズレ
                  vx: Math.cos(angle) * speed, // X速度
                  vy: Math.sin(angle) * speed - 2, // Y速度（ちょっと上に跳ね上げる）
                  rot: 0,      // 現在の角度
                  vrot: (Math.random() - 0.5) * 15 // 回転速度
                });
              });

              // セリフ全体の寿命（800msで消滅）
              const shatterDuration = 800;
              const startTime = performance.now();

              function updateShatterLoop(now) {
                const elapsed = now - startTime;
                const progress = elapsed / shatterDuration;

                if (progress >= 1) {
                  // 寿命が来たら要素ごと完全に消去
                  if (currentOverlappingBubble) currentOverlappingBubble.remove();
                  return;
                }

                // 残り時間に合わせてじわじわ透明にする（不透明度 1.0 〜 0.0）
                const opacity = 1 - progress;

                shards.forEach((shard) => {
                  // 1. 速度を位置に足し算する
                  shard.x += shard.vx;
                  shard.y += shard.vy;
                  shard.rot += shard.vrot;

                  // 2. 重力をちょっとだけ加える（自然に放物線を描いて落ちる）
                  shard.vy += 0.2; 

                  // 3. 画面に反映（translateのズレが絶対ブレない）
                  shard.element.style.transform = `translate(${shard.x}px, ${shard.y}px) rotate(${shard.rot}deg)`;
                  shard.element.style.opacity = opacity;
                });

                requestAnimationFrame(updateShatterLoop);
              }

              // 💥 元のセリフが持っていた updateTimerLoop 内での軌道計算（behaviorFunc）を
              // 完全にストップさせるため、behaviorFuncの実行を実質上書きしてこのrAFループを最優先にします。
              requestAnimationFrame(updateShatterLoop);
              const canvas = document.querySelector("canvas");
              canvas.classList.remove("action-flash");
              void canvas.offsetWidth;
              canvas.classList.add("action-flash");
              playSE("throughShot");
            } else {
              debateController.abort();
              alert("あほあほあほあほ！！")
            }
          } else if (isagree) {
            alert("それに賛成だ！")
          } else {
            console.log("セリフにあたった");
            playSE("refrect");
            bullet.style.opacity = 0;
            bullet.classList.remove("launch");
            void bullet.offsetWidth;
            bullet.classList.add("bulletChange");
            container.classList.add("refrect");
            if (currentOverlappingBubble) {
              currentOverlappingBubble.dataset.shakeTimer = "300";
            }
            setTimeout(() => {
              bullet.style.opacity = 1;
              bulletEnter = true;
              crosshairOperate = true;
              rough = true;
              cylinderShift = true;
              window.updatePosition();
              bullet.classList.remove("bulletChange");     
              container.classList.remove("refrect");
              text.classList.remove("flyShot");
            }, 800)
          }
        }
      }, 500)
    }, 200)
  }
})

let currentProcessStep = 0;

window.process = function (totalSteps) {
  const arrow = document.getElementById("processMeterArrow");
  if (!arrow) return;

  // 1. 関数が呼ばれるたびに、ステップ数を1ずつ進める
  currentProcessStep++;

  // 💥 安全策：もしゴール（100%）に達したら、それ以上は進まないように制限
  if (currentProcessStep > totalSteps) {
    currentProcessStep = totalSteps;
  }

  // 2. メーター全体の長さ（200px）を、指定された分割数（totalSteps）で割って、1歩の大きさを出す
  const stepSize = 188 / totalSteps;

  // 3. 一番下（開始地点）の top 座標を指定
  // ※ メーターの一番下が top: 200px だと仮定しています。CSSに合わせて数値を調整してください。
  const baseTop = 188; 

  // 4. 「1歩の大きさ × 現在のステップ数」分だけ、基準点から上にずらす
  const finalTop = baseTop - (stepSize * currentProcessStep);

  arrow.style.top = finalTop + "px";

  // 💡 デバッグ用：今全体の何分の一進んだかをコンソールに出す
  console.log(`進行度: ${currentProcessStep} / ${totalSteps}`);
};