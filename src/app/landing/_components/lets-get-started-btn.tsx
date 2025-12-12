'use client'

import {Button} from "@heroui/button";
import {ArrowRightIcon} from "@heroicons/react/24/outline";
import {Link} from "@heroui/link";

export default function LetsGetStartedBtn() {
   return (
      <Button
         as={Link}
         radius="full"
         variant="solid"
         endContent={<ArrowRightIcon className={"size-4"} strokeWidth={2.5}/>}
         href="/auth/login?screen_hint=signup&prompt=login"
      >
         Let&#39;s get started
      </Button>
   )
}