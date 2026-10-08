import Image from "next/image";
import Link from 'next/link'
import "./page.css";
export default function Login() {
    return <>
        <main>
            <div className="fo">
                <p style={{ color: "#1F2523", fontWeight: "bold", fontSize: "22px" }}>Muncho</p>
                <p style={{ color: "#1F2523", fontWeight: "bold", fontSize: "36px" }}>Welcome back!</p>
                <p style={{ color: "#66706C", fontSize: "15px" }}>Login to continue ordering delicious food.</p>
                <input type="text" placeholder="Enter your email" style={{ padding: "12px", borderRadius: "8px", width: "100%" }} />
                <input type="text" placeholder="Enter your password" style={{ padding: "12px", borderRadius: "8px", width: "100%" }} />
                <div className="final">
                    <div className="remember">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Remember Me</label>
                    </div>
                    <Link href="/forgot-password">Forgot Password?</Link>
                </div>
                <button className="login-button">
                    Login →
                </button>
                <a className="dhan" href="/signup">Don't have an account? Sign up</a>
            </div>
            <div className="banner">
                <img src="/burger.png" />
                <div className="headline">
                    <h1>Fresh Food.</h1>
                    <h1>Delivered Fast.</h1>
                    <div className="decor">
                        <div className="accent-line"></div>
                        <div className="accent-dot"></div>
                        <div className="accent-dot"></div>
                    </div>
                </div>
            </div>
        </main>
    </>;
}
