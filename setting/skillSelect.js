let currentSP = 0;
let maxSP = 9;
let skillSelectIndex = 0;
const skillItems = document.querySelectorAll(".skillMenu-item");
let skillSelectStopping = true;
const skillList = [
    {name: "残業タフネス",
     sp: 2,
     desc: "ＨＰが２０上昇する<br>（消費ＳＰ　２）<br><br>最大ＨＰ　　１００--＞１２０"
    },
    {name: "コーヒーブレイク",
     sp: 2,
     desc: "精神力が２０上昇する<br>（消費ＳＰ　２）<br><br>精神力　　１００--＞１２０"
    },
    {name: "コーヒーマシン",
     sp: 3,
     desc: "精神力の回復速度が上昇し、インターバルが短くなる<br>（消費ＳＰ　３）<br><br>精神力回復速度　　５--＞８<br>回復インターバル３秒--＞１．５秒"
    },
    {name: "長考",
     sp: 2,
     desc: "ノンストップ議論などの制限時間が延びる<br>（消費ＳＰ　２）<br><br>制限時間　＋６０秒"
     },
     {name: "冷静沈着",
      sp: 3,
      desc: "ノンストップ議論中の照準のブレがなくなる<br>（消費ＳＰ　３）"
     },
     {name: "ソフトタッチ",
      sp: 3,
      desc: "発言にサイレンサーを当ててしまっても、時間が減らなくなる<br>（消費ＳＰ　３）"
     }
]

function updateSPDisplay() {
    document.getElementById("currentSP").innerHTML = currentSP;
    const display = document.getElementById("skillValue");
    if (currentSP > maxSP) {
        display.style.color = "red";
    } else {
        display.style.color = "black";
    }
}


window.addEventListener("keydown", (e) => {
    if (!skillSelectStopping && !e.repeat) {
        if (e.key === "ArrowUp") {
            skillSelectIndex = (skillSelectIndex - 1 + skillItems.length) % skillItems.length;
            updateSkillMenu();
        } else if (e.key === "ArrowDown") {
            skillSelectIndex = (skillSelectIndex + 1) % skillItems.length;
            updateSkillMenu();
        } else if (e.key === "Escape") {
            playSE("back");
            document.getElementById("skillSelectContainer").style.opacity = 0;
            document.getElementById("settingMenuContainer").style.opacity = 1;
            stopping = false;
            skillSelectStopping = true;
        } else if (e.key === "Enter") {
            const currentItem = skillItems[skillSelectIndex];
            const skillData = skillList[skillSelectIndex];
            const hasSelected = currentItem.classList.contains("selected");
            if (!hasSelected) {
                if (currentSP + skillData.sp <= maxSP) {
                    currentItem.classList.add("selected");
                    currentSP += skillData.sp;
                    playSE("skillSet");
                } else {
                    playSE("skillRemove");
                    return;
                }
            } else {
                currentItem.classList.remove("selected");
                currentSP -= skillData.sp;
                playSE("skillRemove");
            }
        }
        updateSPDisplay();
    }
});

function updateSkillMenu() {
    skillItems.forEach((item, index) => {
        if (index === skillSelectIndex) {
            item.classList.add("active");
            playSE("selectMove");
            displaySkillDetail(index)
        } else {
            item.classList.remove("active");
        }
    });
}

function displaySkillDetail(index) {
    const data = skillList[index];
    const descElement = document.getElementById("skillDesc");
    if (data) {
        descElement.innerHTML = data.desc
    }
}