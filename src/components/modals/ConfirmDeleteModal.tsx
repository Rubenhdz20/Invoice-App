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
            <div>
                <h2 className="text-white">Confirm Deletion</h2>
                <p></p>
                <div>
                    <button></button>
                    <button></button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDeleteModal