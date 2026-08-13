import { ArrowRight, Check, ChevronRight, Sparkles, TrendingUp, Users } from "lucide-react";
import { Eyebrow } from "../layout/Eyebrow";
import Link from "next/link";

export function Hero({ user }: { user: boolean }) {
    return (
        <section className="relative px-6 pb-24 pt-20 sm:pb-32 sm:pt-28">
            <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-175 w-225 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(91,75,255,0.10)_0%,rgba(91,75,255,0.035)_38%,transparent_72%)] opacity-70 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-180 bg-[linear-gradient(rgba(0,0,0,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.7)_1px,transparent_1px)] bg-size-[44px_44px] opacity-[0.035] mask-[linear-gradient(to_bottom,black,transparent)]" />

            <div className="mx-auto max-w-6xl text-center">
                <Eyebrow icon={<Sparkles size={13} className="text-[#5B4BFF]" />}>
                    AI-Powered Team Collaboration
                </Eyebrow>

                <h1 className="mx-auto mt-7 max-w-4xl text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.045em] text-[#17161A] sm:text-6xl md:text-[68px]">
                    Smart Collaboration,
                    <br />
                    <span className="bg-linear-to-r from-[#4E3EFF] via-[#6654FF] to-[#7B6CFF] bg-clip-text text-transparent">
                        Powered by AI
                    </span>
                </h1>

                <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#706C65] sm:text-lg">
                    CortexSync helps teams manage projects, assign tasks, and
                    collaborate efficiently with real-time tracking and AI-powered
                    insights.
                </p>

                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        href={user ? "/app" : "/register"}
                        className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#5B4BFF] px-7 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(91,75,255,0.22)] transform-gpu transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-[#4E3EFF] hover:shadow-[0_14px_35px_rgba(91,75,255,0.28)] active:translate-y-0"
                    >
                        {user ? "Go to Dashboard" : "Get Started"}
                        <ArrowRight
                            size={16}
                            className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                        />
                    </Link>

                    <button
                        type="button"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#DDD7CC] bg-[#FCFAF6]/80 px-7 text-sm font-semibold text-[#29272B] shadow-sm transform-gpu transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#CFC8BC] hover:bg-white"
                    >
                        View Demo
                    </button>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#8B867D]">
                    <span className="flex items-center gap-1.5">
                        <Check size={13} className="text-[#5B4BFF]" /> Free 14-day trial
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Check size={13} className="text-[#5B4BFF]" /> No credit card
                        required
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Check size={13} className="text-[#5B4BFF]" /> Cancel anytime
                    </span>
                </div>

                <HeroPreview />
            </div>
        </section>
    );
}

function HeroPreview() {
    return (
        <div className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
            <div className="absolute left-1/2 top-10 -z-10 h-80 w-[80%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(91,75,255,.35),transparent_68%)] opacity-30 blur-3xl" />

            <div className="grid gap-4 text-left lg:grid-cols-[1.1fr_0.9fr]">
                {/* AI insights card */}
                <div className="rounded-2xl border border-[#E6E0D6] bg-white/90 p-5 shadow-[0_20px_60px_rgba(30,25,20,0.08)] backdrop-blur transform-gpu transition-transform duration-500 ease-out hover:-translate-y-1 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ECE9FF] text-[#5B4BFF]">
                                <Sparkles size={14} />
                            </span>
                            <div>
                                <p className="text-xs font-semibold text-[#252229]">
                                    AI Insights
                                </p>
                                <p className="text-[10px] text-[#A19B91]">
                                    Optimize your sprint planning
                                </p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-[#C6BFB4]" />
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                        {[
                            ["24%", "Faster delivery"],
                            ["48%", "Fewer blockers"],
                            ["72%", "Team focus"],
                        ].map(([value, label]) => (
                            <div
                                key={label}
                                className="rounded-xl border border-[#EEEAE2] bg-[#FAF8F4] p-3 transition-colors duration-300 ease-out hover:bg-[#F4F1EA]"
                            >
                                <p className="text-lg font-semibold tracking-[-0.02em] text-[#17161A]">
                                    {value}
                                </p>
                                <p className="mt-1 text-[9px] font-medium text-[#8B867D]">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Growth chart */}
                    <div className="mt-5 rounded-xl border border-[#EEEAE2] bg-[#FAF8F4] p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8B867D]">
                                Steady User Growth — First Quarter
                            </p>
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#5B4BFF]">
                                <TrendingUp size={11} /> 1,247
                            </span>
                        </div>
                        <div className="mt-4 flex h-20 items-end gap-1.5">
                            {[30, 45, 38, 55, 48, 66, 58, 74, 68, 85, 78, 96].map(
                                (h, i) => (
                                    <div
                                        key={i}
                                        style={{ height: `${h}%` }}
                                        className="flex-1 origin-bottom rounded-t-sm bg-linear-to-t from-[#5B4BFF]/25 to-[#5B4BFF] transition-all duration-500 ease-out hover:from-[#5B4BFF]/40"
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Right stack */}
                <div className="flex flex-col gap-4">
                    <div className="flex-1 rounded-2xl border border-[#E6E0D6] bg-white/90 p-5 shadow-[0_20px_60px_rgba(30,25,20,0.08)] backdrop-blur transform-gpu transition-transform duration-500 ease-out hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8B867D]">
                                Team Efficiency
                            </p>
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                        </div>
                        <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#17161A]">
                            94%
                        </p>
                        <p className="mt-1 text-[10px] text-[#8B867D]">This week</p>
                    </div>

                    <div className="flex-1 rounded-2xl border border-[#E6E0D6] bg-white/90 p-5 shadow-[0_20px_60px_rgba(30,25,20,0.08)] backdrop-blur transform-gpu transition-transform duration-500 ease-out hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8B867D]">
                                Active Members
                            </p>
                            <Users size={13} className="text-[#5B4BFF]" />
                        </div>
                        <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#17161A]">
                            12
                        </p>
                        <div className="mt-3 flex -space-x-2">
                            {["A", "S", "Y", "+"].map((letter, i) => (
                                <div
                                    key={i}
                                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[9px] font-semibold ${i === 0
                                        ? "bg-[#5B4BFF] text-white"
                                        : i === 1
                                            ? "bg-[#D8E9EA] text-[#26636B]"
                                            : i === 2
                                                ? "bg-[#F1C84B] text-[#594700]"
                                                : "bg-[#EFEAE0] text-[#8B867D]"
                                        }`}
                                >
                                    {letter}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
