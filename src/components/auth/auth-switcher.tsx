import Link from 'next/link';

export default function AuthSwitcher({ mode }: { mode: 'login' | 'register' }) {
  return (
    <Link
      href={mode === 'login' ? '/register' : '/login'}
      className="mt-4 inline-block text-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-gray-200 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {mode === 'login' ? 'Register' : 'Sign In'}
    </Link>
  );
}
