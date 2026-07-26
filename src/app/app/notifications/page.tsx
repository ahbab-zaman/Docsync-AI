import { getNotifications, getActivity } from "@/server/actions/notifications";
import NotificationList from "@/components/notifications/NotificationList";
import ActivityList from "@/components/notifications/ActivityList";

export default async function NotificationsPage() {
  const [{ notifications }, { activity }] = await Promise.all([
    getNotifications(),
    getActivity(),
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notifications & Activity</h1>
        <p className="text-sm text-text-secondary mt-1">
          Stay up to date with what is happening in your workspaces.
        </p>
      </div>

      <NotificationList initialNotifications={notifications} />
      <ActivityList activity={activity} />
    </div>
  );
}
