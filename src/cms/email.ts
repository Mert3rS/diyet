import { APIError, type EmailAdapter } from "payload";
// No console transport: reset requests must not leak addresses or pretend mail was sent.
export const disabledEmailAdapter: EmailAdapter = () => ({
  name: "disabled",
  defaultFromAddress: "no-reply@example.invalid",
  defaultFromName: "Günay Turan",
  sendEmail: async () => {
    throw new APIError(
      "E-posta ile şifre sıfırlama henüz yapılandırılmadı. Yönetici desteğiyle şifrenizi değiştirin.",
      503,
    );
  },
});
