
"use client"


import { IconMessage, IconUser } from "@/components/ui/icons"
import { useState } from "react"

import UserCard from './UserCard';




export default  function ClientPage() {
    const [selectedComponent, setSelectedComponent] = useState('home');
    

    const handleLinkClick = (component: string) => {
        setSelectedComponent(component);
    };
   
    return (
        <div className="h-screen w-full flex flex-col lg:flex-row">
            <nav className="w-full lg:w-64 bg-gray-800 text-white p-5">
            <a className="text-2xl mb-5" href="/">Dashboard</a>
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