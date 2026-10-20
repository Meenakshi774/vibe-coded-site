// Site-wide content. Edit the values here to update the header, footer,
// newsletter copy and default page metadata across every page.

export const site = {
  name: 'Meenakshi Sisodiya',
  wordmark: 'MEENAKSHI SISODIYA',
  description:
    'Meenakshi Sisodiya — creator, builder and entrepreneur. Projects, ideas and a weekly newsletter.',
};

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Projects', href: '/projects/' },
];

// PLACEHOLDER social links. Replace each href with a real profile URL,
// or delete the entry. They point to example.com until then.
export const socialLinks = [
  { label: 'X / Twitter', href: 'https://example.com/replace-with-x-profile' },
  { label: 'LinkedIn', href: 'https://example.com/replace-with-linkedin-profile' },
  { label: 'YouTube', href: 'https://example.com/replace-with-youtube-channel' },
];

export const newsletter = {
  heading: 'GOOD IDEAS.',
  headingHighlight: 'ONCE A WEEK.',
  description:
    "A weekly email about what I'm building, what I'm learning, and ideas worth sharing.",
  buttonLabel: 'COUNT ME IN',
  // Shown after a valid submission. Keep it honest: no service is connected yet.
  demoSuccessMessage:
    'Thanks! The signup form is ready to connect to the newsletter service.',
};
