"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { StatsCard } from "./StatsCard";
import { DataModal } from "./DataModal";
import { Users, Shield, FolderKanban } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalAdmins: number;
  totalTopics: number;
}

export function DashboardStats({ refreshTrigger }: { refreshTrigger?: number }) {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalAdmins: 0,
    totalTopics: 0,
  });
  const [loading, setLoading] = useState(true);

  // For modal data
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/admin/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshTrigger]);


  // useEffect(()=>{
  //   console.log(modalData);
  // },[modalData])

  // Fetch all users
  const fetchAllUsers = async () => {
    setModalOpen(true);
    setModalTitle("All Users");
    setModalLoading(true);
    try {
      const res = await axios.get("/api/admin/users");
      setModalData(res.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setModalLoading(false);
    }
  };

  // Fetch all admins
  const fetchAdmins = async () => {
    setModalOpen(true);
    setModalTitle("Admin Users");
    setModalLoading(true);
    try {
      const res = await axios.get("/api/admin/admins");
      setModalData(res.data.admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setModalLoading(false);
    }
  };

  // Fetch all topics
  const fetchTopics = async () => {
    setModalOpen(true);
    setModalTitle("Quiz Topics");
    setModalLoading(true);
    try {
      const res = await axios.get("/api/topics");
      setModalData(res.data.topics);
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3 grid-cols-1">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="text-blue-500" size={22} />}
          loading={loading}
          onView={fetchAllUsers}
        />
        <StatsCard
          title="Total Admin Users"
          value={stats.totalAdmins}
          icon={<Shield className="text-green-500" size={22} />}
          loading={loading}
          onView={fetchAdmins}
        />
        <StatsCard
          title="Total Topics"
          value={stats.totalTopics}
          icon={<FolderKanban className="text-orange-500" size={22} />}
          loading={loading}
          onView={fetchTopics}
        />
      </div>

      {/* Universal modal for showing all data */}
      <DataModal
        title={modalTitle}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={modalData}
        loading={modalLoading}
      />
    </>
  );
}
