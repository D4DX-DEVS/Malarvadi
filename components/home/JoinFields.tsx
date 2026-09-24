"use client";
import { CLASS_OPTIONS, KERALA_DISTRICTS } from "@/lib/form-options";

/**
 * The membership fields, shared by the home join form and the popup so the two
 * can never drift apart. `id` keeps the class datalist unique when both are in
 * the page at once.
 */
export default function JoinFields({ id }: { id: string }) {
  const classList = `${id}-classes`;
  return (
    <div className="join-fields">
      <input required name="name" placeholder="പേര് *" aria-label="പേര്" />
      <input name="unit" placeholder="യൂണിറ്റ്" aria-label="യൂണിറ്റ്" />
      <input required name="place" placeholder="സ്ഥലം *" aria-label="സ്ഥലം" />
      {/* Optional: someone living outside Kerala has no district to pick. */}
      <select className="fld-half" name="district" defaultValue="" aria-label="ജില്ല">
        <option value="">ജില്ല</option>
        {KERALA_DISTRICTS.map((d) => <option key={d}>{d}</option>)}
      </select>
      <input name="outOfKerala" placeholder="കേരളത്തിന് പുറത്ത് (സംസ്ഥാനം / രാജ്യം)" aria-label="കേരളത്തിന് പുറത്ത്" />
      <input
        required
        name="phone"
        type="tel"
        inputMode="numeric"
        placeholder="മൊബൈൽ നമ്പർ *"
        aria-label="മൊബൈൽ നമ്പർ"
        pattern="[0-9]{10}"
        maxLength={10}
        title="10 അക്ക മൊബൈൽ നമ്പർ നൽകുക"
        onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 10); }}
      />
      <input name="email" type="email" placeholder="ഇമെയിൽ" aria-label="ഇമെയിൽ" />
      {/* A datalist, not a select: the class can be picked or typed. */}
      <input required name="grade" list={classList} placeholder="ക്ലാസ് *" aria-label="ക്ലാസ്" autoComplete="off" />
      <datalist id={classList}>
        {CLASS_OPTIONS.map((c) => <option key={c} value={c} />)}
      </datalist>
    </div>
  );
}

/** Everything the membership form sends, read straight off the form. */
export function joinPayload(fd: FormData): Record<string, string> {
  const get = (k: string) => String(fd.get(k) ?? "");
  return {
    name: get("name"),
    unit: get("unit"),
    place: get("place"),
    district: get("district"),
    outOfKerala: get("outOfKerala"),
    phone: get("phone"),
    email: get("email"),
    grade: get("grade"),
  };
}
