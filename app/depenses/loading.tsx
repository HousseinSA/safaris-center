import { BeatLoader } from "react-spinners";

export default function Loading() {
    return (
        <div className="absolute inset-0 top-1/3 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <BeatLoader color="#ED7D06" size={20} />
        </div>
    );
}