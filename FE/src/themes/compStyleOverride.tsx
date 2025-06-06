// project imports
import { Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        md1024: true;
    }
}

export default function componentStyleOverrides(theme: Theme, borderRadius: number, outlinedFilled: boolean) {
    const mode = theme.palette.mode;
    const bgColor = mode === 'dark' ? theme.palette.dark[800] : theme.palette.background.paper;
    const menuSelectedBack = mode === 'dark' ? theme.palette.secondary.main + 15 : theme.palette.secondary.light;
    const menuSelected = mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark;

    return {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    borderRadius: `${borderRadius}px`
                }
            }
        },
        MuiPaper: {
            defaultProps: {
                elevation: 0
            },
            styleOverrides: {
                root: {
                    backgroundImage: 'none'
                },
                rounded: {
                    borderRadius: `${borderRadius}px`
                }
            }
        },
        MuiCardHeader: {
            styleOverrides: {
                root: {
                    color: theme.palette.grey[700],
                    padding: '24px'
                },
                title: {
                    fontSize: '1.125rem'
                }
            }
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: '24px'
                }
            }
        },
        MuiCardActions: {
            styleOverrides: {
                root: {
                    padding: '24px'
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    color: theme.palette.text.primary,
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    '&.Mui-selected': {
                        color: menuSelected,
                        backgroundColor: menuSelectedBack,
                        '&:hover': {
                            backgroundColor: menuSelectedBack
                        },
                        '& .MuiListItemIcon-root': {
                            color: menuSelected
                        }
                    },
                    '&:hover': {
                        backgroundColor: menuSelectedBack,
                        color: menuSelected,
                        '& .MuiListItemIcon-root': {
                            color: menuSelected
                        }
                    }
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: theme.palette.text.primary,
                    minWidth: '36px'
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    color: theme.palette.text.dark
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-inputMultiline': {
                        resize: 'vertical'
                    }
                },
                input: {
                    color: theme.palette.text.dark,
                    '&::placeholder': {
                        color: theme.palette.text.secondary,
                        fontSize: '0.875rem'
                    }
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    background: outlinedFilled ? bgColor : 'transparent',
                    borderRadius: `${borderRadius}px`,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: mode === 'dark' ? theme.palette.text.primary + 28 : theme.palette.grey[400]
                    },
                    '&:hover $notchedOutline': {
                        borderColor: theme.palette.primary.light
                    },
                    '& .MuiOutlinedInput-notchedOutline>legend': {
                        fontSize: '0.82rem'
                    }
                },
                input: {
                    fontWeight: 500,
                    background: outlinedFilled ? bgColor : 'transparent',
                    borderRadius: `${borderRadius}px`,
                    '&.Mui-disabled': {
                        color: mode === 'dark' ? theme.palette.text.primary + 50 : theme.palette.grey[300],
                        '-webkit-text-fill-color': '#0c0c0c',
                        cursor: 'not-allowed'
                    }
                },
                inputAdornedStart: {
                    paddingLeft: 4
                },
                notchedOutline: {
                    borderRadius: `${borderRadius}px`
                }
            }
        },
        MuiSlider: {
            styleOverrides: {
                root: {
                    '&.Mui-disabled': {
                        color: mode === 'dark' ? theme.palette.text.primary + 50 : theme.palette.grey[300]
                    }
                },
                mark: {
                    backgroundColor: theme.palette.background.paper,
                    width: '4px'
                },
                valueLabel: {
                    color: mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.light
                }
            }
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    '& .MuiAutocomplete-tag': {
                        background: mode === 'dark' ? theme.palette.text.primary + 20 : theme.palette.secondary.light,
                        borderRadius: 4,
                        color: theme.palette.text.dark,
                        '.MuiChip-deleteIcon': {
                            color: mode === 'dark' ? theme.palette.text.primary + 80 : theme.palette.secondary[200]
                        }
                    }
                },
                popper: {
                    borderRadius: `${borderRadius}px`,
                    boxShadow: '0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)'
                }
            }
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: theme.palette.divider,
                    opacity: mode === 'dark' ? 0.2 : 1
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    '&:focus': {
                        backgroundColor: 'transparent'
                    }
                }
            }
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    // color: mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.dark,
                    // background: mode === 'dark' ? theme.palette.text.primary : theme.palette.primary[200]
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    lineHeight: 2,
                    '&.MuiChip-deletable .MuiChip-deleteIcon': {
                        color: 'inherit'
                    }
                }
            }
        },
        MuiTimelineContent: {
            styleOverrides: {
                root: {
                    color: theme.palette.text.dark,
                    fontSize: '16px'
                }
            }
        },
        MuiTreeItem: {
            styleOverrides: {
                label: {
                    marginTop: 14,
                    marginBottom: 14
                }
            }
        },
        MuiTimelineDot: {
            styleOverrides: {
                root: {
                    boxShadow: 'none'
                }
            }
        },
        MuiInternalDateTimePickerTabs: {
            styleOverrides: {
                tabs: {
                    backgroundColor: mode === 'dark' ? theme.palette.dark[900] : theme.palette.primary.light,
                    '& .MuiTabs-flexContainer': {
                        borderColor: mode === 'dark' ? theme.palette.text.primary + 20 : theme.palette.primary[200]
                    },
                    '& .MuiTab-root': {
                        color: mode === 'dark' ? theme.palette.text.secondary : theme.palette.grey[900]
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: theme.palette.primary.dark
                    },
                    '& .Mui-selected': {
                        color: theme.palette.primary.dark
                    }
                }
            }
        },
        MuiTabs: {
            styleOverrides: {
                flexContainer: {
                    borderBottom: '1px solid',
                    borderColor: mode === 'dark' ? theme.palette.text.primary + 20 : theme.palette.grey[200]
                },
                indicator: {
                    backgroundColor: '#BE1128'
                }
            }
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        color: '#BE1128'
                    }
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    // padding: '0px 0 12px 0'
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: mode === 'dark' ? theme.palette.text.primary + 15 : theme.palette.grey[200],
                    '&.MuiTableCell-head': {
                        fontSize: '0.875rem',
                        color: theme.palette.grey[600],
                        fontWeight: 600
                    }
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    color: theme.palette.background.paper,
                    background: theme.palette.text.primary
                }
            }
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontSize: '1.25rem'
                }
            }
        },
        MuiDialogContent: {
            styleOverrides: {
                root: {
                    paddingTop: '8px !important'
                }
            }
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    padding: '24px 24px 24px 24px'
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                shrink: {
                    fontSize: '1.1rem'
                }
            }
        }
    };
}
