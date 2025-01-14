const startGameBtn = document.getElementById("startGameBtn");
const viewHistoryBtn = document.getElementById("viewHistoryBtn");
const resetGameBtn = document.getElementById("resetGameBtn");
const scoreList = document.getElementById("scoreList");
const outputDiv = document.getElementById("output");
const storyImage = document.getElementById("storyImage");
const backgroundMusic = document.getElementById("backgroundMusic");
const usernameInput = document.getElementById("username");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

let gameStarted = false;
let playerName = '';
let score = 0;
let history = [];

// 音乐播放
function playMusic() {
    backgroundMusic.volume = 0.5;
    backgroundMusic.play().catch(() => console.warn("音乐播放失败"));
}

// 更新输出和图片
function updateOutput(message, image = "") {
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    outputDiv.appendChild(paragraph);
    if (image) {
        storyImage.src = image;
        storyImage.style.display = "block";
    }
}

// 获取玩家名字并开始游戏
async function startGame() {
    if (gameStarted) {
        alert("游戏正在进行中！");
        return;
    }

    gameStarted = true;
    score = 0;
    outputDiv.innerHTML = "";
    playMusic();

    try {
        updateOutput("你进入了一个神秘的图书馆，开始寻找线索...", "static/images/library.jpg");
        await new Promise(resolve => setTimeout(resolve, 2000));

        updateOutput("你发现了一个古老的地图，指向一座神庙...", "static/images/temple.jpg");
        await new Promise(resolve => setTimeout(resolve, 2000));

        const randomEvent = Math.random();
        if (randomEvent < 0.5) {
            throw new Error("你在神庙遇到了守卫，被迫撤退！");
        }

        updateOutput("你击败了守卫，找到了一个宝箱...", "static/images/guardian.jpg");
        await new Promise(resolve => setTimeout(resolve, 2000));

        const treasureResult = Math.random();
        if (treasureResult < 0.7) {
            score = Math.floor(Math.random() * 100 + 50); // 随机得分
            updateOutput(`恭喜！你找到了宝藏！得分：${score}`, "static/images/treasure.jpg");
        } else {
            throw new Error("宝箱竟然是陷阱，你失败了！");
        }
    } catch (error) {
        updateOutput(`游戏失败：${error.message}`, "static/images/failure.jpg");
        score = 0;
    } finally {
        gameStarted = false;
        saveScore();
        backgroundMusic.pause();
    }
}

// 保存分数到后端
function saveScore() {
    const scoreData = { name: playerName, score };
    fetch('/save_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(scoreData)
    })
    .then(response => response.json())
    .then(data => {
        alert(`游戏结束！你的得分是：${score}`);
    })
    .catch(err => console.error("保存得分失败:", err));
}

// 查看历史记录
function viewHistory() {
    scoreList.innerHTML = "";
    fetch('/get_history')
    .then(response => response.json())
    .then(data => {
        history = data;
        history.forEach((record, index) => {
            const li = document.createElement("li");
            li.textContent = `玩家：${record.name}，得分：${record.score}`;
            scoreList.appendChild(li);
        });
        scoreList.style.display = "block";
    })
    .catch(err => console.error("加载历史记录失败:", err));
}

// 重置游戏
function resetGame() {
    gameStarted = false;
    outputDiv.innerHTML = "";
    storyImage.style.display = "none";
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    scoreList.style.display = "none";
    alert("游戏已重置！");
}

// 玩家登录
function login() {
    playerName = usernameInput.value;
    if (playerName) {
        startGameBtn.style.display = "block";
        alert(`欢迎回来，${playerName}！`);
    } else {
        alert("请输入用户名！");
    }
}

// 玩家注册
function register() {
    playerName = usernameInput.value;
    if (playerName) {
        startGameBtn.style.display = "block";
        alert(`注册成功，欢迎你，${playerName}！`);
    } else {
        alert("请输入用户名！");
    }
}

// 按钮事件监听
startGameBtn.addEventListener("click", startGame);
viewHistoryBtn.addEventListener("click", viewHistory);
resetGameBtn.addEventListener("click", resetGame);
loginBtn.addEventListener("click", login);
registerBtn.addEventListener("click", register);