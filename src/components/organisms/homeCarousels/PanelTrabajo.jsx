import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import bebe from "../../../assets/home/carousel-work/bebe-home.png";
import mama from "../../../assets/home/carousel-work/mama-home.png";
import voluntaria from "../../../assets/home/carousel-work/voluntaria-home.png";
import insumo from "../../../assets/home/carousel-work/insumo-home.png";

import { isCoordinadoraSession } from "../../../utils/coordinadoraRole";

const ROW_PERSONAS = [
    { name: "Madres", image: mama, url: "/madres" },
    { name: "Bebés", image: bebe, url: "/bebes" },
    { name: "Voluntarias", image: voluntaria, url: "/voluntarias" },
];

const ROW_GESTION_BASE = [
    { name: "Insumos", image: insumo, url: "/insumos" },
];

const COORD_ITEM = {
    name: "Coordinación",
    image: null,
    url: "/coordinacion",
    special: true,
};

function WorkCard({ name, image, url, special }) {
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
            {image ? (
                <Box
                    component="img"
                    src={image}
                    alt={name}
                    sx={{ width: "100%", maxWidth: 110, height: "auto", display: "block" }}
                />
            ) : (
                <Box
                    sx={{
                        width: 100,
                        height: 100,
                        borderRadius: "18px",
                        background: "linear-gradient(135deg, #A54DFF 0%, #8F00FF 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <AdminPanelSettingsIcon sx={{ fontSize: 48, color: "#fff" }} />
                </Box>
            )}
        </Box>
    );
}

const SectionLabel = ({ children }) => (
    <Typography
        sx={{
            fontSize: "0.65rem",
            fontWeight: 700,
            color: "rgba(21,44,112,0.38)",
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
        </Box>
    );
};

export default PanelTrabajo;
