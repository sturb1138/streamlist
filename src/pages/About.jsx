import Icon from '../components/Icon.jsx';

const features = [
  { icon: 'playlist_add', text: 'Add movies and shows to your personal watch list.' },
  { icon: 'edit', text: 'Edit a title after you Google how to spell it.' },
  { icon: 'check_circle', text: 'Mark titles as watched, and filter by To Watch or Watched.' },
  { icon: 'delete', text: 'Delete titles, with an Undo button in case of mistakes.' },
  { icon: 'save', text: 'Your list is saved in your browser, so it stays after a refresh.' },
];

function About() {
  return (
    <section className="page">
      <h1 className="page-title">
        <Icon name="info" className="title-icon" />
        About
      </h1>
      <p className="page-subtitle">
        StreamList is a watch-list app built for EZTechMovie.
      </p>
      <ul className="feature-list">
        {features.map((f) => (
          <li key={f.icon}>
            <Icon name={f.icon} />
            {f.text}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default About;
