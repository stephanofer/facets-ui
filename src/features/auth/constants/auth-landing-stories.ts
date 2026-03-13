export interface AuthLandingStoryItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const AUTH_LANDING_STORIES: AuthLandingStoryItem[] = [
  {
    id: "overview",
    title: "Toda tu plata, más clara",
    description:
      "Un solo lugar para entender ingresos, gastos, cuentas y movimientos sin perderte en planillas eternas.",
    image: "https://illustrations.popsy.co/violet/work-from-home.svg",
  },
  {
    id: "tracking",
    title: "Registrá lo importante",
    description:
      "Cargá movimientos, organizá cuentas y mantené contexto real de lo que pasa con tu guita.",
    image: "https://illustrations.popsy.co/violet/graphic-design.svg",
  },
  {
    id: "goals",
    title: "Metas y deudas, sin quilombo",
    description:
      "Seguí objetivos, préstamos y compromisos para tomar decisiones con información y no por intuición.",
    image: "https://illustrations.popsy.co/violet/success.svg",
  },
  {
    id: "insights",
    title: "Mejores decisiones",
    description:
      "Visualizá patrones y entendé a dónde se va tu plata antes de que el problema te explote en la cara.",
    image: "https://illustrations.popsy.co/violet/analytics.svg",
  },
];

export const AUTH_LANDING_STORY_AUTO_ADVANCE_MS = 5000;
