import React from 'react'
import dayjs from 'dayjs'
import LabelInput from '../labelInput/LabelInput';
import LabelDate from '../labelDate/LabelDate';
import LabelAutocomplete from '../labelAutocomplete/LabelAutocomplete';
import { formattedDate } from '../../../utils/dateFormat';
import Loading from '../../atoms/loading/Loading';
import {
    MOTHER_NAME_MAX,
    MOTHER_MOTIVO_MAX,
    MOTHER_DNI_MAX_LEN,
    MOTHER_MIN_AGE,
    MOTHER_DATE_MIN_YEARS_BACK,
    MOTHER_PHONE_DIGITS_MAX,
    MOTHER_ESTADO_CIVIL_OPTIONS,
} from '../../../utils/motherFormValidation';

const MotherForm = ({
    model,
    setModel,
    listLocalities,
    editForm,
    typeForm,
    fieldErrors = {},
    setFieldErrors,
}) => {

    const m = model || {}

    const clearField = (name) => {
        if (setFieldErrors) {
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        }
    }

    const onChangeName = (e) => {
        const { name, value } = e.target;
        const v = value.slice(0, MOTHER_NAME_MAX);
        setModel({ ...m, [name]: v });
        clearField(name);
    }

    const onChangeDni = (e) => {
        const { name, value } = e.target;
        const digits = value.replace(/\D/g, '').slice(0, MOTHER_DNI_MAX_LEN);
        setModel({ ...m, [name]: digits === '' ? '' : Number(digits) });
        clearField(name);
    }

    const onChangeCelular = (e) => {
        const { value } = e.target;
        let v = value;
        if (v.startsWith('+')) {
            const rest = v.slice(1).replace(/\D/g, '');
            v = `+${rest.slice(0, MOTHER_PHONE_DIGITS_MAX)}`;
        } else {
            v = v.replace(/\D/g, '').slice(0, MOTHER_PHONE_DIGITS_MAX);
        }
        setModel({ ...m, celular: v });
        clearField('celular');
    }

    const onChangeCantidadHijos = (e) => {
        const raw = e.target.value;
        if (raw === '') {
            setModel({ ...m, cantidadHijos: '' });
            clearField('cantidadHijos');
            return;
        }
        if (!/^\d+$/.test(raw) || raw.length > 2) return;
        const n = Number(raw);
        if (n < 1 || n > 40) return;
        setModel({ ...m, cantidadHijos: n });
        clearField('cantidadHijos');
    }

    const onChangeMotivo = (e) => {
        const { value } = e.target;
        setModel({ ...m, motivoAbrazo: value.slice(0, MOTHER_MOTIVO_MAX) });
        clearField('motivoAbrazo');
    }

    const onChangeDateTime = (newValue, option) => {
        if (newValue !== null) {
            setModel({ ...m, [option]: formattedDate(newValue) })
        } else {
            setModel({ ...m, [option]: '' })
        }
        clearField(option);
    }

    const onChangeAutocomplete = (e, newValue) => {
        setModel({
            ...m,
            nombre_localidad: newValue?.label,
            localidad: newValue?.value,
        })
        clearField('localidad');
    };

    const onChangeEstadoCivil = (e, newValue) => {
        setModel({
            ...m,
            estadoCivil: newValue?.value ?? '',
        });
        clearField('estadoCivil');
    };

    const searchLocality = () => {
        if (m?.localidad) {
            const idBuscado = m?.localidad;
            const localidadEncontrada = listLocalities.find(loc => loc.idLocalidad === idBuscado);
            return localidadEncontrada?.nombre ?? m?.nombre_localidad;
        }
        return m?.nombre_localidad;
    };

    const searchEstadoCivil = () => {
        if (m?.estadoCivil === '' || m?.estadoCivil === undefined || m?.estadoCivil === null) {
            return '';
        }
        const opt = MOTHER_ESTADO_CIVIL_OPTIONS.find(
            (o) => o.value === Number(m.estadoCivil),
        );
        return opt?.label ?? '';
    };

    const minBirthDate = dayjs().subtract(MOTHER_DATE_MIN_YEARS_BACK, 'year').startOf('day')
    const maxBirthDate = dayjs().subtract(MOTHER_MIN_AGE, 'year').startOf('day')
    const dateValue = m?.fechaNacimiento && dayjs(m.fechaNacimiento).isValid()
        ? dayjs(m.fechaNacimiento)
        : null

    const celDisplay = m?.celular == null || m?.celular === ''
        ? ''
        : String(m.celular)

    return (
        <div>
            <LabelInput
                name='nombre'
                label='Nombre'
                value={m?.nombre ?? ''}
                onChange={onChangeName}
                error={!!fieldErrors.nombre}
                helperText={fieldErrors.nombre}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={!editForm && typeForm === "EDITAR"}
                inputProps={{ maxLength: MOTHER_NAME_MAX }}
            />
            <LabelInput
                name='apellido'
                label='Apellido'
                value={m?.apellido ?? ''}
                onChange={onChangeName}
                error={!!fieldErrors.apellido}
                helperText={fieldErrors.apellido}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={!editForm && typeForm === "EDITAR"}
                inputProps={{ maxLength: MOTHER_NAME_MAX }}
            />
            <LabelInput
                name='dni'
                label='DNI'
                value={m?.dni === '' || m?.dni === undefined || m?.dni === null ? '' : m.dni}
                onChange={onChangeDni}
                error={!!fieldErrors.dni}
                helperText={fieldErrors.dni}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={!editForm && typeForm === "EDITAR"}
                inputProps={{ maxLength: MOTHER_DNI_MAX_LEN }}
            />
            <LabelDate
                label={'Fecha de nacimiento'}
                inputFormat="DD/MM/YYYY"
                value={dateValue}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                onChange={(newValue) => onChangeDateTime(newValue, 'fechaNacimiento')}
                disabled={!editForm && typeForm === "EDITAR"}
                minDate={minBirthDate}
                maxDate={maxBirthDate}
                error={!!fieldErrors.fechaNacimiento}
                helperText={fieldErrors.fechaNacimiento}
            />
            <LabelInput
                name='cantidadHijos'
                label='Cantidad de hijos'
                value={m?.cantidadHijos === '' || m?.cantidadHijos === undefined || m?.cantidadHijos === null ? '' : m.cantidadHijos}
                onChange={onChangeCantidadHijos}
                error={!!fieldErrors.cantidadHijos}
                helperText={fieldErrors.cantidadHijos}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={!editForm && typeForm === "EDITAR"}
                inputProps={{ maxLength: 2, inputMode: 'numeric' }}
            />
            <LabelAutocomplete
                id='estado_civil'
                options={MOTHER_ESTADO_CIVIL_OPTIONS}
                value={searchEstadoCivil()}
                onChange={onChangeEstadoCivil}
                placeholder={'Seleccionar estado civil'}
                noOptionsText={'Sin opciones'}
                required
                label={'Estado civil'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                disabled={!editForm && typeForm === "EDITAR"}
                error={!!fieldErrors.estadoCivil}
                helperText={fieldErrors.estadoCivil}
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
                    error={!!fieldErrors.localidad}
                    helperText={fieldErrors.localidad}
                />
                :
                <Loading />}
            <LabelInput
                name='celular'
                label='Celular'
                value={celDisplay}
                onChange={onChangeCelular}
                error={!!fieldErrors.celular}
                helperText={fieldErrors.celular}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={!editForm && typeForm === "EDITAR"}
                inputProps={{ maxLength: 16 }}
            />
            <LabelInput
                name='motivoAbrazo'
                label='Motivo abrazo'
                value={m?.motivoAbrazo ?? ''}
                onChange={onChangeMotivo}
                error={!!fieldErrors.motivoAbrazo}
                helperText={fieldErrors.motivoAbrazo}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={!editForm && typeForm === "EDITAR"}
                inputProps={{ maxLength: MOTHER_MOTIVO_MAX }}
            />
        </div>
    )
}

export default MotherForm
