Copy the contents of this folder into C:\Users\DELL\Desktop\Launchfolio.

Allow Windows to replace existing files. Do not copy .env.local from elsewhere and never share its values.

After copying, run:
  npm install --cache .npm-cache --no-audit --no-fund
  npm run db:migrate
  npm run dev
