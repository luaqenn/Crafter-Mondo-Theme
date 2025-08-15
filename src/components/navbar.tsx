"use client";

import Link from "next/link";
import {
  Menu,
  ShoppingCart,
  User,
  LogOut,
  Wallet,
  CoinsIcon,
  BoxIcon,
  UserIcon,
  ChevronDown,
  Bell,
  Settings,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "@/lib/context/auth.context";
import { useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { WebsiteContext } from "@/lib/context/website.context";
import { Avatar } from "./ui/avatar";
import { useCart } from "@/lib/context/cart.context";
import { Badge } from "./ui/badge";
import { Head } from "./ui/head";
import { IconRenderer } from "@/components/ui/icon-renderer";
import { Input } from "./ui/input";
import Image from "next/image";

const formatBalance = (balance: number | undefined): string => {
  if (balance === undefined || balance === null) return "0.00";
  return balance.toFixed(2);
};

export function Navbar() {
  const { isAuthenticated, user, signOut } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const { website } = useContext(WebsiteContext);
  const { cart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headerHeight = window.innerHeight; // Header tam ekran yüksekliği
      
      // Header görünür mü kontrol et
      setIsHeaderVisible(scrollY < headerHeight);
      
      // Navbar'ın scroll durumunu kontrol et
      setIsScrolled(scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLinkClassName = (path: string) => {
    const isActive = path === "/" ? pathname === "/" : pathname.startsWith(path) && path !== "/";
    return `relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 group ${
      isActive 
        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/25" 
        : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 hover:text-gray-900 dark:hover:text-white hover:shadow-md"
    }`;
  };

  const navigationItems = website?.theme.navbar;

  const userMenuItems = [
    { href: "/profile", icon: User, label: "Profilim" },
    { href: "/wallet", icon: Wallet, label: "Cüzdanım" },
    { href: "/chest", icon: BoxIcon, label: "Sandığım" },
    { href: "/settings", icon: Settings, label: "Ayarlar" },
  ];

  return (
    <header 
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 ${
        isHeaderVisible 
          ? 'bg-transparent' 
          : isScrolled 
            ? 'bg-black/95 dark:bg-black/95 backdrop-blur-2xl border border-gray-800/60 dark:border-gray-800/60 shadow-xl shadow-black/20 rounded-2xl' 
            : 'bg-gradient-to-r from-gray-900/90 via-black/90 to-gray-900/90 dark:from-black/90 dark:via-gray-900/90 dark:to-black/90 backdrop-blur-2xl rounded-2xl border border-gray-800/20 dark:border-gray-800/20'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo/Brand - Sol */}
          <div className="flex items-center gap-8">
             {/* Desktop Navigation */}
             <nav className="hidden lg:flex items-center space-x-2">
               {navigationItems?.map((item) => (
                 <Link key={item.url} href={item.url} className={getLinkClassName(item.url)}>
                   <IconRenderer iconName={item.icon} className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                   <span>{item.label}</span>
                 </Link>
               ))}
             </nav>
           </div>

          {/* Orta - Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Ara..."
                className="pl-10 pr-4 py-2 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 rounded-xl backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          {/* Sağ taraf - Actions */}
          <div className="flex items-center gap-2">
            
            {/* Mobile Search */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Notification Bell */}
            <Button variant="ghost" size="sm" className="relative p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 group">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 group">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                {totalItems > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 h-auto rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 group">
                    <div className="relative">
                      <Head username={user?.username || "steve"} size={32} className="w-8 h-8 rounded-xl ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-300" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.username}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <CoinsIcon className="w-3 h-3" />
                        {formatBalance(user?.balance)} {website?.currency}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 group-hover:rotate-180 transition-transform duration-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 mt-2 p-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl">
                  <DropdownMenuLabel className="p-3">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-3">
                        <Head username={user?.username || "steve"} size={48} className="w-12 h-12 rounded-xl ring-2 ring-blue-500/20" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.username}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <CoinsIcon className="w-3 h-3" />
                            {formatBalance(user?.balance)} {website?.currency}
                          </p>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-gray-700/50" />
                  <div className="p-1">
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.href} href={item.href}>
                          <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                            <Icon className="w-4 h-4 text-gray-500" />
                            {item.label}
                          </DropdownMenuItem>
                        </Link>
                      );
                    })}
                  </div>
                  <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-gray-700/50" />
                  <DropdownMenuItem onClick={signOut} className="flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
                    <LogOut className="w-4 h-4" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/sign-in">
                  <Button variant="ghost" size="sm" className="text-sm rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="sm" className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg shadow-blue-500/25">
                    Kayıt Ol
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 px-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
                  <div className="flex flex-col h-full">
                    {/* Mobile Search */}
                    {isSearchOpen && (
                      <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="Ara..."
                            className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
                          />
                        </div>
                      </div>
                    )}

                    {/* Mobile Navigation */}
                    <nav className="flex-1 px-4 py-4">
                      <div className="space-y-2">
                        {navigationItems?.map((item) => (
                          <Link 
                            key={item.url} 
                            href={item.url} 
                            className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                              pathname === item.url 
                                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400 shadow-lg"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <IconRenderer iconName={item.icon} className="w-5 h-5" />
                              {item.label}
                            </div>
                          </Link>
                        ))}
                        
                        <Link 
                          href="/cart"
                          className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                            pathname === "/cart"
                              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400 shadow-lg"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <ShoppingCart className="w-5 h-5" />
                              {totalItems > 0 && (
                                <Badge 
                                  variant="secondary" 
                                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white"
                                >
                                  {totalItems}
                                </Badge>
                              )}
                            </div>
                            Sepet
                          </div>
                        </Link>
                      </div>
                    </nav>

                    {/* Mobile User Section */}
                    <div className="px-4 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      {isAuthenticated ? (
                        <div className="space-y-4">
                          {/* User Info */}
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                            <div className="relative">
                              <Head username={user?.username || "steve"} size={40} className="w-10 h-10 rounded-xl ring-2 ring-blue-500/20" />
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {user?.username}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <CoinsIcon className="w-3 h-3" />
                                {formatBalance(user?.balance)} {website?.currency}
                              </p>
                            </div>
                          </div>

                          {/* User Menu Items */}
                          <div className="space-y-1">
                            {userMenuItems.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link key={item.href} href={item.href}>
                                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                  </div>
                                </Link>
                              );
                            })}
                          </div>

                          <Button 
                            onClick={signOut}
                            variant="outline" 
                            size="sm" 
                            className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Çıkış Yap
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                            <UserIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                              Giriş Yapın
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Tüm özelliklerden faydalanın
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Link href="/auth/sign-in" className="flex-1">
                              <Button variant="outline" size="sm" className="w-full rounded-xl">
                                Giriş Yap
                              </Button>
                            </Link>
                            <Link href="/auth/sign-up" className="flex-1">
                              <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl">
                                Kayıt Ol
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}