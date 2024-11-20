# Setup

1. add `127.0.0.1 localhost.dev` to `/etc/hosts`
2. install mkcert `brew install mkcert` (or `choco install mkcert`) https://web.dev/articles/how-to-use-local-https
3. run `mkcert -install` - install root certificate
4. run `mkcert localhost.dev` - generate certificate for localhost.dev

# Run

1. `npm install`
2. `npm run dev`
3. open https://localhost.dev:3001
