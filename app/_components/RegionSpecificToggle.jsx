import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

export default function CheckboxLabels({ setShowRegionSpecific }) {
  const handleChange = (event) => {
    setShowRegionSpecific(event.target.checked);
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox defaultChecked onChange={handleChange} color="default" />}
        label={<Typography style={{ fontSize: '0.8rem', fontWeight: 600 }}>show region-specific</Typography>}
      />
    </FormGroup>
  );
}
