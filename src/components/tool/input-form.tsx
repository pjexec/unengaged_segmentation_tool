"use client";

import * as React from "react";
import { ToolInput } from "@/lib/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InputFormProps {
    input: ToolInput;
    onChange: (key: keyof ToolInput, value: any) => void;
    onGenerate: () => void;
    isGenerating?: boolean;
}

export function InputForm({ input, onChange, onGenerate, isGenerating }: InputFormProps) {

    const handleSelectChange = (key: keyof ToolInput, value: string) => {
        onChange(key, value);
    };

    return (
        <div className="space-y-8">
            <Card className="border-0 shadow-none bg-transparent sm:bg-card sm:shadow-sm sm:border">
                <CardHeader className="px-0 sm:px-6">
                    <CardTitle>List Profile</CardTitle>
                    <CardDescription>Answer 6 quick questions to define your segments.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 px-0 sm:px-6">

                    {/* 1. Primary Signal */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">1. Primary engagement signal</Label>
                        <p className="text-sm text-muted-foreground">What do you rely on most to measure activity?</p>
                        <RadioGroup
                            value={input.primarySignal}
                            onValueChange={(val) => handleSelectChange('primarySignal', val)}
                            className="space-y-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="opens_clicks" id="sig-opens" />
                                <Label htmlFor="sig-opens" className="font-normal cursor-pointer">Opens + Clicks (Standard)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="clicks_only" id="sig-clicks" />
                                <Label htmlFor="sig-clicks" className="font-normal cursor-pointer">Clicks only (Conservative)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="conversions" id="sig-conv" />
                                <Label htmlFor="sig-conv" className="font-normal cursor-pointer">Purchases / Conversions</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="replies" id="sig-replies" />
                                <Label htmlFor="sig-replies" className="font-normal cursor-pointer">Replies (B2B/High-ticket)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="multiple" id="sig-multi" />
                                <Label htmlFor="sig-multi" className="font-normal cursor-pointer">Multiple signals combined</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* 2. Tracking Reliability */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">2. Tracking reliability</Label>
                        <p className="text-sm text-muted-foreground">Is your open tracking affected by MPP (Apple privacy)?</p>
                        <RadioGroup
                            value={input.reliability}
                            onValueChange={(val) => handleSelectChange('reliability', val)}
                            className="space-y-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="reliable" id="rel-reliable" />
                                <Label htmlFor="rel-reliable" className="font-normal cursor-pointer">Reliable (Rare)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="somewhat_reliable" id="rel-somewhat" />
                                <Label htmlFor="rel-somewhat" className="font-normal cursor-pointer">Somewhat reliable (Standard Mix)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="not_reliable" id="rel-not" />
                                <Label htmlFor="rel-not" className="font-normal cursor-pointer">Not reliable (Heavy Privacy/Tech Audience)</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* 3. Time Window */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">3. Time window you care about</Label>
                        <p className="text-sm text-muted-foreground">How far back is "too far" for your list?</p>
                        <Select
                            value={input.timeWindow}
                            onValueChange={(val) => handleSelectChange('timeWindow', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select timeframe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="60">60 days (Aggressive)</SelectItem>
                                <SelectItem value="90">90 days (Standard)</SelectItem>
                                <SelectItem value="120">120 days (Conservative)</SelectItem>
                                <SelectItem value="180">180 days (Very Relaxed)</SelectItem>
                                <SelectItem value="custom">Custom...</SelectItem>
                            </SelectContent>
                        </Select>
                        {input.timeWindow === "custom" && (
                            <div className="mt-2">
                                <Input
                                    type="number"
                                    placeholder="Enter days (e.g. 45)"
                                    value={input.customTimeWindow || ""}
                                    onChange={(e) => onChange('customTimeWindow', parseInt(e.target.value) || 0)}
                                />
                            </div>
                        )}
                    </div>

                    {/* 4. Frequency */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">4. Email frequency</Label>
                        <p className="text-sm text-muted-foreground">How often do you email the main list?</p>
                        <Select
                            value={input.frequency}
                            onValueChange={(val) => handleSelectChange('frequency', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="2_3_week">2–3x per week</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="less_weekly">Less than weekly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 5. Business Type */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">5. Business type</Label>
                        <p className="text-sm text-muted-foreground">Influences purchase cycles and engagement patterns.</p>
                        <Select
                            value={input.businessType}
                            onValueChange={(val) => handleSelectChange('businessType', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ecommerce">Ecommerce</SelectItem>
                                <SelectItem value="saas">SaaS</SelectItem>
                                <SelectItem value="info">Info / Creator</SelectItem>
                                <SelectItem value="agency">Agency / B2B</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 6. List Maturity */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">6. List maturity</Label>
                        <p className="text-sm text-muted-foreground">How old are your subscribers?</p>
                        <RadioGroup
                            value={input.listMaturity}
                            onValueChange={(val) => handleSelectChange('listMaturity', val)}
                            className="space-y-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="recent" id="mat-recent" />
                                <Label htmlFor="mat-recent" className="font-normal cursor-pointer">Mostly recent (Growing fast)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="mixed" id="mat-mixed" />
                                <Label htmlFor="mat-mixed" className="font-normal cursor-pointer">Mixed (Old + New)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="legacy" id="mat-legacy" />
                                <Label htmlFor="mat-legacy" className="font-normal cursor-pointer">Mostly legacy / Old list</Label>
                            </div>
                        </RadioGroup>
                    </div>

                </CardContent>
            </Card>

            {/* Sticky Mobile Generate Button */}
            <div className="sticky bottom-4 z-10 w-full sm:static sm:z-auto">
                <Button
                    size="lg"
                    className="w-full text-lg shadow-lg"
                    onClick={onGenerate}
                    disabled={isGenerating}
                >
                    {isGenerating ? "Generating..." : "Generate Segments"}
                </Button>
            </div>

        </div>
    );
}
