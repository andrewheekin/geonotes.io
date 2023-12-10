import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function CheckboxLabels({ setShowRegionSpecific }) {
  const handleChange = (event) => {
    setShowRegionSpecific(event.target.checked);
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            defaultChecked
            onChange={handleChange}
            color="default"
          />
        }
        label={<Typography style={{ fontFamily: "monospace", fontSize: '0.8rem', fontWeight: 600 }}>Include region-specific notes</Typography>}
      />
    </FormGroup>
  );
}


// export default function ToggleButtons() {
//   const [alignment, setAlignment] = React.useState('left');

//   const handleAlignment = (event, newAlignment) => {
//     setAlignment(newAlignment);
//   };

//   return (
//     <ToggleButtonGroup
//       value={alignment}
//       exclusive
//       onChange={handleAlignment}
//       aria-label="text alignment"
//     >
//       <ToggleButton value="left" aria-label="left aligned">
//         L
//       </ToggleButton>
//       <ToggleButton value="center" aria-label="centered">
//         C
//       </ToggleButton>
//       <ToggleButton value="right" aria-label="right aligned">
//         R
//       </ToggleButton>
//     </ToggleButtonGroup>
//   );
// }