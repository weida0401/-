"use strict";

(() => {
  const toggle = document.getElementById("music-toggle");
  const music = document.getElementById("site-music");
  if (!toggle || !music) return;

  const icon = toggle.querySelector(".music-icon");
  const label = toggle.querySelector("span:not(.music-icon)");
  const announcement = document.createElement("span");
  announcement.setAttribute("role", "status");
  announcement.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap";
  toggle.after(announcement);
  music.volume = 0.58;

  const positionKey = "moonveil-music-position";
  music.addEventListener("loadedmetadata", () => {
    try {
      const position = Number(sessionStorage.getItem(positionKey));
      if (position > 0 && position < music.duration) music.currentTime = position;
    } catch {
      // Audio still works if browser storage is unavailable.
    }
  }, { once: true });

  window.addEventListener("pagehide", () => {
    try {
      if (music.currentTime > 0) sessionStorage.setItem(positionKey, String(music.currentTime));
    } catch {
      // Audio still works if browser storage is unavailable.
    }
    if (!music.paused) music.pause();
  });

  function setPlaying(playing) {
    toggle.setAttribute("aria-pressed", String(playing));
    toggle.title = playing ? "暫停背景音樂" : "播放背景音樂";
    if (icon) icon.textContent = playing ? "♫" : "♪";
  }

  function reportFailure() {
    setPlaying(false);
    toggle.title = "暫時無法播放，按一下重試";
    if (label) label.textContent = "重試音樂";
    announcement.textContent = "暫時無法播放背景音樂，請再試一次。";
  }

  toggle.addEventListener("click", async () => {
    if (!music.paused) {
      music.pause();
      return;
    }
    if (label) label.textContent = "音樂";
    announcement.textContent = "";
    try {
      if (music.error) music.load();
      await music.play();
    } catch (error) {
      if (error.name !== "AbortError") reportFailure();
    }
  });

  music.addEventListener("play", () => setPlaying(true));
  music.addEventListener("pause", () => setPlaying(false));
  music.addEventListener("error", reportFailure);
  setPlaying(false);
})();
