'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'

const Navbar = () => {
    const {data: session} = useSession();
    const user:User = session?.user as User;

  return (
    <nav className='mb-3 flex items-center py-2 px-2 bg-[#181824] text-white'>
        
            <h2 className='text-2xl uppercase font-bold' >mystary message</h2>
            {
              session? (
                <div className='flex items-center gap-2 ml-auto'>
                    <Link href={`/dashboard`} className='hover:underline hover:underline-offset-2 cursor-pointer'>@{user?.username || user.email}</Link>
                    <button  className='bg-red-500 py-2 px-2 rounded-sm hover:bg-red-600'  onClick={()=> signOut()}>Logout</button>
                </div>
              ) :(
                <div className='ml-auto'>
                 <Link className=' bg-green-500 py-2 px-2 rounded-sm hover:bg-green-600' href={"/sign-up"}>
                  <button>Signup</button>
                 </Link>
                </div>
              )
            }
       
    </nav>
  )
}

export default Navbar
