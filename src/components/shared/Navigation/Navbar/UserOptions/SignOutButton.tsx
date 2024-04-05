"use client";

import { signOut } from "next-auth/react";
import { MdOutlineAccountCircle } from "react-icons/md";



const SignOutButton = () => {

  return (
    <button
      className="flex mr-4 flex-row gap-1 items-center border-[1px] border-slate-700 rounded-full overflow-hidden px-3 py-1.5 text-black	cursor-pointer"
      onClick={() => {
        signOut();
    }}
    >
      <MdOutlineAccountCircle className="h-6 w-6" />
      Sign Out
    </button>
  );
};

export default SignOutButton;
