import { USE_MOCK_CONTENT } from "@/config/site";
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
} from "@/content/mock-data";

export function getHomepageContent() {
  if (!USE_MOCK_CONTENT) return null;
  return {
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
  };
}
export type HomeContent = NonNullable<ReturnType<typeof getHomepageContent>>;
