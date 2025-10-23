import { Collection } from "./types";

export const collections: Collection[] = [
  {
    id: "col-1",
    name: "Утренний уход",
    description: "Полный набор средств для утреннего ухода за кожей лица",
    productIds: [
      { productId: "prod-1", recommendedVolumeIndex: 0 }, // Гидрофильное масло 150ml
      { productId: "prod-2", recommendedVolumeIndex: 0 }, // Пенка для умывания 150ml
      { productId: "prod-4", recommendedVolumeIndex: 1 }, // Увлажняющий тонер 400ml
      { productId: "prod-6", recommendedVolumeIndex: 0 }, // Сыворотка с гиалуроновой кислотой 30ml
    ],
  },
  {
    id: "col-2",
    name: "Сияние и осветление",
    description: "Специальный уход для сияющей кожи и борьбы с пигментацией",
    productIds: [
      { productId: "prod-5", recommendedVolumeIndex: 0 }, // Ампулы с витамином C 30ml
      { productId: "prod-3", recommendedVolumeIndex: 0 }, // Энзимная пудра 50g
      { productId: "prod-7", recommendedVolumeIndex: 0 }, // Ферментированная эссенция 150ml
    ],
  },
  {
    id: "col-3",
    name: "Интенсивное увлажнение",
    description: "Максимальное увлажнение для сухой и обезвоженной кожи",
    productIds: [
      { productId: "prod-6", recommendedVolumeIndex: 1 }, // Сыворотка с гиалуроновой кислотой 50ml
      { productId: "prod-4", recommendedVolumeIndex: 1 }, // Увлажняющий тонер 400ml
      { productId: "prod-7", recommendedVolumeIndex: 0 }, // Ферментированная эссенция 150ml
    ],
  },
];
