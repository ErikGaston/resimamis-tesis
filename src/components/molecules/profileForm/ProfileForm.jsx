import React from 'react'
import dayjs from 'dayjs'
import LabelInput from '../labelInput/LabelInput'
import LabelDate from '../labelDate/LabelDate';
import { formattedDate } from '../../../utils/dateFormat';
import {
    VOLUNTEER_NAME_MAX,
    VOLUNTEER_DNI_LEN,
    VOLUNTEER_PHONE_DIGITS_MAX,
    VOLUNTEER_EMAIL_MAX,
    VOLUNTEER_MIN_AGE,
    VOLUNTEER_DATE_MIN_YEARS_BACK,
} from '../../../utils/volunteerFormValidation';

const ProfileForm = ({
    model = {},
    setModel = () => { },
    error = false,
    edit = false,
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
        const v = value.replace(/[^\p{L}\s]/gu, '').slice(0, VOLUNTEER_NAME_MAX);
        setModel({ ...m, [name]: v });
        clearField(name);
    }

    const onChangeDni = (e) => {
        const { name, value } = e.target;
        const digits = value.replace(/\D/g, '').slice(0, VOLUNTEER_DNI_LEN);
        setModel({ ...m, [name]: digits === '' ? '' : digits });
        clearField(name);
    }

    const onChangeCelular = (e) => {
        const { value } = e.target;
        let v = value;
        if (v.startsWith('+')) {
            const rest = v.slice(1).replace(/\D/g, '');
            v = `+${rest.slice(0, VOLUNTEER_PHONE_DIGITS_MAX)}`;
        } else {
            v = v.replace(/\D/g, '').slice(0, VOLUNTEER_PHONE_DIGITS_MAX);
        }
        setModel({ ...m, celular: v });
        clearField('celular');
    }

    const onChangeMail = (e) => {
        const raw = e.target.value.replace(/\s/g, '');
        const v = raw.replace(/[^\p{L}0-9.@]/gu, '').slice(0, VOLUNTEER_EMAIL_MAX);
        setModel({ ...m, mail: v });
        clearField('mail');
    }

    const onChangeDateTime = (newValue, option) => {
        if (newValue !== null) {
            setModel({ ...m, [option]: formattedDate(newValue) })
        } else {
            setModel({ ...m, [option]: '' })
        }
        clearField(option);
    }

    const assignmentMin = dayjs().subtract(1, 'month').startOf('day')
    const assignmentMax = dayjs().add(1, 'month').endOf('day')
    const profileAssignmentPickerMin = (d) => {
        if (!d || !d.isValid()) return assignmentMin
        return d.isBefore(assignmentMin, 'day') ? d.startOf('day') : assignmentMin
    }
    const profileAssignmentPickerMax = (d) => {
        if (!d || !d.isValid()) return assignmentMax
        return d.isAfter(assignmentMax, 'day') ? d.endOf('day') : assignmentMax
    }
    const birthMin = dayjs().subtract(VOLUNTEER_DATE_MIN_YEARS_BACK, 'year').startOf('day')
    const birthMax = dayjs().subtract(VOLUNTEER_MIN_AGE, 'year').endOf('day')

    const dateNacValue = m?.fechaNacimiento && dayjs(m.fechaNacimiento).isValid()
        ? dayjs(m.fechaNacimiento)
        : null
    const dateInicioValue = m?.fechaInicio && dayjs(m.fechaInicio).isValid()
        ? dayjs(m.fechaInicio)
        : null
    const dateFinValue = m?.fechaFin && dayjs(m.fechaFin).isValid()
        ? dayjs(m.fechaFin)
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
                    className={error && 'errorInput'}
                    error={!!fieldErrors.nombre}
                    helperText={fieldErrors.nombre}
                    labelColor={'#152C70'}
                    inputColor={'#152C70'}
                    styleLabel={{ fontSize: '16px' }}
                    disabled={!edit}
                    inputProps={{ maxLength: VOLUNTEER_NAME_MAX }}
                />
                <LabelInput
                    name='apellido'
                    label='Apellido'
                    value={m?.apellido ?? ''}
                    onChange={onChangeName}
                    className={error && 'errorInput'}
                    error={!!fieldErrors.apellido}
                    helperText={fieldErrors.apellido}
                    labelColor={'#152C70'}
                    inputColor={'#152C70'}
                    styleLabel={{ fontSize: '16px' }}
                    disabled={!edit}
                    inputProps={{ maxLength: VOLUNTEER_NAME_MAX }}
                />
            <LabelInput
                name='dni'
                label='DNI'
                value={m?.dni === '' || m?.dni === undefined || m?.dni === null ? '' : m.dni}
                onChange={onChangeDni}
                className={error && 'errorInput'}
                error={!!fieldErrors.dni}
                helperText={fieldErrors.dni}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={!edit}
                inputProps={{ maxLength: VOLUNTEER_DNI_LEN, inputMode: 'numeric' }}
            />
            <LabelInput
                name='mail'
                label='E-mail'
                value={m?.mail ?? ''}
                onChange={onChangeMail}
                className={error && 'errorInput'}
                error={!!fieldErrors.mail}
                helperText={fieldErrors.mail}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={!edit}
                inputProps={{ maxLength: VOLUNTEER_EMAIL_MAX }}
            />
            <LabelInput
                name='celular'
                label='Celular'
                value={celDisplay}
                onChange={onChangeCelular}
                className={error && 'errorInput'}
                error={!!fieldErrors.celular}
                helperText={fieldErrors.celular}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={!edit}
                inputProps={{ maxLength: 16 }}
            />
            <LabelDate
                label={'Fecha de nacimiento'}
                inputFormat="DD/MM/YYYY"
                value={dateNacValue}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                onChange={(newValue) => onChangeDateTime(newValue, 'fechaNacimiento')}
                disabled={!edit}
                minDate={birthMin}
                maxDate={birthMax}
                error={!!fieldErrors.fechaNacimiento}
                helperText={fieldErrors.fechaNacimiento}
            />
            <LabelDate
                label={'Fecha de inicio'}
                inputFormat="DD/MM/YYYY"
                value={dateInicioValue}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                onChange={(newValue) => onChangeDateTime(newValue, 'fechaInicio')}
                disabled={!edit}
                minDate={profileAssignmentPickerMin(dateInicioValue)}
                maxDate={profileAssignmentPickerMax(dateInicioValue)}
                error={!!fieldErrors.fechaInicio}
                helperText={fieldErrors.fechaInicio}
            />
            <LabelDate
                label={'Fecha de baja'}
                inputFormat="DD/MM/YYYY"
                value={dateFinValue}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                onChange={(newValue) => onChangeDateTime(newValue, 'fechaFin')}
                disabled={!edit}
                minDate={profileAssignmentPickerMin(dateFinValue)}
                maxDate={profileAssignmentPickerMax(dateFinValue)}
                error={!!fieldErrors.fechaFin}
                helperText={fieldErrors.fechaFin}
            />
        </div>
    )
}

export default ProfileForm
