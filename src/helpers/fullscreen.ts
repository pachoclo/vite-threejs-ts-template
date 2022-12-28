// @ts-nocheck
export function toggleFullScreen(canvas: HTMLElement) {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else if (!document.fullscreenElement && canvas.requestFullscreen) {
    canvas.requestFullscreen()
  }

  // 👇 safari -> doesn't support the standard yet
  else if (document.webkitFullscreenElement) {
    document.webkitExitFullscreen()
  } else if (!document.webkitFullscreenElement && canvas.webkitRequestFullscreen) {
    canvas.webkitRequestFullscreen()
  }
}
