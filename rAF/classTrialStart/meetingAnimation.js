const target = document.getElementById("classTrial");
const text = target.innerText;
target.innerHTML = ""; // 一旦空にする

// 1文字ずつspanに包んで再配置
const spans = text.split("").map(char => {
    const span = document.createElement("span");
    span.innerText = char;
    target.appendChild(span);
    return {
        el: span,
        x: 0,
        y: 0,
        rotate: 0,
        active: false,
        startTime: 0
    };
});

let currentIndex = 0;
const interval = 200; // 次の文字が出るまでの時間(ms)
let lastTime = 0;

function animate(time) {
    if (!lastTime) lastTime = time;
    const delta = time - lastTime;

    // 一定時間ごとに次の文字をアクティブにする
    if (currentIndex < spans.length) {
        if (time > currentIndex * interval + 500) { // 500ms後に開始
            spans[currentIndex].active = true;
            spans[currentIndex].el.style.opacity = 1;
            currentIndex++;
        }
    }

    spans.forEach((data, index) => {
        if (!data.active) return;

        // --- Shake(揺れ)の計算 ---
        // Math.randomを使うと激しすぎるので、sin波を組み合わせるのがコツ
        const shakeX = (Math.random() - 0.5) * 5; 
        const shakeY = (Math.random() - 0.5) * 5;

        // --- Rotate(回転)の計算 ---
        // 時間経過とともに回転を減衰させる、あるいは一定に回す
        const rotate = Math.sin(time * 0.01 + index) * 10; 

        // 反映
        data.el.style.transform = `translate(${shakeX}px, ${shakeY}px) rotate(${rotate}deg)`;
    });

    requestAnimationFrame(animate);
}

// アニメーション開始
requestAnimationFrame(animate);