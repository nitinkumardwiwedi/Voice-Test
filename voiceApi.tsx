"use client";

import VoiceApiCustomization from "@/src/components/channel/VoiceApiCustomization";
import { setShowNav } from "@/src/slices/NavbarSlice";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { useDispatch } from "react-redux";

const Page = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { projectid } = params;

  const hideNav = (value: boolean) => {
    dispatch(setShowNav(value));
  };

  return (
    <>
      <Suspense>
        <div
          onClick={() => hideNav(false)}
          className="parentClose  w-full h-full font-MyPoppin flex justify-center items-center"
        >
          <div className="w-full h-full font-MyPoppins flex">
            {/* <MainLayoutLayout projectId={projectid as string} tab={"history"}> */}
            <VoiceApiCustomization projectId={projectid as string} />
            {/* </MainLayoutLayout> */}
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default Page;
