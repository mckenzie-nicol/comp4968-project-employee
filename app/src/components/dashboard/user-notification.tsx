import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
        "Content-Type": "application/json",
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

type Notification = {
  id: string;
  user_id: string;
  type: string;
  read: boolean;
  created_at: string;
};

type UserNotificationProps = {
  navigateToTimesheets: () => void;
};

function UserNotification({ navigateToTimesheets }: UserNotificationProps) {
  const [notifications, setNotifications] = useState<Notification[] | null>(
    null
  );
  const navigate = useNavigate();
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
    navigateToTimesheets();
  };

  const handleNotificationManager = async () => {
    await clearNotification();
    navigate("/approve-timesheets");
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
            {`You have ${notifications.length} new timesheet ${
              notifications.length === 1 ? "update" : "updates"
            }`}
            {role === "worker" ? (
              <button onClick={() => handleNotificationWorker()}>
                Check now (worker)
              </button>
            ) : (
              <button onClick={() => handleNotificationManager()}>
                Check now (manager)
              </button>
            )}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}

export { UserNotification };
