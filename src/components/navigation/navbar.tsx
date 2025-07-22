import Link from 'next/link';
import ThemeToggle from '../theme/theme-toggle';
import AvatarDropdown from './avatar-dropdown';
import NavLink from './nav-link';
import NavbarContainer from './navbar-container';

export default function Navbar() {
  return (
    <NavbarContainer>
      <Link href="/" className="group mr-4 font-bold text-4xl ml-2 relative">
        <span className="relative z-10">Clueless</span>
        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-0"></span>
      </Link>
      <div className='flex gap-6 ml-6'>
        <NavLink className="text-xl w-28 text-center" href="/questions">
          Questions
        </NavLink>
        <NavLink className="text-xl w-28 text-center" href="/interview">
          Interview
        </NavLink>
        <NavLink className="text-xl w-28 text-center" href="/goals">
          Goals
        </NavLink>
      </div>
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
