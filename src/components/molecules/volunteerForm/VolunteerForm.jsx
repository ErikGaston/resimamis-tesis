import React from 'react'
import dayjs from 'dayjs'
import LabelInput from '../labelInput/LabelInput';
import LabelDate from '../labelDate/LabelDate';
import LabelSelect from '../labelSelect/LabelSelect';
import { formattedDate } from '../../../utils/dateFormat';
import ButtonCustomized from '../../atoms/button/ButtonCustomized';
import {
    VOLUNTEER_NAME_MAX,
    VOLUNTEER_DNI_LEN,
    VOLUNTEER_PHONE_DIGITS_MAX,
    VOLUNTEER_EMAIL_MAX,
    VOLUNTEER_MIN_AGE,
    VOLUNTEER_DATE_MIN_YEARS_BACK,
} from '../../../utils/volunteerFormValidation';

const VolunteerForm = ({
    model,
    setModel,
    error,
    submitVolunteer,
    listTurnos,
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
        const v = value.slice(0, VOLUNTEER_NAME_MAX);
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
        const v = e.target.value.replace(/\s/g, '').slice(0, VOLUNTEER_EMAIL_MAX);
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

    const onChangeSelect = (event) => {
        const { name, value } = event.target;
        setModel({ ...m, [name]: value })
        clearField(name);
    };

    const fechaInicioMin = dayjs().subtract(1, 'month').startOf('day')
    const fechaInicioMax = dayjs().add(1, 'month').endOf('day')
    const birthMin = dayjs().subtract(VOLUNTEER_DATE_MIN_YEARS_BACK, 'year').startOf('day')
    const birthMax = dayjs().subtract(VOLUNTEER_MIN_AGE, 'year').endOf('day')

    const dateNacValue = m?.fechaNacimiento && dayjs(m.fechaNacimiento).isValid()
        ? dayjs(m.fechaNacimiento)
        : null
    const dateInicioValue = m?.fechaInicio && dayjs(m.fechaInicio).isValid()
        ? dayjs(m.fechaInicio)
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
                inputProps={{ maxLength: VOLUNTEER_DNI_LEN, inputMode: 'numeric' }}
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
                inputProps={{ maxLength: 16 }}
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
                inputProps={{ maxLength: VOLUNTEER_EMAIL_MAX }}
            />
            <LabelDate
                label={'Fecha de nacimiento'}
                inputFormat="DD/MM/YYYY"
                value={dateNacValue}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                onChange={(newValue) => onChangeDateTime(newValue, 'fechaNacimiento')}
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
                onChange={(newValue) => onChangeDateTime(newValue, 'fechaInicio')}
                minDate={fechaInicioMin}
                maxDate={fechaInicioMax}
                error={!!fieldErrors.fechaInicio}
                helperText={fieldErrors.fechaInicio}
            />
            <LabelSelect
                label="Turno"
                labelId="label-select-turno"
                name='idEstado'
                list={listTurnos}
                value={m?.idEstado ?? ''}
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
                error={!!fieldErrors.idEstado}
                helperText={fieldErrors.idEstado}
            />

            <div style={{ textAlign: 'right' }}>
                <ButtonCustomized
                    variant={'container'}
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
