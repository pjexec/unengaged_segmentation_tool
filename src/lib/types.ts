export type EngagementSignal =
    | 'opens_clicks'
    | 'clicks_only'
    | 'conversions'
    | 'replies'
    | 'multiple';

export type TrackingReliability =
    | 'reliable'
    | 'somewhat_reliable'
    | 'not_reliable';

export type TimeWindow =
    | '60'
    | '90'
    | '120'
    | '180'
    | 'custom';

export type EmailFrequency =
    | 'daily'
    | '2_3_week'
    | 'weekly'
    | 'less_weekly';

export type BusinessType =
    | 'ecommerce'
    | 'saas'
    | 'info'
    | 'agency'
    | 'other';

export type ListMaturity =
    | 'recent'
    | 'mixed'
    | 'legacy';

export interface ToolInput {
    primarySignal: EngagementSignal;
    reliability: TrackingReliability;
    timeWindow: TimeWindow;
    customTimeWindow?: number;
    frequency: EmailFrequency;
    businessType: BusinessType;
    listMaturity: ListMaturity;
}

export interface SegmentationTier {
    name: string;
    rangeLabel: string;
    description: string;
    handling: string[];
    daysStart: number;
    daysEnd?: number; // undefined means "indefinite" / plus
}

export interface ToolOutput {
    definition: {
        title: string;
        bullets: string[];
    };
    tiers: {
        cooling: SegmentationTier;
        unengaged: SegmentationTier;
        dormant: SegmentationTier;
    };
    mistakes: string[];
}
