/* eslint-disable */
import {
    Box,
    Grid,
    InputAdornment,
    Pagination,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableCellProps,
    TableContainer,
    TableContainerProps,
    TableHead,
    TablePagination,
    TableProps,
    TableRow,
    TableRowProps,
    TableSortLabel,
    Typography,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { visuallyHidden } from '@mui/utils';
import { IconSearch } from '@tabler/icons';
import img_empty_data from 'assets/images/img_empty_data.svg';
import * as React from 'react';
import { useQuery } from 'react-query';
import { gridSpacing } from 'store/constant';
import { KeyedObject } from 'types';
import HDTableSkeleton from 'ui-component/cards/Skeleton/HDTableSkeleton';
import HDTextFieldDebounced from './form/HDTextFieldDebounced';
import HDCardLoading from './HDCardLoading';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export interface ColumnProps {
    id: string;
    label: string | any;
    width?: number | string;
    minWidth?: number;
    align?: 'right' | 'left' | 'inherit' | 'center' | 'justify' | undefined;
    format?: (value: Date | number) => string | boolean;
    renderCell?: (value: any) => React.ReactNode;
    customHeader?: () => React.ReactNode;
    sticky?: boolean;
    cellSX?: TableCellProps['sx'] | any;
    headerCellSX?: TableCellProps['sx'];
}

interface Props {
    rows: any[];
    columns: ColumnProps[];
    onChangePage?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null | any, newPage: number) => void;
    onChangeRowsPerPage?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => void;
    sxTableContainer?: TableContainerProps['sx'];
    sxTable?: TableProps['sx'];
    sxRowHeader?: TableRowProps['sx'];
    hideHeader?: boolean;
    hideHPagination?: boolean;
    onClickRow?: (item) => void;
    loading?: boolean;
    border?: boolean;
    headerContent?: string | React.ReactNode;
    isGlobalFilter?: boolean;
    initPageSize?: number;
    hadSort?: boolean;
    hadOrderBy?: Order;
    hasErrors?: boolean;
    hasHightlight?: boolean;
    rowsPerPageOptions?: number[];
    hover?: Boolean;
    size?: TableProps['size'];
    rowsPerPage?: number;
    page?: number;
    totalPage?: number;
}

const useStyles = makeStyles({
    tableBorder: {
        minWidth: '100%',
        '& .MuiTableCell-root': {
            borderLeft: '1px solid rgba(224, 224, 224, 1)'
        }
    },
    sticky: {
        position: 'sticky',
        left: 0,
        borderRight: '1px solid rgba(224, 224, 224, 1)',
        background: 'white',
        zIndex: 10
    }
});
interface EnhancedTableProps {
    columns: ColumnProps[];
    onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    sxRowHeader?: TableRowProps['sx'];
    hadSort?: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const classes = useStyles();
    const theme = useTheme();
    const matchUpSM = useMediaQuery(theme.breakpoints.up('sm'));
    const { order, orderBy, rowCount, onRequestSort, columns } = props;
    const createSortHandler = (property: any) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead sx={props.sxRowHeader}>
            <TableRow tabIndex={-1} sx={props.sxRowHeader}>
                {columns.map((column: any) => (
                    <TableCell
                        className={column.sticky && matchUpSM ? classes.sticky : ''}
                        key={column.id}
                        align={column.align}
                        sortDirection={orderBy === column.id ? order : false}
                        sx={column.headerCellSX}
                    >
                        {props.hadSort ? (
                            <TableSortLabel
                                active={orderBy === column.id}
                                direction={orderBy === column.id ? order : 'asc'}
                                onClick={createSortHandler(column.id)}
                            >
                                {column.customHeader ? column?.customHeader() : column.label}
                                {orderBy === column.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        ) : (
                            <>{column.customHeader ? column?.customHeader() : column.label}</>
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const HDTable = ({
    onChangePage,
    onChangeRowsPerPage,
    rows,
    columns,
    sxTableContainer,
    sxTable,
    sxRowHeader,
    hideHeader = false,
    hideHPagination = false,
    onClickRow,
    loading = false,
    border,
    headerContent,
    isGlobalFilter = true,
    initPageSize = 5,
    hadSort = true,
    hasErrors = false,
    hasHightlight = false,
    hadOrderBy = 'desc',
    rowsPerPageOptions = [5, 10, 25, 50, 100],
    hover = false,
    size = 'small',
    totalPage
}: Props) => {
    const [globalFilter, setGlobalFilter] = React.useState('');
    const removeVietnameseTones = (str) => {
        const from = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ';
        const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd';
        const regex = new RegExp(from.split('').join('|'), 'g');

        return str.replace(regex, (match) => to.charAt(from.indexOf(match)));
    };
    const { data, refetch, isLoading } = useQuery(
        ['qRows', globalFilter, rows],
        () => {
            return _.filter(rows, (item) => {
                const stringValue = _.replace(_.toString(_.values(item)), new RegExp(',', 'g'), '');
                const normalizedStringValue = _.lowerCase(removeVietnameseTones(stringValue));
                const normalizedFilter = _.lowerCase(removeVietnameseTones(globalFilter));
                return _.includes(normalizedStringValue, normalizedFilter);
            });
        },
        {
            keepPreviousData: true,
            onError: (err: any) => {},
            cacheTime: 10000
        }
    );
    const theme = useTheme();
    const matchUpSM = useMediaQuery(theme.breakpoints.up('sm'));
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(initPageSize);
    const [order, setOrder] = React.useState<Order>(hadOrderBy);
    const [orderBy, setOrderBy] = React.useState<any>('id');

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        onChangePage?.(event, newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        onChangeRowsPerPage?.(event);
    };

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: any) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const classes = useStyles();
    return (
        <Paper sx={{ width: '100%' }}>
            <Grid container spacing={gridSpacing} mb={2}>
                {headerContent && (
                    <Grid item xs={12} md display="flex" alignItems="center">
                        {headerContent}
                    </Grid>
                )}

                {Boolean(isGlobalFilter) && (
                    <Grid item xs={12} md>
                        <HDTextFieldDebounced
                            value={globalFilter}
                            onChange={(value) => {
                                setGlobalFilter(value);
                            }}
                            className="p-2 font-lg shadow border border-block"
                            placeholder="Nhập nội dung tìm kiếm..."
                            id="input-with-icon-textfield"
                            label="Tìm kiếm"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconSearch />
                                    </InputAdornment>
                                )
                            }}
                            variant="outlined"
                        />
                    </Grid>
                )}
            </Grid>
            {Boolean(loading || isLoading) ? (
                <Box sx={{ mt: 4 }}>
                    <HDCardLoading />
                </Box>
            ) : (
                <>
                    <TableContainer sx={{ ...sxTableContainer }}>
                        <Table
                            stickyHeader
                            aria-label="sticky table"
                            size={size}
                            sx={{
                                ...sxTable,
                                borderTop: border ? '1px solid rgba(224, 224, 224, 1)' : 'none',
                                borderRight: border ? '1px solid rgba(224, 224, 224, 1)' : 'none'
                            }}
                            className={border ? classes.tableBorder : ''}
                        >
                            {!Boolean(hideHeader) && (
                                <EnhancedTableHead
                                    sxRowHeader={sxRowHeader}
                                    columns={columns}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    rowCount={(data || []).length}
                                />
                            )}

                            <TableBody>
                                {Boolean((data || []).length > 0) &&
                                    (data || []).map((row: KeyedObject, index) => (
                                        <TableRow
                                            tabIndex={-1}
                                            key={index}
                                            onClick={(event) => onClickRow?.(row)}
                                            sx={{
                                                cursor: onClickRow ? 'pointer' : 'default',
                                                backgroundColor: Boolean(hasHightlight) && _.get(row, 'isNew', false) ? '#ECECEC' : ''
                                            }}
                                            hover={Boolean(hover)}
                                        >
                                            {columns.map((column, index) => {
                                                const value = row[column.id];
                                                const isErorr = Boolean(hasErrors) && _.get(row, 'isErrors', false);
                                                const cellSX = _.isFunction(column.cellSX) ? column.cellSX?.(row) : column.cellSX;
                                                return (
                                                    <TableCell
                                                        className={column.sticky && matchUpSM ? classes.sticky : ''}
                                                        key={index}
                                                        align={column.align}
                                                        sx={{
                                                            width: column.width || 'max-content',
                                                            ...cellSX,
                                                            color: isErorr ? '#BE1128' : '#616161',
                                                            borderColor: isErorr ? '#BE1128' : '#d3d8de'
                                                        }}
                                                    >
                                                        {Boolean(column.renderCell)
                                                            ? column.renderCell?.(row)
                                                            : Boolean(column.format)
                                                            ? column.format?.(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                {Boolean((data || []).length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} align="center">
                                            <img src={img_empty_data} alt="No Data !" />
                                            <Typography variant="subtitle1" fontStyle="italic" sx={{ mt: 1, mb: 3 }}>
                                                Không tìm thấy dữ liệu !
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={rowsPerPageOptions}
                        component="div"
                        count={(data || []).length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Tổng số trên 1 trang:"
                        nextIconButtonProps={{
                            sx: { display: 'none' }
                        }}
                        backIconButtonProps={{
                            sx: { display: 'none' }
                        }}
                        labelDisplayedRows={(paginationInfo) => (
                            <>
                                <Typography variant="subtitle2" sx={{ ml: 1.5 }} component="span">
                                    Hiển thị từ {paginationInfo.from} - {paginationInfo.from + rowsPerPage - 1} trên tổng số{' '}
                                    {totalPage ? totalPage * rowsPerPage : 0}
                                </Typography>
                                <Stack>
                                    <Pagination
                                        count={totalPage}
                                        color="primary"
                                        page={paginationInfo.page + 1}
                                        onChange={(e, v) => handleChangePage(e, v - 1)}
                                        showFirstButton
                                        showLastButton
                                    />
                                </Stack>
                            </>
                        )}
                    />
                </>
            )}
        </Paper>
    );
};

export default React.memo(HDTable);
