import { CartItem } from "@/types/types";

const LIKED_PRODUCTS_KEY = "likedProducts";
const CART_KEY = "cart";

// ============== Liked Products ==============

/**
 * Получить список ID лайкнутых товаров из localStorage
 */
export function getLikedProducts(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const liked = localStorage.getItem(LIKED_PRODUCTS_KEY);
    return liked ? JSON.parse(liked) : [];
  } catch (error) {
    console.error("Error reading liked products:", error);
    return [];
  }
}

/**
 * Переключить лайк товара
 */
export function toggleLike(productId: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const liked = getLikedProducts();
    const index = liked.indexOf(productId);

    if (index > -1) {
      // Удалить из лайков
      liked.splice(index, 1);
      localStorage.setItem(LIKED_PRODUCTS_KEY, JSON.stringify(liked));
      return false;
    } else {
      // Добавить в лайки
      liked.push(productId);
      localStorage.setItem(LIKED_PRODUCTS_KEY, JSON.stringify(liked));
      return true;
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return false;
  }
}

/**
 * Проверить, лайкнут ли товар
 */
export function isProductLiked(productId: string): boolean {
  const liked = getLikedProducts();
  return liked.includes(productId);
}

// ============== Cart ==============

/**
 * Получить корзину из localStorage
 */
export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error reading cart:", error);
    return [];
  }
}

/**
 * Добавить товар в корзину или увеличить количество, если уже есть
 */
export function addToCart(item: CartItem): void {
  if (typeof window === "undefined") return;

  try {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(
      (cartItem) =>
        cartItem.productId === item.productId &&
        cartItem.volumeIndex === item.volumeIndex
    );

    if (existingItemIndex > -1) {
      // Товар уже в корзине, увеличиваем количество
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      // Добавляем новый товар
      cart.push(item);
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
}

/**
 * Удалить товар из корзины
 */
export function removeFromCart(productId: string, volumeIndex: number): void {
  if (typeof window === "undefined") return;

  try {
    const cart = getCart();
    const updatedCart = cart.filter(
      (item) =>
        !(item.productId === productId && item.volumeIndex === volumeIndex)
    );

    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
}

/**
 * Обновить количество товара в корзине
 */
export function updateCartQuantity(
  productId: string,
  volumeIndex: number,
  quantity: number
): void {
  if (typeof window === "undefined") return;

  try {
    const cart = getCart();
    const itemIndex = cart.findIndex(
      (item) => item.productId === productId && item.volumeIndex === volumeIndex
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        // Если количество 0 или меньше, удаляем товар
        removeFromCart(productId, volumeIndex);
      } else {
        // Обновляем количество
        cart[itemIndex].quantity = quantity;
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
      }
    }
  } catch (error) {
    console.error("Error updating cart quantity:", error);
  }
}

/**
 * Очистить корзину
 */
export function clearCart(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CART_KEY, JSON.stringify([]));
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
}

/**
 * Получить количество уникальных товаров в корзине
 */
export function getCartItemsCount(): number {
  return getCart().length;
}

/**
 * Получить общее количество товаров в корзине (с учетом quantity)
 */
export function getCartTotalQuantity(): number {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

export const getMinPrice = (volumes: { volume: string; price: number }[]) => {
  if (!volumes || volumes.length === 0) return 0;
  return Math.min(...volumes.map((v) => v.price));
};

export const shortDesc = (text: string, max = 120) => {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
};
