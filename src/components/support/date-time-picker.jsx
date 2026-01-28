import { CalendarIcon, ChevronDownIcon, ClockIcon } from 'lucide-react';
import * as React from 'react';
import { Button } from '../ui/button.jsx';
import { Calendar } from '../ui/calendar.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover.jsx';

export default function DateTimePicker({
  name,
  type,
  label,
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
  attributes = null,
  native = true,
  time: hasTime = true,
  date: hasDate = true,
}) {
  const getInputType = () => {
    if (type === 'date-picker') return 'date';
    if (type === 'time-picker') return 'time';
    return 'datetime-local';
  };

  // Use native input if native prop is true
  if (native) {
    return (
      <div className="space-y-2">
        {label && <Label required={required}>{label}</Label>}
        <Input
          id={name}
          name={name}
          type={getInputType()}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={false}
          className={error ? 'border-red-500' : ''}
          {...(attributes || {})}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  // Custom picker (non-native)
  if (type === 'date-picker' || (hasDate && !hasTime)) {
    return <CustomDatePicker name={name} label={label} value={value} onChange={onChange} error={error} required={required} placeholder={placeholder} />;
  }

  if (type === 'time-picker' || (hasTime && !hasDate)) {
    return (
      <CustomTimePicker name={name} label={label} value={value} onChange={onChange} error={error} required={required} placeholder={placeholder} />
    );
  }

  if (type === 'datetime-picker' || (hasDate && hasTime)) {
    return (
      <CustomDateTimePicker name={name} label={label} value={value} onChange={onChange} error={error} required={required} placeholder={placeholder} />
    );
  }

  return null;
}

function CustomDatePicker({ name, label, value, onChange, error, required, placeholder }) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(value ? new Date(value) : undefined);

  React.useEffect(() => {
    setSelectedDate(value && value !== '' ? new Date(value) : undefined);
  }, [value]);

  const handleSelect = (date) => {
    setSelectedDate(date);
    const formatted = date ? date.toISOString().split('T')[0] : '';
    onChange(formatted);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && <Label required={required}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-9 w-full justify-between text-sm font-normal">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? selectedDate.toLocaleDateString() : placeholder || 'Pick a date'}
            </div>
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar mode="single" selected={selectedDate} onSelect={handleSelect} />
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

function CustomTimePicker({ name, label, value, onChange, error, required, placeholder }) {
  const [hours, setHours] = React.useState('12');
  const [minutes, setMinutes] = React.useState('00');

  React.useEffect(() => {
    if (value && value !== '') {
      const parts = value.split(':');
      setHours(parts[0] || '12');
      setMinutes(parts[1] || '00');
    }
  }, [value]);

  const handleHoursChange = (e) => {
    const newHours = e.target.value.padStart(2, '0');
    setHours(newHours);
    onChange(`${newHours}:${minutes}:00`);
  };

  const handleMinutesChange = (e) => {
    const newMinutes = e.target.value.padStart(2, '0');
    setMinutes(newMinutes);
    onChange(`${hours}:${newMinutes}:00`);
  };

  return (
    <div className="space-y-2">
      {label && <Label required={required}>{label}</Label>}
      <div className="flex items-center space-x-2">
        <ClockIcon className="h-4 w-4 text-muted-foreground" />
        <Input
          type="number"
          min="0"
          max="23"
          value={hours}
          onChange={handleHoursChange}
          className="w-16 text-center"
          placeholder="HH"
        />
        <span className="text-muted-foreground">:</span>
        <Input
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={handleMinutesChange}
          className="w-16 text-center"
          placeholder="MM"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

function CustomDateTimePicker({ name, label, value, onChange, error, required, placeholder }) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(value ? new Date(value) : undefined);
  const [hours, setHours] = React.useState('12');
  const [minutes, setMinutes] = React.useState('00');

  React.useEffect(() => {
    if (value && value !== '') {
      const date = new Date(value);
      setSelectedDate(date);
      setHours(date.getHours().toString().padStart(2, '0'));
      setMinutes(date.getMinutes().toString().padStart(2, '0'));
    }
  }, [value]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) {
      const formatted = `${date.toISOString().split('T')[0]} ${hours}:${minutes}:00`;
      onChange(formatted);
    }
  };

  const handleHoursChange = (e) => {
    const newHours = e.target.value.padStart(2, '0');
    setHours(newHours);
    if (selectedDate) {
      const formatted = `${selectedDate.toISOString().split('T')[0]} ${newHours}:${minutes}:00`;
      onChange(formatted);
    }
  };

  const handleMinutesChange = (e) => {
    const newMinutes = e.target.value.padStart(2, '0');
    setMinutes(newMinutes);
    if (selectedDate) {
      const formatted = `${selectedDate.toISOString().split('T')[0]} ${hours}:${newMinutes}:00`;
      onChange(formatted);
    }
  };

  const getDisplayValue = () => {
    if (!selectedDate) return placeholder || 'Pick date and time';
    const dateStr = selectedDate.toLocaleDateString();
    const timeStr = `${hours}:${minutes}`;
    return `${dateStr} ${timeStr}`;
  };

  return (
    <div className="space-y-2">
      {label && <Label required={required}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-9 w-full justify-between text-sm font-normal">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getDisplayValue()}
            </div>
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} />
          <div className="border-t p-3">
            <div className="flex items-center justify-center space-x-2">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <Input type="number" min="0" max="23" value={hours} onChange={handleHoursChange} className="w-16 text-center" placeholder="HH" />
              <span className="text-muted-foreground">:</span>
              <Input type="number" min="0" max="59" value={minutes} onChange={handleMinutesChange} className="w-16 text-center" placeholder="MM" />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
