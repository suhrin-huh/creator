interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white shadow-md md:rounded-t-lg">
      <nav className="p-md flex flex-col items-center justify-between md:flex-row">
        <div className="text-h3 text-primary font-semibold">{title}</div>
      </nav>
    </header>
  );
}
