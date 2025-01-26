// // scripts/insertDemoUser.ts
// import db from "@/lib/mongodb"; // Import your db utility
// import bcrypt from "bcrypt";

// async function insertDemoUser() {
//     const demoPassword = "demo123"; // Demo password
//     const hashedPassword = await bcrypt.hash(demoPassword, 10); // Hash the password

//     // Insert or update the demo user
//     await db.updateUserPassword(hashedPassword);

//     console.log("Demo user inserted/updated successfully!");
// }

// insertDemoUser();