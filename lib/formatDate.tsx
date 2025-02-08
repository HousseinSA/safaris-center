import { format } from "date-fns";

const formatDate = (dateString: string | Date ) => {
    const date = new Date(dateString);
    return format(date, "yyyy/MM/dd, hh:mm a");
};
export default formatDate