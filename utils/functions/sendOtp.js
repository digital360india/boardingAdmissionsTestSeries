import axios from "axios";

export const sendOtp = async (name, email, verificationCode) => {
    try {
        const response = await axios.post("https://appinfologicmailerservice.onrender.com/send-otp", {
            name,
            email,
            verificationCode,
        });
        return response.data;
    } catch (error) {
        console.error("Error sending OTP:", error);
        throw new Error("Failed to send verification email.");
    }
};
