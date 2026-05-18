import { useEffect, useRef } from "react";
import { UseLocationSearch } from "../../../hooks/UseLocationSearch";
import "./LocationInput.scss";

interface Props {
  value: string;
  label?: string;
  onChange: (val: string) => void;
  onSelect: (name: string, coords: [number, number]) => void;
  placeholder?: string;
  className?: string;
}

const LocationInput = ({
  value,
  onChange,
  onSelect,
  placeholder,
  label,
  className,
}: Props) => {
  const { suggestions, setSuggestions } = UseLocationSearch(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(false);
  useEffect(() => {
    const closeDropDown = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", closeDropDown);
    return () => {
      document.removeEventListener("mousedown",closeDropDown);
    };
  }, [setSuggestions]);
  const changeUserInput= (val: string) => {
    selectedRef.current = false;
    onChange(val);
  };
  return (
    <div className="location-field" ref={dropdownRef}>
      {label && (
        <label htmlFor={label} className="my-1 label d-flex">
        
          <span>  {label}</span>
          <span className="text-danger required">*</span>
        </label>
      )}
      <input
        value={value}
        onChange={(e) => changeUserInput(e.target.value)}
        placeholder={placeholder || ""}
        className={className || ""}
      />
      
      {!selectedRef.current && suggestions && suggestions.length > 0 && (
        <ul className="suggestions p-2">
          {suggestions.map((p: any) => {
            const name =
              p.properties.name ||
              p.properties.city ||
              p.properties.country;
            return (
              <li
                className="suggestion-list p-0"
                key={p.properties.osm_id}
                onMouseDown={() => {
                  const coords: [number, number] = [
                    p.geometry.coordinates[1],
                    p.geometry.coordinates[0],
                  ];
                  selectedRef.current = true;
                  onSelect(name, coords);
                  setSuggestions([]);
                }}
              >
                <strong className="location">{name}</strong>
                <br />
                <small>
                  {p.properties.city || ""}{" "}
                  {p.properties.country || ""}
                </small>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
export default LocationInput;