import Image from "next/image";
import Link from 'next/link'
import Input from "./Input";
import "./page.css";
export default function Login() {
    return <>
        <main>
            <div className="fo">
                <p>Muncho</p>
                <p>Welcome back!</p>
                <p>Login to continue ordering delicious food.</p>
                <Input txt="Email"></Input>    
            </div>
            <div className="banner">
                <img src="/burger.png"/>
            </div>
        </main>
    </>;
}
