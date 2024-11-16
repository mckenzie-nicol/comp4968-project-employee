import { Button } from "@/components/ui/button";
import { Clock, User } from "lucide-react";

export function Navbar() {
  return (
    <header className=" w-full border-b bg-white shadow-md">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Branding */}
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-black" aria-label="Clock Icon" />
          <span className="text-xl font-bold text-gray-900">
            <span className="bg-gradient-to-r from-black via-gray-800 to-black text-transparent bg-clip-text">
              TimeTrack
            </span>
          </span>
        </div>

        {/* Navigation Links
        <nav className="hidden md:flex items-center gap-6">
          {["Dashboard", "Projects", "Reports", "Team"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              aria-label={item}
            >
              {item}
            </a>
          ))}
        </nav> */}

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Account Button */}
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-2 bg-white hover:bg-gray-100 transition-all"
            aria-label="Account"
          >
            <User className="h-4 w-4 text-gray-700" />
            <span>Account</span>
          </Button>

        
        </div>
      </div>

      {/* Mobile Menu */}
      <nav className="flex md:hidden items-center justify-between gap-4 mt-2 px-4">
        {["Dashboard", "Projects", "Reports", "Team"].map((item) => (
          <a
            key={item}
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            aria-label={item}
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}
