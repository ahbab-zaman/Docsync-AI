import { Plus } from "lucide-react";
import Link from "next/link";


// function DocSyncLogoLight() {
//     return (
//         <div className="flex items-center gap-2.5">
//             <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#5B4BFF] shadow-[0_6px_20px_rgba(91,75,255,0.22)]">
//                 <div className="absolute left-2.25 top-1.75 h-5.5 w-4 rounded-1 border border-white/80 bg-white/10" />
//                 <div className="absolute left-3.25 top-2.75 h-5.5 w-4 rounded-xs border border-white bg-white/15">
//                     <div className="absolute left-0.75 top-1.5 h-[1.5px] w-2 rounded bg-white/90" />
//                     <div className="absolute left-0.75 top-2.75 h-1.5 w-1.5 rounded bg-white/60" />
//                 </div>
//                 <div className="absolute bottom-1.5 right-1.25 flex h-3 w-3 items-center justify-center rounded-full bg-white text-[#5B4BFF]">
//                     <Plus size={8} strokeWidth={3} />
//                 </div>
//             </div>
//             <span className="text-base font-bold tracking-tight text-white">
//                 DocSync
//             </span>
//         </div>
//     );
// }
export function Footer({ user }: { user: boolean }) {
    return (
        <footer className="relative overflow-hidden border-t border-white/5 bg-[#0F0E12] text-white">
            <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <Link
                                href="/"
                                aria-label="DocSync home"
                                className="group flex flex-1 items-center rounded-xl px-2 py-2.5"
                            >
                                {/* Document Logo */}
                                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                                    {/* Back document */}
                                    <div className="absolute left-1 top-1 h-8 w-7 border-2 border-accent/40 bg-accent/10 -rotate-6" />

                                    {/* Main document */}
                                    <div className="relative h-9 w-7 overflow-hidden border-2 border-accent bg-accent/10 shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
                                        {/* Folded corner */}
                                        <div className="absolute -right-px -top-px h-3.5 w-3.5 border-b-2 border-l-2 border-accent bg-surface-secondary" />

                                        {/* Document lines */}
                                        <div className="absolute left-1.5 top-4 h-0.5 w-3 rounded-full bg-accent/70" />
                                        <div className="absolute left-1.5 top-5.5 h-0.5 w-4 rounded-full bg-accent/50" />
                                        <div className="absolute left-1.5 top-7 h-0.5 w-2.5 rounded-full bg-accent/40" />
                                    </div>
                                </div>

                                {/* Wordmark */}
                                <span className="text-[23px] font-black tracking-[-0.045em]">
                                    Doc<span className="text-accent">Sync</span>
                                </span>
                            </Link>
                        </div>
                        <p className="mt-4 max-w-sm text-sm leading-6 text-white/40">
                            Work Smarter, Collaborate Better. The connected AI workspace
                            for modern software teams.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">
                            Quick Links
                        </h3>
                        <div className="mt-4 space-y-3">
                            <FooterLink href="#features">Features</FooterLink>
                            <FooterLink href="#collaboration">About</FooterLink>
                            <FooterLink href="#ai">Pricing</FooterLink>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">
                            Account
                        </h3>
                        <div className="mt-4 space-y-3">
                            {user ? (
                                <>
                                    <FooterLink href="/app">Dashboard</FooterLink>
                                    <FooterLink href="/app/settings">Settings</FooterLink>
                                </>
                            ) : (
                                <>
                                    <FooterLink href="/login">Sign in</FooterLink>
                                    <FooterLink href="/register">Create account</FooterLink>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-white/30">
                        © {new Date().getFullYear()} DocSync. All rights reserved.
                    </p>
                    <div className="flex items-center gap-5 text-xs text-white/30">
                        <span className="cursor-pointer transition-colors hover:text-white/70">
                            Privacy
                        </span>
                        <span className="cursor-pointer transition-colors hover:text-white/70">
                            Terms
                        </span>
                        <span className="cursor-pointer transition-colors hover:text-white/70">
                            Cookies
                        </span>
                    </div>
                </div>
            </div>

            {/* Big wordmark */}
            <div className="pointer-events-none select-none px-6 pb-4 text-center">
                <p className="text-[15vw] font-extrabold leading-none tracking-tighter ext-white/6 sm:text-[110px]">
                    DocSync
                </p>
            </div>
        </footer>
    );
}

function FooterLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="block text-sm text-white/50 transition-colors hover:text-white"
        >
            {children}
        </Link>
    );
}
