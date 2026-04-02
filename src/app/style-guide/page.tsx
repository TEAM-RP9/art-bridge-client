"use client";

import { useEffect, useState } from "react";
import {
  Ds2TokenSections,
  Ds3ButtonSections,
  Ds4TypographySections,
  Ds5FormControlSections,
  Ds6BadgeTagChipSections,
  Ds7CardSections,
  StyleGuideQuickNav,
  StyleGuideHeader,
} from "./sections";

export default function StyleGuidePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Oil",
    "Landscape",
    "Original",
  ]);

  const removeTag = (tagToRemove: string): void => {
    setSelectedTags((previous) => previous.filter((item) => item !== tagToRemove));
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.documentElement.classList.toggle("light", !isDarkMode);

    return () => {
      document.documentElement.classList.remove("dark", "light");
    };
  }, [isDarkMode]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <StyleGuideHeader
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((previous) => !previous)}
      />

      <StyleGuideQuickNav />

      <Ds2TokenSections />
      <Ds3ButtonSections />
      <Ds4TypographySections />
      <Ds5FormControlSections
        notificationsEnabled={notificationsEnabled}
        onNotificationsChange={setNotificationsEnabled}
      />
      <Ds6BadgeTagChipSections
        selectedTags={selectedTags}
        onRemoveTag={removeTag}
      />
      <Ds7CardSections />
    </main>
  );
}
