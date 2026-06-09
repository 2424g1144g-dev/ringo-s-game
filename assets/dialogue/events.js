
window.DIALOGUE_EVENTS = {
  background: (event) => {
    changeBackground(event.id, event.fade);
  },

  overlayON: () => {
    document.getElementById("overlay").style.display = "block";
  },

  overlayOFF: () => {
    document.getElementById("overlay").style.display = "none";
  },

  flashWhite: () => {
    document.getElementById("fadeWhite").classList.add("flash");
  },

  whiteOut: () => {
    const el = document.getElementById("fadeWhite");
    el.style.display = "block";
    setTimeout(() => el.style.opacity = 0, 50);
  },

  whiteFlash: () => {
    document.getElementById("fadeWhite").classList.add("flash");
    addEventListener("animationend", () => {
      document.getElementById("fadeWhite").classList.remove("flash");
    })
  },

  flashRed: () => {
    document.getElementById("fadeRed").classList.add("flash");
  },

  backgroundAppear: () => {
    document.getElementById("background_layer").style.display = "block";
  },

  backgroundDisappear: () => {
    document.getElementById("background_layer").style.display = "none";
  },

  bgmChange: (event) => {
    bgm.src = `assets/BGM/${event.id}.mp3`;
  },

  bgmPlay: (event) => playBGM(event.id),
  bgmStop: (event) => stopBGM(event.id),
  bgmFadeOut: (event) => fadeOutBGM(event.id),

  sePlay: (event) => playSE(event.id),
  seStop: (event) => stopSE(event.id),

  sakuraStart: () => startSakura(),
  sakuraStop: () => stopSakura(),


  enterKeyAppear: () => {
    document.getElementById("enterKey").style.display = "block";
  },
  enterKeyDisappear: () => {
    document.getElementById("enterKey").style.display = "none";
  },
  dialogueAppear: () => {
    if (!DIALOGUE.root) return;
    DIALOGUE.root.style.display = "block";
    textEnter = true;
  },

  dialogueDisappear: () => {
    if (!DIALOGUE.root) return;
    DIALOGUE.root.style.display = "none";
    textEnter = false;
  },

  timeDialogueAppearPlaying: (event) => {
    setTimeout(() => {
      if (!DIALOGUE.root) return;
      DIALOGUE.root.style.display = "block";
      textEnter = true;
      DIALOGUE.play();
    },event.id)
  },

  dialogueNext: () => {
    dialogueIndex++;
    playDialogue(dialogueIndex);
  },

  speakerAppear: () => {
    speakerImg.style.display = "block";
  },

  speakerDisappear: () => {
    speakerImg.style.display = "none";
  },

  speakerChange: (event) => {
    speakerImg.src = `assets/characters/${event.id}.png`;
  },

  speakerFade: (event) => {
    speakerImg.style.transition = "opacity 1s linear";
    speakerImg.src = `assets/characters/${event.id}.png`;
    speakerImg.style.opacity = 1;
  },

  speakerFadeOut: () => {
    speakerImg.style.transition = "opacity 1s linear";
    speakerImg.style.opacity = 0;
  },

  openEyes: () => {
    document.getElementById("eyelid-top").style.opacity = 1;
    document.getElementById("eyelid-bottom").style.opacity = 1;
    openEyes();
  },

  prologue: () => {
    chapter();
  },

  showThree: (event) => {
    setTimeout(() => THREECORE.initThree(), event.time ?? 0);
  },

  changeRoom: (event) => {
    setTimeout(() => THREECORE.room(event.id), event.time ?? 0);
  },

  changeRoomText: (event) => {
    changeRoomText(event.text, event.id);
  },

  useDialog: (event) => {
    useDialog(event.id);
    DIALOGUE.init(document.getElementById(event.id),DIALOGUE.data);

  },

  cameraCut: (event) => {
    cameraCut({
      fromPos: event.fP,
      toPos: event.tP,
      fromLook: event.fL,
      toLook: event.tL,
      fromZoom: event.fZ,
      toZoom: event.tZ,
      duration: event.d
    });
  },

  cameraRotate: (event) => {
    cameraRotate({
      yaw: event.yaw,
      pitch: event.pitch,
      duration: event.duration
    })
  },

  cameraShake: (event) => {
    setTimeout (() => {
      shakeCamera(event.id, 700)
    }, 200)
  },

  fadeCharacters: (event) => {
    fadeCharacters({
      from: event.from ?? 1,
      to: event.to ?? 0,
      duration: event.d ?? 600
    });
  },

  dialogue2Appear: () => {
    textEnter = true;
    document.getElementById("dialogue2").style.opacity = 1;
    document.getElementById("dialogueLeftBundle").classList.add("show");
    document.getElementById("dialogueBottomBundle").classList.add("show");
    document.getElementById("dialogueTopBundle").classList.add("show");
    document.getElementById("dialogueCorner").classList.add("show");
    document.querySelector("#dialogue2 .itemBox").classList.add("show");
  },

  dialogue2Disappear: () => {
    textEnter = false;
    document.getElementById("dialogueLeftBundle").classList.remove("show");
    document.getElementById("dialogueBottomBundle").classList.remove("show");
    document.getElementById("dialogueTopBundle").classList.remove("show");
    document.getElementById("dialogueCorner").classList.remove("show");
  },

  dialogue2PreAppear: () => {
    document.getElementById("dialogue2").style.opacity = 1;
    document.getElementById("dialogueTopBundle").classList.add("show");
    document.getElementById("dialogueCorner").classList.add("show");
    document.getElementById("dialogueLeftBundle").classList.remove("show");
    document.getElementById("dialogueBottomBundle").classList.remove("show");
  },

  dialogue2PreDisappear: () => {
    document.getElementById("dialogueTopBundle").classList.remove("show");
    document.getElementById("dialogueCorner").classList.remove("show");
  },

  dialogue3Appear: () => {
    textEnter = true;
    document.getElementById("dialogue3").style.opacity = 1;
  },

  dialogue3Disappear: () => {
    textEnter = false;
    document.getElementById("dialogue3").style.opacity = 0;
  },

  textEnterChange: (event) => {
    textEnter = event.id;
  },

  spriteChange: (event) => {
    spriteChange(event.id);
  },

  slideSprite: (event) => {
    slideSprite(event.to, event.src)
  },

  flashSprite: () => {
    setTimeout (() => {
      document.getElementById("spriteContain").classList.add("whiteFlash");
      addEventListener("animationend", () => {
        document.getElementById("spriteContain").classList.remove("whiteFlash");
      })
    }, 200);
  },

  seTimePlay: (event) => {
    setTimeout (() => {
      playSE(event.id);
    }, 200)
  },

  operationActivate: () => {
    setTimeout (() => {
      cameraShift = true;
      crosshairEnter = true;
      cameraYaw = 0;
      updateSearchingCrosshair();
      document.getElementById("searchingCrosshair").style.opacity = 1;
    },100)
  },
  operateDisable: () => {
    setTimeout (() => {
    },300)
  },

  cameraMove: async (event) => {
    await window.cameraMove(event);
    if (event.slide) {
      if (event.slide === "X") {
        cameraMove({to: {toX: event.to.toX+2, toY: event.to.toY, toZ: event.to.toZ}, speed: 0.005, yaw: event.slideYaw, rotSpeed: event.slideRotSpeed});
      } else if (event.slide === "Y") {
        cameraMove({to: {toX: event.to.toX, toY: event.to.toY+2, toZ: event.to.toZ}, speed: 0.005, yaw: event.slideYaw, roll: event.slideRoll, rotSpeed: event.slideRotSpeed});
      } else if (event.slide === "Z") {
        cameraMove({to: {toX: event.to.toX, toY: event.to.toY, toZ: event.to.toZ+2}, speed: 0.005, yaw: event.slideYaw, roll: event.slideRoll, rotSpeed: event.slideRotSpeed});
      } else if (event.slide === "zoom") {
        cameraMove({to: {toX: event.to.toX, toY: event.to.toY, toZ: event.to.toZ}, speed: 999, toFov: event.slideFov, fovSpeed: event.slideFovSpeed, yaw: event.slideYaw, roll: event.slideRoll, rotSpeed: event.slideRotSpeed});
      } else if (event.slide === "zoomOut") {
        cameraMove({to: {toX: event.to.toX, toY: event.to.toY, toZ: event.to.toZ}, speed: 999, toFov: event.slideFov, fovSpeed: event.slideFovSpeed, yaw: event.slideYaw, pitch: event.slidePitch, roll: event.slideRoll, rotSpeed: event.slideRotSpeed})
      }
    }
  },

  narration: async () => {
    document.getElementById("trialUILeftBar").classList.remove("show");
    await window.cameraMove({ to: { x: 0, y: 30, z: 0 },
      toFov: 80, fovSpeed: 999, speed: 999, pitch: -15, rotSpeed: 999});
    await window.cameraMove({yaw: 720, pitch: -15, rotSpeed: 0.001})
  },
  
  ordinary: async () => {
    await cameraMove({from: { x: 0, y: 23, z: -23 }, to: { x: 0, y: 23, z: -5 },
        speed: 0.1, toFov: 35, rotSpeed: 0.05});
  },
  
  nonstopDebateCamera: async () => {
    const left = document.getElementById("trialUILeftBar");
    const under = document.getElementById("trialUIBottom");
    const word = document.getElementById("wordBar");
    const black = document.getElementById("blackLayer");

    // 💡 1. まずUIをサッと消す
    left.classList.remove("show");
    under.classList.remove("show");
    word.style.opacity = 0;

    // 💡 2.【第1段階】その場で激しくぐるぐる回転（yaw: 360）を開始！
    // 画面が暗くなる前に、まずカメラ自身がスピンし始めます。
    const firstRotation = cameraMove({
      yaw: 360, 
      rotSpeed: 0.05, // 激しめに回る
      speed: 0
    });

    // 💡 3. 回転が始まってすぐ（0.2秒後）、追いかけるように画面を真っ暗にする
    await new Promise(resolve => setTimeout(resolve, 200));
    black.style.transition = 'opacity 0.5s linear';
    black.style.opacity = 1;

    // 💡 4. 1回目の回転と暗転が「完全に終わる」のをしっかり待つ
    await firstRotation;
    await new Promise(resolve => setTimeout(resolve, 300)); // 暗闇の余韻

    // === 💡 ここで画面は完全に真っ暗です（プレイヤーには見えない） ===

    // 💡 5.【第2段階】暗闇の中で、上空のスタート地点へ爆速ワープ＆2回目の大回転移動を発動！
    // 黒幕をじわーっと開けながら、遠くから1080度回りながら中心（0,0,0）へ突っ込ませます。
    black.style.opacity = 0;

    await cameraMove({
      from: { x: 60, y: 100, z: -50 }, // 遠くの上空へ一瞬でワープ
      to: { x: 0, y: 0, z: 0 },         // 中心（証言台）を目指す
      speed: 0.8,  
      toFov: 45, 
      fovSpeed: 999, 
      yaw: 1080,    // 暗転明けからさらに3回転！   
      rotSpeed: 0.07, 
      lookAtPos: {x: 0, y: 15, z: 0}
    });

    // 💡 6.【仕上げ】中心に到着した後、さらに画角をグッと絞る（35）最後のカメラ移動
    await cameraMove({ toFov: 35, yaw: 420, rotSpeed: 0.05 });
  },

  changeExpression: (event) => {
    window.changeStandInExpression(event.char, event.src);
  },

  intensed: () => {
    document.getElementById("leftBarImg").classList.add("iconBeat");
  },

  silent: () => {
    document.getElementById("leftBarImg").classList.remove("iconBeat");
  },

  dhenFlash: () => {
    const canvas = document.querySelector("canvas");
    canvas.classList.remove("action-flash");
    void canvas.offsetWidth;
    canvas.classList.add("action-flash");
  }
};