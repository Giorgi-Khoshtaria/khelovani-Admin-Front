import { Link } from "react-router-dom";
import "./NotFound.scss";

export default function NotFound() {
  const content = {
    title: "გვერდი ვერ მოიძებნა",
    description:
      "უკაცრავად, გვერდი რომელსაც ეძებთ არ არსებობს ან დროებით მიუწვდომელია.",
    button: "მთავარზე დაბრუნება",
  };

  return (
    <main className="nf-container">
      <div className="nf-background">
        <div className="nf-background__blob nf-background__blob--1" />
        <div className="nf-background__blob nf-background__blob--2" />
        <div className="nf-background__blob nf-background__blob--3" />
        <div className="nf-background__grid" />
      </div>

      <div className="nf-content">
        <div className="nf-visual">
          <span className="nf-visual__number">4</span>
          <div className="nf-visual__circle">
            <div className="nf-visual__circle-inner" />
          </div>
          <span className="nf-visual__number">4</span>
        </div>

        <div className="nf-card">
          <h1 className="nf-card__title">{content.title}</h1>
          <p className="nf-card__description">{content.description}</p>

          <Link to="/" className="nf-card__btn">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>{content.button}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
