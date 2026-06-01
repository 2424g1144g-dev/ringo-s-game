//起動時-------------------------------------
document.getElementById("dialogue").style.opacity = 1;
DIALOGUE.init(
  document.getElementById("dialogue"),
  DIALOGUE_LINES.prologue
);
DIALOGUE.dialogueIndex = 0;
DIALOGUE.start(DIALOGUE_LINES.prologue)

//拡大禁止コード
window.addEventListener("wheel", (e) => {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && ["+", "-", "0"].includes(e.key)) {
    e.preventDefault();
  }
})

//ダイアログを送るENTER-------------------------------------
let textEnter = true;
document.addEventListener("keydown", e => {
  if (!textEnter) return;
  if (e.key !== "Enter" || e.repeat) return;
  if (!textEnter) return;
  playSE("dialoguePass");
  DIALOGUE.next();
});

//BGM関係--------------------------------------------------
const bgm = document.getElementById("bgm");
// 再生
function playBGM(volume = 0.5) {
  bgm.volume = volume;
  bgm.currentTime = 0;
  bgm.play().catch(() => {
    console.log("bgm");
  });
}
// 停止
function stopBGM() {
  bgm.pause();
}
let bgmStarted = false;
function fadeOutBGM(duration = 1000) {
  const step = 0.02;
  const interval = duration / (bgm.volume / step);
  const fade = setInterval(() => {
    if (bgm.volume > step) {
      bgm.volume -= step;
    } else {
      bgm.volume = 0;
      bgm.pause();
      clearInterval(fade);
    }
  }, interval);
}

// 効果音再生-------------------------------------
const SE = {
  dialoguePass: "audio/SE/dialoguePass.wav",
  noticed: "audio/SE/pico.wav",
  itemFadeIn: "audio/SE/itemFadeIn.wav",
  itemFadeOut: "audio/SE/itemFadeOut.wav",
  discover: "audio/SE/discover.wav",
  selectMove: "audio/SE/selectMove.wav",
  confirm: "audio/SE/confirm.wav",
  back: "audio/SE/back.wav",
  skillSet: "audio/SE/skillSet.wav",
  skillRemove: "audio/SE/skillRemove.wav"
};
const playingSE = new Map();
function playSE(name, volume = 0.5) {
  console.log("Now playing: ", name)
  const audio = new Audio(SE[name]);
  audio.volume = volume;
  audio.play().catch(e => {
    console.warn("SE再生失敗:", e);
  });
  playingSE.set(name, audio);
  // 再生終了したら消す
  audio.addEventListener("ended", () => {
    playingSE.delete(name);
  });
}
function stopSE(name) {
  const audio = playingSE.get(name);
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  playingSE.delete(name);
}

//背景関係----------------------------------------
const backgrounds = {
  none: "none",
  murderedYudai: "backgrounds/murderedYudai.png",
  gym: "backgrounds/gym.png",
  garden: "backgrounds/garden.jpg",
  circleTrial: "backgrounds/circleTrial.jpg"

}
const bgEl = document.getElementById("backgroundLayer");
function changeBackground(id, fade = 800) {
  const src = backgrounds[id];
  if (!src) {
    console.warn("背景が未定義:", id);
    return;
  }
  if (src === "none") {
    bgEl.style.transition = `opacity ${fade}ms ease`;
    bgEl.style.opacity = 0;
    return
  }
  // ★ 即時切り替え
  if (fade === 0) {
    bgEl.style.transition = "none";
    bgEl.style.opacity = 1;
    bgEl.style.backgroundImage = `url(${src})`;
    return;
  }
  // フェード切り替え
  bgEl.style.transition = `opacity ${fade}ms ease`;
  bgEl.style.opacity = 0;
  setTimeout(() => {
    bgEl.style.backgroundImage = `url(${src})`;
    bgEl.style.opacity = 1;
  }, fade);
}