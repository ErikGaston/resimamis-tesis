import React from 'react'
import CheckIcon from '@mui/icons-material/Check';
import styled from '@emotion/styled';
import DialogCustomized from '../dialog/DialogCustomized';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const DialogSuccess = ({ message, open, setOpen, error }) => {
    return (
        <DialogCustomized
            open={open}
            setOpen={setOpen}
            content={
                <ContainerSpinner>
                    {error ?
                        <PriorityHighIcon style={{ fontSize: '100px', color: '#ffa600', marginBottom: '20px' }} />
                        :
                        <CheckIcon style={{ fontSize: '100px', color: '#8F00FF', marginBottom: '20px' }} />
                    }
                    <Title style={{ fontSize: '24px' }}>{message}</Title>
                </ContainerSpinner>

            }
        />
    )
}

export default DialogSuccess;

const Title = styled('h1')`
    font-size:30px;
    font-family:Roboto;
    color:#152C70;
    text-align:center;
    margin-bottom:30px;
`;


const ContainerSpinner = styled.div`
    display: flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(15px);
    height: 250px;
`;