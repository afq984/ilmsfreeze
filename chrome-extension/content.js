const manifest = chrome.runtime.getManifest();
const status = document.querySelector("freeze-extension-status");
if (status !== null) {
  status.setAttribute("extensionId", chrome.runtime.id);
  status.setAttribute("extensionVersion", manifest.version);
  status.dispatchEvent(new Event("updated"));
}
