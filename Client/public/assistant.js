(function () {
    const script = document.currentScript;
    const userId = script?.dataset?.userId;
    const clientUrl = script.dataset.clientUrl;

    const theme = "dark";
    const assistantConfig = null;

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "http://localhost:5173/assistant.css"
})()