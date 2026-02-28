export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "welcome",
    title: "Bienvenido a Facets",
    description:
      "Tu compañero financiero inteligente. Tomá el control total de tu dinero desde un solo lugar.",
    image: "https://illustrations.popsy.co/violet/work-from-home.svg",
  },
  {
    id: "track",
    title: "Registrá todo",
    description:
      "Ingresos, gastos, cuentas y tarjetas. Todo organizado automáticamente para que no se te escape nada.",
    image: "https://illustrations.popsy.co/violet/graphic-design.svg",
  },
  {
    id: "goals",
    title: "Alcanzá tus metas",
    description:
      "Definí objetivos de ahorro, gestioná deudas y prestamos. Facets te muestra el camino.",
    image: "https://illustrations.popsy.co/violet/success.svg",
  },
  {
    id: "insights",
    title: "Decisiones inteligentes",
    description:
      "Visualizá a dónde va tu plata con reportes claros. Menos sorpresas, más control.",
    image: "https://illustrations.popsy.co/violet/analytics.svg",
  },
];

export const STORY_AUTO_ADVANCE_DURATION = 5000;
