// =======================================
// ひらがなゲーム
// 前半
// =======================================

// -------------------------------
// ひらがな一覧（67文字）
// -------------------------------

const kanaList = [
    "あ","い","う","え","お",
    "か","き","く","け","こ",
    "さ","し","す","せ","そ",
    "た","ち","つ","て","と",
    "な","に","ぬ","ね","の",
    "は","ひ","ふ","へ","ほ",
    "ま","み","む","め","も",
    "や","ゆ","よ",
    "ら","り","る","れ","ろ",
    "わ",
    "が","ぎ","ぐ","げ","ご",
    "ざ","じ","ず","ぜ","ぞ",
    "だ","で","ど",
    "ば","び","ぶ","べ","ぼ",
    "ぱ","ぴ","ぷ","ぺ","ぽ"
];

// -------------------------------
// データ作成
// -------------------------------

const words = kanaList.map((kana, index) => ({

    kana: kana,

    image: `images/image${index + 1}.png`

}));

// -------------------------------
// 効果音
// -------------------------------

const correctSound = new Audio("sounds/correct.mp3");

const wrongSound = new Audio("sounds/wrong.mp3");

// -------------------------------
// HTML取得
// -------------------------------

const kana = document.getElementById("kana");

const choices = document.getElementById("choices");

const message = document.getElementById("message");

const nextButton = document.getElementById("nextButton");

// -------------------------------
// ゲーム用変数
// -------------------------------

let questionOrder = [];

let currentIndex = 0;

let answer = null;

let answered = false;

// -------------------------------
// 出題順を作る
// （67文字をシャッフル）
// -------------------------------

function makeQuestionOrder() {

    questionOrder = [...words];

    shuffle(questionOrder);

    currentIndex = 0;

}

// -------------------------------
// 配列シャッフル
// -------------------------------

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

}

// -------------------------------
// 次の問題
// -------------------------------

function nextQuestion() {

    answered = false;

    message.textContent = "";

    nextButton.style.display = "none";

    if (currentIndex >= questionOrder.length) {

        makeQuestionOrder();

    }

    answer = questionOrder[currentIndex];

    currentIndex++;

   kana.textContent = answer.kana;
   
    // 不正解候補を作る
    let wrongs = words.filter(w => w.kana !== answer.kana);

    shuffle(wrongs);

    // 3択
    let choiceList = [

        answer,

        wrongs[0],

        wrongs[1]

    ];

    shuffle(choiceList);

    showChoices(choiceList);

}

// -------------------------------
// 画像表示
// -------------------------------

function showChoices(list) {

    choices.innerHTML = "";

    list.forEach(item => {

        const div = document.createElement("div");

        div.className = "choice";

        const img = document.createElement("img");

        img.src = item.image;

        img.alt = item.kana;

        img.onclick = () => judge(item, img);

        // 頭文字表示
        const label = document.createElement("div");

        label.className = "kana-label hidden";

        label.textContent = item.kana;

        div.appendChild(img);
        div.appendChild(label);

        choices.appendChild(div);

    });

}

// -------------------------------
// 判定
// -------------------------------

function judge(item, clickedImg) {

    // 正解後は何もできない
    if (answered) {
        return;
    }

    // 正解！
    if (item.kana === answer.kana) {

        answered = true;

        // 効果音
        correctSound.currentTime = 0;
        correctSound.play();

        message.textContent = "⭕ せいかい！";
        
        document.querySelectorAll(".kana-label").forEach(label => {
            label.classList.remove("hidden");
        });

        // 緑枠
        clickedImg.classList.add("correct");

        // 次へボタン表示
        nextButton.style.display = "inline-block";

    }

    // 不正解
    else {

        // 同じ画像を何度も押さない
        if (clickedImg.classList.contains("wrong")) {
            return;
        }

        // 効果音
        wrongSound.currentTime = 0;
        wrongSound.play();

        message.textContent = "❌ ざんねん";

        // 赤枠
        clickedImg.classList.add("wrong");

    }

}



// -------------------------------
// 次へボタン
// -------------------------------

nextButton.addEventListener("click", function () {

    nextQuestion();

});

// -------------------------------
// 初期化
// -------------------------------

makeQuestionOrder();

nextQuestion();
