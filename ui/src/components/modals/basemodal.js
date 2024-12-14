import React from "react";
import { Modal, ModalContent } from "@nextui-org/react";

export default function BaseModal({ children, baseModalsOpen, baseModalOnClose }) {

    return (
        <Modal backdrop="blur" isOpen={baseModalsOpen} onClose={baseModalOnClose}>
            <ModalContent>
                {(baseModalOnClose) => (
                    <>
                        {children}
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

