// The chapters' loops and line scenes.
//
// A [data-clip] figure holds its poster (an <img> with its size, so nothing
// moves; its src waits for the page to load, so it never competes with the
// hero). Near the viewport it gets its muted loop, which plays while in view
// and pauses out of it, when the tab is hidden, or behind the film. Under
// reduced motion or Save-Data the posters stay, and no video loads.
//
// [data-views] is a switch over several loops: each plays once and hands on to
// the next, until a choice is made, after which the chosen one loops.
//
// The line scenes come in after the page has loaded, and pause offscreen and
// while the tab is hidden, as in the app.
(() => {
  const root = document.documentElement;
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const saveData = navigator.connection?.saveData === true;

  // The line scenes, into their slots (assets/scenes.json, from the app's
  // drawings by scripts/scenes.mjs).
  const slots = document.querySelectorAll("[data-scene]");
  if (slots.length)
    fetch(
      `${document.querySelector("[data-base]")?.getAttribute("data-base") ?? ""}/assets/scenes.json`,
    )
      .then((r) => r.json())
      .then((scenes) => {
        const io =
          "IntersectionObserver" in window &&
          new IntersectionObserver((entries) => {
            for (const e of entries)
              e.target.toggleAttribute("data-off", !e.isIntersecting);
          });
        for (const slot of slots) {
          if (!scenes[slot.dataset.scene]) continue;
          slot.innerHTML = scenes[slot.dataset.scene];
          if (io) io.observe(slot.firstElementChild);
        }
      })
      .catch(() => {});
  const hidden = () =>
    root.toggleAttribute("data-berth-hidden", document.hidden);
  document.addEventListener("visibilitychange", hidden);
  hidden();

  const figs = [...document.querySelectorAll("[data-clip]")];
  if (!figs.length || !("IntersectionObserver" in window)) return;
  const state = new Map(
    figs.map((f) => [f, { near: false, seen: false, video: null }]),
  );
  const film = document.getElementById("film");

  const make = (fig) => {
    const s = state.get(fig);
    const v = document.createElement("video");
    for (const a of [
      "muted",
      "playsinline",
      "disablepictureinpicture",
      "disableremoteplayback",
    ])
      v.setAttribute(a, "");
    v.muted = v.defaultMuted = v.playsInline = true;
    v.loop = !fig.closest("[data-views]:not([data-chosen])");
    v.preload = "auto";
    v.tabIndex = -1;
    v.setAttribute("aria-hidden", "true");
    v.poster = fig.querySelector("img").src;
    v.src = fig.dataset.clip;
    v.addEventListener("playing", () => fig.classList.add("playing"));
    v.addEventListener("ended", () =>
      fig.dispatchEvent(new Event("clip:ended", { bubbles: true })),
    );
    v.addEventListener("error", () => {
      v.remove();
      s.video = null;
      s.failed = true;
    });
    fig.append(v);
    s.video = v;
  };

  // No loop loads before the page has, so none competes with the hero.
  let ready = false;
  const update = (fig) => {
    const s = state.get(fig);
    // Its poster, once the page has loaded and it's near.
    const img = fig.querySelector("img[data-src]");
    if (img && ready && (s.near || s.seen)) {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    }
    const on =
      ready &&
      !still.matches &&
      !saveData &&
      !s.failed &&
      !fig.hasAttribute("aria-hidden");
    if (on && (s.near || s.seen) && !s.video) make(fig);
    if (!s.video) return;
    if (on && s.seen && !document.hidden && !film?.open)
      s.video.play().catch(() => {});
    else s.video.pause();
  };
  const all = () => figs.forEach(update);

  // Near: load. In view: play.
  const nearIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        state.get(e.target).near = e.isIntersecting;
        update(e.target);
      }
    },
    { rootMargin: "400px 0px" },
  );
  const seenIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        state.get(e.target).seen = e.isIntersecting;
        update(e.target);
      }
    },
    { threshold: 0.2 },
  );
  for (const f of figs) {
    nearIO.observe(f);
    seenIO.observe(f);
  }
  const go = () => {
    ready = true;
    all();
  };
  const idle = () =>
    window.requestIdleCallback
      ? requestIdleCallback(go, { timeout: 2000 })
      : setTimeout(go, 300);
  if (document.readyState === "complete") idle();
  else addEventListener("load", idle, { once: true });
  document.addEventListener("visibilitychange", all);
  still.addEventListener("change", all);
  film?.addEventListener("close", all);
  document
    .querySelector("[data-film]")
    ?.addEventListener("click", () => setTimeout(all));

  // The switch over the agent's views.
  for (const views of document.querySelectorAll("[data-views]")) {
    const buttons = [...views.querySelectorAll("[data-show]")];
    const show = (name, chosen) => {
      if (chosen) {
        views.setAttribute("data-chosen", "");
        for (const f of views.querySelectorAll("[data-clip]")) {
          const v = state.get(f).video;
          if (v) v.loop = true;
        }
      }
      for (const b of buttons)
        b.setAttribute("aria-pressed", String(b.dataset.show === name));
      for (const f of views.querySelectorAll("[data-view]")) {
        const on = f.dataset.view === name;
        f.toggleAttribute("aria-hidden", !on);
        const v = state.get(f).video;
        if (on && v) v.currentTime = 0;
      }
      all();
    };
    for (const b of buttons)
      b.addEventListener("click", () => show(b.dataset.show, true));
    // Arrow keys move along the switch.
    views.querySelector(".seg").addEventListener("keydown", (e) => {
      const i = buttons.indexOf(document.activeElement);
      if (i < 0 || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      const next =
        buttons[
          (i + (e.key === "ArrowRight" ? 1 : buttons.length - 1)) %
            buttons.length
        ];
      next.focus();
      next.click();
      e.preventDefault();
    });
    views.addEventListener("clip:ended", () => {
      if (views.hasAttribute("data-chosen")) return;
      const i = buttons.findIndex(
        (b) => b.getAttribute("aria-pressed") === "true",
      );
      show(buttons[(i + 1) % buttons.length].dataset.show, false);
    });
  }
})();
