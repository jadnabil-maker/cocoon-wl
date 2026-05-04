const { useState, useEffect, useMemo } = React;

const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
const fmt = (n) => n.toLocaleString("en-US");

const ROLES = ["Founder", "Marketer", "Designer", "Engineer", "Writer", "Other"];

/* ---------- Supabase helpers ---------- */
const generateRefCode = (email) => {
  const seed = email.split("@")[0].slice(0, 4).toUpperCase().replace(/[^A-Z]/g, "X").padEnd(4, "X");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return seed + "-" + rand;
};

const parseReferralFromUrl = () => {
  try {
    const url = new URL(window.location.href);
    const fromQuery = url.searchParams.get("ref");
    if (fromQuery) return fromQuery.trim();
    const m = url.pathname.match(/\/r\/([A-Z0-9-]+)/i);
    if (m) return m[1].trim();
  } catch (_) {}
  return null;
};

/* ICONS */
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const Check = ({size=22}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/>
  </svg>
);
const TeamIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11h-6"/><path d="M19 8v6"/>
  </svg>
);
const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/>
  </svg>
);
const SparkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>
  </svg>
);
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-2.05c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.94 10.94 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.13v3.16c0 .31.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const LinkChain = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const ChevDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

function useCountUp(target, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf, start;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setVal(Math.floor(target * ease(p)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

/* ---------- TILES (initial state) ---------- */
function Tiles({ onPick }) {
  return (
    <div className="panel-grid">
      <button className="tile" onClick={() => onPick("email")}>
        <div className="tile-icon"><MailIcon/></div>
        <div className="tile-title">Reserve a seat</div>
        <div className="tile-desc">Drop your email — we'll send your invite when it's your turn.</div>
      </button>
      <button className="tile active" onClick={() => onPick("team")}>
        <div className="tile-icon"><TeamIcon/></div>
        <div className="tile-title">Bring your team</div>
        <div className="tile-desc">Invite teammates and get bumped up the queue.</div>
      </button>
    </div>
  );
}

/* ---------- FORM ---------- */
function Form({ mode, referredBy, onBack, onSubmit }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Founder");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const err = touched && !validateEmail(email);

  const handle = async (e) => {
    e.preventDefault();
    setTouched(true);
    setServerError("");
    if (!validateEmail(email)) return;
    setSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();
    const referralCode = generateRefCode(cleanEmail);

    if (!window.sinnaDb || !window.sinnaDbConfigured) {
      console.warn("[Form] Supabase not configured — using local fallback (no DB write).");
      setTimeout(() => {
        onSubmit({
          email: cleanEmail,
          role,
          mode,
          position: null,
          referralCode,
          local: true,
        });
      }, 650);
      return;
    }

    try {
      const { data, error } = await window.sinnaDb
        .from("waitlist")
        .insert({
          email: cleanEmail,
          role,
          mode,
          referral_code: referralCode,
          referred_by: referredBy || null,
        })
        .select("position, referral_code")
        .single();

      if (error) {
        if (error.code === "23505") {
          setServerError("This email is already on the list.");
        } else {
          console.error("[Form] Supabase insert error:", error);
          setServerError("Something went wrong — please try again.");
        }
        setSubmitting(false);
        return;
      }

      onSubmit({
        email: cleanEmail,
        role,
        mode,
        position: data.position,
        referralCode: data.referral_code,
      });
    } catch (e2) {
      console.error("[Form] Network error:", e2);
      setServerError("Connection error — check your internet.");
      setSubmitting(false);
    }
  };

  return (
    <form className="form-stage" onSubmit={handle} noValidate>
      <div className="form-head">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back"><ArrowLeft/></button>
        <span className="crumbs">N° 01 · {mode === "team" ? "Team Reservation" : "Personal Reservation"}</span>
      </div>

      <div className="form-row">
        <input
          className={"form-input " + (err ? "error" : "")}
          type="email"
          placeholder={mode === "team" ? "your work email" : "you@company.com"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          autoFocus
        />
        <button type="submit" className="submit-btn" disabled={submitting || !email}>
          {submitting ? "Reserving…" : "Reserve seat"}
          <ArrowRight/>
        </button>
      </div>
      {err && <div className="form-err">→ Please enter a valid email address.</div>}
      {!err && serverError && <div className="form-err">→ {serverError}</div>}

      <div className="chip-label">What best describes you</div>
      <div className="chip-row">
        {ROLES.map((r) => (
          <button
            key={r}
            type="button"
            className={"chip " + (role === r ? "active" : "")}
            onClick={() => setRole(r)}
          >{r}</button>
        ))}
      </div>
    </form>
  );
}

/* ---------- SUCCESS ---------- */
function Success({ data, count, total, onReset }) {
  const [copied, setCopied] = useState(false);
  const refCode = data.referralCode;
  const refLink = `sinna.ai/r/${refCode}`;
  const position = data.position || (count + 1);
  const animatedPos = useCountUp(position, 1100);
  const ahead = Math.max(0, position - 1);

  const copy = () => {
    navigator.clipboard?.writeText("https://" + refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1700);
  };
  const share = () => {
    const text = encodeURIComponent("I just reserved my seat on the Sinna waiting list:");
    const url = encodeURIComponent("https://" + refLink);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  return (
    <div className="success-stage">
      <div className="form-head">
        <button type="button" className="back-btn" onClick={onReset} aria-label="Back"><ArrowLeft/></button>
        <span className="crumbs" style={{color:"#D9A24A"}}>● Confirmed</span>
      </div>

      <div className="success-top">
        <div className="success-mark"><Check size={20}/></div>
        <h3 className="success-h">You're on the list.</h3>
      </div>
      <p className="success-sub">
        Confirmation sent to <strong>{data.email}</strong>. We're letting members in slowly so the assistant stays sharp — your invite arrives in waves.
      </p>

      <div className="pos-grid">
        <div>
          <div className="pos-label">Your position</div>
          <div className="pos-num"><span className="hash">№</span>{fmt(animatedPos)}</div>
          <div className="pos-meta">{fmt(ahead)} ahead · {fmt(Math.max(0, total - position))} seats left</div>
        </div>
        <div className="pos-divider"/>
        <div>
          <div className="pos-label">Estimated invite</div>
          <div className="pos-num" style={{ fontSize: "22px" }}>2–3 weeks</div>
          <div className="pos-meta">Refer friends to skip ahead</div>
        </div>
      </div>

      <div className="ref">
        <div className="ref-row1">
          <span className="ref-title">Skip the line</span>
          <span className="ref-tag">+50 spots / referral</span>
        </div>
        <div className="ref-link-row">
          <div className="ref-link">{refLink}</div>
          <button className={"copy-btn " + (copied ? "copied" : "")} onClick={copy}>
            {copied ? <Check size={12}/> : <CopyIcon/>}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="share-row">
          <button className="share-btn" onClick={share}><TwitterIcon/> Share on X</button>
          <button className="share-btn" onClick={copy}><LinkChain/> Share link</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- APP ---------- */
function App() {
  const [tweaks, setTweak] = window.useTweaks(window.__TWEAKS_DEFAULTS__ || {});
  const [stage, setStage] = useState("tiles"); // tiles | email | team | success
  const [data, setData]   = useState(null);
  const [realCount, setRealCount] = useState(null);
  const referredBy = useMemo(() => parseReferralFromUrl(), []);

  // Fetch the real waitlist count from Supabase on mount
  useEffect(() => {
    if (!window.sinnaDb || !window.sinnaDbConfigured) return;
    window.sinnaDb
      .rpc("get_waitlist_count")
      .then(({ data, error }) => {
        if (error) {
          console.error("[App] get_waitlist_count error:", error);
          return;
        }
        const n = Number(data);
        if (Number.isFinite(n)) setRealCount(n);
      })
      .catch((e) => console.error("[App] get_waitlist_count network error:", e));
  }, []);

  const total = Number(tweaks.totalSeats) || 4400;
  const tweakCount = Math.min(total, Number(tweaks.currentCount) || 0);
  const count = realCount !== null ? Math.min(total, realCount) : tweakCount;
  const animCount = useCountUp(count, 1500);
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  const onSubmit = (d) => {
    setData(d);
    setStage("success");
    if (typeof d.position === "number") {
      setRealCount(d.position); // keep the displayed count in sync after a successful insert
    } else {
      setRealCount((c) => (c !== null ? c + 1 : c));
    }
  };
  const onReset  = () => { setData(null); setStage("tiles"); };

  const showStripes = tweaks.showStripes !== false;
  const showMeta = tweaks.showMeta !== false;

  return (
    <div className="outer">
      <div className="page">
        <div className="cream-area">
        <header className="chrome">
          <div className="brand">
            <div className="brand-mark"/>
            Sinna
          </div>
          <div className="status-pill">
            <span className="dot"/>
            <GitHubIcon/>
            <span>{fmt(animCount)} on the waiting list</span>
            <ChevDown/>
          </div>
          <div className="user">
            <div className="user-text">
              <strong>Demo User</strong>
              <span>demo@example.com</span>
            </div>
            <div className="user-avatar">D</div>
          </div>
        </header>

        <main className="stage">
          <div className="eyebrow">Private Beta · Q3 2026</div>
          <h1 className="headline">
            {stage === "success"
              ? <>Welcome to <em>Sinna</em>.</>
              : <>An <em>AI writing studio</em>,<br/>opening seats slowly.</>
            }
          </h1>
          {stage !== "success" && (
            <p className="sub">
              Sinna is an AI writing assistant built for serious work — drafts that respect your voice,
              research that doesn't bluff. We're letting members in slowly so the assistant stays sharp.
            </p>
          )}

          <div className="panel">
            {stage === "tiles" && <Tiles onPick={setStage}/>}
            {(stage === "email" || stage === "team") && (
              <Form mode={stage} referredBy={referredBy} onBack={() => setStage("tiles")} onSubmit={onSubmit}/>
            )}
            {stage === "success" && (
              <Success data={data} count={count} total={total} onReset={onReset}/>
            )}
          </div>

          {stage === "tiles" && false && (
            <div className="footnote">
              <InfoIcon/>
              We only email about the launch. No marketing, ever.
            </div>
          )}

          {showMeta && stage !== "success" && (
            <div className="meta-row">
              <div><strong>{fmt(animCount)}</strong>on the list</div>
              <span className="meta-sep"/>
              <div><strong>{pct}%</strong>of beta filled</div>
              <span className="meta-sep"/>
              <div><strong>42</strong>countries</div>
            </div>
          )}
        </main>
        </div>{/* /.cream-area */}

        {showStripes && (
          <div className="stripes">
            <div className="band b1"/><div className="band b2"/><div className="band b3"/><div className="band b4"/><div className="band b5"/>
          </div>
        )}

        <div className="black-area"/>
      </div>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Counters"/>
        <window.TweakSlider label="People on list" min={0} max={total} step={1}
          value={count} onChange={(v) => setTweak("currentCount", v)}/>
        <window.TweakSlider label="Total beta seats" min={500} max={20000} step={100}
          value={total} onChange={(v) => setTweak("totalSeats", v)}/>

        <window.TweakSection label="Sections"/>
        <window.TweakToggle label="Show warm stripes" value={showStripes}
          onChange={(v) => setTweak("showStripes", v)}/>
        <window.TweakToggle label="Show stat meta-row" value={showMeta}
          onChange={(v) => setTweak("showMeta", v)}/>

        <window.TweakSection label="Demo"/>
        <window.TweakButton label="Reset to tiles" onClick={onReset}/>
        <window.TweakButton label="Preview success" onClick={() => { setData({email:"preview@sinna.ai", role:"Founder", mode:"email", position: count + 1, referralCode: generateRefCode("preview@sinna.ai")}); setStage("success"); }}/>
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
