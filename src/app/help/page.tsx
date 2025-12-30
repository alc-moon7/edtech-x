"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { KB_DATA } from "@/lib/kbData";
import { Search, ChevronRight, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePageMeta } from "@/lib/usePageMeta";
import { MarketingShell } from "@/components/MarketingShell";
import { useTranslate } from "@/lib/i18n";

const categoryLabels: Record<string, { en: string; bn: string }> = {
  "Getting Started": { en: "Getting Started", bn: "শুরু করা" },
  "Account Management": { en: "Account Management", bn: "অ্যাকাউন্ট ব্যবস্থাপনা" },
  Learning: { en: "Learning", bn: "শেখা" },
  Analytics: { en: "Analytics", bn: "অ্যানালিটিক্স" },
  Support: { en: "Support", bn: "সাপোর্ট" },
  Billing: { en: "Billing", bn: "বিলিং" },
};

const titleLabels: Record<string, { en: string; bn: string }> = {
  "platform-overview": { en: "Platform Overview", bn: "প্ল্যাটফর্ম ওভারভিউ" },
  "user-roles": { en: "User Roles & Access Control", bn: "ব্যবহারকারীর ভূমিকা ও অ্যাক্সেস নিয়ন্ত্রণ" },
  "content-structure": { en: "Learning Content Structure", bn: "লার্নিং কন্টেন্টের কাঠামো" },
  "chapter-page": { en: "Chapter Learning Page", bn: "অধ্যায় শেখার পেজ" },
  "assessments": { en: "Assessments & Exams", bn: "মূল্যায়ন ও পরীক্ষা" },
  "progress-tracking": { en: "Progress Tracking & Analytics", bn: "অগ্রগতি ট্র্যাকিং ও অ্যানালিটিক্স" },
  "gamification": { en: "Gamification System", bn: "গেমিফিকেশন সিস্টেম" },
  "personalization": { en: "Personalization Engine", bn: "পার্সোনালাইজেশন ইঞ্জিন" },
  "productivity-tools": { en: "Student Productivity Tools", bn: "শিক্ষার্থীর প্রোডাক্টিভিটি টুলস" },
  "parent-dashboard": { en: "Parent Dashboard", bn: "অভিভাবক ড্যাশবোর্ড" },
  "subscription": { en: "Subscription & Access", bn: "সাবস্ক্রিপশন ও অ্যাক্সেস" },
  "security-privacy": { en: "Security & Privacy", bn: "নিরাপত্তা ও গোপনীয়তা" },
  "troubleshooting": { en: "Troubleshooting & FAQs", bn: "ট্রাবলশুটিং ও FAQ" },
  "future": { en: "Future Enhancements", bn: "ভবিষ্যৎ উন্নয়ন" },
};

export default function HelpCenterPage() {
  const t = useTranslate();

  usePageMeta({
    title: t({ en: "Help Center", bn: "হেল্প সেন্টার" }),
    description: t({ en: "Search the HomeSchool knowledge base for guides, FAQs, and platform support.", bn: "গাইড, FAQ এবং প্ল্যাটফর্ম সাপোর্টের জন্য HomeSchool নলেজ বেসে খুঁজুন।" }),
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const hiddenCategories = new Set(["Features", "Platform"]);
  const categories = Array.from(new Set(KB_DATA.map((item) => item.category))).filter(
    (category) => !hiddenCategories.has(category)
  );

  const getCategoryLabel = (category: string) => categoryLabels[category] ?? { en: category, bn: category };
  const getTitleLabel = (id: string, title: string) => titleLabels[id] ?? { en: title, bn: title };

  const filteredItems = KB_DATA.filter((item) => {
    if (hiddenCategories.has(item.category)) return false;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <MarketingShell>
      <div className="container mx-auto p-6 space-y-8 max-w-5xl">
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {t({ en: "How can we help you?", bn: "আপনাকে কীভাবে সাহায্য করতে পারি?" })}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t({ en: "Search our knowledge base for answers to common questions, platform guides, and more.", bn: "সাধারণ প্রশ্নের উত্তর, প্ল্যাটফর্ম গাইড এবং আরও অনেক কিছুর জন্য আমাদের নলেজ বেসে খুঁজুন।" })}
          </p>

          <div className="relative max-w-xl mx-auto mt-6">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t({ en: "Search for articles (e.g., 'password', 'quizzes')...", bn: "আর্টিকেল খুঁজুন (যেমন, 'password', 'quizzes')..." })}
              className="pl-10 py-6 text-lg shadow-sm"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>

        {!searchQuery && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "p-4 rounded-xl border text-center transition-all hover:shadow-md",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card hover:border-primary/50"
                )}
              >
                <HelpCircle className="h-6 w-6 mx-auto mb-2" />
                <span className="font-medium">{t(getCategoryLabel(category))}</span>
              </button>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {searchQuery
                ? `${t({ en: "Search Results", bn: "সার্চ ফলাফল" })} (${filteredItems.length})`
                : selectedCategory
                ? t(getCategoryLabel(selectedCategory))
                : t({ en: "All Articles", bn: "সব আর্টিকেল" })}
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-medium text-primary hover:underline"
              >
                {t({ en: "Clear filter", bn: "ফিল্টার সরান" })}
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl">
              <p>{t({ en: "No articles found matching your search.", bn: "আপনার সার্চের সাথে মেলে এমন কোনো আর্টিকেল পাওয়া যায়নি।" })}</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                className="text-primary hover:underline mt-2"
              >
                {t({ en: "Clear filters", bn: "সব ফিল্টার সরান" })}
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className={cn(
                    "transition-all cursor-pointer hover:border-primary/50",
                    expandedItem === item.id ? "ring-2 ring-primary/20" : ""
                  )}
                >
                  <CardHeader
                    className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  >
                    <div className="space-y-1">
                      <div className="text-sm text-primary font-medium">{t(getCategoryLabel(item.category))}</div>
                      <CardTitle className="text-xl">{t(getTitleLabel(item.id, item.title))}</CardTitle>
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform",
                        expandedItem === item.id ? "rotate-90" : ""
                      )}
                    />
                  </CardHeader>
                  {expandedItem === item.id && (
                    <CardContent className="pt-4 border-t mt-4 bg-muted/10 animate-in fade-in slide-in-from-top-2">
                      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap">{item.content}</div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MarketingShell>
  );
}
