import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import NavItem from "./nav-item";

interface SideBarProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ElementType;
  }[]
  showTooltip: boolean
  
}

export default function SideNavBar({
  className,
  items = [], // valoare implicită în caz că items este undefined
  showTooltip,
  ...props
}: SideBarProps) {  
  // Verifică dacă items este un array și convertește la array dacă nu este
  const safeItems = Array.isArray(items) ? items : [];
  
  return (
    <ScrollArea className="mt-8 h-[70vh]">
      <nav className={cn("flex flex-col space-y-6", className)} {...props}>
        {safeItems.map((item) => (
          <NavItem key={item.href} {...item} showTooltip={showTooltip} />
        ))}
      </nav>
    </ScrollArea>
  );
}
