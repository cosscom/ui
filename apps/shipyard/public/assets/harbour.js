// The harbour, drawn as the app's Labs home draws it: the painting with a
// halftone grain (an ordered Bayer dither of its lightness, strongest on
// edges and in gradients), dissolving dot by dot into the page. Night in dark
// mode. Each band renders once per size on a small canvas, one dot per 2 CSS
// px, scaled up with hard pixels; nothing runs in between.
//
// A band is any [data-harbour] element with a <canvas>:
//   data-day, data-night   the paintings
//   data-fade              where it dissolves: "bottom" (default), "top" or "both"
//   data-night-only        always the night painting (the closing harbour)
//   data-position          the painting's vertical position, 0 to 1 (0.42)
//   data-lazy              drawn when it nears the viewport, not before
// Without this script the plain painting shows, faded by CSS.
(() => {
  const bands = [...document.querySelectorAll("[data-harbour]")];
  if (!bands.length) return;
  const CELL = 2;
  const LEVELS = 6;
  const FADE = 0.42;
  const BAYER8 = [
    0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36,
    14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41,
    51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55,
    23, 61, 29, 53, 21,
  ].map((v) => (v + 0.5) / 64);
  const dark = matchMedia("(prefers-color-scheme: dark)");
  // Night is the site's theme (the "dark" class on <html>, by the header's
  // switch or the system); the page says when it changes with a berth:theme
  // event.
  const pageNight = () => document.documentElement.classList.contains("dark");
  // Where the lighthouse's lamp is in the painting, as a fraction of it.
  const LAMP = [0.094, 0.457];

  const hex = (s) => {
    s = s.trim();
    const m = s.match(/^#([\da-f]{6})$/i);
    if (m)
      return [0, 2, 4].map((i) => Number.parseInt(m[1].slice(i, i + 2), 16));
    return (s.match(/[\d.]+/g) ?? [0, 0, 0]).slice(0, 3).map(Number);
  };

  for (const band of bands) {
    const canvas = band.querySelector("canvas");
    const beam = band.querySelector(".beam");
    const fade = band.dataset.fade ?? "bottom";
    const nightOnly = "nightOnly" in band.dataset;
    const position = Number(band.dataset.position ?? 0.42);
    const isNight = () => nightOnly || pageNight();
    let size = "";
    let timer = 0;
    let pending = false;
    let near = !("lazy" in band.dataset);

    const draw = async (force) => {
      if (!near) return;
      if (document.hidden) return void (pending = true);
      pending = false;
      const w = Math.ceil(band.clientWidth / CELL);
      const h = Math.ceil(band.clientHeight / CELL);
      const night = isNight();
      const key = `${w}x${h}${night}`;
      if (!w || !h || (key === size && !force)) return;
      const img = new Image();
      img.src = night ? band.dataset.night : band.dataset.day;
      try {
        await img.decode();
      } catch {
        return;
      }
      size = key;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${w * CELL}px`;
      canvas.style.height = `${h * CELL}px`;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      // Drawn small, then up: the brushwork softens to its forms, so the
      // grain is the dither's, not the paint's.
      const soft = document.createElement("canvas");
      soft.width = Math.max(1, Math.round(w * 0.6));
      soft.height = Math.max(1, Math.round(h * 0.6));
      const sctx = soft.getContext("2d");
      sctx.imageSmoothingQuality = "high";
      // On a narrow screen the lighthouse, at the left, stays in view.
      const across = Number(
        band.dataset.across ?? (band.clientWidth < 700 ? 0.08 : 0.5),
      );
      sctx.drawImage(
        img,
        (w - dw) * across * 0.6,
        (h - dh) * position * 0.6,
        dw * 0.6,
        dh * 0.6,
      );
      if (beam) {
        beam.style.left = `${((w - dw) * across + dw * LAMP[0]) * CELL}px`;
        beam.style.top = `${((h - dh) * position + dh * LAMP[1]) * CELL}px`;
      }
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(soft, 0, 0, w, h);
      soft.width = soft.height = 0;
      const frame = ctx.getImageData(0, 0, w, h);
      const bg = hex(
        getComputedStyle(band).getPropertyValue("--bg") ||
          getComputedStyle(document.body).backgroundColor,
      );
      dither(frame, night ? 0.3 : 0.04, bg, fade);
      ctx.putImageData(frame, 0, 0);
      band.classList.add("drawn");
      band.dispatchEvent(
        new CustomEvent("harbour:drawn", {
          detail: {
            w: w * CELL,
            h: h * CELL,
            dw: dw * CELL,
            dh: dh * CELL,
            x: (w - dw) * across * CELL,
            y: (h - dh) * position * CELL,
          },
        }),
      );
    };

    new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(draw, 120);
    }).observe(band);
    if (!near)
      new IntersectionObserver(
        (entries, io) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io.disconnect();
          near = true;
          draw();
        },
        { rootMargin: "600px 0px" },
      ).observe(band);
    if (!nightOnly) {
      dark.addEventListener("change", () => draw(true));
      addEventListener("berth:theme", () => draw(true));
    }
    document.addEventListener(
      "visibilitychange",
      () => pending && !document.hidden && draw(),
    );
    draw();
  }

  function dither(frame, mute, bg, fade) {
    const { data, width: w, height: h } = frame;
    const L = LEVELS - 1;
    const lum = new Float32Array(w * h);
    for (let i = 0, p = 0; p < w * h; i += 4, p++) {
      data[i] += (bg[0] - data[i]) * mute;
      data[i + 1] += (bg[1] - data[i + 1]) * mute;
      data[i + 2] += (bg[2] - data[i + 2]) * mute;
      lum[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
    // Fading both ways, the top takes most of it and the foot a little.
    const top = h * (fade === "both" ? 0.36 : FADE);
    const foot = h * (fade === "both" ? 0.2 : FADE);
    for (let y = 0; y < h; y++) {
      // How much of this row stays: 1, then down to 0 where it dissolves.
      let keep = 1;
      if ((fade === "bottom" || fade === "both") && y > h - foot)
        keep = Math.min(keep, 1 - (y - (h - foot)) / foot);
      if ((fade === "top" || fade === "both") && y < top)
        keep = Math.min(keep, y / top);
      keep = keep * keep * (3 - 2 * keep);
      const row = (y & 7) * 8;
      const rowB = ((y + 3) & 7) * 8;
      const up = Math.max(0, y - 1) * w;
      const down = Math.min(h - 1, y + 1) * w;
      for (let x = 0; x < w; x++) {
        const p = y * w + x;
        const i = p * 4;
        if (BAYER8[rowB + ((x + 5) & 7)] >= keep) {
          data[i + 3] = 0;
          continue;
        }
        const Y = lum[p];
        const edge =
          Math.abs(
            lum[y * w + Math.min(w - 1, x + 1)] -
              lum[y * w + Math.max(0, x - 1)],
          ) + Math.abs(lum[down + x] - lum[up + x]);
        const amount = Math.min(1, 0.35 + edge / 40);
        const d =
          ((Math.floor((Y / 255) * L + BAYER8[row + (x & 7)]) / L) * 255 - Y) *
          amount;
        data[i] += d;
        data[i + 1] += d;
        data[i + 2] += d;
        data[i + 3] = 255;
      }
    }
  }
})();
