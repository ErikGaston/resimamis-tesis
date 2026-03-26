import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

export default function AccordionCustomized({ item, expandIcon, summary, details }) {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <>
            <Accordion
                expanded={expanded === item}
                onChange={handleChange(item)}>
                <AccordionSummary
                    expandIcon={expandIcon}
                >
                    {summary}
                </AccordionSummary>
                <AccordionDetails>
                    {details}
                </AccordionDetails>
            </Accordion>
        </>
    );
}