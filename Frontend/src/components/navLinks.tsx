"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { House, Book, Info, User } from "lucide-react";
import { useSession } from "@/app/context/authContext";
const NavLinks = () => {
  const { isAdmin } = useSession();
  const links = isAdmin
    ? [
        { href: "/dashboard/admin", name: "Dashboard", icon: House },
        { href: "/category", name: "Category", icon: Info },
        { href: "/member/manageMember", name: "Members", icon: User },
      ]
    : [
        { href: "/dashboard/user", name: "Dashboard", icon: House },
        { href: "/loan", name: "My Shelf", icon: Book },
      ];

  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              {
                "text-stone-400 border-b-2 border-stone-600":
                  link.href === pathname,
              },
              `h-[48px] text-sm font-medium hover:text-stone-600 transition-all duration-150 flex justify-center items-center gap-3`
            )}
          >
            <LinkIcon />
            <p className={`hidden md:block`}>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;
