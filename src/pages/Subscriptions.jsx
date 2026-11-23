import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import list from '../data.js';
import { isSubscription, addWarning, addItem, formatCents } from '../utils/cart.js';

const plans = list.filter(isSubscription);
const accessories = list.filter((product) => !isSubscription(product));

// Subscriptions page: shows everything in data.js and lets users add it to the cart.
// cart and setCart come from App, so the Navbar badge updates right away.
function Subscriptions({ cart, setCart }) {
  // Which card to show a message on, e.g. { id: 2, type: 'warning', text: '...' }
  const [notice, setNotice] = useState(null);

  // Hide the message after a few seconds.
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleAdd = (product) => {
    const warning = addWarning(cart, product);
    if (warning) {
      setNotice({ id: product.id, type: 'warning', text: warning });
      return;
    }
    setCart(addItem(cart, product));
    setNotice({ id: product.id, type: 'success', text: 'Added to your cart.' });
  };

  const renderCard = (product) => {
    const inCart = cart.find((item) => item.id === product.id);
    const plan = isSubscription(product);

    return (
      <li key={product.id} className="product-card">
        <div className="product-image">
          <img
            src={product.img}
            alt=""
            loading="lazy"
            onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
          />
        </div>
        <div className="product-info">
          <span className={plan ? 'product-tag plan' : 'product-tag'}>
            <Icon name={plan ? 'confirmation_number' : 'sell'} />
            {plan ? 'Subscription · limit 1' : 'EZTech accessory'}
          </span>
          <h3 className="product-name">{product.service}</h3>
          <p className="item-meta">{product.serviceInfo}</p>
          <p className="product-price">
            {formatCents(Math.round(product.price * 100))}
            {plan && <span className="per-month"> / month</span>}
          </p>
        </div>

        {/* The warning or "Added" message shows just above this card's button. */}
        {notice && notice.id === product.id && (
          <p
            className={notice.type === 'warning' ? 'form-message' : 'form-message success'}
            role={notice.type === 'warning' ? 'alert' : 'status'}
          >
            <Icon name={notice.type === 'warning' ? 'warning' : 'check_circle'} /> {notice.text}
          </p>
        )}

        <button
          type="button"
          className={plan && inCart ? 'btn-add added' : 'btn-add'}
          onClick={() => handleAdd(product)}
        >
          <Icon name={plan && inCart ? 'check' : 'add_shopping_cart'} />
          {plan && inCart && 'In your cart'}
          {!plan && inCart && `Add another (${inCart.quantity} in cart)`}
          {!inCart && 'Add to cart'}
        </button>

      </li>
    );
  };

  return (
    <section className="page">
      <h1 className="page-title">
        <Icon name="subscriptions" className="title-icon" />
        Subscriptions
      </h1>
      <p className="page-subtitle">
        Pick one StreamList plan, then add as many EZTech shirts, stickers, and cases as you like.{' '}
        <Link to="/cart" className="inline-link">View cart</Link>
      </p>

      <h2 className="section-title">
        <Icon name="confirmation_number" /> Plans
      </h2>
      <ul className="product-grid">{plans.map(renderCard)}</ul>

      <h2 className="section-title">
        <Icon name="storefront" /> EZTech accessories
      </h2>
      <ul className="product-grid">{accessories.map(renderCard)}</ul>
    </section>
  );
}

export default Subscriptions;
