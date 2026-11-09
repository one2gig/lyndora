import { format, parseISO } from 'date-fns';

export function PickupDetails({
  pickupDate,
  pickupTime,
  notes,
}: {
  pickupDate?: string;
  pickupTime?: string;
  notes?: string;
}) {
  if (!pickupDate && !pickupTime && !notes) return null;

  let when = pickupDate ?? '';
  if (pickupDate) {
    const parsed = parseISO(pickupDate);
    if (!Number.isNaN(parsed.getTime())) {
      when = format(parsed, 'MMM d, yyyy');
    }
  }

  return (
    <div className="text-xs text-gray-500 mt-1 space-y-0.5">
      {(when || pickupTime) && (
        <p>
          Pickup{when ? ` ${when}` : ''}
          {pickupTime ? ` · ${pickupTime}` : ''}
        </p>
      )}
      {notes ? <p>Note: {notes}</p> : null}
    </div>
  );
}
