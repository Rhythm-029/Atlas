"use client";

import { useEffect, useState } from "react";
import { getEvents, updateEventStatus, EventResponse, EventStatus } from "@/lib/api";

export default function ApprovalsDashboard() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<EventStatus>("PENDING");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents(activeTab);
      setEvents(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const handleStatusChange = async (id: number, newStatus: EventStatus) => {
    try {
      await updateEventStatus(id, newStatus);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err: any) {
      alert("Error: " + (err.message || "Failed to update status"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Event Approvals</h1>
          <p className="text-slate-600 mt-0.5">
            Review and manage all student club event requests.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          {(["PENDING", "APPROVED", "REJECTED"] as EventStatus[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab 
                  ? "border-indigo-600 text-indigo-600 bg-white" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()} Events
            </button>
          ))}
        </div>

        <div className="p-6">
          {error ? (
            <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-lg">
              {error}
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800">No {activeTab.toLowerCase()} events</h3>
              <p className="text-slate-500 mt-1 max-w-sm">There are currently no events matching this status.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide mb-2 border border-indigo-100">
                        {event.club_name}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{event.name}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-slate-800 font-medium text-sm">
                        {new Date(event.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {new Date(event.event_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {event.description}
                  </p>

                  {activeTab === "PENDING" && (
                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                      <button 
                        onClick={() => handleStatusChange(event.id, "APPROVED")}
                        className="flex-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
                      >
                        Approve Request
                      </button>
                      <button 
                        onClick={() => handleStatusChange(event.id, "REJECTED")}
                        className="flex-1 bg-white hover:bg-red-50 text-red-700 border border-red-200 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
