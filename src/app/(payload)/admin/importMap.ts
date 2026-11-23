import { AdminLogo, AdminIcon } from "@/components/admin/logo";
import { AdminDashboard } from "@/components/admin/dashboard";
import { AnalysisGuide } from "@/components/admin/analysis-guide";
import { AdminLoginIntro, AdminLoginFooter } from "@/components/admin/login";
import { VisualEditorView } from "@/components/admin/visual-editor-view";
import { VisualEditorLink } from "@/components/admin/visual-editor-link";
export const importMap = {
  "/components/admin/visual-editor-view#VisualEditorView": VisualEditorView,
  "/components/admin/visual-editor-link#VisualEditorLink": VisualEditorLink,
  "/components/admin/login#AdminLoginIntro": AdminLoginIntro,
  "/components/admin/login#AdminLoginFooter": AdminLoginFooter,
  "/components/admin/logo#AdminLogo": AdminLogo,
  "/components/admin/logo#AdminIcon": AdminIcon,
  "/components/admin/dashboard#AdminDashboard": AdminDashboard,
  "/components/admin/analysis-guide#AnalysisGuide": AnalysisGuide,
};
