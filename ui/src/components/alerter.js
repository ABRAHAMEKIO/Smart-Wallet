import React from 'react';
import { Alert, Button } from '@nextui-org/react';
import { IoMdClose } from "react-icons/io";

function Alerter({ showAlerter, closeAlerter, props }) {
    return (
        <>
            {showAlerter &&
                <>
                    <div style={{ marginTop: '.5rem' }} />

                    <div className="flex items-center justify-center w-full mt-3">
                        <Alert
                            color={props.severity}
                            description={props.msg}
                            endContent={
                                <Button color={props.severity} size="sm" variant="flat" onPress={closeAlerter}>
                                    <IoMdClose />
                                </Button>
                            }
                            title={props.reason}
                            variant="faded"
                        />
                    </div>
                </>
            }
        </>
    );
}

export default Alerter;