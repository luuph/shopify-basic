// pages/api/addresses.js
import fs from 'fs';
import path from 'path';
export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'data', 'addresses.json');
    const addressesData = fs.readFileSync(filePath);
    const addresses = JSON.parse(addressesData) ?? [];
    res.status(200).json({ addresses });
}