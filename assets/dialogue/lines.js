
window.DIALOGUE_LINES = window.DIALOGUE_LINES || {};

DIALOGUE_LINES.dialogueStart = [
  { name: "コウチョウ", lines: [{segments: [{text: "まずは、職員会議の簡単な説明を始めますね。"}]},
                          {segments: [{text: "職員会議の結果は貴方達の投票によって決定されます。"}]}]},
  { name: "コウチョウ", lines: [{segments: [{text: "正しいクロを指摘できれば、クロだけが懲戒解雇。"}]},
                          {segments: [{text: "ですが...もし間違った人物をクロとした場合は..."}]}]},
  { name: "コウチョウ", lines: [{segments: [{text: "クロ以外の全員が懲戒解雇となり、"}]},
                          {segments: [{text: "クロだけが１０億円を手にし、一生安泰な人生を得られます！"}]}]},
  { name: "シノハラ　リュウジ", lines: [{segments: [{text: "おい...本当にこの中に犯人がおるんよな？"}], event: [{type: "cameraMove", to: {toX: -10, toY: 23, toZ: -1},toFov: 45, fovSpeed: 999, speed: 999, yaw: 80, rotSpeed: 999, slide: "Z", slideYaw: 90, slideRotSpeed: 0.02},{type: "changeExpression", char: "RYUJI", src: "assets/three/characters/RYUJI/Ryuji_Think.png"}]}]},
  { name: "コウチョウ", lines: [{segments: [{text: "はい。犯人は確実にこの中にいますよ。"}]}]},
  { name: "ツカゴエ　ミツヒロ", lines: [{segments: [{text: "誰や！岡本先生を退職させたんは！！！"}], event: [{type: "cameraMove", to: {toX: -2, toY: 25, toZ: 0},toFov: 20, fovSpeed: 2, speed: 999, yaw: -45, rotSpeed: 999, slide: "zoom", slideYaw: -45, slideRotSpeed: 0.02, slideFov: 25, slideFovSpeed: 0.02},{type: "changeExpression", char: "MITSUHIRO", src: "assets/three/characters/MITSUHIRO/Mitsuhiro_Point.png"},{type: "intensed"}]}]}, 
  { name: "ツカゴエ　ミツヒロ", lines: [{segments: [{text: "お前らの誰かのせいで"}]},
                                        {segments: [{text: "こんなくだらん会議が始まっとんやぞ！！！"}]}]},
  { name: "フルイチ　ヒデハル", lines: [{segments: [{text: "ちゃっかり自分は容疑者から外すんですねー..."}], event: [{type: "cameraMove", to: {toX: -7, toY: 25, toZ: -8},toFov: 45, fovSpeed: 999, speed: 999, yaw: 35, roll: 15, rotSpeed: 999, slide: "Z", slideYaw: 45, slideRoll: 15, slideRotSpeed: 0.02},{type: "changeExpression", char: "FAKEFURUICHI", src: "assets/three/characters/FAKEFURUICHI/FakeFuruichi_See.png"},{type: "silent"}]},
                                        {segments: [{text: "そういうあなたが犯人なんじゃないですか？"}]}]},
  { name: "ササノ　ケント", lines: [{segments: [{text: "そうやって決めつけていては、"}], event: [{type: "cameraMove", to: {toX: -15, toY: 25, toZ: 15},toFov: 60, fovSpeed: 999, yaw: 135, rotSpeed: 999, slide: "X", slideYaw: 135, slideRotSpeed: 999},{type: "changeExpression", char: "KENTO", src: "assets/three/characters/KENTO/Kento_Explain.png"}]},
                                    {segments: [{text: "真実にたどり着くことはできませんよ。"}]}]},
  { name: "ニシモト　タツロウ", lines: [{segments: [{text: "それには、僕も賛成です。"}], event: [{type: "cameraMove", to: {toX: 0, toY: 23, toZ: -22},toFov: 70, fovSpeed: 999, slide: "Y",speed: 999}]},
                                        {segments: [{text: "ですが...何から話し合えば..."}]}]},
  { name: "ヤマモト　シゲオ", lines: [{segments: [{text: "まずは...事件についてまとめるってのはどうじゃ？"}], event: [{type: "cameraMove", to: {toX: 0, toY: 31, toZ: 10}, toFov: 45, fovSpeed: 999, speed: 0.05, yaw: 180, pitch: -20, rotSpeed: 999, slide: "zoomOut", slideFov: 55, slideFovSpeed: 0.001, slideYaw: 180, slidePitch: -20},{type: "changeExpression", char: "SHIGE", src: "assets/three/characters/SHIGE/Shige_Doubt.png"}]}]},
  { name: "ヤマモト　シゲオ", lines: [{segments: [{text: "前提となる基礎を固めるべき...論表と同じじゃな。"}]}]},
  { name: "ヤマモト　ケイゾウ", lines: [{segments: [{text: "じゃあ早速議論を始めましょうか..."}], event: [{type: "cameraMove", to: {toX: 13, y: 23, z: 6}, speed: 999, toFov: 45, fovSpeed: 999, speed: 999, yaw: 225, rotSpeed: 999, slide: "X", slideYaw: 225}]},
                                        {segments: [{text: "妻も愛犬のパピヨンも待っとるしな..."}]}]}
]
