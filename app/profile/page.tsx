"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileIndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/profile/orders");
    }, [router]);

    return <p>Loading your profile...</p>;
}
