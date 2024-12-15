"use client";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";

import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

export default function HomePage() {
  const { user, role } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Wylogowanie użytkownika
      router.push("/"); // Przekierowanie na stronę główną
    } catch (error) {
      console.error("Błąd podczas wylogowania:", error);
    }
  };

  //todo: tutaj jest lista do wyprostowania i ona sie musi jakos mapowac na to co jest w aplikacji
  const navigation = [
    { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
    { name: "Team", href: "#", icon: UsersIcon, current: false },
    { name: "Projects", href: "#", icon: FolderIcon, current: false },
    { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
    {
      name: "Documents",
      href: "#",
      icon: DocumentDuplicateIcon,
      current: false,
    },
    { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
  ];

  //todo:tutaj current jest do poprawy nie podoba mi sie to
  const teams = [
    {
      id: 1,
      name: "Panel Redaktora",
      href: "/editor",
      initial: "R",
      current: role === "editor",
    },
    {
      id: 2,
      name: "Panel Administratora",
      href: "/admin",
      initial: "A",
      current: role === "admin",
    },
    {
      id: 3,
      name: "Panel Super Admina",
      href: "/super-admin",
      initial: "S",
      current: role === "superadmin",
    },

    {
      id: 4,
      name: "Zarejestruj się",
      href: "/register",
      initial: "Q",
      current: false,
    },

  ];
  const userNavigation = [
    // { name: "Your profile", href: "#" },
    { name: "Wyloguj się", onHandleClick: handleLogout },
  ];

  const secondaryNavigation = [
    { name: "Konto", href: "/settings", current: true },
    // { name: "Notifications", href: "#", current: false },
    // { name: "Billing", href: "#", current: false },
    // { name: "Teams", href: "#", current: false },
    // { name: "Integrations", href: "#", current: false },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    // <div>
    //     <h1>Lista Artykułów</h1>
    //     <p>Publiczna strona. Tutaj będzie lista postów.</p>
    //     {user ? (
    //         <div>
    //             <p>
    //                 <strong>Zalogowany jako:</strong> {user.email}
    //             </p>
    //             <p>
    //                 <strong>Rola:</strong> {role}
    //             </p>
    //             <p>
    //                 <strong>UID:</strong> {user.uid}
    //             </p>
    //             <div>
    //                 <Link href="/editor">Panel Redaktora</Link>{" "}
    //                 {(role === "admin" || role === "superadmin") && (
    //                     <Link href="/admin">Panel Admina</Link>
    //                 )}{" "}
    //                 {role === "superadmin" && (
    //                     <Link href="/super-admin">Panel Super Admina</Link>
    //                 )}
    //             </div>
    //             <button onClick={handleLogout} style={{ marginTop: "20px" }}>
    //                 Wyloguj się
    //             </button>
    //         </div>
    //     ) : (
    //         <Link href="/login">Zaloguj się</Link>
    //     )}
    // </div>

    // tutaj
    <>
      {user ? (
        <div>
          <Dialog
            open={sidebarOpen}
            onClose={setSidebarOpen}
            className="relative z-50 lg:hidden"
          >
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
            />

            <div className="fixed inset-0 flex">
              <DialogPanel
                transition
                className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
              >
                <TransitionChild>
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                    <button
                      type="button"
                      onClick={() => setSidebarOpen(false)}
                      className="-m-2.5 p-2.5"
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        aria-hidden="true"
                        className="size-6 text-white"
                      />
                    </button>
                  </div>
                </TransitionChild>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                  <div className="flex h-16 shrink-0 items-center">
                    <Image
                      alt="Polskie Towarzystwo Tradycyjnej Medycyny Chińskiej"
                      src="/logo.png"
                      width={200}
                      height={50}
                      className="h-8 w-auto"
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <a
                                href={item.href}
                                className={classNames(
                                  item.current
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                  "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                                )}
                              >
                                <item.icon
                                  aria-hidden="true"
                                  className="size-6 shrink-0"
                                />
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <div className="text-xs/6 font-semibold text-gray-400">
                          Użytkownik i jego rola
                        </div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                          {teams.map((team) => (
                            <li key={team.name}>
                              <Link
                                href={team.href}
                                className={classNames(
                                  team.current
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                  "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                                )}
                              >
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                  {team.initial}
                                </span>
                                <span className="truncate">{team.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <a
                          href="#"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
                        >
                          <Cog6ToothIcon
                            aria-hidden="true"
                            className="size-6 shrink-0"
                          />
                          Settings
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </DialogPanel>
            </div>
          </Dialog>

          {/* Static sidebar for desktop */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center">
                <Image
                  alt="Polskie Towarzystwo Tradycyjnej Medycyny Chińskiej"
                  src="/logo.png"
                  width={200}
                  height={50}
                  className="h-8 w-auto"
                />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className="size-6 shrink-0"
                            />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs/6 font-semibold text-gray-400">
                      Użytkownik i jego rola
                    </div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {teams.map((team) => (
                        <li key={team.name}>
                          <Link
                            href={team.href}
                            className={classNames(
                              team.current
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                            )}
                          >
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                              {team.initial}
                            </span>
                            <span className="truncate">{team.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="mt-auto">
                    <a
                      href="#"
                      className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
                    >
                      <Cog6ToothIcon
                        aria-hidden="true"
                        className="size-6 shrink-0"
                      />
                      Settings
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="lg:pl-72">
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Separator */}
              <div
                aria-hidden="true"
                className="h-6 w-px bg-gray-900/10 lg:hidden"
              />

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form
                  action="#"
                  method="GET"
                  className="grid flex-1 grid-cols-1"
                >
                  <input
                    name="search"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    className="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm/6"
                  />
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
                  />
                </form>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="size-6" />
                  </button>

                  {/* Separator */}
                  <div
                    aria-hidden="true"
                    className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                  />

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <MenuButton className="-m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>

                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="size-8 rounded-full bg-gray-50"
                      />
                      <span className="hidden lg:flex lg:items-center">
                        <span
                          aria-hidden="true"
                          className="ml-4 text-sm/6 font-semibold text-gray-900"
                        >
                          {user.email}
                          <strong>//{role}</strong>
                        </span>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="ml-2 size-5 text-gray-400"
                        />
                      </span>
                    </MenuButton>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          <button
                            onClick={item.onHandleClick}
                            className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                          >
                            {item.name}
                          </button>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
            </div>

            <main className="py-10">
              <div className="px-4 sm:px-6 lg:px-8">{/* Your content */}</div>
            </main>

            {/*to jest widok ustawien*/}
            {/*<main className="py-10 bg-gray-900">*/}
            {/*  <div className="px-4 sm:px-6 lg:px-8">*/}
            {/*    <h1 className="sr-only">Account Settings</h1>*/}

            {/*    <header className="border-b border-white/5">*/}
            {/*      <nav className="flex overflow-x-auto py-4">*/}
            {/*        <ul*/}
            {/*          role="list"*/}
            {/*          className="flex min-w-full flex-none gap-x-6 px-4 text-sm/6 font-semibold text-gray-400 sm:px-6 lg:px-8"*/}
            {/*        >*/}
            {/*          {secondaryNavigation.map((item) => (*/}
            {/*            <li key={item.name}>*/}
            {/*              <a*/}
            {/*                href={item.href}*/}
            {/*                className={item.current ? "text-indigo-400" : ""}*/}
            {/*              >*/}
            {/*                {item.name}*/}
            {/*              </a>*/}
            {/*            </li>*/}
            {/*          ))}*/}
            {/*        </ul>*/}
            {/*      </nav>*/}
            {/*    </header>*/}

            {/*    <div className="divide-y divide-white/5">*/}
            {/*      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">*/}
            {/*        <div>*/}
            {/*          <h2 className="text-base/7 font-semibold text-white">*/}
            {/*            Ustawienia konta*/}
            {/*          </h2>*/}
            {/*          <p className="mt-1 text-sm/6 text-gray-400">*/}
            {/*            Wpisz swoje dane, aby zaktualizować ustawienia konta.*/}
            {/*          </p>*/}
            {/*        </div>*/}

            {/*        <form className="md:col-span-2">*/}
            {/*          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">*/}
            {/*            <div className="col-span-full flex items-center gap-x-8">*/}
            {/*              /!*todo: dodawanie swojego obrazka tutaj*!/*/}
            {/*              <img*/}
            {/*                alt=""*/}
            {/*                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"*/}
            {/*                className="size-24 flex-none rounded-lg bg-gray-800 object-cover"*/}
            {/*              />*/}
            {/*              <div>*/}
            {/*                <button*/}
            {/*                  type="button"*/}
            {/*                  className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"*/}
            {/*                >*/}
            {/*                  Ustaw Awatar*/}
            {/*                </button>*/}
            {/*                <p className="mt-2 text-xs/5 text-gray-400">*/}
            {/*                  JPG, GIF or PNG. 1MB max.*/}
            {/*                </p>*/}
            {/*              </div>*/}
            {/*            </div>*/}

            {/*            <div className="sm:col-span-3">*/}
            {/*              <label*/}
            {/*                htmlFor="first-name"*/}
            {/*                className="block text-sm/6 font-medium text-white"*/}
            {/*              >*/}
            {/*                Imie*/}
            {/*              </label>*/}
            {/*              <div className="mt-2">*/}
            {/*                <input*/}
            {/*                  id="first-name"*/}
            {/*                  name="first-name"*/}
            {/*                  type="text"*/}
            {/*                  autoComplete="given-name"*/}
            {/*                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"*/}
            {/*                />*/}
            {/*              </div>*/}
            {/*            </div>*/}

            {/*            <div className="sm:col-span-3">*/}
            {/*              <label*/}
            {/*                htmlFor="last-name"*/}
            {/*                className="block text-sm/6 font-medium text-white"*/}
            {/*              >*/}
            {/*                Nazwisko*/}
            {/*              </label>*/}
            {/*              <div className="mt-2">*/}
            {/*                <input*/}
            {/*                  id="last-name"*/}
            {/*                  name="last-name"*/}
            {/*                  type="text"*/}
            {/*                  autoComplete="family-name"*/}
            {/*                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"*/}
            {/*                />*/}
            {/*              </div>*/}
            {/*            </div>*/}

            {/*            <div className="col-span-full">*/}
            {/*              <label*/}
            {/*                htmlFor="email"*/}
            {/*                className="block text-sm/6 font-medium text-white"*/}
            {/*              >*/}
            {/*                Adres e-mail*/}
            {/*              </label>*/}
            {/*              <div className="mt-2">*/}
            {/*                <input*/}
            {/*                  id="email"*/}
            {/*                  name="email"*/}
            {/*                  type="email"*/}
            {/*                  autoComplete="email"*/}
            {/*                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"*/}
            {/*                />*/}
            {/*              </div>*/}
            {/*            </div>*/}

            {/*            <div className="col-span-full">*/}
            {/*              <label*/}
            {/*                htmlFor="username"*/}
            {/*                className="block text-sm/6 font-medium text-white"*/}
            {/*              >*/}
            {/*                Username*/}
            {/*              </label>*/}
            {/*              <div className="mt-2">*/}
            {/*                <div className="flex items-center rounded-md bg-white/5 pl-3 outline outline-1 -outline-offset-1 outline-white/10 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">*/}
            {/*                  <input*/}
            {/*                    id="username"*/}
            {/*                    name="username"*/}
            {/*                    type="text"*/}
            {/*                    className="block min-w-0 grow bg-transparent py-1.5 pl-1 pr-3 text-base text-white placeholder:text-gray-500 focus:outline focus:outline-0 sm:text-sm/6"*/}
            {/*                  />*/}
            {/*                </div>*/}
            {/*              </div>*/}
            {/*            </div>*/}

            {/*            <div className="col-span-full">*/}
            {/*              <label*/}
            {/*                htmlFor="email"*/}
            {/*                className="block text-sm/6 font-medium text-white"*/}
            {/*              >*/}
            {/*                Rola*/}
            {/*              </label>*/}
            {/*              <div className="mt-2 ">*/}
            {/*                <input*/}
            {/*                  id="role"*/}
            {/*                  name="role"*/}
            {/*                  type="text"*/}
            {/*                  autoComplete="role"*/}
            {/*                  disabled={true}*/}
            {/*                  defaultValue={role || ""}*/}
            {/*                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-400 outline-none placeholder:text-gray-500 focus:outline-none sm:text-sm disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"*/}
            {/*                />*/}
            {/*              </div>*/}
            {/*            </div>*/}

            {/*            /!*<div className="col-span-full">*!/*/}
            {/*            /!*  <label*!/*/}
            {/*            /!*    htmlFor="timezone"*!/*/}
            {/*            /!*    className="block text-sm/6 font-medium text-white"*!/*/}
            {/*            /!*  >*!/*/}
            {/*            /!*    Timezone*!/*/}
            {/*            /!*  </label>*!/*/}
            {/*            /!*<div className="mt-2 grid grid-cols-1">*!/*/}
            {/*            /!*  <select*!/*/}
            {/*            /!*    id="timezone"*!/*/}
            {/*            /!*    name="timezone"*!/*/}
            {/*            /!*    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white/5 py-1.5 pl-3 pr-8 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 *:bg-gray-800 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"*!/*/}
            {/*            /!*  >*!/*/}
            {/*            /!*    <option>Pacific Standard Time</option>*!/*/}
            {/*            /!*    <option>Eastern Standard Time</option>*!/*/}
            {/*            /!*    <option>Greenwich Mean Time</option>*!/*/}
            {/*            /!*  </select>*!/*/}
            {/*            /!*  <ChevronDownIcon*!/*/}
            {/*            /!*    aria-hidden="true"*!/*/}
            {/*            /!*    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"*!/*/}
            {/*            /!*  />*!/*/}
            {/*            /!*</div>*!/*/}
            {/*            /!*</div>*!/*/}
            {/*          </div>*/}

            {/*          <div className="mt-8 flex">*/}
            {/*            <button*/}
            {/*              type="submit"*/}
            {/*              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"*/}
            {/*            >*/}
            {/*              Save*/}
            {/*            </button>*/}
            {/*          </div>*/}
            {/*        </form>*/}
            {/*      </div>*/}

            {/*      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">*/}
            {/*        <div>*/}
            {/*          <h2 className="text-base/7 font-semibold text-white">*/}
            {/*            Change password*/}
            {/*          </h2>*/}
            {/*          <p className="mt-1 text-sm/6 text-gray-400">*/}
            {/*            Update your password associated with your account.*/}
            {/*          </p>*/}
            {/*        </div>*/}

            {/*        <form className="md:col-span-2">*/}
            {/*          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">*/}
            {/*            <div className="col-span-full">*/}
            {/*              <label*/}
            {/*                htmlFor="current-password"*/}
            {/*                className="block text-sm/6 font-medium text-white"*/}
            {/*              >*/}
            {/*                Current password*/}
            {/*              </label>*/}
            {/*              <div className="mt-2">*/}
            {/*                <input*/}
            {/*                  id="current-password"*/}
            {/*                  name="current_password"*/}
            {/*                  type="password"*/}
            {/*                  autoComplete="current-password"*/}
            {/*                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"*/}
            {/*                />*/}
            {/*              </div>*/}
            {/*            </div>*/}

            {/*            <div className="col-span-full">*/}
            {/*              <label*/}
            {/*                htmlFor="new-password"*/}
            {/*                className="block text-sm/6 font-medium text-white"*/}
            {/*              >*/}
            {/*                New password*/}
            {/*              </label>*/}
            {/*              <div className="mt-2">*/}
            {/*                <input*/}
            {/*                  id="new-password"*/}
            {/*                  name="new_password"*/}
            {/*                  type="password"*/}
            {/*                  autoComplete="new-password"*/}
            {/*                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"*/}
            {/*                />*/}
            {/*              </div>*/}
            {/*            </div>*/}

            {/*            <div className="col-span-full">*/}
            {/*              <label*/}
            {/*                htmlFor="confirm-password"*/}
            {/*                className="block text-sm/6 font-medium text-white"*/}
            {/*              >*/}
            {/*                Confirm password*/}
            {/*              </label>*/}
            {/*              <div className="mt-2">*/}
            {/*                <input*/}
            {/*                  id="confirm-password"*/}
            {/*                  name="confirm_password"*/}
            {/*                  type="password"*/}
            {/*                  autoComplete="new-password"*/}
            {/*                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"*/}
            {/*                />*/}
            {/*              </div>*/}
            {/*            </div>*/}
            {/*          </div>*/}

            {/*          <div className="mt-8 flex">*/}
            {/*            <button*/}
            {/*              type="submit"*/}
            {/*              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"*/}
            {/*            >*/}
            {/*              Save*/}
            {/*            </button>*/}
            {/*          </div>*/}
            {/*        </form>*/}
            {/*      </div>*/}

            {/*      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">*/}
            {/*        <div>*/}
            {/*          <h2 className="text-base/7 font-semibold text-white">*/}
            {/*            Delete account*/}
            {/*          </h2>*/}
            {/*          <p className="mt-1 text-sm/6 text-gray-400">*/}
            {/*            No longer want to use our service? You can delete your*/}
            {/*            account here. This action is not reversible. All*/}
            {/*            information related to this account will be deleted*/}
            {/*            permanently.*/}
            {/*          </p>*/}
            {/*        </div>*/}

            {/*        <form className="flex items-start md:col-span-2">*/}
            {/*          <button*/}
            {/*            type="submit"*/}
            {/*            className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"*/}
            {/*          >*/}
            {/*            Yes, delete my account*/}
            {/*          </button>*/}
            {/*        </form>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</main>*/}
            {/*to jest widok ustawien  END*/}

            {/*koniec*/}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white">
            <header className="absolute inset-x-0 top-0 z-50">
              <nav
                aria-label="Global"
                className="flex items-center justify-between p-6 lg:px-8"
              >
                <div className="flex lg:flex-1">
                  <Link href="/" className="-m-1.5 p-1.5">
                    <span className="sr-only">
                      Polskie Towarzystwo Tradycyjnej Medycyny Chińskiej
                    </span>

                    <Image
                      alt="Polskie Towarzystwo Tradycyjnej Medycyny Chińskiej"
                      src="/logo.png"
                      width={400}
                      height={100}
                      className="h-16 w-auto"
                    />
                  </Link>
                </div>
                <div className="flex lg:hidden">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                  >
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon aria-hidden="true" className="size-6" />
                  </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-sm/6 font-semibold text-gray-900"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                  <Link
                    href="/login"
                    className="text-sm/6 font-semibold text-gray-900"
                  >
                    Zaloguj się
                  </Link>
                </div>
              </nav>
              <Dialog
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
                className="lg:hidden"
              >
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="-m-1.5 p-1.5">
                      <span className="sr-only">
                        Polskie Towarzystwo Tradycyjnej Medycyny Chińskiej
                      </span>

                      <Image
                        alt="Polskie Towarzystwo Tradycyjnej Medycyny Chińskiej"
                        src="/logo.png"
                        width={400}
                        height={100}
                        className="h-8 w-auto"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-m-2.5 rounded-md p-2.5 text-gray-700"
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon aria-hidden="true" className="size-6" />
                    </button>
                  </div>
                  <div className="mt-6 flow-root">
                    <div className="-my-6 divide-y divide-gray-500/10">
                      <div className="space-y-2 py-6">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                      <div className="py-6">
                        <Link
                          href="/login"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                        >
                          Zaloguj się
                        </Link>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </Dialog>
            </header>

            <div className="relative isolate px-6 pt-14 lg:px-8">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              >
                <div
                  style={{
                    clipPath:
                      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                  }}
                  className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                />
              </div>
              <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                <div className="text-center">
                  <h1 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                    Polskie Towarzystwo Tradycyjnej Medycyny Chińskiej
                  </h1>
                  <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                    Polskie Towarzystwo Tradycyjnej Medycyny Chińskiej (PTTMC) w
                    Krakowie zostało zarejestrowane w Krajowym Rejestrze Sądowym
                    pod numerem KRS: 0000331282 w dniu 09.06.2009 r.
                    Stowarzyszenie PTTMC działa na terenie całej Polski,
                    zrzeszając zarówno lekarzy jak i terapeutów praktykujących
                    tradycyjną i klasyczna medycynę chińską opartą na
                    diagnostyce i metodach TMC. PTTMC jest od 2013 roku
                    członkiem zwyczajnym European Traditional Chinese Medicine
                    Association (ETCMA) – najpoważniejszą europejską organizacją
                    zrzeszającą europejskie (w tym również izraelskie)
                    stowarzyszenia tradycyjnej medycyny chińskiej. PTTMC poprzez
                    ETCMA jest jedynym reprezentantem Polski na forum
                    międzynarodowym w zakresie tradycyjnej i klasycznej medycyny
                    chińskiej. Członkiem zwyczajnym PTTMC może zostać osoba
                    fizyczna (niekoniecznie lekarz medycyny zachodniej)
                    zajmująca się Tradycyjną Medycyną Chińską posiadająca do
                    tego odpowiednie kwalifikacje uzyskane w kraju lub zagranicą
                    uznane, na wniosek Zarządu, przez Walne Zgromadzenie
                    Towarzystwa, obejmujące jednak nie mniej niż 600 godzin
                    szkolenia w zakresie Tradycyjnej Medycyny Chińskiej (a od
                    2018 r. – nie mniej niż 1000 godz. szkoleniowych w zakresie
                    TMC).
                  </p>
                </div>
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
              >
                <div
                  style={{
                    clipPath:
                      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                  }}
                  className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
