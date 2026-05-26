
/*最初の画面のキー*/
let firstSelectedIndex = 0;
let firstEsc = false;
const choiceItems = document.querySelectorAll(".choice-item");
let firstStopping = false;
window.addEventListener("keydown", (e) => {
  // すでに停止中、かつEscape以外のキーが押された場合は無視する
  if (firstStopping && e.key !== "Escape") return;
  if (e.repeat) return;

  if (e.key === "ArrowUp") {
    firstSelectedIndex = (firstSelectedIndex - 1 + choiceItems.length) % choiceItems.length;
    updateFirstMenu();
  } else if (e.key === "ArrowDown") {
    firstSelectedIndex = (firstSelectedIndex + 1) % choiceItems.length;
    updateFirstMenu();
  } else if (e.key === "Enter") {
    playSE("shotConfirm");
    executeFirstMenu();
  } else if (e.key === "Escape" && firstEsc) {
    // 画面を戻す処理
    firstStopping = false; // 操作不能を解除
    firstEsc = false;
    document.getElementById("firstScreen").style.opacity = 1;
    document.getElementById("descScreen").style.opacity = 0;
  }
});
function updateFirstMenu() {
  choiceItems.forEach((item, index) => {
    if (index === firstSelectedIndex) {
      item.classList.add("active");
      playSE("select");
    } else {
      item.classList.remove("active");
    }
  });
}
function executeFirstMenu() {
  if (firstSelectedIndex === 0) {
    console.log("職員会議開幕");
    document.getElementById("firstScreen").style.display = "none";
    document.getElementById("descScreen").style.display = "none";
    document.getElementById("blackScreen").style.display = "block";
    document.getElementById("blackScreen").style.opacity = 1;
    firstStopping = true;
    const trialEl = document.getElementById("classTrial");
    const startEl = document.getElementById("start");
    // 一度クラスを消してから付け直すと、二回目以降も動きます
    trialEl.classList.remove("active"); 
    setTimeout(() => {
        trialEl.classList.add("active");
    }, 100);
    setTimeout(() => {
      void startEl.offsetWidth; 
      startEl.classList.add("starting");
    }, 1200)
    setTimeout(async () => {
      initThree();
      loadCourtroom();
      animate();
      document.getElementById("trialStart").style.opacity = 0;
      await cameraMove({from: { x: 0, y: 23, z: -23 }, to: { x: 0, y: 23, z: -5 },
        speed: 0.1, toFov: 45, rotSpeed: 0.05});
      await cameraMove({ to: { x: 0, y: 30, z: 0 },
        toFov: 80, fovSpeed: 999, speed: 999, pitch: -15, rotSpeed: 999});
      await cameraMove({yaw: 720, pitch: -15, rotSpeed: 0.1})
    },2700)
  } else if (firstSelectedIndex === 1) {
    document.getElementById("firstScreen").style.opacity = 0;
    document.getElementById("descScreen").style.opacity = 1;
    firstStopping = true;
    firstEsc = true;
  }
}
