

## About
AutoToc makes electronic document navigation easier by attaching a structured interactive anchor map to your documents. 
- Works for both **scanned** and non-scanned documents through optical character recognition and text parsing
- Able to process all **PDF** documents
## Demo
![](https://github.com/weijiePan/AutoToc/blob/master/demo-ezgif.com-video-to-gif-converter.gif)
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
create environment variables and store it in backend folder
```bash
BLOB_URL=Microsoft Azure Storage SAS url
SUPABASE_URL= Supabase database url
SUPABASE_KEY= Supabase secret key
```
build typescript and run backend server
```bash
tsc
node ./dist/routes/server.js
```
setup and run frontend server
```bash
cd ./frontend/my-app/app
npm i
npm run dev
```
