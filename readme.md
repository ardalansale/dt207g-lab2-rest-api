# DT207G – Laboration 2 – Uppgift 1 - REST‑API för arbetserfarenheter
En REST‑baserad webbtjänst för att hantera arbetserfarenheter i en CV‑databas.
Byggd med Express och PostgreSQL (Railway).

## Publicerad API‑länk
[API‑URL vid deploy]

## GitHub‑repo
https://github.com/ardalansale/dt207g-lab2-restapi

## Funktionalitet
- Hämta alla arbetserfarenheter (GET)
- Lägga till nya poster (POST)
- Uppdatera befintliga poster (PUT)
- Radera poster (DELETE)
- Inputvalidering av obligatoriska fält
- JSON‑baserade svar
- CORS aktiverat

## Databas
Tabell: dt207g_lab2_workexperience  
Fält:
- id (serial, primary key)
- companyname (varchar)
- jobtitle (varchar)
- location (varchar)
- startdate (date)
- enddate (date)
- description (text)

## Tekniker
- Node.js
- Express
- PostgreSQL (Railway)
- dotenv
- CORS

## Installation
npm install
node app.js

API:t körs på:
http://localhost:3000
