export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Job search', href: '/jobs' },
  { label: 'Staff', href: '/staff' },
  { label: 'Post a job', href: '/post-a-job' },
  { label: 'Contact', href: '/contact' },
];
