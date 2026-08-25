import React from 'react'
import dayjs from 'dayjs'
import { Autocomplete, Chip, TextField } from '@mui/material';
import LabelInput from '../labelInput/LabelInput';
import LabelDate from '../labelDate/LabelDate';
import LabelAutocomplete from '../labelAutocomplete/LabelAutocomplete';
import { formattedDate } from '../../../utils/dateFormat';
import { collectIdMadresForBaby } from '../../../utils/babyPayload';

const listSexo = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'O', label: 'Otros' },
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
    fieldErrors = {},
    /** En el alta el bebé pertenece a la madre que se está creando: no se elige de un listado. */
    madreFija = false,
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

    const onChangeWeight = (e) => {
        const { name, value } = e.target;
        if (/^$|^\d+([.]\d{0,3})?$/.test(value)) {
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

    const motherIds = collectIdMadresForBaby(model, null);
    const mothersAutocompleteValue = (listMothers ?? []).filter((o) =>
        motherIds.includes(Number(o.value)),
    );

    const onChangeMothersMulti = (e, newValue) => {
        const idMadres = newValue.map((o) => Number(o.value)).filter((n) => Number.isFinite(n) && n > 0);
        const unique = [...new Set(idMadres)];
        safeSetModel({
            ...model,
            idMadres: unique,
            idMadre: unique[0] ?? null,
            nombre_madre: newValue.map((o) => o.label).filter(Boolean).join(', '),
        });
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
        return model?.nombre_localidad ?? '';
    };

    const sexoOption =
        listSexo.find(
            (o) => o.value === model?.sexo || o.label === model?.sexo,
        ) ?? null

    return (
        <div>
            <LabelInput
                name='nombre'
                error={!!fieldErrors.nombre}
                helperText={fieldErrors.nombre}
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
                error={!!fieldErrors.apellido}
                helperText={fieldErrors.apellido}
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
                error={!!fieldErrors.dni}
                helperText={fieldErrors.dni}
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
                styleLabel={{ fontSize: '16px' }}
                onChange={(newValue) => onChangeDateTime(newValue, 'fechaNacimiento')}
                error={!!fieldErrors.fechaNacimiento}
                helperText={fieldErrors.fechaNacimiento}
                disabled={readOnly}
            />
            <LabelInput
                name='lugarNacimiento'
                error={!!fieldErrors.lugarNacimiento}
                helperText={fieldErrors.lugarNacimiento}
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
                error={!!fieldErrors.sexo}
                helperText={fieldErrors.sexo}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={readOnly}
            />
            {readOnly || madreFija ? (
                <LabelInput
                    label='Madre'
                    name='madre_display'
                    value={madreFija ? (madreDisplayName || 'La madre que estás cargando') : (model?.nombre_madre || madreDisplayName || '—')}
                    onChange={noop}
                    labelColor={'#152C70'}
                    inputColor={'#152C70'}
                    styleLabel={{ fontSize: '16px' }}
                    disabled
                />
            ) : listMothers != null ? (
                <div style={{ margin: '10px 0' }}>
                    <Autocomplete
                        multiple
                        disableCloseOnSelect
                        id="madres_bebe"
                        options={listMothers}
                        getOptionLabel={(o) => o?.label ?? ''}
                        isOptionEqualToValue={(a, b) => Number(a?.value) === Number(b?.value)}
                        value={mothersAutocompleteValue}
                        onChange={onChangeMothersMulti}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    {...getTagProps({ index })}
                                    key={option.value}
                                    label={option.label}
                                    size="small"
                                    sx={{ maxWidth: '100%' }}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Madre"
                                placeholder="Buscar y agregar madres"
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        color: '#152C70',
                                    },
                                    '& .MuiInputLabel-root': { color: '#152C70' },
                                }}
                            />
                        )}
                        noOptionsText="No se encontraron madres"
                    />
                </div>
            ) : null}
            <LabelDate
                label={'Fecha ingreso a NEO'}
                inputFormat="DD/MM/YYYY"
                value={neoValue}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                onChange={(newValue) => onChangeDateTime(newValue, 'fechaIngresoNEO')}
                error={!!fieldErrors.fechaIngresoNEO}
                helperText={fieldErrors.fechaIngresoNEO}
                disabled={readOnly}
            />
            {listLocalities != null ? (
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
                    styleLabel={{ fontSize: '16px' }}
                    disabled={readOnly}
                />
            ) : (
                <LabelInput
                    name='nombre_localidad'
                    label='Localidad'
                    value={model?.nombre_localidad ?? ''}
                    onChange={readOnly ? noop : onChangeText}
                    labelColor={'#152C70'}
                    inputColor={'#152C70'}
                    styleLabel={{ fontSize: '16px' }}
                    disabled={readOnly}
                />
            )}
            <LabelInput
                name='pesoNacimiento'
                label='Peso de nacimiento'
                value={model?.pesoNacimiento ?? ''}
                onChange={onChangeWeight}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={readOnly}
            />
            <LabelInput
                name='pesoIngresoNEO'
                label='Peso ingreso a NEO'
                value={model?.pesoIngresoNEO ?? ''}
                onChange={onChangeWeight}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={readOnly}
            />
            <LabelInput
                name='pesoAlta'
                label='Peso ingreso al programa'
                value={model?.pesoAlta ?? ''}
                onChange={onChangeWeight}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={readOnly}
            />
            <LabelInput
                name='pesoDiaAbrazos'
                label='Peso día de abrazo'
                value={model?.pesoDiaAbrazos ?? ''}
                onChange={onChangeWeight}
                className={error && 'errorInput'}
                labelColor={'#152C70'}
                inputColor={'#152C70'}
                styleLabel={{ fontSize: '16px' }}
                disabled={readOnly}
            />
            <LabelInput
                name='diagnosticoIngreso'
                label='Diagnóstico al ingreso'
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
                    styleLabel={{ fontSize: '16px' }}
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
