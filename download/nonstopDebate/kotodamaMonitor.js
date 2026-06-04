let selectedKotodamaIndex = 0;
const kotodamaItems = document.querySelectorAll(".kotodamaMenu-item");
let kotodamaMonitorStopping = true;
const kotodamaList = [
    {name: "オカモトの退職届",
     img: "items/farewellDocument.png",
     desc: "オカモトが書いたであろう退職届、現場の近くに<br>落ちていた。"
    },
    {name: "シノハラの証言",
     img: "items/shinoharaWitness.png",
     desc: "オカモトの退職届に関する証言。どうやら退職届<br>の筆跡とオカモトの筆跡が一致しないらしい。"
    },
    {name: "消えた体育倉庫のハンマー",
     img: "items/hammer.png",
     desc: "事件発覚後こつ然と姿を消してしまったハンマー<br>。頭身は赤く、見た目に反してかなり重い。"
    },
    {name: "ササノの証言",
     img: "items/sasanoWitness.png",
     desc: "体育倉庫に関する証言。どうやら体育倉庫はずっ<br>と施錠されていたらしい。"
    },
    {name: "体育倉庫の鍵の所在",
     img: "items/gymKey.png",
     desc: "体育倉庫の鍵はずっと職員室にあったみたいだ。"
    },
    {name: "密室の体育館",
     img: "backgrounds/gym.png",
     desc: "体育館は密室状態だったようだ。"
    }
]


window.addEventListener("keydown", (e) => {
    if (!kotodamaMonitorStopping) {
        if (e.key === "ArrowUp") {
            selectedKotodamaIndex = (selectedKotodamaIndex - 1 + kotodamaItems.length) % kotodamaItems.length;
            updateKotodamaMenu();
        } else if (e.key === "ArrowDown") {
            selectedKotodamaIndex = (selectedKotodamaIndex + 1) % kotodamaItems.length;
            updateKotodamaMenu();
        } else if (e.key === "Escape") {
            playSE("back")
            document.getElementById("kotodamaMonitorContainer").style.opacity = 0;
            stopping = false;
            kotodamaMonitorStopping = true;
        }
    }
});

function updateKotodamaMenu() {
    kotodamaItems.forEach((item, index) => {
        if (index === selectedKotodamaIndex) {
            item.classList.add("active");
            playSE("selectMove");
            
            // ★詳細表示を更新する関数を呼ぶ
            displayKotodamaDetail(index); 
        } else {
            item.classList.remove("active");
        }
    });
}

function displayKotodamaDetail(index) {
    const data = kotodamaList[index]; // 配列からデータを取得
    const imgElement = document.getElementById("kotodamaItemContain");
    const descElement = document.getElementById("kotodamaDesc");

    if (data) {
        imgElement.src = data.img;  // 画像を差し替え
        descElement.innerHTML = data.desc; // テキストを差し替え
    }
}