import Icon from './Icon.jsx';

function Placeholder({ icon, title, message }) {
  return (
    <section className="page">
      <h1 className="page-title">
        <Icon name={icon} className="title-icon" />
        {title}
      </h1>
      <div className="empty-state">
        <Icon name="construction" className="empty-icon" />
        <p>{message}</p>
      </div>
    </section>
  );
}

export default Placeholder;
