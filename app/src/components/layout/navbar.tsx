import { Button } from "@/components/ui/button";
import { Clock, Menu, User } from "lucide-react";
import ThemeToggleButton from "../ui/theme-toggler";



export function Navbar() {
  return (
    <header className="w-full bg-background text-foreground border-b border-border dark:border-none">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Branding */}
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-logo" aria-label="Clock Icon" />
          <span className="text-xl font-bold">
            <span className="bg-clip-text text-primary">
              TimeTrack
            </span>
          </span>
        </div>

        {/* just adding this for testing themes, you guys can find a more elegant place for it later*/}
        
    

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <ThemeToggleButton />

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden bg-gray-800 hover:bg-gray-700"
            aria-label="Open Mobile Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden mt-2 px-4">
        {["Dashboard", "Projects", "Reports", "Team"].map((item) => (
          <a
            key={item}
            href="#"
            className="block py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}
