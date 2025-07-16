import Link from 'next/link';
import ThemeToggle from '../theme/theme-toggle';
import AvatarDropdown from './avatar-dropdown';
import NavbarContainer from './navbar-container';

export default function Navbar() {
  return (
    <NavbarContainer>
      <Link href="/" className="group mr-4 font-bold text-4xl ml-2 relative">
        <span className="relative z-10">Clueless</span>
        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-0"></span>
      </Link>
      <Link className="text-xl ml-4" href="/questions">
        Questions
      </Link>
      <Link className="text-xl ml-4" href="/interview">
        Interview
      </Link>
      <Link className="text-xl ml-4" href="/goals">
        Goals
      </Link>
      <div className="flex flex-1 justify-end items-center h-full">
        <div className="mr-2 flex items-center h-full">
          <AvatarDropdown />
        </div>
        <div className="mr-2 flex items-center h-full">
          <ThemeToggle />
        </div>
      </div>
    </NavbarContainer>
  );
}
