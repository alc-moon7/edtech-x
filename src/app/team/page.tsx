import type { ReactNode } from "react";
import { MarketingShell } from "@/components/MarketingShell";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/lib/i18n";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  subtitle?: string;
  image?: string;
  highlight?: boolean;
};

const teamMembers: TeamMember[] = [
  {
    id: "lead",
    name: "Mst. Fahmida Akter",
    role: "TEAM LEADER",
    subtitle: "AI & ANALYTICS LEAD",
    image: "/team/fahmida1.jpg",
    highlight: true,
  },
  {
    id: "muntakim",
    name: "Muntakim Ahmed",
    role: "FULL STACK DEVELOPER AI ENGINEER",
    image: "/team/Muntakim.jpg",
  },
  {
    id: "monzurul",
    name: "Md. Monzurul Parvez",
    role: "VIDEO EDITOR",
    image: "/team/Monjurul.jpeg",
  },
  {
    id: "nur-komol",
    name: "Nur Komol Siddika",
    role: "UI UX DESIGNER",
    image: "/team/Nurkomol1.jpg",
  },
  {
    id: "mehedi",
    name: "Md. Mehedi Hasan Chowdhury",
    role: "PRODUCT & CURRICULUM LEAD",
    image: "/team/Mahi.JPG",
  },
  {
    id: "sohel",
    name: "Md. Sohel Parvez",
    role: "PROMPT ENGINEER",
    image: "/team/sohel.jpg",
  },
];

function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>{children}</section>;
}

function TeamGrid() {
  const lead = teamMembers.find((m) => m.highlight);
  const others = teamMembers.filter((m) => !m.highlight);

  const Card = ({ member, size = "member" }: { member: TeamMember; size?: "lead" | "member" }) => {
    const imageWrapper = size === "lead" ? "aspect-[4/5] w-48 sm:w-56 md:w-60" : "aspect-[4/5] w-full";
    const imageHeight = size === "lead" ? "max-h-[320px] sm:max-h-[360px]" : "max-h-[280px] sm:max-h-[300px]";
    const nameSize = size === "lead" ? "text-lg sm:text-xl" : "text-sm sm:text-base md:text-lg";
    const darkBgPreferred = member.id === "mehedi" || member.id === "sohel";
    const nameColor = size === "lead" ? "text-slate-900" : `${darkBgPreferred ? "text-white" : "text-slate-900"} sm:text-white`;
    const roleColor = member.highlight ? "text-[#0050c8]" : `${darkBgPreferred ? "text-white" : "text-slate-900"} sm:text-white`;
    const subColor = size === "lead" ? "text-slate-900" : `${darkBgPreferred ? "text-white/90" : "text-slate-900"} sm:text-white/85`;

    return (
      <div className="flex flex-col items-center rounded-2xl">
        <div className={cn("overflow-hidden rounded-xl bg-slate-100", imageWrapper, imageHeight)}>
          {member.image ? (
            <img src={member.image} alt={member.name} className="h-full w-full object-contain" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl font-semibold text-slate-600">
              {member.name.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="px-2 py-3 text-center sm:px-3">
          <div className={cn("font-semibold", nameColor, nameSize)}>{member.name}</div>
          <div className={cn("mt-1 text-[11px] font-semibold uppercase tracking-wide sm:text-xs", roleColor)}>
            {member.role}
          </div>
          {member.subtitle && <div className={cn("text-[11px] sm:text-xs", subColor)}>{member.subtitle}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-white to-black">
      <Section className="relative pb-10 pt-14 sm:pt-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black sm:text-4xl md:text-5xl">
            <span className="text-slate-900">Meet Our Team</span>{" "}
            <span className="bg-[linear-gradient(180deg,_#000000_0%,_#1C75D8_70%)] bg-clip-text text-transparent">Member</span>
          </h1>
        </div>

        {lead && (
          <div className="mt-10 flex justify-center">
            <div className="w-52 sm:w-60 md:w-64">
              <Card member={lead} size="lead" />
            </div>
          </div>
        )}
      </Section>

      <div className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {others.map((member) => (
            <Card key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const t = useTranslate();

  return (
    <MarketingShell>
      <main className="bg-white">
        <TeamGrid />
      </main>
    </MarketingShell>
  );
}
