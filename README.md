# remember-dogs

## Deploy

GitHub Actions deploys this app to Cloudflare Pages on every push to `main`.

Required repository configuration:

1. GitHub Actions variable: `CLOUDFLARE_ACCOUNT_ID`
2. GitHub Actions secret: `CLOUDFLARE_API_TOKEN`

The workflow builds the app with `npm run build` and deploys `dist/` to the Cloudflare Pages project `remember-dogs`.
