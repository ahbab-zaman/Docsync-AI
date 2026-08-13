import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";

export function FinalCTA({ user }: { user: boolean }) {
    return (
        <section className="px-6 py-24 sm:py-28">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-4xl bg-[#17161A] px-6 py-20 text-center sm:px-10 sm:py-24">
                <div className="pointer-events-none absolute left-1/2 top-0 h-100 w-175 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(91,75,255,.55),transparent_65%)] opacity-30 blur-3xl" />

                <div className="relative">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#A79CFF] transition-transform duration-500 hover:rotate-12">
                        <Sparkles size={21} />
                    </div>

                    <h2 className="mx-auto mt-7 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                        Work Smarter,
                        <br />
                        Collaborate Better.
                    </h2>

                    <p className="mx-auto mt-5 max-w-md text-base leading-7 text-white/50">
                        Experience the future of teamwork with CortexSync.
                    </p>

                    <div className="mt-9 flex justify-center">
                        <Link
                            href={user ? "/app/workspaces/new" : "/register"}
                            className="group inline-flex h-12 items-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-[#17161A] transform-gpu transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-[#F5F3EF]"
                        >
                            {user ? "Create a workspace" : "Get Started"}
                            <ArrowRight
                                size={16}
                                className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                            />
                        </Link>
                    </div>

                    <p className="mt-5 text-xs font-medium text-white/35">
                        Join 10,000+ teams already transforming their workflow
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] font-medium text-white/40">
                        <span className="flex items-center gap-1.5">
                            <Check size={12} /> 14-day free trial
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Check size={12} /> No credit card required
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Check size={12} /> Cancel anytime
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
