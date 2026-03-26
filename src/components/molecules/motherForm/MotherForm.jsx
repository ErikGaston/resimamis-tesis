import React from 'react'
import LabelInput from '../labelInput/LabelInput';
import LabelDate from '../labelDate/LabelDate';
import LabelAutocomplete from '../labelAutocomplete/LabelAutocomplete';
import { formattedDate } from '../../../utils/dateFormat';
import Loading from '../../atoms/loading/Loading';

const MotherForm = ({ model, setModel, error, listLocalities, editForm, typeForm }) => {

    const onChangeText = (e) => {
        const { name, value } = e.target;
        setModel({ ...model, [name]: value })
    }

    const onChangeNumber = (e) => {
        const { name, value } = e.target;
        let regexNumber = /^$|^[0-9]+$/;
        if (regexNumber.test(value)) {
            setModel({ ...model, [name]: value === '' ? '' : Number(value) });
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

    const searchLocality = () => {
        if (model?.localidad) {
            const idBuscado = model?.localidad; // Suponiendo que tienes el id a buscar
            const localidadEncontrada = listLocalities.find(loc => loc.idLocalidad === idBuscado);
            return localidadEncontrada.nombre;
        } else {
            return model?.nombre_localidad;
        }
    };

    return (
        <div>
            <LabelInput
                name='nombre'
                label='Nombre'
                value={model?.nombre}
                onChange={onChangeText}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={!editForm && typeForm === "EDITAR"}
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
                disabled={!editForm && typeForm === "EDITAR"}

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
                disabled={!editForm && typeForm === "EDITAR"}

            />
            <LabelDate
                label={'Fecha de nacimiento'}
                inputFormat="DD/MM/YYYY"
                value={model?.fechaNacimiento}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                onChange={(newValue) => onChangeDateTime(newValue, 'fechaNacimiento')}
                disabled={!editForm && typeForm === "EDITAR"}
            />
            {listLocalities !== null ?
                <LabelAutocomplete
                    id='nombre_localidad'
                    options={listLocalities}
                    value={searchLocality()}
                    onChange={onChangeAutocomplete}
                    placeholder={'Buscar localidad'}
                    noOptionsText={'No se encontraron localidades'}
                    required

                    label={'Localidad'}
                    labelColor={'#152C70'}
                    inputColor={'#152C70'}
                    disabled={!editForm && typeForm === "EDITAR"}
                />
                :
                <Loading />}
            <LabelInput
                name='celular'
                label='Celular'
                value={model?.celular}
                onChange={onChangeNumber}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={!editForm && typeForm === "EDITAR"}

            />
            {/* <LabelInput
                name='email'
                label='E-mail'
                value={model?.email}
                onChange={onChangeText}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}

            /> */}

            <LabelInput
                name='MotivoAbrazo'
                label='Motivo abrazo'
                value={model?.motivoAbrazo}
                onChange={onChangeText}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={!editForm && typeForm === "EDITAR"}
            />
        </div>
    )
}

export default MotherForm