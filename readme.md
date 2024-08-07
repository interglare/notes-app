1) npm ci
2) set env variables in .env:

PORT=3000
REDIS_URL=redis://localhost:6379
SESSION_SECRET=secret
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/notesdb?schema=public"

also you need create db in postgres with command:
"create database fenix;"

then apply migration:
"npx prisma migrate dev --name init"

after generate prisma client
"npx prisma generate"

3) to run dev:
npm run dev

4) to build 
npm run build