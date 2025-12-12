'use client'

import {Button} from "@heroui/button";
import {Link} from "@heroui/link";

type HederProps = Readonly<{
   className?: string;
}>;

export default function Header(props: HederProps) {
   return (
      <header className={`flex flex-row justify-end ${props.className ?? ""}`}>
         <div className={"mr-30 mt-15 flex flex-row gap-3"}>
            <Button
               as={Link}
               href="/auth/login?prompt=login"
               color="default"
               radius="full"
               variant="light"
            >
               Sign in
            </Button>
            <Button
               as={Link}
               href="/auth/login?screen_hint=signup&prompt=login"
               color="default"
               radius="full"
               variant="light"
            >
               Sign up
            </Button>
         </div>
      </header>
   )
}