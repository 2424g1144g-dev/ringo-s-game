function playBullet() {
  const el = document.getElementById('bullet');
  const dummy = document.getElementById('bullet-wave-dummy');
  neon = document.getElementById("neon-line");
  document.getElementById("neon-line").classList.remove("neonAnim");
  void neon.offsetWidth;
  document.getElementById("neon-line").classList.add("neonAnim");
  let start = null;
  let waved = false;

  function step(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;

    // 1. 登場 (0.3s)
    if (elapsed <= 300) {
      el.style.transform = `translateX(${(elapsed / 300) * 65}vw)`;
      el.style.opacity = "1";
    }
    // 2. 衝撃波 (0.3s～0.8s)
    else if (elapsed <= 800) {
      if (!waved) {
        // --- 衝撃波 dummy を本体にピッタリ重ねて表示 ---
        const rect = el.getBoundingClientRect();
        Object.assign(dummy.style, {
          display: 'block',
          left: rect.left + 'px',
          top: rect.top + 'px',
          width: rect.width + 'px',
          height: rect.height + 'px',
          opacity: '0.8',
          transform: 'scale(1)'
        });
        waved = true;
      }

      // dummyをJSで大きくしていく
      const p = (elapsed - 300) / 500;
      dummy.style.transform = `scale(${1 + p})`;
      dummy.style.opacity = 0.8 * (1 - p);
      
      el.style.transform = `translateX(65vw)`;
    }
    // 3. 退場 (0.8s～1.1s)
    else if (elapsed <= 1100) {
      dummy.style.display = 'none'; // 衝撃波を確実に消す
      const p = (elapsed - 800) / 300;
      el.style.transform = `translateX(${65 + (p * 70)}vw)`;
    }

    if (elapsed < 1100) {
      requestAnimationFrame(step);
    } else {
      el.style.transform = "translateX(-200vw)";
    }
  };
  requestAnimationFrame(step);
}