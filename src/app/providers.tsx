'use client'

import {HeroUIProvider} from '@heroui/react'
import {ReactNode} from "react";

type ProvidersProps = Readonly<{
    children: ReactNode
}>;

export function Providers(props: ProvidersProps) {
   return (
      <HeroUIProvider>
         {props.children}
      </HeroUIProvider>
   )
}