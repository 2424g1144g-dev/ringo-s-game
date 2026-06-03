
window.DIALOGUE_LINES = window.DIALOGUE_LINES || {};

DIALOGUE_LINES.dialogueStart = [
  { name: "コウチョウ", lines: [{segments: [{text: "まずは、職員会議の簡単な説明を始めますね。"}]},
                          {segments: [{text: "職員会議の結果は貴方達の投票によって決定されます。"}]}]},
  { name: "コウチョウ", lines: [{segments: [{text: "正しいクロを指摘できれば、クロだけが懲戒解雇。"}]},
                          {segments: [{text: "ですが...もし間違った人物をクロとした場合は..."}]}]},
  { name: "コウチョウ", lines: [{segments: [{text: "クロ以外の全員が懲戒解雇となり、"}]},
                          {segments: [{text: "クロだけが１０億円を手にし、一生安泰な人生を得られます！"}]}]},
  { name: "シノハラ　リュウジ", lines: [{segments: [{text: "おい...本当にこの中に犯人がおるんよな？"}], event: [{type: "cameraMove", to: {toX: -10, toY: 23, toZ: 0},toFov: 45, fovSpeed: 999, speed: 999, yaw: 80, rotSpeed: 999, slide: "Z", slideYaw: 90, slideRotSpeed: 0.02},{type: "changeExpression", char: "RYUJI", src: "assets/three/characters/RYUJI/Ryuji_Think.png"}]}]},
  { name: "コウチョウ", lines: [{segments: [{text: "はい。犯人は確実にこの中にいますよ。"}]}]},
  { name: "ツカゴエ　ミツヒロ", lines: [{segments: [{text: "誰や！岡本先生を退職させたんは！！！"}], event: [{type: "cameraMove", to: {toX: 10, toY: 23, toZ: 0},toFov: 45, fovSpeed: 0.05, speed: 999, yaw: -45, rotSpeed: 999, slide: "Y", slideYaw: -45, slideRotSpeed: 0.02},{type: "changeExpression", char: "MITSUHIRO", src: "assets/three/characters/MITSUHIRO/Mitsuhiro_Point.png"}]}]}, 
  { name: "ツカゴエ　ミツヒロ", lines: [{segments: [{text: "お前らの誰かのせいで"}]},
                                        {segments: [{text: "こんなくだらん会議が始まっとんやぞ！！！"}]}]},
  { name: "フルイチ　ヒデハル", lines: [{segments: [{text: "ちゃっかり自分は容疑者から外すんですねー..."}]},
                                        {segments: [{text: "そういうあなたが犯人なんじゃないですか？"}]}]},
  { name: "ササノ　ケント", lines: [{segments: [{text: "そうやって決めつけていては、"}]},
                                    {segments: [{text: "真実にたどり着くことはできませんよ。"}]}]},
  { name: "ニシモト　タツロウ", lines: [{segments: [{text: "それには、僕も賛成です。"}]},
                                        {segments: [{text: "ですが...何から話し合えば..."}]}]},
  { name: "ヤマモト　シゲオ", lines: [{segments: [{text: "まずは...事件についてまとめるってのはどうじゃ？"}]}]},
  { name: "ヤマモト　シゲオ", lines: [{segments: [{text: "前提となる基礎を固めるべき...論表と同じじゃな。"}]}]},
  { name: "ヤマモト　ケイゾウ", lines: [{segments: [{text: "じゃあ早速議論を始めましょうか..."}]},
                                        {segments: [{text: "妻も愛犬のパピヨンも待っとるしな..."}]}]}
]
