import React from 'react'
import LabelInput from '../labelInput/LabelInput';
import ButtonCustomized from '../../atoms/button/ButtonCustomized';
import styled from '@emotion/styled';
import { imageToBase64 } from '../../../utils/functionCommon'

const ConsentForm = ({ model, setModel, error, setError }) => {

    const onChangeText = (e) => {
        const { name, value } = e.target;
        setModel({ ...model, [name]: value })
    }

    const uploadFile = async (event) => {
        let name = event.target.files[0].name;
        if (name.length > 100) {
            setError('No se permiten imágenes con más de 100 caracteres en el nombre.')
            return;
        }
        setError(null)
        const base64 = await imageToBase64(event.target.files[0]);
        setModel({ ...model, 'file': base64, 'file_name': name })
    }

    return (
        <div>
            <LabelInput
                name='motivo'
                label='Motivo'
                value={model?.motivo || ''}
                onChange={onChangeText}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                multiline={true}
                rows={3}
            />
            {!model?.file_name ?
                <StyledButton
                    variant={'container'}
                    component="label"
                >
                    <Title>
                        Seleccione el archivo
                        <input
                            type="file"
                            hidden
                            onChange={uploadFile}
                            multiple
                            accept='image/*'
                        />
                    </Title>
                </StyledButton>
                :
                <Title>
                    {model?.file_name}
                </Title>
            }
            {
                error &&
                <FormHelperText id="component-helper-text" className='error' sx={{ p: 1, fontSize: '16px', fontWeight: 600 }}>{error}</FormHelperText>
            }
        </div>
    )
}

export default ConsentForm;

const StyledButton = styled(ButtonCustomized)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    border: 1px solid #CECECE;
    margin:10px 0;
    padding: 16.5px 14px;
`;

const Title = styled('div')`
    color: #152C70;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    text-transform:none;
    height: 1.4375em;
`