/**
 * Him Wong Games - Shared Game Engine
 * 通用遊戲引擎 - 提供所有遊戲的共用功能
 */

class GameEngine {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas?.getContext('2d');
        this.options = {
            width: 800,
            height: 500,
            fps: 60,
            ...options
        };
        
        if (this.canvas) {
            this.canvas.width = this.options.width;
            this.canvas.height = this.options.height;
        }
        
        // 遊戲狀態
        this.gameState = {
            score: 0,
            highScore: 0,
            level: 1,
            gameOver: false,
            paused: false,
            running: false
        };
        
        // 粒子系統
        this.particles = [];
        
        // 動畫相關
        this.lastTime = 0;
        this.deltaTime = 0;
        this.animationFrameId = null;
        
        // 音效系統
        this.audio = new AudioSystem();
    }

    // ==================== 儲存系統 ====================
    
    /**
     * 安全的 localStorage 讀取
     */
    getStorage(key, defaultValue = 0) {
        try {
            const value = localStorage.getItem(key);
            return value !== null ? parseInt(value) || 0 : defaultValue;
        } catch (error) {
            console.warn(`無法讀取 ${key}:`, error);
            return defaultValue;
        }
    }
    
    /**
     * 安全的 localStorage 寫入
     */
    setStorage(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.warn(`無法儲存 ${key}:`, error);
            return false;
        }
    }
    
    /**
     * 載入最高分
     */
    loadHighScore(key) {
        this.gameState.highScore = this.getStorage(key, 0);
        return this.gameState.highScore;
    }
    
    /**
     * 儲存最高分
     */
    saveHighScore(key, score = null) {
        const newScore = score ?? this.gameState.score;
        if (newScore > this.gameState.highScore) {
            this.gameState.highScore = newScore;
            this.setStorage(key, newScore);
            return true; // 打破紀錄
        }
        return false;
    }
    
    /**
     * 清除儲存資料
     */
    clearStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`無法清除 ${key}:`, error);
            return false;
        }
    }

    // ==================== 粒子系統 ====================
    
    /**
     * 建立粒子效果
     */
    createParticles(x, y, options = {}) {
        const defaults = {
            count: 15,
            color: '#FFD700',
            speed: 3,
            size: 4,
            life: 40,
            gravity: 0.1,
            spread: Math.PI * 2
        };
        
        const config = { ...defaults, ...options };
        
        for (let i = 0; i < config.count; i++) {
            const angle = Math.random() * config.spread;
            const velocity = Math.random() * config.speed;
            
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: config.size * (0.5 + Math.random() * 0.5),
                color: config.color,
                life: config.life,
                maxLife: config.life,
                gravity: config.gravity
            });
        }
    }
    
    /**
     * 更新粒子
     */
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.life--;
            
            // 淡出效果
            p.alpha = p.life / p.maxLife;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    /**
     * 繪製粒子
     */
    drawParticles() {
        if (!this.ctx) return;
        
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    /**
     * 清除所有粒子
     */
    clearParticles() {
        this.particles = [];
    }

    // ==================== 遊戲循環 ====================
    
    /**
     * 開始遊戲循環
     */
    startGameLoop(updateFn, drawFn) {
        if (this.gameState.running) return;
        
        this.gameState.running = true;
        this.gameState.gameOver = false;
        this.gameState.paused = false;
        
        const loop = (timestamp) => {
            if (!this.gameState.running) return;
            
            this.deltaTime = timestamp - this.lastTime;
            this.lastTime = timestamp;
            
            if (!this.gameState.paused) {
                updateFn(this.deltaTime);
            }
            
            drawFn();
            
            this.updateParticles();
            
            this.animationFrameId = requestAnimationFrame(loop);
        };
        
        this.animationFrameId = requestAnimationFrame(loop);
    }
    
    /**
     * 暫停/繼續遊戲
     */
    togglePause() {
        this.gameState.paused = !this.gameState.paused;
        return this.gameState.paused;
    }
    
    /**
     * 停止遊戲
     */
    stopGame() {
        this.gameState.running = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
    
    /**
     * 重置遊戲狀態
     */
    resetGame() {
        this.gameState.score = 0;
        this.gameState.level = 1;
        this.gameState.gameOver = false;
        this.gameState.paused = false;
        this.particles = [];
    }

    // ==================== UI 工具 ====================
    
    /**
     * 更新分數顯示
     */
    updateScoreDisplay(elementId) {
        const el = document.getElementById(elementId);
        if (el) el.textContent = this.gameState.score;
    }
    
    /**
     * 更新最高分顯示
     */
    updateHighScoreDisplay(elementId) {
        const el = document.getElementById(elementId);
        if (el) el.textContent = this.gameState.highScore;
    }
    
    /**
     * 更新等級顯示
     */
    updateLevelDisplay(elementId) {
        const el = document.getElementById(elementId);
        if (el) el.textContent = this.gameState.level;
    }
    
    /**
     * 顯示遊戲結束畫面
     */
    showGameOver(options = {}) {
        const {
            title = '遊戲結束',
            score = this.gameState.score,
            highScore = this.gameState.highScore,
            isNewRecord = false,
            onRestart = null
        } = options;
        
        // 播放遊戲結束音效
        this.audio.play('gameover');
        
        // 建立遊戲結束畫面
        const overlay = document.createElement('div');
        overlay.id = 'gameOverOverlay';
        overlay.innerHTML = `
            <div class="game-over-content">
                <h2>${title}</h2>
                <p>分數: <span class="final-score">${score}</span></p>
                ${isNewRecord ? '<p class="new-record">🎉 新紀錄！ 🎉</p>' : ''}
                <p>最高分: ${highScore}</p>
                <button id="restartBtn">再玩一次</button>
            </div>
        `;
        
        // 樣式
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        const content = overlay.querySelector('.game-over-content');
        content.style.cssText = `
            background: #2d2d44;
            padding: 40px;
            border-radius: 15px;
            text-align: center;
            border: 2px solid #6c63ff;
        `;
        
        const restartBtn = overlay.querySelector('#restartBtn');
        restartBtn.style.cssText = `
            background: linear-gradient(90deg, #6c63ff, #5a52d5);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 1.2rem;
            cursor: pointer;
            margin-top: 20px;
        `;
        
        restartBtn.addEventListener('click', () => {
            overlay.remove();
            if (onRestart) onRestart();
        });
        
        document.body.appendChild(overlay);
    }
    
    /**
     * 顯示勝利畫面
     */
    showVictory(options = {}) {
        const {
            title = '恭喜過關！',
            subtitle = '',
            score = this.gameState.score,
            onNext = null,
            onReplay = null
        } = options;
        
        this.audio.play('victory');
        this.createParticles(window.innerWidth / 2, window.innerHeight / 2, {
            count: 50,
            color: ['#FFD700', '#FF6B6B', '#4CAF50', '#6c63ff']
        });
        
        const overlay = document.createElement('div');
        overlay.id = 'victoryOverlay';
        overlay.innerHTML = `
            <div class="victory-content">
                <h2>${title}</h2>
                ${subtitle ? `<p>${subtitle}</p>` : ''}
                <p class="final-score">分數: ${score}</p>
                <div class="victory-buttons">
                    ${onNext ? '<button id="nextLevelBtn">下一關</button>' : ''}
                    ${onReplay ? '<button id="replayBtn">重新開始</button>' : ''}
                </div>
            </div>
        `;
        
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        document.body.appendChild(overlay);
    }

    // ==================== 數學工具 ====================
    
    /**
     * 檢測矩形碰撞
     */
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    /**
     * 檢測圓形碰撞
     */
    checkCircleCollision(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circle1.radius + circle2.radius;
    }
    
    /**
     * 限制數值範圍
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
    
    /**
     * 線性插值
     */
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    /**
     * 隨機整數
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /**
     * 隨機浮點數
     */
    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    /**
     * 隨機選擇陣列元素
     */
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // ==================== 時間工具 ====================
    
    /**
     * 格式化時間 (秒 -> MM:SS)
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    /**
     * 倒數計時器
     */
    countdown(seconds, callback, onComplete) {
        let remaining = seconds;
        const interval = setInterval(() => {
            remaining--;
            callback(remaining);
            if (remaining <= 0) {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, 1000);
        return interval; // 返回interval ID以便取消
    }

    // ==================== 難度系統 ====================
    
    /**
     * 獲取難度設定
     */
    getDifficultySettings() {
        return {
            easy: { speedMultiplier: 0.7, obstacleFrequency: 0.6 },
            normal: { speedMultiplier: 1.0, obstacleFrequency: 1.0 },
            hard: { speedMultiplier: 1.3, obstacleFrequency: 1.4 }
        };
    }
    
    /**
     * 根據等級調整速度
     */
    calculateSpeed(baseSpeed, level, multiplier = 0.1) {
        return baseSpeed * (1 + (level - 1) * multiplier);
    }
}

// ==================== 音效系統 ====================

class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.muted = false;
        this.volume = 0.7;
        this.initialized = false;
    }
    
    /**
     * 初始化音效系統
     */
    init() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            this.createSounds();
        } catch (error) {
            console.warn('Web Audio API 不可用:', error);
        }
    }
    
    /**
     * 建立內建音效
     */
    createSounds() {
        // 內建8-bit風格音效
        this.sounds = {
            // 短嗶聲 (按鈕點擊)
            click: { frequency: 800, duration: 0.1, type: 'square' },
            // 得分音效
            score: { frequency: 600, duration: 0.15, type: 'square', pattern: [0, 100, 200] },
            // 跳躍音效
            jump: { frequency: 400, duration: 0.1, type: 'square', slide: [400, 600] },
            // 撞牆音效
            hit: { frequency: 200, duration: 0.1, type: 'sawtooth' },
            // 遊戲結束
            gameover: { frequency: 150, duration: 0.5, type: 'sawtooth', slide: [150, 50] },
            // 勝利
            victory: { frequency: 523, duration: 0.2, type: 'square', pattern: [0, 100, 200, 300, 400, 500] },
            // 消除
            clear: { frequency: 800, duration: 0.1, type: 'sine', pattern: [0, 50, 100] },
            // 警告
            warning: { frequency: 440, duration: 0.3, type: 'square', pattern: [0, 150] }
        };
    }
    
    /**
     * 播放音效
     */
    play(soundName) {
        if (this.muted || !this.initialized) return;
        
        const sound = this.sounds[soundName];
        if (!sound) {
            console.warn(`音效 ${soundName} 不存在`);
            return;
        }
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = sound.type || 'sine';
            oscillator.frequency.setValueAtTime(sound.frequency, this.audioContext.currentTime);
            
            // 處理音高滑動
            if (sound.slide) {
                oscillator.frequency.setValueAtTime(sound.slide[0], this.audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(sound.slide[1], this.audioContext.currentTime + sound.duration);
            }
            
            // 音量包絡
            gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + sound.duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + sound.duration);
            
        } catch (error) {
            console.warn('播放音效失敗:', error);
        }
    }
    
    /**
     * 播放自定義音調
     */
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (this.muted || !this.initialized) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(volume * this.volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
            
        } catch (error) {
            console.warn('播放音調失敗:', error);
        }
    }
    
    /**
     * 靜音/取消靜音
     */
    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }
    
    /**
     * 設定音量
     */
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
    }
}

// 導出模組
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameEngine, AudioSystem };
}
