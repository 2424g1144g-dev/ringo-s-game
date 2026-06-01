window.DIALOGUE_EVENTS = {
  background: (event) => {
    changeBackground(event.id, event.fade);
  },

  itemBoxShow: () => {
    playSE("itemFadeIn");
    document.getElementById("itemBox").classList.add("show");
  },

  itemBoxOut: () => {
    playSE("itemFadeOut");
    document.getElementById("itemBox").classList.remove("show");
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
    setTimeout(() => (el.style.opacity = 0), 50);
  },

  flash: (event) => {
    document.getElementById("flashLayer").style.background = event.id;
    document.getElementById("flashLayer").classList.add("flashAnim");
    addEventListener("animationend", () => {
      document.getElementById("flashLayer").classList.remove("flashAnim");
    });
  },

  flashRed: () => {
    document.getElementById("fadeRed").classList.add("flash");
  },

  fade: (event) => {
    const el = document.getElementById("fadeLayer")
    el.style.background = event.color;
    el.style.transition = `opacity ${event.start}s linear`;
    el.style.opacity = 1;
    setTimeout (() => {
      el.style.transition = `opacity ${event.finish}s linear`;
      el.style.opacity = 0;
    }, event.wait)},

  backgroundAppear: () => {
    document.getElementById("background_layer").style.display = "block";
  },

  backgroundDisappear: () => {
    document.getElementById("background_layer").style.display = "none";
  },

  bgmChange: (event) => {
    bgm.src = `audio/BGM/${event.id}.mp3`;
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
    }, event.id);
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

  speakingDialogueAppear: () => {
    document.getElementById("dialogueSpeaking").style.opacity = 1;
  },

  speakingDialogueDisappear: () => {
    document.getElementById("dialogueSpeaking").style.opacity = 0;
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
    DIALOGUE.init(document.getElementById(event.id), DIALOGUE.data);
  },

  cameraCut: (event) => {
    cameraCut({
      fromPos: event.fP,
      toPos: event.tP,
      fromLook: event.fL,
      toLook: event.tL,
      fromZoom: event.fZ,
      toZoom: event.tZ,
      duration: event.d,
    });
  },

  cameraRotate: (event) => {
    cameraRotate({
      yaw: event.yaw,
      pitch: event.pitch,
      duration: event.duration,
    });
  },

  cameraShake: (event) => {
    setTimeout(() => {
      shakeCamera(event.id, 700);
    }, 200);
  },

  fadeCharacters: (event) => {
    fadeCharacters({
      from: event.from ?? 1,
      to: event.to ?? 0,
      duration: event.d ?? 600,
    });
  },

  dialogue3Appear: () => {
    document.getElementById("dialogue").style.opacity = 1;
  },

  dialogue3Disappear: () => {
    document.getElementById("dialogue").style.opacity = 0;
  },

  textEnterChange: (event) => {
    textEnter = event.id;
  },

  spriteChange: (event) => {
    spriteChange(event.id, d = 100);
  },

  slideSprite: (event) => {
    slideSprite(event.to, event.src);
  },

  flashSprite: () => {
    setTimeout(() => {
      document.getElementById("spriteContain").classList.add("whiteFlash");
      addEventListener("animationend", () => {
        document.getElementById("spriteContain").classList.remove("whiteFlash");
      });
    }, 200);
  },

  seTimePlay: (event) => {
    setTimeout(() => {
      playSE(event.id);
    }, 200);
  },

  operationActivate: () => {
    setTimeout(() => {
      cameraShift = true;
      crosshairEnter = true;
      cameraYaw = 0;
      updateSearchingCrosshair();
      document.getElementById("searchingCrosshair").style.opacity = 1;
    }, 100);
  },
  operateDisable: () => {
    setTimeout(() => {}, 300);
  },


  bulletGet: () => {
    playBullet();
    setTimeout(() => {
      playSE("discover");
    },300)
  },

  setting: () => {
    stopping = false;
    document.getElementById("settingContainer").style.display = "block";
  }
};
