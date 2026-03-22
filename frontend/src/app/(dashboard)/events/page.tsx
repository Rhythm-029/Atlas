"use client";

import { useState, FormEvent } from "react";
import { createEvent, ClubEnum, EventCreate, polishText } from "@/lib/api";

const CLUBS: ClubEnum[] = [
  "Atlas INC",
  "AGILE",
  "Student Council",
  "Highflyers",
  "Futurepreneurs",
  "Finterest",
  "Stage",
  "NSS"
];

export default function EventCreationPage() {
  const [formData, setFormData] = useState<EventCreate>({
    name: "",
    club_name: "Atlas INC",
    description: "",
    event_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const handlePolish = async () => {
    if (!formData.description.trim()) return;
    setIsPolishing(true);
    setMessage(null);
    try {
      const result = await polishText({ text: formData.description });
      setFormData(p => ({ ...p, description: result.polished_text }));
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to polish text." });
    } finally {
      setIsPolishing(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const selectedDate = new Date(formData.event_date);
      await createEvent({
        ...formData,
        event_date: selectedDate.toISOString(),
      });
      setMessage({ type: "success", text: "Event successfully submitted for approval!" });
      setFormData({ name: "", club_name: "Atlas INC", description: "", event_date: "" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to submit event." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Event Manager</h1>
        <p className="text-slate-600 mt-0.5">
          Submit new club event requests for faculty approval.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-800">New Event Request</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Event Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="E.g., Tech Symposium 2026"
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Associated Club</label>
              <select 
                required
                value={formData.club_name}
                onChange={(e) => setFormData(p => ({ ...p, club_name: e.target.value as ClubEnum }))}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors cursor-pointer"
              >
                {CLUBS.map(club => (
                  <option key={club} value={club}>{club}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Event Description</label>
            <div className="relative">
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                placeholder="Give a detailed description of the event..."
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors resize-y"
              />
              <button 
                type="button" 
                onClick={handlePolish}
                disabled={isPolishing || !formData.description.trim()}
                className="absolute bottom-4 right-4 bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 rounded-md px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="AI Polish"
              >
                <svg className={`w-4 h-4 ${isPolishing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                {isPolishing ? "Polishing..." : "AI Polish"}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Date & Time</label>
            <input 
              required
              type="datetime-local" 
              value={formData.event_date}
              onChange={(e) => setFormData(p => ({ ...p, event_date: e.target.value }))}
              className="w-full md:w-1/2 block bg-white border border-slate-300 text-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
            />
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm font-medium border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {message.text}
            </div>
          )}

          <div className="pt-2 flex items-center justify-end border-t border-slate-100">
            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
