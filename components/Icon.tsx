import {
  Anchor,
  BedDouble,
  Building2,
  Car,
  Compass,
  Dumbbell,
  Fish,
  Gem,
  House,
  KeyRound,
  Landmark,
  MapPin,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Sun,
  TreePalm,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Waves,
  Wine,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/lib/project-schema";

const MAP: Record<IconName, LucideIcon> = {
  gem: Gem,
  "map-pin": MapPin,
  home: House,
  landmark: Landmark,
  "trending-up": TrendingUp,
  waves: Waves,
  anchor: Anchor,
  palm: TreePalm,
  sun: Sun,
  building: Building2,
  key: KeyRound,
  sparkles: Sparkles,
  utensils: UtensilsCrossed,
  dumbbell: Dumbbell,
  paw: PawPrint,
  car: Car,
  bed: BedDouble,
  users: Users,
  fish: Fish,
  glass: Wine,
  shield: ShieldCheck,
  compass: Compass,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Component = MAP[name];
  return <Component aria-hidden className={className} strokeWidth={1.25} />;
}
