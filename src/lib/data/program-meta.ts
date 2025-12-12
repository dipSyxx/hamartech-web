import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  Gamepad2,
  ScanEye,
  Code2,
  BriefcaseBusiness,
} from "lucide-react";

export type TrackId = "creative" | "games" | "xr" | "youth" | "business";
export type DayId =
  | "day1"
  | "day2"
  | "day3"
  | "day4"
  | "day5"
  | "day6"
  | "day7";

export const TRACK_META: Record<
  TrackId,
  {
    label: string;
    shortLabel: string;
    icon: LucideIcon;
    badgeClass: string;
    pillClass: string;
  }
> = {
  creative: {
    label: "HamarTech:Creative",
    shortLabel: "Creative",
    icon: Sparkles,
    badgeClass: "border-chart-1/70 bg-chart-1/10 text-chart-1",
    pillClass: "border-chart-1/70 bg-chart-1/10 text-chart-1",
  },
  games: {
    label: "HamarTech:Games",
    shortLabel: "Games",
    icon: Gamepad2,
    badgeClass: "border-chart-2/70 bg-chart-2/10 text-chart-2",
    pillClass: "border-chart-2/70 bg-chart-2/10 text-chart-2",
  },
  xr: {
    label: "HamarTech:XR",
    shortLabel: "XR",
    icon: ScanEye,
    badgeClass: "border-chart-3/70 bg-chart-3/10 text-chart-3",
    pillClass: "border-chart-3/70 bg-chart-3/10 text-chart-3",
  },
  youth: {
    label: "HamarTech:Youth",
    shortLabel: "Youth",
    icon: Code2,
    badgeClass: "border-chart-4/70 bg-chart-4/10 text-chart-4",
    pillClass: "border-chart-4/70 bg-chart-4/10 text-chart-4",
  },
  business: {
    label: "HamarTech:Business",
    shortLabel: "Business",
    icon: BriefcaseBusiness,
    badgeClass: "border-chart-5/70 bg-chart-5/10 text-chart-5",
    pillClass: "border-chart-5/70 bg-chart-5/10 text-chart-5",
  },
};

export const DAY_OPTIONS: {
  id: DayId | "all";
  label: string;
  shortLabel: string;
}[] = [
  { id: "all", label: "Alle dager", shortLabel: "Alle dager" },
  {
    id: "day1",
    label: "Dag 1 – Opening & Media Arts",
    shortLabel: "Dag 1",
  },
  {
    id: "day2",
    label: "Dag 2 – Games & E-sport",
    shortLabel: "Dag 2",
  },
  {
    id: "day3",
    label: "Dag 3 – XR & Immersive Learning",
    shortLabel: "Dag 3",
  },
  {
    id: "day4",
    label: "Dag 4 – Youth & Coding",
    shortLabel: "Dag 4",
  },
  {
    id: "day5",
    label: "Dag 5 – Family & City Experience",
    shortLabel: "Dag 5",
  },
  {
    id: "day6",
    label: "Dag 6 – Business & Innovation",
    shortLabel: "Dag 6",
  },
  {
    id: "day7",
    label: "Dag 7 – International & Closing Day",
    shortLabel: "Dag 7",
  },
];
