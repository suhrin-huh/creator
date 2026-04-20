interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <h1 className="font-pixel text-foreground-main text-body-md text-center tracking-widest">
      ✦ {title} ✦
    </h1>
  );
}
