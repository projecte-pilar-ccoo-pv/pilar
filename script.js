document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatMessages = document.getElementById("chat-messages");

  // Aquesta URL s'actualitzarà quan tinguem desplegat el Worker de Cloudflare
  const WORKER_URL = "https://EL_TEU_WORKER.workers.dev";

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
      loadingMessage.textContent = data.resposta || "S'ha produït un error en la resposta.";
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
