//------------------------------拡大と縮小を防止
window.addEventListener("wheel", (e) => {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && ["+", "-", "0"].includes(e.key)) {
    e.preventDefault();
  }
})

const ndBullet = document.querySelector(".NDbullet");
const ndBulletBody = ndBullet.querySelector(".NDbullet-Body"); // 💡 中の文字部分だけを狙う

// 1. 演出開始！切り替えアニメーション用クラスをつける
ndBullet.classList.add("bulletChange");

// 2. 弾丸が左にシュッと閉じきった瞬間（0.3秒後 / 300ms）
setTimeout(() => {
  // 💡 HTML構造を壊さず、中の文字だけを「ツカゴエミツヒロの証言」に変える！
  ndBulletBody.textContent = "ツカゴエミツヒロの証言";
}, 150);

// 3. 全ての演出が終わったら、次の切り替えのためにクラスを外しておく（0.6秒後）
setTimeout(() => {
  ndBullet.classList.remove("bulletChange");
}, 300);
