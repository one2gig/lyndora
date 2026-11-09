import { CakeDesign } from '../../types';
import { FLAVORS, TOPPINGS } from '../../constants';

export function DesignSummary({ design }: { design: CakeDesign }) {
  const toppingNames = design.decorations
    .map((decoration) => TOPPINGS.find((topping) => topping.id === decoration.type)?.name ?? decoration.type)
    .join(', ');

  return (
    <ul className="text-sm text-gray-600 space-y-1.5">
      <li className="capitalize">Shape: {design.shape}</li>
      {design.tiers.map((tier, index) => {
        const flavor = FLAVORS.find((item) => item.id === tier.flavor)?.name ?? tier.flavor;
        const role = design.tiers.length === 1
          ? 'base'
          : index === 0
            ? 'base'
            : index === design.tiers.length - 1
              ? 'top'
              : '';

        return (
          <li key={tier.id} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: tier.frostingColor }}
            />
            <span>
              Tier {index + 1}{role ? ` (${role})` : ''} · {tier.size} · {flavor}
            </span>
          </li>
        );
      })}
      {design.drip.enabled && (
        <li className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-full border border-black/10 shrink-0"
            style={{ backgroundColor: design.drip.color }}
          />
          Drip on the top tier
        </li>
      )}
      <li>Toppings: {toppingNames || 'None'}</li>
      {design.wording.text && <li>Message: “{design.wording.text}”</li>}
      {design.notes && <li>Note: {design.notes}</li>}
    </ul>
  );
}
