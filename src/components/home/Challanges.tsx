import { Check } from "lucide-react";
import { Eyebrow } from "../layout/Eyebrow";

export function Challenges() {
    const chaos = [
        "Scattered updates across multiple platforms",
        "Unclear task priorities lead to missed deadlines",
        "Lack of real-time visibility into project status",
        "Missed deadlines and reduced productivity",
    ];

    return (
        <section className="border-y border-[#E9E3D9] bg-[#FCFAF6] px-6 py-24 sm:py-28">
            <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
                <div>
                    <Eyebrow tone="light">Common Challenges</Eyebrow>
                    <h2 className="mt-5 max-w-md text-3xl font-semibold leading-[1.1] tracking-[-0.04em] text-[#17161A] sm:text-4xl">
                        Challenges Teams Face
                    </h2>
                    <p className="mt-4 max-w-md text-base leading-7 text-[#706C65]">
                        Teams often struggle with scattered communication, unclear
                        priorities, and rigid tools that fail to provide insights,
                        leading to missed deadlines and inefficiency.
                    </p>

                    <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#DCD6EE] bg-[#ECE9FF]/60 p-4">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5B4BFF] text-white">
                            <Check size={13} strokeWidth={2.5} />
                        </span>
                        <p className="text-sm leading-6 text-[#3B3550]">
                            <span className="font-semibold">CortexSync Solves This.</span>{" "}
                            Our AI-powered platform eliminates these pain points with
                            intelligent automation, centralized communication, and
                            real-time insights.
                        </p>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute -inset-4 -z-10 rounded-[28px] bg-[#5B4BFF]/5 blur-2xl" />
                    <div className="rounded-2xl border border-[#E6E0D6] bg-white p-6 shadow-[0_25px_60px_rgba(30,25,20,0.08)] transform-gpu transition-transform duration-500 ease-out hover:-translate-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#B24949]">
                            The Chaos Without Us
                        </p>
                        <div className="mt-4 space-y-3">
                            {chaos.map((item) => (
                                <div
                                    key={item}
                                    className="flex items-start gap-2.5 rounded-xl border border-[#F0DEDE] bg-[#FBF4F4] p-3"
                                >
                                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C15C5C]" />
                                    <p className="text-xs leading-5 text-[#7A5555]">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
