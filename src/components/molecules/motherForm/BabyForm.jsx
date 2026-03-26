import React from 'react'
import LabelInput from '../labelInput/LabelInput';
import LabelDate from '../labelDate/LabelDate';
import LabelAutocomplete from '../labelAutocomplete/LabelAutocomplete';
import { formattedDate } from '../../../utils/dateFormat';
import Loading from '../../atoms/loading/Loading';

const listSexo = [
    {
        value: 'Masculino',
        label: 'Masculino',
    },
    {
        value: 'Femenino',
        label: 'Femenino',
    },
    {
        value: 'Otros',
        label: 'Otros',
    },
]
const BabyForm = ({ model, setModel, error, listLocalities, listMothers }) => {

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

    const onChangeAutocomplete = (e, newValue) => {
        setModel({ ...model, ['nombre_localidad']: newValue?.label, ['localidad']: newValue.value })
        // setOptionSelected({ ...optionSelected, ['cliente_id']: newValue?.value, 'cliente': newValue?.label })
    };

    const onChangeAutocompleteSexo = (e, newValue) => {
        setModel({ ...model, ['sexo']: newValue.value })
        // setOptionSelected({ ...optionSelected, ['cliente_id']: newValue?.value, 'cliente': newValue?.label })
    };

    const onChangeAutocompleteMother = (e, newValue) => {
        setModel({ ...model, ['nombre_madre']: newValue?.label, ['idMadre']: newValue.value })
        // setOptionSelected({ ...optionSelected, ['cliente_id']: newValue?.value, 'cliente': newValue?.label })
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
                value={model?.apellido}
                onChange={onChangeText}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
            />
            <LabelInput
                name='dni'
                label='DNI'
                value={model?.dni}
                onChange={onChangeNumber}
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
            <LabelInput
                name='lugarNacimiento'
                label='Lugar de nacimiento'
                value={model?.lugarNacimiento}
                onChange={onChangeText}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
            />
            <LabelAutocomplete
                id='sexo'
                label={'Sexo'}
                options={listSexo}
                value={model?.sexo}
                onChange={onChangeAutocompleteSexo}
                required
                labelColor={'#152C70'}
                inputColor={'#152C70'}
            />
            {listMothers !== null ?
                <LabelAutocomplete
                    id='nombre_madre'
                    label={'Madre'}
                    options={listMothers}
                    value={model?.nombre_madre}
                    onChange={onChangeAutocompleteMother}
                    placeholder={'Buscar madre'}
                    noOptionsText={'No se encontraron madres'}
                    required

                    labelColor={'#152C70'}
                    inputColor={'#152C70'}
                />
                :
                <Loading />}
            <LabelDate
                label={'Fecha ingreso a NEO'}
                inputFormat="DD/MM/YYYY"
                value={model?.fechaIngresoNEO}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                onChange={(newValue) => onChangeDateTime(newValue, 'fechaIngresoNEO')}
            />
            {listLocalities !== null ?
                <LabelAutocomplete
                    id='nombre_localidad'
                    options={listLocalities}
                    value={model?.nombre_localidad}
                    onChange={onChangeAutocomplete}
                    placeholder={'Buscar localidad'}
                    noOptionsText={'No se encontraron localidades'}
                    required

                    label={'Localidad'}
                    labelColor={'#152C70'}
                    inputColor={'#152C70'}
                />
                :
                <Loading />}
            <LabelInput
                name='pesoNacimiento'
                label='Peso de nacimiento'
                value={model?.pesoNacimiento}
                onChange={onChangeNumber}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
            />
            <LabelInput
                name='pesoIngresoNEO'
                label='Peso ingreso a NEO'
                value={model?.pesoIngresoNEO}
                onChange={onChangeNumber}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
            />
            <LabelInput
                name='pesoAlta'
                label='Peso ingreso al programa'
                value={model?.pesoAlta}
                onChange={onChangeNumber}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
            />
            <LabelInput
                name='pesoDiaAbrazos'
                label='Peso dia de abrazo'
                value={model?.pesoDiaAbrazos}
                onChange={onChangeNumber}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
            />
            <LabelInput
                name='diagnosticoIngreso'
                label='Diagnostico al ingreso'
                value={model?.diagnosticoIngreso || ''}
                onChange={onChangeText}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                multiline={true}
                rows={3}
            />
            <LabelInput
                name='diagnosticoEgreso'
                label='Diagnostico al ingreso'
                value={model?.diagnosticoEgreso || ''}
                onChange={onChangeText}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                multiline={true}
                rows={3}
            />
            <LabelInput
                name='salaInternacion'
                label='Sala de internacion'
                value={model?.salaInternacion}
                onChange={onChangeNumber}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
            />
        </div>
    )
}

export default BabyForm