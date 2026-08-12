// import Link from "next/link";
// import { getCurrentUser } from "@/server/auth";
// import { canManageWorkspaceMembers } from "@/server/access";
// import MarketingNav from "@/components/layout/MarketingNav";

// import {
//   Activity,
//   ArrowRight,
//   Bot,
//   Check,
//   ChevronRight,
//   FileText,
//   FolderKanban,
//   Layers3,
//   MessageSquare,
//   MousePointer2,
//   Plus,
//   Search,
//   Settings2,
//   ShieldCheck,
//   Sparkles,
//   Users,
//   Zap,
// } from "lucide-react";

// export default async function MarketingPage() {
//   const user = await getCurrentUser();

//   const canManageMembers = user
//     ? await canManageWorkspaceMembers(user.id)
//     : false;

//   return (
//     <div className="min-h-screen overflow-hidden bg-[#F7F4EE] text-[#17161A]">
//       <MarketingNav
//         user={user}
//         canManageMembers={canManageMembers}
//       />

//       <main>
//         {/* =========================================================
//             HERO
//         ========================================================= */}
//         <section className="relative px-6 pb-20 pt-20 sm:pb-28 sm:pt-28 lg:pt-32">
//           {/* Background glow */}
//           <div
//             className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[700px] w-[900px] -translate-x-1/2 opacity-70 blur-3xl"
//             style={{
//               background:
//                 "radial-gradient(circle, rgba(91,75,255,0.10) 0%, rgba(91,75,255,0.035) 38%, transparent 72%)",
//             }}
//           />

//           {/* Subtle grid */}
//           <div
//             className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] opacity-[0.035]"
//             style={{
//               backgroundImage:
//                 "linear-gradient(rgba(0,0,0,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.7) 1px, transparent 1px)",
//               backgroundSize: "44px 44px",
//               maskImage:
//                 "linear-gradient(to bottom, black, transparent)",
//             }}
//           />

//           <div className="mx-auto max-w-7xl text-center">
//             {/* Eyebrow */}
//             <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#E6E0D6] bg-[#FCFAF6]/80 px-3.5 py-1.5 text-xs font-medium text-[#706C65] shadow-sm backdrop-blur">
//               <span className="relative flex h-1.5 w-1.5">
//                 <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5B4BFF] opacity-60" />
//                 <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#5B4BFF]" />
//               </span>
//               The workspace for modern teams
//             </div>

//             {/* Heading */}
//             <h1 className="mx-auto mt-7 max-w-5xl text-[3.3rem] font-semibold leading-[0.98] tracking-[-0.055em] text-[#17161A] sm:text-6xl md:text-7xl lg:text-[84px]">
//               Your team&apos;s work,
//               <br />
//               <span className="bg-gradient-to-r from-[#4E3EFF] via-[#6654FF] to-[#7B6CFF] bg-clip-text text-transparent">
//                 finally connected.
//               </span>
//             </h1>

//             {/* Description */}
//             <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#706C65] sm:text-lg">
//               Documents, projects, conversations, and AI — connected in one
//               intelligent workspace built for teams that want to move faster.
//             </p>

//             {/* CTA */}
//             <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
//               {user ? (
//                 <Link
//                   href="/app"
//                   className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#5B4BFF] px-7 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(91,75,255,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4E3EFF] hover:shadow-[0_14px_35px_rgba(91,75,255,0.28)]"
//                 >
//                   Go to Dashboard
//                   <ArrowRight
//                     size={16}
//                     className="transition-transform duration-200 group-hover:translate-x-0.5"
//                   />
//                 </Link>
//               ) : (
//                 <>
//                   <Link
//                     href="/register"
//                     className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#5B4BFF] px-7 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(91,75,255,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4E3EFF] hover:shadow-[0_14px_35px_rgba(91,75,255,0.28)]"
//                   >
//                     Start for free
//                     <ArrowRight
//                       size={16}
//                       className="transition-transform duration-200 group-hover:translate-x-0.5"
//                     />
//                   </Link>

//                   <Link
//                     href="#features"
//                     className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#DDD7CC] bg-[#FCFAF6]/80 px-7 text-sm font-semibold text-[#29272B] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CFC8BC] hover:bg-white"
//                   >
//                     Explore DocSync
//                   </Link>
//                 </>
//               )}
//             </div>

//             {/* Hero product preview */}
//             <div className="relative mx-auto mt-16 max-w-6xl sm:mt-20">
//               {/* Glow */}
//               <div
//                 className="absolute left-1/2 top-10 -z-10 h-80 w-[80%] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
//                 style={{
//                   background:
//                     "radial-gradient(circle, rgba(91,75,255,.35), transparent 68%)",
//                 }}
//               />

//               <ProductPreview />
//             </div>
//           </div>
//         </section>

//         {/* =========================================================
//             STATEMENT
//         ========================================================= */}
//         <section className="border-y border-[#E9E3D9] bg-[#FCFAF6] px-6 py-14 sm:py-16">
//           <div className="mx-auto max-w-5xl text-center">
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B867D]">
//               One workspace
//             </p>

//             <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#17161A] sm:text-3xl">
//               Everything your team needs to stay in sync.
//             </h2>

//             <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
//               {[
//                 "Documents",
//                 "Projects",
//                 "AI workflows",
//                 "Team collaboration",
//                 "Activity",
//               ].map((item) => (
//                 <span
//                   key={item}
//                   className="rounded-full border border-[#E6E0D6] bg-white px-4 py-2 text-xs font-medium text-[#706C65] shadow-sm"
//                 >
//                   {item}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* =========================================================
//             FEATURES
//         ========================================================= */}
//         <section
//           id="features"
//           className="px-6 py-24 sm:py-32"
//         >
//           <div className="mx-auto max-w-7xl">
//             <div className="max-w-2xl">
//               <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E5DFD5] bg-[#FCFAF6] px-3 py-1.5 text-xs font-medium text-[#706C65]">
//                 <Layers3 size={13} />
//                 Everything in one place
//               </div>

//               <h2 className="text-4xl font-semibold tracking-[-0.045em] text-[#17161A] sm:text-5xl">
//                 Built around how
//                 <br />
//                 teams actually work.
//               </h2>

//               <p className="mt-5 max-w-xl text-base leading-7 text-[#706C65]">
//                 Keep knowledge, execution, and collaboration connected without
//                 forcing your team to jump between disconnected tools.
//               </p>
//             </div>

//             {/* Asymmetric grid */}
//             <div className="mt-14 grid gap-4 lg:grid-cols-12">
//               {/* Documents */}
//               <FeatureShowcase
//                 className="lg:col-span-7"
//                 icon={<FileText size={18} />}
//                 eyebrow="01 · Documents"
//                 title="Write, organize, and build knowledge together."
//                 description="A polished workspace for documents, specs, notes, and everything your team needs to remember."
//               >
//                 <DocumentMockup />
//               </FeatureShowcase>

//               {/* AI */}
//               <FeatureShowcase
//                 className="lg:col-span-5"
//                 icon={<Sparkles size={18} />}
//                 eyebrow="02 · AI Assistant"
//                 title="Turn information into action."
//                 description="Summarize documents, rewrite content, and extract the important bits without leaving your workspace."
//               >
//                 <AIMiniMockup />
//               </FeatureShowcase>

//               {/* Collaboration */}
//               <FeatureShowcase
//                 className="lg:col-span-5"
//                 icon={<Users size={18} />}
//                 eyebrow="03 · Collaboration"
//                 title="Work together, in real time."
//                 description="Know who is editing, viewing, and working on the same thing."
//               >
//                 <CollaborationMiniMockup />
//               </FeatureShowcase>

//               {/* Projects */}
//               <FeatureShowcase
//                 className="lg:col-span-7"
//                 icon={<FolderKanban size={18} />}
//                 eyebrow="04 · Projects"
//                 title="Give every piece of work a home."
//                 description="Group related documents, people, and activity into structured project spaces."
//               >
//                 <ProjectMockup />
//               </FeatureShowcase>
//             </div>

//             {/* Small features */}
//             <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               <SmallFeature
//                 icon={<Activity size={17} />}
//                 title="Activity that keeps everyone aligned"
//                 description="See what changed, who changed it, and what needs attention."
//               />

//               <SmallFeature
//                 icon={<ShieldCheck size={17} />}
//                 title="Permission-aware workspaces"
//                 description="Control access with clear roles and member management."
//               />

//               <SmallFeature
//                 icon={<Zap size={17} />}
//                 title="Fast by default"
//                 description="A focused experience designed to keep teams moving."
//               />
//             </div>
//           </div>
//         </section>

//         {/* =========================================================
//             COLLABORATION
//         ========================================================= */}
//         <section
//           id="collaboration"
//           className="border-y border-[#E9E3D9] bg-[#FCFAF6] px-6 py-24 sm:py-32"
//         >
//           <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
//             <div>
//               <div className="inline-flex items-center gap-2 rounded-full border border-[#E5DFD5] bg-white px-3 py-1.5 text-xs font-medium text-[#706C65]">
//                 <Users size={13} />
//                 Real-time collaboration
//               </div>

//               <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-[#17161A] sm:text-5xl">
//                 Collaborate without
//                 <br />
//                 <span className="text-[#5B4BFF]">the chaos.</span>
//               </h2>

//               <p className="mt-5 max-w-lg text-base leading-7 text-[#706C65]">
//                 Documents, projects, and conversations live in one place. Your
//                 team gets a shared view of what matters without constant
//                 context switching.
//               </p>

//               <ul className="mt-8 space-y-3.5">
//                 {[
//                   "Shared workspaces with member roles",
//                   "Projects that group related documents",
//                   "Live presence and activity",
//                   "Everything stays connected",
//                 ].map((item) => (
//                   <li
//                     key={item}
//                     className="flex items-center gap-3 text-sm text-[#555149]"
//                   >
//                     <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ECE9FF] text-[#5B4BFF]">
//                       <Check size={12} strokeWidth={2.5} />
//                     </span>
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <CollaborationEditor />
//           </div>
//         </section>

//         {/* =========================================================
//             AI DARK SECTION
//         ========================================================= */}
//         <section
//           id="ai"
//           className="relative overflow-hidden bg-[#151419] px-6 py-24 text-white sm:py-32"
//         >
//           {/* Background glow */}
//           <div
//             className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 opacity-30 blur-3xl"
//             style={{
//               background:
//                 "radial-gradient(circle, rgba(105,89,255,.45), transparent 65%)",
//             }}
//           />

//           <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
//             <div className="order-2 lg:order-1">
//               <AIWorkspaceMockup />
//             </div>

//             <div className="order-1 lg:order-2">
//               <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-white/60">
//                 <Sparkles size={13} />
//                 Powered by AI
//               </div>

//               <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl">
//                 AI that understands
//                 <br />
//                 your team&apos;s context.
//               </h2>

//               <p className="mt-5 max-w-lg text-base leading-7 text-white/55">
//                 Your documents contain decisions, plans, and knowledge. Let
//                 AI help you find what matters and turn it into useful output.
//               </p>

//               <div className="mt-8 space-y-3">
//                 {[
//                   "Summarize long documents in seconds",
//                   "Rewrite and refine with different tones",
//                   "Extract action items and decisions",
//                 ].map((item) => (
//                   <div
//                     key={item}
//                     className="flex items-center gap-3 text-sm text-white/70"
//                   >
//                     <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[#A79CFF]">
//                       <Check size={12} />
//                     </span>
//                     {item}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* =========================================================
//             WORKFLOW
//         ========================================================= */}
//         <section className="px-6 py-24 sm:py-32">
//           <div className="mx-auto max-w-7xl">
//             <div className="text-center">
//               <div className="inline-flex items-center gap-2 rounded-full border border-[#E5DFD5] bg-[#FCFAF6] px-3 py-1.5 text-xs font-medium text-[#706C65]">
//                 <Zap size={13} />
//                 One connected workflow
//               </div>

//               <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-[#17161A] sm:text-5xl">
//                 From idea to execution,
//                 <br />
//                 without losing context.
//               </h2>
//             </div>

//             <div className="mt-16 flex flex-col items-stretch justify-center gap-3 md:flex-row md:items-center">
//               <WorkflowStep
//                 number="01"
//                 icon={<FileText size={19} />}
//                 title="Create"
//                 description="Write the idea down."
//               />

//               <WorkflowArrow />

//               <WorkflowStep
//                 number="02"
//                 icon={<Sparkles size={19} />}
//                 title="Understand"
//                 description="Let AI extract insights."
//               />

//               <WorkflowArrow />

//               <WorkflowStep
//                 number="03"
//                 icon={<FolderKanban size={19} />}
//                 title="Organize"
//                 description="Turn ideas into projects."
//               />

//               <WorkflowArrow />

//               <WorkflowStep
//                 number="04"
//                 icon={<Users size={19} />}
//                 title="Collaborate"
//                 description="Bring your team in."
//               />
//             </div>
//           </div>
//         </section>

//         {/* =========================================================
//             CTA
//         ========================================================= */}
//         <section className="px-6 pb-24 sm:pb-32">
//           <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#17161A] px-6 py-20 text-center sm:px-10 sm:py-24">
//             <div
//               className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 opacity-30 blur-3xl"
//               style={{
//                 background:
//                   "radial-gradient(circle, rgba(91,75,255,.55), transparent 65%)",
//               }}
//             />

//             <div className="relative">
//               <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#A79CFF]">
//                 <Sparkles size={21} />
//               </div>

//               <h2 className="mx-auto mt-7 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
//                 Ready to bring your team together?
//               </h2>

//               <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/50">
//                 Start with a workspace, invite your team, and experience what
//                 shared context can do.
//               </p>

//               <div className="mt-9">
//                 {user ? (
//                   <Link
//                     href="/app/workspaces/new"
//                     className="group inline-flex h-12 items-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-[#17161A] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F5F3EF]"
//                   >
//                     Create a workspace
//                     <ArrowRight
//                       size={16}
//                       className="transition-transform group-hover:translate-x-0.5"
//                     />
//                   </Link>
//                 ) : (
//                   <Link
//                     href="/register"
//                     className="group inline-flex h-12 items-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-[#17161A] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F5F3EF]"
//                   >
//                     Get started free
//                     <ArrowRight
//                       size={16}
//                       className="transition-transform group-hover:translate-x-0.5"
//                     />
//                   </Link>
//                 )}
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* =========================================================
//           FOOTER
//       ========================================================= */}
//       <footer className="border-t border-[#E5DFD5] bg-[#FCFAF6]">
//         <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
//           <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
//             {/* Brand */}
//             <div className="lg:col-span-2">
//               <DocSyncLogo />

//               <p className="mt-4 max-w-sm text-sm leading-6 text-[#777169]">
//                 The connected workspace for modern software teams.
//               </p>
//             </div>

//             {/* Product */}
//             <div>
//               <h3 className="text-xs font-semibold uppercase tracking-wider text-[#45413B]">
//                 Product
//               </h3>

//               <div className="mt-4 space-y-3">
//                 <FooterLink href="#features">
//                   Features
//                 </FooterLink>
//                 <FooterLink href="#collaboration">
//                   Collaboration
//                 </FooterLink>
//                 <FooterLink href="#ai">
//                   AI
//                 </FooterLink>
//               </div>
//             </div>

//             {/* Account */}
//             <div>
//               <h3 className="text-xs font-semibold uppercase tracking-wider text-[#45413B]">
//                 Account
//               </h3>

//               <div className="mt-4 space-y-3">
//                 {user ? (
//                   <>
//                     <FooterLink href="/app">
//                       Dashboard
//                     </FooterLink>

//                     <FooterLink href="/app/settings">
//                       Settings
//                     </FooterLink>
//                   </>
//                 ) : (
//                   <>
//                     <FooterLink href="/login">
//                       Sign in
//                     </FooterLink>

//                     <FooterLink href="/register">
//                       Create account
//                     </FooterLink>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="mt-12 flex flex-col gap-4 border-t border-[#E5DFD5] pt-6 sm:flex-row sm:items-center sm:justify-between">
//             <p className="text-xs text-[#8B867D]">
//               © {new Date().getFullYear()} DocSync. All rights reserved.
//             </p>

//             <div className="flex items-center gap-5 text-xs text-[#8B867D]">
//               <span className="cursor-pointer transition-colors hover:text-[#45413B]">
//                 Privacy
//               </span>
//               <span className="cursor-pointer transition-colors hover:text-[#45413B]">
//                 Terms
//               </span>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// /* =========================================================
//    LOGO
// ========================================================= */

// function DocSyncLogo() {
//   return (
//     <div className="flex items-center gap-2.5">
//       <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#5B4BFF] shadow-[0_6px_20px_rgba(91,75,255,0.22)]">
//         <div className="absolute left-[9px] top-[7px] h-[22px] w-[16px] rounded-[4px] border border-white/80 bg-white/10" />

//         <div className="absolute left-[13px] top-[11px] h-[22px] w-[16px] rounded-[4px] border border-white bg-white/15">
//           <div className="absolute left-[3px] top-[6px] h-[1.5px] w-[8px] rounded bg-white/90" />
//           <div className="absolute left-[3px] top-[10px] h-[1.5px] w-[6px] rounded bg-white/60" />
//         </div>

//         <div className="absolute bottom-[6px] right-[5px] flex h-3 w-3 items-center justify-center rounded-full bg-white text-[#5B4BFF]">
//           <Plus size={8} strokeWidth={3} />
//         </div>
//       </div>

//       <span className="text-base font-bold tracking-[-0.025em] text-[#17161A]">
//         DocSync
//       </span>
//     </div>
//   );
// }

// /* =========================================================
//    PRODUCT PREVIEW
// ========================================================= */

// function ProductPreview() {
//   return (
//     <div className="overflow-hidden rounded-[22px] border border-[#DDD7CC] bg-[#EDE8DE] p-2 shadow-[0_35px_100px_rgba(34,30,24,0.14)] sm:p-3">
//       <div className="overflow-hidden rounded-[16px] border border-[#DDD7CC] bg-[#FCFAF6]">
//         {/* Browser bar */}
//         <div className="flex h-11 items-center border-b border-[#E9E3D9] bg-white/80 px-4">
//           <div className="flex gap-1.5">
//             <span className="h-2.5 w-2.5 rounded-full bg-[#DDD8CE]" />
//             <span className="h-2.5 w-2.5 rounded-full bg-[#DDD8CE]" />
//             <span className="h-2.5 w-2.5 rounded-full bg-[#DDD8CE]" />
//           </div>

//           <div className="mx-auto hidden h-6 w-48 items-center justify-center rounded-md border border-[#EEE9E0] bg-[#F8F5EF] text-[9px] text-[#A19B91] sm:flex">
//             app.docsync.io
//           </div>

//           <div className="w-16" />
//         </div>

//         <div className="grid min-h-[390px] grid-cols-[170px_1fr] text-left sm:grid-cols-[210px_1fr]">
//           {/* Sidebar */}
//           <div className="hidden border-r border-[#E9E3D9] bg-[#F8F5EF] p-4 sm:block">
//             <div className="flex items-center gap-2">
//               <DocSyncLogo />
//             </div>

//             <div className="mt-7 space-y-1">
//               <PreviewNav
//                 icon={<Layers3 size={13} />}
//                 label="Overview"
//                 active
//               />

//               <PreviewNav
//                 icon={<FileText size={13} />}
//                 label="Documents"
//               />

//               <PreviewNav
//                 icon={<FolderKanban size={13} />}
//                 label="Projects"
//               />

//               <PreviewNav
//                 icon={<Users size={13} />}
//                 label="Team"
//               />
//             </div>

//             <div className="mt-8">
//               <p className="px-2 text-[9px] font-semibold uppercase tracking-wider text-[#AAA49A]">
//                 Workspace
//               </p>

//               <div className="mt-2 space-y-1">
//                 <PreviewNav
//                   icon={<FileText size={13} />}
//                   label="Q3 Strategy"
//                 />

//                 <PreviewNav
//                   icon={<FileText size={13} />}
//                   label="Product Roadmap"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Main */}
//           <div className="relative p-5 sm:p-7">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-[9px] font-medium text-[#938D83]">
//                   Workspace / Product
//                 </p>

//                 <h3 className="mt-1 text-lg font-semibold tracking-[-0.025em] text-[#252329]">
//                   Q3 Product Strategy
//                 </h3>
//               </div>

//               <div className="flex -space-x-2">
//                 {["A", "S", "Y"].map((letter, index) => (
//                   <div
//                     key={letter}
//                     className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[9px] font-semibold ${index === 0
//                         ? "bg-[#5B4BFF] text-white"
//                         : index === 1
//                           ? "bg-[#D8E9EA] text-[#26636B]"
//                           : "bg-[#F1C84B] text-[#594700]"
//                       }`}
//                   >
//                     {letter}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_230px]">
//               {/* Document */}
//               <div className="rounded-xl border border-[#E6E0D6] bg-white p-5 shadow-sm">
//                 <div className="flex items-center justify-between">
//                   <span className="text-[9px] font-medium text-[#99938A]">
//                     DOCUMENT
//                   </span>

//                   <div className="flex items-center gap-1.5 text-[9px] text-[#7E786F]">
//                     <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//                     3 people editing
//                   </div>
//                 </div>

//                 <div className="mt-5 space-y-3">
//                   <div className="h-2 w-[78%] rounded-full bg-[#242128]" />
//                   <div className="h-2 w-[94%] rounded-full bg-[#E9E4DB]" />
//                   <div className="h-2 w-[87%] rounded-full bg-[#E9E4DB]" />
//                   <div className="h-2 w-[65%] rounded-full bg-[#E9E4DB]" />

//                   <div className="my-5 h-px bg-[#EEEAE2]" />

//                   <div className="h-2 w-[55%] rounded-full bg-[#5B4BFF]/20" />
//                   <div className="h-2 w-[90%] rounded-full bg-[#E9E4DB]" />
//                   <div className="h-2 w-[82%] rounded-full bg-[#E9E4DB]" />
//                 </div>

//                 {/* Comment */}
//                 <div className="mt-6 rounded-lg border border-[#E7E1D8] bg-[#FAF8F4] p-3">
//                   <div className="flex items-center gap-2">
//                     <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5B4BFF] text-[7px] font-bold text-white">
//                       A
//                     </div>

//                     <span className="text-[9px] font-semibold text-[#3B373F]">
//                       Alex
//                     </span>

//                     <span className="ml-auto text-[8px] text-[#A09A91]">
//                       2m ago
//                     </span>
//                   </div>

//                   <p className="mt-2 text-[9px] leading-4 text-[#777169]">
//                     Let&apos;s align this with the new dashboard launch.
//                   </p>
//                 </div>
//               </div>

//               {/* AI panel */}
//               <div className="hidden rounded-xl border border-[#E6E0D6] bg-[#F8F6F1] p-4 lg:block">
//                 <div className="flex items-center gap-2">
//                   <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ECE9FF] text-[#5B4BFF]">
//                     <Sparkles size={13} />
//                   </div>

//                   <div>
//                     <p className="text-[10px] font-semibold text-[#39353D]">
//                       AI Assistant
//                     </p>
//                     <p className="text-[8px] text-[#A09A91]">
//                       Working with your content
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-5 space-y-2">
//                   {["Summarize", "Action items", "Rewrite"].map((item) => (
//                     <div
//                       key={item}
//                       className="flex items-center justify-between rounded-lg border border-[#E8E2D9] bg-white px-3 py-2"
//                     >
//                       <span className="text-[9px] text-[#5E5951]">
//                         {item}
//                       </span>
//                       <ChevronRight
//                         size={11}
//                         className="text-[#B1ABA2]"
//                       />
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-4 rounded-lg bg-[#17161A] p-3 text-white">
//                   <div className="flex items-center gap-1.5 text-[8px] text-[#BDB5FF]">
//                     <Sparkles size={9} />
//                     AI insight
//                   </div>

//                   <p className="mt-2 text-[9px] leading-4 text-white/70">
//                     3 priorities found across your documents.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    FEATURE COMPONENTS
// ========================================================= */

// function FeatureShowcase({
//   icon,
//   eyebrow,
//   title,
//   description,
//   children,
//   className = "",
// }: {
//   icon: React.ReactNode;
//   eyebrow: string;
//   title: string;
//   description: string;
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <article
//       className={`group overflow-hidden rounded-[22px] border border-[#E4DED4] bg-[#FCFAF6] p-6 shadow-[0_2px_10px_rgba(30,25,20,0.025)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D6CFC4] hover:shadow-[0_20px_50px_rgba(30,25,20,0.08)] sm:p-7 ${className}`}
//     >
//       <div className="flex h-full flex-col">
//         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECE9FF] text-[#5B4BFF] transition-transform duration-300 group-hover:scale-105">
//           {icon}
//         </div>

//         <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9A948B]">
//           {eyebrow}
//         </p>

//         <h3 className="mt-2 max-w-lg text-2xl font-semibold tracking-[-0.035em] text-[#242128]">
//           {title}
//         </h3>

//         <p className="mt-3 max-w-lg text-sm leading-6 text-[#777169]">
//           {description}
//         </p>

//         <div className="mt-8 flex-1">{children}</div>
//       </div>
//     </article>
//   );
// }

// function SmallFeature({
//   icon,
//   title,
//   description,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
// }) {
//   return (
//     <div className="rounded-[18px] border border-[#E4DED4] bg-[#FCFAF6] p-5 transition-all duration-200 hover:border-[#D6CFC4] hover:bg-white">
//       <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECE9FF] text-[#5B4BFF]">
//         {icon}
//       </div>

//       <h3 className="mt-4 text-sm font-semibold text-[#2A272D]">
//         {title}
//       </h3>

//       <p className="mt-2 text-xs leading-5 text-[#777169]">
//         {description}
//       </p>
//     </div>
//   );
// }

// /* =========================================================
//    DOCUMENT MOCKUP
// ========================================================= */

// function DocumentMockup() {
//   return (
//     <div className="rounded-2xl border border-[#E5DFD5] bg-[#F5F1E9] p-3">
//       <div className="rounded-xl border border-[#E6E0D6] bg-white p-5 shadow-sm">
//         <div className="flex items-center justify-between border-b border-[#EEEAE3] pb-4">
//           <div className="flex items-center gap-2">
//             <FileText size={14} className="text-[#5B4BFF]" />
//             <span className="text-xs font-semibold text-[#37333A]">
//               Product Requirements
//             </span>
//           </div>

//           <span className="text-[9px] text-[#AAA49A]">
//             Saved just now
//           </span>
//         </div>

//         <div className="py-5">
//           <div className="h-3 w-[55%] rounded-full bg-[#252229]" />

//           <div className="mt-5 space-y-2.5">
//             <div className="h-2 w-full rounded-full bg-[#E9E4DB]" />
//             <div className="h-2 w-[92%] rounded-full bg-[#E9E4DB]" />
//             <div className="h-2 w-[82%] rounded-full bg-[#E9E4DB]" />
//           </div>

//           <div className="mt-6 grid gap-2 sm:grid-cols-3">
//             {["Goals", "Requirements", "Timeline"].map((item) => (
//               <div
//                 key={item}
//                 className="rounded-lg border border-[#E8E2D9] bg-[#FAF8F4] p-3"
//               >
//                 <div className="h-1.5 w-1/2 rounded-full bg-[#5B4BFF]/30" />
//                 <p className="mt-2 text-[9px] font-medium text-[#777169]">
//                   {item}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    AI MINI MOCKUP
// ========================================================= */

// function AIMiniMockup() {
//   return (
//     <div className="rounded-2xl border border-[#E5DFD5] bg-[#F5F1E9] p-3">
//       <div className="rounded-xl border border-[#E6E0D6] bg-white p-4 shadow-sm">
//         <div className="flex items-center gap-2">
//           <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ECE9FF] text-[#5B4BFF]">
//             <Sparkles size={13} />
//           </div>

//           <span className="text-xs font-semibold text-[#38343B]">
//             AI Assistant
//           </span>
//         </div>

//         <div className="mt-4 flex flex-wrap gap-1.5">
//           {["Summarize", "Rewrite", "Actions"].map((item) => (
//             <span
//               key={item}
//               className="rounded-md bg-[#F4F1EA] px-2 py-1 text-[8px] font-medium text-[#777169]"
//             >
//               {item}
//             </span>
//           ))}
//         </div>

//         <div className="mt-4 rounded-lg bg-[#F8F6F1] p-3">
//           <div className="flex items-center gap-1.5 text-[8px] font-semibold text-[#5B4BFF]">
//             <Sparkles size={9} />
//             AI
//           </div>

//           <p className="mt-2 text-[9px] leading-4 text-[#777169]">
//             Three key decisions were found in this document, including the
//             dashboard launch and onboarding improvements.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    COLLABORATION MINI MOCKUP
// ========================================================= */

// function CollaborationMiniMockup() {
//   return (
//     <div className="rounded-2xl border border-[#E5DFD5] bg-[#F5F1E9] p-3">
//       <div className="rounded-xl border border-[#E6E0D6] bg-white p-4 shadow-sm">
//         <div className="flex items-center justify-between">
//           <span className="text-[9px] font-medium text-[#9B958C]">
//             ACTIVE NOW
//           </span>

//           <div className="flex -space-x-1.5">
//             {["A", "S", "Y"].map((letter) => (
//               <div
//                 key={letter}
//                 className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#5B4BFF] text-[7px] font-bold text-white"
//               >
//                 {letter}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-5 space-y-3">
//           {[
//             ["Alex Chen", "editing", "A"],
//             ["Sarah Kim", "viewing", "S"],
//             ["You", "online", "Y"],
//           ].map(([name, status, letter], index) => (
//             <div
//               key={name}
//               className="flex items-center gap-2.5"
//             >
//               <div
//                 className={`flex h-7 w-7 items-center justify-center rounded-full text-[8px] font-bold ${index === 0
//                     ? "bg-[#ECE9FF] text-[#5B4BFF]"
//                     : index === 1
//                       ? "bg-[#DFF0F0] text-[#277078]"
//                       : "bg-[#F6D972] text-[#624F00]"
//                   }`}
//               >
//                 {letter}
//               </div>

//               <span className="text-[9px] font-semibold text-[#4B464D]">
//                 {name}
//               </span>

//               <span className="ml-auto text-[8px] text-[#AAA49A]">
//                 {status}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    PROJECT MOCKUP
// ========================================================= */

// function ProjectMockup() {
//   return (
//     <div className="rounded-2xl border border-[#E5DFD5] bg-[#F5F1E9] p-3">
//       <div className="rounded-xl border border-[#E6E0D6] bg-white p-4 shadow-sm">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-[8px] uppercase tracking-wider text-[#AAA49A]">
//               PROJECT
//             </p>
//             <p className="mt-1 text-xs font-semibold text-[#38343B]">
//               Dashboard Redesign
//             </p>
//           </div>

//           <button
//             type="button"
//             className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5F2EB] text-[#777169]"
//           >
//             <Plus size={13} />
//           </button>
//         </div>

//         <div className="mt-5 grid gap-2 sm:grid-cols-3">
//           {[
//             ["Planning", "4"],
//             ["In progress", "7"],
//             ["Done", "12"],
//           ].map(([title, count]) => (
//             <div
//               key={title}
//               className="rounded-lg border border-[#E8E2D9] bg-[#FAF8F4] p-3"
//             >
//               <div className="flex items-center justify-between">
//                 <span className="text-[8px] font-medium text-[#777169]">
//                   {title}
//                 </span>

//                 <span className="text-[9px] font-semibold text-[#5B4BFF]">
//                   {count}
//                 </span>
//               </div>

//               <div className="mt-3 h-1.5 rounded-full bg-[#E8E2D9]">
//                 <div
//                   className="h-full rounded-full bg-[#5B4BFF]"
//                   style={{
//                     width:
//                       title === "Planning"
//                         ? "35%"
//                         : title === "In progress"
//                           ? "65%"
//                           : "90%",
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    COLLABORATION EDITOR
// ========================================================= */

// function CollaborationEditor() {
//   return (
//     <div className="relative rounded-[22px] border border-[#DDD7CC] bg-[#EEE9DF] p-2 shadow-[0_25px_70px_rgba(40,34,27,0.10)] sm:p-3">
//       <div className="overflow-hidden rounded-[16px] border border-[#E2DCD2] bg-white">
//         {/* Toolbar */}
//         <div className="flex h-11 items-center gap-3 border-b border-[#ECE7DF] px-4">
//           <FileText size={13} className="text-[#5B4BFF]" />

//           <span className="text-[10px] font-semibold text-[#3B373F]">
//             Product Strategy
//           </span>

//           <div className="ml-auto flex items-center gap-1">
//             {["B", "I", "≡"].map((item) => (
//               <div
//                 key={item}
//                 className="flex h-6 w-6 items-center justify-center rounded-md text-[9px] text-[#888178]"
//               >
//                 {item}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Editor */}
//         <div className="relative min-h-[370px] p-6 sm:p-8">
//           <div className="max-w-md">
//             <p className="text-[9px] font-medium uppercase tracking-wider text-[#AAA49A]">
//               Q3 Planning
//             </p>

//             <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#252229]">
//               Product Strategy
//             </h3>

//             <div className="mt-6 space-y-3">
//               <div className="h-2 w-full rounded-full bg-[#EAE5DD]" />
//               <div className="h-2 w-[94%] rounded-full bg-[#EAE5DD]" />
//               <div className="h-2 w-[84%] rounded-full bg-[#EAE5DD]" />

//               <div className="pt-3">
//                 <div className="h-2 w-[58%] rounded-full bg-[#252229]" />
//               </div>

//               <div className="h-2 w-[91%] rounded-full bg-[#EAE5DD]" />
//               <div className="h-2 w-[76%] rounded-full bg-[#EAE5DD]" />
//             </div>

//             {/* Highlight */}
//             <div className="mt-8 rounded-lg bg-[#ECE9FF]/60 p-3">
//               <p className="text-[9px] leading-4 text-[#69636D]">
//                 The dashboard redesign should focus on reducing friction and
//                 improving visibility across projects.
//               </p>
//             </div>
//           </div>

//           {/* Comment bubble */}
//           <div className="absolute right-5 top-28 hidden w-48 rounded-xl border border-[#E4DED4] bg-white p-3 shadow-[0_12px_35px_rgba(30,25,20,0.10)] sm:block">
//             <div className="flex items-center gap-2">
//               <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B4BFF] text-[8px] font-bold text-white">
//                 A
//               </div>

//               <span className="text-[9px] font-semibold text-[#3B373F]">
//                 Alex Chen
//               </span>
//             </div>

//             <p className="mt-2 text-[9px] leading-4 text-[#777169]">
//               This section looks good. Let&apos;s connect it to the roadmap.
//             </p>
//           </div>

//           {/* Cursor */}
//           <div className="absolute bottom-20 left-[45%] hidden items-start gap-1 sm:flex">
//             <MousePointer2
//               size={15}
//               className="fill-[#5B4BFF] text-[#5B4BFF]"
//             />

//             <span className="rounded bg-[#5B4BFF] px-1.5 py-0.5 text-[7px] font-medium text-white">
//               Sarah
//             </span>
//           </div>

//           {/* Presence */}
//           <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-[#E5DFD5] bg-white px-3 py-1.5 shadow-sm">
//             <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//             <span className="text-[8px] font-medium text-[#777169]">
//               3 people online
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    AI WORKSPACE
// ========================================================= */

// function AIWorkspaceMockup() {
//   return (
//     <div className="relative">
//       <div className="absolute -inset-8 rounded-[30px] bg-[#6959FF]/10 blur-3xl" />

//       <div className="relative rounded-[22px] border border-white/10 bg-[#1D1C23] p-2 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
//         <div className="rounded-[16px] border border-white/[0.07] bg-[#18171C] p-5 sm:p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5B4BFF]/15 text-[#A79CFF]">
//                 <Sparkles size={16} />
//               </div>

//               <div>
//                 <p className="text-xs font-semibold text-white">
//                   AI Assistant
//                 </p>

//                 <p className="mt-0.5 text-[9px] text-white/35">
//                   Working with Q3 Product Strategy
//                 </p>
//               </div>
//             </div>

//             <div className="rounded-full bg-white/5 px-2.5 py-1 text-[8px] text-white/40">
//               Context aware
//             </div>
//           </div>

//           <div className="mt-6 flex flex-wrap gap-2">
//             {["Summarize", "Rewrite", "Action items"].map((item) => (
//               <button
//                 key={item}
//                 type="button"
//                 className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[9px] text-white/55 transition-colors hover:bg-white/[0.07]"
//               >
//                 {item}
//               </button>
//             ))}
//           </div>

//           <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#211F27] p-4">
//             <div className="flex items-center gap-2">
//               <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#5B4BFF]/15 text-[#A79CFF]">
//                 <Sparkles size={11} />
//               </div>

//               <span className="text-[9px] font-semibold text-white/70">
//                 Here&apos;s what I found
//               </span>
//             </div>

//             <div className="mt-4 space-y-3">
//               {[
//                 "Launch the dashboard redesign",
//                 "Improve onboarding flow",
//                 "Add two engineers to the team",
//               ].map((item, index) => (
//                 <div
//                   key={item}
//                   className="flex items-start gap-2.5"
//                 >
//                   <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#5B4BFF]/15 text-[7px] text-[#A79CFF]">
//                     {index + 1}
//                   </span>

//                   <span className="text-[9px] leading-4 text-white/50">
//                     {item}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2.5">
//             <Bot size={13} className="text-white/30" />

//             <span className="text-[9px] text-white/25">
//               Ask anything about this workspace...
//             </span>

//             <ArrowRight
//               size={12}
//               className="ml-auto text-white/25"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    WORKFLOW
// ========================================================= */

// function WorkflowStep({
//   number,
//   icon,
//   title,
//   description,
// }: {
//   number: string;
//   icon: React.ReactNode;
//   title: string;
//   description: string;
// }) {
//   return (
//     <div className="flex-1 rounded-2xl border border-[#E4DED4] bg-[#FCFAF6] p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-white">
//       <div className="flex items-center justify-between">
//         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECE9FF] text-[#5B4BFF]">
//           {icon}
//         </div>

//         <span className="text-[9px] font-semibold tracking-wider text-[#B1ABA2]">
//           {number}
//         </span>
//       </div>

//       <h3 className="mt-5 text-sm font-semibold text-[#2C2930]">
//         {title}
//       </h3>

//       <p className="mt-1.5 text-xs leading-5 text-[#827C73]">
//         {description}
//       </p>
//     </div>
//   );
// }

// function WorkflowArrow() {
//   return (
//     <div className="hidden shrink-0 text-[#C6BFB4] md:block">
//       <ArrowRight size={17} />
//     </div>
//   );
// }

// /* =========================================================
//    NAV / FOOTER HELPERS
// ========================================================= */

// function PreviewNav({
//   icon,
//   label,
//   active = false,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   active?: boolean;
// }) {
//   return (
//     <div
//       className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[9px] font-medium ${active
//           ? "bg-[#ECE9FF] text-[#5B4BFF]"
//           : "text-[#777169]"
//         }`}
//     >
//       {icon}
//       {label}
//     </div>
//   );
// }

// function FooterLink({
//   href,
//   children,
// }: {
//   href: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <Link
//       href={href}
//       className="block text-sm text-[#777169] transition-colors hover:text-[#29262D]"
//     >
//       {children}
//     </Link>
//   );
// }



import Link from "next/link";
import { getCurrentUser } from "@/server/auth";
import { canManageWorkspaceMembers } from "@/server/access";
import MarketingNav from "@/components/layout/MarketingNav";

import {
  Activity,
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  Clock,
  FileText,
  FolderKanban,
  Layers3,
  Lock,
  Map,
  MessageSquare,
  Plus,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export default async function MarketingPage() {
  const user = await getCurrentUser();

  const canManageMembers = user
    ? await canManageWorkspaceMembers(user.id)
    : false;

  return (
    <div className="min-h-screen overflow-hidden bg-[#F7F4EE] text-[#17161A]">
      <MarketingNav user={user} canManageMembers={canManageMembers} />

      <main>
        <Hero user={!!user} />
        <FeaturesIntro />
        <AboutStats />
        <ProcessSteps />
        <Challenges />
        <FeatureShowcaseGrid />
        <PlatformSection />
        <FinalCTA user={!!user} />
      </main>

      <Footer user={!!user} />
    </div>
  );
}

/* =========================================================
   SHARED: EYEBROW BADGE
========================================================= */

function Eyebrow({
  icon,
  children,
  tone = "light",
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={`mx-auto inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] shadow-sm backdrop-blur transform-gpu transition-transform duration-300 ease-out hover:-translate-y-0.5 ${
        tone === "light"
          ? "border-[#E6E0D6] bg-[#FCFAF6]/80 text-[#8B867D]"
          : "border-white/10 bg-white/[0.05] text-white/60"
      }`}
    >
      {icon ?? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5B4BFF] opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#5B4BFF]" />
        </span>
      )}
      {children}
    </div>
  );
}

/* =========================================================
   HERO
========================================================= */

function Hero({ user }: { user: boolean }) {
  return (
    <section className="relative px-6 pb-24 pt-20 sm:pb-32 sm:pt-28">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(91,75,255,0.10)_0%,rgba(91,75,255,0.035)_38%,transparent_72%)] opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-[linear-gradient(rgba(0,0,0,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.7)_1px,transparent_1px)] bg-[length:44px_44px] opacity-[0.035] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <div className="mx-auto max-w-6xl text-center">
        <Eyebrow icon={<Sparkles size={13} className="text-[#5B4BFF]" />}>
          AI-Powered Team Collaboration
        </Eyebrow>

        <h1 className="mx-auto mt-7 max-w-4xl text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.045em] text-[#17161A] sm:text-6xl md:text-[68px]">
          Smart Collaboration,
          <br />
          <span className="bg-gradient-to-r from-[#4E3EFF] via-[#6654FF] to-[#7B6CFF] bg-clip-text text-transparent">
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
                    className="flex-1 origin-bottom rounded-t-sm bg-gradient-to-t from-[#5B4BFF]/25 to-[#5B4BFF] transition-all duration-500 ease-out hover:from-[#5B4BFF]/40"
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
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[9px] font-semibold ${
                    i === 0
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

/* =========================================================
   FEATURES INTRO ("Built For Smarter Teamwork")
========================================================= */

function FeaturesIntro() {
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
        <Eyebrow>Core Features</Eyebrow>
        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-[#17161A] sm:text-4xl">
          Built For Smarter Teamwork
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#706C65]">
          Empowering teams to work faster, communicate better, and achieve
          more — powered by AI.
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

/* =========================================================
   ABOUT / STATS ("Designed to Simplify Collaboration")
========================================================= */

function AboutStats() {
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
    <section className="border-y border-[#E9E3D9] bg-[#FCFAF6] px-6 py-24 sm:py-28">
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

/* =========================================================
   PROCESS STEPS
========================================================= */

function ProcessSteps() {
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
    <section className="px-6 py-24 sm:py-28">
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
              <div className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#E4DED4] bg-[#FCFAF6] text-[#5B4BFF] shadow-sm transform-gpu transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#5B4BFF]/40 hover:shadow-[0_15px_35px_rgba(91,75,255,0.15)]">
                {step.icon}
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#5B4BFF] text-[10px] font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-[#242128]">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[220px] text-sm leading-6 text-[#777169]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CHALLENGES
========================================================= */

function Challenges() {
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

/* =========================================================
   FEATURE SHOWCASE GRID (bento style, image-heavy)
========================================================= */

function FeatureShowcaseGrid() {
  return (
    <section className="px-6 py-24 sm:py-28">
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
      className={`group overflow-hidden rounded-2xl border border-[#E5DFD5] bg-[#F5F1E9] p-3 transform-gpu transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(30,25,20,0.08)] ${
        small ? "min-h-[220px]" : "min-h-[280px]"
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
                className={`h-1.5 w-1.5 rounded-full ${
                  i === 0
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

/* =========================================================
   PLATFORM SECTION
========================================================= */

function PlatformSection() {
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
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[7px] font-bold ${
                        i === 0
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

/* =========================================================
   FINAL CTA
========================================================= */

function FinalCTA({ user }: { user: boolean }) {
  return (
    <section className="px-6 py-24 sm:py-28">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#17161A] px-6 py-20 text-center sm:px-10 sm:py-24">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(91,75,255,.55),transparent_65%)] opacity-30 blur-3xl" />

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

/* =========================================================
   FOOTER
========================================================= */

function DocSyncLogoLight() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#5B4BFF] shadow-[0_6px_20px_rgba(91,75,255,0.22)]">
        <div className="absolute left-[9px] top-[7px] h-[22px] w-[16px] rounded-[4px] border border-white/80 bg-white/10" />
        <div className="absolute left-[13px] top-[11px] h-[22px] w-[16px] rounded-[4px] border border-white bg-white/15">
          <div className="absolute left-[3px] top-[6px] h-[1.5px] w-[8px] rounded bg-white/90" />
          <div className="absolute left-[3px] top-[10px] h-[1.5px] w-[6px] rounded bg-white/60" />
        </div>
        <div className="absolute bottom-[6px] right-[5px] flex h-3 w-3 items-center justify-center rounded-full bg-white text-[#5B4BFF]">
          <Plus size={8} strokeWidth={3} />
        </div>
      </div>
      <span className="text-base font-bold tracking-[-0.025em] text-white">
        DocSync
      </span>
    </div>
  );
}

function Footer({ user }: { user: boolean }) {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#0F0E12] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <DocSyncLogoLight />
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
        <p className="text-[15vw] font-extrabold leading-none tracking-[-0.05em] text-white/[0.06] sm:text-[110px]">
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
