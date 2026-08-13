import { Bot, Layers3 } from "lucide-react";
import { Eyebrow } from "../layout/Eyebrow";

export function PlatformSection() {
    return (
        <section className="border-y border-[#E9E3D9] bg-[#FCFAF6] px-6 py-24 sm:py-28">
            <div className="mx-auto max-w-6xl">
                <div className="text-center">
                    <Eyebrow tone="light">The Platform</Eyebrow>
                    <h2 className="mx-auto mt-5 max-w-xl text-3xl font-semibold tracking-[-0.04em] text-[#17161A] sm:text-4xl">
                        Smart Design, Real Impact
                    </h2>
                    <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#706C65]">
                        We designed a modular dashboard featuring AI-powered task
                        tracking, workflow visualization, and automation tools —
                        removing clutter and smooth execution across teams.
                    </p>
                </div>

                <div className="mt-14 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
                    {/* Task table mockup */}
                    <div className="overflow-hidden rounded-2xl border border-[#E6E0D6] bg-white p-5 shadow-sm transform-gpu transition-transform duration-500 ease-out hover:-translate-y-1 sm:p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#38343B]">
                                Task Management
                            </span>
                            <Layers3 size={13} className="text-[#B1ABA2]" />
                        </div>

                        <div className="mt-5 space-y-2.5">
                            {[
                                ["Review sprint backlog", "High", "bg-[#F4D9D9] text-[#B24949]", "70%"],
                                ["Update project timeline", "Medium", "bg-[#F1E7C7] text-[#8A6D1B]", "40%"],
                                ["Schedule team meeting", "Low", "bg-[#DDEBE1] text-[#2E7D50]", "95%"],
                                ["Publish release notes", "Medium", "bg-[#F1E7C7] text-[#8A6D1B]", "20%"],
                            ].map(([task, priority, cls, progress]) => (
                                <div
                                    key={task as string}
                                    className="rounded-xl border border-[#EEEAE3] bg-[#FAF8F4] p-3 transition-colors duration-200 hover:bg-[#F4F1EA]"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-[#3B373F]">
                                            {task}
                                        </span>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${cls}`}
                                        >
                                            {priority}
                                        </span>
                                    </div>
                                    <div className="mt-2 h-1.5 w-full rounded-full bg-[#E8E2D9]">
                                        <div
                                            className="h-full rounded-full bg-[#5B4BFF] transition-all duration-700"
                                            style={{ width: progress as string }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right stats + AI recommendations */}
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-[#E6E0D6] bg-white p-5 shadow-sm transform-gpu transition-transform duration-500 ease-out hover:-translate-y-1">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8B867D]">
                                    Live Analytics
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-[#17161A]">
                                    94%
                                </p>
                                <p className="mt-1 text-[9px] text-[#A19B91]">
                                    Team efficiency score
                                </p>
                            </div>
                            <div className="rounded-2xl border border-[#E6E0D6] bg-white p-5 shadow-sm transform-gpu transition-transform duration-500 ease-out hover:-translate-y-1">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8B867D]">
                                    Team Activity
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-[#17161A]">
                                    12
                                </p>
                                <div className="mt-2 flex -space-x-1.5">
                                    {["A", "S", "Y"].map((l, i) => (
                                        <div
                                            key={l}
                                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[7px] font-bold ${i === 0
                                                ? "bg-[#5B4BFF] text-white"
                                                : i === 1
                                                    ? "bg-[#D8E9EA] text-[#26636B]"
                                                    : "bg-[#F1C84B] text-[#594700]"
                                                }`}
                                        >
                                            {l}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 rounded-2xl border border-[#E6E0D6] bg-white p-5 shadow-sm transform-gpu transition-transform duration-500 ease-out hover:-translate-y-1">
                            <div className="flex items-center gap-2">
                                <Bot size={14} className="text-[#5B4BFF]" />
                                <span className="text-xs font-semibold text-[#38343B]">
                                    AI Task Recommendations
                                </span>
                            </div>
                            <p className="mt-1.5 text-[10px] leading-4 text-[#8B867D]">
                                AI analyzed your workflow and suggests the right tasks at
                                the right time, helping your team stay organized and
                                improve efficiency.
                            </p>

                            <div className="mt-4 space-y-2.5">
                                {[
                                    ["Review sprint backlog", "High"],
                                    ["Update project timeline", "Medium"],
                                    ["Schedule team meeting", "Low"],
                                ].map(([task, priority], i) => (
                                    <div key={task} className="flex items-center gap-2.5">
                                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#ECE9FF] text-[8px] font-bold text-[#5B4BFF]">
                                            {i + 1}
                                        </span>
                                        <span className="text-[10px] text-[#5E5951]">{task}</span>
                                        <span className="ml-auto text-[8px] font-medium text-[#A19B91]">
                                            {priority}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
