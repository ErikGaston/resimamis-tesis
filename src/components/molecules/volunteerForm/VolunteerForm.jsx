import React from 'react'
import LabelInput from '../labelInput/LabelInput';
import LabelDate from '../labelDate/LabelDate';
import LabelSelect from '../labelSelect/LabelSelect';
import { formattedDate } from '../../../utils/dateFormat';
import ButtonCustomized from '../../atoms/button/ButtonCustomized';

const VolunteerForm = ({ model, setModel, error, submitVolunteer, listTurnos }) => {

    const onChangeText = (e) => {
        const { name, value } = e.target;
        setModel({ ...model, [name]: value })
    }

    const onChangeNumber = (e) => {
        const { name, value } = e.target;
        let regexNumber = /^$|^[0-9]+$/;
        if (regexNumber.test(value)) {
            setModel({ ...model, [name]: value })
        }
        else {
            return;
        }
    }

    const onChangeDateTime = (newValue, option) => {
        if (newValue !== null) {
            setModel({ ...model, [option]: formattedDate(newValue) })
        }
    }

    const onChangeSelect = (event) => {
        const { name, value } = event.target;
        setModel({ ...model, [name]: value })
    };

    return (
        <div>
            <LabelInput
                name='nombre'
                label='Nombre'
                value={model?.nombre || ''}
                onChange={onChangeText}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
            />
            <LabelInput
                name='apellido'
                label='Apellido'
                value={model?.apellido || ''}
                onChange={onChangeText}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}

            />
            <LabelInput
                name='dni'
                label='DNI'
                value={model?.dni || ''}
                onChange={onChangeNumber}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}

            />
            <LabelInput
                name='celular'
                label='Celular'
                value={model?.celular || ''}
                onChange={onChangeNumber}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}

            />
            <LabelInput
                name='mail'
                label='E-mail'
                value={model?.mail || ''}
                onChange={onChangeText}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}

            />
            <LabelDate
                label={'Fecha de nacimiento'}
                inputFormat="DD/MM/YYYY"
                value={model?.fechaNacimiento}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                onChange={(newValue) => onChangeDateTime(newValue, 'fechaNacimiento')}
            />
            <LabelDate
                label={'Fecha de inicio'}
                inputFormat="DD/MM/YYYY"
                value={model?.fechaInicio}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                onChange={(newValue) => onChangeDateTime(newValue, 'fechaInicio')}
            />
            {/* <LabelDate
                label={'Fecha de fin'}
                inputFormat="DD/MM/YYYY"
                value={model?.fechaFin}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                onChange={(newValue) => onChangeDateTime(newValue, 'fechaFin')}
            /> */}
            <LabelSelect
                label="Turno"
                labelId="label-select"
                name='idEstado'
                list={listTurnos}
                value={model?.idEstado ?? ''}
                onChange={(e) => onChangeSelect(e)}
                placeholder={'Selecciona un turno'}
                InputLabelProps={{
                    style: { color: 'black', fontFamily: 'Montserrat' },
                }}
                displayEmpty={true}
                notched={true}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                required
            />

            <div style={{ textAlign: 'right' }}>
                <ButtonCustomized
                    variant={'container'}
                    // colorButton={'#18A974'}
                    colorText={'#FFF'}
                    sx={{
                        fontSize: '16px',
                        background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
                        boxShadow: '3px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                    }}
                    onClick={submitVolunteer}
                >
                    GUARDAR
                </ButtonCustomized>
            </div>
        </div>
    )
}

export default VolunteerForm