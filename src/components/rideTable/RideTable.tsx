import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import "./RideTable.scss"
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import type { IRideList } from "../../Interfaces/IRide";
import Validator from "../../services/ValidatorService";
interface IRideTableProps {
  rides: IRideList[];
  role: string;
}
export default function RideTable({
  rides,
  role,
}: IRideTableProps) {
  const navigate = useNavigate();
  const handleViewMap = (ride: IRideList) => {
    navigate("/maps", {
      state: {
        source: ride.fromLocation,
        destination: ride.toLocation,
      },
    });
  };
  const rows = useMemo(() =>
      rides.map((ride: IRideList, index: number) => ({
        id: index + 1,
        ...ride,
        status: Validator().isValidFutureDate(
          ride.availableDate
        )
          ? "Booked"
          : "Completed",

        availableDate:
          ride.availableDate.split("T")[0],
      })),
    [rides]
  );
  const columns: GridColDef[] = useMemo(() => {
    if (rows.length === 0) {
      return [];
    }
    const hiddenFields =role === "user" ? ["customerName", "bookingId"]: ["bookingId"];
    const dynamicColumns: GridColDef[] = Object.keys( rows[0])
      .filter(
        (key: string) => !hiddenFields.includes(key)
      )
      .map((key: string) => ({
        field: key,
        headerName: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (char) =>
            char.toUpperCase()
          ),
        flex: 1,
        minWidth: 150,
      }));
    const actionColumn: GridColDef = {
      field: "actions",
      headerName: "Actions",
      minWidth: 180,
      sortable: false,
      filterable: false,
      renderCell: (
        params: GridRenderCellParams
      ) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleViewMap(params.row)}
          sx={{textTransform:"none"}}
        >
          View Map
        </Button>
      ),
    };
    return [...dynamicColumns, actionColumn];
  }, [rows, role]);
 return ( 
 <Paper sx={{ height: 400, width: '100%' }}>
   <DataGrid rows={rows} columns={columns} 
  initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }} 
  pageSizeOptions={[5, 10]} 
  checkboxSelection sx={{ border: 0 }} /> 
  </Paper> );
}