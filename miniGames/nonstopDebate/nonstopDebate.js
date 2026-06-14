// 「論」から「ノ」へ、つまり右側の文字から順番に表示させるためのJavaScript
const debate = document.getElementById("debate");
const spans = Array.from(debate.children);

// 配列を逆順（論、議、プ、ッ...）にする
const reverseSpans = spans.reverse();

reverseSpans.forEach((span, i) => {
  // 1文字ごとに150ミリ秒（0.15秒）ずつズラして出現クラスを付与
  setTimeout(() => {
    span.classList.add("appear");
  }, i * 50); 
  // 最後の文字「ノ」が出るのが 7文字×150ms = 1050ms（約1秒後）
});