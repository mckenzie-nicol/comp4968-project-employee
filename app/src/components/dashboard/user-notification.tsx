import { useEffect, useState } from "react";
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
    // console.log("Project Data Response:", data); // Log the response to verify the data

    // // Assuming backend processes progress dynamically; otherwise, calculate based on start_date and end_date
    // const mappedProjects = data.data.map((project: any) => ({
    //   id: project.id,
    //   name: project.name,
    //   estimated_hours: project.estimated_hours,
    //   approved_hours: Math.round(project.approved_hours * 100) / 100, // Round to 2 decimal places
    //   start_date: project.start_date,
    //   end_date: project.end_date,
    //   progress: Math.min(
    //     100,
    //     Math.round((project.approved_hours / project.estimated_hours) * 100)
    //   ),
    // }));

    // console.log("Mapped Projects:", mappedProjects); // Log the mapped projects to verify
    // return mappedProjects;
    return data.data;
  } catch (error) {
    console.error("Error fetching project data:", error);
    return [];
  }
};

type Notification = {
  id: string;
  user_id: string;
  type: string;
  read: string;
  created_at: string;
};

function UserNotification() {
  const [notifications, setNotifications] = useState<Notification[] | null>(
    null
  );

  useEffect(() => {
    async function fetchNotifications() {
      const data = await fetchNotificationData();
      setNotifications(data);
    }

    fetchNotifications();
  }, []);

  console.log(notifications);

  return null;
}

export { UserNotification };
