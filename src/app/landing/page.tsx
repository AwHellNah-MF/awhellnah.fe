import Header from "@/app/landing/_components/header";
import Logo from "@/app/_components/logo";
import LetsGetStartedBtn from "@/app/landing/_components/lets-get-started-btn";
import AboutTheDevBtn from "@/app/landing/_components/about-the-dev-btn";
import Aurora from "@/app/_components/backgrounds/canvas/aurora";

export default function LandingPage() {
   return (
      <div className={""}>
         <Aurora/>
         <Header/>
         <div className={"flex flex-row justify-center items-start"}>
            <div className={"flex flex-col items-end justify-center mt-[24vh]"}>
               <Logo/>
               <div className={"flex flex-row gap-3"}>
                  <AboutTheDevBtn/>
                  <LetsGetStartedBtn/>
               </div>
            </div>
         </div>
      </div>
   );
}
