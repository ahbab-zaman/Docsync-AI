import { getNotifications, getActivity } from "@/server/actions/notifications";
import NotificationList from "@/components/notifications/NotificationList";
import ActivityList from "@/components/notifications/ActivityList";

export default async function NotificationsPage() {
  const [{ notifications }, { activity }] = await Promise.all([
    getNotifications(),
    getActivity(),
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Notifications & Activity</h1>
        <p className="text-sm text-text-secondary mt-1">
          Stay up to date with what is happening in your workspaces.
        </p>
      </div>

      <NotificationList initialNotifications={notifications} />
      <div className="border-t border-border pt-6 sm:pt-8">
        <ActivityList activity={activity} />
      </div>
    </div>
  );
}
