import { Alert, Button } from '@nextui-org/react';
import React from 'react';
import { GrDeploy } from 'react-icons/gr';

function Advisor({ title, msg, action }) {
    return (
        <>
            <div style={{ marginTop: '.5rem' }} />
            <div className="flex items-center justify-center w-full">
                <Alert
                    hideIconWrapper
                    color="secondary"
                    description={msg}
                    title={title}
                    endContent={
                        <Button color={'secondary'} size="sm" variant="flat" onPress={action}>
                            <GrDeploy />
                        </Button>
                    }
                    variant="bordered"
                />
            </div>
        </>
    );
}

export default Advisor;