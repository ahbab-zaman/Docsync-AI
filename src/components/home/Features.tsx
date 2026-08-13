import {
    ArrowRight,
    Clock,
    MessageSquare,
    Sparkles,
    Zap,
} from "lucide-react";
import { Eyebrow } from "../layout/Eyebrow";

interface FeaturesProps {
    eyebrow: string;
}

export function Features({ eyebrow }: FeaturesProps) {
    const features = [
        {
            icon: <Sparkles size={18} />,
            title: "AI-Powered Suggestions",
            description:
                "Automate task prioritization and recommendations based on your team's patterns.",
        },
        {
            icon: <Clock size={18} />,
            title: "Real-Time Tracking",
            description:
                "Monitor project progress with live data updates the moment things change.",
        },
        {
            icon: <MessageSquare size={18} />,
            title: "Seamless Communication",
            description:
                "Centralized team chat and feedback so nothing gets lost between tools.",
        },
        {
            icon: <Zap size={18} />,
            title: "Smart Automation",
            description:
                "Reduce manual tasks and automate repetitive workflows across the team.",
        },
    ];

    return (
        <section id="features" className="px-6 py-24 sm:py-28">
            <div className="mx-auto max-w-6xl text-center">
                <Eyebrow>{eyebrow}</Eyebrow>

                <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-[#17161A] sm:text-4xl">
                    Built For Smarter Teamwork
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#706C65]">
                    Empowering teams to work faster, communicate better, and
                    achieve more — powered by AI.
                </p>

                <div className="mt-14 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className="group rounded-2xl border border-[#E4DED4] bg-[#FCFAF6] p-6 transform-gpu transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-[#D6CFC4] hover:bg-white hover:shadow-[0_20px_45px_rgba(30,25,20,0.08)]"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECE9FF] text-[#5B4BFF] transform-gpu transition-transform duration-300 ease-out group-hover:scale-110">
                                {f.icon}
                            </div>

                            <h3 className="mt-5 text-sm font-semibold text-[#242128]">
                                {f.title}
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-[#777169]">
                                {f.description}
                            </p>

                            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#5B4BFF] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                Learn More

                                <ArrowRight
                                    size={12}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
