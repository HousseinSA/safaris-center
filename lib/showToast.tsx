import toast from "react-hot-toast";

export const showToast = (type: "success" | "error" | "info", message: string) => {
    switch (type) {
        case "success":
            toast.success(message);
            break;
        case "error":
            toast.error(message);
            break;
        case "info":
            toast(message);
            break;
        default:
            toast(message);
            break;
    }
};