const canvas = document.getElementById('cosmicCanvas');
const ctx = canvas.getContext('2d');

const speechBubble = document.getElementById('speechBubble');
const moodDisplay = document.getElementById('moodDisplay');
const costumeDisplay = document.getElementById('costumeDisplay');
const soundToggle = document.getElementById('soundToggle');
const partyBtn = document.getElementById('partyBtn');

let width = window.innerWidth;
let height = window.innerHeight;
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const SoundFX = {
    ctx: null,
    enabled: true,
    partyInterval: null,
    beatStep: 0,

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    playBoing(pitchMultiplier = 1, volume = 0.2) {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const baseFreq = 230 * pitchMultiplier;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.15, now + 0.11);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.82, now + 0.24);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.38, now + 0.36);

        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.41);
    },

    playPurr() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.linearRampToValueAtTime(480, now + 0.14);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);
    },

    playPop() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(980, now + 0.08);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    },

    playEat() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);
            gain.gain.setValueAtTime(0.15, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.19);
        });
    },

    playMagic() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const freqs = [587.33, 739.99, 880, 1174.66, 1479.98];
        freqs.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + i * 0.045);
            gain.gain.setValueAtTime(0.12, now + i * 0.045);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.045);
            osc.stop(now + i * 0.045 + 0.26);
        });
    },

    startPartyMusic() {
        this.init();
        this.stopPartyMusic();
        this.beatStep = 0;
        const melody = [
            523.25, 659.25, 783.99, 659.25,
            880.00, 783.99, 659.25, 587.33,
            523.25, 587.33, 659.25, 783.99,
            1046.50, 783.99, 659.25, 523.25
        ];
        const bass = [130.81, 130.81, 164.81, 164.81, 174.61, 174.61, 196.00, 196.00];

        this.partyInterval = setInterval(() => {
            if (!this.enabled) return;
            const now = this.ctx.currentTime;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            const note = melody[this.beatStep % melody.length];
            osc.frequency.setValueAtTime(note, now);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.17);

            if (this.beatStep % 2 === 0) {
                const bOsc = this.ctx.createOscillator();
                const bGain = this.ctx.createGain();
                bOsc.type = 'sine';
                const bNote = bass[(this.beatStep / 2) % bass.length];
                bOsc.frequency.setValueAtTime(bNote, now);
                bOsc.frequency.exponentialRampToValueAtTime(bNote * 0.5, now + 0.18);
                bGain.gain.setValueAtTime(0.2, now);
                bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                bOsc.connect(bGain);
                bGain.connect(this.ctx.destination);
                bOsc.start(now);
                bOsc.stop(now + 0.21);

                padangCreature.danceBounce(this.beatStep % 4 === 0 ? 1 : -1);
            }

            this.beatStep++;
        }, 190);
    },

    stopPartyMusic() {
        if (this.partyInterval) {
            clearInterval(this.partyInterval);
            this.partyInterval = null;
        }
    }
};

soundToggle.addEventListener('click', () => {
    SoundFX.enabled = !SoundFX.enabled;
    soundToggle.textContent = SoundFX.enabled ? '🔊 Suara: ON' : '🔇 Suara: OFF';
    if (SoundFX.enabled) SoundFX.playPop();
});

const NASI_PADANG_THEMES = [
    { name: 'Rendang Daging Spesial', core: '#ffeaa7', mid: '#8d4925', deep: '#4e230e', glow: 'rgba(255, 193, 7, 0.72)', cheek: '#ff6b6b' },
    { name: 'Ayam Pop & Sambal Merah', core: '#fff5e4', mid: '#e17055', deep: '#8c2d19', glow: 'rgba(255, 118, 117, 0.72)', cheek: '#ff4757' },
    { name: 'Gulai Tunjang & Daun Singkong', core: '#ffeaa7', mid: '#27ae60', deep: '#145a32', glow: 'rgba(46, 204, 113, 0.72)', cheek: '#ff7eb9' },
    { name: 'Dendeng Balado Pedas', core: '#ffd8a8', mid: '#d63031', deep: '#6c1313', glow: 'rgba(255, 107, 107, 0.72)', cheek: '#ff5252' },
    { name: 'Gulai Kuning Padang', core: '#fff3bf', mid: '#f39c12', deep: '#9c640c', glow: 'rgba(254, 255, 156, 0.72)', cheek: '#ff6b81' }
];

const COSTUMES = [
    { id: 'none', label: 'Piring Polos Gemoy', icon: '🍛' },
    { id: 'witch', label: 'Topi Koki Penyihir', icon: '🧙‍♀️' },
    { id: 'cat', label: 'Telinga Kucing', icon: '🐱' },
    { id: 'crown', label: 'Mahkota Raja Padang', icon: '👑' },
    { id: 'shades', label: 'Kacamata Keren', icon: '😎' }
];

const STATE = {
    pointer: { x: width / 2, y: height / 2, prevX: width / 2, prevY: height / 2, vx: 0, vy: 0, isDown: false },
    partyMode: false,
    partyHue: 0,
    themeIndex: 0,
    costumeIndex: 0,
    speechTimer: null,
    auraTimer: 0,
    auraColor: '#feff9c'
};

function showSpeech(text, duration = 2200) {
    speechBubble.textContent = text;
    speechBubble.classList.add('show');
    if (STATE.speechTimer) clearTimeout(STATE.speechTimer);
    STATE.speechTimer = setTimeout(() => {
        speechBubble.classList.remove('show');
    }, duration);
}

const padangCreature = {
    numNodes: 28,
    nodes: [],
    centerX: width / 2,
    centerY: height * 0.56,
    vx: 0,
    vy: 0,
    baseRadius: Math.min(width, height) * 0.165,
    floorY: height * 0.78,

    grabbedNodeIndex: -1,
    grabOffsetX: 0,
    grabOffsetY: 0,
    pettingAccum: 0,
    petSoundCooldown: 0,

    expression: 'happy',
    expressionTimer: 0,
    chewTimer: 0,
    blinkTimer: 0,
    isBlinking: false,
    doubleBlinkPending: false,
    idleTimer: 0,

    faceX: width / 2,
    faceY: height * 0.56,
    faceVx: 0,
    faceVy: 0,
    faceAngle: 0,
    eyeLookX: 0,
    eyeLookY: 0,

    leftHand: { x: width / 2 - 90, y: height * 0.58, vx: 0, vy: 0 },
    rightHand: { x: width / 2 + 90, y: height * 0.58, vx: 0, vy: 0 },
    sproutTip: { x: width / 2, y: height * 0.35, vx: 0, vy: 0 },

    init() {
        this.centerX = width / 2;
        this.centerY = height * 0.56;
        this.baseRadius = Math.max(76, Math.min(width, height) * 0.165);
        this.floorY = Math.min(height * 0.80, height - 115);
        this.nodes = [];

        for (let i = 0; i < this.numNodes; i++) {
            const angle = (i / this.numNodes) * Math.PI * 2 - Math.PI / 2;
            const rest = this.getRestOffset(angle, 0);
            this.nodes.push({
                x: this.centerX + rest.rx,
                y: this.centerY + rest.ry,
                vx: 0,
                vy: 0,
                baseAngle: angle
            });
        }

        this.faceX = this.centerX;
        this.faceY = this.centerY;
        this.leftHand.x = this.centerX - this.baseRadius * 1.25;
        this.leftHand.y = this.centerY + 8;
        this.rightHand.x = this.centerX + this.baseRadius * 1.25;
        this.rightHand.y = this.centerY + 8;
        this.sproutTip.x = this.centerX;
        this.sproutTip.y = this.centerY - this.baseRadius * 1.05;
    },

    getRestOffset(angle, breathPhase) {
        const sinA = Math.sin(angle);
        const cosA = Math.cos(angle);
        const breathX = 1 + Math.sin(breathPhase) * 0.032;
        const breathY = 1 - Math.sin(breathPhase) * 0.032;

        const bottomSquash = sinA > 0 ? 1 - sinA * 0.14 : 1 + Math.abs(sinA) * 0.06;
        const widthSpread = sinA > 0 ? 1.32 + sinA * 0.08 : 1.24;

        const rx = cosA * this.baseRadius * widthSpread * breathX;
        const ry = sinA * this.baseRadius * 0.78 * bottomSquash * breathY;
        return { rx, ry };
    },

    update(dt) {
        const now = performance.now();
        this.baseRadius = Math.max(76, Math.min(width, height) * 0.165);
        this.floorY = Math.min(height * 0.80, height - 115);

        let sumX = 0, sumY = 0, sumVx = 0, sumVy = 0;
        for (let i = 0; i < this.numNodes; i++) {
            sumX += this.nodes[i].x;
            sumY += this.nodes[i].y;
            sumVx += this.nodes[i].vx;
            sumVy += this.nodes[i].vy;
        }
        this.centerX = sumX / this.numNodes;
        this.centerY = sumY / this.numNodes;
        this.vx = sumVx / this.numNodes;
        this.vy = sumVy / this.numNodes;

        let currentArea = 0;
        for (let i = 0; i < this.numNodes; i++) {
            const curr = this.nodes[i];
            const next = this.nodes[(i + 1) % this.numNodes];
            currentArea += (curr.x * next.y - next.x * curr.y);
        }
        currentArea = Math.abs(currentArea) * 0.5;
        const targetArea = Math.PI * this.baseRadius * this.baseRadius * 1.22;
        const areaRatio = Math.max(0.5, Math.min(1.8, targetArea / Math.max(100, currentArea)));
        const pressureForce = (areaRatio - 1) * 420;

        const homeX = width / 2;
        const homeY = this.floorY - this.baseRadius * 0.65;

        let targetLookX = STATE.pointer.x;
        let targetLookY = STATE.pointer.y;
        if (flyingFoods.length > 0) {
            targetLookX = flyingFoods[0].x;
            targetLookY = flyingFoods[0].y;
        }
        const lookDirX = Math.max(-1, Math.min(1, (targetLookX - this.centerX) / (width * 0.4)));
        const swayX = Math.sin(now * 0.0028) * 16 + lookDirX * 18;

        const subSteps = 4;
        const subDt = dt / subSteps;

        for (let step = 0; step < subSteps; step++) {
            for (let i = 0; i < this.numNodes; i++) {
                const n1 = this.nodes[i];
                const n2 = this.nodes[(i + 1) % this.numNodes];
                const n3 = this.nodes[(i + 2) % this.numNodes];

                const rest1 = (2 * Math.PI * this.baseRadius) / this.numNodes;
                this.applySpring(n1, n2, rest1, 210, subDt);

                const rest2 = rest1 * 1.96;
                this.applySpring(n1, n3, rest2, 110, subDt);
            }

            const breathPhase = now * 0.0032;
            for (let i = 0; i < this.numNodes; i++) {
                const node = this.nodes[i];

                if (this.grabbedNodeIndex === i && STATE.pointer.isDown) {
                    const targetGx = STATE.pointer.x + this.grabOffsetX;
                    const targetGy = STATE.pointer.y + this.grabOffsetY;
                    node.vx = (targetGx - node.x) * 26;
                    node.vy = (targetGy - node.y) * 26;
                    node.x += node.vx * subDt;
                    node.y += node.vy * subDt;
                    continue;
                }

                const rest = this.getRestOffset(node.baseAngle, breathPhase);
                const tilt = lookDirX * 0.09 + Math.sin(now * 0.002) * 0.03;
                const cosT = Math.cos(tilt);
                const sinT = Math.sin(tilt);
                const rotRx = rest.rx * cosT - rest.ry * sinT;
                const rotRy = rest.rx * sinT + rest.ry * cosT;

                const idealX = this.centerX + rotRx;
                const idealY = this.centerY + rotRy;

                node.vx += (idealX - node.x) * 48 * subDt;
                node.vy += (idealY - node.y) * 48 * subDt;

                const dxC = node.x - this.centerX;
                const dyC = node.y - this.centerY;
                const distC = Math.hypot(dxC, dyC) || 1;
                node.vx += (dxC / distC) * pressureForce * subDt;
                node.vy += (dyC / distC) * pressureForce * subDt;

                if (this.grabbedNodeIndex === -1) {
                    node.vx += (homeX + swayX - this.centerX) * 16 * subDt;
                    if (this.centerY < homeY - 12) {
                        node.vy += 420 * subDt;
                    } else {
                        node.vy += (homeY - this.centerY) * 28 * subDt;
                    }
                }

                const damping = Math.exp(-5.4 * subDt);
                node.vx *= damping;
                node.vy *= damping;

                node.x += node.vx * subDt;
                node.y += node.vy * subDt;

                if (node.y > this.floorY) {
                    const impactVel = node.vy;
                    node.y = this.floorY;
                    node.vy = -impactVel * 0.35;
                    node.vx *= 0.82;
                    if (impactVel > 240 && step === 0) {
                        SoundFX.playBoing(0.85, 0.12);
                    }
                }

                const margin = 24;
                if (node.x < margin) {
                    node.x = margin;
                    node.vx = Math.abs(node.vx) * 0.65;
                } else if (node.x > width - margin) {
                    node.x = width - margin;
                    node.vx = -Math.abs(node.vx) * 0.65;
                }
                if (node.y < 75) {
                    node.y = 75;
                    node.vy = Math.abs(node.vy) * 0.6;
                }
            }
        }

        const dxLook = targetLookX - this.centerX;
        const dyLook = targetLookY - this.centerY;
        const distLook = Math.hypot(dxLook, dyLook) || 1;
        const maxFaceShift = this.baseRadius * 0.16;
        const parallaxX = (dxLook / distLook) * Math.min(distLook * 0.06, maxFaceShift);
        const parallaxY = (dyLook / distLook) * Math.min(distLook * 0.05, maxFaceShift * 0.8);

        const targetFaceX = this.centerX + parallaxX;
        const targetFaceY = this.centerY + parallaxY - this.baseRadius * 0.03;

        this.faceVx = (this.faceVx + (targetFaceX - this.faceX) * 140 * dt) * Math.exp(-12 * dt);
        this.faceVy = (this.faceVy + (targetFaceY - this.faceY) * 140 * dt) * Math.exp(-12 * dt);
        this.faceX += this.faceVx * dt;
        this.faceY += this.faceVy * dt;

        const topNode = this.nodes[0];
        const bottomNode = this.nodes[Math.floor(this.numNodes / 2)];
        const bodyLeanAngle = Math.atan2(topNode.x - bottomNode.x, bottomNode.y - topNode.y);
        this.faceAngle += (bodyLeanAngle * 0.75 - this.faceAngle) * 0.18;

        const maxEyeLook = this.baseRadius * 0.075;
        const targetEyeX = (dxLook / distLook) * Math.min(distLook * 0.035, maxEyeLook);
        const targetEyeY = (dyLook / distLook) * Math.min(distLook * 0.035, maxEyeLook);
        this.eyeLookX += (targetEyeX - this.eyeLookX) * 0.22;
        this.eyeLookY += (targetEyeY - this.eyeLookY) * 0.22;

        this.updateSecondaryLimbs(dt, now);

        this.blinkTimer += dt;
        if (!this.isBlinking && this.blinkTimer > (this.doubleBlinkPending ? 0.18 : 2.8 + Math.random() * 2.4)) {
            this.isBlinking = true;
            this.blinkTimer = 0;
            if (!this.doubleBlinkPending && Math.random() < 0.28) {
                this.doubleBlinkPending = true;
            } else {
                this.doubleBlinkPending = false;
            }
        } else if (this.isBlinking && this.blinkTimer > 0.12) {
            this.isBlinking = false;
            this.blinkTimer = 0;
        }

        if (this.chewTimer > 0) this.chewTimer -= dt;
        if (this.petSoundCooldown > 0) this.petSoundCooldown -= dt;

        if (this.expressionTimer > 0) {
            this.expressionTimer -= dt;
            if (this.expressionTimer <= 0 && this.grabbedNodeIndex === -1) {
                this.expression = STATE.partyMode ? 'party' : 'happy';
                this.updateMoodText();
            }
        } else if (this.grabbedNodeIndex === -1) {
            this.idleTimer += dt;
            if (this.idleTimer > 12 && !STATE.partyMode && this.expression !== 'sleepy') {
                this.expression = 'sleepy';
                this.updateMoodText();
                showSpeech('Huaaah~ Zzz... usap puncak Nasi Padangku dong 😴');
            }
        }

        if (STATE.auraTimer > 0) STATE.auraTimer -= dt;
    },

    applySpring(n1, n2, restLength, stiffness, dt) {
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const diff = (dist - restLength) / dist;
        const fx = dx * diff * stiffness * dt;
        const fy = dy * diff * stiffness * dt;

        n1.vx += fx;
        n1.vy += fy;
        n2.vx -= fx;
        n2.vy -= fy;
    },

    updateSecondaryLimbs(dt, now) {
        const leftAnchor = this.nodes[20];
        const rightAnchor = this.nodes[8];
        const topAnchor = this.nodes[0];

        let waveL = Math.sin(now * 0.005) * 10;
        let waveR = Math.cos(now * 0.005) * 10;
        let liftY = 6;

        if (STATE.partyMode || this.expression === 'love' || flyingFoods.length > 0) {
            waveL = Math.sin(now * 0.014) * 22;
            waveR = -Math.sin(now * 0.014) * 22;
            liftY = -24;
        } else if (this.expression === 'surprised' || this.grabbedNodeIndex !== -1) {
            liftY = -18;
        }

        const targetLX = leftAnchor.x - this.baseRadius * 0.22;
        const targetLY = leftAnchor.y + liftY + waveL;
        const targetRX = rightAnchor.x + this.baseRadius * 0.22;
        const targetRY = rightAnchor.y + liftY + waveR;

        this.leftHand.vx = (this.leftHand.vx + (targetLX - this.leftHand.x) * 130 * dt) * Math.exp(-10 * dt);
        this.leftHand.vy = (this.leftHand.vy + (targetLY - this.leftHand.y) * 130 * dt) * Math.exp(-10 * dt);
        this.leftHand.x += this.leftHand.vx * dt;
        this.leftHand.y += this.leftHand.vy * dt;

        this.rightHand.vx = (this.rightHand.vx + (targetRX - this.rightHand.x) * 130 * dt) * Math.exp(-10 * dt);
        this.rightHand.vy = (this.rightHand.vy + (targetRY - this.rightHand.y) * 130 * dt) * Math.exp(-10 * dt);
        this.rightHand.x += this.rightHand.vx * dt;
        this.rightHand.y += this.rightHand.vy * dt;

        const sproutSway = Math.sin(now * 0.004) * 12;
        const targetSX = topAnchor.x + sproutSway;
        const targetSY = topAnchor.y - this.baseRadius * 0.24;

        this.sproutTip.vx = (this.sproutTip.vx + (targetSX - this.sproutTip.x) * 110 * dt) * Math.exp(-8 * dt);
        this.sproutTip.vy = (this.sproutTip.vy + (targetSY - this.sproutTip.y) * 110 * dt) * Math.exp(-8 * dt);
        this.sproutTip.x += this.sproutTip.vx * dt;
        this.sproutTip.y += this.sproutTip.vy * dt;
    },

    tryGrab(x, y) {
        let bestIdx = -1;
        let bestDist = this.baseRadius * 1.45;

        for (let i = 0; i < this.numNodes; i++) {
            const d = Math.hypot(x - this.nodes[i].x, y - this.nodes[i].y);
            if (d < bestDist) {
                bestDist = d;
                bestIdx = i;
            }
        }

        const distCenter = Math.hypot((x - this.centerX) / 1.32, (y - this.centerY) / 0.85);
        if (bestIdx !== -1 || distCenter <= this.baseRadius * 1.15) {
            if (bestIdx === -1) bestIdx = 0;
            this.grabbedNodeIndex = bestIdx;
            this.grabOffsetX = this.nodes[bestIdx].x - x;
            this.grabOffsetY = this.nodes[bestIdx].y - y;
            this.idleTimer = 0;
            this.pettingAccum = 0;

            this.applyRadialImpulse(x, y, 220);
            this.expression = 'surprised';
            this.expressionTimer = 2.0;
            this.updateMoodText();
            SoundFX.playBoing(1.05, 0.16);
            spawnParticleBurst(x, y, 10, 'star');
            return true;
        }
        return false;
    },

    releaseGrab() {
        if (this.grabbedNodeIndex !== -1) {
            const node = this.nodes[this.grabbedNodeIndex];
            const speed = Math.hypot(node.vx, node.vy);

            if (speed > 260) {
                SoundFX.playBoing(0.85 + Math.random() * 0.3, 0.24);
                spawnRipple(this.centerX, this.centerY, NASI_PADANG_THEMES[STATE.themeIndex].core);
                showSpeech('Weeee~ Sepiring Nasi Padang terbang mantap! 🚀🍛');
            } else if (this.pettingAccum > 70) {
                this.expression = 'love';
                this.expressionTimer = 2.5;
                this.updateMoodText();
                showSpeech('Hehe, enaknya diusap-usap sambil ngebul~ 🥰✨');
            } else {
                showSpeech('Goyang-goyang~ Rendangnya empuk kan? 😆');
            }

            this.grabbedNodeIndex = -1;
        }
    },

    handlePetting(x, y, moveDist) {
        const topNode = this.nodes[0];
        const distToHead = Math.hypot(x - topNode.x, y - (topNode.y + this.baseRadius * 0.22));
        if (distToHead < this.baseRadius * 1.05) {
            this.idleTimer = 0;
            this.pettingAccum += moveDist;

            for (let i = 0; i < this.numNodes; i++) {
                const d = Math.hypot(x - this.nodes[i].x, y - this.nodes[i].y);
                if (d < this.baseRadius * 0.7) {
                    this.nodes[i].vy += 12;
                }
            }

            if (this.pettingAccum > 45) {
                this.expression = 'love';
                this.expressionTimer = 1.8;
                this.updateMoodText();
                if (this.petSoundCooldown <= 0) {
                    SoundFX.playPurr();
                    spawnParticleBurst(topNode.x, topNode.y - 12, 3, 'heart');
                    this.petSoundCooldown = 0.35;
                }
            }
        }
    },

    applyRadialImpulse(originX, originY, strength) {
        for (let i = 0; i < this.numNodes; i++) {
            const n = this.nodes[i];
            const dx = n.x - originX;
            const dy = n.y - originY;
            const dist = Math.hypot(dx, dy) || 1;
            if (dist < this.baseRadius * 1.55) {
                const falloff = 1 - dist / (this.baseRadius * 1.55);
                n.vx += (dx / dist) * strength * falloff;
                n.vy += (dy / dist) * strength * falloff;
            }
        }
    },

    jumpForFood(foodX, foodY) {
        this.idleTimer = 0;
        const dx = foodX - this.centerX;
        for (let i = 0; i < this.numNodes; i++) {
            const isTop = Math.sin(this.nodes[i].baseAngle) < 0;
            this.nodes[i].vy -= isTop ? 360 : 240;
            this.nodes[i].vx += dx * 1.4;
        }
        this.expression = 'eating';
        this.expressionTimer = 1.5;
        this.updateMoodText();
    },

    danceBounce(dir) {
        for (let i = 0; i < this.numNodes; i++) {
            const n = this.nodes[i];
            const isTop = Math.sin(n.baseAngle) < 0;
            n.vy -= isTop ? 250 : 140;
            n.vx += (isTop ? dir * 190 : -dir * 70);
        }
        this.expression = 'party';
        if (Math.random() < 0.45) {
            spawnParticleBurst(
                this.centerX + (Math.random() - 0.5) * this.baseRadius * 1.8,
                this.centerY - this.baseRadius * 0.6,
                5,
                'confetti'
            );
        }
    },

    eatFood(foodType) {
        this.idleTimer = 0;
        this.expression = 'love';
        this.expressionTimer = 2.6;
        this.chewTimer = 1.6;

        for (let i = 0; i < this.numNodes; i++) {
            const n = this.nodes[i];
            const dx = n.x - this.centerX;
            const dy = n.y - this.centerY;
            n.vx += dx * 2.4;
            n.vy += dy * 2.4 - 90;
        }

        STATE.themeIndex = (STATE.themeIndex + 1) % NASI_PADANG_THEMES.length;
        STATE.auraTimer = 3.5;

        if (foodType === 'donut') {
            STATE.auraColor = '#ff7eb9';
            showSpeech('Nyam-nyam! Donat Kosmik jadi lauk penutup! 🍩💖');
        } else if (foodType === 'candy') {
            STATE.auraColor = '#feff9c';
            showSpeech('Krenyes! Bintang Permen bikin makin gurih! 🍬⭐');
        } else {
            STATE.auraColor = '#7afcff';
            showSpeech('Slurp! Boba Pelangi segar abis makan Padang! 🧋🌈');
        }

        this.updateMoodText();
        SoundFX.playEat();
        spawnRipple(this.centerX, this.centerY, STATE.auraColor);
        spawnParticleBurst(this.centerX, this.centerY - 20, 28, 'star');
    },

    updateMoodText() {
        const map = {
            happy: '💖 Mood: Gurih & Bahagia',
            surprised: '😲 Mood: Kaget Bergoyang',
            love: '🥰 Mood: Nikmat Banget',
            sleepy: '😴 Mood: Kekenyangan Ngantuk',
            eating: '😋 Mood: Siap Santap!',
            party: '🪩 Mood: Joget Piring Padang!'
        };
        moodDisplay.textContent = map[this.expression] || map.happy;
    },

    traceBodyPath(ctx) {
        ctx.beginPath();
        const n = this.numNodes;
        for (let i = 0; i < n; i++) {
            const curr = this.nodes[i];
            const next = this.nodes[(i + 1) % n];
            const midX = (curr.x + next.x) * 0.5;
            const midY = (curr.y + next.y) * 0.5;
            if (i === 0) {
                const prev = this.nodes[n - 1];
                ctx.moveTo((prev.x + curr.x) * 0.5, (prev.y + curr.y) * 0.5);
            }
            ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
        }
        ctx.closePath();
    },

    draw(ctx) {
        const now = performance.now();
        const theme = STATE.partyMode
            ? {
                core: `hsl(${STATE.partyHue}, 100%, 78%)`,
                mid: `hsl(${(STATE.partyHue + 40) % 360}, 95%, 62%)`,
                deep: `hsl(${(STATE.partyHue + 80) % 360}, 85%, 42%)`,
                glow: `hsla(${STATE.partyHue}, 100%, 70%, 0.75)`,
                cheek: '#ff2a85'
            }
            : NASI_PADANG_THEMES[STATE.themeIndex];

        const bottomNode = this.nodes[Math.floor(this.numNodes / 2)];
        const heightAboveFloor = Math.max(0, this.floorY - bottomNode.y);
        const shadowScale = Math.max(0.45, 1 - heightAboveFloor / 320);

        ctx.save();
        ctx.translate(this.centerX, this.floorY + 6);
        ctx.scale(shadowScale * 1.28, 0.22 * shadowScale);
        const shadowGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, this.baseRadius * 1.25);
        shadowGrad.addColorStop(0, 'rgba(12, 4, 32, 0.65)');
        shadowGrad.addColorStop(1, 'rgba(12, 4, 32, 0)');
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.arc(0, 0, this.baseRadius * 1.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (STATE.auraTimer > 0) {
            const pulse = 1 + Math.sin(now * 0.01) * 0.08;
            ctx.save();
            ctx.globalAlpha = Math.min(1, STATE.auraTimer * 0.4) * 0.55;
            const auraGrad = ctx.createRadialGradient(
                this.centerX, this.centerY, this.baseRadius * 0.5,
                this.centerX, this.centerY, this.baseRadius * 1.85 * pulse
            );
            auraGrad.addColorStop(0, STATE.auraColor);
            auraGrad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = auraGrad;
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, this.baseRadius * 1.85 * pulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        const topNode = this.nodes[0];
        ctx.save();
        ctx.strokeStyle = '#66bb6a';
        ctx.lineWidth = Math.max(6, this.baseRadius * 0.08);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(topNode.x, topNode.y + 4);
        ctx.quadraticCurveTo(
            (topNode.x + this.sproutTip.x) * 0.5,
            topNode.y - this.baseRadius * 0.12,
            this.sproutTip.x,
            this.sproutTip.y
        );
        ctx.stroke();

        ctx.fillStyle = '#a5d6a7';
        ctx.shadowColor = 'rgba(165, 214, 167, 0.7)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(this.sproutTip.x, this.sproutTip.y, this.baseRadius * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        this.drawHands(ctx, theme);

        const currentCostume = COSTUMES[STATE.costumeIndex].id;
        if (currentCostume === 'cat') {
            this.drawCatEars(ctx, theme);
        }

        ctx.save();
        this.traceBodyPath(ctx);

        ctx.shadowColor = theme.glow;
        ctx.shadowBlur = 32;

        const bodyGrad = ctx.createRadialGradient(
            this.faceX - this.baseRadius * 0.25,
            this.faceY - this.baseRadius * 0.35,
            this.baseRadius * 0.1,
            this.centerX,
            this.centerY,
            this.baseRadius * 1.45
        );
        bodyGrad.addColorStop(0, '#fffdf7');
        bodyGrad.addColorStop(0.55, '#f7ebd2');
        bodyGrad.addColorStop(0.85, '#e8cfa6');
        bodyGrad.addColorStop(1, '#c89d66');

        ctx.fillStyle = bodyGrad;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.save();
        ctx.clip();

        ctx.save();
        this.traceBodyPath(ctx);
        ctx.lineWidth = 10;
        ctx.strokeStyle = theme.mid;
        ctx.stroke();
        ctx.restore();

        const riceGrad = ctx.createRadialGradient(
            this.faceX,
            this.faceY - this.baseRadius * 0.2,
            this.baseRadius * 0.08,
            this.centerX,
            this.centerY - this.baseRadius * 0.05,
            this.baseRadius * 0.92
        );
        riceGrad.addColorStop(0, '#ffffff');
        riceGrad.addColorStop(0.75, '#fff9eb');
        riceGrad.addColorStop(1, '#ede0c4');

        ctx.fillStyle = riceGrad;
        ctx.beginPath();
        ctx.ellipse(
            this.centerX + this.faceAngle * 14,
            this.centerY - this.baseRadius * 0.06,
            this.baseRadius * 0.86,
            this.baseRadius * 0.48,
            this.faceAngle * 0.4,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        for (let g = 0; g < 10; g++) {
            const gx = this.centerX + Math.cos(g * 1.3 + now * 0.001) * (this.baseRadius * 0.45);
            const gy = this.centerY - this.baseRadius * 0.14 + Math.sin(g * 1.9) * (this.baseRadius * 0.22);
            ctx.beginPath();
            ctx.ellipse(gx, gy, 4.2, 2.3, (g % 3) * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = theme.mid;
        ctx.strokeStyle = theme.deep;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(
            this.centerX + this.baseRadius * 0.68,
            this.centerY + this.baseRadius * 0.12,
            this.baseRadius * 0.28,
            this.baseRadius * 0.19,
            0.25 + this.faceAngle * 0.5,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#388e3c';
        ctx.strokeStyle = '#1b5e20';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(
            this.centerX - this.baseRadius * 0.68,
            this.centerY + this.baseRadius * 0.14,
            this.baseRadius * 0.28,
            this.baseRadius * 0.18,
            -0.22 + this.faceAngle * 0.5,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#7cb342';
        ctx.beginPath();
        ctx.ellipse(
            this.centerX,
            this.centerY + this.baseRadius * 0.36,
            this.baseRadius * 0.34,
            this.baseRadius * 0.13,
            this.faceAngle * 0.5,
            0,
            Math.PI * 2
        );
        ctx.fill();

        const hlNode = this.nodes[24];
        ctx.save();
        ctx.translate((this.centerX + hlNode.x) * 0.5 - 6, (this.centerY + hlNode.y) * 0.5 - 8);
        ctx.rotate(-0.45 + this.faceAngle);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.baseRadius * 0.22, this.baseRadius * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.restore();

        this.traceBodyPath(ctx);
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ffd54f';
        ctx.stroke();
        ctx.restore();

        this.drawFace(ctx, theme, now);

        if (currentCostume === 'witch') {
            this.drawWitchHat(ctx);
        } else if (currentCostume === 'crown') {
            this.drawCrown(ctx);
        } else if (currentCostume === 'shades') {
            this.drawSunglasses(ctx);
        }
    },

    drawHands(ctx, theme) {
        const leftAnchor = this.nodes[20];
        const rightAnchor = this.nodes[8];
        const handRadius = this.baseRadius * 0.13;

        [
            { anchor: leftAnchor, tip: this.leftHand },
            { anchor: rightAnchor, tip: this.rightHand }
        ].forEach(({ anchor, tip }) => {
            ctx.save();
            ctx.strokeStyle = '#e8cfa6';
            ctx.fillStyle = '#fff9eb';
            ctx.lineWidth = handRadius * 1.5;
            ctx.lineCap = 'round';

            ctx.beginPath();
            ctx.moveTo(anchor.x, anchor.y);
            ctx.lineTo(tip.x, tip.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(tip.x, tip.y, handRadius * 0.85, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    },

    drawFace(ctx, theme, now) {
        ctx.save();
        ctx.translate(this.faceX, this.faceY);
        ctx.rotate(this.faceAngle);

        const eyeSpacing = this.baseRadius * 0.34;
        const eyeY = -this.baseRadius * 0.06;
        const eyeRadius = this.baseRadius * 0.135;
        const chewPuff = this.chewTimer > 0 ? 1 + Math.abs(Math.sin(now * 0.022)) * 0.35 : 1;

        ctx.fillStyle = theme.cheek;
        ctx.globalAlpha = this.chewTimer > 0 ? 0.65 : 0.45;
        ctx.beginPath();
        ctx.ellipse(-eyeSpacing * 1.28, eyeY + eyeRadius * 1.15, eyeRadius * 0.82 * chewPuff, eyeRadius * 0.48 * chewPuff, 0, 0, Math.PI * 2);
        ctx.ellipse(eyeSpacing * 1.28, eyeY + eyeRadius * 1.15, eyeRadius * 0.82 * chewPuff, eyeRadius * 0.48 * chewPuff, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        [-eyeSpacing, eyeSpacing].forEach((ex) => {
            ctx.save();
            ctx.translate(ex, eyeY);

            if (this.expression === 'love') {
                this.drawHeartShape(ctx, 0, 0, eyeRadius * 1.25, '#ff1e7a');
            } else if (this.expression === 'sleepy' || this.isBlinking) {
                ctx.strokeStyle = '#2d144d';
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.arc(0, 0, eyeRadius * 0.75, 0.15 * Math.PI, 0.85 * Math.PI);
                ctx.stroke();
            } else if (this.expression === 'party') {
                ctx.strokeStyle = '#2d144d';
                ctx.lineWidth = 4.2;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                const dir = ex < 0 ? 1 : -1;
                ctx.beginPath();
                ctx.moveTo(-eyeRadius * 0.55 * dir, -eyeRadius * 0.5);
                ctx.lineTo(eyeRadius * 0.45 * dir, 0);
                ctx.lineTo(-eyeRadius * 0.55 * dir, eyeRadius * 0.5);
                ctx.stroke();
            } else {
                ctx.fillStyle = '#24103d';
                ctx.beginPath();
                ctx.arc(this.eyeLookX, this.eyeLookY, eyeRadius, 0, Math.PI * 2);
                ctx.fill();

                const shimmer = Math.sin(now * 0.015) * 0.8;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(
                    this.eyeLookX - eyeRadius * 0.32 + shimmer * 0.4,
                    this.eyeLookY - eyeRadius * 0.32,
                    eyeRadius * 0.38,
                    0,
                    Math.PI * 2
                );
                ctx.fill();

                ctx.beginPath();
                ctx.arc(
                    this.eyeLookX + eyeRadius * 0.3,
                    this.eyeLookY + eyeRadius * 0.28 + shimmer * 0.3,
                    eyeRadius * 0.16,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
            ctx.restore();
        });

        const mouthY = eyeY + eyeRadius * 1.15;
        ctx.strokeStyle = '#2d144d';
        ctx.fillStyle = '#ff5c8a';
        ctx.lineWidth = 3.8;
        ctx.lineCap = 'round';

        if (this.chewTimer > 0) {
            const chewY = Math.sin(now * 0.025) * 3;
            ctx.beginPath();
            ctx.arc(-eyeRadius * 0.3, mouthY + chewY, eyeRadius * 0.3, 0.1 * Math.PI, 0.9 * Math.PI);
            ctx.arc(eyeRadius * 0.3, mouthY + chewY, eyeRadius * 0.3, 0.1 * Math.PI, 0.9 * Math.PI);
            ctx.stroke();
        } else if (this.expression === 'eating' || this.expression === 'surprised') {
            ctx.beginPath();
            const rMouth = this.expression === 'eating' ? eyeRadius * 0.85 : eyeRadius * 0.54;
            ctx.arc(0, mouthY + 3, rMouth, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else if (this.expression === 'sleepy') {
            ctx.beginPath();
            ctx.arc(0, mouthY + 3, eyeRadius * 0.3, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(-eyeRadius * 0.36, mouthY, eyeRadius * 0.34, 0.1 * Math.PI, 0.9 * Math.PI);
            ctx.arc(eyeRadius * 0.36, mouthY, eyeRadius * 0.34, 0.1 * Math.PI, 0.9 * Math.PI);
            ctx.stroke();
        }

        ctx.restore();
    },

    drawHeartShape(ctx, x, y, size, color) {
        ctx.save();
        ctx.translate(x, y - size * 0.25);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, size * 0.3);
        ctx.bezierCurveTo(0, 0, -size, 0, -size, size * 0.55);
        ctx.bezierCurveTo(-size, size * 1.05, 0, size * 1.35, 0, size * 1.55);
        ctx.bezierCurveTo(0, size * 1.35, size, size * 1.05, size, size * 0.55);
        ctx.bezierCurveTo(size, 0, 0, 0, 0, size * 0.3);
        ctx.fill();
        ctx.restore();
    },

    drawCatEars(ctx, theme) {
        const r = this.baseRadius;
        const earConfigs = [
            { node: this.nodes[24], side: -1 },
            { node: this.nodes[4], side: 1 }
        ];
        earConfigs.forEach(({ node, side }) => {
            ctx.save();
            ctx.translate(node.x, node.y + 4);
            ctx.rotate(side * 0.42 + this.faceAngle);

            ctx.fillStyle = theme.mid;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-r * 0.24, r * 0.16);
            ctx.quadraticCurveTo(0, -r * 0.4, r * 0.24, r * 0.16);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ffb3d9';
            ctx.beginPath();
            ctx.moveTo(-r * 0.13, r * 0.1);
            ctx.quadraticCurveTo(0, -r * 0.24, r * 0.13, r * 0.1);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        });
    },

    drawWitchHat(ctx) {
        const r = this.baseRadius;
        const topNode = this.nodes[0];
        ctx.save();
        ctx.translate(topNode.x, topNode.y + 2);
        ctx.rotate(-0.08 + this.faceAngle * 1.2);

        ctx.fillStyle = '#3b1d6e';
        ctx.strokeStyle = '#d4a5ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.68, r * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#4c268c';
        ctx.beginPath();
        ctx.moveTo(-r * 0.38, -2);
        ctx.quadraticCurveTo(-r * 0.1, -r * 0.65, r * 0.28, -r * 0.85);
        ctx.quadraticCurveTo(r * 0.18, -r * 0.35, r * 0.38, -2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ff7eb9';
        ctx.fillRect(-r * 0.34, -r * 0.12, r * 0.68, r * 0.1);
        ctx.fillStyle = '#feff9c';
        ctx.beginPath();
        ctx.arc(0, -r * 0.07, r * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    },

    drawCrown(ctx) {
        const r = this.baseRadius;
        const topNode = this.nodes[0];
        ctx.save();
        ctx.translate(topNode.x, topNode.y + 2);
        ctx.rotate(this.faceAngle * 1.2);

        const grad = ctx.createLinearGradient(0, -r * 0.4, 0, 0);
        grad.addColorStop(0, '#fff59d');
        grad.addColorStop(1, '#ffb300');

        ctx.fillStyle = grad;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-r * 0.36, 0);
        ctx.lineTo(-r * 0.42, -r * 0.34);
        ctx.lineTo(-r * 0.18, -r * 0.16);
        ctx.lineTo(0, -r * 0.44);
        ctx.lineTo(r * 0.18, -r * 0.16);
        ctx.lineTo(r * 0.42, -r * 0.34);
        ctx.lineTo(r * 0.36, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ff7eb9';
        ctx.beginPath();
        ctx.arc(0, -r * 0.12, r * 0.055, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    },

    drawSunglasses(ctx) {
        const r = this.baseRadius;
        const eyeSpacing = r * 0.34;
        const eyeY = -r * 0.06;

        ctx.save();
        ctx.translate(this.faceX + this.eyeLookX * 0.4, this.faceY + eyeY + this.eyeLookY * 0.4);
        ctx.rotate(this.faceAngle);

        ctx.strokeStyle = '#1f1035';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-eyeSpacing * 0.3, -r * 0.03);
        ctx.lineTo(eyeSpacing * 0.3, -r * 0.03);
        ctx.stroke();

        [-eyeSpacing, eyeSpacing].forEach((lx) => {
            ctx.fillStyle = '#1a0d2e';
            ctx.strokeStyle = '#7afcff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(lx - r * 0.25, -r * 0.15, r * 0.5, r * 0.28, 12);
            ctx.fill();
            ctx.stroke();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(lx - r * 0.15, -r * 0.08);
            ctx.lineTo(lx - r * 0.02, r * 0.06);
            ctx.stroke();
        });
        ctx.restore();
    }
};

padangCreature.init();

const flyingFoods = [];

function throwFood(type) {
    const startSide = Math.random() < 0.5 ? -40 : width + 40;
    const startY = height * (0.22 + Math.random() * 0.32);

    flyingFoods.push({
        type,
        x: startSide,
        y: startY,
        startX: startSide,
        startY: startY,
        progress: 0,
        rotation: 0,
        jumped: false
    });

    padangCreature.expression = 'eating';
    padangCreature.expressionTimer = 1.4;
    padangCreature.updateMoodText();
    SoundFX.playPop();
}

function updateAndDrawFoods(dt) {
    for (let i = flyingFoods.length - 1; i >= 0; i--) {
        const f = flyingFoods[i];
        f.progress += dt * 1.35;
        f.rotation += dt * 6;

        const t = Math.min(1, f.progress);
        const targetX = padangCreature.faceX;
        const targetY = padangCreature.faceY + 12;

        f.x = f.startX + (targetX - f.startX) * t;
        const arcHeight = -165 * Math.sin(t * Math.PI);
        f.y = f.startY + (targetY - f.startY) * t + arcHeight;

        if (t > 0.45 && !f.jumped) {
            f.jumped = true;
            padangCreature.jumpForFood(f.x, f.y);
        }

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);

        if (f.type === 'donut') {
            ctx.fillStyle = '#f4a261';
            ctx.beginPath();
            ctx.arc(0, 0, 22, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ff7eb9';
            ctx.beginPath();
            ctx.arc(0, 0, 19, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#2d1b5e';
            ctx.beginPath();
            ctx.arc(0, 0, 7, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#feff9c';
            ctx.fillRect(-11, -8, 5, 3);
            ctx.fillStyle = '#7afcff';
            ctx.fillRect(6, -10, 5, 3);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(5, 8, 5, 3);
        } else if (f.type === 'candy') {
            drawStar(ctx, 0, 0, 5, 22, 10, '#feff9c', '#ff9f1c');
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.beginPath();
            ctx.roundRect(-14, -18, 28, 36, 8);
            ctx.fill();

            ctx.fillStyle = '#d4a5ff';
            ctx.beginPath();
            ctx.roundRect(-12, -8, 24, 24, 6);
            ctx.fill();

            ctx.fillStyle = '#7afcff';
            ctx.fillRect(2, -28, 5, 16);

            ctx.fillStyle = '#2b124c';
            [-6, 0, 6].forEach((bx) => {
                ctx.beginPath();
                ctx.arc(bx, 10, 3.2, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        ctx.restore();

        if (f.progress >= 1) {
            padangCreature.eatFood(f.type);
            flyingFoods.splice(i, 1);
        }
    }
}

const bgStars = [];
for (let i = 0; i < 65; i++) {
    bgStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1 + Math.random() * 2.4,
        phase: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 2.5,
        color: ['#ffffff', '#ff7eb9', '#7afcff', '#feff9c'][Math.floor(Math.random() * 4)]
    });
}

const bgClouds = [];
for (let i = 0; i < 5; i++) {
    bgClouds.push({
        x: Math.random() * width,
        y: height * (0.12 + Math.random() * 0.22),
        scale: 0.75 + Math.random() * 0.55,
        speed: 8 + Math.random() * 10,
        phase: Math.random() * Math.PI * 2
    });
}

function drawCuteRumahGadang(ctx, now) {
    const groundY = Math.min(height * 0.80, height - 115);
    const houseCenterX = width * 0.5;
    const houseW = Math.min(width * 0.62, 460);
    const houseH = Math.min(height * 0.24, 155);
    const baseY = groundY + 6;
    const sway = Math.sin(now * 0.002) * 3.5;

    ctx.save();

    ctx.fillStyle = 'rgba(76, 38, 130, 0.55)';
    ctx.beginPath();
    ctx.moveTo(0, groundY + 10);
    ctx.quadraticCurveTo(width * 0.22, groundY - houseH * 0.95, width * 0.52, groundY - houseH * 0.45);
    ctx.quadraticCurveTo(width * 0.8, groundY - houseH * 1.1, width, groundY - houseH * 0.35);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    bgClouds.forEach((c) => {
        c.x += c.speed * 0.016;
        if (c.x > width + 120) c.x = -120;
        const bobY = c.y + Math.sin(now * 0.0015 + c.phase) * 5;

        ctx.save();
        ctx.translate(c.x, bobY);
        ctx.scale(c.scale, c.scale);
        ctx.fillStyle = 'rgba(255, 240, 250, 0.22)';
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.arc(20, -4, 26, 0, Math.PI * 2);
        ctx.arc(44, 2, 20, 0, Math.PI * 2);
        ctx.arc(-20, 4, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    const bodyW = houseW * 0.78;
    const bodyH = houseH * 0.48;
    const bodyLeft = houseCenterX - bodyW * 0.5 + sway * 0.4;
    const bodyTop = baseY - bodyH;

    ctx.fillStyle = '#3c1810';
    const postCount = 6;
    for (let p = 0; p < postCount; p++) {
        const px = bodyLeft + 14 + (p / (postCount - 1)) * (bodyW - 28);
        ctx.fillRect(px - 4, bodyTop + bodyH * 0.55, 8, bodyH * 0.45);
    }

    const wallGrad = ctx.createLinearGradient(0, bodyTop, 0, baseY);
    wallGrad.addColorStop(0, '#8d4324');
    wallGrad.addColorStop(1, '#5b2511');
    ctx.fillStyle = wallGrad;
    ctx.strokeStyle = '#ffd54f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(bodyLeft, bodyTop, bodyW, bodyH * 0.72, 8);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 213, 79, 0.45)';
    ctx.lineWidth = 1.5;
    for (let u = 1; u <= 4; u++) {
        const ux = bodyLeft + (u / 5) * bodyW;
        ctx.beginPath();
        ctx.moveTo(ux, bodyTop + 10);
        ctx.lineTo(ux, bodyTop + bodyH * 0.64);
        ctx.stroke();
    }

    const winGlow = 0.75 + 0.25 * Math.sin(now * 0.004);
    const winCount = 3;
    for (let w = 0; w < winCount; w++) {
        const wx = bodyLeft + bodyW * 0.22 + w * (bodyW * 0.28);
        const wy = bodyTop + bodyH * 0.22;
        const ww = Math.min(34, bodyW * 0.12);
        const wh = Math.min(28, bodyH * 0.34);

        ctx.fillStyle = `rgba(255, 230, 128, ${winGlow})`;
        ctx.strokeStyle = '#ffd54f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(wx - ww * 0.5, wy - wh * 0.5, ww, wh, 5);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#6d2f16';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(wx, wy - wh * 0.5);
        ctx.lineTo(wx, wy + wh * 0.5);
        ctx.stroke();
    }

    const roofBaseY = bodyTop + 6;
    const gonjongTopY = roofBaseY - houseH * 0.72;
    const leftTipX = houseCenterX - houseW * 0.54 + sway;
    const rightTipX = houseCenterX + houseW * 0.54 + sway;
    const midPeakX = houseCenterX + sway * 0.7;

    const roofGrad = ctx.createLinearGradient(0, gonjongTopY, 0, roofBaseY);
    roofGrad.addColorStop(0, '#2a164d');
    roofGrad.addColorStop(0.55, '#4b247a');
    roofGrad.addColorStop(1, '#7c3aed');

    ctx.fillStyle = roofGrad;
    ctx.strokeStyle = '#ffd54f';
    ctx.lineWidth = 2.8;

    ctx.beginPath();
    ctx.moveTo(leftTipX, roofBaseY - 12);
    ctx.quadraticCurveTo(houseCenterX - houseW * 0.34 + sway * 0.8, gonjongTopY + 12, houseCenterX - houseW * 0.24 + sway * 0.8, gonjongTopY + 4);
    ctx.quadraticCurveTo(houseCenterX - houseW * 0.1 + sway * 0.7, roofBaseY - houseH * 0.36, midPeakX, gonjongTopY - 8);
    ctx.quadraticCurveTo(houseCenterX + houseW * 0.12 + sway * 0.7, roofBaseY - houseH * 0.36, houseCenterX + houseW * 0.24 + sway * 0.8, gonjongTopY + 4);
    ctx.quadraticCurveTo(houseCenterX + houseW * 0.34 + sway * 0.8, gonjongTopY + 12, rightTipX, roofBaseY - 12);
    ctx.quadraticCurveTo(houseCenterX + sway * 0.4, roofBaseY + 6, leftTipX, roofBaseY - 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const lanternSwing = Math.sin(now * 0.0035) * 0.14;
    [-houseW * 0.24, houseW * 0.24].forEach((lx, idx) => {
        ctx.save();
        ctx.translate(houseCenterX + lx + sway * 0.6, roofBaseY + 2);
        ctx.rotate(lanternSwing * (idx === 0 ? 1 : -1));
        ctx.strokeStyle = '#ffd54f';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 10);
        ctx.stroke();

        ctx.fillStyle = '#ff7eb9';
        ctx.beginPath();
        ctx.arc(0, 15, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    const floorGrad = ctx.createLinearGradient(0, groundY, 0, height);
    floorGrad.addColorStop(0, 'rgba(92, 45, 138, 0.55)');
    floorGrad.addColorStop(1, 'rgba(22, 9, 54, 0.85)');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, groundY, width, height - groundY);

    ctx.strokeStyle = 'rgba(255, 213, 79, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    ctx.restore();
}

const swayingSnacks = [];
function spawnSwayingSnack() {
    if (swayingSnacks.length >= 12) return;
    const snackType = Math.random() < 0.5 ? 'kerupuk' : 'udang';
    swayingSnacks.push({
        type: snackType,
        x: 45 + Math.random() * (width - 90),
        y: height + 40,
        r: 18 + Math.random() * 11,
        vy: 24 + Math.random() * 28,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 2.2 + Math.random() * 1.9
    });
}
for (let i = 0; i < 7; i++) {
    spawnSwayingSnack();
    swayingSnacks[i].y = height * (0.18 + Math.random() * 0.68);
}

const particles = [];
const ripples = [];
const cursorTrail = [];

function spawnParticleBurst(x, y, count, type = 'star') {
    const colors = ['#ff7eb9', '#7afcff', '#feff9c', '#d4a5ff', '#84fab0'];
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 70 + Math.random() * 220;
        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 40,
            size: 6 + Math.random() * 8,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            decay: 1.1 + Math.random() * 0.8,
            rot: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 8,
            type
        });
    }
}

function spawnRipple(x, y, color) {
    ripples.push({
        x,
        y,
        radius: padangCreature.baseRadius * 0.7,
        maxRadius: padangCreature.baseRadius * 2.4,
        alpha: 0.85,
        color
    });
}

function drawStar(ctx, cx, cy, spikes, outerR, innerR, fill, stroke) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerR;
        y = cy + Math.sin(rot) * outerR;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerR;
        y = cy + Math.sin(rot) * innerR;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function drawKerupukKulit(ctx, r) {
    const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 2, 0, 0, r * 1.15);
    grad.addColorStop(0, '#ffd27d');
    grad.addColorStop(0.55, '#c8752d');
    grad.addColorStop(1, '#7c3f12');

    ctx.fillStyle = grad;
    ctx.strokeStyle = '#ffebb3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const lobes = 10;
    for (let i = 0; i <= lobes * 2; i++) {
        const ang = (i / (lobes * 2)) * Math.PI * 2;
        const rad = i % 2 === 0 ? r * 1.05 : r * 0.82;
        const px = Math.cos(ang) * rad;
        const py = Math.sin(ang) * rad * 0.78;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 244, 214, 0.45)';
    ctx.beginPath();
    ctx.arc(-r * 0.3, -r * 0.12, r * 0.14, 0, Math.PI * 2);
    ctx.arc(r * 0.25, r * 0.14, r * 0.12, 0, Math.PI * 2);
    ctx.arc(r * 0.1, -r * 0.28, r * 0.09, 0, Math.PI * 2);
    ctx.fill();
}

function drawUdang(ctx, r) {
    const grad = ctx.createLinearGradient(-r * 0.8, -r * 0.6, r * 0.8, r * 0.6);
    grad.addColorStop(0, '#ff9e7d');
    grad.addColorStop(0.5, '#ff6b4a');
    grad.addColorStop(1, '#d63a2f');

    ctx.fillStyle = grad;
    ctx.strokeStyle = '#ffe5d9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-r * 0.55, -r * 0.45);
    ctx.quadraticCurveTo(r * 0.55, -r * 0.75, r * 0.65, r * 0.15);
    ctx.quadraticCurveTo(r * 0.45, r * 0.72, -r * 0.35, r * 0.58);
    ctx.quadraticCurveTo(-r * 0.15, r * 0.22, -r * 0.55, -r * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 240, 230, 0.65)';
    ctx.lineWidth = 1.6;
    for (let s = 1; s <= 3; s++) {
        const t = s / 4;
        const sx = -r * 0.25 + t * r * 0.75;
        const sy = -r * 0.25 + t * r * 0.55;
        ctx.beginPath();
        ctx.arc(sx, sy, r * 0.24, -0.4, 1.3);
        ctx.stroke();
    }

    ctx.fillStyle = '#ff7b5c';
    ctx.beginPath();
    ctx.moveTo(-r * 0.45, -r * 0.38);
    ctx.lineTo(-r * 0.92, -r * 0.65);
    ctx.lineTo(-r * 0.78, -r * 0.18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function handlePointerDown(clientX, clientY) {
    STATE.pointer.x = clientX;
    STATE.pointer.y = clientY;
    STATE.pointer.prevX = clientX;
    STATE.pointer.prevY = clientY;
    STATE.pointer.isDown = true;

    for (let i = swayingSnacks.length - 1; i >= 0; i--) {
        const s = swayingSnacks[i];
        const dist = Math.hypot(clientX - s.x, clientY - s.y);
        if (dist <= s.r + 14) {
            SoundFX.playEat();
            spawnParticleBurst(s.x, s.y, 14, 'star');
            padangCreature.expression = 'love';
            padangCreature.expressionTimer = 1.6;
            padangCreature.updateMoodText();
            if (s.type === 'kerupuk') {
                showSpeech('Kriuk! Kerupuk kulitnya renyah bergoyang! 🍘✨');
            } else {
                showSpeech('Yummy! Udang gurihnya ikut bergoyang! 🍤💖');
            }
            swayingSnacks.splice(i, 1);
            return;
        }
    }

    if (!padangCreature.tryGrab(clientX, clientY)) {
        spawnParticleBurst(clientX, clientY, 6, 'star');
    }
}

function handlePointerMove(clientX, clientY) {
    const moveDist = Math.hypot(clientX - STATE.pointer.prevX, clientY - STATE.pointer.prevY);
    STATE.pointer.prevX = clientX;
    STATE.pointer.prevY = clientY;
    STATE.pointer.x = clientX;
    STATE.pointer.y = clientY;

    if (padangCreature.grabbedNodeIndex === -1) {
        padangCreature.handlePetting(clientX, clientY, moveDist);
    }

    if (Math.random() < 0.65) {
        cursorTrail.push({
            x: clientX + (Math.random() - 0.5) * 10,
            y: clientY + (Math.random() - 0.5) * 10,
            size: 4 + Math.random() * 5,
            alpha: 1,
            color: ['#ff7eb9', '#7afcff', '#feff9c', '#ffffff'][Math.floor(Math.random() * 4)]
        });
    }
}

function handlePointerUp() {
    STATE.pointer.isDown = false;
    padangCreature.releaseGrab();
}

canvas.addEventListener('mousedown', (e) => handlePointerDown(e.clientX, e.clientY));
window.addEventListener('mousemove', (e) => handlePointerMove(e.clientX, e.clientY));
window.addEventListener('mouseup', handlePointerUp);

canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
        const t = e.touches[0];
        handlePointerDown(t.clientX, t.clientY);
    }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        const t = e.touches[0];
        handlePointerMove(t.clientX, t.clientY);
    }
}, { passive: true });

window.addEventListener('touchend', handlePointerUp);

document.getElementById('feedDonutBtn').addEventListener('click', () => throwFood('donut'));
document.getElementById('feedCandyBtn').addEventListener('click', () => throwFood('candy'));
document.getElementById('feedBobaBtn').addEventListener('click', () => throwFood('boba'));

document.getElementById('costumeBtn').addEventListener('click', () => {
    STATE.costumeIndex = (STATE.costumeIndex + 1) % COSTUMES.length;
    const c = COSTUMES[STATE.costumeIndex];
    costumeDisplay.textContent = `${c.icon} Kostum: ${c.label}`;

    for (let i = 0; i < padangCreature.numNodes; i++) {
        padangCreature.nodes[i].vy -= 210;
    }
    SoundFX.playMagic();
    spawnParticleBurst(padangCreature.centerX, padangCreature.nodes[0].y - 10, 22, 'star');
    showSpeech(`Taraaa! Pakai ${c.label} ${c.icon}`);
});

partyBtn.addEventListener('click', () => {
    STATE.partyMode = !STATE.partyMode;
    partyBtn.classList.toggle('active', STATE.partyMode);

    if (STATE.partyMode) {
        partyBtn.textContent = '⏹️ Stop Dansa';
        padangCreature.expression = 'party';
        padangCreature.updateMoodText();
        SoundFX.startPartyMusic();
        showSpeech('Waktunya Joget Piring Padang! Ayo goyang! 🪩🍛', 3000);
    } else {
        partyBtn.textContent = '🪩 Mode Dansa';
        padangCreature.expression = 'happy';
        padangCreature.updateMoodText();
        SoundFX.stopPartyMusic();
        showSpeech('Huff~ Seru banget jogetnya! 💖');
    }
});

let lastTime = performance.now();
let snackTimer = 0;

function animate(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    ctx.clearRect(0, 0, width, height);

    if (STATE.partyMode) {
        STATE.partyHue = (STATE.partyHue + dt * 140) % 360;
        const spot1X = width * 0.25 + Math.sin(now * 0.0025) * (width * 0.2);
        const spot2X = width * 0.75 + Math.cos(now * 0.0022) * (width * 0.2);

        [
            { x: spot1X, hue: STATE.partyHue },
            { x: spot2X, hue: (STATE.partyHue + 160) % 360 }
        ].forEach((spot) => {
            const grad = ctx.createLinearGradient(spot.x, 0, width / 2, height);
            grad.addColorStop(0, `hsla(${spot.hue}, 100%, 72%, 0.34)`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(spot.x - 45, 0);
            ctx.lineTo(spot.x + 45, 0);
            ctx.lineTo(spot.x + 240, height);
            ctx.lineTo(spot.x - 240, height);
            ctx.closePath();
            ctx.fill();
        });
    }

    bgStars.forEach((s) => {
        const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(now * 0.001 * s.speed + s.phase));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x % width, s.y % height, s.r, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;

    drawCuteRumahGadang(ctx, now);

    snackTimer += dt;
    if (snackTimer > 1.45) {
        spawnSwayingSnack();
        snackTimer = 0;
    }

    for (let i = swayingSnacks.length - 1; i >= 0; i--) {
        const s = swayingSnacks[i];
        s.y -= s.vy * dt;
        const swayAngle = Math.sin(now * 0.001 * s.swaySpeed + s.swayPhase) * 0.32;
        s.x += Math.sin(now * 0.002 + s.swayPhase) * 0.85;

        if (s.y < -60) {
            swayingSnacks.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(swayAngle);

        if (s.type === 'kerupuk') {
            drawKerupukKulit(ctx, s.r);
        } else {
            drawUdang(ctx, s.r);
        }

        ctx.restore();
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.radius += dt * 260;
        rp.alpha -= dt * 1.3;
        if (rp.alpha <= 0) {
            ripples.splice(i, 1);
            continue;
        }
        ctx.save();
        ctx.globalAlpha = rp.alpha;
        ctx.strokeStyle = rp.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    padangCreature.update(dt);
    padangCreature.draw(ctx);

    updateAndDrawFoods(dt);

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 180 * dt;
        p.rot += p.vRot * dt;
        p.alpha -= p.decay * dt;

        if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        if (p.type === 'heart') {
            padangCreature.drawHeartShape(ctx, 0, 0, p.size * 0.85, p.color);
        } else if (p.type === 'confetti') {
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size * 0.6, -p.size * 0.3, p.size * 1.2, p.size * 0.6);
        } else {
            drawStar(ctx, 0, 0, 5, p.size, p.size * 0.45, p.color);
        }
        ctx.restore();
    }

    for (let i = cursorTrail.length - 1; i >= 0; i--) {
        const ct = cursorTrail[i];
        ct.alpha -= dt * 2.4;
        ct.y -= dt * 18;
        if (ct.alpha <= 0) {
            cursorTrail.splice(i, 1);
            continue;
        }
        ctx.save();
        ctx.globalAlpha = ct.alpha;
        drawStar(ctx, ct.x, ct.y, 4, ct.size, ct.size * 0.35, ct.color);
        ctx.restore();
    }

    requestAnimationFrame(animate);
}

window.onload = () => {
    setTimeout(() => {
        showSpeech('Boing~ Tarik Nasi Padangku atau klik kerupuk & udang bergoyang ya! 🍛✨', 3400);
    }, 600);
    requestAnimationFrame(animate);
};
