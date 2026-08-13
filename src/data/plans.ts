export type Plan = {
  id: string;
  dataGb: number;
  days: number;
  price: number;
};

export const plans: Plan[] = [
  { id: "4gb", dataGb: 4, days: 30, price: 8 },
  { id: "12gb", dataGb: 12, days: 30, price: 20 },
  { id: "22gb", dataGb: 22, days: 30, price: 40 },
];

export const defaultPlanId = "12gb";
