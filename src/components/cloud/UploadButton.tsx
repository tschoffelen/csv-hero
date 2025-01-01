import React, { useState } from "react";
import { Loader, UploadCloud } from "react-feather";
import ShareModal from "./ShareModal";

const UploadButton = ({ onUpload }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState("");

  const upload = async() => {
    setLoading(true);
    const value = await onUpload();
    setLoading(false);
    setOpen(`https://csvhero.includable.com/${value}`);
  };

  return (
    <>
      <ShareModal open={open} setOpen={setOpen} />
      <button
        className="px-3 py-2 text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 transition rounded-md"
        onClick={upload}>
        {loading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <UploadCloud className="w-4 h-4" />
        )}
      </button>
    </>
  );
};

export default UploadButton;
