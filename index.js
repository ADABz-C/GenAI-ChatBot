const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e)=>{
    if(e.key === 'Enter'){
        e.preventDefault();
        sendBtn.click();
    }
});

async function sendMessage() {
    const text = input.value;
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    //  Create bot message container
    const botMsg = document.createElement("div");
    botMsg.classList.add("message", "bot");

    //  Typing bubble
    const typing = document.createElement("div");
    typing.classList.add("typing");

    typing.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    botMsg.appendChild(typing);
    chatBox.appendChild(botMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Fetch response
    const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let result = "";

    //  Replace typing with actual text
    const textElement = document.createElement("p");
    botMsg.innerHTML = "";
    botMsg.appendChild(textElement);

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        result += chunk;

        textElement.textContent = result;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.innerHTML = `<p>${text}</p>`;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}
chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: "smooth"
});