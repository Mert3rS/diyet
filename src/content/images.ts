import salad from "../../public/images/salad.webp";
import preparation from "../../public/images/preparation.webp";
import fruit from "../../public/images/fruit.webp";
import breakfast from "../../public/images/breakfast.webp";
import running from "../../public/images/sport-running.webp";
import type { StaticImageData } from "next/image";
import type { ImageKey } from "@/types/content";

type EditorialImage = {
  src: StaticImageData;
  alt: string;
  credit: string;
  source: string;
  license: string;
};
export const imageLibrary: Record<ImageKey, EditorialImage> = {
  salad: {
    src: salad,
    alt: "Nohut, yeşillik, domates ve renkli sebzelerle hazırlanmış salata kâsesi",
    credit: "Anna Pelzer / Unsplash",
    source: "https://unsplash.com/photos/IGfIGP5ONV0",
    license: "https://unsplash.com/license",
  },
  preparation: {
    src: preparation,
    alt: "Açık havadaki masada taze sebzelerle yapılan mutfak hazırlığı",
    credit: "Maarten van den Heuvel / Unsplash",
    source: "https://unsplash.com/photos/EzH46XCDQRY",
    license: "https://unsplash.com/license",
  },
  fruit: {
    src: fruit,
    alt: "Açık renkli masa üzerinde dilimlenmiş renkli meyveler",
    credit: "Brooke Lark / Unsplash",
    source: "https://unsplash.com/photos/08bOYnH_r_E",
    license: "https://unsplash.com/license",
  },
  breakfast: {
    src: breakfast,
    alt: "Mavi tabakta yumurta, sebzeler ve domateslerle hazırlanmış öğün",
    credit: "Brooke Lark / Unsplash",
    source: "https://unsplash.com/photos/jUPOXXRNdcA",
    license: "https://unsplash.com/license",
  },
};
export const portraitImage = {
  path: "/images/portrait.jpg",
  alt: "Günay Turan'ın portresi",
  credit: "Günay Turan tarafından sağlanacak; kullanım izni doğrulanmalı",
};

export const sportsImages = {
  running: {
    src: running,
    path: "/images/sport-running.webp",
    alt: "Açık hava pistinde gün ışığında koşan sporcu",
    credit: "Jorge Alberto Vega Barrera / Unsplash",
    source:
      "https://unsplash.com/photos/a-runner-sprints-on-a-track-in-the-golden-sunlight-1-nuy7fD3fw",
    license: "https://unsplash.com/license",
  },
} as const;
