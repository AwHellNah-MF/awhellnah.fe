'use client'
import {Button} from "@heroui/button";
import Link from "next/link";

export default function AboutTheDevBtn() {
   const developerGitHubLink = "https://github.com/vultpham-mf";

   return (
      <Button
         as={Link}
         href={developerGitHubLink}
         target="_blank"
         radius="full"
         variant="light"
         className={"underline"}
      >
         About the developer
      </Button>
   )
}