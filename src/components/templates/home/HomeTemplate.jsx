import styled from '@emotion/styled';
import React, { useEffect } from 'react'

import imgPortada from '../../../assets/home/portada.png'
import Modules from '../../organisms/homeCarousels/Modules';
import VolutariasDisponible from '../../organisms/homeCarousels/VolutariasDisponible';
import PanelTrabajo from '../../organisms/homeCarousels/PanelTrabajo';
import imagePNG from "../../../assets/voluntarias/person1.png";

export const HomeTemplate = (props) => {
    const { nameVolunteer, volunteersFree } = props;
    const [listVolunteersFree, setListVolunteersFree] = React.useState(null)

    useEffect(() => {
        if (volunteersFree) {
            volunteersFree?.forEach((item) => {
                item.url = imagePNG;
                item.name = item.nombre + " " + item.apellido
            })
            setListVolunteersFree(volunteersFree)
        }
    }, [volunteersFree])

    return (
        <StyledContainer img={imgPortada}>
            <Modules
                nameVolunteer={nameVolunteer}
            />
            <div style={{ padding: '40px 0' }}>
                <VolutariasDisponible
                    listVolunteersFree={listVolunteersFree}
                />
            </div>
            <div style={{ padding: '50px 0' }}>
                <PanelTrabajo />
            </div>

        </StyledContainer>
    )
}


const StyledContainer = styled('div')`
  height: 50%;
    width: 100vw;
    background: linear-gradient(0deg, #FFF -54.68%, #FFF -3.39%, rgba(255, 255, 255, 0.00)), url(${(props) => props.img});
    background-size: 100% 100%;
    background-repeat: no-repeat;
`;