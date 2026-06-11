"use client";

import { useState } from "react";
import { upsertProfile } from "@/actions/profile";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";

interface ProfileFormProps {
  initial: {
    bio: string;
    skills: string[];
    hourlyRate: number | null;
    country: string;
    portfolio: string[];
  };
}

export default function ProfileForm({ initial }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState(initial.bio);
  const [skills, setSkills] = useState<string[]>(initial.skills);
  const [skillInput, setSkillInput] = useState("");
  const [hourlyRate, setHourlyRate] = useState(
    initial.hourlyRate?.toString() ?? "",
  );
  const [country, setCountry] = useState(initial.country);
  const [portfolio, setPortfolio] = useState<string[]>(initial.portfolio);
  const [portfolioInput, setPortfolioInput] = useState("");

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) =>
    setSkills((prev) => prev.filter((s) => s !== skill));

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const addPortfolio = () => {
    const trimmed = portfolioInput.trim();
    if (!trimmed || portfolio.includes(trimmed)) return;
    try {
      new URL(trimmed);
    } catch {
      toast.error("Ingresa una URL válida");
      return;
    }
    setPortfolio((prev) => [...prev, trimmed]);
    setPortfolioInput("");
  };

  const removePortfolio = (url: string) =>
    setPortfolio((prev) => prev.filter((p) => p !== url));

  const handlePortfolioKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPortfolio();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await upsertProfile({
        bio,
        skills,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        country,
        portfolio,
      });
      toast.success("Perfil actualizado!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error actualizando perfil");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1.5px solid #e0e0e0",
    fontSize: 14,
    outline: "none",
    color: "#1a1a2e",
    width: "100%",
    boxSizing: "border-box" as const,
    fontFamily: "inherit",
  };

  const labelStyle = {
    fontSize: 14,
    fontWeight: 600 as const,
    color: "#1a1a2e",
    marginBottom: 6,
    display: "block" as const,
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 22 }}
    >
      {/* Bio */}
      <div>
        <label style={labelStyle}>Bio</label>
        <textarea
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Cuéntale a los clientes sobre ti, tu experiencia y lo que te hace destacar..."
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {/* Hourly Rate + Country */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle}>Hourly Rate (USD)</label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="e.g. 35"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. Honduras"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        <label style={labelStyle}>Skills</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            placeholder="e.g. React, Node.js..."
            style={{ ...inputStyle, width: "auto", flex: 1 }}
          />
          <button
            type="button"
            onClick={addSkill}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: "#6B2FDB",
              color: "white",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Plus size={16} /> Add
          </button>
        </div>
        {skills.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {skills.map((skill) => (
              <span
                key={skill}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 12px",
                  background: "#f3eeff",
                  color: "#6B2FDB",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {skill}
                <X
                  size={13}
                  style={{ cursor: "pointer", opacity: 0.7 }}
                  onClick={() => removeSkill(skill)}
                />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Portfolio */}
      <div>
        <label style={labelStyle}>Portfolio Links</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input
            type="url"
            value={portfolioInput}
            onChange={(e) => setPortfolioInput(e.target.value)}
            onKeyDown={handlePortfolioKeyDown}
            placeholder="#"
            style={{ ...inputStyle, width: "auto", flex: 1 }}
          />
          <button
            type="button"
            onClick={addPortfolio}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: "#6B2FDB",
              color: "white",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Plus size={16} /> Add
          </button>
        </div>
        {portfolio.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {portfolio.map((url) => (
              <div
                key={url}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  background: "#f9f6ff",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              >
                <span
                  style={{
                    color: "#6B2FDB",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {url}
                </span>
                <X
                  size={14}
                  style={{
                    cursor: "pointer",
                    color: "#bbb",
                    flexShrink: 0,
                    marginLeft: 8,
                  }}
                  onClick={() => removePortfolio(url)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "12px 0",
          borderRadius: 8,
          border: "none",
          background: loading ? "#b39ddb" : "#6B2FDB",
          color: "white",
          fontWeight: 700,
          fontSize: 15,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}
      >
        {loading ? "Guardando..." : "Guardar Perfil"}
      </button>
    </form>
  );
}
