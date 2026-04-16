interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <h1 className="font-pixel text-text-main text-body-md text-center tracking-widest">
      ✦ {title} ✦
    </h1>
  );
}
