import { getProduct, getVariant, products } from "../data/shop.js";

const commerce = {
  product_id: "passage-32",
  color: "black",
  bundle: { id: "organization_pack", enabled: false, price_eur: 20 },
  cart: { id: "cart_prsim", line_items: [] },
  checkout: null,
};

const clone = (value) => structuredClone(value);

export function getCommerceState() {
  return clone(commerce);
}

export function selectVariant(productId = commerce.product_id, color = commerce.color) {
  const variant = getVariant(productId, color);
  commerce.product_id = variant.product_id;
  commerce.color = variant.color;
  return clone(variant);
}

export function setBundle(bundleId = "organization_pack", enabled = true) {
  commerce.bundle = { id: bundleId, enabled: Boolean(enabled), price_eur: bundleId === "gift_pack" ? 12 : 20 };
  return clone(commerce.bundle);
}

export function serializeCart() {
  const lineItems = commerce.cart.line_items.map((line) => {
    const variant = products.flatMap((product) => product.variants).find((item) => item.id === line.variant_id);
    return { ...line, price_eur: variant?.price_eur || 0, title: getProduct(variant?.product_id).title };
  });
  const subtotal = lineItems.reduce((total, line) => total + line.price_eur * line.quantity, 0);
  return { ...clone(commerce.cart), line_items: lineItems, subtotal_eur: subtotal };
}

export function createCart(input = {}) {
  commerce.cart = { id: `cart_${Math.random().toString(36).slice(2, 10)}`, line_items: [] };
  if (input.line_items) replaceCartItems(input.line_items);
  return serializeCart();
}

function normalizeLineItem(line) {
  return {
    variant_id: line.variant_id || line.item?.id || line.id,
    quantity: Math.max(0, Number(line.quantity || 1)),
  };
}

function replaceCartItems(items = []) {
  commerce.cart.line_items = items.map(normalizeLineItem).filter((line) => line.variant_id && line.quantity > 0);
}

export function updateCart(args = {}) {
  if (args.cart?.line_items || args.line_items) {
    replaceCartItems(args.cart?.line_items || args.line_items);
    return serializeCart();
  }

  for (const operation of args.operations || []) {
    const variantId = operation.variant_id;
    const existing = commerce.cart.line_items.find((line) => line.variant_id === variantId);
    if (operation.action === "remove") {
      commerce.cart.line_items = commerce.cart.line_items.filter((line) => line.variant_id !== variantId);
    } else if (operation.action === "set_quantity") {
      if (existing) existing.quantity = Math.max(0, Number(operation.quantity || 0));
    } else if (operation.action === "add") {
      if (existing) existing.quantity += Math.max(1, Number(operation.quantity || 1));
      else commerce.cart.line_items.push({ variant_id: variantId, quantity: Math.max(1, Number(operation.quantity || 1)) });
    }
  }
  commerce.cart.line_items = commerce.cart.line_items.filter((line) => line.quantity > 0);
  return serializeCart();
}

export function cancelCart() {
  commerce.cart.line_items = [];
  return serializeCart();
}

export function createCheckout(args = {}) {
  const cart = serializeCart();
  commerce.checkout = {
    id: `checkout_${Math.random().toString(36).slice(2, 10)}`,
    cart_id: args.cart_id || cart.id,
    status: "requires_buyer_review",
    line_items: args.checkout?.line_items || cart.line_items,
    continue_url: `${location.origin}${location.pathname}#payment`,
  };
  return clone(commerce.checkout);
}

export function getCheckout() {
  return clone(commerce.checkout);
}

export function updateCheckout(args = {}) {
  if (!commerce.checkout) createCheckout(args);
  commerce.checkout = { ...commerce.checkout, ...(args.checkout || {}), id: commerce.checkout.id };
  return clone(commerce.checkout);
}

export function completeCheckout() {
  if (!commerce.checkout) createCheckout();
  commerce.checkout.status = "completed";
  commerce.checkout.order = { id: `order_${Math.random().toString(36).slice(2, 10)}`, status: "confirmed" };
  return clone(commerce.checkout);
}

export function cancelCheckout() {
  if (commerce.checkout) commerce.checkout.status = "canceled";
  return clone(commerce.checkout);
}
