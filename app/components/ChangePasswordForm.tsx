// // components/ChangePasswordForm.tsx
// "use client"; // Mark as a client component

// import { useState } from "react";
// import { useSession } from "next-auth/react";
// import db from "@/lib/mongodb"; // Import your db utility

// export default function ChangePasswordForm() {
//     const { date:session } = useSession();
//     const [currentPassword, setCurrentPassword] = useState("");
//     const [newPassword, setNewPassword] = useState("");
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError("");
//         setSuccess("");

//         try {
//             // Verify the current password
//             const isValid = await db.verifyUserPassword(currentPassword);
//             if (!isValid) {
//                 setError("Current password is incorrect");
//                 return;
//             }

//             // Update the password
//             await db.updateUserPassword(newPassword);
//             setSuccess("Password updated successfully!");
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//                 <label>Current Password</label>
//                 <input
//                     type="password"
//                     value={currentPassword}
//                     onChange={(e) => setCurrentPassword(e.target.value)}
//                     className="w-full p-2 border rounded"
//                     required
//                 />
//             </div>
//             <div>
//                 <label>New Password</label>
//                 <input
//                     type="password"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     className="w-full p-2 border rounded"
//                     required
//                 />
//             </div>
//             {error && <p className="text-red-500">{error}</p>}
//             {success && <p className="text-green-500">{success}</p>}
//             <button
//                 type="submit"
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             >
//                 Change Password
//             </button>
//         </form>
//     );
// }