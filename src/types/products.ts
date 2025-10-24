import { Product } from "./types";

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Гидрофильное масло",
    description:
      "Мягко растворяет макияж и загрязнения. Подходит для всех типов кожи, не оставляет жирной пленки.",
    image: "https://picsum.photos/200/150",
    volumes: [
      { volume: "150ml", price: 1290 },
      { volume: "250ml", price: 1990 },
    ],
    categoryId: "cat-1",
    isLiked: false,
  },
  {
    id: "prod-2",
    name: "Пенка для умывания",
    description:
      "Мягко очищает кожу, не пересушивая. Содержит экстракт алоэ вера и гиалуроновую кислоту.",
    image: "https://picsum.photos/150/300",
    volumes: [
      { volume: "150ml", price: 890 },
      { volume: "250ml", price: 1390 },
    ],
    categoryId: "cat-1",
    isLiked: false,
  },
  {
    id: "prod-3",
    name: "Энзимная пудра",
    description:
      "Деликатное отшелушивание мертвых клеток. Выравнивает тон и текстуру кожи.",
    image: "https://picsum.photos/300/300",
    volumes: [
      { volume: "50g", price: 1590 },
      { volume: "100g", price: 2690 },
    ],
    categoryId: "cat-2",
    isLiked: false,
  },
  {
    id: "prod-4",
    name: "Увлажняющий тонер",
    description:
      "Восстанавливает pH баланс кожи. Глубоко увлажняет и подготавливает к следующим этапам ухода.",
    image: "https://picsum.photos/200/200",
    volumes: [
      { volume: "200ml", price: 990 },
      { volume: "400ml", price: 1690 },
    ],
    categoryId: "cat-3",
    isLiked: false,
  },
  {
    id: "prod-5",
    name: "Ампулы с витамином C",
    description:
      "Концентрированная формула для сияния кожи. Осветляет пигментацию и повышает упругость.",
    image: "https://picsum.photos/150/150",
    volumes: [
      { volume: "30ml", price: 2190 },
      { volume: "50ml", price: 3290 },
    ],
    categoryId: "cat-4",
    isLiked: false,
  },
  {
    id: "prod-6",
    name: "Сыворотка с гиалуроновой кислотой",
    description:
      "Интенсивное увлажнение на всех уровнях кожи. Разглаживает мелкие морщинки.",
    image: "https://picsum.photos/200/250",
    volumes: [
      { volume: "30ml", price: 1890 },
      { volume: "50ml", price: 2990 },
    ],
    categoryId: "cat-5",
    isLiked: false,
  },
  {
    id: "prod-7",
    name: "Ферментированная эссенция",
    description:
      "Насыщает кожу питательными веществами. Улучшает текстуру и повышает эластичность.",
    image: "https://picsum.photos/250/250",
    volumes: [{ volume: "150ml", price: 2490 }],
    categoryId: "cat-6",
    isLiked: false,
  },
];
