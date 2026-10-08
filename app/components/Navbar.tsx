import Link from "next/link";

export default function Navbar() {
    return <nav>
          <h1 id="logo" style={{ fontSize: "22px" }}>Muncho</h1>
          <ul id="quicklinks" style={{ listStyleType: "none", margin: 0, padding: 0 }}>
            <li><Link href="" style={{ color: "#1A1A1A", textDecoration: "none", fontWeight: "bold" }}>Home</Link></li>
            <li><Link href="" style={{ color: "inherit", textDecoration: "none" }}>Restaurants</Link></li>
            <li><Link href="" style={{ color: "inherit", textDecoration: "none" }}>Offers</Link></li>
            <li><Link href="" style={{ color: "inherit", textDecoration: "none" }}>About</Link></li>
          </ul>
          <ul id="toolbar" style={{ listStyleType: "none", margin: 0, padding: 0 }}>
            <li style={{ padding: "11px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><Link href="" style={{ textDecoration: "none", color: "#555555" }}><img src="/search.svg" alt="Search" /></Link></li>
            <li><Link href="/login" style={{ color: "inherit", textDecoration: "none" }}>Login</Link></li>
            <li style={{ backgroundColor: "#FF9E4F" }}><Link href="" style={{ color: "white", textDecoration: "none", }}>Order Now</Link></li>
          </ul>
        </nav>;
}