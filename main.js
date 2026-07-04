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

// 位置の初期値
let posX = 100;
let posY = 100;

// 【追加】現在の移動速度（X軸・Y軸）
let vx = 0;
let vy = 0;

// 調整パラメーター（お好みで調整してください）
const ACCELERATION = 0.8; // 加速度（キーを押したときの加速の勢い。大きいほどキビキビ動く）
const FRICTION = 0.88;    // 摩擦係数（キーを離したときの減速具合。0.95だとぬるっと滑り、0.8だとピタッと止まる）
const MAX_SPEED = 12;     // 最高速度（これ以上速くならない限界値）

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

window.addEventListener('keydown', (e) => {
  if (e.key in keys) {
    keys[e.key] = true;
    e.preventDefault();
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key in keys) {
    keys[e.key] = false;
  }
});

function updatePosition() {
  // 1. キーの入力に応じて「速度」を増減させる（加速）
  if (keys.ArrowUp)    vy -= ACCELERATION;
  if (keys.ArrowDown)  vy += ACCELERATION;
  if (keys.ArrowLeft)  vx -= ACCELERATION;
  if (keys.ArrowRight) vx += ACCELERATION;

  // 2. 摩擦をかけて、常に少しずつ減速させる
  vx *= FRICTION;
  vy *= FRICTION;

  // 3. スピードが出すぎないように最高速度で制限をかける
  vx = Math.max(-MAX_SPEED, Math.min(vx, MAX_SPEED));
  vy = Math.max(-MAX_SPEED, Math.min(vy, MAX_SPEED));

  // 4. 計算した速度を「位置」に加算する
  posX += vx;
  posY += vy;

  // 5. 画面外への飛び出し制限（壁にぶつかったら速度も0にする）
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const containerSize = 70;

  if (posX < 0) { posX = 0; vx = 0; }
  if (posX > windowWidth - containerSize) { posX = windowWidth - containerSize; vx = 0; }
  if (posY < 0) { posY = 0; vy = 0; }
  if (posY > windowHeight - containerSize) { posY = windowHeight - containerSize; vy = 0; }

  // 6. 照準の位置を更新
  container.style.left = `${posX}px`;
  container.style.top = `${posY}px`;

  requestAnimationFrame(updatePosition);
}

updatePosition();