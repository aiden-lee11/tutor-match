import React, { useState, useEffect } from 'react';

interface AvailabilitySlot {
  day: string;
  time: string;
  available: boolean;
}

interface WeeklyAvailabilityGridProps {
  value: string; // JSON string of availability or text description
  onChange: (availability: string) => void;
  label: string;
  required?: boolean;
  className?: string;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = [
  '9:00 AM',
  '10:00 AM', 
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM'
];

const WeeklyAvailabilityGrid: React.FC<WeeklyAvailabilityGridProps> = ({
  value,
  onChange,
  label,
  required = false,
  className = ""
}) => {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'select' | 'deselect'>('select');

  // Initialize from existing value
  useEffect(() => {
    if (value) {
      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          if (parsed.length > 0 && typeof parsed[0] === 'string') {
            // New compact format: array of slot IDs
            const slots = new Set(parsed);
            setSelectedSlots(slots);
          } else {
            // Old format: array of AvailabilitySlot objects
            const slots = new Set(parsed.map((slot: AvailabilitySlot) => `${slot.day}-${slot.time}`));
            setSelectedSlots(slots);
          }
          return;
        }
      } catch {
        // If not JSON, it's probably a text description - start with empty grid
        setSelectedSlots(new Set());
      }
    }
  }, []);

  const getSlotId = (day: string, time: string) => `${day}-${time}`;

  const isSlotSelected = (day: string, time: string) => {
    return selectedSlots.has(getSlotId(day, time));
  };

  const toggleSlot = (day: string, time: string) => {
    const slotId = getSlotId(day, time);
    const newSlots = new Set(selectedSlots);
    
    if (newSlots.has(slotId)) {
      newSlots.delete(slotId);
    } else {
      newSlots.add(slotId);
    }
    
    setSelectedSlots(newSlots);
    updateAvailability(newSlots);
  };

  const handleMouseDown = (day: string, time: string) => {
    setIsSelecting(true);
    const slotId = getSlotId(day, time);
    const isCurrentlySelected = selectedSlots.has(slotId);
    setSelectionMode(isCurrentlySelected ? 'deselect' : 'select');
    toggleSlot(day, time);
  };

  const handleMouseEnter = (day: string, time: string) => {
    if (!isSelecting) return;
    
    const slotId = getSlotId(day, time);
    const newSlots = new Set(selectedSlots);
    
    if (selectionMode === 'select') {
      newSlots.add(slotId);
    } else {
      newSlots.delete(slotId);
    }
    
    setSelectedSlots(newSlots);
    updateAvailability(newSlots);
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  const updateAvailability = (slots: Set<string>) => {
    // Convert to more compact format: just store the selected slot IDs
    const availabilityData = Array.from(slots);
    
    // Store as JSON for structured data
    onChange(JSON.stringify(availabilityData));
  };

  const generateTextDescription = (slotIds: string[]): string => {
    if (slotIds.length === 0) return '';
    
    // Group by day
    const byDay: { [key: string]: string[] } = {};
    slotIds.forEach(slotId => {
      const [day, time] = slotId.split('-');
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(time);
    });

    // Generate description
    const descriptions: string[] = [];
    DAYS.forEach(day => {
      if (byDay[day] && byDay[day].length > 0) {
        const times = byDay[day].sort((a, b) => {
          const aHour = parseInt(a.split(':')[0]) + (a.includes('PM') && !a.startsWith('12') ? 12 : 0);
          const bHour = parseInt(b.split(':')[0]) + (b.includes('PM') && !b.startsWith('12') ? 12 : 0);
          return aHour - bHour;
        });
        
        if (times.length === 1) {
          descriptions.push(`${day}: ${times[0]}`);
        } else {
          const first = times[0];
          const last = times[times.length - 1];
          descriptions.push(`${day}: ${first} - ${last}`);
        }
      }
    });

    return descriptions.join(', ');
  };

  const selectedCount = selectedSlots.size;
  const totalSlots = DAYS.length * TIME_SLOTS.length;

  return (
    <div className={`space-y-4 ${className}`} onMouseUp={handleMouseUp}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Weekly Availability</h3>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span>Available ({selectedCount})</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
              <span>Not Available ({totalSlots - selectedCount})</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Click and drag to select multiple time slots
          </p>
        </div>

        <div className="grid grid-cols-8 gap-1 text-sm">
          {/* Header row */}
          <div></div> {/* Empty corner */}
          {DAYS.map(day => (
            <div key={day} className="text-center font-medium text-gray-700 py-2">
              {day}
            </div>
          ))}
          
          {/* Time slots */}
          {TIME_SLOTS.map(time => (
            <React.Fragment key={time}>
              <div className="text-right pr-2 py-2 text-gray-600 font-medium">
                {time}
              </div>
              {DAYS.map(day => (
                <div
                  key={getSlotId(day, time)}
                  className={`
                    h-8 border border-gray-200 cursor-pointer transition-colors select-none
                    ${isSlotSelected(day, time) 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-gray-100 hover:bg-gray-200'
                    }
                  `}
                  onMouseDown={() => handleMouseDown(day, time)}
                  onMouseEnter={() => handleMouseEnter(day, time)}
                  title={`${day} ${time}`}
                />
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Text summary */}
        {selectedSlots.size > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Selected availability:</strong> {generateTextDescription(Array.from(selectedSlots))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyAvailabilityGrid;
