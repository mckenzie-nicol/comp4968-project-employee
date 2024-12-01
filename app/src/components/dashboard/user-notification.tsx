import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import refreshTokens from "@/actions/refresh-token";

const API_URL = "https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com";

const fetchNotificationData = async () => {
  const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
  if (Date.now() > tokenExpiry) {
    await refreshTokens();
  }
  const accessToken = sessionStorage.getItem("accessToken") || "";
  try {
    const userId = sessionStorage.getItem("userId");
    const response = await fetch(`${API_URL}/test/notification/${userId}`, {
      method: "GET",
      headers: {
        Authorization: accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching notification data:", error);
    return [];
  }
};

const clearNotification = async () => {
  const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
  if (Date.now() > tokenExpiry) {
    await refreshTokens();
  }
  const accessToken = sessionStorage.getItem("accessToken") || "";
  try {
    const userId = sessionStorage.getItem("userId");
    const response = await fetch(`${API_URL}/test/notification/${userId}`, {
      method: "POST",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ read: true }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error clearing notification:", error);
  }
};

function utcToLocalPreserveTime(utcString: string) {
  // Parse the UTC string into a Date object
  const utcDate = new Date(utcString);

  // Extract the UTC time parts
  const year = utcDate.getUTCFullYear();
  const month = utcDate.getUTCMonth();
  const date = utcDate.getUTCDate();
  const hours = utcDate.getUTCHours();
  const minutes = utcDate.getUTCMinutes();
  const seconds = utcDate.getUTCSeconds();
  const milliseconds = utcDate.getUTCMilliseconds();

  // Create a new Date object in the local time zone with the same time
  return new Date(year, month, date, hours, minutes, seconds, milliseconds);
}

type Notification = {
  id: string;
  user_id: string;
  type: string;
  start_date_of_the_week: string;
  project_id: string | null;
  read: boolean;
  created_at: string;
};

type UserNotificationProps = {
  navigateToTimesheets: (start_date_of_the_week: Date) => void;
};

function UserNotification({ navigateToTimesheets }: UserNotificationProps) {
  const [notifications, setNotifications] = useState<Notification[] | null>(
    null
  );
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    async function fetchNotifications() {
      const notificationsData = await fetchNotificationData();
      setNotifications(notificationsData);
    }

    fetchNotifications();
  }, []);

  const handleNotificationWorker = async () => {
    await clearNotification();
    const localDate = utcToLocalPreserveTime(
      notifications![0].start_date_of_the_week
    );
    navigateToTimesheets(localDate);
  };

  const handleNotificationManager = async () => {
    await clearNotification();
  };

  console.log(notifications);

  return (
    <>
      {notifications && notifications.length > 0 && (
        <Alert className="w-full">
          <AlertTitle className="font-bold">
            <div className="flex items-center gap-2">
              <TriangleAlert className="text-yellow-400" />
              Timesheet Notification
            </div>
          </AlertTitle>
          <AlertDescription>
            <p>
              {`You have ${notifications.length} new timesheet ${
                notifications.length === 1 ? "update" : "updates"
              }. `}
              {role === "worker" ? (
                <span
                  className="inline-flex cursor-pointer items-center gap-1 font-medium hover:underline"
                  onClick={() => handleNotificationWorker()}
                >
                  Check now
                  <MoveRight />
                </span>
              ) : (
                <Link
                  to="/approve-timesheets"
                  className="inline-flex items-center gap-1 font-medium hover:underline"
                  state={{
                    projectId: notifications[0].project_id,
                    notificationDate: utcToLocalPreserveTime(
                      notifications[0].start_date_of_the_week
                    ),
                  }}
                  onClick={() => handleNotificationManager()}
                >
                  Check now
                  <MoveRight />
                </Link>
              )}
            </p>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}

export { UserNotification };
