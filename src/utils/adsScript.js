// Video player script utility for ad integration

/**
 * Loads the video player script and initializes it with the specified player ID
 * @param {string} playerId - The ID of the player element
 * @param {boolean} shouldLoad - Whether to load the player (typically based on data being available)
 */
export const loadVideoPlayerScript = (playerId, shouldLoad) => {
  // Only load if shouldLoad is true
  if (!shouldLoad) return;
  
  // Clean up any existing scripts to prevent duplicates
  const existingScripts = document.querySelectorAll(
    'script[src*="kolorowey.com"], script[data-playerPro]'
  );
  existingScripts.forEach((script) => script.remove());

  // Create and load the main video script
  const videoScript = document.createElement("script");
  videoScript.src = "https://stream.kolorowey.com/player/video.js";
  videoScript.async = true;

  // When the main script loads, initialize the player
  videoScript.onload = () => {
    const playerScript = document.createElement("script");
    playerScript.innerHTML = `
      (function(){
        (playerPro = window.playerPro || []).push({
          id: "${playerId}"
        });
      })();
    `;
    document.body.appendChild(playerScript);
  };

  document.body.appendChild(videoScript);
};

/**
 * Cleans up video player scripts
 */
export const cleanupVideoPlayerScripts = () => {
  const scripts = document.querySelectorAll(
    'script[src*="kolorowey.com"], script[data-playerPro]'
  );
  scripts.forEach((script) => script.remove());
};