import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import bebe from "../../../assets/home/carousel-work/bebe-home.svg";
import mama from "../../../assets/home/carousel-work/mama-home.svg";
import voluntaria from "../../../assets/home/carousel-work/voluntaria-home.svg";
import insumo from "../../../assets/home/carousel-work/insumo-home.svg";
import coordinacion from "../../../assets/home/carousel-work/coordinacion-home.svg";

import { isCoordinadoraSession } from "../../../utils/coordinadoraRole";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

const ROW_PERSONAS = [
    { name: "Madres", image: mama, url: "/madres" },
    { name: "Bebés", image: bebe, url: "/bebes" },
    { name: "Voluntarias", image: voluntaria, url: "/voluntarias" },
];

const ROW_GESTION_BASE = [
    { name: "Insumos", image: insumo, url: "/insumos" },
];

const COORD_ITEM = {
    name: "Administración",
    image: coordinacion,
    url: "/coordinacion",
    special: true,
};

function WorkCard({ name, image, url }) {
    return (
        <Box
            component={Link}
            to={url}
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textDecoration: "none",
                WebkitTapHighlightColor: "transparent",
                minWidth: 0,
                transition: "opacity 0.13s",
                "&:active": { opacity: 0.7 },
            }}
        >
            <Box
                component="img"
                src={image}
                alt={name}
                sx={{ width: "100%", maxWidth: 110, height: "auto", display: "block" }}
            />
        </Box>
    );
}

/** Accesos de coordinación. No usan las ilustraciones porque esas traen la
 *  etiqueta incrustada en el SVG; acá el texto va aparte. */
function ShortcutCard({ icon: Icon, name, description, url }) {
    return (
        <Box
            component={Link}
            to={url}
            sx={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                px: 1.5,
                py: 1.25,
                minHeight: 44,
                borderRadius: "14px",
                textDecoration: "none",
                bgcolor: "#faf8fc",
                border: "1px solid rgba(143,0,255,0.14)",
                WebkitTapHighlightColor: "transparent",
                transition: "background-color 0.15s",
                "&:active": { bgcolor: "rgba(143,0,255,0.08)" },
            }}
        >
            <Box sx={{
                width: 38, height: 38, borderRadius: "11px", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg, #A54DFF 0%, #8F00FF 100%)",
            }}>
                <Icon sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, color: "#152C70", fontSize: "0.9rem", lineHeight: 1.2 }}>
                    {name}
                </Typography>
                <Typography sx={{ color: "rgba(21,44,112,0.75)", fontSize: "0.78rem", lineHeight: 1.3 }}>
                    {description}
                </Typography>
            </Box>
        </Box>
    );
}

const SectionLabel = ({ children }) => (
    <Typography
        sx={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "rgba(21,44,112,0.72)",
            textTransform: "uppercase",
            letterSpacing: "0.09em",
            mb: 1,
            ml: 0.25,
        }}
    >
        {children}
    </Typography>
);

const PanelTrabajo = () => {
    const isCoord = isCoordinadoraSession();

    const rowGestion = React.useMemo(() => {
        if (!isCoord) return ROW_GESTION_BASE;
        return [...ROW_GESTION_BASE, COORD_ITEM];
    }, [isCoord]);

    return (
        <Box sx={{ px: 2, pb: 2 }}>
            <Typography
                sx={{
                    color: "#152C70",
                    fontSize: "1.05rem",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                    mb: 1.5,
                    ml: 0.25,
                }}
            >
                Panel de trabajo
            </Typography>

            <SectionLabel>Personas</SectionLabel>
            <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
                {ROW_PERSONAS.map((item) => (
                    <WorkCard key={item.url} {...item} />
                ))}
            </Box>

            <SectionLabel>Gestión</SectionLabel>
            <Box sx={{ display: "flex", gap: 1.5 }}>
                {rowGestion.map((item) => (
                    <WorkCard key={item.url} {...item} />
                ))}
            </Box>

            {isCoord && (
                <>
                    <Box sx={{ mt: 2.5 }}>
                        <SectionLabel>Coordinación</SectionLabel>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <ShortcutCard
                            icon={InsightsOutlinedIcon}
                            name="Panel del día"
                            description="Cobertura de abrazos y situación de hoy"
                            url="/panel"
                        />
                        <ShortcutCard
                            icon={SmartToyOutlinedIcon}
                            name="Asistente"
                            description="Consultá los datos del programa"
                            url="/asistente"
                        />
                    </Box>
                </>
            )}
        </Box>
    );
};

export default PanelTrabajo;
