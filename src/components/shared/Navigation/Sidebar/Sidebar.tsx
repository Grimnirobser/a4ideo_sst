"use client";

import { SidebarContext } from "@/context/SidebarContext";
import { Channel } from "@prisma/client";
import { useContext } from "react";
import NavigationHeader from "../NavigationHeader";
import MenuItem from "../Navbar/UserOptions/MenuItem";
import { MdOutlineHome, MdOutlineSubscriptions, MdOutlineFolderShared, MdOutlineRocket, MdOutlineModeComment } from "react-icons/md";
import { useRouter } from "next/navigation";
import { CurrentUserContext } from "@/context/CurrentUserContext";
import Avatar, { AvatarSize } from "../../Avatar";

interface SidebarProps {
  subscribedChannels: Channel[];
}

const Sidebar: React.FC<SidebarProps> = ({ subscribedChannels }) => {
  const sidebar = useContext(SidebarContext);

  const currentUser = useContext(CurrentUserContext);

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

          <MenuItem
            label="AIPs"
            logo={<MdOutlineModeComment className="h-6 w-6 mr-4" />}
            round
            onClick={() => handleItemClick(() => router.push("/aips"))}
          />

          <MenuItem
            label="Leaderboard"
            logo={<MdOutlineRocket className="h-6 w-6 mr-4" />}
            round
            onClick={() => handleItemClick(() => router.push("/"))}
          />

          {currentUser ? (
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
        {currentUser ? (
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
                      router.push(`/channel/${subscribedChannel.id}`)
                    )
                  }
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Sidebar;
