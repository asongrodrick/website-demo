Package: AutoSpareParts website + backend + database
Files:
- index.html: Frontend single-page site (links to style.css and script.js)
- style.css: Styling
- script.js: Frontend behavior (fetches /api/products if backend running)
- server.js: Node.js Express server to serve products from SQLite
- package.json: npm metadata
- schema.sql / seed.sql: Database schema and seed statements
- autospareparts.db: Pre-populated SQLite DB (sample data)
How to run:
1) Unzip the package.
2) (Optional) To run the backend API:
   - Install Node.js (v14+), then in the folder run:
     npm install
     node server.js
   - API will be available at http://localhost:3000/api/products
3) Open index.html in a browser. If backend is running the frontend will request real data; otherwise it falls back to local demo products.
Notes:
- Checkout and payments are demos — integrate a real payment gateway for production.
- Replace picsum image URLs and contact details with your real assets.
