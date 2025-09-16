import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer } from "react-toastify";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" flex ">
      {/* LEFT */}
      <div
        className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] md:relative lg:fixed overflow-y-auto  h-screen  p-4   [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        <div className="">
          <Link
            href="/"
            className="flex items-center justify-center lg:justify-start gap-2"
          >
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            <span className="hidden lg:block font-bold">CampusFlow</span>
          </Link>
          <Menu />
        </div>
      </div>
      {/* RIGHT */}
      <div
        className="w-[86%] md:w-[92%] lg:ml-56 lg:w-[84%] xl:w-[86%] 
      bg-[#F7F8FA] 
       flex flex-col"
      >
        <div className="sticky top-0 z-50 bg-white">
          <Navbar />
        </div>
        {children}
      </div>
      <ToastContainer theme="dark" />

    </div>
  );
}
