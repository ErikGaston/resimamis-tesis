import React from 'react'
import AccordionCustomized from '../../atoms/accordionCustomized/AccordionCustomized'
import styled from '@emotion/styled'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import MotherForm from '../../molecules/motherForm/MotherForm';
import ButtonCustomized from '../../atoms/button/ButtonCustomized';
// import ConsentForm from '../../molecules/motherForm/ConsentForm';
import BabyForm from '../../molecules/motherForm/BabyForm';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

const MotherAccordionForm = (props) => {
    const { listAccordion, model, setModel, listLocalities, submitMother, submitConset, error, setError, listMothers, submitBaby, listAccordionBaby, expandedMother, editForm, typeForm } = props;
    const navigate = useNavigate();

    const redirectBaby = (index) => {
        navigate('/baby/perfil/' + index);
    };

    return (
        <div style={{ paddingBottom: '60px' }}>
            {listAccordion?.map((item, index) => (
                <AccordionCustomized
                    key={item}
                    item={item}
                    expandIcon={<ExpandCircleDownIcon style={{ color: '#8F00FF' }} />}
                    summary={
                        <TitleAccordion>
                            {item}
                        </TitleAccordion>}
                    details={
                        <>
                            {index === 0 &&
                                <>
                                    <MotherForm
                                        model={model}
                                        setModel={setModel}
                                        listLocalities={listLocalities}
                                        editForm={editForm}
                                        typeForm={typeForm}
                                    />
                                    {typeForm === "ALTA" && <div style={{ textAlign: 'right' }}>
                                        <ButtonCustomized
                                            variant={'container'}
                                            // colorButton={'#18A974'}
                                            colorText={'#FFF'}
                                            sx={{
                                                fontSize: '16px',
                                                background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
                                                boxShadow: '3px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                                            }}
                                            onClick={submitMother}
                                        >
                                            GUARDAR
                                        </ButtonCustomized>
                                    </div>
                                    }
                                </>
                            }
                        </>
                    }
                />
            ))}

            {model?.bebe?.map((item, index) => (
                <div style={{ marginTop: '20px', padding: '0 16px', display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}>
                    <TitleAccordion style={{ paddingRight: '10px' }}>
                        {"Datos del bebe: " + item.nombre + " " + item.apellido}
                    </TitleAccordion>
                    <VisibilityIcon style={{ color: '#8F00FF', cursor: 'pointer' }}
                        onClick={() => redirectBaby(index)}
                    />
                </div>
            ))
            }

            {/* <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <ButtonCustomized
                    variant={'container'}
                    // colorButton={'#374741'}
                    colorText={'#FFF'}
                    sx={{
                        fontSize: '16px',
                        background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)',
                        boxShadow: '3px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                    }}
                >
                    Agregar bebe
                </ButtonCustomized>
            </div> */}
        </div >
    )
}

export default MotherAccordionForm;

const TitleAccordion = styled('span')`
    color: #152C70;
    font-family: Roboto;
    font-size: 19px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.8px;
`;
