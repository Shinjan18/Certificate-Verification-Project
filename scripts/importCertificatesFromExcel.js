require('dotenv').config();
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Path to your models and utils - relative to the script location
const Certificate = require('../backend/src/models/Certificate');
const hashUtil = require('../backend/src/utils/hash');

// CRITICAL FIX: Use the SAME Mongoose instance that the Model uses
const mongoose = Certificate.base;

async function importCertificates() {
    const EXCEL_PATH = 'G:\\Study Materials\\Amdox Internship\\Certificate Verification Project\\Certificate_Verification_2025_to_2026.xlsx';

    try {
        console.log('--- Starting Certificate Import (Stabilized) ---');

        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI not found in .env file');
        }

        // Configuration on the CORRECT instance
        mongoose.set('bufferCommands', false); // Disable buffering to catch issues early

        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });

        // Log connection details for verification
        console.log('✅ Connected to MongoDB successfully!');
        console.log('DB Name:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);
        console.log('Connection State:', mongoose.connection.readyState); // Should be 1

        // Check if the Excel file exists
        if (!fs.existsSync(EXCEL_PATH)) {
            console.error(`\nERROR: Excel file not found at path: ${EXCEL_PATH}\n`);
            process.exit(1);
        }

        // Read the Excel file
        console.log(`Reading Excel file: ${path.basename(EXCEL_PATH)}`);
        const workbook = XLSX.readFile(EXCEL_PATH, { cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        console.log(`Successfully read ${data.length} rows.`);

        const excelIds = [];
        const bulkOps = [];
        let skippedCount = 0;

        console.log('\nMapping rows to certificates...');

        for (const row of data) {
            try {
                const certId = row['CERTIFICATE ID'] || row['certificateId'] || row['ID'];

                if (!certId) {
                    console.warn('  ! Skipping: No ID found in row');
                    skippedCount++;
                    continue;
                }

                const mappedRow = {
                    certificateId: certId.toString().trim(),
                    studentName: (row['STUDENT NAME'] || row['studentName'] || '').toString().trim(),
                    email: (row['EMAIL'] || row['email'] || '').toString().toLowerCase().trim(),
                    internshipDomain: (row['COURSE'] || row['internshipDomain'] || '').toString().trim(),
                    startDate: row['ISSUE DATE'] || row['startDate'] || row['issueDate'],
                    endDate: row['EXPIRY DATE'] || row['endDate'] || row['expiryDate'],
                };

                // Standard Validation
                if (!mappedRow.studentName || !mappedRow.email || !mappedRow.internshipDomain || !mappedRow.startDate || !mappedRow.endDate) {
                    console.warn(`  ! Skipping row ${certId}: Missing required fields`);
                    skippedCount++;
                    continue;
                }

                mappedRow.startDate = new Date(mappedRow.startDate);
                mappedRow.endDate = new Date(mappedRow.endDate);

                if (isNaN(mappedRow.startDate.getTime()) || isNaN(mappedRow.endDate.getTime())) {
                    console.warn(`  ! Skipping row ${certId}: Invalid date format`);
                    skippedCount++;
                    continue;
                }

                // Compute security hash
                mappedRow.hash = hashUtil.computeHash(mappedRow);
                excelIds.push(mappedRow.certificateId);

                // Add to bulk operations (Upsert logic)
                bulkOps.push({
                    updateOne: {
                        filter: { certificateId: mappedRow.certificateId },
                        update: { $set: mappedRow },
                        upsert: true
                    }
                });

            } catch (rowError) {
                console.error(`  !! ERROR mapping row:`, rowError.message);
                skippedCount++;
            }
        }

        if (bulkOps.length > 0) {
            console.log(`\nExecuting Bulk Upsert for ${bulkOps.length} records...`);

            // Execute the bulk operation
            const bulkResult = await Certificate.bulkWrite(bulkOps, { ordered: false });

            console.log(`✅ Bulk Upsert finished!`);
            console.log(`- New Records (Upserted): ${bulkResult.upsertedCount}`);
            console.log(`- Updated Records: ${bulkResult.modifiedCount}`);
        } else {
            console.log('\nNo valid records to import.');
        }

        // 4. Source of Truth: Delete records NOT in the Excel file
        console.log('\nSyncing: Cleaning up records not in Excel...');
        const deleteResult = await Certificate.deleteMany({
            certificateId: { $nin: excelIds }
        });
        console.log(`✅ Cleanup finished!`);
        console.log(`- Records removed from DB: ${deleteResult.deletedCount}`);

        console.log('\n--- Import Completed Successfully! ---');

        await mongoose.disconnect();
        console.log('Database connection closed.');
        process.exit(0);

    } catch (error) {
        console.error('\nFATAL ERROR during import process:');
        console.error(error);
        if (mongoose.connection && mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
}

importCertificates();
