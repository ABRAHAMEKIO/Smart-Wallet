import React from "react";
import { Modal, ModalContent } from "@heroui/react";

export default function BaseModal({ children, baseModalsOpen, baseModalOnClose }) {

    return (
        <Modal backdrop="blur" isOpen={baseModalsOpen} onClose={baseModalOnClose}>
            <ModalContent>
                {() => (
                    <>
                        {children}
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}