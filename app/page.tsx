import Image from "next/image";
import Link from 'next/link'

import "./page.css";
import Navbar from "./components/Navbar";
export default function Home() {
  return (
    <>
      <div className="app">
        <Navbar />
        <main>
          <div className="content">
            <div>
              <h1 style={{ color: "#1A1A1A", fontWeight: "bold", fontSize: "72px" }}>Good <span style={{ color: "#FF9E4F" }}>Food.</span></h1>
              <h1 style={{ color: "#1A1A1A", fontWeight: "bold", fontSize: "72px" }}>Great Mood.</h1>
              <h1 style={{ color: "#1A1A1A", fontWeight: "bold", fontSize: "72px" }}><span style={{ color: "#FF9E4F" }}>Delivered.</span></h1>
            </div>
            <p style={{
              color: "#666"
            }}>Discover delicious meals from your favorite restaurants<br></br> and get them delivered fresh and fast.</p>
            <div style={{ display: "flex", gap: "16px" }}>
              <button type="button" style={{ backgroundColor: "#FF9E4F", color: "white", fontWeight: "bold" }}>Order Now →</button>
              <button type="button" style={{ backgroundColor: "#FFFFFF", fontWeight: "bold" }}>Explore Restaurants</button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", padding: "12px", borderRadius: "16px", paddingRight: "20px", gap: "10px" }}>
                <p style={{ fontSize: "20px" }}>⚡</p>
                <div>
                  <p style={{ fontWeight: "bold" }}>30 min</p>
                  <p style={{ color: "grey" }}>delivery</p>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", padding: "12px", borderRadius: "16px", paddingRight: "20px", gap: "10px" }}>
                <p style={{ fontSize: "20px" }}>🍴</p>
                <div>
                  <p style={{ fontWeight: "bold" }}>500+</p>
                  <p style={{ color: "grey" }}>restaurants</p>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", padding: "12px", borderRadius: "16px", paddingRight: "20px", gap: "10px" }}>
                <p style={{ fontSize: "20px" }}>⭐</p>
                <div>
                  <p style={{ fontWeight: "bold" }}>4.8★</p>
                  <p style={{ color: "grey" }}>rating</p>
                </div>
              </div>
            </div>

          </div>
          <Image src="/hero.png" alt="hero" width={600} height={600} />
        </main>
      </div>
    </>
  );
}
