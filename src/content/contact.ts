export interface PublicContact {
  email: { address: string; display: string; mailto: string };
  linkedin?: string;
  links: readonly { label: string; value: string; href: string }[];
}

const emailAddress = 'h.tenlik7677@gmail.com';

export const contact: PublicContact = {
  email: {
    address: emailAddress,
    display: 'h[dot]tenlik7677[at]gmail[dot]com',
    mailto: `mailto:${emailAddress}`,
  },
  linkedin: 'https://www.linkedin.com/in/tenlik/',
  links: [
    { label: 'Website', value: 'https://htenlik.com', href: 'https://htenlik.com' },
    { label: 'GitHub', value: 'https://github.com/htenlik', href: 'https://github.com/htenlik' },
  ],
};
