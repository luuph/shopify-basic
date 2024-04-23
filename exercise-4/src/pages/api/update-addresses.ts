// pages/api/update-address.js
import fs from 'fs';
import path from 'path';

export default function handler(req: { body: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { newData: any; }): void; new(): any; }; }; }) {
    const filePath = path.join(process.cwd(), 'data', 'addresses.json');
    const newData = req.body;

    // try {

    // Ghi dữ liệu đã được cập nhật vào tệp JSON
    fs.writeFileSync(filePath, JSON.stringify(newData));

    // Trả về thành công
    res.status(200).json({ newData });
    // } catch (error) {
    //     // Trả về lỗi nếu có bất kỳ lỗi nào xảy ra
    //     res.status(500).json({ error: 'Failed to update addresses' });
    // }
}