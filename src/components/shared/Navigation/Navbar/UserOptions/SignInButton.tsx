"use client";

import { signIn } from "next-auth/react";
import { MdOutlineAccountCircle } from "react-icons/md";

interface SignInButtonProps {
  path: string;
}




const SignInButton: React.FC<SignInButtonProps> = ({path}) => {
  const encodedUrl = encodeURIComponent(path);
  
  return (
    <button
      className="flex mr-4 flex-row gap-1 items-center border-[1px] border-slate-700 rounded-full overflow-hidden px-3 py-1.5 text-black	cursor-pointer"
      onClick={() => {
        signIn("google", { callbackUrl: `/create-channel?encodedUrl=${encodedUrl}`});
    }}
    >
      <MdOutlineAccountCircle className="h-6 w-6" />
      Sign In
    </button>
  );
};

export default SignInButton;
