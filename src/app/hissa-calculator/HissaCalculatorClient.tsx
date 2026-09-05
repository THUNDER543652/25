/* app/page.tsx */
"use client";

import { useEffect, useMemo, useState } from "react";

type Child = {
  id: string;
  name: string;
  num: number;
  den: number;
  areaOverride: string;
};

type Owner = {
  id: string;
  name: string;
  num: number;
  den: number;
  children: Child[];
};

const MARLA_SQFT = 272.25;
const MARLA_PER_KANAL = 20;
const KANAL_SQFT = MARLA_SQFT * MARLA_PER_KANAL;

const uid = () => Math.random().toString(36).slice(2, 9);
const n4 = (v: number) => Number(v.toFixed(4));
const fmt4 = (v: number) => n4(v).toFixed(4);
const safeInt = (v: string, fallback = 1) => {
  const x = Math.max(1, Math.floor(Number(v) || fallback));
  return x;
};

function fractionValue(num: number, den: number) {
  return den > 0 ? num / den : 0;
}

function fractionText(num: number, den: number) {
  if (num === 0) return "0";
  if (den === 1) return `${num}`;
  return `${num}/${den}`;
}

function areaToKM(area: number) {
  const kanal = Math.floor(area / KANAL_SQFT);
  const marla = Math.floor((area - kanal * KANAL_SQFT) / MARLA_SQFT);
  const sqft = n4(area - kanal * KANAL_SQFT - marla * MARLA_SQFT);
  return { kanal, marla, sqft };
}

function initialOwners(): Owner[] {
  return [];
}


export default function Home() {
  const [kanal, setKanal] = useState("0");
  const [marla, setMarla] = useState("0");
  const [sqft, setSqft] = useState("0");
  const [owners, setOwners] = useState<Owner[]>(initialOwners);
  const [darkMode, setDarkMode] = useState(true);
  const [mobileTableExpanded, setMobileTableExpanded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("tw-theme");
    setDarkMode(saved !== "light");
    const onThemeChange = (event: Event) => {
      const next = (event as CustomEvent<"dark" | "light">).detail;
      setDarkMode(next !== "light");
    };
    window.addEventListener("tw-theme-change", onThemeChange);
    return () => window.removeEventListener("tw-theme-change", onThemeChange);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("tw-theme", darkMode ? "dark" : "light");
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    window.dispatchEvent(new CustomEvent("tw-theme-change", { detail: darkMode ? "dark" : "light" }));
  }, [darkMode]);

  const totalSqFt = useMemo(() => {
    const k = Number(kanal) || 0;
    const m = Number(marla) || 0;
    const s = Number(sqft) || 0;
    return n4(k * KANAL_SQFT + m * MARLA_SQFT + s);
  }, [kanal, marla, sqft]);

  const beneficiaries = useMemo(() => {
    const rows: {
      owner: Owner; child?: Child; name: string; fraction: number; area: number;
    }[] = [];

    for (const owner of owners) {
      const ownerShare = fractionValue(owner.num, owner.den);
      if (owner.children.length) {
        for (const child of owner.children) {
          const childRelative = fractionValue(child.num, child.den);
          const autoArea = n4(totalSqFt * ownerShare * childRelative);
          const area = child.areaOverride.trim() === "" ? autoArea : n4(Number(child.areaOverride) || 0);
          rows.push({
            owner,
            child,
            name: `${owner.name} > ${child.name}`,
            fraction: ownerShare * childRelative,
            area,
          });
        }
      } else {
        rows.push({
          owner,
          name: owner.name,
          fraction: ownerShare,
          area: totalSqFt * ownerShare,
        });
      }
    }
    return rows;
  }, [owners, totalSqFt]);

  const usedShare = beneficiaries.reduce((a, b) => a + b.fraction, 0);
  const usedArea = beneficiaries.reduce((a, b) => a + b.area, 0);
  const complete = Math.abs(usedShare - 1) < 0.00005 && Math.abs(usedArea - totalSqFt) < 0.05;

  function updateOwner(id: string, patch: Partial<Owner>) {
    setOwners(prev => prev.map(o => o.id === id ? { ...o, ...patch } : o));
  }

  function updateChild(ownerId: string, childId: string, patch: Partial<Child>) {
    setOwners(prev => prev.map(o => o.id !== ownerId ? o : {
      ...o, children: o.children.map(c => c.id === childId ? { ...c, ...patch } : c)
    }));
  }

  function addOwner() {
    const count = owners.length + 1;
    // Every newly-added owner makes the top-level ownership a complete 1/N split.
    setOwners(prev => [
      ...prev,
      { id: uid(), name: `Owner ${count}`, num: 1, den: count, children: [] }
    ].map(o => ({ ...o, num: 1, den: count })));
  }

  function deleteOwner(id: string) {
    if (owners.length <= 1) return;
    const next = owners.filter(o => o.id !== id);
    const count = next.length;
    setOwners(next.map(o => ({ ...o, num: 1, den: count })));
  }

  function addChild(ownerId: string) {
    setOwners(prev => prev.map(o => {
      if (o.id !== ownerId) return o;
      const count = o.children.length + 1;
      const children = [
        ...o.children,
        { id: uid(), name: `Child ${count}`, num: 1, den: count, areaOverride: "" }
      ];
      // Children are automatically split so their relative shares add up to exactly 1.
      return { ...o, children: children.map(c => ({ ...c, num: 1, den: count })) };
    }));
  }

  function deleteChild(ownerId: string, childId: string) {
    setOwners(prev => prev.map(o => {
      if (o.id !== ownerId) return o;
      const next = o.children.filter(c => c.id !== childId);
      if (!next.length) return { ...o, children: [] };
      const count = next.length;
      return { ...o, children: next.map(c => ({ ...c, num: 1, den: count })) };
    }));
  }

  function balanceOwners() {
    const count = owners.length;
    setOwners(prev => prev.map(o => ({ ...o, num: 1, den: count })));
  }

  function reset() {
    setKanal("0"); setMarla("0"); setSqft("0"); setOwners(initialOwners());
  }

  return (
    <div className="hissa-calculator" data-theme={darkMode ? "dark" : "light"}>
      <header className="topbar">
        <div>
          <div className="brand">Property Share Calculator</div>
          <div className="brandSub">Equal property division & hissa calculator</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <div className="topPill">1 Kanal = 20 Marla</div>
          <button
            className="themeToggle"
            onClick={() => setDarkMode(v => !v)}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} theme`}
            title={`Switch to ${darkMode ? "light" : "dark"} theme`}
          >
            {darkMode ? "☀ Light" : "☾ Dark"}
          </button>
        </div>
      </header>

      <section className="card calculatorCard">
        <div className="sectionTitle">Land Details</div>
        <div className="landGrid">
          <label>Kanals<input inputMode="decimal" value={kanal} onChange={e => setKanal(e.target.value)} /></label>
          <label>Marla<input inputMode="decimal" value={marla} onChange={e => setMarla(e.target.value)} /></label>
          <label>Sq Ft<input inputMode="decimal" value={sqft} onChange={e => setSqft(e.target.value)} /></label>
          <div className="totalBox">
            <span>Total Area</span>
            <strong>{fmt4(totalSqFt)} Sq Ft</strong>
          </div>
        </div>

        <div className="toolbar">
          <button onClick={balanceOwners}>Auto Fill Shares</button>
          <button onClick={addOwner}>+ Add Owner</button>
          <button className="ghost" onClick={reset}>Reset</button>
        </div>

        <div className="hint">
          Auto-fill keeps each level complete: 2 owners → <b>1/2 + 1/2 = 1</b>; 3 owners → <b>1/3 + 1/3 + 1/3 = 1</b>. Children are balanced the same way within their owner&apos;s share.
        </div>

        <div className="owners">
          {owners.map((owner, oi) => (
            <div className="ownerBox" key={owner.id}>
              <div className="ownerRow">
                <span className="rowLabel">Name</span>
                <input className="nameInput" value={owner.name} onChange={e => updateOwner(owner.id, { name: e.target.value })} />
                <span className="rowLabel">Num</span>
                <input className="smallInput" type="number" min="1" value={owner.num} onChange={e => updateOwner(owner.id, { num: safeInt(e.target.value) })} />
                <span className="rowLabel">Den</span>
                <input className="smallInput" type="number" min="1" value={owner.den} onChange={e => updateOwner(owner.id, { den: safeInt(e.target.value) })} />
                <button className="mini" onClick={() => addChild(owner.id)}>+ Child</button>
                <button className="mini danger" onClick={() => deleteOwner(owner.id)}>Delete</button>
              </div>

              {owner.children.map(child => (
                <div className="childRow" key={child.id}>
                  <span className="tree">↳</span>
                  <span className="rowLabel">Name</span>
                  <input className="nameInput" value={child.name} onChange={e => updateChild(owner.id, child.id, { name: e.target.value })} />
                  <span className="rowLabel">Num</span>
                  <input className="smallInput" type="number" min="1" value={child.num} onChange={e => updateChild(owner.id, child.id, { num: safeInt(e.target.value) })} />
                  <span className="rowLabel">Den</span>
                  <input className="smallInput" type="number" min="1" value={child.den} onChange={e => updateChild(owner.id, child.id, { den: safeInt(e.target.value) })} />
                  <button className="mini danger" onClick={() => deleteChild(owner.id, child.id)}>Delete</button>
                </div>
              ))}

              {owner.children.length > 0 && (
                <div className="ownerSummary">
                  Owner share: <b>{fractionText(owner.num, owner.den)}</b>
                  &nbsp;·&nbsp; Children: <b>1/{owner.children.length}</b> auto-balanced
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="statusGrid">
        <div className="statusCard">
          <div className="sectionTitle">Ownership Status</div>
          <div className={complete ? "statusGood" : "statusWarn"}>
            {complete ? "Complete" : "Check shares"}
            <span>({fmt4(usedShare)} / 1.0000)</span>
          </div>
        </div>
        <div className="statusCard">
          <div className="sectionTitle">Discrepancies</div>
          {complete ? <div className="muted">No discrepancies detected.</div> :
            <div className="warningText">
              Share total: {fmt4(usedShare)} · Area total: {fmt4(usedArea)} Sq Ft
            </div>}
        </div>
      </section>

      <section className="card results">
        <div className="resultsHead">
          <div>
            <div className="sectionTitle">Final Beneficiaries</div>
            <div className="subtle">All displayed values are limited to 4 decimal places.</div>
          </div>
          <div className="legend">1 Marla = 272.2500 Sq Ft</div>
        </div>

        <div className={`tableWrap mobile-results-table ${mobileTableExpanded ? "is-expanded" : "is-collapsed"}`}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Fraction</th>
                <th className="mobileOptionalCol">%</th>
                <th className="mobileOptionalCol">Area (editable)</th>
                <th>K</th>
                <th>M</th>
                <th>Sq Ft</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map((row, i) => {
                const km = areaToKM(row.area);
                const child = row.child;
                return (
                  <tr key={`${row.owner.id}-${child?.id ?? "owner"}`}>
                    <td>{row.name}</td>
                    <td className="fractionCell">{child ? fractionText(row.owner.num * child.num, row.owner.den * child.den) : fractionText(row.owner.num, row.owner.den)}</td>
                    <td className="mobileOptionalCol">{fmt4(row.fraction * 100)}%</td>
                    <td className="mobileOptionalCol">
                      {child ? (
                        <input
                          className="areaEdit"
                          inputMode="decimal"
                          value={child.areaOverride === "" ? fmt4(row.area) : child.areaOverride}
                          onChange={e => updateChild(row.owner.id, child.id, { areaOverride: e.target.value })}
                        />
                      ) : (
                        <span>{fmt4(row.area)}</span>
                      )}
                    </td>
                    <td>{km.kanal}</td>
                    <td>{km.marla}</td>
                    <td>{fmt4(km.sqft)}</td>
                  </tr>
                );
              })}
              {!beneficiaries.length && (
                <tr><td colSpan={7} className="empty">Add owners yourself to begin. Shares will auto-fill to complete 1.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          className="mobileTableToggle"
          onClick={() => setMobileTableExpanded(v => !v)}
          aria-expanded={mobileTableExpanded}
        >
          {mobileTableExpanded ? "⌃ Collapse details" : "⌄ Expand details"}
        </button>
      </section>

    </div>
  );
}
