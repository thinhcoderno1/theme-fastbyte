import { PhoneCall } from 'lucide-react';
import { siFacebook } from 'simple-icons';

const contacts = [
  {
    label: 'Facebook',
    ariaLabel: 'Liên hệ Fast Byte qua Facebook',
    href: 'https://www.facebook.com/thuevpsgiare.vn/',
    external: true,
    className: 'bg-[#1877F2] hover:bg-[#1264cf] focus-visible:ring-[#1877F2]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
        <path d={siFacebook.path} />
      </svg>
    ),
  },
  {
    label: 'Hotline',
    ariaLabel: 'Gọi hotline Fast Byte 0287 300 6198',
    href: 'tel:02873006198',
    external: false,
    className: 'bg-semantic-success hover:bg-[#12813b] focus-visible:ring-semantic-success',
    icon: <PhoneCall className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" />,
  },
];

export function FloatingContact() {
  return (
    <aside
      className="fixed bottom-5 right-4 z-40 flex flex-col gap-3 sm:bottom-7 sm:right-6"
      aria-label="Liên hệ nhanh"
    >
      {contacts.map((contact) => (
        <a
          key={contact.label}
          href={contact.href}
          target={contact.external ? '_blank' : undefined}
          rel={contact.external ? 'noopener noreferrer' : undefined}
          aria-label={contact.ariaLabel}
          className={`group relative flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_6px_18px_rgba(11,16,32,0.22)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:h-[52px] sm:w-[52px] ${contact.className}`}
        >
          <span
            className="pointer-events-none absolute right-[calc(100%+10px)] whitespace-nowrap rounded-md bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            aria-hidden="true"
          >
            {contact.label}
          </span>
          {contact.icon}
        </a>
      ))}
    </aside>
  );
}
