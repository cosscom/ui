import type { Metadata } from "next";
import { LandingRuntime } from "@/components/landing/runtime";
import { appConfig, basePath as base } from "@/lib/config";

export const metadata: Metadata = {
  alternates: { canonical: appConfig.url },
};

const links = appConfig.links;

// The landing page, as it was at berthd.app: the harbour, the pitch at its
// foot, and the film's story in six chapters, each with one of the app's
// line scenes and a short loop of the real app. Its styles are
// app/landing.css; what moves on it (the dithered harbour, the night loop,
// the chapters' loops and scenes, and the copy button)
// is public/assets/*.js, brought in by components/landing/runtime.tsx
// once the page has painted. The launch film's lightbox returns once the
// film is hosted.
export default function Page() {
  return (
    <main className="shipyard-landing" data-base={base}>
      <LandingRuntime base={base} />
      <div className="hero" id="top">
        {/* The harbour: the painting, dithered and dissolving into the page by
             assets/harbour.js; the plain painting until then, or without it. */}
        {/* At night (dark mode, or the laptop closed) the harbour comes alive:
             assets/hero-loop.js brings in the film's loop after the page has
             loaded, from its first frame, dissolving into the page the same way.
             Not for reduced motion or Save-Data. */}
        <div
          className="harbour"
          data-harbour
          data-day={`${base}/assets/harbour/day.webp`}
          data-night={`${base}/assets/harbour/night.webp`}
          data-loop={`${base}/assets/film/hero-loop.mp4 ${base}/assets/film/hero-loop.webm`}
          data-loop-poster={`${base}/assets/film/hero-loop-poster.webp`}
          aria-hidden="true"
        >
          <picture>
            <source
              media="(prefers-color-scheme: dark)"
              srcSet={`${base}/assets/harbour/night.webp`}
            />
            <img
              src={`${base}/assets/harbour/day.webp`}
              alt=""
              width="1672"
              height="941"
              fetchPriority="high"
            />
          </picture>
          <canvas />
          <div className="beam" />
        </div>
        <div className="hero-copy">
          <h1>Agents that keep working when your laptop sleeps.</h1>
          <p className="lede">
            Shipyard runs Claude Code, Codex and other coding agents on your own
            dev boxes. Work with them from your laptop; close it, and they keep
            going.
          </p>
          <div className="actions">
            <a className="btn primary" href={links.macDmg}>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 2.5 V10.5 M4.5 7 L8 10.5 L11.5 7 M3 13.5 H13" />
              </svg>
              Download for macOS
            </a>
            <a className="btn" href={links.demo}>
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M5 3.4v9.2a.6.6 0 0 0 .9.5l7.3-4.6a.6.6 0 0 0 0-1L5.9 2.9a.6.6 0 0 0-.9.5Z" />
              </svg>
              Try the live demo
            </a>
          </div>
          <p className="note">
            For Apple silicon and Intel Macs, signed and notarized. Open source.{" "}
            <a href={`${base}/docs/getting-started/install`}>
              How to get started
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 3.5 L10.5 8 L6 12.5" />
              </svg>
            </a>
          </p>
          <p className="note linux-alpha">
            Linux (alpha): <a href={links.linuxAppImage}>AppImage</a> ·{" "}
            <a href={links.linuxDeb}>.deb</a>, x86-64.
          </p>
        </div>
      </div>

      {/* Below the harbour, the film's story in six chapters: each a line scene
           with its one amber light, the film's caption, a few words, and a short
           muted loop of the real app. The loops (assets/loops/, cut by
           scripts/loops.sh) load and play only near the viewport; their posters
           stand in until then, and for good under reduced motion or Save-Data
           (assets/clips.js). */}
      <section className="chapter ruled" id="start" aria-labelledby="start-h">
        <div className="rule marks" aria-hidden="true" />
        <div className="wrap">
          <div className="chapter-head">
            <div className="chapter-mark">
              <span className="scene" data-scene="setting-out" />
              <span className="kicker">Start</span>
            </div>
            <h2 id="start-h">One line. A worktree, a box, an agent.</h2>
            <p>
              Press ⌘N and say what you want. Shipyard makes a worktree on the
              box you choose and starts Claude Code, Codex or another agent in
              it, with its dev server in a tab of its own.
            </p>
          </div>
          <figure className="clip" data-clip={`${base}/assets/loops/start.mp4`}>
            <img
              data-src={`${base}/assets/loops/start.webp`}
              width="1600"
              height="1000"
              alt="Shipyard's New task dialog over the harbour home: a one-line task, the project, the box and Claude Code chosen, and the agent's workspace opening."
              decoding="async"
            />
            <noscript>
              <img
                src={`${base}/assets/loops/start.webp`}
                width="1600"
                height="1000"
                alt=""
                loading="lazy"
              />
            </noscript>
          </figure>
        </div>
      </section>

      <section className="chapter ruled" id="work" aria-labelledby="work-h">
        <div className="rule marks" aria-hidden="true" />
        <div className="wrap">
          <div className="chapter-head">
            <div className="chapter-mark">
              <span className="scene" data-scene="signal" />
              <span className="kicker">Watch it work</span>
            </div>
            <h2 id="work-h">Every step, as it happens.</h2>
            <p>
              Commands and reads fold into a line, and edits arrive as diffs.
              When Claude asks, you answer in place; what it publishes is one
              click away.
            </p>
          </div>
          <div className="views" data-views>
            <div className="seg" role="group" aria-label="What the agent shows">
              <button type="button" aria-pressed="true" data-show="steps">
                Steps and diffs
              </button>
              <button type="button" aria-pressed="false" data-show="ask">
                Questions
              </button>
              <button type="button" aria-pressed="false" data-show="artifacts">
                Artifacts
              </button>
            </div>
            <div className="stack">
              <figure
                className="clip"
                data-clip={`${base}/assets/loops/steps.mp4`}
                data-view="steps"
              >
                <img
                  data-src={`${base}/assets/loops/steps.webp`}
                  width="1600"
                  height="1000"
                  alt="An agent's chat: a live step line while it runs the payment tests, then the edit to webhook.ts as a diff."
                  decoding="async"
                />
                <noscript>
                  <img
                    src={`${base}/assets/loops/steps.webp`}
                    width="1600"
                    height="1000"
                    alt=""
                    loading="lazy"
                  />
                </noscript>
              </figure>
              <figure
                className="clip"
                data-clip={`${base}/assets/loops/ask.mp4`}
                data-view="ask"
                aria-hidden="true"
              >
                <img
                  data-src={`${base}/assets/loops/ask.webp`}
                  width="1600"
                  height="1000"
                  alt="Claude asks three questions in a form inside the chat; each answer is picked in place and submitted."
                  decoding="async"
                />
                <noscript>
                  <img
                    src={`${base}/assets/loops/ask.webp`}
                    width="1600"
                    height="1000"
                    alt=""
                    loading="lazy"
                  />
                </noscript>
              </figure>
              <figure
                className="clip"
                data-clip={`${base}/assets/loops/artifacts.mp4`}
                data-view="artifacts"
                aria-hidden="true"
              >
                <img
                  data-src={`${base}/assets/loops/artifacts.webp`}
                  width="1600"
                  height="1000"
                  alt="The artifacts an agent published, listed in its chat, and the artifacts menu that finds each one."
                  decoding="async"
                />
                <noscript>
                  <img
                    src={`${base}/assets/loops/artifacts.webp`}
                    width="1600"
                    height="1000"
                    alt=""
                    loading="lazy"
                  />
                </noscript>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="chapter ruled" id="side" aria-labelledby="side-h">
        <div className="rule marks" aria-hidden="true" />
        <div className="wrap">
          <div className="chapter-head">
            <div className="chapter-mark">
              <span className="scene" data-scene="rafted" />
              <span className="kicker">Side by side</span>
            </div>
            <h2 id="side-h">Two worktrees. One view.</h2>
            <p>
              Two worktrees share the tab strip as groups, each in its own
              colour, and split into one tab. Compare puts them in mirrored
              lanes: their chats, their diffs, their terminals.
            </p>
          </div>
          <div className="views" data-views>
            <div className="seg" role="group" aria-label="Side by side">
              <button type="button" aria-pressed="true" data-show="groups">
                Tab groups
              </button>
              <button type="button" aria-pressed="false" data-show="compare">
                Compare
              </button>
            </div>
            <div className="stack">
              <figure
                className="clip"
                data-clip={`${base}/assets/loops/groups.mp4`}
                data-view="groups"
              >
                <img
                  data-src={`${base}/assets/loops/groups.webp`}
                  width="1600"
                  height="1000"
                  alt="Two worktrees' tabs grouped in one strip, then split side by side: search-perf's artifacts on the left, checkout-fix asking to run a command on the right."
                  decoding="async"
                />
                <noscript>
                  <img
                    src={`${base}/assets/loops/groups.webp`}
                    width="1600"
                    height="1000"
                    alt=""
                    loading="lazy"
                  />
                </noscript>
              </figure>
              <figure
                className="clip"
                data-clip={`${base}/assets/loops/compare.mp4`}
                data-view="compare"
                aria-hidden="true"
              >
                <img
                  data-src={`${base}/assets/loops/compare.webp`}
                  width="1600"
                  height="1000"
                  alt="A Compare tab: checkout-fix and search-perf side by side in mirrored lanes, their chats, then their branches' diffs, then their agents' terminals."
                  decoding="async"
                />
                <noscript>
                  <img
                    src={`${base}/assets/loops/compare.webp`}
                    width="1600"
                    height="1000"
                    alt=""
                    loading="lazy"
                  />
                </noscript>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="chapter ruled" id="yours" aria-labelledby="yours-h">
        <div className="rule marks" aria-hidden="true" />
        <div className="wrap">
          <div className="chapter-head">
            <div className="chapter-mark">
              <span className="scene" data-scene="anchor" />
              <span className="kicker">Make it yours</span>
            </div>
            <h2 id="yours-h">Your themes. Your harbour.</h2>
            <p>
              Shipyard's own themes and nineteen ports of favourites, Dracula to
              Rosé Pine, carried into the terminal and every diff. A chat
              background of your own, and ⌘+ when you want it larger.
            </p>
          </div>
          <figure
            className="clip"
            data-clip={`${base}/assets/loops/themes.mp4`}
          >
            <img
              data-src={`${base}/assets/loops/themes.webp`}
              width="1600"
              height="1000"
              alt="The same chat and diff in Shipyard Dark, Dracula, Catppuccin Latte and Tokyo Night, then with a harbour as its chat background."
              decoding="async"
            />
            <noscript>
              <img
                src={`${base}/assets/loops/themes.webp`}
                width="1600"
                height="1000"
                alt=""
                loading="lazy"
              />
            </noscript>
          </figure>
        </div>
      </section>

      <section
        className="chapter after-dark"
        id="night"
        aria-labelledby="night-h"
      >
        <div className="night-in" aria-hidden="true" />
        <div className="night-body">
          <div className="wrap">
            <div className="chapter-head">
              <div className="chapter-mark">
                <span className="scene" data-scene="lighthouse" />
                <span className="kicker">It keeps going</span>
              </div>
              <h2 id="night-h">Close the laptop. They keep going.</h2>
              <p>
                The agents run on your boxes, not on your laptop. Close it and
                they keep working; open it in the morning and what they did is
                there.
              </p>
            </div>
            <figure
              className="clip"
              data-clip={`${base}/assets/film/hero-loop.mp4`}
            >
              <img
                data-src={`${base}/assets/film/hero-loop-poster.webp`}
                width="1600"
                height="900"
                alt="The harbour at night: the lighthouse turning, and a green light on the water for each box still working."
                decoding="async"
              />
              <noscript>
                <img
                  src={`${base}/assets/film/hero-loop-poster.webp`}
                  width="1600"
                  height="900"
                  alt=""
                  loading="lazy"
                />
              </noscript>
            </figure>
            <p
              className="boxes"
              aria-label="Two boxes online, three agents working"
            >
              <span>
                <i />
                devl · 2 agents working
              </span>
              <span>
                <i />
                gpu · 1 agent working
              </span>
            </p>
          </div>
        </div>
        <div className="night-out" aria-hidden="true" />
      </section>

      <section
        className="chapter install-ch"
        id="install-now"
        aria-labelledby="install-h"
      >
        <div className="wrap">
          <div className="chapter-mark centered">
            <span className="scene dawn" data-scene="dawn" />
            <span className="kicker">Install</span>
          </div>
          <h2 id="install-h">Your agents, docked.</h2>
          <p className="lede-2">
            The app for your Mac, and berthd on each box. Free and open source.
          </p>
          <div className="actions">
            <a className="btn primary" href={links.macDmg}>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 2.5 V10.5 M4.5 7 L8 10.5 L11.5 7 M3 13.5 H13" />
              </svg>
              Download for macOS
            </a>
          </div>
          <p className="note linux-alpha">
            Linux (alpha): <a href={links.linuxAppImage}>AppImage</a> ·{" "}
            <a href={links.linuxDeb}>.deb</a>, x86-64.
          </p>
          <div className="install">
            <span className="install-label">On your box</span>
            <code id="install-2">
              curl -fsSL https://berthd.app/install | sh
            </code>
            <button className="copy" type="button" data-copy="install-2">
              Copy
            </button>
          </div>
          <nav className="ends" aria-label="More">
            <a href={`${base}/docs/getting-started/install`}>
              Read the docs
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 3.5 L10.5 8 L6 12.5" />
              </svg>
            </a>
            <a href="https://github.com/cosscom/shipyard">
              GitHub
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 3.5 L10.5 8 L6 12.5" />
              </svg>
            </a>
            <a href={links.demo}>
              Try the live demo
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 3.5 L10.5 8 L6 12.5" />
              </svg>
            </a>
          </nav>
        </div>
      </section>
    </main>
  );
}
