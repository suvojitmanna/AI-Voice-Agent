(function () {
    const script = document.currentScript;
    const userId = script?.dataset?.userId;
    const clientUrl = script?.dataset?.clientUrl;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "http://localhost:5173/assistant.css";
    document.head.appendChild(link);

    const style = document.createElement("style");
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
        waveText: "Listening...",
        userText: "",
        aiText: "",
        micText: "Tap the mic to talk"
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
                                        <p class="shifra-status-tag">${state.waveText}</p>
                                        <div class="shifra-wave-eq-bars">
                                            ${waveBars.map(() => `<span class="shifra-eq-bar"></span>`).join('')}
                                        </div>
                                    </div>
                                ` : `
                                    <p class="shifra-idle-tag">${state.micText}</p>
                                `}
                            </div>
                            <div class="shifra-chat-status">
                                ${state.userText
                ? `<div class="shifra-user-text">
                                        <strong>You:</strong> ${state.userText}
                                       </div>`
                : ""
            }
                                ${state.aiText
                ? `
<div class="shifra-ai-text">
    <strong>${state.title}:</strong> ${state.aiText}
</div>
`
                : ""
            }
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

        // Start or clear waves based on listening state
        if (state.isOpen && state.isListening) {
            startWaveAnimation();
        } else {
            clearInterval(waveInterval);
        }
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
                if (window.startRecognition && !state.isListening) {
                    window.startRecognition();
                } else if (window.stopRecognition && state.isListening) {
                    window.stopRecognition();
                }
            });
        }

        const launcherBtn = container.querySelector("#shifra-launcher");
        if (launcherBtn) {
            launcherBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                state.isOpen = !state.isOpen;
                render();
            });
        }
    }

    document.addEventListener("click", (e) => {
        if (state.isOpen && !container.contains(e.target)) {
            state.isOpen = false;
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
        state.subtitle = assistantConfig.subtitle || `Welcome to ${businessName}.<br/>Ask anything about your website.`;

        if (!state.userText && !state.aiText) {
            state.waveText = assistantConfig.waveText || "Listening...";
            state.micText = assistantConfig.micText || "Tap the mic to talk";
        }

        render();
    };

    render();
    loadAssistant();

    const speak = (text) => {
        window.speechSynthesis.cancel();

        state.aiText = text;
        state.micText = "AI Speaking...";
        state.isListening = false;
        render();

        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;
        console.log("Render:", state.aiText);
        speech.onend = () => {
            state.micText = "Tap the mic to talk";
            render();
        };

        window.speechSynthesis.speak(speech);
    };

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn("Speech Recognition is not supported in this browser.");
    }
    else {
        const recognition = new SpeechRecognition();

        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            state.isListening = true;
            state.waveText = "Listening...";
            state.userText = "";
            state.aiText = "";
            render();
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;

            state.userText = transcript;
            state.isListening = false;

            console.log("Captured speech:", transcript);

            recognition.stop();

            setTimeout(async () => {
                try {
                    state.userText = transcript;
                    state.aiText = "Thinking...";
                    state.micText = "Thinking...";
                    render();

                    await new Promise(resolve => setTimeout(resolve, 100));

                    const res = await fetch(`http://localhost:8000/api/assistant/ask`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            message: transcript,
                            userId,
                            currentPath: window.location.pathname
                        })
                    });

                    const data = await res.json();

                    if (!res.ok || !data.success) {
                        let errorMessage =
                            data.message || data.error || "Something went wrong";

                        if (errorMessage.toLowerCase().includes("quota")) {
                            errorMessage = "Your Gemini API quota has been reached.";
                        } else if (errorMessage.toLowerCase().includes("api key")) {
                            errorMessage = "Invalid Gemini API key.";
                        } else if (errorMessage.toLowerCase().includes("busy")) {
                            errorMessage = "Gemini is busy. Please try again.";
                        } else if (errorMessage.toLowerCase().includes("network")) {
                            errorMessage = "Network error. Please try again.";
                        }

                        state.aiText = errorMessage;
                        state.micText = "AI Speaking...";
                        render();

                        speak(errorMessage);
                        return;
                    }

                    if (data.action === "navigation") {
                        speak(data.response);

                        setTimeout(() => {
                            window.location.href = data.path;
                        }, 1500);
                    } else {
                        speak(data.aiResponse);
                    }
                } catch (error) {
                    console.error(error);

                    let errorMessage = error.message || "AI server error";

                    if (errorMessage.toLowerCase().includes("quota")) {
                        errorMessage = "Your Gemini API quota has been reached.";
                    } else if (errorMessage.toLowerCase().includes("api key")) {
                        errorMessage = "Invalid Gemini API key.";
                    } else if (errorMessage.toLowerCase().includes("busy")) {
                        errorMessage = "Gemini is busy. Please try again.";
                    }

                    state.aiText = errorMessage;
                    state.micText = "AI Speaking...";
                    render();

                    speak(errorMessage);
                }
            }, 600);
        };

        recognition.onerror = (e) => {
            console.error("Mic Error: ", e.error);
            state.isListening = false;
            state.micText = "Mic Error - Tap to try again";
            render();
        };

        recognition.onend = () => {
            state.isListening = false;
            render();
        };

        window.startRecognition = () => {
            try {
                recognition.start();
            } catch (err) {
                console.log("Mic already started:", err);
            }
        };

        window.stopRecognition = () => {
            try {
                recognition.stop();
            } catch (err) {
                console.log(err);
            }
        };
    }

})();