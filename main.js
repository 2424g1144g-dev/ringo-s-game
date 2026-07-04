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

// 初期位置（画面の中心あたり、またはお好みの座標）
let posX = 100;
let posY = 100;

// 1回キーを押したときに動くピクセル数（スピード調整用）
const SPEED = 5; 

// 押されているキーの状態を記録するオブジェクト
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

// キーが押されたとき
window.addEventListener('keydown', (e) => {
  if (e.key in keys) {
    keys[e.key] = true;
    e.preventDefault(); // 画面が一緒にスクロールするのを防ぐ
  }
});

// キーが離されたとき
window.addEventListener('keyup', (e) => {
  if (e.key in keys) {
    keys[e.key] = false;
  }
});

function updatePosition() {
  if (keys.ArrowUp)    posY -= SPEED;
  if (keys.ArrowDown)  posY += SPEED;
  if (keys.ArrowLeft)  posX -= SPEED;
  if (keys.ArrowRight) posX += SPEED;

  // --- 【追加】画面外への飛び出し制限 ---
  // 画面の現在の横幅と縦幅を取得
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // コンテナのサイズ（70px）
  const containerSize = 70;

  // 横方向（X軸）の制限：左端は0まで、右端は（画面幅 - 70px）まで
  posX = Math.max(0, Math.min(posX, windowWidth - containerSize));
  
  // 縦方向（Y軸）の制限：上端は0まで、下端は（画面高 - 70px）まで
  posY = Math.max(0, Math.min(posY, windowHeight - containerSize));
  // --------------------------------------

  // 照準の位置を更新
  container.style.left = `${posX}px`;
  container.style.top = `${posY}px`;

  requestAnimationFrame(updatePosition);
}

// 動きを開始
updatePosition();