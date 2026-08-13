import { Target, TrendingUp, Users } from "lucide-react";
import { Eyebrow } from "../layout/Eyebrow";

export function ProcessSteps() {
    const steps = [
        {
            icon: <Target size={20} />,
            title: "Plan Smarter",
            description: "Set goals and let AI organize your task priorities.",
        },
        {
            icon: <Users size={20} />,
            title: "Collaborate Better",
            description: "Keep every teammate aligned with shared dashboards.",
        },
        {
            icon: <TrendingUp size={20} />,
            title: "Track Progress",
            description: "Gain instant visibility into real-time performance.",
        },
    ];

    return (
        <section id="process" className="scroll-mt-24 px-6 py-24 sm:scroll-mt-28 sm:py-28">
            <div className="mx-auto max-w-5xl text-center">
                <Eyebrow>Simple Process</Eyebrow>
                <h2 className="mx-auto mt-5 max-w-xl text-3xl font-semibold tracking-[-0.04em] text-[#17161A] sm:text-4xl">
                    From Planning to Success in Three Steps
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#706C65]">
                    CortexSync streamlines your workflow in three simple steps — plan
                    projects, manage tasks, and achieve success efficiently with the
                    power of AI-driven collaboration.
                </p>

                <div className="relative mt-16 grid gap-10 sm:grid-cols-3">
                    <div className="absolute left-0 right-0 top-9 hidden h-px bg-[#E4DED4] sm:block" />
                    {steps.map((step, i) => (
                        <div key={step.title} className="relative flex flex-col items-center">
                            <div className="relative z-10 flex h-18 w-18 items-center justify-center rounded-full border border-[#E4DED4] bg-[#FCFAF6] text-[#5B4BFF] shadow-sm transform-gpu transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#5B4BFF]/40 hover:shadow-[0_15px_35px_rgba(91,75,255,0.15)]">
                                {step.icon}
                                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#5B4BFF] text-[10px] font-bold text-white">
                                    {i + 1}
                                </span>
                            </div>
                            <h3 className="mt-5 text-base font-semibold text-[#242128]">
                                {step.title}
                            </h3>
                            <p className="mt-2 max-w-55 text-sm leading-6 text-[#777169]">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
