// The harbour at night, alive: the launch film's seamless loop (the night
// painting with the agents' lights on the water), in the hero's band.
//
// Only at night (the site's dark theme); the day keeps the
// dithered painting. Nothing loads until the page has, and nothing at all for
// reduced motion or Save-Data: the still harbour stays. The loop comes in from
// its first frame (the poster) over the drawn harbour, in the same box, so
// nothing moves; it dissolves into the page through the same 2 px Bayer dots
// as assets/harbour.js draws, and pauses when hidden or scrolled away.
//
// Its frames are drawn on a canvas, cropped as the painting is, from a video
// kept a pixel wide under it: a canvas is never the page's largest paint, so
// the loop arriving late can't make the hero's LCP late.
//
//   data-loop          the loop's sources, in order (MP4, then WebM)
//   data-loop-poster   its first frame
(() => {
  const band = document.querySelector(".hero [data-harbour][data-loop]");
  if (!band || !("IntersectionObserver" in window)) return;
  const root = document.documentElement;
  const dark = matchMedia("(prefers-color-scheme: dark)");
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const night = () => root.classList.contains("dark");
  const saveData = navigator.connection?.saveData === true;
  // The same matrix, cell, fade and framing as the drawn harbour, so the dots
  // and the lighthouse line up.
  const CELL = 2;
  const FADE = 0.42;
  const POSITION = 0.42;
  const BAYER8 = [
    0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36,
    14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41,
    51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55,
    23, 61, 29, 53, 21,
  ].map((v) => (v + 0.5) / 64);

  let started = false;
  let loop = null;
  let video = null;
  let canvas = null;
  let ctx = null;
  let poster = null;
  let shown = false;
  let inView = true;
  let maskUrl = "";
  let maskSize = "";
  let timer = 0;
  let frame = 0;

  const wanted = () => started && night() && !still.matches && !saveData;

  // A frame (or the poster) over the whole canvas, as object-fit: cover, at
  // the painting's position: the lighthouse kept in view on a narrow screen.
  const paint = (src, sw, sh) => {
    if (!ctx || !sw || !sh) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const s = Math.max(cw / sw, ch / sh);
    const across = band.clientWidth < 700 ? 0.08 : 0.5;
    ctx.drawImage(
      src,
      (cw - sw * s) * across,
      (ch - sh * s) * POSITION,
      sw * s,
      sh * s,
    );
  };
  const paintNow = () => {
    if (video?.readyState >= 2)
      paint(video, video.videoWidth, video.videoHeight);
    else if (poster?.naturalWidth)
      paint(poster, poster.naturalWidth, poster.naturalHeight);
  };

  // Each new frame of the video, as it's shown.
  const tick = () => {
    paint(video, video.videoWidth, video.videoHeight);
    frame = video.requestVideoFrameCallback
      ? video.requestVideoFrameCallback(tick)
      : requestAnimationFrame(tick);
  };
  const stopTicking = () => {
    if (!frame) return;
    if (video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(frame);
    else cancelAnimationFrame(frame);
    frame = 0;
  };

  // The canvas at the band's size (up to 2 device pixels a CSS pixel), and the
  // dissolve as an alpha mask: the lower part of the band, row by row, keeps
  // fewer of its 2 px dots.
  const size = () => {
    const W = band.clientWidth;
    const H = band.clientHeight;
    const key = `${W}x${H}`;
    if (!loop || !W || !H || key === maskSize) return;
    maskSize = key;
    const dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    paintNow();
    const m = document.createElement("canvas");
    m.width = W;
    m.height = H;
    const mctx = m.getContext("2d");
    const img = mctx.createImageData(W, H);
    const d = img.data;
    const h = Math.ceil(H / CELL);
    const foot = h * FADE;
    for (let Y = 0; Y < H; Y++) {
      const y = Math.floor(Y / CELL);
      let keep = y > h - foot ? 1 - (y - (h - foot)) / foot : 1;
      keep = keep * keep * (3 - 2 * keep);
      const rowB = ((y + 3) & 7) * 8;
      for (let X = 0; X < W; X++) {
        if (BAYER8[rowB + ((Math.floor(X / CELL) + 5) & 7)] < keep)
          d[(Y * W + X) * 4 + 3] = 255;
      }
    }
    mctx.putImageData(img, 0, 0);
    m.toBlob((blob) => {
      if (!blob || !loop) return;
      const old = maskUrl;
      maskUrl = URL.createObjectURL(blob);
      loop.style.setProperty("--mask", `url("${maskUrl}")`);
      if (old) setTimeout(() => URL.revokeObjectURL(old), 1000);
    });
  };

  const build = () => {
    loop = document.createElement("div");
    loop.className = "loop";
    video = document.createElement("video");
    // Muted, inline and looping, set as properties too, so it may autoplay.
    for (const a of [
      "muted",
      "playsinline",
      "loop",
      "disablepictureinpicture",
      "disableremoteplayback",
    ])
      video.setAttribute(a, "");
    video.muted = video.defaultMuted = video.playsInline = video.loop = true;
    video.preload = "auto";
    video.tabIndex = -1;
    for (const src of band.dataset.loop.split(/\s+/)) {
      const s = document.createElement("source");
      s.src = src;
      s.type = src.endsWith(".webm") ? "video/webm" : "video/mp4";
      video.append(s);
    }
    video
      .querySelector("source:last-of-type")
      .addEventListener("error", remove);
    video.addEventListener("playing", () => {
      stopTicking();
      tick();
    });
    video.addEventListener("pause", stopTicking);
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    loop.append(video, canvas);
    band.insertBefore(loop, band.querySelector(".beam"));
    size();
    // Shown once its first frame is in hand (the poster), so it never flashes
    // empty; the drawn harbour stays under it until then.
    poster = new Image();
    poster.src = band.dataset.loopPoster;
    poster
      .decode()
      .then(() => {
        if (video.readyState < 2) paintNow();
      })
      .catch(() => {})
      .then(() => {
        shown = true;
        sync();
      });
  };

  // A loop that can't play gives the harbour back.
  const remove = () => {
    band.classList.remove("live");
    stopTicking();
    loop?.remove();
    loop = video = canvas = ctx = null;
    started = false;
  };

  const sync = () => {
    if (!wanted()) {
      band.classList.remove("live");
      video?.pause();
      return;
    }
    if (!video) return build();
    band.classList.toggle("live", shown);
    if (inView && !document.hidden && !document.getElementById("film")?.open)
      video.play().catch(() => {});
    else video.pause();
  };

  new IntersectionObserver((entries) => {
    inView = entries.some((e) => e.isIntersecting);
    sync();
  }).observe(band);
  new ResizeObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(size, 120);
  }).observe(band);
  dark.addEventListener("change", sync);
  still.addEventListener("change", sync);
  addEventListener("berth:theme", sync);
  document.addEventListener("visibilitychange", sync);
  // Rests behind the film.
  document.getElementById("film")?.addEventListener("close", sync);
  document
    .querySelector("[data-film]")
    ?.addEventListener("click", () => setTimeout(sync));

  // After the page has loaded, when the main thread is free.
  const start = () => {
    started = true;
    sync();
  };
  const idle = () =>
    window.requestIdleCallback
      ? requestIdleCallback(start, { timeout: 2000 })
      : setTimeout(start, 300);
  if (document.readyState === "complete") idle();
  else addEventListener("load", idle, { once: true });
})();
