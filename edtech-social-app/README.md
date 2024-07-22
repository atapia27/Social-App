install formatters
npm install --save-dev --save-exact prettier
node --eval "fs.writeFileSync('.prettierrc','{}\n')"
node --eval "fs.writeFileSync('.prettierignore','# Ignore artifacts:\nbuild\ncoverage\n')"
npm install -D prettier prettier-plugin-tailwindcss

Edit:
.prettierrc
{
"plugins": ["prettier-plugin-tailwindcss"]
}

Running Formatters:
npx prettier . --check
npx prettier . --write
