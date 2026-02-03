import { toast } from "sonner";

import * as React from "react";
import { ToolOutput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, AlertTriangle, Download, ArrowRight, UserMinus, MailWarning, Clock, Terminal, Check } from "lucide-react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResultsPanelProps {
    output: ToolOutput | null;
    onReset: () => void;
}

export function ResultsPanel({ output, onReset }: ResultsPanelProps) {
    if (!output) return null;

    const [isCopied, setIsCopied] = React.useState(false);
    const [isShared, setIsShared] = React.useState(false);

    const handleCopy = () => {
        // Build plain text string
        const text = `
${output.definition.title}
${output.definition.bullets.map((b) => `- ${b}`).join('\n')}

SEGMENTATION TIERS
------------------
1. ${output.tiers.cooling.name} (${output.tiers.cooling.rangeLabel})
${output.tiers.cooling.description}
Handling:
${output.tiers.cooling.handling.map((h) => `- ${h}`).join('\n')}

2. ${output.tiers.unengaged.name} (${output.tiers.unengaged.rangeLabel})
${output.tiers.unengaged.description}
Handling:
${output.tiers.unengaged.handling.map((h) => `- ${h}`).join('\n')}

3. ${output.tiers.dormant.name} (${output.tiers.dormant.rangeLabel})
${output.tiers.dormant.description}
Handling:
${output.tiers.dormant.handling.map((h) => `- ${h}`).join('\n')}

COMMON MISTAKES
---------------
${output.mistakes.map((m) => `- ${m}`).join('\n')}
    `.trim();

        navigator.clipboard.writeText(text);
        trackEvent('results_copied');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleShare = async () => {
        const url = window.location.href;
        const title = 'UAI: Unengaged Audience Intelligence';
        const text = 'Check out this free tool to define your email engagement segments.';

        // Try native share first
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url,
                });
                trackEvent('link_shared_native');
                return;
            } catch (err) {
                // User cancelled or failed, fall back to copy
                console.debug('Share cancelled or failed', err);
            }
        }

        // Fallback to copy URL
        navigator.clipboard.writeText(url);
        trackEvent('link_shared_clipboard');
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold tracking-tight">Your Segmentation Plan</h2>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1 sm:flex-none">
                        {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {isCopied ? "Copied!" : "Copy"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 sm:flex-none">
                        {isShared ? <Check className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
                        {isShared ? "Link Copied!" : "Share"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onReset} className="flex-1 sm:flex-none">
                        Reset
                    </Button>
                </div>
            </div>

            {/* 1. Definition */}
            <Card className="border-l-4 border-l-primary shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg text-primary">{output.definition.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {output.definition.bullets.map((bullet, i) => (
                            <li key={i}>{bullet}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* 2. Segmentation Tiers */}
            <div className="grid gap-6 md:grid-cols-1">
                {/* Cooling */}
                <TierCard
                    icon={<Clock className="h-6 w-6 text-blue-500" />}
                    title={output.tiers.cooling.name}
                    range={output.tiers.cooling.rangeLabel}
                    description={output.tiers.cooling.description}
                    actions={output.tiers.cooling.handling}
                    colorClass="border-blue-200 bg-blue-50/50 dark:bg-blue-950/10"
                />
                {/* Unengaged */}
                <TierCard
                    icon={<MailWarning className="h-6 w-6 text-orange-500" />}
                    title={output.tiers.unengaged.name}
                    range={output.tiers.unengaged.rangeLabel}
                    description={output.tiers.unengaged.description}
                    actions={output.tiers.unengaged.handling}
                    colorClass="border-orange-200 bg-orange-50/50 dark:bg-orange-950/10"
                />
                {/* Dormant */}
                <TierCard
                    icon={<UserMinus className="h-6 w-6 text-red-500" />}
                    title={output.tiers.dormant.name}
                    range={output.tiers.dormant.rangeLabel}
                    description={output.tiers.dormant.description}
                    actions={output.tiers.dormant.handling}
                    colorClass="border-red-200 bg-red-50/50 dark:bg-red-950/10"
                />
            </div>

            {/* 3. Common Mistakes */}
            {output.mistakes.length > 0 && (
                <Card className="border-destructive/50 bg-destructive/5 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            <CardTitle className="text-lg text-destructive">Watch Out: Common Mistakes</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                            {output.mistakes.map((m, i) => (
                                <li key={i}>{m}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* 4. Next Actions */}
            <NextActions />

        </motion.div>
    );
}

function TierCard({ icon, title, range, description, actions, colorClass }: any) {
    return (
        <Card className={`border ${colorClass} shadow-none`}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                    {icon}
                    <div>
                        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                        <Badge variant="secondary" className="mt-1 font-mono text-xs">{range}</Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <p className="mb-4 text-sm text-muted-foreground">{description}</p>
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action Plan:</p>
                    <ul className="space-y-1">
                        {actions.map((action: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="mt-1 block h-1 w-1 rounded-full bg-foreground/50" />
                                <span>{action}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}

function NextActions() {
    const [checklistLoading, setChecklistLoading] = React.useState(false);
    const [checklistOpen, setChecklistOpen] = React.useState(false);

    const [dfyLoading, setDfyLoading] = React.useState(false);
    const [dfyOpen, setDfyOpen] = React.useState(false);

    const [waitlistLoading, setWaitlistLoading] = React.useState(false);
    const [waitlistOpen, setWaitlistOpen] = React.useState(false);

    // Form states
    const [checklistEmail, setChecklistEmail] = React.useState("");

    const [dfyName, setDfyName] = React.useState("");
    const [dfyEmail, setDfyEmail] = React.useState("");

    const [waitlistEmail, setWaitlistEmail] = React.useState("");

    const subscribe = async (email: string, firstName: string | undefined, setLoading: (l: boolean) => void, setOpen: (o: boolean) => void, successMessage: string, eventName: string) => {
        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, firstName }),
            });

            if (!res.ok) throw new Error('Subscription failed');

            trackEvent(eventName, { email });
            toast.success(successMessage);
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const submitChecklist = () => subscribe(checklistEmail, undefined, setChecklistLoading, setChecklistOpen, "Checklist sent to your inbox!", "checklist_submitted");
    const submitDFY = () => subscribe(dfyEmail, dfyName, setDfyLoading, setDfyOpen, "Request received! We'll be in touch.", "dfy_submitted");
    const submitWaitlist = () => subscribe(waitlistEmail, undefined, setWaitlistLoading, setWaitlistOpen, "You're on the list!", "waitlist_submitted");

    return (
        <div className="grid gap-4 md:grid-cols-3 pt-8">
            {/* Checklist */}
            <Dialog open={checklistOpen} onOpenChange={(open) => {
                setChecklistOpen(open);
                if (open) trackEvent('checklist_modal_opened');
            }}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="h-full w-full flex-col items-start justify-start p-4 hover:border-primary/50 transition-colors whitespace-normal text-left">
                        <Download className="mb-2 h-5 w-5 text-primary shrink-0" />
                        <div className="flex flex-col items-start gap-1">
                            <span className="font-semibold text-base">Get the Safety Checklist</span>
                            <span className="text-xs text-muted-foreground font-normal leading-normal">Verify your segments before hitting send.</span>
                        </div>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Get Unengaged Safety Checklist</DialogTitle>
                        <DialogDescription>
                            A 10-point checklist to ensure you don't accidentally suppress active customers.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>Email Address</Label>
                            <Input placeholder="you@example.com" value={checklistEmail} onChange={(e) => setChecklistEmail(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={submitChecklist} disabled={checklistLoading}>
                            {checklistLoading ? "Sending..." : "Get safety checklist"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DFY */}
            <Dialog open={dfyOpen} onOpenChange={(open) => {
                setDfyOpen(open);
                if (open) trackEvent('dfy_modal_opened');
            }}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="h-full w-full flex-col items-start justify-start p-4 hover:border-primary/50 transition-colors whitespace-normal text-left">
                        <Terminal className="mb-2 h-5 w-5 text-primary shrink-0" />
                        <div className="flex flex-col items-start gap-1">
                            <span className="font-semibold text-base">Request Implementation</span>
                            <span className="text-xs text-muted-foreground font-normal leading-normal">We define and build these segments for you.</span>
                        </div>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request Expert Implementation</DialogTitle>
                        <DialogDescription>
                            Stop guessing. We'll audit your list and build the segments in your ESP.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Name</Label>
                            <Input placeholder="Alex Smith" value={dfyName} onChange={(e) => setDfyName(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input placeholder="alex@company.com" value={dfyEmail} onChange={(e) => setDfyEmail(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={submitDFY} disabled={dfyLoading}>
                            {dfyLoading ? "Requesting..." : "Request Call"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Waitlist */}
            <Dialog open={waitlistOpen} onOpenChange={(open) => {
                setWaitlistOpen(open);
                if (open) trackEvent('waitlist_modal_opened');
            }}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="h-full w-full flex-col items-start justify-start p-4 hover:border-primary/50 transition-colors whitespace-normal text-left">
                        <ArrowRight className="mb-2 h-5 w-5 text-primary shrink-0" />
                        <div className="flex flex-col items-start gap-1">
                            <span className="font-semibold text-base">Join ReEngage Pro</span>
                            <span className="text-xs text-muted-foreground font-normal leading-normal">Get early access to our automated cleaning tool.</span>
                        </div>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Join the ReEngage Pro Waitlist</DialogTitle>
                        <DialogDescription>
                            We're building a tool that does this automatically. Want in?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input placeholder="alex@company.com" value={waitlistEmail} onChange={(e) => setWaitlistEmail(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={submitWaitlist} disabled={waitlistLoading}>
                            {waitlistLoading ? "Joining..." : "Join Waitlist"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
