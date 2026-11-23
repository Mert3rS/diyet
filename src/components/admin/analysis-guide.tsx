"use client";
import { useForm, useFormFields } from "@payloadcms/ui";
import {
  DEFAULT_MESSAGE_TEMPLATE,
  DISCLAIMER,
  CONSENT,
} from "@/content/body-analysis";
import { renderTemplate } from "@/lib/body-analysis/messages";
export function AnalysisGuide() {
  const template = useFormFields(
    ([fields]) => fields.messageTemplate?.value,
  ) as string | undefined;
  const { dispatchFields, setModified } = useForm();
  const example = renderTemplate(template || DEFAULT_MESSAGE_TEMPLATE, {
    ad: "Örnek kişi",
    cinsiyet: "Kadın",
    yas: "30",
    boy: "170,0",
    kilo: "65,0",
    vki: "22,5",
    yag_orani: "%24–33 (tahmini aralık)",
    hizmet: "Kişiye özel danışmanlık",
  });
  return (
    <div className="admin-analysis-guide">
      <h3>Örnek değerlerle önizleme</h3>
      <pre>{example}</pre>
      <button
        type="button"
        className="admin-reset"
        onClick={() => {
          dispatchFields({
            type: "UPDATE",
            path: "messageTemplate",
            value: DEFAULT_MESSAGE_TEMPLATE,
          });
          setModified(true);
        }}
      >
        Şablonu varsayılana sıfırla
      </button>
      <h3>Değiştirilemeyen güvenlik kuralları</h3>
      <p>
        Formüller, hata payları, 18 yaş sınırı, tahmini aralık etiketi ve
        aşağıdaki metinler sabittir. Satır anahtarları yalnız mesajı değiştirir.
      </p>
      <p>{DISCLAIMER}</p>
      <p>{CONSENT}</p>
    </div>
  );
}
