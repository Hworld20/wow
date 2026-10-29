// 福格行为模型：B = MAP (Motivation, Ability, Prompt)
// 拖延心理学：情绪调节 > 时间管理，自我关怀 > 自我批判

let currentMode = 'standard';
let totalSeconds = 25 * 60;
let remainingSeconds = totalSeconds;
let timerInterval = null;
let isPaused = false;
let startTime = null;
let rescueUsed = false;

const circumference = 2 * Math.PI * 130;
document.getElementById('progressCircle').style.strokeDasharray = circumference;
document.getElementById('progressCircle').style.strokeDashoffset = 0;

const celebrateMessages = {
    micro: "你完成了2分钟微习惯！<br>启动阻力已被打破，这是最难的一步。",
    standard: "25分钟专注完成！<br>你不仅管理了时间，更调节了情绪。",
    rescue: "虽然中途有波动，但你选择了自我关怀而非自我批判。<br>这才是持久改变的关键。"
};

const anchorActions = [
    "喝一口水，伸展15秒",
    "站起来，看远处20秒",
    "深呼吸3次，放松肩膀",
    "写下下一个微小步骤"
];

const emotionResponses = {
    anxiety: "💡 <strong>焦虑时，大脑在保护你。</strong><br><br>试试：把任务改成'只做5分钟'。焦虑通常来自对结果的想象，而非任务本身。你不需要做好，只需要开始。",
    boredom: "💡 <strong>无聊说明任务缺乏即时反馈。</strong><br><br>试试：给任务加个'游戏化'挑战——'看看这2分钟我能写多少字'，或换一个更感兴趣的环境（咖啡馆/阳台）。",
    perfectionism: "💡 <strong>完美主义是拖延的伪装。</strong><br><br>试试：明确告诉自己'我现在做的是草稿/烂版本'。完成>完美，先有再优。",
    overwhelm: "💡 <strong>任务太大时，大脑会冻结。</strong><br><br>试试：只问'下一步物理动作是什么？'——不是'写报告'，而是'打开文档，敲下标题'。"
};

function selectMode(btn, mode) {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = mode;
}

function startTimer() {
    rescueUsed = false;
    if (currentMode === 'micro') {
        totalSeconds = 2 * 60; // 微习惯：2分钟
    } else {
        totalSeconds = 25 * 60;
    }
    remainingSeconds = totalSeconds;
    startTime = new Date();
    isPaused = false;
    
    document.getElementById('phaseSetup').style.display = 'none';
    document.getElementById('phaseFocus').style.display = 'block';
    document.getElementById('phaseCelebrate').style.display = 'none';
    
    updateDisplay();
    startInterval();
}

function startInterval() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isPaused && remainingSeconds > 0) {
            remainingSeconds--;
            updateDisplay();
            if (remainingSeconds === 0) {
                completeTimer();
            }
        }
    }, 1000);
}

function updateDisplay() {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    document.getElementById('timeDisplay').textContent = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    const progress = remainingSeconds / totalSeconds;
    document.getElementById('progressCircle').style.strokeDashoffset = 
        circumference * (1 - progress);
}

function pauseTimer() {
    isPaused = !isPaused;
    event.target.textContent = isPaused ? '继续' : '暂停';
}

function stopTimer() {
    clearInterval(timerInterval);
    // 不批判，只记录
    addHistory('中断', 'tag-rescue');
    backToSetup();
}

function completeTimer() {
    clearInterval(timerInterval);
    
    // 福格模型：即时庆祝（Shine）
    createParticles();
    
    const msgKey = rescueUsed ? 'rescue' : currentMode;
    document.getElementById('celebrateMsg').innerHTML = celebrateMessages[msgKey];
    document.getElementById('anchorText').textContent = 
        anchorActions[Math.floor(Math.random() * anchorActions.length)];
    
    document.getElementById('phaseFocus').style.display = 'none';
    document.getElementById('phaseCelebrate').style.display = 'block';
    
    addHistory('完成', 'tag-success');
}

function showRescue() {
    rescueUsed = true;
    document.getElementById('rescueOverlay').style.display = 'flex';
}

function selectEmotion(emotion) {
    document.getElementById('rescueResponse').innerHTML = emotionResponses[emotion];
    document.getElementById('rescueResponse').style.display = 'block';
}

function continueAfterRescue() {
    document.getElementById('rescueOverlay').style.display = 'none';
    // 福格模型：降低能力要求，继续但缩短
    if (remainingSeconds > 5 * 60) {
        remainingSeconds = 5 * 60; // 改为只做5分钟
        totalSeconds = 5 * 60;
        updateDisplay();
    }
    if (isPaused) pauseTimer(); // 确保是运行状态
}

function restAfterRescue() {
    document.getElementById('rescueOverlay').style.display = 'none';
    addHistory('休息', 'tag-rescue');
    backToSetup();
}

function backToSetup() {
    document.getElementById('phaseSetup').style.display = 'block';
    document.getElementById('phaseFocus').style.display = 'none';
    document.getElementById('phaseCelebrate').style.display = 'none';
    clearInterval(timerInterval);
}

function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.background = ['gold', '#667eea', '#48bb78', '#ff6b6b'][Math.floor(Math.random() * 4)];
            container.appendChild(p);
            setTimeout(() => p.remove(), 2000);
        }, i * 50);
    }
}

function addHistory(type, tagClass) {
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                   now.getMinutes().toString().padStart(2, '0');
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
        <span>${timeStr} ${type}</span>
        <span class="tag ${tagClass}">${type === '完成' ? '✓ 胜利' : type === '中断' ? '→ 调整' : '☕ 休息'}</span>
    `;
    document.getElementById('historyItems').prepend(item);
}
// ===== 每日进度条功能 =====
let dailyTarget = 6;
let completedCount = 0;

// 初始化进度条
function initProgress() {
    const track = document.getElementById('tomatoTrack');
    track.innerHTML = '';
    
    for (let i = 0; i < dailyTarget; i++) {
        const slot = document.createElement('div');
        slot.className = 'tomato-slot';
        slot.innerHTML = `
            <div class="tomato-canvas" id="tomato-${i}">
                <div class="tomato-empty"></div>
            </div>
        `;
        track.appendChild(slot);
    }
    updateProgressText();
}

// 调整目标数量
function adjustTarget(delta) {
    dailyTarget = Math.max(1, Math.min(12, dailyTarget + delta));
    document.getElementById('targetNum').textContent = dailyTarget;
    
    // 如果减少了目标，已完成的数量也要相应调整
    if (completedCount > dailyTarget) {
        completedCount = dailyTarget;
    }
    initProgress();
    renderProgress();
}

// 更新进度文字
function updateProgressText() {
    document.getElementById('progressText').textContent = `${completedCount} / ${dailyTarget} 个番茄`;
}

// 渲染进度（更新番茄图案）
function renderProgress() {
    for (let i = 0; i < dailyTarget; i++) {
        const tomato = document.getElementById(`tomato-${i}`);
        if (i < completedCount) {
            // 显示完成的卡通番茄
            tomato.innerHTML = `
                <div class="tomato-full">
                    <div class="tomato-leaf"></div>
                    <div class="tomato-body"></div>
                    <div class="tomato-face">
                        <div class="tomato-eye left"></div>
                        <div class="tomato-eye right"></div>
                        <div class="tomato-smile"></div>
                    </div>
                </div>
            `;
        } else {
            // 显示空位
            tomato.innerHTML = '<div class="tomato-empty"></div>';
        }
    }
    updateProgressText();
}

// 完成一个番茄时的动画
function completeOneTomato() {
    if (completedCount < dailyTarget) {
        const index = completedCount;
        completedCount++;
        
        // 延迟渲染，让动画在庆祝页面显示后触发
        setTimeout(() => {
            renderProgress();
            
            // 检查是否达成今日目标
            if (completedCount === dailyTarget) {
                setTimeout(showGoalCelebration, 800);
            }
        }, 500);
    }
}

// 显示目标达成庆祝
function showGoalCelebration() {
    const overlay = document.createElement('div');
    overlay.className = 'rescue-overlay';
    overlay.style.display = 'flex';
    overlay.innerHTML = `
        <div class="rescue-card" style="text-align: center;">
            <div style="font-size: 60px; margin-bottom: 16px;">🏆</div>
            <div class="rescue-title" style="font-size: 24px;">今日目标达成！</div>
            <div class="rescue-sub" style="font-size: 15px; margin: 16px 0;">
                你完成了 ${dailyTarget} 个番茄钟<br>
                根据福格模型，你正在建立<strong>稳定的身份认同</strong>：<br>
                <span style="color: #c53030; font-weight: 600;">"我是一个能持续专注的人"</span>
            </div>
            <button class="rescue-action-btn continue-btn" onclick="this.parentElement.parentElement.remove()">
                🎉 太棒了，继续
            </button>
        </div>
    `;
    document.body.appendChild(overlay);
    
    // 添加粒子效果
    createParticles();
}

// 修改原有的完成函数，加入进度更新
const originalCompleteTimer = completeTimer;
completeTimer = function() {
    originalCompleteTimer();
    completeOneTomato();
    
    // 在庆祝页面显示当前进度
    const growContainer = document.getElementById('tomatoGrow');
    growContainer.innerHTML = '<div class="growing-tomato">🍅</div>';
};

// 页面加载时初始化
window.onload = function() {
    initProgress();
};