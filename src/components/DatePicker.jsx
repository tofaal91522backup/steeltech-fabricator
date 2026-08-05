const DatePicker = ({ label, value, onChange, placeholder }) => {
  return (
    <div className="relative bg-gray-200 p-2 rounded-md hover:bg-gray-300">
    
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer"
      />
    </div>
  );
};

export default DatePicker;
