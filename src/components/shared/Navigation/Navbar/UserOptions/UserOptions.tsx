"use client";

import { useContext } from "react";
import SignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";
import { CurrentUserContext } from "@/context/CurrentUserContext";
import IconButton from "@/components/shared/IconButton";
import { MdOutlineVideoCall } from "react-icons/md";
import Avatar, { AvatarSize } from "@/components/shared/Avatar";
import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../ui/dropdown-menu'
import { signOut } from "next-auth/react";
import { usePathname } from 'next/navigation'


const UserOptions = () => {
  const currentUser = useContext(CurrentUserContext);
  const currentChannel = useContext(CurrentChannelContext);
  const router = useRouter();
  const path = usePathname();

  if (currentUser && currentChannel) {
    return (
    <>
      <div className="flex items-center gap-4 mr-4">
        <IconButton onClick={() => router.push("/studio/upload")} className="mr-4">
          <MdOutlineVideoCall className="h-7 w-7" />
        </IconButton>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild className='overflow-visible'>
            <div>
            <Avatar onClick={() => {}}
              size={AvatarSize.small}
              imageSrc={currentChannel.imageSrc}
              />
            </div>
          </DropdownMenuTrigger>
      
      <DropdownMenuContent
        className='bg-white w-70'
        align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-0.5 leading-none'>
            <p className='font-medium text-base text-black'>
              {currentChannel.username}
            </p>

            <p className='font-medium text-base text-black'>
              {currentChannel.balance} AIV coin
            </p>
          </div>
        </div>
    
        <DropdownMenuSeparator />
                      
        <DropdownMenuItem asChild className='cursor-pointer'>
          <w3m-button/>
        </DropdownMenuItem>

        {/* <DropdownMenuItem className='cursor-pointer text-base'
            onClick={() => {
              router.push(`/studio`);
              
            }}>
              Preference
        </DropdownMenuItem>     */}

          <DropdownMenuItem className='cursor-pointer text-base'
            onClick={() => {
                router.push(`/studio`);
            }}>
          Studio
        </DropdownMenuItem>
    
        <DropdownMenuItem className='cursor-pointer text-base' onClick={() => {
            signOut();
            }} >

          Log out
          
        </DropdownMenuItem>
      </DropdownMenuContent>
        </DropdownMenu>
     
      </div>
    </>);
  }else if(currentUser){
    return <SignOutButton />
  }
  else{
    return <SignInButton path={path}/>
  }

};

export default UserOptions;
