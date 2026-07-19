export interface PublicContact {
  email: { address: string; display: string; mailto: string };
  linkedin?: string;
  links: readonly { label: string; value: string; href: string }[];
}

const emailAddress = 'h[dot]tenlik7677[at]gmail[dot]com';

export const contact: PublicContact = {
  email: {
    address: emailAddress,
    display: emailAddress,
    mailto: `mailto:${emailAddress}`,
  },
  linkedin: 'https://www.linkedin.com/in/tenlik/',
  links: [
    { label: 'GitHub', value: 'https://github.com/htenlik', href: 'https://github.com/htenlik' },
  ],
};
