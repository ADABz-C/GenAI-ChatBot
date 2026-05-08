const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");

// START MESSAGE
addMessage("What are you working on today?", "bot");

// SUGGESTION BUTTONS
document.querySelectorAll("#suggestions button").forEach(btn => {
    btn.addEventListener("click", () => {
        input.value = btn.textContent;
        sendMessage();
    });
});

// ADD MESSAGE
function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);

    const p = document.createElement("p");
    p.textContent = text;

    msg.appendChild(p);
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// SEND MESSAGE
async function sendMessage() {
    const text = input.value;
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    const botMsg = document.createElement("div");
    botMsg.classList.add("message", "bot");

    const p = document.createElement("p");
    p.textContent = "...";
    botMsg.appendChild(p);

    chatBox.appendChild(botMsg);

    const res = await fetch("https://listed-objective-pentium-wed.trycloudflare.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let result = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        result += chunk;
        p.textContent = result;
    }
}