import React from "react";

interface ConfirmDeleteModalProps {
    invoiceId: string;
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    invoiceId,
    isOpen,
    onCancel,
    onConfirm,
  }) => {

    if (!isOpen) return null;
    
    return(
        <div className="fixed flex items-center justify-center inset-0 bg-black/50 z-50">
            <div className="w-11/12 max-w-md h-56 flex flex-col p-6 bg-[#1E2139] rounded-lg">
                <h2 className="text-white text-2xl font-bold">Confirm Deletion</h2>
                <p className="mt-2 mb-6 text-[#888EB0]">Are you sure you want to delete invoice ${invoiceId}? This action cannot be undone.</p>
                <div className="flex justify-end mt-6 space-x-4">
                    <button onClick={onCancel} className="px-6 py-2 rounded-3xl bg-[#252945] hover:bg-[#3B3F5A] text-white cursor-pointer">Cancel</button>
                    <button onClick={onConfirm} className="px-6 py-2 bg-[#EC5757] hover:bg-[#FF9797] text-white rounded-3xl cursor-pointer">Delete</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDeleteModal