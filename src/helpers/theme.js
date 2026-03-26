export const PALETTE = {
  primary: {
    main: '#transparent',
  },
  secondary: {
    main: '#141414'
  },
  tertiary: {
    background: '#D8BEFF'
  },
  error: {
    main: '#C53814',
  },
  warning: {
    main: '#FFD710',
  },
  info: {
    main: '#1495C5',
  },
  success: {
    main: '#0E9B2F',
  },
  button: {
    active: '#7A659B'
  },
  grayScale: {
    g0: '#FFFFFF',
    g01: '#F6F6F6',
    g100: '#FAFAFA',
    g200: '#E8E8E8',
    g250: '#F7F7F7',
    g300: '#D1D1D1',
    g400: '#717171',
    g500: '#262626',
    g600: '#5C5C5C',
    g700: '#B0B0B0',
  },
};

const SMALL_RADIUS = '5px';
const MAIN_RADIUS = '15px';
const LARGE_RADIUS = '25px';
const SECONDARY_RADIUS = '40px';
const DS_BUTTON_RADIUS = '48px';

export const baseTheme = {
  palette: PALETTE,
  transition: {
    main: 'all 200ms ease-in-out',
  },
  shadow: {
    bottom: '0 3px 6px rgba(0,0,0,0.29)',
    top: '0 -3px 6px rgba(0,0,0,0.16)',
    card: '0px 2px 4px rgba(0,0,0,0.16)',
    hover: '0px 5px 7px rgba(0,0,0,0.16)'
  },
  typography: {
    fontFamily: `"Open Sans", "Roboto", "Helvetica", "Arial", sans-serif`,
    size: {
      smallest: '0.625rem', // 10px
      smaller: '0.75rem', // 12px
      little: '0.875rem', // 14px
      small: '1rem', // 16px
      medium: '1.125rem', // 18px
      large: '1.25rem', // 20px
      larger: '1.625rem', // 26px
      xLarge: '1.875rem', // 30px
      xxLarge: '2.5rem', // 40px
    },
    weight: {
      thin: 300,
      normal: 400,
      semibold: 500,
      semibolder: 600,
      bold: 700
    },
    shadow: {
      main: `1px 1px 2px ${PALETTE.grayScale.g400}`
    },
    commonAvatar: {
      borderRadius: '8px'
    },
    smallAvatar: {
      width: '22px',
      height: '22px',
      fontSize: '1rem'
    },
    mediumAvatar: {
      width: '34px',
      height: '34px',
      fontSize: '1.2rem'
    },
    largeAvatar: {
      width: '44px',
      height: '44px',
      fontSize: '1.5rem'
    }
  },
  borderRadius: {
    small: SMALL_RADIUS,
    main: MAIN_RADIUS,
    large: LARGE_RADIUS,
    secondary: SECONDARY_RADIUS,
    designSystemButton: DS_BUTTON_RADIUS
  },
  space: {
    horizontal: {
      desktop: '3rem',
      mobile: '1rem',
    },
    vertical: {
      desktop: '1rem',
      mobile: '1rem',
    },
  },
  /* overrides: {
    MuiRadio: {
      root: {
        color: PALETTE.grayScale.g400,
        width:'32px',
        height:'32px',
        padding: '4px',
        '&:hover':{
          backgroundColor: '#F6F6F6',
        },
        '&:active':{
          backgroundColor: '#D8BEFF',
        },
        '&$checked': {
          color: '#7D10FF',
        },
        '&$disabled': {
          color: '#D1D1D1'
        },
        '&:focus':{
          backgroundColor: '#E8E8E8'
        }
      },
    },
    MuiCardContent: {
      root: {
        padding: 0,
        '&:last-child': {
          paddingBottom: 0,
        },
      },
    },
    MuiCssBaseline: {
      '@global': {
        '@font-face': ['Poppins'],
      },
    },
    MuiOutlinedInput: {
      input: {
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: '12px',
        paddingRight: '12px',
      },
      root: {
        background: PALETTE.grayScale.g0,
        borderRadius: LARGE_RADIUS,
        '& $notchedOutline': {
          borderColor: PALETTE.grayScale.g200,
          borderRadius: LARGE_RADIUS,
        },
        '&.Mui-disabled': {
          '& $notchedOutline': {
            borderColor: PALETTE.grayScale.g200,
          },
        }
      },
    },
    MuiInputLabel: {
      outlined: {
        transform: 'translate(0.875rem, 0.625rem) scale(1)',
        '&.MuiInputLabel-shrink': {
          transform: 'translate(0.875rem, -0.875rem) scale(0.75)',
        },
      },
    },
    MuiFormLabel: {
      root: {
        fontSize: '15px',
        fontWeight: 400,
        color: PALETTE.grayScale.g400,
        '&.Mui-focused': {
          color: PALETTE.grayScale.g400,
        }
      }
    },
    MuiFormControl: {
      root: {
        marginTop: '24px'
      }
    },
    MuiLink: {
      root: {
        fontSize: '15px',
        fontWeight: 500,
        color: PALETTE.secondary.main,

        '&:hover': {
          color: PALETTE.primary.main,
          textDecoration: 'none !important',
          cursor: 'pointer',
        },
      }
    },
    MuiSelect: {
      icon: {
        color: PALETTE.primary.main,
      },
    },
    MuiChip: {
      root: {
        height: '2rem',
        borderRadius: SECONDARY_RADIUS,
        backgroundColor: PALETTE.grayScale.g200,
        fontWeight: 500,
        fontSize: '0.9375rem',
      },
      label: {
        paddingLeft: 16,
        paddingRight: 14,
      },
      deleteIcon: {
        marginLeft: -8,

      },
    },
    MuiMenuItem: {
      root: {
        fontSize: '0.75rem'
      }
    },
    MuiCheckbox: {
      root: {
        width:'2rem',
        height:'2rem',
        padding:0,
        '&:hover': {
          backgroundColor:PALETTE.grayScale.g01
        },
        '&:focus':{
          backgroundColor:PALETTE.grayScale.g200
        },
        '&:active':{
          backgroundColor:'#D8BEFF'
        },
        '&$disabled':{
          color:PALETTE.grayScale.g300
        }
      },
      colorSecondary:{
        '&$checked':{
          color: PALETTE.primary.main2,
          width:'2rem',
          height:'2rem',
          '&:hover': {
            backgroundColor:PALETTE.grayScale.g01
          },
          '&:focus':{
            backgroundColor:PALETTE.grayScale.g200
          },
          '&:active':{
            backgroundColor:'#D8BEFF'
          },
          '&$disabled':{
            color:PALETTE.grayScale.g300
          }
        }
      }
    },
  } */
};
