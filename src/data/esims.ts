import { plans, type Plan } from "./plans";

export type EsimStatus = "pending" | "active" | "expiring" | "expired";

export type OwnedEsim = {
  id: string;
  countryCode: string | null; // null = Global+
  planId: string;
  status: EsimStatus;
  dataUsedGb: number;
  purchasedLabel: string;
  expiresLabel: string;
  iccid: string;
  activationCode: string;
  smdpAddress: string;
};

export function planFor(esim: OwnedEsim): Plan {
  return plans.find((p) => p.id === esim.planId) ?? plans[0];
}

export const initialEsims: OwnedEsim[] = [
  {
    id: "esim-fr",
    countryCode: "FR",
    planId: "12gb",
    status: "active",
    dataUsedGb: 8.4,
    purchasedLabel: "3 Aug",
    expiresLabel: "Expires in 12 days",
    iccid: "8944 4801 2233 9901 12",
    activationCode: "GB2-FR93-KX881",
    smdpAddress: "rsp.globe-esim.com",
  },
  {
    id: "esim-tr",
    countryCode: "TR",
    planId: "4gb",
    status: "expiring",
    dataUsedGb: 3.8,
    purchasedLabel: "28 Jul",
    expiresLabel: "Expires tomorrow",
    iccid: "8944 4801 2233 8814 07",
    activationCode: "GB2-TR41-QW220",
    smdpAddress: "rsp.globe-esim.com",
  },
  {
    id: "esim-th",
    countryCode: "TH",
    planId: "22gb",
    status: "expired",
    dataUsedGb: 22,
    purchasedLabel: "2 Jun",
    expiresLabel: "Expired 14 Jun",
    iccid: "8944 4801 2233 7702 55",
    activationCode: "GB2-TH12-VN774",
    smdpAddress: "rsp.globe-esim.com",
  },
];

function randomSegment(length: number) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function createEsim(countryCode: string | null, planId: string): OwnedEsim {
  return {
    id: `esim-${Date.now()}-${randomSegment(4)}`,
    countryCode,
    planId,
    status: "pending",
    dataUsedGb: 0,
    purchasedLabel: "Today",
    expiresLabel: "Not installed yet",
    iccid: `8944 4801 2233 ${randomSegment(4)} ${randomSegment(2)}`,
    activationCode: `GB2-${randomSegment(4)}-${randomSegment(5)}`,
    smdpAddress: "rsp.globe-esim.com",
  };
}
