"use client";

import { signIn } from "next-auth/react";
import { MdOutlineAccountCircle } from "react-icons/md";

interface SignInButtonProps {
  encodedUrl: string;
}




const SignInButton: React.FC<SignInButtonProps> = ({encodedUrl}) => {
  
  return (
    <button
      className="flex mr-4 flex-row gap-1 items-center border-[1px] border-slate-700 rounded-full overflow-hidden px-3 py-1.5 text-black	cursor-pointer"
      onClick={() => {
        signIn("google", { callbackUrl: `/create-channel?e=${encodedUrl}`});
    }}
    >
      <MdOutlineAccountCircle className="h-6 w-6" />
      Sign In
    </button>
  );
};

export default SignInButton;
