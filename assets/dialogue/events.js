
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
        cameraMove({to: {toX: event.to.toX, toY: event.to.toY+2, toZ: event.to.toZ}, speed: 0.005, yaw: event.slideYaw, rotSpeed: event.slideRotSpeed});
      } else if (event.slide === "Z") {
        cameraMove({to: {toX: event.to.toX, toY: event.to.toY, toZ: event.to.toZ+2}, speed: 0.005, yaw: event.slideYaw, rotSpeed: event.slideRotSpeed});
      } else if (event.slide === "zoom") {
        cameraMove({to: {toX: event.to.toX, toY: event.to.toY, toZ: event.to.toZ}, toFov: event.slideFov, fovSpeed: event.slideFovSpeed, yaw: event.slideYaw, roll: event.slideRoll, rotSpeed: event.slideRotSpeed});
      }
    }
  },

  changeExpression: (event) => {
    window.changeStandInExpression(event.char, event.src);
  },

  intensed: () => {
    document.getElementById("leftBarImg").classList.add("iconBeat");
  }
};