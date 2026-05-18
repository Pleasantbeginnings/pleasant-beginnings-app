import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  useListVolunteers, getListVolunteersQueryKey,
  useListContacts, getListContactsQueryKey,
  useListEvents, getListEventsQueryKey, useCreateEvent, useDeleteEvent,
  useListPrograms, getListProgramsQueryKey, useCreateProgram,
  useGetSummaryStats, getGetSummaryStatsQueryKey,
  useListNewsletterSubscribers, getListNewsletterSubscribersQueryKey,
  useListSuccessStories, getListSuccessStoriesQueryKey, useCreateSuccessStory, useDeleteSuccessStory,
  useListGallery, getListGalleryQueryKey, useCreateGalleryImage, useDeleteGalleryImage,
  useListEventRsvps, getListEventRsvpsQueryKey,
} from "@workspace/api-client-react";
import { useUpload } from "@workspace/object-storage-web";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Users, Calendar, FolderOpen, Mail, Trash2, ImagePlus, Loader2, Images, ClipboardList, BarChart2 } from "lucide-react";
import { AdminAnalytics } from "@/components/admin-analytics";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "PBI2024") {
      sessionStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid PIN");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    setPin("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary font-sans">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin">Enter PIN</Label>
                <Input 
                  id="pin" 
                  type="password" 
                  value={pin} 
                  onChange={(e) => setPin(e.target.value)} 
                  placeholder="PIN"
                  required
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <Button type="submit" className="w-full">Access Dashboard</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-primary tracking-tight">
              Pleasant Beginnings Inc.
            </span>
            <Badge variant="outline" className="hidden md:inline-flex">Admin Dashboard</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground hidden sm:block">
              View Site
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <SummaryStats />

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-9">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 border rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden">
            <TabsContent value="analytics" className="m-0 p-0">
              <AdminAnalytics />
            </TabsContent>
            <TabsContent value="volunteers" className="m-0 p-0">
              <VolunteersTable />
            </TabsContent>
            <TabsContent value="contacts" className="m-0 p-0">
              <ContactsTable />
            </TabsContent>
            <TabsContent value="events" className="m-0 p-0">
              <EventsTable />
            </TabsContent>
            <TabsContent value="rsvps" className="m-0 p-0">
              <RsvpsTable />
            </TabsContent>
            <TabsContent value="gallery" className="m-0 p-0">
              <GalleryManager />
            </TabsContent>
            <TabsContent value="newsletter" className="m-0 p-0">
              <NewsletterTable />
            </TabsContent>
            <TabsContent value="programs" className="m-0 p-0">
              <ProgramsTable />
            </TabsContent>
            <TabsContent value="stories" className="m-0 p-0">
              <StoriesTable />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}

function RsvpsTable() {
  const { data: events, isLoading: eventsLoading } = useListEvents({
    query: { queryKey: getListEventsQueryKey() },
  });
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const upcomingEvents = events?.filter((e) => new Date(e.eventDate) >= new Date()) ?? [];

  const { data: rsvps, isLoading: rsvpsLoading } = useListEventRsvps(
    selectedEventId ?? 0,
    { query: { queryKey: getListEventRsvpsQueryKey(selectedEventId ?? 0), enabled: selectedEventId !== null } }
  );

  const totalGuests = rsvps?.reduce((sum, r) => sum + r.guestCount, 0) ?? 0;

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-4 p-4 border-b">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold">Event RSVPs</h3>
        </div>
        <select
          className="text-sm border rounded-md px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          value={selectedEventId ?? ""}
          onChange={(e) => setSelectedEventId(e.target.value ? parseInt(e.target.value, 10) : null)}
        >
          <option value="">— Select an event —</option>
          {upcomingEvents.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.title} ({format(new Date(ev.eventDate), "MMM d, yyyy")})
            </option>
          ))}
          {events
            ?.filter((e) => new Date(e.eventDate) < new Date())
            .map((ev) => (
              <option key={ev.id} value={ev.id}>
                [Past] {ev.title} ({format(new Date(ev.eventDate), "MMM d, yyyy")})
              </option>
            ))}
        </select>
        {rsvps && (
          <span className="text-sm text-muted-foreground ml-auto">
            {rsvps.length} {rsvps.length === 1 ? "RSVP" : "RSVPs"} · {totalGuests} total guests
          </span>
        )}
      </div>

      {!selectedEventId ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-2">
          <ClipboardList className="w-10 h-10 opacity-30" />
          <p className="text-sm">Select an event above to view its RSVPs.</p>
        </div>
      ) : eventsLoading || rsvpsLoading ? (
        <div className="p-6 space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      ) : !rsvps || rsvps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-2">
          <Users className="w-10 h-10 opacity-30" />
          <p className="text-sm">No RSVPs yet for this event.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">#</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Guests</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rsvps.map((rsvp, i) => (
                <tr key={rsvp.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{rsvp.firstName} {rsvp.lastName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{rsvp.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{rsvp.guestCount} {rsvp.guestCount === 1 ? "guest" : "guests"}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{format(new Date(rsvp.createdAt), "MMM d, yyyy h:mm a")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SummaryStats() {
  const { data: stats, isLoading: statsLoading } = useGetSummaryStats({
    query: { queryKey: getGetSummaryStatsQueryKey() }
  });

  const { data: subscribers, isLoading: subscribersLoading } = useListNewsletterSubscribers({
    query: { queryKey: getListNewsletterSubscribersQueryKey() }
  });

  const { data: stories, isLoading: storiesLoading } = useListSuccessStories({
    query: { queryKey: getListSuccessStoriesQueryKey() }
  });

  if (statsLoading || subscribersLoading || storiesLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-sans">Total Volunteers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalVolunteers || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-sans">Total Contacts</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalContacts || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-sans">Upcoming Events</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.upcomingEvents || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-sans">Active Programs</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.activePrograms || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-sans">Newsletter Subscribers</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subscribers?.length || 0}</div>
        </CardContent>
      </Card>
    </div>
  );
}

function VolunteersTable() {
  const { data: volunteers, isLoading } = useListVolunteers({
    query: { queryKey: getListVolunteersQueryKey() }
  });

  if (isLoading) return <TableSkeleton columns={6} />;

  if (!volunteers || volunteers.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No volunteers yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Interests</th>
            <th className="px-4 py-3 font-medium">Availability</th>
            <th className="px-4 py-3 font-medium">Date Submitted</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {volunteers.map((vol) => (
            <tr key={vol.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{vol.firstName} {vol.lastName}</td>
              <td className="px-4 py-3">{vol.email}</td>
              <td className="px-4 py-3">{vol.phone || "-"}</td>
              <td className="px-4 py-3 truncate max-w-[200px]" title={vol.interests || ""}>{vol.interests || "-"}</td>
              <td className="px-4 py-3 truncate max-w-[150px]">{vol.availability || "-"}</td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                {vol.createdAt ? format(new Date(vol.createdAt), "MMM d, yyyy 'at' h:mm a") : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContactsTable() {
  const { data: contacts, isLoading } = useListContacts({
    query: { queryKey: getListContactsQueryKey() }
  });

  if (isLoading) return <TableSkeleton columns={6} />;

  if (!contacts || contacts.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No contacts yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Program Interest</th>
            <th className="px-4 py-3 font-medium">Message</th>
            <th className="px-4 py-3 font-medium">Date Submitted</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {contacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{contact.firstName} {contact.lastName}</td>
              <td className="px-4 py-3">{contact.email}</td>
              <td className="px-4 py-3">{contact.phone || "-"}</td>
              <td className="px-4 py-3">{contact.programInterest || "-"}</td>
              <td className="px-4 py-3 max-w-[300px] truncate" title={contact.message}>
                {contact.message.length > 80 ? contact.message.substring(0, 80) + "..." : contact.message}
              </td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                {contact.createdAt ? format(new Date(contact.createdAt), "MMM d, yyyy 'at' h:mm a") : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EventsTable() {
  const { data: events, isLoading } = useListEvents({
    query: { queryKey: getListEventsQueryKey() }
  });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const createEventMutation = useCreateEvent();
  const deleteEventMutation = useDeleteEvent();

  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createEventMutation.mutate(
      {
        data: {
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          location: formData.get("location") as string,
          eventDate: formData.get("eventDate") as string,
          registrationUrl: (formData.get("registrationUrl") as string) || undefined,
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetSummaryStatsQueryKey() });
          setOpen(false);
          toast({ title: "Event created successfully" });
        },
        onError: () => {
          toast({ title: "Failed to create event", variant: "destructive" });
        }
      }
    );
  };

  const handleDeleteEvent = (id: number) => {
    setDeletingId(id);
    deleteEventMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetSummaryStatsQueryKey() });
          toast({ title: "Event deleted" });
          setDeletingId(null);
        },
        onError: () => {
          toast({ title: "Failed to delete event", variant: "destructive" });
          setDeletingId(null);
        }
      }
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold">Events Management</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Add Event</Button>
          </DialogTrigger>
          <DialogContent className="font-sans">
            <DialogHeader>
              <DialogTitle className="font-sans">Create New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateEvent} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventDate">Date & Time</Label>
                <Input id="eventDate" name="eventDate" type="datetime-local" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationUrl">Registration URL (Optional)</Label>
                <Input id="registrationUrl" name="registrationUrl" type="url" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createEventMutation.isPending}>
                  {createEventMutation.isPending ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <TableSkeleton columns={5} />
      ) : !events || events.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">No events yet. Use "Add Event" to create one.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Date & Time</th>
                <th className="px-4 py-3 font-medium">Registration</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{event.title}</td>
                  <td className="px-4 py-3">{event.location}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {format(new Date(event.eventDate), "MMM d, yyyy 'at' h:mm a")}
                  </td>
                  <td className="px-4 py-3">
                    {event.registrationUrl ? (
                      <a href={event.registrationUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={deletingId === event.id}
                      onClick={() => {
                        if (confirm(`Delete "${event.title}"? This cannot be undone.`)) {
                          handleDeleteEvent(event.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ProgramsTable() {
  const { data: programs, isLoading } = useListPrograms({
    query: { queryKey: getListProgramsQueryKey() }
  });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const createProgramMutation = useCreateProgram();

  const handleCreateProgram = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createProgramMutation.mutate(
      {
        data: {
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          category: formData.get("category") as string,
          active: formData.get("active") === "on",
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProgramsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetSummaryStatsQueryKey() });
          setOpen(false);
          toast({ title: "Program created successfully" });
        },
        onError: () => {
          toast({ title: "Failed to create program", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold">Programs Management</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Add Program</Button>
          </DialogTrigger>
          <DialogContent className="font-sans">
            <DialogHeader>
              <DialogTitle className="font-sans">Create New Program</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProgram} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="active" name="active" defaultChecked />
                <Label htmlFor="active" className="cursor-pointer">Active Program</Label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createProgramMutation.isPending}>
                  {createProgramMutation.isPending ? "Creating..." : "Create Program"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <TableSkeleton columns={4} />
      ) : !programs || programs.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">No programs yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {programs.map((program) => (
                <tr key={program.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{program.name}</td>
                  <td className="px-4 py-3">{program.category}</td>
                  <td className="px-4 py-3 max-w-[300px] truncate" title={program.description}>
                    {program.description.length > 80 ? program.description.substring(0, 80) + "..." : program.description}
                  </td>
                  <td className="px-4 py-3">
                    {program.active ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 border-transparent">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function GalleryManager() {
  const { data: images, isLoading } = useListGallery({
    query: { queryKey: getListGalleryQueryKey() }
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("General");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const createImageMutation = useCreateGalleryImage();
  const deleteImageMutation = useDeleteGalleryImage();

  const { uploadFile, isUploading, progress } = useUpload({
    onError: () => toast({ title: "Upload failed", variant: "destructive" }),
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const result = await uploadFile(file);
    if (!result) return;

    createImageMutation.mutate(
      { data: { objectPath: result.objectPath, caption, category } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
          toast({ title: "Photo added to gallery" });
          setCaption("");
          setCategory("General");
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
        onError: () => toast({ title: "Failed to save photo", variant: "destructive" }),
      }
    );
  };

  const handleDelete = (id: number, caption: string) => {
    if (!confirm(`Remove "${caption || "this photo"}" from the gallery?`)) return;
    setDeletingId(id);
    deleteImageMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
          toast({ title: "Photo removed" });
          setDeletingId(null);
        },
        onError: () => {
          toast({ title: "Failed to remove photo", variant: "destructive" });
          setDeletingId(null);
        },
      }
    );
  };

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <Images className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold">Gallery Management</h3>
        </div>

        <form onSubmit={handleUpload} className="bg-muted/30 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Upload New Photo</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <Label htmlFor="photo-file" className="text-xs mb-1 block">Photo (JPG, PNG, WebP)</Label>
              <Input
                id="photo-file"
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                required
                className="text-xs"
              />
            </div>
            <div>
              <Label htmlFor="photo-caption" className="text-xs mb-1 block">Caption</Label>
              <Input
                id="photo-caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
              />
            </div>
            <div>
              <Label htmlFor="photo-category" className="text-xs mb-1 block">Category</Label>
              <select
                id="photo-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>General</option>
                <option>Programs</option>
                <option>Events</option>
                <option>Community</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" size="sm" disabled={isUploading || createImageMutation.isPending}>
              {isUploading || createImageMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isUploading ? `Uploading ${progress}%` : "Saving..."}</>
              ) : (
                <><ImagePlus className="w-4 h-4 mr-2" />Upload Photo</>
              )}
            </Button>
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Loading gallery...</div>
      ) : !images || images.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">No photos yet. Upload your first photo above.</div>
      ) : (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border aspect-square bg-muted">
              <img
                src={`/api/storage${img.objectPath}`}
                alt={img.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className="self-end w-8 h-8 p-0"
                  disabled={deletingId === img.id}
                  onClick={() => handleDelete(img.id, img.caption)}
                >
                  {deletingId === img.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                </Button>
                <div>
                  <p className="text-white text-xs font-medium leading-tight truncate">{img.caption || "No caption"}</p>
                  <p className="text-white/60 text-xs">{img.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="p-4 space-y-4 w-full">
      <div className="flex items-center space-x-4 border-b pb-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

function NewsletterTable() {
  const { data: subscribers, isLoading } = useListNewsletterSubscribers({
    query: { queryKey: getListNewsletterSubscribersQueryKey() }
  });

  if (isLoading) return <TableSkeleton columns={4} />;

  if (!subscribers || subscribers.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No subscribers yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">First Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Date Subscribed</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {subscribers.map((sub) => (
            <tr key={sub.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{sub.firstName || "-"}</td>
              <td className="px-4 py-3">{sub.email}</td>
              <td className="px-4 py-3">
                {sub.active ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 border-transparent">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                {sub.createdAt ? format(new Date(sub.createdAt), "MMM d, yyyy 'at' h:mm a") : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StoriesTable() {
  const { data: stories, isLoading } = useListSuccessStories({
    query: { queryKey: getListSuccessStoriesQueryKey() }
  });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const createStoryMutation = useCreateSuccessStory();
  const deleteStoryMutation = useDeleteSuccessStory();

  const handleCreateStory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createStoryMutation.mutate(
      {
        data: {
          name: formData.get("name") as string,
          role: (formData.get("role") as string) || undefined,
          quote: formData.get("quote") as string,
          featured: formData.get("featured") === "on",
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSuccessStoriesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetSummaryStatsQueryKey() });
          setOpen(false);
          toast({ title: "Story created successfully" });
        },
        onError: () => {
          toast({ title: "Failed to create story", variant: "destructive" });
        }
      }
    );
  };

  const handleDeleteStory = (id: number) => {
    if (confirm("Are you sure you want to delete this story?")) {
      deleteStoryMutation.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListSuccessStoriesQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetSummaryStatsQueryKey() });
            toast({ title: "Story deleted successfully" });
          },
          onError: () => {
            toast({ title: "Failed to delete story", variant: "destructive" });
          }
        }
      );
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold">Stories Management</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Add Story</Button>
          </DialogTrigger>
          <DialogContent className="font-sans">
            <DialogHeader>
              <DialogTitle className="font-sans">Create New Story</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateStory} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role (Optional)</Label>
                <Input id="role" name="role" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quote">Quote</Label>
                <Textarea id="quote" name="quote" required />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="featured" name="featured" />
                <Label htmlFor="featured" className="cursor-pointer">Featured Story</Label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createStoryMutation.isPending}>
                  {createStoryMutation.isPending ? "Creating..." : "Create Story"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <TableSkeleton columns={6} />
      ) : !stories || stories.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">No stories yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Quote</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Date Added</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stories.map((story) => (
                <tr key={story.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{story.name}</td>
                  <td className="px-4 py-3">{story.role || "-"}</td>
                  <td className="px-4 py-3 max-w-[300px] truncate" title={story.quote}>
                    {story.quote.length > 80 ? story.quote.substring(0, 80) + "..." : story.quote}
                  </td>
                  <td className="px-4 py-3">
                    {story.featured ? (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300 border-transparent">Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {story.createdAt ? format(new Date(story.createdAt), "MMM d, yyyy 'at' h:mm a") : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteStory(story.id)}
                      disabled={deleteStoryMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}