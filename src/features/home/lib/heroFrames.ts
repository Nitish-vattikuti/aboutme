export const FRAME_COUNT = 169;

export const framePath = (n: number) =>
  `/frames/frame_${String(n).padStart(4, "0")}.jpg`;

/** Scroll progress at which hero text starts fading out */
export const HERO_TEXT_FADE_START = 0.02;
/** Scroll progress at which hero text is fully faded */
export const HERO_TEXT_FADE_END = 0.12;
