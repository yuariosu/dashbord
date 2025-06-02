class SpaceGradius {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // ゲーム状態
        this.gameState = 'start'; // start, playing, paused, gameOver
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.keys = {};
        this.difficulty = 'normal';
        
        // プレイヤー
        this.player = {
            x: 50,
            y: this.canvas.height / 2,
            width: 35,
            height: 25,
            speed: 4,
            health: 100,
            maxHealth: 100,
            weapon: 'normal'
        };
        
        // ゲーム要素
        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.powerUps = [];
        this.particles = [];
        this.stars = [];
        
        // タイミング制御
        this.lastShot = 0;
        this.shotCooldown = 200; // 射撃頻度を下げる
        this.lastEnemySpawn = 0;
        this.enemySpawnRate = 800; // 敵の出現頻度を上げる
        this.lastEnemyShot = 0;
        this.enemyShotRate = 1500;
        
        // 難易度設定
        this.difficultySettings = {
            easy: { shotCooldown: 150, enemySpawnRate: 1200, enemyShotRate: 2000, enemySpeed: 1.5 },
            normal: { shotCooldown: 200, enemySpawnRate: 800, enemyShotRate: 1500, enemySpeed: 2 },
            hard: { shotCooldown: 250, enemySpawnRate: 600, enemyShotRate: 1000, enemySpeed: 2.5 },
            extreme: { shotCooldown: 300, enemySpawnRate: 400, enemyShotRate: 800, enemySpeed: 3 }
        };
        
        this.initStars();
        this.bindEvents();
        this.gameLoop();
    }
    
    initStars() {
        for (let i = 0; i < 150; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 3 + 1,
                brightness: Math.random()
            });
        }
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'KeyP' && this.gameState === 'playing') {
                this.gameState = 'paused';
            } else if (e.code === 'KeyP' && this.gameState === 'paused') {
                this.gameState = 'playing';
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // スタートボタン
        document.getElementById('startBtn').addEventListener('click', () => {
            this.difficulty = document.getElementById('difficultySelect').value;
            this.applyDifficulty();
            this.startGame();
        });
        
        // リスタートボタン
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartGame();
        });
        
        // メインメニューボタン
        document.getElementById('mainMenuBtn').addEventListener('click', () => {
            this.showMainMenu();
        });
    }
    
    applyDifficulty() {
        const settings = this.difficultySettings[this.difficulty];
        this.shotCooldown = settings.shotCooldown;
        this.enemySpawnRate = settings.enemySpawnRate;
        this.enemyShotRate = settings.enemyShotRate;
        this.enemySpeed = settings.enemySpeed;
    }
    
    startGame() {
        this.gameState = 'playing';
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameScreen').classList.remove('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
    }
    
    restartGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.player.x = 50;
        this.player.y = this.canvas.height / 2;
        this.player.health = this.player.maxHealth;
        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.powerUps = [];
        this.particles = [];
        this.updateUI();
        this.startGame();
    }
    
    showMainMenu() {
        this.gameState = 'start';
        document.getElementById('startScreen').classList.remove('hidden');
        document.getElementById('gameScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
    }
    
    handleInput() {
        if (this.gameState !== 'playing') return;
        
        // プレイヤー移動（画面の1/3まで）
        if (this.keys['ArrowUp'] && this.player.y > 0) {
            this.player.y -= this.player.speed;
        }
        if (this.keys['ArrowDown'] && this.player.y < this.canvas.height - this.player.height) {
            this.player.y += this.player.speed;
        }
        if (this.keys['ArrowLeft'] && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowRight'] && this.player.x < this.canvas.width / 3) {
            this.player.x += this.player.speed;
        }
        
        // 射撃（頻度を制限）
        if (this.keys['Space'] && Date.now() - this.lastShot > this.shotCooldown) {
            this.shoot();
            this.lastShot = Date.now();
        }
    }
    
    shoot() {
        if (this.player.weapon === 'normal') {
            this.bullets.push({
                x: this.player.x + this.player.width,
                y: this.player.y + this.player.height / 2,
                width: 12,
                height: 3,
                speed: 7,
                damage: 1,
                color: '#ffff00'
            });
        }
    }
    
    spawnEnemy() {
        if (Date.now() - this.lastEnemySpawn > this.enemySpawnRate) {
            const enemyTypes = [
                { width: 25, height: 20, hp: 1, color: '#ff0066', points: 100 },
                { width: 35, height: 30, hp: 2, color: '#ff6600', points: 200 },
                { width: 45, height: 35, hp: 3, color: '#ff0000', points: 300 }
            ];
            
            const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            
            this.enemies.push({
                x: this.canvas.width,
                y: Math.random() * (this.canvas.height - type.height),
                width: type.width,
                height: type.height,
                speed: this.enemySpeed + Math.random(),
                hp: type.hp,
                maxHp: type.hp,
                color: type.color,
                points: type.points,
                lastShot: 0,
                shootRate: 2000 + Math.random() * 1000
            });
            
            this.lastEnemySpawn = Date.now();
        }
    }
    
    updateEnemies() {
        this.enemies = this.enemies.filter(enemy => {
            enemy.x -= enemy.speed;
            
            // 敵の射撃
            if (Date.now() - enemy.lastShot > enemy.shootRate && Math.random() < 0.01) {
                this.enemyBullets.push({
                    x: enemy.x,
                    y: enemy.y + enemy.height / 2,
                    width: 8,
                    height: 3,
                    speed: 4,
                    color: '#ff0066'
                });
                enemy.lastShot = Date.now();
            }
            
            return enemy.x > -enemy.width && enemy.hp > 0;
        });
    }
    
    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.x += bullet.speed;
            return bullet.x < this.canvas.width;
        });
        
        this.enemyBullets = this.enemyBullets.filter(bullet => {
            bullet.x -= bullet.speed;
            return bullet.x > -bullet.width;
        });
    }
    
    updateStars() {
        this.stars.forEach(star => {
            star.x -= star.speed;
            if (star.x < 0) {
                star.x = this.canvas.width;
                star.y = Math.random() * this.canvas.height;
            }
            star.brightness = Math.sin(Date.now() * 0.001 + star.y) * 0.5 + 0.5;
        });
    }
    
    checkCollisions() {
        // プレイヤーの弾と敵
        this.bullets.forEach((bullet, bulletIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (this.isColliding(bullet, enemy)) {
                    this.createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#ffff00');
                    enemy.hp -= bullet.damage;
                    this.bullets.splice(bulletIndex, 1);
                    
                    if (enemy.hp <= 0) {
                        this.createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#ff6600');
                        this.enemies.splice(enemyIndex, 1);
                        this.score += enemy.points;
                        this.updateUI();
                    }
                }
            });
        });
        
        // 敵の弾とプレイヤー
        this.enemyBullets.forEach((bullet, bulletIndex) => {
            if (this.isColliding(bullet, this.player)) {
                this.createExplosion(this.player.x + this.player.width/2, this.player.y + this.player.height/2, '#ff0000');
                this.enemyBullets.splice(bulletIndex, 1);
                this.player.health -= 20;
                this.updateUI();
                
                if (this.player.health <= 0) {
                    this.playerDeath();
                }
            }
        });
        
        // プレイヤーと敵の直接衝突
        this.enemies.forEach((enemy, enemyIndex) => {
            if (this.isColliding(this.player, enemy)) {
                this.createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#ff0000');
                this.enemies.splice(enemyIndex, 1);
                this.player.health -= 30;
                this.updateUI();
                
                if (this.player.health <= 0) {
                    this.playerDeath();
                }
            }
        });
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    playerDeath() {
        this.lives--;
        this.player.health = this.player.maxHealth;
        this.player.x = 50;
        this.player.y = this.canvas.height / 2;
        
        if (this.lives <= 0) {
            this.gameOver();
        }
        
        this.updateUI();
    }
    
    createExplosion(x, y, baseColor) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 40,
                maxLife: 40,
                color: baseColor,
                size: Math.random() * 4 + 2
            });
        }
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            return particle.life > 0;
        });
    }
    
    draw() {
        // 背景をクリア
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 星を描画
        this.stars.forEach(star => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
        
        if (this.gameState === 'playing') {
            // プレイヤーを描画
            this.ctx.fillStyle = '#00ffff';
            this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
            
            // 弾を描画
            this.bullets.forEach(bullet => {
                this.ctx.fillStyle = bullet.color;
                this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            });
            
            this.enemyBullets.forEach(bullet => {
                this.ctx.fillStyle = bullet.color;
                this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            });
            
            // 敵を描画
            this.enemies.forEach(enemy => {
                this.ctx.fillStyle = enemy.color;
                this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                
                // 敵のHPバー
                if (enemy.hp < enemy.maxHp) {
                    this.ctx.fillStyle = '#ff0000';
                    this.ctx.fillRect(enemy.x, enemy.y - 8, enemy.width, 4);
                    this.ctx.fillStyle = '#00ff00';
                    this.ctx.fillRect(enemy.x, enemy.y - 8, (enemy.width * enemy.hp / enemy.maxHp), 4);
                }
            });
            
            // パーティクルを描画
            this.particles.forEach(particle => {
                this.ctx.globalAlpha = particle.life / particle.maxLife;
                this.ctx.fillStyle = particle.color;
                this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
                this.ctx.globalAlpha = 1;
            });
        } else if (this.gameState === 'paused') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ffff00';
            this.ctx.font = '48px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '24px Courier New';
            this.ctx.fillText('Pキーで再開', this.canvas.width / 2, this.canvas.height / 2 + 50);
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
        document.getElementById('weapon').textContent = this.player.weapon === 'normal' ? '通常弾' : this.player.weapon;
        
        // ヘルスバー更新
        const healthPercentage = (this.player.health / this.player.maxHealth) * 100;
        document.getElementById('healthBar').style.width = healthPercentage + '%';
        
        // レベルアップチェック
        const newLevel = Math.floor(this.score / 2000) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.enemySpawnRate = Math.max(200, this.enemySpawnRate - 100);
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalLevel').textContent = this.level;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
    
    gameLoop() {
        this.handleInput();
        
        if (this.gameState === 'playing') {
            this.spawnEnemy();
            this.updateBullets();
            this.updateEnemies();
            this.updateParticles();
            this.checkCollisions();
        }
        
        this.updateStars();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// ゲーム開始
window.addEventListener('load', () => {
    new SpaceGradius();
});
