import { ThemeToggle } from "components/ThemeToggle";

export default function Header() {
  return (
    <header className="relative">
      <div className="flex justify-between">
        Header
        <ThemeToggle />
      </div>
    </header>
  );
}
