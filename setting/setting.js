let selectedIndex = 0;
const menuItems = document.querySelectorAll('.settingMenu-item');
let stopping = true;


window.addEventListener('keydown', (e) => {
    if (!stopping && !e.repeat) { // ポーズ（メニュー）中だけ動くように
        if (e.key === 'ArrowUp') {
            selectedIndex = (selectedIndex - 1 + menuItems.length) % menuItems.length;
            updateMenu();
        } else if (e.key === 'ArrowDown') {
            selectedIndex = (selectedIndex + 1) % menuItems.length;
            updateMenu();
        } else if (e.key === 'Enter') {
            playSE("confirm");
            executeSelection();
        }
    }
});

function updateMenu() {
    menuItems.forEach((item, index) => {
        if (index === selectedIndex) {
            item.classList.add('active');
            playSE("selectMove");
        } else {
            item.classList.remove('active');
        }
    });
}

function executeSelection() {
    const action = menuItems[selectedIndex].innerText;
    console.log(action + "を実行します");
    
    // ここで処理を分岐
    if (selectedIndex === 0) {
        stopping = true;
        kotodamaMonitorStopping = false;
        selectedKotodamaIndex = 0;
        updateKotodamaMenu();

        document.getElementById("kotodamaMonitorContainer").style.opacity = "1";

    } else if (selectedIndex === 1) {
        stopping = true;
        setTimeout(() => {
            skillSelectStopping = false;
        },100)
        document.getElementById("settingMenuContainer").style.opacity = 0;
        document.getElementById("skillSelectContainer").style.opacity = 1;
    } else if (selectedIndex === 2) {
        stopping = true;
        document.getElementById("settingContainer").style.display = "none";
    
        // 背景を消す
        changeBackground("none", 50);

        // アニメーション用のクラスを追加
        const trialEl = document.getElementById("classTrial");
    
        // 一度クラスを消してから付け直すと、二回目以降も動きます
        trialEl.classList.remove("active"); 
    
        // ブラウザに「一旦消したこと」を認識させるため、少しだけ待つ
        setTimeout(() => {
            trialEl.classList.add("active");
            playSE("trialStart"); // 裁判開始のようなSEがあれば
        }, 100);
    }
}