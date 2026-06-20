
const bgm = new Audio("assets/audio/BGM/trialNormal.mp3");
bgm.preload = "auto"; // 事前ロードを強制
bgm.loop = true;
function playBGM(volume = 0.4) {
  bgm.volume = volume;
  if (bgm.readyState >= 2) {
    bgm.currentTime = 0;
  }
  bgm.play().catch((error) => {
    console.log("BGM再生エラー:", error);
  });
}
// 停止
function stopBGM() {
  bgm.pause();
}
let bgmStarted = false;
let startEnter = true;
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

// 効果音再生
const playingSE = new Map();
function playSE(name, volume = 0.4) {
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

const SE = {
  select: "assets/audio/SE/select.wav",
  resume: "assets/audio/SE/resume.wav",
  dialoguePass: "assets/audio/SE/diaPass.wav",
  confirm: "assets/audio/SE/confirm.wav",
  shotConfirm: "assets/audio/SE/shotConfirm.wav",
  comeUpWith: "assets/audio/SE/comeUpWith.wav",
  blowShock: "assets/audio/SE/blowShock.wav",
  shock: "assets/audio/SE/shock.wav",
  scold: "assets/audio/SE/scold.wav",
  terribleShock: "assets/audio/SE/terribleShock.wav",
  sad: "assets/audio/SE/sad.wav",
  itemFadeIn: "assets/audio/SE/itemFadeIn.wav",
  itemFadeOut: "assets/audio/SE/itemFadeOut.wav",
  memory: "assets/audio/SE/memory.wav",
  heartBeat: "assets/audio/SE/heartBeat.wav",
  heartBeatFast: "assets/audio/SE/heartBeatFast.wav",
  hammer: "assets/audio/SE/hammer.wav",
  stamp: "assets/audio/SE/stamp.wav",
  nonstopDebateStart: "assets/audio/SE/nonstopDebateStart.wav",
  addBullet: "assets/audio/SE/addBullet.wav"
};
