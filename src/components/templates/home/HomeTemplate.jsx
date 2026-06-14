import styled from '@emotion/styled';
import React, { useEffect } from 'react'

import imgPortada from '../../../assets/home/portada.png'
import Modules from '../../organisms/homeCarousels/Modules';
import VolutariasDisponible from '../../organisms/homeCarousels/VolutariasDisponible';
import PanelTrabajo from '../../organisms/homeCarousels/PanelTrabajo';
import { APP_SCROLL_BOTTOM_PADDING } from '../../../helpers/const/appLayout';

export const HomeTemplate = (props) => {
    const { nameVolunteer, volunteersFree } = props;
    const [listVolunteersFree, setListVolunteersFree] = React.useState(null)

    useEffect(() => {
        if (volunteersFree?.length) {
            const enriched = volunteersFree.map(item => ({
                ...item,
                name: `${item.nombre ?? ''} ${item.apellido ?? ''}`.trim(),
            }));
            setListVolunteersFree(enriched);
        } else {
            setListVolunteersFree(volunteersFree ?? null);
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
            <div style={{ paddingTop: '50px', paddingBottom: APP_SCROLL_BOTTOM_PADDING }}>
                <PanelTrabajo />
            </div>

        </StyledContainer>
    )
}


const StyledContainer = styled('div')`
  min-height: 100%;
  width: 100%;
  max-width: 100%;
  background: linear-gradient(0deg, #FFF 0%, #FFF 45%, rgba(255, 255, 255, 0.55) 75%, rgba(255, 255, 255, 0.00) 100%), url(${(props) => props.img});
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  box-sizing: border-box;
`;