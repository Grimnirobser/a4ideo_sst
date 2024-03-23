"use client";

import { SidebarContext } from "@/context/SidebarContext";
import { Channel } from "@prisma/client";
import { useContext } from "react";
import MenuItem from "../Navbar/UserOptions/MenuItem";
import { MdOutlineHome, MdOutlineSubscriptions, MdOutlineFolderShared, MdOutlineRocket, MdOutlineModeComment } from "react-icons/md";
import { useRouter } from "next/navigation";
import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import Avatar, { AvatarSize } from "../../Avatar";
import Link from 'next/link'

interface SidebarProps {
  subscribedChannels: Channel[];
}

const Sidebar: React.FC<SidebarProps> = ({ subscribedChannels }) => {
  const sidebar = useContext(SidebarContext);

  const currentChannel = useContext(CurrentChannelContext);

  const router = useRouter();

  const handleItemClick = (onClick: () => void) => {
    onClick();
    sidebar?.onClose();
  };
  return (
    <>
      <div
        className={`fixed w-60 bg-white z-40 mt-14 px-6 flex flex-col h-screen overflow-scroll no-scrollbar ${
          sidebar?.isOpen ? "translate-x-0" : "-translate-x-full"
        } ease-in-out duration-300`}
      >
        <div className="pt-2 pb-3 border-b bg-white">
          <MenuItem
            label="Home"
            logo={<MdOutlineHome className="h-6 w-6 mr-4" />}
            round
            onClick={() => handleItemClick(() => router.push("/"))}
          />

          {/* <MenuItem
            label="AIPs"
            logo={<MdOutlineModeComment className="h-6 w-6 mr-4" />}
            round
            onClick={() => handleItemClick(() => router.push("/aips"))}
          /> */}

          {/* <MenuItem
            label="Leaderboard"
            logo={<MdOutlineRocket className="h-6 w-6 mr-4" />}
            round
            onClick={() => handleItemClick(() => router.push("/leaderboard"))}
          /> */}

          {currentChannel ? (
            <MenuItem
              label="Subscriptions"
              logo={<MdOutlineSubscriptions className="h-6 w-6 mr-4" />}
              round
              onClick={() =>
                handleItemClick(() => router.push("/subscriptions"))
              }
            />
          ) : null}
        </div>
        {currentChannel ? (
          <div className="pt-3">
            <h2 className="font-medium mb-2">Subscriptions</h2>
            {subscribedChannels.map((subscribedChannel) => {
              return (
                <MenuItem
                  key={subscribedChannel.id}
                  label={subscribedChannel.username}
                  logo={
                    <Avatar
                      imageSrc={subscribedChannel.imageSrc}
                      size={AvatarSize.small}
                      className="mr-4"
                    />
                  }
                  round
                  onClick={() =>
                    handleItemClick(() =>
                      router.push(`/channel/${subscribedChannel.username}`)
                    )
                  }
                />
              );
            })}
          </div>
        ) : null}          

        <div className="absolute bottom-12">

        <div className='mb-2 md:flex md:items-center md:justify-between'>
          <div className='mt-4 flex items-center justify-center md:mt-0'>
            <div className='flex space-x-8'>
              <Link
                href="./about"
                onClick={() =>
                  handleItemClick(()=>{})
                }
                className='text-sm text-muted-foreground hover:text-gray-600'>
                About
              </Link>
            </div>
          </div>
        </div>


        <div className='mb-2 md:flex md:items-center md:justify-between'>
          <div className='mt-4 flex items-center justify-center md:mt-0'>
            <div className='flex space-x-8'>
              <Link
                href="./terms"
                onClick={() =>
                  handleItemClick(()=>{})
                }
                className='text-sm text-muted-foreground hover:text-gray-600'>
                Terms of service
              </Link>
            </div>
          </div>
        </div>

        <div className='mb-2 md:flex md:items-center md:justify-between'>
          <div className='mt-4 flex items-center justify-center md:mt-0'>
            <div className='flex space-x-8'>
            <Link
                href='./privacy-policy'
                onClick={() =>
                  handleItemClick(()=>{})
                }
                className='text-sm text-muted-foreground hover:text-gray-600'>
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className='mb-2 md:flex md:items-center md:justify-between'>
          <div className='mt-4 flex items-center justify-center md:mt-0'>
            <div className='flex space-x-8'>
              <Link
                href='#'
                onClick={() =>
                  handleItemClick(()=>{})
                }
                className='text-sm text-muted-foreground hover:text-gray-600'>
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>




        <div className='text-center md:text-left mb-6'>
            <p className='text-sm text-muted-foreground'>
              &copy; {new Date().getFullYear()} A4ideo Inc.
            </p>
        </div>

        </div>
        
      </div>
    </>
  );
};

export default Sidebar;
