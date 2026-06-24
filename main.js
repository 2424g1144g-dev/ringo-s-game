//------------------------------拡大と縮小を防止
window.addEventListener("wheel", (e) => {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && ["+", "-", "0"].includes(e.key)) {
    e.preventDefault();
  }
})

const ndBullet = document.querySelector(".NDbullet")
ndbullet.style.addClassList("changeBullet");
setTimeout(() => {
  ndBullet.textContent = "ツカゴエミツヒロの証言";
},300)
