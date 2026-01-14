export default function Header() {
  // const navOptions = [
  //   { label: "가", href: null },
  //   { label: "나", href: null },
  //   { label: "다", href: null },
  //   { label: "라", href: null },
  // ];

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm md:rounded-t-lg">
      <nav className="p-lg flex flex-col items-center justify-between md:flex-row">
        <div className="logo text-h3 text-primary font-bold">Creator</div>
        {/* <ul className="nav-links gap-x-md flex">
            {navOptions.map((option) => (
              <li className="hover:text-primary-hover" key={`li-${option.label}`}>
                <a href="#test">{option.label}</a>
              </li>
            ))}
          </ul> */}
      </nav>
    </header>
  );
}
