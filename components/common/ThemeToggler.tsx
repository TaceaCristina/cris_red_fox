"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HardDrive, Moon, Sun } from "lucide-react";

// Define the type for theme values
type ThemeValue = "system" | "light" | "dark";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null; // Avoid rendering on the server
  
  // Use resolvedTheme instead of calculating currentTheme
  const currentTheme = resolvedTheme || "system";
  
  const renderButton = () => {
    const isDarkMode = currentTheme === "dark";
    const Icon = isDarkMode ? Moon : Sun;
    const buttonClasses = isDarkMode
      ? "rounded-full bg-slate-600 p-1 text-slate-100"
      : "rounded-full bg-slate-100 p-1";
    
    return (
      <button className={buttonClasses}>
        <Icon size={20} />
      </button>
    );
  };
  
  const renderMenuItem = (themeValue: ThemeValue, Icon: React.ElementType, label: string) => (
    <DropdownMenuItem
      className="flex items-center gap-3"
      onClick={() => setTheme(themeValue)}
    >
      <Icon size={20} />
      <span>{label}</span>
    </DropdownMenuItem>
  );
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{renderButton()}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuLabel>Alege tema</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {renderMenuItem("system", HardDrive, "Sistem")}
        {renderMenuItem("light", Sun, "Luminoasă")}
        {renderMenuItem("dark", Moon, "Întunecată")}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}