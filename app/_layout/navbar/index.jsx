import { NavbarBrand } from './brand';
import { NavbarList } from './list';

export function Navbar() {
  return (
    <nav className='fixed inset-x-0 top-0 z-30 mix-blend-difference'>
      <div className='flex items-center justify-between px-8 py-4 text-background'>
        <NavbarBrand />
        <NavbarList />
      </div>
    </nav>
  );
}
