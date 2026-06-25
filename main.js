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

// 💡 現在選ばれている弾丸の番号（最初は0番目＝ツカゴエの証言）
let currentBulletIndex = 0;

// 💡 弾丸の配列（あなたのデータをここにセット）
const bulletNumi = ["ツカゴエの証言", "落ちていた紙コップ","ツカゴエのポケットに入っていたゴミ","消えた体育館のハンマー","西大寺高校の罠"];

// 💡 キーボードの入力を監視するイベントリスナー
window.addEventListener("keydown", (event) => {
  
  // 💡 event.key ではなく、左右を識別できる event.code を使います！
  if ((event.code === "ShiftLeft" || event.code === "ShiftRight") && !event.repeat) {
    
    const ndBullet = document.querySelector(".NDbullet");
    if (ndBullet.classList.contains("bulletChange")) return;
    
    playSE("reload"); 
    
    // 💡 1. どっちのShiftが押されたかで、インデックスの計算を分岐させる！
    if (event.code === "ShiftRight") {
      // 👉 右Shiftなら：次の弾へ（進む）
      currentBulletIndex++;
      if (currentBulletIndex >= bulletNumi.length) {
        currentBulletIndex = 0; // 最後を超えたら最初に戻る
      }
    } else if (event.code === "ShiftLeft") {
      // 👈 左Shiftなら：前の弾へ（戻る）
      currentBulletIndex--;
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