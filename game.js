const startGameBtn = document.getElementById("startGameBtn");
const viewHistoryBtn = document.getElementById("viewHistoryBtn");
const resetGameBtn = document.getElementById("resetGameBtn");
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const nextStepBtn = document.getElementById("nextStepBtn"); // 新增的按钮
const scoreList = document.getElementById("scoreList");
const outputDiv = document.getElementById("output");
const storyImage = document.getElementById("storyImage");
const backgroundMusic = document.getElementById("backgroundMusic");
const playerInfo = document.getElementById("playerInfo");
const playerNameDisplay = document.getElementById("playerNameDisplay");

let gameStarted = false;
let playerName = '';
let score = 0;
let history = [];
let currentStep = 0; // 当前步骤

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

// 玩家注册
function registerPlayer() {
    playerName = prompt("请输入你的名字：") || "玩家";
    alert("注册成功，欢迎 " + playerName + "！");
    playerNameDisplay.textContent = "玩家名: " + playerName;
    playerInfo.style.display = "block";
}

// 玩家登录
function loginPlayer() {
    playerName = prompt("请输入你的名字：") || "玩家";
    alert("登录成功，欢迎回来 " + playerName + "！");
    playerNameDisplay.textContent = "玩家名: " + playerName;
    playerInfo.style.display = "block";
}

// 开始游戏
function startGame() {
    if (gameStarted) {
        alert("游戏正在进行中！");
        return;
    }
    gameStarted = true;
    score = 0;
    currentStep = 0; // 重置当前步骤
    outputDiv.innerHTML = "";
    playMusic(); // 开始播放音乐
    updateOutput("你进入了一个神秘的图书馆，开始寻找线索...", "static/images/library.jpg");
}

// 手动控制游戏进度
function nextStep() {
    if (!gameStarted) {
        alert("请先开始游戏！");
        return;
    }

    currentStep++;
    switch (currentStep) {
        case 1:
            updateOutput("你发现了一个古老的地图，指向一座神庙...", "static/images/temple.jpg");
            break;
        case 2:
            const randomEvent = Math.random();
            // 调整成功概率，例如将成功概率提高到80%
            if (randomEvent < 0.8) { // 80% 的成功率
                updateOutput("你击败了守卫，找到了一个宝箱...", "static/images/guardian.jpg");
            } else {
                updateOutput("你在神庙遇到了守卫，被迫撤退！", "static/images/failure.jpg");
                endGame();
            }
            break;
        case 3:
            const treasureResult = Math.random();
            // 调整宝藏成功概率，例如将成功概率提高到85%
            if (treasureResult < 0.85) { // 85% 的成功率
                score = Math.floor(Math.random() * 100 + 50); // 随机得分
                updateOutput(`恭喜！你找到了宝藏！得分：${score}`, "static/images/treasure.jpg");
            } else {
                updateOutput("宝箱竟然是陷阱，你失败了！", "static/images/failure.jpg");
                endGame();
            }
            break;
        default:
            alert("游戏已结束，请重置游戏或查看历史记录。");
            break;
    }
}

// 结束游戏
function endGame() {
    gameStarted = false;
    saveScore();
    backgroundMusic.pause();
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
            history.forEach((record) => {
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
    backgroundMusic.pause(); // 暂停音乐
    backgroundMusic.currentTime = 0; // 重置音乐时间
    scoreList.style.display = "none";
    alert("游戏已重置！");
}

// 按钮事件监听
startGameBtn.addEventListener("click", startGame);
nextStepBtn.addEventListener("click", nextStep); // 监听下一步按钮
viewHistoryBtn.addEventListener("click", viewHistory);
resetGameBtn.addEventListener("click", resetGame);
registerBtn.addEventListener("click", registerPlayer);
loginBtn.addEventListener("click", loginPlayer);
