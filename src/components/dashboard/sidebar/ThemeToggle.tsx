
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface ThemeToggleProps {
  isExpanded: boolean;
}

export default function ThemeToggle({ isExpanded }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (isExpanded) {
    return (
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span className="text-sm">{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
        </div>
        <Switch 
          checked={theme === 'dark'}
          onCheckedChange={toggleTheme}
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleTheme} 
        className="rounded-full"
      >
        {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>
    </div>
  );
}
