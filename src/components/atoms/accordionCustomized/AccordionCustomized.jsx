import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

/**
 * Pasar `expanded` + `onExpandedChange` lo vuelve controlado (lo usa el alta de madre para
 * abrir la ficha del bebé automáticamente). Sin esas props funciona como antes.
 */
export default function AccordionCustomized({
    item,
    expandIcon,
    summary,
    details,
    defaultExpanded = false,
    expanded: expandedProp,
    onExpandedChange,
}) {
    const [expandedItem, setExpandedItem] = React.useState(() => (defaultExpanded ? item : false));

    const isControlled = expandedProp !== undefined;
    const expanded = isControlled ? Boolean(expandedProp) : expandedItem === item;

    const handleChange = (event, isExpanded) => {
        if (isControlled) onExpandedChange?.(isExpanded);
        else setExpandedItem(isExpanded ? item : false);
    };

    return (
        <>
            <Accordion
                expanded={expanded}
                onChange={handleChange}>
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
