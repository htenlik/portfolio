# htenlik.com — Under Construction

A dependency-free placeholder site for `htenlik.com`.

## Local preview

Run this command from the project folder:

```bash
python3 -m http.server 8000 --directory public
```

Then visit:

```text
http://localhost:8000
```

## Publish to GitHub

Create an empty public repository named `portfolio`, then run these commands from this folder:

```bash
git init
git add .
git commit -m "Launch under construction page"
git branch -M main
git remote add origin https://github.com/htenlik/portfolio.git
git push -u origin main
```

## Cloudflare Pages settings

- Production branch: `main`
- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `public`

After the first deployment, add both custom domains:

- `htenlik.com`
- `www.htenlik.com`

Use Cloudflare Redirect Rules to redirect `www.htenlik.com` to `https://htenlik.com`.

## Before launching the full portfolio

Remove this line from `public/index.html` so search engines can index the finished site:

```html
<meta name="robots" content="noindex, nofollow" />
```
