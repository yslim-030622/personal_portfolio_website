export type Locale = "en" | "ko";

export type Bilingual = {
  en: string;
  ko: string;
};

export type BilingualParagraph = Bilingual;

export type OptionalLink = {
  label: Bilingual;
  href?: string | Bilingual;
  external?: boolean;
  ariaLabel?: Bilingual;
};

export type ProjectPreviewImage = {
  src: string;
  alt: Bilingual;
  width: number;
  height: number;
};

export type EmptySlot = {
  status: "empty";
  note?: string;
};

export type RawWorkEntry =
  | {
      status: "filled";
      company: string;
      companyUrl?: string;
      dates: string | Bilingual;
      location: Bilingual;
      role: Bilingual;
      paragraph: BilingualParagraph;
      highlights?: BilingualParagraph[];
      photos?: {
        src: string;
        alt: Bilingual;
        width: number;
        height: number;
      }[];
      links?: OptionalLink[];
    }
  | EmptySlot;

export type RawProjectEntry =
  | {
      status: "filled";
      title: string;
      kindDate: string;
      description: BilingualParagraph;
      highlights?: BilingualParagraph[];
      previewImages?: ProjectPreviewImage[];
      tech: string[];
      links?: OptionalLink[];
    }
  | EmptySlot;

export type RawNoteEntry = {
  title: Bilingual;
  date: string;
  tag: string;
  body: BilingualParagraph;
};

export type RawPortfolioContent = {
  sectionEyebrows: {
    work: Bilingual;
    projects: Bilingual;
    notes: Bilingual;
    skills: Bilingual;
  };
  hero: {
    eyebrow: Bilingual;
    headline: {
      name: Bilingual;
      before: Bilingual;
      italic: Bilingual;
      after: Bilingual;
    };
    subline: BilingualParagraph;
    image: {
      src: string;
      alt: Bilingual;
      width: number;
      height: number;
    };
    links: OptionalLink[];
  };
  work: RawWorkEntry[];
  projects: RawProjectEntry[];
  notes: {
    intro: BilingualParagraph;
    items: RawNoteEntry[];
  };
  skills: {
    title: Bilingual;
    body: BilingualParagraph;
  }[];
  footer: {
    line1: Bilingual;
    line2: string;
  };
  seo: {
    title: Bilingual;
    description: Bilingual;
    person: {
      name: Bilingual;
      email: string;
      location: string;
      githubUrl?: string;
      linkedInUrl?: string;
      resumeUrl?: string;
    };
  };
};

export type LocalizedOptionalLink = {
  label: string;
  href?: string;
  external?: boolean;
  ariaLabel?: string;
};

export type LocalizedEmptySlot = EmptySlot;

export type LocalizedWorkEntry =
  | {
      status: "filled";
      company: string;
      companyUrl?: string;
      dates: string;
      location: string;
      role: string;
      paragraph: string;
      highlights?: string[];
      photos?: {
        src: string;
        alt: string;
        width: number;
        height: number;
      }[];
      links?: LocalizedOptionalLink[];
    }
  | LocalizedEmptySlot;

export type LocalizedProjectEntry =
  | {
      status: "filled";
      title: string;
      kindDate: string;
      description: string;
      highlights?: string[];
      previewImages?: {
        src: string;
        alt: string;
        width: number;
        height: number;
      }[];
      tech: string[];
      links?: LocalizedOptionalLink[];
    }
  | LocalizedEmptySlot;

export type LocalizedNoteEntry = {
  title: string;
  date: string;
  tag: string;
  body: string;
};

export type LocalizedPortfolioContent = {
  sectionEyebrows: {
    work: string;
    projects: string;
    notes: string;
    skills: string;
  };
  hero: {
    eyebrow: string;
    headline: {
      name: string;
      before: string;
      italic: string;
      after: string;
    };
    subline: string;
    image: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
    links: LocalizedOptionalLink[];
  };
  work: LocalizedWorkEntry[];
  projects: LocalizedProjectEntry[];
  notes: {
    intro: string;
    items: LocalizedNoteEntry[];
  };
  skills: {
    title: string;
    body: string;
  }[];
  footer: {
    line1: string;
    line2: string;
  };
  seo: {
    title: string;
    description: string;
    person: {
      name: string;
      email: string;
      location: string;
      githubUrl?: string;
      linkedInUrl?: string;
      resumeUrl?: string;
    };
  };
};
