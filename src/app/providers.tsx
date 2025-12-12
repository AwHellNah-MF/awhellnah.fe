'use client'

import {HeroUIProvider} from '@heroui/react'
import {ReactNode, StrictMode} from "react";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";

type ProvidersProps = Readonly<{
    children: ReactNode
}>;

export function Providers(props: ProvidersProps) {
   return (
       <StrictMode>
         <Auth0Provider>
            <HeroUIProvider>
               {props.children}
            </HeroUIProvider>
         </Auth0Provider>
       </StrictMode>
   )
}