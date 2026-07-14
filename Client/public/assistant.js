(function () {
    const script = document.currentScript;
    const userId = script?.dataset?.userId;
    const clientUrl = script?.dataset?.clientUrl;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "http://localhost:5173/assistant.css";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
        .shifra-root-wrapper {
            position: fixed;
            right: 18px;
            bottom: 18px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            pointer-events: none;
        }
        .shifra-launcher-logo {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            pointer-events: auto;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1000000;
        }
        .shifra-launcher-logo:hover {
            transform: scale(1.08);
        }
        .shifra-launcher-logo svg {
            color: #ffffff;
            transition: transform 0.4s ease;
        }
        .shifra-launcher-logo.is-open svg {
            transform: rotate(180deg);
        }
        .shifra-card-wrapper {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            margin-bottom: 16px;
        }
        .shifra-card-wrapper.is-visible {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }
    `;
    document.head.appendChild(style);

    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g,
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    const waveBars = [
        { minHeight: 12, maxHeight: 28 },
        { minHeight: 16, maxHeight: 42 },
        { minHeight: 8, maxHeight: 24 },
        { minHeight: 20, maxHeight: 48 },
        { minHeight: 14, maxHeight: 32 },
        { minHeight: 8, maxHeight: 20 },
    ];

    let state = {
        theme: "dark",
        title: "Shifra AI",
        subtitle: "Your smart voice assistant.<br/>Ask anything about your website.",
        isListening: false,
        isOpen: false,
    };

    const container = document.createElement("div");
    container.className = "shifra-root-wrapper";
    document.body.appendChild(container);

    function render() {
        container.innerHTML = `
            <div class="shifra-card-wrapper ${state.isOpen ? 'is-visible' : ''}">
                <div id="shifra-card" class="shifra-card theme-${state.theme}">
                    <div class="shifra-overlay"></div>
                    <div class="shifra-selectors-panel">
                        ${["dark", "light", "glass", "neon"].map(t => `
                            <button 
                                data-theme="${t}" 
                                class="shifra-theme-btn btn-${t} ${state.theme === t ? 'is-active' : ''}"
                                aria-label="${t} theme"
                            ></button>
                        `).join('')}
                    </div>
                    <div class="shifra-content">
                        <div class="shifra-orb-viewport">
                            <div class="shifra-orb-blur-glow"></div>
                            <div id="shifra-fluid-orb" class="shifra-fluid-orb ${state.isListening ? 'shifra-orb-active' : ''}"></div>
                        </div>
                        <div class="shifra-text-center">
                            <h2 class="shifra-title">Hello! I'm ${state.title}</h2>
                            <p class="shifra-subtitle">${state.subtitle}</p>
                            <div class="shifra-visualizer-container">
                                ${state.isListening ? `
                                    <div class="shifra-listening-wrapper">
                                        <p class="shifra-status-tag">Listening...</p>
                                        <div class="shifra-wave-eq-bars">
                                            ${waveBars.map(() => `<span class="shifra-eq-bar"></span>`).join('')}
                                        </div>
                                    </div>
                                ` : `
                                    <p class="shifra-idle-tag">Tap the mic to talk</p>
                                `}
                            </div>
                        </div>
                        <div class="shifra-mic-dock">
                            <div id="shifra-mic-pulse" class="shifra-mic-pulse ${state.isListening ? 'shifra-pulse-active' : ''}"></div>
                            <button id="shifra-mic-toggle" class="shifra-mic-trigger" aria-label="Toggle Mic">
                                <svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" height="28" width="28" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="shifra-launcher" class="shifra-launcher-logo ${state.isOpen ? 'is-open' : ''}" role="button" aria-label="Toggle Shifra Assistant">
                ${state.isOpen ? `
                    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="28" width="28" xmlns="http://www.w3.org/2000/svg">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ` : `
                    <img src="http://localhost:5173/logo2.png" alt="logo" class="launcher-icon">
                `}
            </div>
        `;

        bindEvents();
        if (state.isOpen && state.isListening) startWaveAnimation();
    }

    let waveInterval;
    function startWaveAnimation() {
        clearInterval(waveInterval);
        const spans = container.querySelectorAll(".shifra-eq-bar");
        if (!spans.length) return;

        waveInterval = setInterval(() => {
            spans.forEach((span, idx) => {
                const bar = waveBars[idx];
                const targetHeight = Math.floor(Math.random() * (bar.maxHeight - bar.minHeight + 1)) + bar.minHeight;
                span.style.height = `${targetHeight}px`;
            });
        }, 120);
    }

    function bindEvents() {
        container.querySelectorAll(".shifra-theme-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                state.theme = e.target.getAttribute("data-theme");
                render();
            });
        });

        const micBtn = container.querySelector("#shifra-mic-toggle");
        if (micBtn) {
            micBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                state.isListening = !state.isListening;
                if (!state.isListening) clearInterval(waveInterval);
                render();
            });
        }

        const launcherBtn = container.querySelector("#shifra-launcher");
        if (launcherBtn) {
            launcherBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                state.isOpen = !state.isOpen;
                if (!state.isOpen) clearInterval(waveInterval);
                render();
            });
        }
    }

    document.addEventListener("click", (e) => {
        if (state.isOpen && !container.contains(e.target)) {
            state.isOpen = false;
            clearInterval(waveInterval);
            render();
        }
    });

    let assistantConfig = null;
    const loadAssistant = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/assistant/config/${userId}`);
            if (!res.ok) throw new Error("Failed to load assistant");

            const data = await res.json();

            if (data.user) {
                assistantConfig = data.user;
                applyConfig();
            }
        } catch (error) {
            console.error("Load Assistant Error:", error);
        }
    };

    const applyConfig = () => {
        if (!assistantConfig) return;

        const incomingTheme = (assistantConfig.theme || "dark").toLowerCase();

        state.theme = ["dark", "light", "glass", "neon"].includes(incomingTheme) ? incomingTheme : "dark";
        state.title = escapeHTML(assistantConfig.assistantName || "Shifra AI");

        const businessName = escapeHTML(assistantConfig.businessName || "our website");
        state.subtitle = `Welcome to ${businessName}.<br/>Ask anything about your website.`;

        render();
    };
    // Initialize execution flow
    render();
    loadAssistant();
})();