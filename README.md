

## About
AutoToc makes electronic document navigation easier by attaching a structured interactive anchor map to your documents. 
- Works for both **scanned** and non-scanned documents through optical character recognition and text parsing
- Able to process all **PDF** documents
## Demo
## Get Started
Clone the project 
 ```bash
  git clone https://github.com/weijiePan/AutoToc.git
```
install packages
```bash
cd ./backend
npm i
```
input environment variables
```bash
cd ./backend
BLOB_URL=Microsoft Azure Storage SAS url
SUPABASE_URL= Supabase database url
SUPABASE_KEY= Supabase secret key
```
compile typescript
```bash
cd ./backend
tsc
```
run backend server 
```bash
cd ./backend/dist/routes
node ./server.js
```
setup and run frontend server
```bash
cd ./frontend/my-app/app
npm i
npm run dev
```
