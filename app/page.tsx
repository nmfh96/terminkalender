import { AppointmentForm } from '@/components/AppointmentForm';
import { supabase } from '../lib/supabaseClient';
import { ModeToggle } from '@/components/theme-toggle';
import {
    Calendar,
    CalendarCurrentDate,
    CalendarDayView,
    CalendarMonthView,
    CalendarNextTrigger,
    CalendarPrevTrigger,
    CalendarTodayTrigger,
    CalendarViewTrigger,
    CalendarWeekView,
    CalendarYearView,
} from '@/components/ui/full-calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default async function Page() {
    // 📥 1. Termine aus Supabase holen

    console.log('👉 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('👉 Supabase Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);


    const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
    id,
    start,
    end,
    title,
    notes
  `);



    if (error) {
        console.error('Fehler beim Laden der Termine:', error.message);
        return <div>Fehler beim Laden der Termine: {error.message}</div>;
    }

    // 🧠 2. Events für Kalender aufbereiten
    const events = appointments.map((appt) => ({
        id: appt.id,
        title: appt.title || 'Unbenannter Termin',
        start: new Date(appt.start),
        end: new Date(appt.end),
        notes: appt.notes,
        color: '#999999', // Standardfarbe, weil category nicht gesetzt
    }));

    console.log('Geladene Termine:', appointments);


    return (
        <Calendar events={events}>
            <div className="h-dvh p-14 flex flex-col">
                <div className="flex px-6 items-center gap-2 mb-6">
                    <CalendarViewTrigger className="aria-[current=true]:bg-accent" view="day">Day</CalendarViewTrigger>
                    <CalendarViewTrigger className="aria-[current=true]:bg-accent" view="week">Week</CalendarViewTrigger>
                    <CalendarViewTrigger className="aria-[current=true]:bg-accent" view="month">Month</CalendarViewTrigger>
                    <CalendarViewTrigger className="aria-[current=true]:bg-accent" view="year">Year</CalendarViewTrigger>

                    <span className="flex-1" />
                    <div className="p-6">
                        <AppointmentForm/>
                    </div>
                    <CalendarCurrentDate/>
                    <CalendarPrevTrigger><ChevronLeft size={20} /></CalendarPrevTrigger>
                    <CalendarTodayTrigger>Today</CalendarTodayTrigger>
                    <CalendarNextTrigger><ChevronRight size={20} /></CalendarNextTrigger>
                    <ModeToggle />
                </div>

                <div className="flex-1 px-6 overflow-hidden">
                    <CalendarDayView />
                    <CalendarWeekView />
                    <CalendarMonthView />
                    <CalendarYearView />
                </div>
            </div>
        </Calendar>
    );
}

