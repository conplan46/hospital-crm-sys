"use client";
import {
  CircularProgress,
  CircularProgressLabel,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { Accordion } from "@mantine/core";
import { atom } from "jotai";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  //console.log({ session });
  if (!isClient) {
    return (
      <Loading />
    )
  }
  if (isClient) {
    return (
      <>
        <div className="flex flex-col md:flex-row">
          <div className="p-4 md:w-1/2">
            <div className="border-grey rounded-3xl border-x border-y bg-white p-6 ">
              <div className="m-2 flex justify-between">
                <h1 className=" default-font text-4xl text-black">
                  {" "}
                  Are you a patient
                </h1>
              </div>{" "}
              <p className="my-4 ml-3 text-base font-medium text-[#8D8D8D]">
                Book an appointment now
              </p>
              <Link
                target="_blank"
                href="#"
                className="default-font btn btn-outline ml-4 mt-4 text-[#A699F8] md:w-1/3"
              >
                Book
              </Link>
            </div>
          </div>
          <div className="p-4 md:w-1/2">
            <div className="rounded-3xl border-x border-y border-[#e6e8ec] bg-white pb-9 pe-4 ps-4 pt-10">
              <h1 className="m-4 text-4xl  text-black">
                Sell medical products and offer medical services
              </h1>
              <div className="grid ">
                <p className="my-4 ml-4 text-base font-medium text-[#8D8D8D]">
                  Register your medical establishment and benefit from
                </p>
                <div className="ml-4  flex justify-between space-x-[1px] md:space-x-4 ">
                  <div className="mb-3 rounded-lg border-2 border-[#FFF0E6]  bg-[#FFF0E6] px-4  text-center md:w-1/3 md:p-1">
                    <Stat>
                      <StatLabel>Inventory tracking</StatLabel>
                    </Stat>
                  </div>
                  <div className="mb-3 rounded-lg border-2 border-[#FFF0E6]  bg-[#FFF0E6] px-4  text-center md:w-1/3 md:p-1">
                    <Stat>
                      <StatLabel>and</StatLabel>
                    </Stat>
                  </div>

                  <div className="mb-3 rounded-lg   border-2  border-purple-100 bg-purple-100 px-4 text-center md:w-1/3 md:p-1">
                    <Stat>
                      <StatLabel>Fluid payment systems</StatLabel>
                    </Stat>
                  </div>
                </div>

                <a
                  onClick={() => {
                    void signIn(undefined);
                  }}
                  className="text-[#FC6873 btn  btn-outline ml-4 mt-4 text-[#A699F8] md:w-1/3"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-18 flex flex-col md:flex-row">
          <div className="md:h-200px p-4 md:w-1/2">
            <div className="rounded-3xl border-x border-y border-[#e6e8ec] bg-white p-4">
              <div className="flex flex-row items-baseline justify-between ">
                <h1 className="m-4 text-4xl  text-black">Notifications</h1>
              </div>
              <div className="grid ">
                <p className="my-2 ml-4 w-1/2 text-base font-medium text-[#8D8D8D]">
                  No notifications
                </p>
                <p className="my-2 ml-4 w-1/2 text-base font-medium text-[#8D8D8D]">
                  Your are all caught up with your notifications.
                </p>
                <button className="btn btn-outline m-2 ml-2  border-[#A699F8] text-[#A699F8] sm:w-1/3 md:w-1/3">
                  View all
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
