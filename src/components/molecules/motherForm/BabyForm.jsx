import React from 'react'
import dayjs from 'dayjs'
import LabelInput from '../labelInput/LabelInput';
import LabelDate from '../labelDate/LabelDate';
import LabelAutocomplete from '../labelAutocomplete/LabelAutocomplete';
import { formattedDate } from '../../../utils/dateFormat';
import Loading from '../../atoms/loading/Loading';

const listSexo = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Femenino', label: 'Femenino' },
    { value: 'Otros', label: 'Otros' },
]

const noop = () => { }

const BabyForm = ({
    model,
    setModel,
    error,
    listLocalities,
    listMothers,
    readOnly = false,
    madreDisplayName = '',
    /** Opcional: salas desde GET `/bebe/listarSalas` como `{ label, value }` (value = idSala). */
    salaOptions = null,
}) => {
    const safeSetModel = readOnly ? noop : setModel

    const onChangeText = (e) => {
        const { name, value } = e.target;
        safeSetModel({ ...model, [name]: value })
    }

    const onChangeNumber = (e) => {
        const { name, value } = e.target;
        const regexNumber = /^$|^[0-9]+$/;
        if (regexNumber.test(value)) {
            safeSetModel({ ...model, [name]: value })
        }
    }

    const onChangeDateTime = (newValue, option) => {
        if (newValue !== null) {
            safeSetModel({ ...model, [option]: formattedDate(newValue) })
        }
    }

    const onChangeAutocomplete = (e, newValue) => {
        safeSetModel({
            ...model,
            nombre_localidad: newValue?.label,
            localidad: newValue?.value,
        })
    };

    const onChangeAutocompleteSexo = (e, newValue) => {
        safeSetModel({ ...model, sexo: newValue.value })
    };

    const onChangeAutocompleteMother = (e, newValue) => {
        safeSetModel({
            ...model,
            nombre_madre: newValue?.label,
            idMadre: newValue?.value,
        })
    };

    const birthValue =
        model?.fechaNacimiento && dayjs(model.fechaNacimiento).isValid()
            ? dayjs(model.fechaNacimiento)
            : null
    const neoValue =
        model?.fechaIngresoNEO && dayjs(model.fechaIngresoNEO).isValid()
            ? dayjs(model.fechaIngresoNEO)
            : null

    const localidadLabel = () => {
        if (model?.nombre_localidad) return model.nombre_localidad;
        if (model?.nombreSala) return model.nombreSala;
        return '';
    };

    const sexoOption =
        listSexo.find(
            (o) => o.value === model?.sexo || o.label === model?.sexo,
        ) ?? null

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
                disabled={readOnly}
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
                disabled={readOnly}
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
                disabled={readOnly}
            />
            <LabelDate
                label={'Fecha de nacimiento'}
                inputFormat="DD/MM/YYYY"
                value={birthValue}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                onChange={(newValue) => onChangeDateTime(newValue, 'fechaNacimiento')}
                disabled={readOnly}
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
                disabled={readOnly}
            />
            <LabelAutocomplete
                id='sexo'
                label={'Sexo'}
                options={listSexo}
                value={sexoOption}
                onChange={onChangeAutocompleteSexo}
                required
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                disabled={readOnly}
            />
            {readOnly ? (
                <LabelInput
                    label='Madre'
                    name='madre_display'
                    value={model?.nombre_madre || madreDisplayName || '—'}
                    onChange={noop}
                    labelColor={'#152C70'}
                    inputColor={'#152C70'}
                    styleLabel={{ fontSize: '16px' }}
                    disabled
                />
            ) : listMothers !== null ? (
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
            ) : (
                <Loading />
            )}
            <LabelDate
                label={'Fecha ingreso a NEO'}
                inputFormat="DD/MM/YYYY"
                value={neoValue}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                onChange={(newValue) => onChangeDateTime(newValue, 'fechaIngresoNEO')}
                disabled={readOnly}
            />
            {listLocalities !== null ? (
                <LabelAutocomplete
                    id='nombre_localidad'
                    options={listLocalities}
                    value={readOnly ? localidadLabel() : model?.nombre_localidad}
                    onChange={onChangeAutocomplete}
                    placeholder={'Buscar localidad'}
                    noOptionsText={'No se encontraron localidades'}
                    required
                    label={'Localidad'}
                    labelColor={'#152C70'}
                    inputColor={'#152C70'}
                    disabled={readOnly}
                />
            ) : (
                <Loading />
            )}
            <LabelInput
                name='pesoNacimiento'
                label='Peso de nacimiento'
                value={model?.pesoNacimiento}
                onChange={onChangeNumber}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={readOnly}
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
                disabled={readOnly}
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
                disabled={readOnly}
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
                disabled={readOnly}
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
                disabled={readOnly}
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
                disabled={readOnly}
            />
            {salaOptions != null && salaOptions.length > 0 ? (
                <LabelAutocomplete
                    id="idSala_bebe"
                    label="Sala"
                    options={salaOptions}
                    value={
                        salaOptions.find(
                            (o) => o.value === model?.idSala || String(o.value) === String(model?.idSala),
                        ) ?? null
                    }
                    onChange={(e, newValue) => {
                        safeSetModel({
                            ...model,
                            idSala: newValue?.value ?? null,
                            nombreSala: newValue?.label ?? '',
                        });
                    }}
                    placeholder="Buscar sala"
                    noOptionsText="No hay salas"
                    labelColor={'#152C70'}
                    inputColor={'#152C70'}
                    disabled={readOnly}
                />
            ) : (
                <LabelInput
                    name="salaInternacion"
                    label="Sala de internación"
                    value={model?.nombreSala ?? model?.salaInternacion ?? ''}
                    onChange={onChangeText}
                    className={error && 'errorInput'}
                    labelColor={'#152C70'}
                    inputColor={'#152C70'}
                    styleLabel={{ fontSize: '16px' }}
                    disabled={readOnly}
                />
            )}
        </div>
    )
}

export default BabyForm
