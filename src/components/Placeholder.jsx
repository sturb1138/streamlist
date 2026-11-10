import Icon from './Icon.jsx';

function Placeholder({ icon, title }) {
  return (
    <section className="page">
      <h1 className="page-title">
        <Icon name={icon} className="title-icon" />
        {title}
      </h1>
      <div className="empty-state" />
    </section>
  );
}

export default Placeholder;
