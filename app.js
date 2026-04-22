document.addEventListener("DOMContentLoaded", () => {
  const demoButton = document.getElementById("demoButton");
  const demoStatus = document.getElementById("demoStatus");

  if (!demoButton || !demoStatus) {
    return;
  }

  demoButton.addEventListener("click", () => {
    demoStatus.textContent =
      "Demo started! Explore interactive learning, games, and progress tracking.";
  });
});
