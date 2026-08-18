document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatMessages = document.getElementById("chat-messages");

  // URL del teu Worker a Cloudflare
  const WORKER_URL = "https://projecte-pilar.francesc-j-hernandez.workers.dev/";

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pregunta = userInput.value.trim();
    if (!pregunta) return;

    // Afegir la pregunta de l'usuari al xat
    appendMessage(pregunta, "user-message");
    userInput.value = "";

    // Missatge d'espera
    const loadingMessage = appendMessage("Escribint...", "bot-message");

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta })
      });

      const data = await response.json();
      
      if (data.error) {
        loadingMessage.textContent = "Error: " + data.error;
      } else {
        loadingMessage.textContent = data.resposta || "S'ha produït un error en la resposta.";
      }
    } catch (error) {
      loadingMessage.textContent = "Error de connexió amb l'agent. Revisa la configuració del Worker.";
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
