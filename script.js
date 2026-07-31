const app = {
    // State management
    state: {
        userName: "",
        currentStoryline: 1,
        noCount: 0
    },

    // DOM Elements
    elements: {
        scenes: document.querySelectorAll('.scene'),
        charName: document.getElementById('char-name'),
        charText: document.getElementById('char-text'),
        nameInput: document.getElementById('name-input'),
        verifyBtn: document.getElementById('verify-btn'),
        errorMsg: document.getElementById('security-error'),
        storyContent: document.getElementById('story-content'),
        finalMessages: document.getElementById('final-messages')
    },

    // Initialization
    init() {
        this.startIntro();
        this.setupEventListeners();
        this.createPetals();
    },

    // Transition Helper
    showScene(id) {
        this.elements.scenes.forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    // Typing Effect Helper
    async typeWriter(text, element, speed = 40) {
        element.innerHTML = "";
        for (let i = 0; i < text.length; i++) {
            element.innerHTML += text.charAt(i);
            await new Promise(r => setTimeout(r, speed));
        }
    },

    // Scene 1: Comic Intro Logic
    async startIntro() {
        const dialogues = [
            { name: "ADMIN", text: "I guess It's done." },
            { name: "JUNIOR", text: "Yes sir..." },
            { name: "JUNIOR", text: "Sir, looks like someone is here!" },
            { name: "ADMIN", text: "Proceed Security Check.\nI don't want anyone to leak my surprise." },
            { name: "JUNIOR", text: "Okay Sir..." }
        ];

        for (const d of dialogues) {
            this.elements.charName.innerText = d.name;
            await this.typeWriter(d.text, this.elements.charText);
            await new Promise(r => setTimeout(r, 1500));
        }
        
        this.showScene('scene-security');
    },

    setupEventListeners() {
        this.elements.verifyBtn.addEventListener('click', () => this.handleVerification());
    },

    handleVerification() {
        const val = this.elements.nameInput.value.trim().toLowerCase();
        if (val === "anuradha") {
            this.state.userName = "Anuradha";
            this.startLoading(1);
        } else if (val === "anu" || val === "annu") {
            this.state.userName = val.charAt(0).toUpperCase() + val.slice(1);
            this.startLoading(2);
        } else {
            this.elements.errorMsg.innerText = "Access denied... only someone special can enter ❤️";
        }
    },

    async startLoading(storyline) {
        this.showScene('scene-loading');
        await new Promise(r => setTimeout(r, 3000));
        
        const loaderText = document.getElementById('loading-text');
        await this.typeWriter("ALERT!", loaderText);
        await new Promise(r => setTimeout(r, 1000));
        await this.typeWriter("What the hell... How can I find you? You are everywhere in his heart ❤️", loaderText);
        
        await new Promise(r => setTimeout(r, 3000));
        this.startStory(storyline);
    },

    async startStory(branch) {
        this.showScene('scene-main');
        const container = this.elements.storyContent;

        if (branch === 1) {
            await this.addStoryLine(`Welcome ${this.state.userName} Ma'am`, "h2");
            await this.addStoryLine("Let me show you Admin Sir's message first...");
            await this.addStoryLine("Hey babygirl ❤️", "interaction-card");
            await this.addStoryLine("I know I should be online to capture and listen to your reaction, but I'm sorry I can't. I hope you understand.");
            await this.addStoryLine("You can check your surprise. Junior will assist you.");
            await this.addStoryLine("Happy Girlfriend Day, Babygirl ❤️", "interaction-card");
            await this.addStoryLine("I don't know if I deserve this much happiness, but having you in my life is something special.");
            await this.addStoryLine("I love you ❤️", "h2");
            this.addNextBtn("Proceed to End");
        } else {
            await this.addStoryLine(`Welcome ${this.state.userName} Ma'am`, "h2");
            await this.addStoryLine("Let me show you Admin Sir's message first.");
            await this.addStoryLine("Hey babygirl ❤️", "interaction-card");
            await this.addStoryLine("I know I should be there to see your reaction to this annoying and stupid surprise, but I can't. Junior will assist you.");
            this.addInteractionGame();
        }
    },

    async addStoryLine(text, className = "story-line") {
        const div = document.createElement('div');
        div.className = className;
        div.innerText = text;
        this.elements.storyContent.appendChild(div);
        await new Promise(r => setTimeout(r, 2000));
    },

    addInteractionGame() {
        const gameDiv = document.createElement('div');
        gameDiv.innerHTML = `
            <h3>Do you like me? ❤️</h3>
            <div style="margin-top:20px; display:flex; gap:20px; justify-content:center;">
                <button id="yes-btn">YES</button>
                <button id="no-btn">NO</button>
            </div>
            <p id="tease-msg" style="margin-top:20px; min-height:30px;"></p>
        `;
        this.elements.storyContent.appendChild(gameDiv);

        const noBtn = document.getElementById('no-btn');
        const yesBtn = document.getElementById('yes-btn');
        const teaseMsg = document.getElementById('tease-msg');

        const phrases = [
            "Are you sure? Think again 😏",
            "Wrong button detected 😂",
            "Your heart says yes but your finger says no.",
            "Nice try babygirl ❤️",
            "System knows the truth."
        ];

        const moveNo = () => {
            const x = Math.random() * (window.innerWidth - 100);
            const y = Math.random() * (window.innerHeight - 50);
            noBtn.style.position = 'fixed';
            noBtn.style.left = x + 'px';
            noBtn.style.top = y + 'px';
            teaseMsg.innerText = phrases[Math.floor(Math.random() * phrases.length)];
        };

        noBtn.addEventListener('mouseover', moveNo);
        noBtn.addEventListener('click', moveNo);

        yesBtn.onclick = async () => {
            noBtn.style.display = 'none';
            teaseMsg.innerText = "I knew it! 😂 Just kidding...";
            await new Promise(r => setTimeout(r, 2000));
            await this.addStoryLine("Happy Girlfriend Day Babygirl ❤️", "interaction-card");
            await this.addStoryLine("I know you won't agree that you are my girlfriend, but no problem... your processor will understand it soon 😂");
            this.addNextBtn("Continue ❤️");
        };
    },

    addNextBtn(label) {
        const btn = document.createElement('button');
        btn.innerText = label;
        btn.style.marginTop = "30px";
        btn.onclick = () => this.showFinalScreen();
        this.elements.storyContent.appendChild(btn);
    },

    async showFinalScreen() {
        this.showScene('scene-final');
        const container = this.elements.finalMessages;
        const messages = [
            "Thank you so much for coming here ❤️",
            "Ummm... Seems like someone is blushing ❤️",
            "That suits you, babygirl.",
            "Keep that smile forever.",
            "I know I can't see it right now...",
            "But you can send me a quick snap or a voice note...",
            "(Only if you honestly liked it even a little ❤️)",
            "Happy Girlfriend Day, My Girl ❤️",
            "I will always love you."
        ];

        for (const m of messages) {
            const p = document.createElement('p');
            p.className = "story-line";
            p.innerText = m;
            p.style.marginBottom = "20px";
            container.appendChild(p);
            await new Promise(r => setTimeout(r, 2500));
        }
    },

    createPetals() {
        const container = document.getElementById('particles-container');
        setInterval(() => {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.left = Math.random() * 100 + 'vw';
            petal.style.width = Math.random() * 15 + 10 + 'px';
            petal.style.height = petal.style.width;
            petal.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            container.appendChild(petal);
            setTimeout(() => petal.remove(), 5000);
        }, 300);

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

app.init();