const fs = require('fs');
const path = require('path');
const axios = require('axios');

describe('Write JSON file using NodeJS', () => {
    test('should write data to the JSON file successfully', () => {
        const filePath = path.join(process.cwd(), 'data', 'test.json');
        const testData = [{"address":"Test 1","city":"City test 1"}];

        fs.writeFileSync(filePath, JSON.stringify(testData));

        const data = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(data);

        expect(jsonData).toEqual(testData);
    });
    test('should throw an error for invalid data', () => {
        const filePath = path.join(process.cwd(), 'data', 'test.json');
        const invalidData = null;

        expect(() => {
            fs.writeFileSync(filePath, JSON.stringify(invalidData));
        }).toThrow();
    });
});
// Test reading JSON file
describe('Read JSON file using NodeJS', () => {
    test('should read the JSON file successfully', () => {
        const filePath = path.join(process.cwd(), 'data', 'addresses.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(data);

        expect(jsonData).toEqual([{"address":"Test 1","city":"City test 1"}]);
    });
    test('should throw an error for invalid file path', () => {
        const filePath = path.join(process.cwd(), 'data', 'addresses.json');
        expect(() => {
            fs.readFileSync(filePath, 'utf-8');
        }).toThrow();
    });
});

// Test fetching addresses data via API
describe('Fetch addresses data via API', () => {
    test('should return addresses data', async () => {
        const response = await axios.get('http://localhost:3000/api/addresses');
        const { addresses } = response.data;

        // Assertion to check if the response status is 200
        expect(response.status).toBe(200);

        // Assertion to check if the addresses data has expected structure or content
        expect(addresses).toEqual([{"address":"Test 1","city":"City test 1"}]);
    });
    test('should return an error for invalid API endpoint', async () => {
        const invalidEndpoint = 'http://localhost:3000/api/invalid';
        await expect(axios.get(invalidEndpoint)).rejects.toThrow();
    });
});
