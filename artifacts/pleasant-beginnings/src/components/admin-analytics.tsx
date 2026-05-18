import { useGetAnalyticsDashboard, getGetAnalyticsDashboardQueryKey } from "@workspace/api-client-react";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, Mail, CalendarCheck, BarChart2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Cell,
} from "recharts";

const NAVY = "#0D1B2A";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8C97A";
const SLATE = "#64748b";

function formatMonth(m: string) {
  const [year, month] = m.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-background rounded-xl border border-border/60 p-5 flex items-start gap-4">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: `${color}18`, border: `1px solid ${color}40` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-sm">
      {label && <p className="font-semibold text-foreground mb-1">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export function AdminAnalytics() {
  const { data, isLoading } = useGetAnalyticsDashboard({
    query: { queryKey: getGetAnalyticsDashboardQueryKey() },
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const totalRsvps = data.rsvpsByEvent.reduce((s, e) => s + e.rsvpCount, 0);
  const totalGuests = data.rsvpsByEvent.reduce((s, e) => s + e.totalGuests, 0);
  const totalVolunteers = data.signupsByMonth.reduce((s, m) => s + m.volunteers, 0);
  const totalContacts = data.signupsByMonth.reduce((s, m) => s + m.contacts, 0);
  const totalNewsletterSubs =
    data.newsletterByMonth.length > 0
      ? data.newsletterByMonth[data.newsletterByMonth.length - 1].cumulative
      : 0;

  const rsvpChartData = data.rsvpsByEvent.map((e) => ({
    name: e.eventTitle.length > 22 ? e.eventTitle.slice(0, 20) + "…" : e.eventTitle,
    fullName: e.eventTitle,
    date: format(parseISO(e.eventDate), "MMM d, yyyy"),
    RSVPs: e.rsvpCount,
    "Total Guests": e.totalGuests,
  }));

  const signupsChartData = data.signupsByMonth.map((m) => ({
    name: formatMonth(m.month),
    Volunteers: m.volunteers,
    "Help Requests": m.contacts,
  }));

  const newsletterChartData = data.newsletterByMonth.map((m) => ({
    name: formatMonth(m.month),
    "New Subscribers": m.subscribers,
    "Total Subscribers": m.cumulative,
  }));

  const hasRsvps = rsvpChartData.some((d) => d.RSVPs > 0);
  const hasSignups = signupsChartData.length > 0;
  const hasNewsletter = newsletterChartData.length > 0;

  return (
    <div className="p-6 space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={CalendarCheck} label="Total RSVPs" value={totalRsvps} sub={`${totalGuests} guests total`} color={GOLD} />
        <KpiCard icon={Users} label="Volunteers" value={totalVolunteers} sub="All-time sign-ups" color={NAVY} />
        <KpiCard icon={TrendingUp} label="Help Requests" value={totalContacts} sub="Contact form submissions" color="#16a34a" />
        <KpiCard icon={Mail} label="Newsletter" value={totalNewsletterSubs} sub="Active subscribers" color="#7c3aed" />
      </div>

      {/* RSVPs by Event */}
      <div className="bg-background rounded-xl border border-border/60 p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-4 h-4 text-secondary" />
          <h3 className="font-semibold text-foreground">RSVPs by Event</h3>
        </div>
        {!hasRsvps ? (
          <EmptyState message="No RSVPs recorded yet. RSVPs will appear here once attendees register for events." />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={rsvpChartData} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: SLATE }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 11, fill: SLATE }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="RSVPs" fill={GOLD} radius={[4, 4, 0, 0]}>
                {rsvpChartData.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? GOLD : GOLD_LIGHT} />
                ))}
              </Bar>
              <Bar dataKey="Total Guests" fill={NAVY} radius={[4, 4, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Monthly Signups */}
        <div className="bg-background rounded-xl border border-border/60 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-secondary" />
            <h3 className="font-semibold text-foreground">Monthly Community Signups</h3>
          </div>
          {!hasSignups ? (
            <EmptyState message="Volunteer and contact data will appear here month by month." />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={signupsChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: SLATE }} />
                <YAxis tick={{ fontSize: 11, fill: SLATE }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Volunteers" fill={NAVY} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Help Requests" fill={GOLD} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Newsletter Growth */}
        <div className="bg-background rounded-xl border border-border/60 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-secondary" />
            <h3 className="font-semibold text-foreground">Newsletter Subscriber Growth</h3>
          </div>
          {!hasNewsletter ? (
            <EmptyState message="Newsletter subscriber growth will appear here once people subscribe." />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={newsletterChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="navyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={NAVY} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={NAVY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: SLATE }} />
                <YAxis tick={{ fontSize: 11, fill: SLATE }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="Total Subscribers"
                  stroke={NAVY}
                  strokeWidth={2}
                  fill="url(#navyGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="New Subscribers"
                  stroke={GOLD}
                  strokeWidth={2}
                  fill="url(#goldGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-center gap-2">
      <BarChart2 className="w-8 h-8 text-muted-foreground/30" />
      <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
    </div>
  );
}
