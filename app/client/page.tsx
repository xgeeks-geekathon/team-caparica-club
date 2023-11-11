
"use client"

import { auth } from '@/auth'
import { IconMessage, IconUser } from "@/components/ui/icons"
import { useState } from "react"
import UserCard from './UserCard';

const data = [
    {
        userId: 'John',
        chatId: "",
        status: 'In process'
    },

];


export default  function ClientPage() {
    const [selectedComponent, setSelectedComponent] = useState('home');
    

    const handleLinkClick = (component: string) => {
        setSelectedComponent(component);
    };
   
    return (
        <div className="h-screen w-full flex flex-col lg:flex-row">
            <nav className="w-full lg:w-64 bg-gray-800 text-white p-5">
                <h1 className="text-2xl mb-5">Dashboard</h1>
                <ul className="space-y-2">
                    <li>
                        <button className="flex items-center gap-3 py-2" >
                            <a className={`flex items-center gap-3 py-2 ${selectedComponent === 'home' ? 'text-blue-500' : ''}`} onClick={() => handleLinkClick('home')}>
                                <IconUser />
                                <span>Home</span>
                            </a>
                        </button>
                    </li>
                    {/* <li>
                        <button className="flex items-center gap-3 py-2 " >
                            <a className={`flex items-center gap-3 py-2 ${selectedComponent === 'users' ? 'text-blue-500' : ''}`} onClick={() => handleLinkClick('users')}>
                                <IconMessage />
                                <span>lawyer</span>
                            </a>
                        </button>
                    </li> */}
                </ul>
            </nav>
            <main className="flex-1">
             
                <UserCard />
            </main>

        </div>
    )
}