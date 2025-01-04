/* const fs = require('fs');
export function generateRandomName() {
    const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'Chris', 'Sarah', 'David', 'Laura', 'James', 'Sophia'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Hernandez'];

    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    const randomName = {
        firstName: randomFirstName,
        lastName: randomLastName
    };

    const filePath = 'buffer.json';
    let bufferData = {};

    try {
        if (fs.existsSync(filePath)) {
            const fileContents = fs.readFileSync(filePath, 'utf8'); // Read the existing file
            bufferData = JSON.parse(fileContents); // Parse JSON content
        }
    } catch (error) {
        console.error('Error reading or parsing buffer.json:', error);
    }

    // Ensure that the 'firstName' and 'lastName' properties remain unchanged
    bufferData.firstName = randomName.firstName;
    bufferData.lastName = randomName.lastName;

    // Write the updated data (with the random name) back to buffer.json
    fs.writeFileSync(filePath, JSON.stringify(bufferData, null, 2), 'utf8');

    return randomName;
} */
export function generateRandomName() {
    const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'Chris', 'Sarah', 'David', 'Laura', 'James', 'Sophia'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Hernandez'];

    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return {
        firstName: randomFirstName,
        lastName: randomLastName
    };
}
