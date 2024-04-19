// pages/api/update-address.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'data', 'addresses.json');
    const newData = req.body;

    // try {
        const addressesData = fs.readFileSync(filePath);
        const addresses = JSON.parse(addressesData) ?? [];
        const newAddress = newData[0];
        addresses.push(newAddress);

        // Ghi dữ liệu đã được cập nhật vào tệp JSON
        fs.writeFileSync(filePath, JSON.stringify(addresses));

        // Trả về thành công
        res.status(200).json({ newData });
    // } catch (error) {
    //     // Trả về lỗi nếu có bất kỳ lỗi nào xảy ra
    //     res.status(500).json({ error: 'Failed to update addresses' });
    // }
}