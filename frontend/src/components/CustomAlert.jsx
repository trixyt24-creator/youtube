import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

let alertHandle; // initially undefined, once its mounted using app.jsx it will have that function. Now whenever somebody calls below function, alertHandle will assign values to message and showAlert.

export const showCustomAlert = (message) => {
  if (alertHandle) {
    alertHandle(message); // alertHandle is a function that will assign values to message and showAlert.
  }
};

export default function CustomAlert() {
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // alertHandle is no more undefined. Now it contains truthy value
    alertHandle = (message) => {
      setMessage(message);
      setShowAlert(true);
    };
  }, []);

  return (
    showAlert && (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        className="fixed right-6 top-6 z-150 w-[350px] rounded-2xl shadow-lg overflow-hidden border border-neutral-800 text-white"
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#202020] border-b border-neutral-800">
          <span className="text-sm font-semibold text-red-500 tracking-wide">
            YouTube Alert
          </span>
          <button
            onClick={() => setShowAlert(false)}
            className="p-1 rounded-full hover:bg-neutral-700 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 text-sm leading-relaxed bg-[#202020]">
          {message}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#202020] border-t border-neutral-800 flex justify-end">
          <button
            onClick={() => setShowAlert(false)}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-sm font-medium tracking-wide transition cursor-pointer"
          >
            Got it
          </button>
        </div>
      </motion.div>
    )
  );
}
