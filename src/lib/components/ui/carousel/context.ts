export type CarouselAPI = {
  scrollNext: () => void;
  scrollPrev: () => void;
  scrollTo: (index: number) => void;
  selectedScrollSnap: () => number;
  scrollSnapList: () => number[];
  on: (event: string, callback: () => void) => void;
  off: (event: string, callback: () => void) => void;
  canScrollNext: () => boolean;
  canScrollPrev: () => boolean;
  plugins: unknown[];
  options: unknown;
  destroy: () => void;
  reInit: () => void;
};

export type CarouselOptions = {
  loop?: boolean;
  align?: "start" | "center" | "end" | number;
  axis?: "x" | "y";
  slides?: string;
  container?: string;
  dragFree?: boolean;
  dragThreshold?: number;
  duration?: number;
};

export type CarouselPlugin = unknown;
