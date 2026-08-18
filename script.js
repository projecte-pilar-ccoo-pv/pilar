document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatMessages = document.getElementById("chat-messages");
  
  const btnTabChat = document.getElementById("btn-tab-chat");
  const btnTabPrompts = document.getElementById("btn-tab-prompts");
  const tabChat = document.getElementById("tab-chat");
  const tabPrompts = document.getElementById("tab-prompts");

  // URL del Worker a Cloudflare
  const WORKER_URL = "https://pilar-agent.projecte-pilar-ccoo-pv.workers.dev";

  // Gestió de les pestanyes
  btnTabChat.addEventListener("click", () => {
    tabChat.classList.add("active");
    tabPrompts.classList.remove("active");
    btnTabChat.classList.add("active");
    btnTabPrompts.classList.remove("active");
  });

  btnTabPrompts.addEventListener("click", () => {
    tabPrompts.classList.add("active");
    tabChat.classList.remove("active");
    btnTabPrompts.classList.add("active");
    btnTabChat.classList.remove("active");
  });

  // Gestió de la tramesa del xat
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const messageText = userInput.value.trim();
    if (!messageText) return;

    // Afegir missatge de l'usuari a la pantalla
    appendMessage(messageText, "user-message");
    userInput.value = "";

    // Indicador de processament
    const loadingMessage = appendMessage("L'Agent PILAR està processant...", "bot-message");

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ pregunta: messageText })
      });

      const data = await response.json();

      if (!response.ok) {
        loadingMessage.textContent = "Error: " + (data.error || "Error en el servidor.");
      } else {
        loadingMessage.textContent = data.resposta || data.reply || "Sense resposta de l'agent.";
      }
    } catch (error) {
      console.error("Error en enviar la consulta:", error);
      loadingMessage.textContent = "Error de connexió amb l'Agent PILAR: " + error.message;
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  function appendMessage(text, className) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", className);
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgDiv;
  }
});
