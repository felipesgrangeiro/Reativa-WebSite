export type HelpSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type PageHelpContent = {
  title: string;
  intro?: string;
  sections: HelpSection[];
};
