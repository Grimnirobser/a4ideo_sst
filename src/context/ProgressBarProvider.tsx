"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { PropsWithChildren} from 'react'
import { Suspense } from "react";


const ProgressBarProvider = ({ children }: PropsWithChildren) => {
  return (
    <>
        {children}
        <Suspense>
        <ProgressBar
            height="4px"
            color="#0ea5e9"
            options={{ showSpinner: false }}
            shallowRouting
        />
        </Suspense>
    </>
  );
};

export default ProgressBarProvider;