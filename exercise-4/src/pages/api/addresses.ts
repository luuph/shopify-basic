// pages/api/addresses.js
import fs from 'fs';
import path from 'path';
export default function handler(req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { addresses: any; }): void; new(): any; }; }; }) {
    const filePath = path.join(process.cwd(), 'data', 'addresses.json');
    const addressesData = fs.readFileSync(filePath);
    // @ts-ignore
    const addresses = JSON.parse(addressesData) ?? [];
    res.status(200).json({ addresses });
}