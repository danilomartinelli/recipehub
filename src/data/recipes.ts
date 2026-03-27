
export interface Recipe {
  title: string;
  category: string;
  prepTimeLabel: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
}

export const recipes: Recipe[] = [
  {
    title: "Salmão Grelhado com Legumes",
    category: "Peixes",
    prepTimeLabel: "30 min",
    emoji: "🐟",
    gradientFrom: "from-blue-200",
    gradientTo: "to-blue-400",
  },
  {
    title: "Frango Xadrez Oriental",
    category: "Aves",
    prepTimeLabel: "45 min",
    emoji: "🍗",
    gradientFrom: "from-red-200",
    gradientTo: "to-red-400",
  },
  {
    title: "Salada de Quinoa com Abacate",
    category: "Vegetariano",
    prepTimeLabel: "20 min",
    emoji: "🥗",
    gradientFrom: "from-green-200",
    gradientTo: "to-green-400",
  },
  {
    title: "Macarrão ao Molho Pesto",
    category: "Massas",
    prepTimeLabel: "25 min",
    emoji: "🍝",
    gradientFrom: "from-purple-200",
    gradientTo: "to-purple-400",
  },
  {
    title: "Torta de Frutas Vermelhas",
    category: "Sobremesas",
    prepTimeLabel: "60 min",
    emoji: "🍓",
    gradientFrom: "from-pink-200",
    gradientTo: "to-pink-400",
  },
  {
    title: "Sopa de Lentilha com Ervas",
    category: "Sopas",
    prepTimeLabel: "40 min",
    emoji: "🍵",
    gradientFrom: "from-stone-200",
    gradientTo: "to-stone-400",
  },
];
