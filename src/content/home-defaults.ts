import {
  mockBlog,
  mockCopy,
  mockFaqs,
  mockGoals,
  mockIdentity,
  mockPackages,
  mockProcess,
  mockServices,
  mockTags,
  mockTestimonials,
  mockTrust,
} from "./mock-data";
import type {
  BlogPreview,
  Faq,
  Goal,
  Package,
  ProcessStep,
  Service,
  Testimonial,
  MockRecord,
} from "@/types/content";

export type HomeCopy = {
  -readonly [K in keyof typeof mockCopy]: {
    -readonly [F in keyof (typeof mockCopy)[K]]: F extends "isMock"
      ? boolean
      : string;
  };
};
export type HomeContent = {
  isMock: boolean;
  copy: HomeCopy;
  identity: {
    isMock: boolean;
    name: string;
    title: string;
    titleStatus: string;
    slogan: string;
    bio: string;
    approach: string;
  };
  services: Service[];
  tags: (MockRecord & { label: string })[];
  trust: (MockRecord & { label: string })[];
  process: ProcessStep[];
  goals: Goal[];
  packages: Package[];
  testimonials: Testimonial[];
  blog: BlogPreview[];
  faqs: Faq[];
};
export function defaultHomepageContent(): HomeContent {
  return structuredClone({
    isMock: true,
    copy: mockCopy,
    identity: mockIdentity,
    services: mockServices,
    tags: mockTags,
    trust: mockTrust,
    process: mockProcess,
    goals: mockGoals,
    packages: mockPackages,
    testimonials: mockTestimonials,
    blog: mockBlog,
    faqs: mockFaqs,
  });
}
