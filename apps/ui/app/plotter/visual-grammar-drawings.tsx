// Generated from skills/plotter/references/grammar/*.svg by scripts/build-plotter-grammar.py.
import { type ReactNode, useId } from "react";
import type { visualGrammarEntries } from "./visual-grammar-content";

function GrammarArrows() {
  return (
    <svg
      width={"560"}
      height={"440"}
      viewBox={"0 0 560 440"}
      fill={"none"}
      stroke={"currentColor"}
      strokeLinecap={"butt"}
      strokeLinejoin={"round"}
      style={{
        fontFamily: "Cal Sans,sans-serif",
        fontOpticalSizing: "auto",
        fontSynthesis: "none",
        fontVariationSettings: "'GEOM' 25",
        fontWeight: "400",
      }}
      aria-hidden={"true"}
      focusable={"false"}
    >
      <path
        d={"M200 260H392A24 24 0 0 1 392 308H200A24 24 0 0 1 200 260Z"}
        strokeWidth={"0.95"}
        opacity={"1"}
      />
      <circle
        cx={"200"}
        cy={"284"}
        r={"9"}
        strokeWidth={"0.95"}
        opacity={"1"}
      />
      <circle
        cx={"392"}
        cy={"284"}
        r={"9"}
        strokeWidth={"0.95"}
        opacity={"1"}
      />
      <path
        d={"M176 252V92A24 24 0 0 1 224 92V252"}
        strokeWidth={"0.65"}
        opacity={"0.45"}
        strokeDasharray={"3 5"}
      />
      <circle
        cx={"200"}
        cy={"92"}
        r={"9"}
        strokeWidth={"0.65"}
        opacity={"0.45"}
        strokeDasharray={"3 5"}
      />
      <path
        d={
          "M200 104V244M188 92H196M204 92H236M140 284H164M236 284H380M404 284H428"
        }
        strokeWidth={"0.6"}
        opacity={"0.24"}
        strokeDasharray={"8 3 1 3"}
      />
      <circle
        cx={"200"}
        cy={"284"}
        r={"2"}
        strokeWidth={"0.65"}
        opacity={"0.5"}
      />
      <path
        d={"M200 252V220A64 64 0 0 1 264 284"}
        strokeWidth={"0.65"}
        opacity={"0.5"}
      />
      <text
        x={"240"}
        y={"253"}
        textAnchor={"middle"}
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"10"}
        opacity={"0.5"}
      >
        {"90°"}
      </text>
      <path
        d={"M200 68A216 216 0 0 1 416 284"}
        strokeWidth={"0.65"}
        opacity={"0.5"}
        strokeDasharray={"4 6"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M204.242641 63.757359L200 68L204.242641 72.242641"}
        strokeWidth={"0.65"}
        opacity={"0.5"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M352.735065 131.264935L376 112H400"}
        strokeWidth={"0.65"}
        opacity={"0.5"}
      />
      <text
        x={"408"}
        y={"116"}
        textAnchor={"start"}
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"11"}
        opacity={"0.72"}
      >
        {"Quarter turn"}
      </text>
      <text
        x={"156"}
        y={"166"}
        textAnchor={"end"}
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"11"}
        opacity={"0.72"}
      >
        {"Proposed"}
      </text>
      <path d={"M164 162H172"} strokeWidth={"0.65"} opacity={"0.5"} />
      <text
        x={"308"}
        y={"243"}
        textAnchor={"middle"}
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"11"}
        opacity={"0.72"}
      >
        {"Current"}
      </text>
      <path
        d={"M200 320V372M392 320V372"}
        strokeWidth={"0.6"}
        opacity={"0.24"}
      />
      <path
        d={"M200 364H280.0M312.0 364H392M196 368L204 360M388 368L396 360"}
        strokeWidth={"0.65"}
        opacity={"0.5"}
      />
      <text
        x={"296.0"}
        y={"367"}
        textAnchor={"middle"}
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"10"}
        opacity={"0.5"}
      >
        {"8u"}
      </text>
      <path
        d={
          "M176 316V324M224 316V324M176 324H188M212 324H224M172 328L180 320M220 328L228 320"
        }
        strokeWidth={"0.65"}
        opacity={"0.5"}
      />
      <text
        x={"200"}
        y={"327"}
        textAnchor={"middle"}
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"10"}
        opacity={"0.5"}
      >
        {"2u"}
      </text>
      <text
        x={"280"}
        y={"411"}
        textAnchor={"middle"}
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"11"}
        opacity={"0.5"}
      >
        {"One pivot · one rigid part"}
      </text>
    </svg>
  );
}

function GrammarCenterlines() {
  const id = useId();
  return (
    <svg
      id={`${id}-plotter-grammar-centerlines`}
      width={"560"}
      height={"440"}
      viewBox={"0 0 560 440"}
      fill={"none"}
      stroke={"currentColor"}
      strokeLinecap={"butt"}
      strokeLinejoin={"round"}
      style={{
        fontFamily: "Cal Sans,sans-serif",
        fontOpticalSizing: "auto",
        fontSynthesis: "none",
        fontVariationSettings: '"GEOM" 25',
      }}
      aria-hidden={"true"}
      focusable={"false"}
    >
      <circle
        cx={"280"}
        cy={"220"}
        r={"132"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.95"}
        strokeOpacity={"1"}
      />
      <circle
        cx={"280"}
        cy={"220"}
        r={"40"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.95"}
        strokeOpacity={"1"}
      />
      <path
        d={
          "M254.118095 123.407417A100 100 0 0 1 305.881905 123.407417A8 8 0 0 1 301.7408 138.862231A84 84 0 0 0 258.2592 138.862231A8 8 0 0 1 254.118095 123.407417Z"
        }
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.95"}
        strokeOpacity={"1"}
      />
      <path
        d={
          "M350.710678 149.289322A100 100 0 0 1 376.592583 194.118095A8 8 0 0 1 361.137769 198.2592A84 84 0 0 0 339.39697 160.60303A8 8 0 0 1 350.710678 149.289322Z"
        }
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.95"}
        strokeOpacity={"1"}
      />
      <path
        d={
          "M376.592583 245.881905A100 100 0 0 1 350.710678 290.710678A8 8 0 0 1 339.39697 279.39697A84 84 0 0 0 361.137769 241.7408A8 8 0 0 1 376.592583 245.881905Z"
        }
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.95"}
        strokeOpacity={"1"}
      />
      <path
        d={
          "M305.881905 316.592583A100 100 0 0 1 254.118095 316.592583A8 8 0 0 1 258.2592 301.137769A84 84 0 0 0 301.7408 301.137769A8 8 0 0 1 305.881905 316.592583Z"
        }
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.95"}
        strokeOpacity={"1"}
      />
      <path
        d={
          "M209.289322 290.710678A100 100 0 0 1 183.407417 245.881905A8 8 0 0 1 198.862231 241.7408A84 84 0 0 0 220.60303 279.39697A8 8 0 0 1 209.289322 290.710678Z"
        }
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.95"}
        strokeOpacity={"1"}
      />
      <path
        d={
          "M183.407417 194.118095A100 100 0 0 1 209.289322 149.289322A8 8 0 0 1 220.60303 160.60303A84 84 0 0 0 198.862231 198.2592A8 8 0 0 1 183.407417 194.118095Z"
        }
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.95"}
        strokeOpacity={"1"}
      />
      <circle
        cx={"280"}
        cy={"220"}
        r={"92"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.6"}
        strokeOpacity={"0.24"}
        strokeDasharray={"8 3 1 3"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M280 62L280 214M280 226L280 378"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.6"}
        strokeOpacity={"0.24"}
        strokeDasharray={"8 3 1 3"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M416.832014 141L285.196152 217M274.803848 223L143.167986 299"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.6"}
        strokeOpacity={"0.24"}
        strokeDasharray={"8 3 1 3"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M416.832014 299L285.196152 223M274.803848 217L143.167986 141"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.6"}
        strokeOpacity={"0.24"}
        strokeDasharray={"8 3 1 3"}
        data-grammar-focus={"true"}
      />
      <circle
        cx={"280"}
        cy={"220"}
        r={"2.5"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M280 165A55 55 0 0 1 327.631397 192.5"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
      />
      <text
        x={"317"}
        y={"163"}
        textAnchor={"middle"}
        fontSize={"10"}
        fill={"currentColor"}
        stroke={"none"}
        opacity={"0.5"}
      >
        {"60°"}
      </text>
      <path
        d={"M452 220L372 220"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
      />
      <path
        d={"M376.242641 224.242641L372 220L376.242641 215.757359"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
      />
      <text
        x={"462"}
        y={"224"}
        textAnchor={"start"}
        fontSize={"11"}
        fill={"currentColor"}
        stroke={"none"}
        opacity={"0.66"}
      >
        {"Pitch"}
      </text>
      <path
        d={"M148 220V380M412 220V380"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.6"}
        strokeOpacity={"0.24"}
      />
      <path
        d={"M148 372H265.0M295.0 372H412"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
      />
      <path
        d={"M144 376l8 -8"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
      />
      <path
        d={"M408 376l8 -8"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
      />
      <text
        x={"280"}
        y={"375"}
        textAnchor={"middle"}
        fontSize={"10"}
        fill={"currentColor"}
        stroke={"none"}
        opacity={"0.5"}
      >
        {"⌀264"}
      </text>
      <text
        x={"280"}
        y={"412"}
        textAnchor={"middle"}
        fontSize={"11"}
        fill={"currentColor"}
        stroke={"none"}
        opacity={"0.66"}
      >
        {"6 equal intervals"}
      </text>
    </svg>
  );
}

function GrammarDimensions() {
  const id = useId();
  return (
    <svg
      id={`${id}-plotter-grammar-dimensions`}
      width={"560"}
      height={"440"}
      viewBox={"0 0 560 440"}
      fill={"none"}
      stroke={"currentColor"}
      strokeLinecap={"butt"}
      strokeLinejoin={"round"}
      style={{
        fontFamily: "Cal Sans,sans-serif",
        fontOpticalSizing: "auto",
        fontSynthesis: "none",
        fontVariationSettings: '"GEOM" 25',
      }}
      aria-hidden={"true"}
      focusable={"false"}
    >
      <path
        d={
          "M120 128H280A120 120 0 0 1 400 248V344H360V248A80 80 0 0 0 280 168H120Z"
        }
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.95"}
        strokeOpacity={"1"}
      />
      <path
        d={"M400 248A120 120 0 1 1 280 128M360 248A80 80 0 1 1 280 168"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.6"}
        strokeOpacity={"0.24"}
      />
      <path
        d={"M280 104V124M280 134V242M280 254V388M136 248H274M286 248H428"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.6"}
        strokeOpacity={"0.24"}
        strokeDasharray={"8 3 1 3"}
      />
      <circle
        cx={"280"}
        cy={"248"}
        r={"2.5"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M120 116V72M400 236V72"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.6"}
        strokeOpacity={"0.24"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M120 80H251.0M269.0 80H400"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M116 84l8 -8"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M396 84l8 -8"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
        data-grammar-focus={"true"}
      />
      <text
        x={"260"}
        y={"83"}
        textAnchor={"middle"}
        fontSize={"10"}
        fill={"currentColor"}
        stroke={"none"}
        opacity={"0.5"}
        data-grammar-focus={"true"}
      >
        {"7u"}
      </text>
      <path
        d={"M360 352V388M400 352V388"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.6"}
        strokeOpacity={"0.24"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M360 380H371.0M389.0 380H400"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M356 384l8 -8"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M396 384l8 -8"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
        data-grammar-focus={"true"}
      />
      <text
        x={"380"}
        y={"383"}
        textAnchor={"middle"}
        fontSize={"10"}
        fill={"currentColor"}
        stroke={"none"}
        opacity={"0.5"}
        data-grammar-focus={"true"}
      >
        {"u"}
      </text>
      <path
        d={"M281.767767 246.232233L364.852814 163.147186"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M358.852814 163.147186L364.852814 163.147186L364.852814 169.147186"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
        data-grammar-focus={"true"}
      />
      <text
        x={"325"}
        y={"195"}
        textAnchor={"middle"}
        fontSize={"10"}
        fill={"currentColor"}
        stroke={"none"}
        opacity={"0.5"}
        transform={"rotate(-45 325 195)"}
        data-grammar-focus={"true"}
      >
        {"R120"}
      </text>
      <text
        x={"176"}
        y={"157"}
        textAnchor={"middle"}
        fontSize={"11"}
        fill={"currentColor"}
        stroke={"none"}
        opacity={"0.66"}
      >
        {"Offset"}
      </text>
      <text
        x={"280"}
        y={"414"}
        textAnchor={"middle"}
        fontSize={"10"}
        fill={"currentColor"}
        stroke={"none"}
        opacity={"0.5"}
      >
        {"u = 40"}
      </text>
      <circle
        cx={"280"}
        cy={"128"}
        r={"2.5"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
      />
      <circle
        cx={"400"}
        cy={"248"}
        r={"2.5"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"0.65"}
        strokeOpacity={"0.5"}
      />
    </svg>
  );
}

function GrammarGrids() {
  return (
    <svg
      width={"560"}
      height={"440"}
      viewBox={"0 0 560 440"}
      fill={"none"}
      stroke={"currentColor"}
      strokeLinecap={"butt"}
      strokeLinejoin={"round"}
      style={{
        fontFamily: "Cal Sans,sans-serif",
        fontOpticalSizing: "auto",
        fontSynthesis: "none",
        fontVariationSettings: "'GEOM' 25",
        fontWeight: "400",
      }}
      aria-hidden={"true"}
      focusable={"false"}
    >
      <path
        d={"M152 64L152 368"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M184 64L184 96"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M184 352L184 360"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M216 64L216 128"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M216 256L216 288"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M216 352L216 360"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M248 64L248 368"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M280 64L280 188"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M280 196L280 368"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M312 64L312 368"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M344 64L344 368"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M376 64L376 368"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M408 64L408 368"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M152 64L408 64"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M176 96L184 96"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M280 96L408 96"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M152 128L216 128"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M280 128L312 128"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M336 128L408 128"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M152 160L408 160"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M152 192L276 192"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M284 192L408 192"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M152 224L408 224"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M152 256L216 256"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M280 256L408 256"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M152 288L216 288"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M280 288L408 288"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M152 320L408 320"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M176 352L184 352"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={"M216 352L408 352"}
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
      />
      <path
        d={
          "M184 96L184 352M184 360L184 368M216 128L216 256M216 288L216 352M216 360L216 368M280 188L280 196M152 96L176 96M184 96L280 96M216 128L280 128M312 128L336 128M276 192L284 192M216 256L280 256M216 288L280 288M152 352L176 352M184 352L216 352"
        }
        strokeWidth={"0.6"}
        opacity={"0.1"}
        data-grammar-focus={"true"}
        data-grammar-isolation-only={"true"}
        visibility={"hidden"}
      />
      <path
        d={
          "M184 96H280A96 96 0 0 1 280 288H216V352H184Z M216 128H280A64 64 0 0 1 280 256H216Z"
        }
        strokeWidth={"0.95"}
        opacity={"1"}
      />
      <path
        d={"M280 188V196M276 192H284"}
        strokeWidth={"0.6"}
        opacity={"0.24"}
      />
      <path
        d={"M280 192L347.88225099390854 124.11774900609144"}
        strokeWidth={"0.65"}
        opacity={"0.5"}
      />
      <path
        d={"M341.882251 124.117749H347.882251V130.117749"}
        strokeWidth={"0.65"}
        opacity={"0.5"}
      />
      <text
        x={"323"}
        y={"141"}
        textAnchor={"middle"}
        fontSize={"10"}
        fill={"currentColor"}
        stroke={"none"}
        opacity={"0.5"}
      >
        {"3u"}
      </text>
      <path
        d={"M280 192L325.25483399593907 237.25483399593904"}
        strokeWidth={"0.65"}
        opacity={"0.5"}
      />
      <text
        x={"316"}
        y={"220"}
        textAnchor={"start"}
        fontSize={"10"}
        fill={"currentColor"}
        stroke={"none"}
        opacity={"0.5"}
      >
        {"2u"}
      </text>
      <path
        d={
          "M176 96H104M176 352H104M112 96V208M112 240V352M108 100L116 92M108 356L116 348"
        }
        strokeWidth={"0.65"}
        opacity={"0.5"}
      />
      <text
        x={"112"}
        y={"228"}
        textAnchor={"middle"}
        fontSize={"10"}
        fill={"currentColor"}
        stroke={"none"}
        opacity={"0.5"}
      >
        {"8u"}
      </text>
      <path
        d={
          "M184 360V392M216 360V392M184 384H216M180 388L188 380M212 388L220 380"
        }
        strokeWidth={"0.65"}
        opacity={"0.5"}
      />
      <text
        x={"200"}
        y={"407"}
        textAnchor={"middle"}
        fontSize={"10"}
        fill={"currentColor"}
        stroke={"none"}
        opacity={"0.5"}
      >
        {"u"}
      </text>
      <text
        x={"344"}
        y={"407"}
        textAnchor={"middle"}
        fontSize={"10"}
        fill={"currentColor"}
        stroke={"none"}
        opacity={"0.5"}
      >
        {"u = 32"}
      </text>
    </svg>
  );
}

function GrammarHatching() {
  const id = useId();
  return (
    <svg
      width={"560"}
      height={"440"}
      viewBox={"0 0 560 440"}
      fill={"none"}
      stroke={"currentColor"}
      strokeLinecap={"butt"}
      strokeLinejoin={"round"}
      style={{
        fontFamily: "Cal Sans,sans-serif",
        fontOpticalSizing: "auto",
        fontSynthesis: "none",
        fontVariationSettings: "'GEOM' 25",
        fontWeight: "400",
      }}
      aria-hidden={"true"}
      focusable={"false"}
    >
      <defs>
        <clipPath id={`${id}-grammar-hatching-blade-region`}>
          <path
            d={
              "M280.000000 266.188022L202.020410 311.209559A120 120 0 0 1 162.020410 198.072474Z"
            }
            fill={"black"}
            stroke={"none"}
          />
        </clipPath>
      </defs>
      <path
        d={
          "M140 100L420 -180M140 112L420 -168M140 124L420 -156M140 136L420 -144M140 148L420 -132M140 160L420 -120M140 172L420 -108M140 184L420 -96M140 196L420 -84M140 208L420 -72M140 220L420 -60M140 232L420 -48M140 244L420 -36M140 256L420 -24M140 268L420 -12M140 280L420 0M140 292L420 12M140 304L420 24M140 316L420 36M140 328L420 48M140 340L420 60M140 352L420 72M140 364L420 84M140 376L420 96M140 388L420 108M140 400L420 120M140 412L420 132M140 424L420 144M140 436L420 156M140 448L420 168M140 460L420 180M140 472L420 192M140 484L420 204M140 496L420 216M140 508L420 228M140 520L420 240M140 532L420 252M140 544L420 264M140 556L420 276M140 568L420 288M140 580L420 300M140 592L420 312M140 604L420 324M140 616L420 336M140 628L420 348"
        }
        strokeWidth={"0.65"}
        opacity={"0.27"}
        clipPath={`url(#${id}-grammar-hatching-blade-region)`}
        data-grammar-focus={"true"}
      />
      <g strokeWidth={"0.6"} opacity={"0.24"} strokeDasharray={"8 3 1 3"}>
        <circle cx={"280"} cy={"220"} r={"40"} />
        <path d={"M136 220H277M328 220H424M280 84V217M280 223V356"} />
      </g>
      <g strokeWidth={"0.95"}>
        <circle cx={"280"} cy={"220"} r={"120"} />
        <path
          d={
            "M320.000000 196.905989L320.000000 333.137085M320.000000 243.094011L202.020410 311.209559M280.000000 266.188022L162.020410 198.072474M240.000000 243.094011L240.000000 106.862915M240.000000 196.905989L357.979590 128.790441M280.000000 173.811978L397.979590 241.927526"
          }
        />
      </g>
      <g strokeWidth={"0.65"} opacity={"0.5"}>
        <circle cx={"280"} cy={"220"} r={"3"} />
        <path
          d={
            "M283 220H320M315.757359 215.757359L320 220L315.757359 224.242641M314 220V214H320"
          }
        />
        <path d={"M320 196.905989L346 170H388M202 270L146 314H112"} />
        <path
          d={
            "M160 92V56M400 92V56M160 64H264M296 64H400M156 68L164 60M396 68L404 60"
          }
        />
      </g>
      <g fill={"currentColor"} stroke={"none"} fontSize={"10"} opacity={"0.5"}>
        <text x={"300"} y={"207"} textAnchor={"middle"}>
          {"u"}
        </text>
        <text x={"280"} y={"67"} textAnchor={"middle"}>
          {"6u"}
        </text>
      </g>
      <g fill={"currentColor"} stroke={"none"} fontSize={"11"} opacity={"0.72"}>
        <text x={"396"} y={"174"}>
          {"Aperture"}
        </text>
        <text x={"104"} y={"318"} textAnchor={"end"}>
          {"Blade 01"}
        </text>
      </g>
    </svg>
  );
}

function GrammarOutlines() {
  return (
    <svg
      width={"560"}
      height={"440"}
      viewBox={"0 0 560 440"}
      fill={"none"}
      stroke={"currentColor"}
      strokeLinecap={"butt"}
      strokeLinejoin={"round"}
      style={{
        fontFamily: "Cal Sans,sans-serif",
        fontOpticalSizing: "auto",
        fontSynthesis: "none",
        fontVariationSettings: "'GEOM' 25",
        fontWeight: "400",
      }}
      aria-hidden={"true"}
      focusable={"false"}
    >
      <g strokeWidth={"0.6"} opacity={"0.24"}>
        <path
          d={
            "M136 152V236M184 152V236M208 180V236M328 180V236M352 180V236M424 180V236"
          }
        />
        <path
          d={
            "M136 252V260M184 252V260M208 252V264M328 252V264M352 252V256M424 252V256"
          }
        />
        <path d={"M128 120H136M184 120H192M128 168H136M184 168H192"} />
        <path
          d={
            "M104 268H128M104 316H128M432 264H456M432 320H456M184 308V332M208 324V332M328 316V332M352 316V332"
          }
        />
      </g>
      <g strokeWidth={"0.95"} data-grammar-focus={"true"}>
        <circle cx={"160"} cy={"144"} r={"24"} />
        <rect x={"352"} y={"116"} width={"72"} height={"24"} rx={"12"} />
        <rect x={"352"} y={"148"} width={"72"} height={"24"} rx={"12"} />
      </g>
      <g strokeWidth={"0.65"} opacity={"0.5"}>
        <circle cx={"160"} cy={"137"} r={"5"} data-grammar-focus={"true"} />
        <path d={"M148 156A12 12 0 0 1 172 156"} data-grammar-focus={"true"} />
        <path d={"M208 168V176M208 172H328M328 168V176"} />
      </g>
      <g fill={"currentColor"} stroke={"none"} fontSize={"11"} opacity={"0.72"}>
        <text x={"208"} y={"148"} fontSize={"12"}>
          {"Research agent"}
        </text>
        <text x={"388"} y={"132"} textAnchor={"middle"}>
          {"Read"}
        </text>
        <text x={"388"} y={"164"} textAnchor={"middle"}>
          {"Search"}
        </text>
      </g>
      <g
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"10"}
        opacity={"0.5"}
        textAnchor={"middle"}
      >
        <text x={"160"} y={"94"}>
          {"Identity"}
        </text>
        <text x={"268"} y={"94"}>
          {"Name"}
        </text>
        <text x={"388"} y={"94"}>
          {"Tools"}
        </text>
      </g>
      <g strokeWidth={"0.65"} opacity={"0.5"}>
        <path d={"M268 212V186"} strokeDasharray={"4 6"} />
        <path d={"M263.757359 207.757359L268 212L272.242641 207.757359"} />
      </g>
      <text
        x={"280"}
        y={"234"}
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"11"}
        opacity={"0.72"}
        textAnchor={"middle"}
      >
        {"Registered agent"}
      </text>
      <g strokeWidth={"0.95"} data-grammar-focus={"true"}>
        <rect x={"112"} y={"244"} width={"336"} height={"96"} rx={"12"} />
        <circle cx={"160"} cy={"292"} r={"24"} />
        <rect x={"352"} y={"264"} width={"72"} height={"24"} rx={"12"} />
        <rect x={"352"} y={"296"} width={"72"} height={"24"} rx={"12"} />
      </g>
      <g strokeWidth={"0.65"} opacity={"0.5"} data-grammar-focus={"true"}>
        <circle cx={"160"} cy={"285"} r={"5"} />
        <path d={"M148 304A12 12 0 0 1 172 304"} />
      </g>
      <g fill={"currentColor"} stroke={"none"} fontSize={"11"} opacity={"0.72"}>
        <text x={"208"} y={"296"} fontSize={"12"}>
          {"Research agent"}
        </text>
        <text x={"388"} y={"280"} textAnchor={"middle"}>
          {"Read"}
        </text>
        <text x={"388"} y={"312"} textAnchor={"middle"}>
          {"Search"}
        </text>
      </g>
      <text
        x={"208"}
        y={"314"}
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"10"}
        opacity={"0.72"}
        style={{ fontVariationSettings: "'GEOM' 0" }}
      >
        {"agent_07"}
      </text>
      <g strokeWidth={"0.65"} opacity={"0.5"}>
        <path
          d={
            "M112 348V398M448 348V398M112 390H264M296 390H448M108 394L116 386M444 394L452 386"
          }
        />
        <path
          d={
            "M184 348V370M208 348V370M184 362H208M180 366L188 358M204 366L212 358"
          }
        />
        <path
          d={
            "M328 348V370M352 348V370M328 362H352M324 366L332 358M348 366L356 358"
          }
        />
      </g>
      <g
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"10"}
        opacity={"0.5"}
        textAnchor={"middle"}
      >
        <text x={"280"} y={"393"}>
          {"14u"}
        </text>
        <text x={"196"} y={"381"}>
          {"u"}
        </text>
        <text x={"340"} y={"381"}>
          {"u"}
        </text>
      </g>
    </svg>
  );
}

function GrammarProjections() {
  return (
    <svg
      width={"560"}
      height={"440"}
      viewBox={"0 0 560 440"}
      fill={"none"}
      stroke={"currentColor"}
      strokeLinecap={"butt"}
      strokeLinejoin={"round"}
      style={{
        fontFamily: "Cal Sans,sans-serif",
        fontOpticalSizing: "auto",
        fontSynthesis: "none",
        fontVariationSettings: "'GEOM' 25",
        fontWeight: "400",
      }}
      aria-hidden={"true"}
      focusable={"false"}
    >
      <g strokeWidth={"0.95"}>
        <rect x={"112"} y={"116"} width={"336"} height={"64"} rx={"12"} />
        <path
          d={
            "M112 272H244V336H112A12 12 0 0 1 100 324V284A12 12 0 0 1 112 272Z"
          }
        />
        <path
          d={"M268 272H448A12 12 0 0 1 460 284V324A12 12 0 0 1 448 336H268Z"}
        />
      </g>
      <path d={"M256 116V180"} strokeWidth={"0.65"} opacity={"0.5"} />
      <g strokeWidth={"0.6"} opacity={"0.24"}>
        <path
          d={
            "M110.9565 188L101.0435 264M254.9565 188L245.0435 264M257.0435 188L266.9565 264M449.0435 188L458.9565 264"
          }
          data-grammar-focus={"true"}
        />
        <path
          d={
            "M92 116H104M456 116H468M92 180H104M456 180H468M80 272H92M468 272H480M80 336H92M468 336H480"
          }
        />
      </g>
      <g strokeWidth={"0.65"} opacity={"0.5"}>
        <path d={"M172 246V210M364 246V210"} strokeDasharray={"4 6"} />
        <path
          d={
            "M167.757359 241.757359L172 246L176.242641 241.757359M359.757359 241.757359L364 246L368.242641 241.757359"
          }
        />
      </g>
      <g
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"11"}
        opacity={"0.72"}
        textAnchor={"middle"}
      >
        <text x={"280"} y={"101"}>
          {"One task"}
        </text>
        <text x={"184"} y={"152"}>
          {"Research"}
        </text>
        <text x={"352"} y={"152"}>
          {"Draft"}
        </text>
        <text x={"172"} y={"308"}>
          {"Research"}
        </text>
        <text x={"364"} y={"308"}>
          {"Draft"}
        </text>
        <text x={"172"} y={"358"} style={{ fontVariationSettings: "'GEOM' 0" }}>
          {"Agent 01"}
        </text>
        <text x={"364"} y={"358"} style={{ fontVariationSettings: "'GEOM' 0" }}>
          {"Agent 02"}
        </text>
      </g>
      <g strokeWidth={"0.65"} opacity={"0.5"}>
        <path
          d={
            "M112 108V60M448 108V60M112 68H264M296 68H448M108 72L116 64M444 72L452 64"
          }
        />
        <path d={"M100 344V392M244 344V392M268 344V392M460 344V392"} />
        <path d={"M100 384H156M188 384H244M268 384H348M380 384H460"} />
        <path
          d={"M96 388L104 380M240 388L248 380M264 388L272 380M456 388L464 380"}
        />
      </g>
      <g
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"10"}
        opacity={"0.5"}
        textAnchor={"middle"}
      >
        <text x={"280"} y={"71"}>
          {"14u"}
        </text>
        <text x={"172"} y={"387"}>
          {"6u"}
        </text>
        <text x={"364"} y={"387"}>
          {"8u"}
        </text>
      </g>
    </svg>
  );
}

function GrammarStates() {
  return (
    <svg
      width={"560"}
      height={"440"}
      viewBox={"0 0 560 440"}
      fill={"none"}
      stroke={"currentColor"}
      strokeLinecap={"butt"}
      strokeLinejoin={"round"}
      style={{
        fontFamily: "Cal Sans,sans-serif",
        fontOpticalSizing: "auto",
        fontSynthesis: "none",
        fontVariationSettings: "'GEOM' 25",
        fontWeight: "400",
      }}
      aria-hidden={"true"}
      focusable={"false"}
    >
      <rect
        x={"112"}
        y={"96"}
        width={"336"}
        height={"248"}
        rx={"16"}
        strokeWidth={"0.95"}
        opacity={"1"}
      />
      <circle
        cx={"144"}
        cy={"128"}
        r={"6"}
        strokeWidth={"0.95"}
        opacity={"1"}
      />
      <path
        d={"M132 128H136M152 128H156M144 116V120M144 136V140"}
        strokeWidth={"0.6"}
        opacity={"0.24"}
      />
      <circle
        cx={"144"}
        cy={"312"}
        r={"6"}
        strokeWidth={"0.95"}
        opacity={"1"}
      />
      <path
        d={"M132 312H136M152 312H156M144 300V304M144 320V324"}
        strokeWidth={"0.6"}
        opacity={"0.24"}
      />
      <circle
        cx={"416"}
        cy={"128"}
        r={"6"}
        strokeWidth={"0.95"}
        opacity={"1"}
      />
      <path
        d={"M404 128H408M424 128H428M416 116V120M416 136V140"}
        strokeWidth={"0.6"}
        opacity={"0.24"}
      />
      <circle
        cx={"416"}
        cy={"312"}
        r={"6"}
        strokeWidth={"0.95"}
        opacity={"1"}
      />
      <path
        d={"M404 312H408M424 312H428M416 300V304M416 320V324"}
        strokeWidth={"0.6"}
        opacity={"0.24"}
      />
      <circle
        cx={"280"}
        cy={"220"}
        r={"52"}
        strokeWidth={"0.95"}
        opacity={"1"}
      />
      <path
        d={
          "M184 124H280A96 96 0 0 1 280 316H184A8 8 0 0 1 184 300H280A80 80 0 0 0 280 140H184A8 8 0 0 1 184 124Z"
        }
        strokeWidth={"0.65"}
        opacity={"0.45"}
        strokeDasharray={"3 5"}
        data-grammar-focus={"true"}
      />
      <circle
        cx={"184"}
        cy={"132"}
        r={"3.5"}
        strokeWidth={"0.95"}
        opacity={"1"}
      />
      <circle
        cx={"184"}
        cy={"308"}
        r={"3.5"}
        strokeWidth={"0.95"}
        opacity={"1"}
      />
      <path
        d={
          "M280 156V168M280 180V208M280 232V260M280 272V284M216 220H228M240 220H268M292 220H320M332 220H344"
        }
        strokeWidth={"0.6"}
        opacity={"0.24"}
        strokeDasharray={"8 3 1 3"}
      />
      <circle
        cx={"280"}
        cy={"220"}
        r={"2"}
        strokeWidth={"0.65"}
        opacity={"0.5"}
      />
      <text
        x={"184"}
        y={"162"}
        textAnchor={"middle"}
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"10"}
        opacity={"0.72"}
      >
        {"Port A"}
      </text>
      <text
        x={"184"}
        y={"286"}
        textAnchor={"middle"}
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"10"}
        opacity={"0.72"}
      >
        {"Port B"}
      </text>
      <path
        d={"M376 220H400L420 200H448"}
        strokeWidth={"0.65"}
        opacity={"0.5"}
      />
      <text
        x={"456"}
        y={"197"}
        textAnchor={"start"}
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"11"}
        opacity={"0.72"}
      >
        {"Hidden"}
      </text>
      <text
        x={"456"}
        y={"212"}
        textAnchor={"start"}
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"11"}
        opacity={"0.72"}
      >
        {"rear channel"}
      </text>
      <path d={"M112 88V52M448 88V52"} strokeWidth={"0.6"} opacity={"0.24"} />
      <path
        d={"M112 60H264.0M296.0 60H448M108 64L116 56M444 64L452 56"}
        strokeWidth={"0.65"}
        opacity={"0.5"}
      />
      <text
        x={"280.0"}
        y={"63"}
        textAnchor={"middle"}
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"10"}
        opacity={"0.5"}
      >
        {"336"}
      </text>
      <path
        d={"M280 220L316.769553 183.230447"}
        strokeWidth={"0.65"}
        opacity={"0.5"}
      />
      <path
        d={"M310.769553 183.230447H316.769553V189.230447"}
        strokeWidth={"0.65"}
        opacity={"0.5"}
      />
      <text
        x={"309"}
        y={"207"}
        textAnchor={"start"}
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"10"}
        opacity={"0.5"}
      >
        {"R52"}
      </text>
      <path
        d={"M128 352V388M432 352V388"}
        strokeWidth={"0.6"}
        opacity={"0.24"}
      />
      <path
        d={"M128 380H264.0M296.0 380H432M124 384L132 376M428 384L436 376"}
        strokeWidth={"0.65"}
        opacity={"0.5"}
      />
      <text
        x={"280.0"}
        y={"383"}
        textAnchor={"middle"}
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"10"}
        opacity={"0.5"}
      >
        {"304"}
      </text>
      <text
        x={"280"}
        y={"419"}
        textAnchor={"middle"}
        fill={"currentColor"}
        stroke={"none"}
        fontSize={"11"}
        opacity={"0.5"}
      >
        {"Front view · channel concealed behind the face"}
      </text>
    </svg>
  );
}

export const visualGrammarDrawings: Record<
  (typeof visualGrammarEntries)[number]["id"],
  ReactNode
> = {
  arrows: <GrammarArrows />,
  centerlines: <GrammarCenterlines />,
  dimensions: <GrammarDimensions />,
  grids: <GrammarGrids />,
  hatching: <GrammarHatching />,
  outlines: <GrammarOutlines />,
  projections: <GrammarProjections />,
  states: <GrammarStates />,
};
