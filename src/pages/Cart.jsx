import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import {
  isSubscription,
  maxQuantity,
  setQuantity,
  removeItem,
  cartLines,
  cartCount,
  cartTotalCents,
  formatCents,
} from '../utils/cart.js';

// The number box for one cart line.
// It keeps its own "draft" text so the user can clear the box and type a new number.
// (Before, an empty box was ignored and the old number jumped right back.)
function QuantityInput({ line, onChange }) {
  const [draft, setDraft] = useState(String(line.quantity));
  const [shownQuantity, setShownQuantity] = useState(line.quantity);

  // When the - or + buttons change the quantity, show the new number in the box.
  if (line.quantity !== shownQuantity) {
    setShownQuantity(line.quantity);
    setDraft(String(line.quantity));
  }

  const handleChange = (event) => {
    const text = event.target.value;
    setDraft(text); // always show what the user typed, even an empty box
    const number = parseInt(text, 10);
    if (number >= 1) onChange(number); // only update the cart for real numbers (setQuantity clamps to stock)
  };

  return (
    <input
      type="number"
      className="qty-input"
      inputMode="numeric"
      min="1"
      max={maxQuantity(line)}
      value={draft}
      onChange={handleChange}
      onBlur={() => setDraft(String(line.quantity))} // left empty or 0? put the real quantity back
      onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
      aria-label="Quantity"
    />
  );
}

// Cart page: summary of added items, quantity controls, remove, and the total price.
function Cart({ cart, setCart }) {
  const [lastRemoved, setLastRemoved] = useState(null); // for the Undo button

  useEffect(() => {
    if (!lastRemoved) return;
    const timer = setTimeout(() => setLastRemoved(null), 5000);
    return () => clearTimeout(timer);
  }, [lastRemoved]);

  const lines = cartLines(cart);
  const itemCount = cartCount(cart);
  const totalCents = cartTotalCents(lines);

  const changeQuantity = (id, quantity) => {
    setCart(setQuantity(cart, id, quantity));
  };

  const remove = (line) => {
    const index = cart.findIndex((item) => item.id === line.id);
    setLastRemoved({ item: cart[index], index, name: line.service });
    setCart(removeItem(cart, line.id));
  };

  const undoRemove = () => {
    if (!lastRemoved) return;
    // If the same product was re-added after the removal, don't create a duplicate.
    if (cart.some((item) => item.id === lastRemoved.item.id)) {
      setLastRemoved(null);
      return;
    }
    const restored = [...cart];
    restored.splice(lastRemoved.index, 0, lastRemoved.item); // put it back in its old spot
    setCart(restored);
    setLastRemoved(null);
  };

  return (
    <section className="page">
      <h1 className="page-title">
        <Icon name="shopping_cart" className="title-icon" />
        Cart
      </h1>
      <p className="page-subtitle">Review your plan and EZTech gear before checkout.</p>

      {lines.length === 0 ? (
        <div className="list-empty">
          <Icon name="remove_shopping_cart" />
          <p>Your cart is empty. Browse plans and accessories to get started.</p>
          <Link to="/subscriptions" className="btn-primary inline">
            <Icon name="subscriptions" /> Browse subscriptions
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <ul className="cart-list">
            {lines.map((line) => (
              <li key={line.id} className="cart-line">
                <img
                  src={line.img}
                  alt=""
                  className="cart-thumb"
                  onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                />

                <div className="cart-info">
                  <span className="item-title">{line.service}</span>
                  <span className="item-meta">
                    {line.serviceInfo} &middot; {formatCents(Math.round(line.price * 100))} each
                  </span>
                </div>

                {isSubscription(line) ? (
                  <span className="qty-fixed" title="Only one subscription at a time">
                    Qty 1
                  </span>
                ) : (
                  <div className="qty-control" role="group" aria-label={`Quantity for ${line.service}`}>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => changeQuantity(line.id, line.quantity - 1)}
                      disabled={line.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Icon name="remove" />
                    </button>
                    <QuantityInput line={line} onChange={(quantity) => changeQuantity(line.id, quantity)} />
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => changeQuantity(line.id, line.quantity + 1)}
                      disabled={line.quantity >= maxQuantity(line)}
                      aria-label="Increase quantity"
                    >
                      <Icon name="add" />
                    </button>
                  </div>
                )}

                <span className="line-total">{formatCents(line.lineCents)}</span>

                <button
                  type="button"
                  className="icon-btn danger"
                  onClick={() => remove(line)}
                  aria-label={`Remove ${line.service}`}
                  title="Remove"
                >
                  <Icon name="delete" />
                </button>
              </li>
            ))}
          </ul>

          <aside className="cart-summary" aria-label="Order summary">
            <h2 className="section-title no-top">Order summary</h2>
            <div className="summary-row">
              <span>Items</span>
              <span>{itemCount}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatCents(totalCents)}</span>
            </div>
            <button type="button" className="btn-primary full" disabled title="Checkout arrives in Week 5">
              <Icon name="lock" /> Checkout
            </button>
            <p className="hint small">
              <Icon name="info" /> Checkout and saved cards are coming in Week 5.
            </p>
            <Link to="/subscriptions" className="btn-text back-link">
              <Icon name="arrow_back" /> Keep shopping
            </Link>
          </aside>
        </div>
      )}

      {lastRemoved && (
        <div className="toast" role="status">
          <span>Removed &ldquo;{lastRemoved.name}&rdquo;</span>
          <button type="button" className="toast-btn" onClick={undoRemove}>
            <Icon name="undo" /> Undo
          </button>
        </div>
      )}
    </section>
  );
}

export default Cart;
