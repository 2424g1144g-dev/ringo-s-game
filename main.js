//------------------------------拡大と縮小を防止
window.addEventListener("wheel", (e) => {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && ["+", "-", "0"].includes(e.key)) {
    e.preventDefault();
  }
})

const cylinder = document.getElementById("cylinder");
let currentAngle = 0;
for (let step = 0; step < 20; step++) {
  currentAngle += 60; 
  cylinder.style.setProperty('--angle', `${currentAngle}deg`);
}
