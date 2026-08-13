import { Activity, ChevronRight, Lock, Sparkles } from "lucide-react";
import { Eyebrow } from "../layout/Eyebrow";

export function Showcase() {
    return (
        <section id="showcase" className="scroll-mt-24 px-6 py-24 sm:scroll-mt-28 sm:py-28">
            <div className="mx-auto max-w-6xl">
                <div className="text-center">
                    <Eyebrow>Core Features</Eyebrow>
                    <h2 className="mx-auto mt-5 max-w-xl text-3xl font-semibold tracking-[-0.04em] text-[#17161A] sm:text-4xl">
                        Built For Smarter Teamwork
                    </h2>
                    <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#706C65]">
                        Empowering teams to work faster, communicate better, and achieve
                        more — powered by AI.
                    </p>
                </div>

                {/* Top row: kanban + usage donut */}
                <div className="mt-14 grid gap-4 lg:grid-cols-2">
                    <ShowcasePanel>
                        <KanbanMockup />
                    </ShowcasePanel>
                    <ShowcasePanel>
                        <UsageDonutMockup />
                    </ShowcasePanel>
                </div>

                <div className="mt-4 grid gap-6 lg:grid-cols-2 lg:gap-10">
                    <ShowcaseCaption
                        title="Seamless Communication"
                        description="Connect and collaborate effortlessly with real-time messaging and updates. Stay in sync with your team, share instantly, and keep every conversation organized in one place."
                    />
                    <div />
                </div>

                {/* 2x2 grid */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                        <ShowcasePanel small>
                            <AIMiniMockup />
                        </ShowcasePanel>
                        <ShowcaseCaption
                            title="Smart Automation"
                            description="Unlock seamless productivity with smart automation tailored to your daily workflows, automating routine steps, and delivering a smoother, more efficient experience."
                        />
                    </div>

                    <div>
                        <ShowcasePanel small>
                            <RealTimeMockup />
                        </ShowcasePanel>
                        <ShowcaseCaption
                            title="Real-Time Tracking"
                            description="Monitor activity as it happens. Get instant insights, live status updates, and accurate performance tracking to keep everyone aligned at all times."
                        />
                    </div>

                    <div>
                        <ShowcasePanel small>
                            <SecureTeamMockup />
                        </ShowcasePanel>
                        <ShowcaseCaption
                            title="Secure Team Management"
                            description="Easily control member access with smart roles and permissions, safeguarding your data while keeping onboarding and access management effortless."
                        />
                    </div>

                    <div>
                        <ShowcasePanel small>
                            <AISuggestionsMockup />
                        </ShowcasePanel>
                        <ShowcaseCaption
                            title="AI-Powered Suggestions"
                            description="Get smarter, faster decisions with intelligent recommendations tailored to your team. Our AI learns from your workflows and boosts efficiency."
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function ShowcasePanel({
    children,
    small = false,
}: {
    children: React.ReactNode;
    small?: boolean;
}) {
    return (
        <div
            className={`group overflow-hidden rounded-2xl border border-[#E5DFD5] bg-[#F5F1E9] p-3 transform-gpu transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(30,25,20,0.08)] ${small ? "min-h-55" : "min-h-70"
                }`}
        >
            <div className="h-full overflow-hidden rounded-xl border border-[#E6E0D6] bg-white shadow-sm">
                {children}
            </div>
        </div>
    );
}

function ShowcaseCaption({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="mt-4">
            <h3 className="text-base font-semibold text-[#242128]">{title}</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#777169]">
                {description}
            </p>
        </div>
    );
}

function KanbanMockup() {
    const columns = [
        { title: "To Do", tasks: ["Wireframes", "Brand palette"], color: "bg-[#DDD8CE]" },
        { title: "In Progress", tasks: ["Marketing Website Redesign", "Hero copy"], color: "bg-[#5B4BFF]" },
        { title: "Review", tasks: ["Landing QA"], color: "bg-[#F1C84B]" },
    ];
    return (
        <div className="p-5">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#38343B]">
                    Ongoing Projects
                </span>
                <ChevronRight size={13} className="text-[#B1ABA2]" />
            </div>
            <p className="mt-1 text-[10px] text-[#A19B91]">
                Marketing Website Redesign
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
                {columns.map((col) => (
                    <div
                        key={col.title}
                        className="rounded-lg border border-[#EEEAE3] bg-[#FAF8F4] p-2"
                    >
                        <p className="text-[8px] font-semibold uppercase tracking-wider text-[#9B958C]">
                            {col.title}
                        </p>
                        <div className="mt-2 space-y-1.5">
                            {col.tasks.map((t) => (
                                <div
                                    key={t}
                                    className="rounded-md border border-[#E8E2D9] bg-white p-1.5 text-[8px] leading-3 text-[#5E5951] shadow-sm"
                                >
                                    <span className={`mb-1 block h-1 w-4 rounded-full ${col.color}`} />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function UsageDonutMockup() {
    return (
        <div className="flex h-full flex-col p-5">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#38343B]">
                    Usage Distribution
                </span>
                <ChevronRight size={13} className="text-[#B1ABA2]" />
            </div>
            <div className="mt-4 flex flex-1 items-center justify-center">
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[conic-gradient(#5B4BFF_0%_45%,#A79CFF_45%_70%,#EFEAE0_70%_100%)]">
                    <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                        <span className="text-sm font-semibold text-[#17161A]">100%</span>
                        <span className="text-[8px] text-[#A19B91]">Usage</span>
                    </div>
                </div>
            </div>
            <div className="mt-2 flex justify-center gap-3">
                {[
                    ["#5B4BFF", "Docs"],
                    ["#A79CFF", "Projects"],
                    ["#EFEAE0", "AI"],
                ].map(([color, label]) => (
                    <span
                        key={label}
                        className="flex items-center gap-1 text-[8px] font-medium text-[#8B867D]"
                    >
                        <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: color }}
                        />
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}

function RealTimeMockup() {
    return (
        <div className="p-4">
            <div className="flex items-center gap-2">
                <Activity size={13} className="text-[#5B4BFF]" />
                <span className="text-xs font-semibold text-[#38343B]">
                    Live Activity
                </span>
            </div>
            <div className="mt-4 space-y-2.5">
                {["Task updated", "New comment added", "Sprint completed"].map(
                    (t, i) => (
                        <div key={t} className="flex items-center gap-2.5">
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${i === 0
                                    ? "animate-pulse bg-emerald-400"
                                    : "bg-[#D8D2C7]"
                                    }`}
                            />
                            <span className="text-[9px] text-[#5E5951]">{t}</span>
                            <span className="ml-auto text-[8px] text-[#A19B91]">
                                {i === 0 ? "now" : `${i * 3}m ago`}
                            </span>
                        </div>
                    )
                )}
            </div>
            <div className="mt-4 h-1.5 w-full rounded-full bg-[#E8E2D9]">
                <div className="h-full w-4/5 rounded-full bg-[#5B4BFF] transition-all duration-700" />
            </div>
        </div>
    );
}

function SecureTeamMockup() {
    return (
        <div className="p-4">
            <div className="flex items-center gap-2">
                <Lock size={13} className="text-[#5B4BFF]" />
                <span className="text-xs font-semibold text-[#38343B]">
                    Access Control
                </span>
            </div>
            <div className="mt-4 space-y-2">
                {[
                    ["Admin", "Alex Chen"],
                    ["Editor", "Sarah Kim"],
                    ["Viewer", "Team"],
                ].map(([role, name]) => (
                    <div
                        key={role}
                        className="flex items-center justify-between rounded-lg border border-[#E8E2D9] bg-[#FAF8F4] px-2.5 py-1.5"
                    >
                        <span className="text-[9px] font-medium text-[#5E5951]">
                            {name}
                        </span>
                        <span className="rounded-full bg-[#ECE9FF] px-2 py-0.5 text-[8px] font-semibold text-[#5B4BFF]">
                            {role}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AISuggestionsMockup() {
    return (
        <div className="p-4">
            <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-[#5B4BFF]" />
                <span className="text-xs font-semibold text-[#38343B]">
                    AI Suggestions
                </span>
            </div>
            <div className="mt-4 space-y-2">
                {[
                    "Reassign overdue task to Sarah",
                    "Merge duplicate documents",
                    "Schedule sprint retro",
                ].map((t, i) => (
                    <div
                        key={t}
                        className="flex items-start gap-2 rounded-lg bg-[#F8F6F1] p-2"
                    >
                        <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#ECE9FF] text-[7px] font-bold text-[#5B4BFF]">
                            {i + 1}
                        </span>
                        <span className="text-[9px] leading-4 text-[#5E5951]">{t}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* legacy mini mockups reused from previous version */
function AIMiniMockup() {
    return (
        <div className="p-4">
            <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ECE9FF] text-[#5B4BFF]">
                    <Sparkles size={13} />
                </div>
                <span className="text-xs font-semibold text-[#38343B]">
                    AI Assistant
                </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
                {["Summarize", "Rewrite", "Actions"].map((item) => (
                    <span
                        key={item}
                        className="rounded-md bg-[#F4F1EA] px-2 py-1 text-[8px] font-medium text-[#777169]"
                    >
                        {item}
                    </span>
                ))}
            </div>
            <div className="mt-4 rounded-lg bg-[#F8F6F1] p-3">
                <div className="flex items-center gap-1.5 text-[8px] font-semibold text-[#5B4BFF]">
                    <Sparkles size={9} />
                    AI
                </div>
                <p className="mt-2 text-[9px] leading-4 text-[#777169]">
                    Three key decisions were found in this document, including the
                    dashboard launch and onboarding improvements.
                </p>
            </div>
        </div>
    );
}
