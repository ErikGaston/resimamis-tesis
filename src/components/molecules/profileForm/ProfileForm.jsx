import React from 'react'
import LabelInput from '../labelInput/LabelInput'
import LabelSelect from '../labelSelect/LabelSelect';
import LabelDate from '../labelDate/LabelDate';
import { formattedDate } from '../../../utils/dateFormat';

const ProfileForm = ({
    model = {},
    setModel = () => { },
    error = false,
    volunteersStates = [],
    edit = false
}) => {
    console.log(model, 'model')
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

    const onChangeText = (e) => {
        const { name, value } = e.target;
        setModel({ ...model, [name]: value })
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

    console.log(model, 'model form')

    return (
        <div>
            <>
                <LabelInput
                    name='nombre'
                    label='Nombre'
                    value={model?.nombre || ''}
                    onChange={onChangeText}
                    className={error && 'errorInput'}
                    labelColor={'#152C70'}
                    inputColor={'#152C70'}
                    styleLabel={{ fontSize: '16px' }}
                    // variant={'standard'}
                    disabled={!edit}
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
                    // variant={'standard'}
                    disabled={!edit}
                />
            </>
            <LabelInput
                name='mail'
                label='E-mail'
                value={model?.mail || ''}
                onChange={onChangeText}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                // variant={'standard'}
                disabled={!edit}
            />
            {/* <LabelInput
                name='rol'
                label='Rol'
                value={model?.rol || ''}
                onChange={onChangeText}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                // variant={'standard'}
                disabled={!edit}
            /> */}
            <LabelInput
                name='celular'
                label='Celular'
                value={model?.celular || ''}
                onChange={onChangeNumber}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                // variant={'standard'}
                disabled={!edit}
            />
            <LabelSelect
                label="Estado"
                labelId="label-select"
                name='idEstado'
                list={volunteersStates}
                value={model?.idEstado ?? ''}
                onChange={(e) => onChangeSelect(e)}
                placeholder={'Selecciona un estado'}
                InputLabelProps={{
                    style: { color: 'black', fontFamily: 'Montserrat' },
                }}
                displayEmpty={true}
                notched={true}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                required
                disabled={!edit}
            //variant={'standard'}
            />
            <LabelDate
                label={'Fecha de inicio'}
                inputFormat="DD/MM/YYYY"
                value={model?.fechaInicio}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                onChange={(newValue) => onChangeDateTime(newValue, 'fechaInicio')}
                disabled={!edit}
            //variant={'standard'}
            />
            <LabelDate
                label={'Fecha de baja'}
                inputFormat="DD/MM/YYYY"
                value={model?.fechaFin}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                onChange={(newValue) => onChangeDateTime(newValue, 'fechaFin')}
                disabled={!edit}
            //variant={'standard'}
            />
        </div>
    )
}

export default ProfileForm