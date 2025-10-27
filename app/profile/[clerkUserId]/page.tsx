"use client";
import {useParams} from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
export default function ProfilePage() {
    const {userId} = useParams();
    const [user, setUser] = useState(null);
    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axios.get(`/api/users/${userId}`);
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }        
        fetchUser();
    }, [userId]);
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            
        </div>
    )
}