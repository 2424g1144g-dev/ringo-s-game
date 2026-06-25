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
const bulletNumi = ["ツカゴエの証言", "落ちていた紙コップ"];

// 💡 キーボードの入力を監視するイベントリスナー
window.addEventListener("keydown", (event) => {
  
  // 💡 押されたキーが「Shift」だった場合
  if (event.key === "Shift") {
    
    const ndBullet = document.querySelector(".NDbullet");
    
    // すでに切り替えアニメーション中の連打はガードする
    if (ndBullet.classList.contains("bulletChange")) return;
    
    // 🔊 ガシャコン！とリロードするSEをここで鳴らす
    playSE("reload"); 
    
    // 1. 次の弾の番号に進める
    currentBulletIndex++;
    
    // 💡 もし配列の長さを超えたら、0番目（最初）に戻す（ループ処理）
    if (currentBulletIndex >= bulletNumi.length) {
      currentBulletIndex = 0;
    }
    
    // 2. 🎬 左にシュッと閉じるアニメーション開始！
    ndBullet.classList.add("bulletChange");
    
    // 3. ちょうど閉じきった300msの瞬間に、次の文字に書き換える
    setTimeout(() => {
      const ndBulletBody = ndBullet.querySelector(".NDbullet-Body");
      
      // 現在のインデックスの文字を配列から引っ張ってきて上書き
      ndBulletBody.textContent = bulletNum[currentBulletIndex];
    }, 150);
    
    // 4. アニメーションが終わったら（600ms後）、クラスを外して次のシフト入力に備える
    setTimeout(() => {
      ndBullet.classList.remove("bulletChange");
    }, 300);
  }
});
