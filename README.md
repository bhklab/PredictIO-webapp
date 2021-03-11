# IOdb

IO.db is an web application that allows users to explore gene signatures in 19 immunotherapy studies of ICB-treated patients, and to obtain gene signature predictions using molecular data of their own studies of ICB-treated patients.

## Setup Instructions

- Clone the repo
  
```bash
git clone git@github.com:bhklab/IOdb.git
cd IOdb
```

- In the project directory, install all the server dependencies using `pip install -r requirements.txt
- To start the server run this command `flask run`
- In the project directory, install all client dependencies `npm i`
- Start the client (development mode) by running `npm start`
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Dependencies

- React
- React-Route
- Body-parser

## Dev Dependenices

- Eslint

## Generate Seed Files

- Download raw_data directory from [https://codeocean.com/capsule/6711882/tree](https://codeocean.com/capsule/6711882/tree) capsule
- Run data generation script

```bash
python scripts/generate_seed_files.py
```

## Build Instructions

### `cd client && npm build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

## Server

- To be determined.
