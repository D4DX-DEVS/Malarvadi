"use client";
// Icons are stored in the DB as lucide names; this maps name → component.
// Keep the list in sync with ICON_OPTIONS in lib/content-registry.ts.
import {
  Rainbow, GraduationCap, PartyPopper, Sprout, Microscope, HeartHandshake, Palette, BookOpen, Heart, UsersRound,
  TentTree, Trophy, Star, Sparkles, Building2, Camera, Flower2, TreePine, Leaf, Sun, Baby, UserRound, Megaphone,
  CalendarDays, Pencil, CircleHelp, Music, Drama, Globe, Bike, type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

const MAP: Record<string, ComponentType<LucideProps>> = {
  Rainbow, GraduationCap, PartyPopper, Sprout, Microscope, HeartHandshake, Palette, BookOpen, Heart, UsersRound,
  TentTree, Trophy, Star, Sparkles, Building2, Camera, Flower2, TreePine, Leaf, Sun, Baby, UserRound, Megaphone,
  CalendarDays, Pencil, CircleHelp, Music, Drama, Globe, Bike,
};

export function Icon({ name, fallback = "Sparkles", ...props }: { name?: string; fallback?: string } & LucideProps) {
  const C = (name && MAP[name]) || MAP[fallback] || Sparkles;
  return <C {...props} />;
}
