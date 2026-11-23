// Shared cart helpers. The Subscriptions page and the Cart page both use these,
// so the rules (one subscription at a time, stock limits) live in one place.
import list from '../data.js';

// The cart is saved as a small list like [{ id: 5, quantity: 2 }].
// Names, prices, and pictures are looked up from data.js, so they never go stale.

// Items 1-4 in data.js are subscriptions. Everything else is an EZTech accessory.
export function isSubscription(product) {
  return product.service.includes('Subscription');
}

export function findProduct(id) {
  return list.find((product) => product.id === id);
}

// The most a user can buy. In data.js, "amount" is how many are in stock
// (subscriptions have an amount of 1).
export function maxQuantity(product) {
  return isSubscription(product) ? 1 : product.amount;
}

// Returns a warning message if this product can't be added, or '' if it can.
export function addWarning(cart, product) {
  if (isSubscription(product)) {
    const current = cart
      .map((line) => findProduct(line.id))
      .find((item) => item && isSubscription(item));

    if (!current) return '';
    if (current.id === product.id) {
      return `${product.service} is already in your cart. You can only have one subscription at a time.`;
    }
    return `You already have the ${current.service} in your cart. Remove it first to switch to ${product.service}.`;
  }

  const line = cart.find((item) => item.id === product.id);
  if (line && line.quantity >= maxQuantity(product)) {
    return `Sorry, we only have ${product.amount.toLocaleString()} of these in stock.`;
  }
  return '';
}

// Add one of a product. Accessories that are already in the cart go up by one.
export function addItem(cart, product) {
  const line = cart.find((item) => item.id === product.id);
  if (line) {
    return cart.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    );
  }
  return [...cart, { id: product.id, quantity: 1 }];
}

// Change the quantity, keeping it between 1 and the stock limit.
export function setQuantity(cart, id, quantity) {
  const product = findProduct(id);
  if (!product || Number.isNaN(quantity)) return cart;
  const safe = Math.min(Math.max(quantity, 1), maxQuantity(product));
  return cart.map((item) => (item.id === id ? { ...item, quantity: safe } : item));
}

export function removeItem(cart, id) {
  return cart.filter((item) => item.id !== id);
}

// Total number of items, used by the Navbar badge (2 shirts + 1 plan = 3).
export function cartCount(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Full rows for the Cart page: product details plus quantity and line total.
// Prices are added up in cents so the total doesn't pick up rounding errors.
export function cartLines(cart) {
  return cart
    .map((item) => {
      const product = findProduct(item.id);
      if (!product) return null; // skip anything that is no longer in data.js
      const lineCents = Math.round(product.price * 100) * item.quantity;
      return { ...product, quantity: item.quantity, lineCents };
    })
    .filter(Boolean);
}

export function cartTotalCents(lines) {
  return lines.reduce((sum, line) => sum + line.lineCents, 0);
}

export function formatCents(cents) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}
