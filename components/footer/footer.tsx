"use client";

import { useProfileStore } from "@/hooks/store/profile.store";

export default function Footer() {
  const profileStore = useProfileStore();

  return (
    <footer
      style={{
        backgroundColor: profileStore.footerColor,
        color: profileStore.footerTextColor,
      }}
    >
      <div className="flex justify-around mx-[10%] max-w-screen-xl">
        <div className="w-full grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-3">
          <div className="flex flex-col justify-center">
            <h2 className="mb-6 text-sm font-semibold ">Company</h2>
            <ul>
              <li className="mb-4">
                <a href="#" className=" hover:underline">
                  About
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Brand Center
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold">Legal</h2>
            <ul className=" font-medium">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Licensing
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Terms &amp; Conditions
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold ">Download</h2>
            <ul className=" font-medium">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  iOS
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Android
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Windows
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  MacOS
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
