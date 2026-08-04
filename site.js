const config = window.SNORSE_CONFIG || {};

document.querySelectorAll("[data-username]").forEach((element) => {
  element.textContent = `@${config.signalUsername || "snorse-bot"}`;
});
document.querySelectorAll("[data-project]").forEach((element) => {
  element.href = config.projectUrl || "https://github.com/mlevin5/snorse-bot";
});

document.querySelectorAll("#kofi").forEach((element) => {
  if (config.kofiUrl) {
    element.href = config.kofiUrl;
    element.target = "_blank";
    element.rel = "noopener";
  } else if (element.getAttribute("href") === "#") {
    element.hidden = true;
  }
});
document.querySelectorAll("#support-pending").forEach((element) => {
  element.hidden = Boolean(config.kofiUrl);
});

async function loadCapacity() {
  const label = document.querySelector("#status-label");
  if (!label) return;
  const detail = document.querySelector("#status-detail");
  try {
    if (!config.capacityApi) throw new Error("capacity endpoint missing");
    const response = await fetch(config.capacityApi);
    if (!response.ok) throw new Error(`capacity HTTP ${response.status}`);
    const data = await response.json();
    label.textContent =
      data.status === "open" ? "ADMISSIONS OPEN" : "ADMISSIONS PAUSED";
    detail.textContent = `${data.cause}. Updated ${data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "awaiting report"}.`;
    document.querySelector("#groups").textContent =
      `${data.activeGroups} / ${data.caps.groups}`;
    document.querySelector("#group-wait").textContent = data.waitlistedGroups;
    document.querySelector("#people").textContent =
      `${data.activePersonalUsers} / ${data.caps.personalUsers}`;
    document.querySelector("#status-dot").className = data.status;
  } catch {
    label.textContent = "STATUS LINK DOWN";
    detail.textContent =
      "The aggregate display is temporarily unavailable. Existing groups are unaffected.";
  }
}

loadCapacity();
