import { Check, Clock, Rocket, ShieldCheck, Users, Zap } from "lucide-react";
import { Eyebrow } from "../layout/Eyebrow";

export function AboutStats() {
    const checklist = [
        "Seamless task management",
        "Real-time performance tracking",
        "AI-driven insights & automation",
        "Collaborative project planning",
        "Customizable reporting features",
        "Cross-platform accessibility",
    ];

    const stats = [
        { icon: <Users size={16} />, value: "10K+", label: "Active Teams" },
        { icon: <ShieldCheck size={16} />, value: "99.9%", label: "Uptime" },
        { icon: <Zap size={16} />, value: "40%", label: "Faster Workflows" },
        { icon: <Clock size={16} />, value: "24/7", label: "Support" },
    ];

    return (
        <section id="about" className="scroll-mt-24 border-y border-[#E9E3D9] bg-[#FCFAF6] px-6 py-24 sm:scroll-mt-28 sm:py-28">
            <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
                <div>
                    <Eyebrow tone="light">
                        <span />
                        About CortexSync
                    </Eyebrow>
                    <h2 className="mt-5 max-w-lg text-3xl font-semibold leading-[1.1] tracking-[-0.04em] text-[#17161A] sm:text-4xl">
                        Designed to Simplify Collaboration
                    </h2>
                    <p className="mt-4 max-w-md text-base leading-7 text-[#706C65]">
                        CortexSync is a data-backed platform built to help teams
                        streamline everyday collaboration, track performance in real
                        time, and enhance communication and productivity for growing
                        teams.
                    </p>

                    <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                        {checklist.map((item) => (
                            <li
                                key={item}
                                className="flex items-center gap-2.5 text-sm text-[#555149]"
                            >
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ECE9FF] text-[#5B4BFF]">
                                    <Check size={12} strokeWidth={2.5} />
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((s) => (
                            <div
                                key={s.label}
                                className="rounded-2xl border border-[#E6E0D6] bg-white p-5 shadow-sm transform-gpu transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(30,25,20,0.08)]"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECE9FF] text-[#5B4BFF]">
                                    {s.icon}
                                </div>
                                <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[#17161A]">
                                    {s.value}
                                </p>
                                <p className="mt-1 text-xs font-medium text-[#8B867D]">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex items-center gap-4 rounded-2xl border border-[#E6E0D6] bg-white p-5 shadow-sm transform-gpu transition-all duration-500 ease-out hover:-translate-y-1">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5B4BFF] text-white shadow-[0_8px_20px_rgba(91,75,255,0.25)]">
                            <Rocket size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#242128]">
                                Smart Workflows
                            </p>
                            <p className="mt-0.5 text-xs leading-5 text-[#777169]">
                                Automate routine tasks and let AI handle the complexity while
                                you focus on what matters.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
