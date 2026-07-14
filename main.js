//------------------------------拡大と縮小を防止
window.addEventListener("wheel", (e) => {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && ["+", "-", "0"].includes(e.key)) {
    e.preventDefault();
  }
})

const container = document.getElementById('crosshairContainer');
let rough = true;

let posX = 100;
let posY = 100;
let vx = 0;
let vy = 0;

// 【追加】手ブレの時間を進めるためのカウンター
let swayTime = 0;

const ACCELERATION = 1.5;
const FRICTION = 0.88;
const MAX_SPEED = 20;

// 【追加】手ブレの設定（お好みで調整してください）
const SWAY_SPEED = 0.05;  // 揺れるスピード（大きいほど素早く動く）
const SWAY_AMOUNT = 0.08; // 揺れる大きさ（大きいほど大きくズレる）

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

window.addEventListener('keydown', (e) => {
  if (e.key in keys && crosshairOperate) {
    keys[e.key] = true;
    e.preventDefault();
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key in keys && crosshairOperate) {
    keys[e.key] = false;
  }
});

function updatePosition() {
  // 1. キーの入力に応じて「速度」を増減させる
  if (keys.ArrowUp)    vy -= ACCELERATION;
  if (keys.ArrowDown)  vy += ACCELERATION;
  if (keys.ArrowLeft)  vx -= ACCELERATION;
  if (keys.ArrowRight) vx += ACCELERATION;

  // 2. 摩擦をかけて、常に少しずつ減速させる
  vx *= FRICTION;
  vy *= FRICTION;

  // 3. 【追加】手ブレ（照準ズレ）の計算
  // プレイヤーが操作していない（キーを全て離している）ときだけブレるようにチェック
  const isMoving = keys.ArrowUp || keys.ArrowDown || keys.ArrowLeft || keys.ArrowRight;
  
  if (rough && !isMoving) {
    swayTime += SWAY_SPEED;
    // サイン波とコサイン波を使って、滑らかな無限の「8の字」や「円」に近い揺らぎを作る
    vx += Math.sin(swayTime) * SWAY_AMOUNT;
    vy += Math.cos(swayTime * 0.7) * SWAY_AMOUNT; // 縦横の周期を少しズラして不規則にする
  }

  // 4. スピードが出すぎないように最高速度で制限をかける
  vx = Math.max(-MAX_SPEED, Math.min(vx, MAX_SPEED));
  vy = Math.max(-MAX_SPEED, Math.min(vy, MAX_SPEED));

  // 5. 計算した速度を「位置」に加算する
  posX += vx;
  posY += vy;

  // 6. 画面外への飛び出し制限
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const containerSize = 70;

  if (posX < 0) { posX = 0; vx = 0; }
  if (posX > windowWidth - containerSize) { posX = windowWidth - containerSize; vx = 0; }
  if (posY < 0) { posY = 0; vy = 0; }
  if (posY > windowHeight - containerSize) { posY = windowHeight - containerSize; vy = 0; }

  // 7. 照準の位置を更新
  container.style.left = `${posX}px`;
  container.style.top = `${posY}px`;

  requestAnimationFrame(updatePosition);
}

updatePosition(); 

