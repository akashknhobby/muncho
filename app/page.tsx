import Image from "next/image";
import Link from "next/link";
import "./page.css";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="app">
      <Navbar />
      <main className="home-main">
        <div className="home-copy">
          <h1 className="home-title">
            Good <span>Food.</span>
            <br />
            Great Mood.
            <br />
            <span>Delivered.</span>
          </h1>
          <p className="home-description">
            Discover delicious meals from your favorite restaurants and get them
            delivered fresh and fast.
          </p>
          <div className="home-actions">
            <Link href="/restaurants">Order now <span aria-hidden="true">→</span></Link>
            <Link className="secondary-action" href="/restaurants">Explore restaurants</Link>
          </div>
          <div className="home-highlights" aria-label="Muncho highlights">
            <div className="home-highlight">
              <span className="home-highlight-icon" aria-hidden="true">⚡</span>
              <span><strong>30 min</strong><span>delivery</span></span>
            </div>
            <div className="home-highlight">
              <span className="home-highlight-icon" aria-hidden="true">🍴</span>
              <span><strong>Local</strong><span>restaurants</span></span>
            </div>
            <div className="home-highlight">
              <span className="home-highlight-icon" aria-hidden="true">⭐</span>
              <span><strong>Fresh</strong><span>every day</span></span>
            </div>
          </div>
        </div>
        <div className="home-artwork">
          <Image src="/hero.png" alt="A selection of delicious food" fill priority sizes="(max-width: 760px) 90vw, 45vw" />
        </div>
      </main>
    </div>
  );
}
