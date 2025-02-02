import { Alert, Button } from '@heroui/react'
import React from 'react'
import { IoMdClose } from 'react-icons/io'
import { isAuthed } from '../../user-session'

function SmartWalletContractAdvisory({ show, props, icon, action }) {
    return (
        <>
            {(show && isAuthed) &&
                <div className="flex items-center justify-center w-full mt-3">
                    <Alert
                        color={props.severity}
                        description={props.msg}
                        endContent={
                            <Button color={props.severity} size="sm" variant="flat" onPress={action}>
                                {icon}
                            </Button>
                        }
                        title={props.reason}
                        variant="faded"
                    />
                </div>
            }
        </>
    )
}

export default SmartWalletContractAdvisory
