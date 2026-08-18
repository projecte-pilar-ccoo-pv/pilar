chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  appendMsg(text, "user-message");
  userInput.value = "";
  const loading = appendMsg("L'Agent PILAR està processant...", "bot-message");

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta: text })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      loading.textContent = "Error: " + (data.error || "Error en el servidor");
    } else {
      loading.textContent = data.resposta || data.reply || "Sense resposta.";
    }
  } catch (err) {
    loading.textContent = "Error de connexió: " + err.message;
  }
});
