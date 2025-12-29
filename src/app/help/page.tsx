'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { KB_DATA } from '@/lib/kbData';
import { Search, ChevronRight, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageMeta } from '@/lib/usePageMeta';
import { MarketingShell } from '@/components/MarketingShell';

export default function HelpCenterPage() {
    usePageMeta({
        title: "Help Center",
        description: "Search the HomeSchool knowledge base for guides, FAQs, and platform support.",
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    // Extract unique categories
    const hiddenCategories = new Set(["Features", "Platform"]);
    const categories = Array.from(new Set(KB_DATA.map(item => item.category))).filter(
        (category) => !hiddenCategories.has(category)
    );

    // Filter items based on search and category
    const filteredItems = KB_DATA.filter(item => {
        if (hiddenCategories.has(item.category)) return false;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <MarketingShell>
            <div className="container mx-auto p-6 space-y-8 max-w-5xl">
                <div className="text-center space-y-4 py-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        How can we help you?
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Search our knowledge base for answers to common questions, platform guides, and more.
                    </p>

                    <div className="relative max-w-xl mx-auto mt-6">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search for articles (e.g., 'password', 'quizzes')..."
                            className="pl-10 py-6 text-lg shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                                <span className="font-medium">{category}</span>
                            </button>
                        ))}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">
                            {searchQuery ? `Search Results (${filteredItems.length})` :
                                selectedCategory ? selectedCategory : 'All Articles'}
                        </h2>
                        {selectedCategory && (
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="text-xs font-medium text-primary hover:underline"
                            >
                                Clear filter
                            </button>
                        )}
                    </div>

                    {filteredItems.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl">
                            <p>No articles found matching your search.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory(null) }}
                                className="text-primary hover:underline mt-2"
                            >
                                Clear filters
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
                                            <div className="text-sm text-primary font-medium">{item.category}</div>
                                            <CardTitle className="text-xl">{item.title}</CardTitle>
                                        </div>
                                        <ChevronRight className={cn(
                                            "h-5 w-5 text-muted-foreground transition-transform",
                                            expandedItem === item.id ? "rotate-90" : ""
                                        )} />
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
