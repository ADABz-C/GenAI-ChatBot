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

function sendMessage() {
    const text = input.value;
    if (text === "") return;

    // User message
    const userMsg = document.createElement("div");
    userMsg.classList.add("message", "user");
    userMsg.innerHTML = `<p>${text}</p>`;
    chatBox.appendChild(userMsg);

    // Fake bot reply (placeholder)
    const botMsg = document.createElement("div");
    botMsg.classList.add("message", "bot");
    botMsg.innerHTML = `<p>Thinking...</p>`;
    chatBox.appendChild(botMsg);

    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}