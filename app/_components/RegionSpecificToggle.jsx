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
        control={<Checkbox defaultChecked onChange={handleChange} />}
        label={<p className="text-sm font-semibold text-black dark:text-white tracking-tight">show region-specific</p>}
      />
    </FormGroup>
  );
}
