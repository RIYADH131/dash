"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { COACH_PROMPTS, MOCK_USER } from "@/lib/mockData";
import clsx from "clsx";

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
}

const SEED: Message[] = [
  {
    id: "m0",
    role: "bot",
    text: "Welcome back, Riyadh. I see you're 88% to Titan in Bodybuilding and you hit a +5 kg bench PR today. Want me to plan tomorrow's session around recovery, or push for another PR?",
  },
];

const REPLIES = [
  "Looking at your last 7 days: protein average is 198 g (target 210 g), sleep avg 7.2 h. The bench PR is real — your bar speed on the third rep was 6% faster than last week's top set. Tomorrow I'd run a moderate volume push session: 3×8 incline DB press, 3×10 weighted dips, 3×12 face pulls. Skip heavy bench. Hydrate +800 ml.",
  "Recovery first. 24 h after a true PR your CNS is depressed ~12-18% based on research. Tomorrow: Z2 cardio 30 min, mobility, or full rest. Save heavy work for 48 h out.",
  "Carbs are your gap. You're under target by 65 g/day on average. For the next 3 sessions try: 80 g carbs 90 min pre-workout, 60 g intra. Expect bar speed to jump on set 4-5.",
  "You're trending up. 30-day moving rank score: +47 points (Diamond → mid-Diamond). At your current rate you'll hit Titan threshold in ~6 weeks if you maintain volume.",
];

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>(SEED);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    window.setTimeout(() => {
      const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
      setMessages((prev) => [
        ...prev,
        { id: `b-${Date.now()}`, role: "bot", text: reply },
      ]);
      setTyping(false);
    }, 900);
  }

  const calorieStatus =
    MOCK_USER.todayCalories < MOCK_USER.todayCalorieTarget
      ? `${MOCK_USER.todayCalorieTarget - MOCK_USER.todayCalories} kcal under`
      : `${MOCK_USER.todayCalories - MOCK_USER.todayCalorieTarget} kcal over`;

  return (
    <div className="relative flex flex-col h-[calc(100vh-10rem)] pt-3">
      {/* Subtle radial glow background */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-10 w-72 h-72 rounded-full bg-electric blur-[150px] opacity-20"
      />

      {/* HEADER */}
      <header className="relative flex items-center gap-3 pb-3 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-surface border border-electric/30 grid place-items-center text-electric">
          <Icon name="bolt" filled size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-base text-ink leading-tight">
            DASH Coach
          </p>
          <p className="text-[11px] uppercase tracking-widest text-ink-muted font-semibold">
            Personalized · Always-on
          </p>
        </div>
        <span className="bg-electric/10 text-electric text-[10px] font-display font-extrabold uppercase tracking-widest px-2 py-1 rounded-full border border-electric/30">
          Beta
        </span>
      </header>

      {/* CHAT AREA */}
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto py-4 flex flex-col gap-3"
      >
        {/* Context summary card */}
        <div className="bg-surface/50 border border-white/5 rounded-xl p-3 flex items-center justify-between gap-2 flex-wrap">
          <span className="bg-white/5 border border-white/10 text-ink rounded-full px-2.5 py-1 text-[10px] font-display font-extrabold uppercase tracking-widest">
            Sport · Bodybuilding
          </span>
          <span className="bg-purple-900/30 text-purple-400 border border-purple-400/20 rounded-full px-2.5 py-1 text-[10px] font-display font-extrabold uppercase tracking-widest">
            Rank · Diamond
          </span>
          <span className="bg-amber-accent/10 text-amber-accent border border-amber-accent/30 rounded-full px-2.5 py-1 text-[10px] font-display font-extrabold uppercase tracking-widest">
            Today · {calorieStatus}
          </span>
        </div>

        {messages.map((m) => (
          <div
            key={m.id}
            className={clsx(
              "flex gap-2 animate-fade-up",
              m.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {m.role === "bot" && (
              <div className="w-8 h-8 rounded-lg bg-surface border border-electric/30 grid place-items-center text-electric shrink-0">
                <Icon name="bolt" filled size={16} />
              </div>
            )}
            <div
              className={clsx(
                "max-w-[78%] px-4 py-3 text-sm leading-relaxed",
                m.role === "bot"
                  ? "bg-surface border border-white/10 rounded-bubble-bot text-ink"
                  : "bg-electric rounded-bubble-user text-white",
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2 animate-fade-up">
            <div className="w-8 h-8 rounded-lg bg-surface border border-electric/30 grid place-items-center text-electric shrink-0">
              <Icon name="bolt" filled size={16} />
            </div>
            <div className="bg-surface border border-white/10 rounded-bubble-bot px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-ink-muted animate-pulse-dot"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PROMPT CHIPS */}
      <div className="relative pb-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {COACH_PROMPTS.map((p, i) => (
            <button
              key={p}
              type="button"
              onClick={() => send(p)}
              className={clsx(
                "px-4 py-2 rounded-full border whitespace-nowrap font-body font-semibold text-[13px] transition-all duration-200 active:scale-[0.97]",
                i === 0
                  ? "bg-electric/20 border-electric text-white"
                  : "bg-surface/80 border-electric/30 text-ink",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT BAR */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="relative bg-surface border border-white/10 rounded-2xl p-2 flex items-center gap-2"
      >
        <button
          type="button"
          aria-label="Attach workout log"
          className="w-10 h-10 grid place-items-center rounded-xl text-ink-muted hover:text-ink active:scale-90 transition-all duration-200"
        >
          <Icon name="add" size={22} />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask DASH Coach…"
          className="flex-1 bg-transparent border-0 outline-none text-ink text-sm placeholder:text-ink-muted"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="w-10 h-10 rounded-xl bg-electric grid place-items-center shadow-cta active:scale-90 transition-all duration-200"
        >
          <Icon name="arrow_upward" filled size={20} className="text-white" />
        </button>
      </form>
    </div>
  );
}
