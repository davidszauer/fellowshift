import type { Campaign } from "@/types/campaign";
import { lotrRuCampaign } from "@/features/progression/campaigns/lotrRuCampaign";
import { starterEnCampaign } from "@/features/progression/campaigns/starterEnCampaign";
import { starterHuCampaign } from "@/features/progression/campaigns/starterHuCampaign";

export const campaignsById: Record<string, Campaign> = {
  [lotrRuCampaign.id]: lotrRuCampaign,
  [starterEnCampaign.id]: starterEnCampaign,
  [starterHuCampaign.id]: starterHuCampaign,
};

export function getCampaign(campaignId: string): Campaign | null {
  return campaignsById[campaignId] ?? null;
}

